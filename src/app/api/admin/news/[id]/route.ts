// src/app/api/admin/news/[id]/route.ts
import { NextResponse } from 'next/server';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import { logAdminAction } from '@/lib/logger';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { news } from '@/db/schema';
import { eq } from 'drizzle-orm';

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

        const [oldNews] = await db
            .select()
            .from(news)
            .where(eq(news.id, id))
            .limit(1);
        if (!oldNews) return NextResponse.json({ success: false, message: "News not found" }, { status: 404 });

        // ... โค้ดรับข้อมูล (headline, body, status) เหมือนเดิม ...
        const headlineTh = formData.get('headlineTh') as string;
        const headlineEn = formData.get('headlineEn') as string;
        const bodyTh = formData.get('bodyTh') as string;
        const bodyEn = formData.get('bodyEn') as string;
        const status = formData.get('status') as string;

        // ... โค้ดจัดการรูปปก (Featured Image) เหมือนเดิม ...
        const uploadDir = path.join(process.cwd(), "public/uploads/news");
        await mkdir(uploadDir, { recursive: true });

        let featuredImagePath = oldNews.featuredImage;
        const featuredFile = formData.get('featuredImage') as File;

        if (featuredFile && featuredFile.size > 0) {
            if (oldNews.featuredImage) {
                try { await unlink(path.join(process.cwd(), "public", oldNews.featuredImage)); } catch (e) { }
            }
            const buffer = Buffer.from(await featuredFile.arrayBuffer());
            const filename = `featured_${Date.now()}_${featuredFile.name.replaceAll(" ", "_")}`;
            await writeFile(path.join(uploadDir, filename), buffer);
            featuredImagePath = `/uploads/news/${filename}`;
        }

        // ... โค้ดจัดการแกลลอรี่ (Gallery) เหมือนเดิม ...
        const existingGalleryStr = formData.get('existingGallery') as string;
        let keptGallery: string[] = [];
        if (existingGalleryStr) keptGallery = JSON.parse(existingGalleryStr);

        const oldGallery = (oldNews.galleryImages as string[]) || [];
        const imagesToDelete = oldGallery.filter(img => !keptGallery.includes(img));
        for (const img of imagesToDelete) {
            try { await unlink(path.join(process.cwd(), "public", img)); } catch (e) { }
        }

        const newGalleryPaths: string[] = [];
        const galleryFiles = formData.getAll('galleryImages') as File[];

        for (let i = 0; i < galleryFiles.length; i++) {
            const file = galleryFiles[i];
            if (file && file.size > 0) {
                const buffer = Buffer.from(await file.arrayBuffer());
                const filename = `gallery_${Date.now()}_${i}_${file.name.replaceAll(" ", "_")}`;
                await writeFile(path.join(uploadDir, filename), buffer);
                newGalleryPaths.push(`/uploads/news/${filename}`);
            }
        }

        const finalGallery = [...keptGallery, ...newGalleryPaths];

        // บันทึกลง Database
        await db.update(news)
            .set({ 
                headlineTh, 
                headlineEn, 
                bodyTh, 
                bodyEn, 
                status, 
                featuredImage: featuredImagePath,
                galleryImages: finalGallery 
            })
            .where(eq(news.id, id));

        await logAdminAction({
            adminId: parseInt(adminToken),
            action: "UPDATE",
            entity: "News",
            entityId : id,
            details: `แก้ไขข่าว: ${headlineTh}`
        });

        const updatedNewsData = {
            id,
            headlineTh, 
            headlineEn, 
            bodyTh, 
            bodyEn, 
            status, 
            featuredImage: featuredImagePath,
            galleryImages: finalGallery
        };

        return NextResponse.json({ success: true, data: updatedNewsData });
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

        const [existingNews] = await db
            .select()
            .from(news)
            .where(eq(news.id, id))
            .limit(1);
        if (!existingNews) return NextResponse.json({ success: false, message: "Not found" });

        await db.delete(news).where(eq(news.id, id));

        const deleteFile = async (p: string) => {
            try { await unlink(path.join(process.cwd(), "public", p)); } catch (e) { }
        };

        if (existingNews.featuredImage) await deleteFile(existingNews.featuredImage);
        const gallery = (existingNews.galleryImages as string[]) || [];
        for (const img of gallery) await deleteFile(img);

        await logAdminAction({
            adminId: parseInt(adminToken),
            action: "DELETE",
            entity: "News",
            entityId: id,
            details: `ลบข่าว: ${existingNews.headlineTh || existingNews.headlineEn}`
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete Error:", error);
        return NextResponse.json({ success: false, message: "Delete failed" }, { status: 500 });
    }
}