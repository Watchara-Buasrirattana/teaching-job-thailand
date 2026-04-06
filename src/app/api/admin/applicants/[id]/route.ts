import { NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import path from 'path';
import { logAdminAction } from '@/lib/logger';
import { cookies } from 'next/headers';
import { applicationForm } from '@/db/schema';
import { eq } from 'drizzle-orm/sql/expressions/conditions';
import { db } from '@/lib/db';

// --- อัปเดตสถานะ (UPDATE STATUS) ---
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json(); // รับค่า status ที่ส่งมาจากหน้าบ้าน

        // 👉 1. ดึงข้อมูลเดิมออกมาก่อน เพื่อเอาชื่อมาจด Log
        const [applicant] = await db
            .select()
            .from(applicationForm)
            .where(eq(applicationForm.id, id))
            .limit(1);

        if (!applicant) {
            return NextResponse.json({ success: false, message: "Applicant not found" }, { status: 404 });
        }

        // 👉 2. สั่งอัปเดตสถานะ
        await db.update(applicationForm)
            .set({ status: body.status })
            .where(eq(applicationForm.id, id));

        // 📝 3. จด Log การทำงานโดยใช้ชื่อจากตัวแปร applicant ที่ดึงมา
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token')?.value;
        if (adminToken) {
            await logAdminAction({
                adminId: parseInt(adminToken),
                action: "UPDATE",
                entity: "Applicant",
                entityId: id,
                details: `เปลี่ยนสถานะเป็น '${body.status}': ${applicant.firstName} ${applicant.lastName}` // 👈 ใช้ applicant.firstName
            });
        }

        // ส่งข้อมูลที่อัปเดตแล้วกลับไปให้หน้าบ้าน
        return NextResponse.json({ success: true, data: { ...applicant, status: body.status } });

    } catch (error) {
        console.error("Update Status Error:", error);
        return NextResponse.json({ success: false, message: "Update failed" }, { status: 500 });
    }
}

// --- ลบข้อมูล (DELETE) ---
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const [applicant] = await db.select().from(applicationForm).where(eq(applicationForm.id, id)).limit(1);

        if (!applicant) return NextResponse.json({ success: false, message: "Not found" });

        // ลบข้อมูลออกจากฐานข้อมูล
        await db.delete(applicationForm).where(eq(applicationForm.id, id));

        // ลบไฟล์ PDF ออกจากโฟลเดอร์ uploads (เพื่อประหยัดพื้นที่เซิร์ฟเวอร์)
        const deleteFile = async (p: string) => {
            try { await unlink(path.join(process.cwd(), "public", p)); } catch (e) { }
        };
        if (applicant.resumeUrl) await deleteFile(applicant.resumeUrl);
        if (applicant.coverLetter) await deleteFile(applicant.coverLetter);

        // 📝 จด Log การทำงาน
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token')?.value;
        if (adminToken) {
            await logAdminAction({
                adminId: parseInt(adminToken),
                action: "DELETE",
                entity: "Applicant",
                entityId: id,
                details: `ลบผู้สมัคร: ${applicant.firstName} ${applicant.lastName}`
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete Error:", error);
        return NextResponse.json({ success: false, message: "Delete failed" }, { status: 500 });
    }
}