import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { desc } from 'drizzle-orm';
import { applicationForm } from '@/db/schema';

export async function GET() {
    try {
        // ดึงข้อมูลผู้สมัครทั้งหมด เรียงจากใหม่ล่าสุดไปเก่า
        const applicants = await db.select().from(applicationForm).orderBy(desc(applicationForm.createdAt));

        return NextResponse.json({ success: true, data: applicants });
    } catch (error) {
        console.error("GET Applicants Error:", error);
        return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
    }
}