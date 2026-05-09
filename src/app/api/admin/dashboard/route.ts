// src/app/api/admin/dashboard/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token')?.value;
        if (!adminToken) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        // 1. Stats เดิม
        const totalNews = await prisma.news.count();
        const draftNews = await prisma.news.count({ where: { status: 'Draft' } });
        const totalApplicants = await prisma.applicationForm.count();
        const newApplicants = await prisma.applicationForm.count({ where: { status: 'New' } });
        const totalTeachers = await prisma.teacher.count();
        const processingTeachers = await prisma.teacher.count({ where: { status: 'Processing' } });

        const recentTeachers = await prisma.teacher.findMany({
            take: 5,
            orderBy: { updatedAt: 'desc' },
            select: {
                id: true, title: true, fName: true, lName: true,
                schoolProject: true, visaExpiryDate: true, phone: true, status: true
            }
        });

        // 2. Traffic — total views ทั้งหมด
        const totalViews = await prisma.pageView.count();

        // 3. Active users — คนที่เข้าชมใน 5 นาทีล่าสุด (นับจำนวน records)
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const activeUsers = await prisma.pageView.count({
            where: { createdAt: { gte: fiveMinutesAgo } }
        });

        // 4. Chart data — ยอดเข้าชมย้อนหลัง 7 วัน แยกตามวัน
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const viewsRaw = await prisma.pageView.findMany({
            where: { createdAt: { gte: sevenDaysAgo } },
            select: { createdAt: true }
        });

        // Group by date
        const viewsByDay: Record<string, number> = {};
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            const key = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); // "7 Jan"
            viewsByDay[key] = 0;
        }
        for (const view of viewsRaw) {
            const key = new Date(view.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
            if (key in viewsByDay) viewsByDay[key]++;
        }
        const chartData = Object.entries(viewsByDay).map(([name, views]) => ({ name, views }));

        return NextResponse.json({
            success: true,
            stats: {
                news: { total: totalNews, drafts: draftNews },
                applicants: { total: totalApplicants, unread: newApplicants },
                teachers: { total: totalTeachers, processing: processingTeachers },
                traffic: { totalViews, activeUsers }
            },
            chartData,
            recentTeachers
        });

    } catch (error) {
        console.error('Dashboard API Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch dashboard data' }, { status: 500 });
    }
}