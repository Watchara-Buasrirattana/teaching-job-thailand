// src/app/api/admin/news/route.ts
import { logAdminAction } from '@/lib/logger';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
// ตัด import uploadFile, uploadGalleryFiles ออก — ไม่ใช้แล้ว

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

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const {
            headlineTh,
            headlineEn,
            bodyTh,
            bodyEn,
            status,
            featuredImage,   // URL string หรือ null (upload ที่ client เสร็จแล้ว)
            galleryImages,   // string[] (upload ที่ client เสร็จแล้ว)
        } = body;

        const featuredImagePath = featuredImage || "";
        const galleryPaths = Array.isArray(galleryImages) ? galleryImages : [];

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

        const newNews = await prisma.news.create({
            data: {
                headlineTh,
                headlineEn,
                slug: uniqueSlug,
                bodyTh,
                bodyEn,
                featuredImage: featuredImagePath,
                galleryImages: galleryPaths,
                status: status || 'Draft'
            }
        });

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