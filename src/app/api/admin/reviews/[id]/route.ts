import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { logAdminAction } from '@/lib/logger'; 

// [PUT] อัปเดตข้อมูลรีวิว
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token')?.value;
        if (!adminToken) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

        // 🚨 ต้อง await params ก่อนดึง id
        const resolvedParams = await params;
        const reviewId = parseInt(resolvedParams.id);
        
        if (isNaN(reviewId)) {
            return NextResponse.json({ error: "Invalid review ID format" }, { status: 400 });
        }

        const body = await request.json();
        const { teacherId, title, content, rating, status } = body;

        const updatedReview = await prisma.review.update({
            where: { id: reviewId },
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
            action: "UPDATE",
            entity: "Review",
            entityId: updatedReview.id.toString(),
            details: `แก้ไขรีวิว: ${updatedReview.title} (ของครู: ${updatedReview.teacher?.fName} ${updatedReview.teacher?.lName})`
        });

        return NextResponse.json(updatedReview);
    } catch (error) {
        console.error("Error updating review:", error);
        return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
    }
}

// [DELETE] ลบข้อมูลรีวิว
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token')?.value;
        if (!adminToken) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

        // 🚨 ต้อง await params ก่อนดึง id (จุดนี้ที่ทำให้ของเดิมลบไม่ได้)
        const resolvedParams = await params;
        const reviewId = parseInt(resolvedParams.id);

        if (isNaN(reviewId)) {
            return NextResponse.json({ error: "Invalid review ID format" }, { status: 400 });
        }

        // 1. ค้นหารีวิวก่อนเพื่อเอาข้อมูลไปเก็บ Log ว่าลบของใครไป
        const review = await prisma.review.findUnique({ 
            where: { id: reviewId },
            include: { teacher: true }
        });
        
        if (!review) return NextResponse.json({ success: false, message: "Not found" });

        // 2. ลบข้อมูล
        await prisma.review.delete({
            where: { id: reviewId }
        });

        // 3. เก็บ Log
        await logAdminAction({
            adminId: parseInt(adminToken),
            action: "DELETE",
            entity: "Review",
            entityId: reviewId.toString(),
            details: `ลบรีวิว: ${review.title} (ของครู: ${review.teacher?.fName} ${review.teacher?.lName})`
        });

        return NextResponse.json({ success: true, message: "Review deleted successfully" });
    } catch (error) {
        console.error("Delete Error:", error);
        return NextResponse.json({ success: false, message: "Delete failed" }, { status: 500 });
    }
}