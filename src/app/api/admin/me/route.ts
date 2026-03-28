import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        // 1. อ่าน ID แอดมินจาก Cookie
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token')?.value;

        if (!adminToken) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const adminId = parseInt(adminToken);

        // 2. ดึงข้อมูลจาก Database (เลือกมาแค่ชื่อ ไม่เอา Password เพื่อความปลอดภัย)
        const admin = await prisma.admin.findUnique({
            where: { id: adminId },
            select: {
                username: true,
                name: true
            }
        });

        if (!admin) {
            return NextResponse.json({ success: false, message: "Admin not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: admin });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
    }
}