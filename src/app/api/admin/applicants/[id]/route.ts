import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { unlink } from 'fs/promises';
import path from 'path';
import { logAdminAction } from '@/lib/logger';
import { cookies } from 'next/headers';

// --- อัปเดตสถานะ (UPDATE STATUS) ---
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json(); // รับค่า status ที่ส่งมาจากหน้าบ้าน

        const updatedApplicant = await prisma.applicationForm.update({
            where: { id },
            data: { status: body.status }
        });

        // 📝 จด Log การทำงาน
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token')?.value;
        if (adminToken) {
            await logAdminAction({
                adminId: parseInt(adminToken),
                action: "UPDATE",
                entity: "Applicant",
                entityId: id,
                details: `เปลี่ยนสถานะเป็น '${body.status}': ${updatedApplicant.firstName} ${updatedApplicant.lastName}`
            });
        }

        return NextResponse.json({ success: true, data: updatedApplicant });
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
        const applicant = await prisma.applicationForm.findUnique({ where: { id } });

        if (!applicant) return NextResponse.json({ success: false, message: "Not found" });

        // ลบข้อมูลออกจากฐานข้อมูล
        await prisma.applicationForm.delete({ where: { id } });

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