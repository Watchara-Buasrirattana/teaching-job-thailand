import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { logAdminAction } from '@/lib/logger'; // เช็ค path ให้ตรงกับที่เก็บ function log ของคุณ

// [GET] ดึงข้อมูลรีวิวทั้งหมด
export async function GET() {
    try {
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token')?.value;
        if (!adminToken) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

        const reviews = await prisma.review.findMany({
            include: {
                teacher: {
                    select: { fName: true, lName: true, image: true }
                }
            },
            orderBy: { createdAt: 'desc' },
        });
        
        return NextResponse.json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
    }
}

// [POST] สร้างรีวิวใหม่
export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token')?.value;
        if (!adminToken) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        const { teacherId, title, content, rating, status } = body;

        const newReview = await prisma.review.create({
            data: {
                teacherId,
                title,
                content,
                rating: Number(rating),
                status: Boolean(status),
            },
            include: { teacher: true }
        });

        // เก็บ Log
        await logAdminAction({
            adminId: parseInt(adminToken),
            action: "CREATE",
            entity: "Review",
            entityId: newReview.id.toString(),
            details: `เพิ่มรีวิวใหม่: ${title} (ของครู: ${newReview.teacher?.fName} ${newReview.teacher?.lName})`
        });

        return NextResponse.json(newReview, { status: 201 });
    } catch (error) {
        console.error("Error creating review:", error);
        return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
    }
}