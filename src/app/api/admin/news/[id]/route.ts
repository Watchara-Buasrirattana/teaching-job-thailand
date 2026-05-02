import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { uploadFile, deleteFile } from '@/lib/upload'
import { logAdminAction } from '@/lib/logger';
import { cookies } from 'next/headers';

// --- UPDATE NEWS ---
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token')?.value;

        // ถ้าไม่มี Cookie แปลว่าไม่ได้ล็อกอิน ให้เตะออกเลย (ป้องกันคนนอกยิง API ลบข่าว)
        if (!adminToken) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        const formData = await request.formData();

        // ใช้ id ที่เป็น String ค้นหา
        const oldNews = await prisma.news.findUnique({ where: { id } });
        if (!oldNews) return NextResponse.json({ success: false, message: "News not found" }, { status: 404 });

        // ... โค้ดรับข้อมูล (headline, body, status) เหมือนเดิม ...
        const headlineTh = formData.get('headlineTh') as string;
        const headlineEn = formData.get('headlineEn') as string;
        const bodyTh = formData.get('bodyTh') as string;
        const bodyEn = formData.get('bodyEn') as string;
        const status = formData.get('status') as string;

        let featuredImagePath = oldNews.featuredImage;
        const featuredFile = formData.get('featuredImage') as File;

        if (featuredFile && featuredFile.size > 0) {
            if (oldNews.featuredImage) {
                await deleteFile(oldNews.featuredImage);
            }
            featuredImagePath = await uploadFile(featuredFile, 'featuredImage', 'news');
        }

        // ... โค้ดจัดการแกลลอรี่ (Gallery) เหมือนเดิม ...
        const existingGalleryStr = formData.get('existingGallery') as string;
        let keptGallery: string[] = [];
        if (existingGalleryStr) keptGallery = JSON.parse(existingGalleryStr);

        const oldGallery = (oldNews.galleryImages as string[]) || [];
        const imagesToDelete = oldGallery.filter(img => !keptGallery.includes(img));
        for (const img of imagesToDelete) {
            await deleteFile(img);
        }

        const newGalleryPaths: string[] = [];
        const galleryFiles = formData.getAll('galleryImages') as File[];

        for (let i = 0; i < galleryFiles.length; i++) {
            const file = galleryFiles[i];
            if (file && file.size > 0) {
                const url = await uploadFile(file, `gallery_${i}`, 'news');
                newGalleryPaths.push(url);
            }
        }

        const finalGallery = [...keptGallery, ...newGalleryPaths];

        // --- 3. บันทึกลง Database ---
        const updatedNews = await prisma.news.update({
            where: { id },
            data: {
                headlineTh, headlineEn, bodyTh, bodyEn, status,
                featuredImage: featuredImagePath,
                galleryImages: finalGallery
            }
        });

        await logAdminAction({
            adminId: parseInt(adminToken),
            action: "UPDATE",
            entity: "News",
            entityId: updatedNews.id,
            details: `แก้ไขข่าว: ${updatedNews.headlineTh}`
        });

        return NextResponse.json({ success: true, data: updatedNews });
    } catch (error) {
        console.error("PUT Error:", error);
        return NextResponse.json({ success: false, message: "Update failed" }, { status: 500 });
    }
}

// --- DELETE NEWS ---
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token')?.value;

        // ถ้าไม่มี Cookie แปลว่าไม่ได้ล็อกอิน ให้เตะออกเลย (ป้องกันคนนอกยิง API ลบข่าว)
        if (!adminToken) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        const { id } = await params;

        const news = await prisma.news.findUnique({ where: { id } }); // ค้นหาด้วย id (String)
        if (!news) return NextResponse.json({ success: false, message: "Not found" });

        await prisma.news.delete({ where: { id } }); // ลบด้วย id (String)

        if (news.featuredImage) await deleteFile(news.featuredImage);
        const gallery = (news.galleryImages as string[]) || [];
        for (const img of gallery) await deleteFile(img);

        await logAdminAction({
            adminId: parseInt(adminToken),
            action: "DELETE",
            entity: "News",
            entityId: id,
            details: `ลบข่าว: ${news.headlineTh || news.headlineEn}`
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete Error:", error);
        return NextResponse.json({ success: false, message: "Delete failed" }, { status: 500 });
    }
}