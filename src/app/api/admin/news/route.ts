import { logAdminAction } from '@/lib/logger';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { cookies } from 'next/headers';

// ดึงข้อมูลข่าวทั้งหมด
export async function GET() {
    try {
        const news = await prisma.news.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ success: true, data: news });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Error fetching news" }, { status: 500 });
    }
}

// สร้างข่าวใหม่พร้อมอัปโหลดรูป
export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        // 1. ดึงข้อมูลข้อความ
        const headlineTh = formData.get('headlineTh') as string;
        const headlineEn = formData.get('headlineEn') as string;
        const bodyTh = formData.get('bodyTh') as string;
        const bodyEn = formData.get('bodyEn') as string;
        const status = formData.get('status') as string;

        // เตรียมโฟลเดอร์สำหรับเก็บรูปข่าว
        const uploadDir = path.join(process.cwd(), "public/uploads/news");
        await mkdir(uploadDir, { recursive: true });

        // 2. จัดการรูปปก (Featured Image)
        let featuredImagePath = "";
        const featuredFile = formData.get('featuredImage') as File;
        if (featuredFile && featuredFile.size > 0) {
            const buffer = Buffer.from(await featuredFile.arrayBuffer());
            const filename = `featured_${Date.now()}_${featuredFile.name.replaceAll(" ", "_")}`;
            await writeFile(path.join(uploadDir, filename), buffer);
            featuredImagePath = `/uploads/news/${filename}`;
        }

        // 3. จัดการรูปแกลลอรี่ (ดึงไฟล์ทั้งหมดที่ส่งมาด้วยชื่อ 'galleryImages')
        const galleryPaths: string[] = [];
        const galleryFiles = formData.getAll('galleryImages') as File[];
        for (let i = 0; i < galleryFiles.length; i++) {
            const file = galleryFiles[i];
            if (file && file.size > 0) {
                const buffer = Buffer.from(await file.arrayBuffer());
                const filename = `gallery_${Date.now()}_${i}_${file.name.replaceAll(" ", "_")}`;
                await writeFile(path.join(uploadDir, filename), buffer);
                galleryPaths.push(`/uploads/news/${filename}`);
            }
        }

        let baseSlug = "untitled";

        if (headlineEn) {
            // ถ้ามีชื่อภาษาอังกฤษ ให้แปลงชื่อภาษาอังกฤษเป็น URL
            baseSlug = headlineEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        } else if (headlineTh) {
            // ถ้าไม่มีภาษาอังกฤษ ให้ลองดึง "เฉพาะ" ตัวอักษรภาษาอังกฤษและตัวเลขจากชื่อไทย
            const engKeywords = headlineTh.match(/[a-zA-Z0-9]+/g);

            if (engKeywords && engKeywords.length > 0) {
                // ถ้าดึงคำภาษาอังกฤษได้ (เช่นเจอ PKP, English, Camp, 2026) เอามาต่อด้วย -
                baseSlug = engKeywords.join('-').toLowerCase();
            } else {
                // ถ้าไม่มีภาษาอังกฤษปนอยู่เลย ให้เอาชื่อภาษาไทยมาทำ URL (รองรับภาษาไทย ก-ฮ)
                // ลบตัวอักษรพิเศษออก เหลือแค่ ก-ฮ, ตัวเลข, และช่องว่าง แล้วเปลี่ยนช่องว่างเป็น -
                baseSlug = headlineTh.replace(/[^\w\sก-๙]/g, '').trim().replace(/\s+/g, '-');
            }
        }

        // ป้องกันกรณี Slug ซ้ำกันด้วยการสุ่มตัวเลขต่อท้าย
        const uniqueSlug = `${baseSlug}-${Math.floor(Math.random() * 1000)}`;

        // บันทึกลง Database
        const newNews = await prisma.news.create({
            data: {
                headlineTh,
                headlineEn,
                slug: uniqueSlug,
                bodyTh,
                bodyEn,
                featuredImage: featuredImagePath,
                galleryImages: galleryPaths, // บันทึกเป็น JSON array
                status: status || 'Draft'
            }
        });

        // จด Log การทำงาน
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token')?.value;
        if (adminToken) {
            await logAdminAction({
                adminId: parseInt(adminToken),
                action: "CREATE",
                entity: "News",
                entityId: newNews.id,
                details: `เพิ่มข่าวใหม่: ${headlineTh || headlineEn || "Untitled"}`
            });
        }

        return NextResponse.json({ success: true, data: newNews }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Error saving news" }, { status: 500 });
    }
}