import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { admin } from '@/db/schema';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm/sql/expressions/conditions';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();
        const [adminUser] = await db.select().from(admin).where(eq(admin.username, username)).limit(1);

        if (!adminUser || adminUser.password !== password) {
            return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
        }

        // สร้าง Response
        const response = NextResponse.json({ success: true });

        // ฝาก Cookie ชื่อ 'admin_token' ไว้ (ในระบบจริงควรใช้ JWT ที่เข้ารหัส)
        // การตั้ง httpOnly: true จะทำให้ JavaScript ฝั่ง Client แอบอ่านค่านี้ไม่ได้ (ปลอดภัยจาก Hacker)
        (await cookies()).set('admin_token', adminUser.id.toString(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
        });

        return response;
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}