import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        // ดึงข้อมูลผู้สมัครทั้งหมด เรียงจากใหม่ล่าสุดไปเก่า
        const applicants = await prisma.applicationForm.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ success: true, data: applicants });
    } catch (error) {
        console.error("GET Applicants Error:", error);
        return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
    }
}