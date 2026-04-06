// src/app/api/admin/me/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm'; // 👈 1. แก้ Import ให้สั้นและถูกต้อง
import { admin } from '@/db/schema';

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
        // 👈 2. เปลี่ยนชื่อตัวแปรเป็น adminData และใส่ [ ] เพื่อดึง Object ตัวแรกออกจาก Array
        const [adminData] = await db
            .select({ username: admin.username, name: admin.name })
            .from(admin)
            .where(eq(admin.id, adminId))
            .limit(1);

        // 👈 3. เช็คจาก adminData แทน
        if (!adminData) {
            return NextResponse.json({ success: false, message: "Admin not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: adminData }); // 👈 ส่ง adminData กลับไป
    } catch (error) {
        console.error("Fetch Admin Error:", error);
        return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
    }
}