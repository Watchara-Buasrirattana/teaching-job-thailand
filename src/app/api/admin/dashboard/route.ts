// src/app/api/admin/dashboard/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        // (Optional) เช็คสิทธิ์ Admin
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token')?.value;
        if (!adminToken) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

        // 1. ข้อมูลข่าว (News)
        const totalNews = await prisma.news.count();
        const draftNews = await prisma.news.count({ where: { status: 'Draft' } });

        // 2. ข้อมูลผู้สมัคร (Applicants)
        const totalApplicants = await prisma.applicationForm.count();
        const newApplicants = await prisma.applicationForm.count({ where: { status: 'New' } }); // อิงตาม default ใน schema

        // 3. ข้อมูลครู (Teachers)
        const totalTeachers = await prisma.teacher.count();
        const processingTeachers = await prisma.teacher.count({ where: { status: 'Processing' } });

        // 4. ดึงรายชื่อครูสำหรับตารางด้านล่าง (เอามาแค่ 5 คนล่าสุด หรือคนที่สถานะ Urgent/Warning)
        const recentTeachers = await prisma.teacher.findMany({
            take: 5,
            orderBy: { updatedAt: 'desc' }, // เรียงจากอัปเดตล่าสุด
            select: {
                id: true,
                title: true,
                fName: true,
                lName: true,
                schoolProject: true,
                visaExpiryDate: true,
                phone: true,
                status: true
            }
        });

        return NextResponse.json({
            success: true,
            stats: {
                news: { total: totalNews, drafts: draftNews },
                applicants: { total: totalApplicants, unread: newApplicants },
                teachers: { total: totalTeachers, processing: processingTeachers }
            },
            recentTeachers
        });

    } catch (error) {
        console.error("Dashboard API Error:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch dashboard data" }, { status: 500 });
    }
}