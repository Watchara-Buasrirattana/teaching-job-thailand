import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

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

        // 4. บันทึกลง Database
        const newNews = await prisma.news.create({
            data: {
                headlineTh,
                headlineEn,
                bodyTh,
                bodyEn,
                featuredImage: featuredImagePath,
                galleryImages: galleryPaths, // บันทึกเป็น JSON array
                status: status || 'Draft'
            }
        });

        return NextResponse.json({ success: true, data: newNews }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Error saving news" }, { status: 500 });
    }
}