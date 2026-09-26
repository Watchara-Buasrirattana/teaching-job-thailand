// src/app/api/admin/news/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { deleteFile } from '@/lib/upload'
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

        if (!adminToken) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        const oldNews = await prisma.news.findUnique({ where: { id } });
        if (!oldNews) return NextResponse.json({ success: false, message: "News not found" }, { status: 404 });

        const {
            headlineTh,
            headlineEn,
            bodyTh,
            bodyEn,
            status,
            featuredImage,     // URL ใหม่ (ถ้าเปลี่ยนรูป) หรือ URL เดิม หรือ null/removeFeatured
            removeFeatured,
            galleryImages,     // string[] สุดท้าย (existing ที่เหลือ + ใหม่ที่ upload แล้ว)
        } = body;

        let featuredImagePath = oldNews.featuredImage;

        if (removeFeatured) {
            if (oldNews.featuredImage) await deleteFile(oldNews.featuredImage);
            featuredImagePath = "";
        } else if (featuredImage && featuredImage !== oldNews.featuredImage) {
            // รูปเปลี่ยน (URL ใหม่จาก client upload) → ลบรูปเก่าทิ้ง
            if (oldNews.featuredImage) await deleteFile(oldNews.featuredImage);
            featuredImagePath = featuredImage;
        }

        const oldGallery = (oldNews.galleryImages as string[]) || [];
        const finalGallery = Array.isArray(galleryImages) ? galleryImages : oldGallery;

        // ลบรูป gallery เก่าที่ไม่อยู่ใน finalGallery แล้ว
        const imagesToDelete = oldGallery.filter(img => !finalGallery.includes(img));
        for (const img of imagesToDelete) {
            await deleteFile(img);
        }

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
            details: `แก้ไขข่าว: ${updatedNews.headlineTh || updatedNews.headlineEn || "Untitled"}`
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