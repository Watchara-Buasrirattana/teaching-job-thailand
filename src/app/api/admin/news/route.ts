// src/app/api/admin/news/route.ts
import { logAdminAction } from '@/lib/logger';
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { cookies } from 'next/headers';
import { db } from '@/lib/db'; // 👈 นำเข้า db
import { news } from '@/db/schema'; // 👈 นำเข้า schema
import { desc } from 'drizzle-orm'; // 👈 นำเข้าฟังก์ชันจัดเรียง

// ดึงข้อมูลข่าวทั้งหมด
export async function GET() {
    try {
        // 👈 เปลี่ยนจาก prisma เป็น Drizzle
        const newsList = await db
            .select()
            .from(news)
            .orderBy(desc(news.createdAt));
            
        return NextResponse.json({ success: true, data: newsList });
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
            baseSlug = headlineEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        } else if (headlineTh) {
            const engKeywords = headlineTh.match(/[a-zA-Z0-9]+/g);
            if (engKeywords && engKeywords.length > 0) {
                baseSlug = engKeywords.join('-').toLowerCase();
            } else {
                baseSlug = headlineTh.replace(/[^\w\sก-๙]/g, '').trim().replace(/\s+/g, '-');
            }
        }

        const uniqueSlug = `${baseSlug}-${Math.floor(Math.random() * 1000)}`;

        // 👈 สร้าง ID ขึ้นมาเองก่อน เพื่อเอาไปบันทึกและเอาไปทำ Log
        const newId = crypto.randomUUID();

        // 👈 บันทึกลง Database ด้วย Drizzle
        await db.insert(news).values({
            id: newId,
            headlineTh,
            headlineEn,
            slug: uniqueSlug,
            bodyTh,
            bodyEn,
            featuredImage: featuredImagePath,
            galleryImages: galleryPaths, 
            status: status || 'Draft'
        });

        // จด Log การทำงาน
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token')?.value;
        if (adminToken) {
            await logAdminAction({
                adminId: parseInt(adminToken),
                action: "CREATE",
                entity: "News",
                entityId: newId, // 👈 ใช้ newId ที่สร้างไว้
                details: `เพิ่มข่าวใหม่: ${headlineTh || headlineEn || "Untitled"}`
            });
        }

        // 👈 สร้าง Object ส่งกลับไปให้หน้าบ้านรับรู้
        const newNewsData = {
            id: newId,
            headlineTh,
            headlineEn,
            slug: uniqueSlug,
            featuredImage: featuredImagePath,
            status: status || 'Draft'
        };

        return NextResponse.json({ success: true, data: newNewsData }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Error saving news" }, { status: 500 });
    }
}