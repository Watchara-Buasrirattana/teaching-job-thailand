import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import { logAdminAction } from '@/lib/logger';
import { cookies } from 'next/headers';

// --- อัปเดตข้อมูลครู (UPDATE) ---
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const formData = await request.formData();

        // เช็คว่าเป็นการอัปเดตเฉพาะสถานะเอกสาร หรืออัปเดตข้อมูลทั่วไป
        const isDocsUpdate = formData.get('isDocsUpdate') === 'true';

        let updatedData: any = {};

        if (isDocsUpdate) {
            // โหมดอัปเดตเอกสาร (Checklist)
            updatedData = {
                docReady: formData.get('docReady') === 'true',
                docSigned: formData.get('docSigned') === 'true',
                docSubmitted: formData.get('docSubmitted') === 'true',
                docCompleted: formData.get('docCompleted') === 'true',
                docNote: formData.get('docNote') as string || "",
                visaExpiryDate: formData.get('visaExpiryDate') ? new Date(formData.get('visaExpiryDate') as string) : null,
                workPermitExpiryDate: formData.get('workPermitExpiryDate') ? new Date(formData.get('workPermitExpiryDate') as string) : null,
            };
        } else {
            // โหมดอัปเดตข้อมูลทั่วไป
            const oldTeacher = await prisma.teacher.findUnique({ where: { id } });

            updatedData = {
                title: formData.get('title') as string,
                fName: formData.get('fName') as string,
                lName: formData.get('lName') as string,
                country: formData.get('country') as string,
                schoolProject: formData.get('schoolProject') as string,
                phone: formData.get('phone') as string,
                email: formData.get('email') as string,
                passportNumber: formData.get('passportNumber') as string,
                visaExpiryDate: formData.get('visaExpiryDate') ? new Date(formData.get('visaExpiryDate') as string) : null,
                workPermitNumber: formData.get('workPermitNumber') as string,
                workPermitExpiryDate: formData.get('workPermitExpiryDate') ? new Date(formData.get('workPermitExpiryDate') as string) : null,
                status: formData.get('status') as string,
            };

            // จัดการรูปภาพใหม่ (ถ้ามี)
            const imageFile = formData.get('image') as File;
            if (imageFile && imageFile.size > 0) {
                const uploadDir = path.join(process.cwd(), "public/uploads/teachers");
                await mkdir(uploadDir, { recursive: true });

                // ลบรูปเก่า
                if (oldTeacher?.image) {
                    try { await unlink(path.join(process.cwd(), "public", oldTeacher.image)); } catch (e) { }
                }

                const buffer = Buffer.from(await imageFile.arrayBuffer());
                const filename = `teacher_${Date.now()}_${imageFile.name.replaceAll(" ", "_")}`;
                await writeFile(path.join(uploadDir, filename), buffer);
                updatedData.image = `/uploads/teachers/${filename}`;
            }
        }

        const updatedTeacher = await prisma.teacher.update({
            where: { id },
            data: updatedData
        });

        // จด Log
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token')?.value;
        if (adminToken) {
            await logAdminAction({
                adminId: parseInt(adminToken),
                action: "UPDATE",
                entity: "Teacher",
                entityId: id,
                details: isDocsUpdate ? `อัปเดตสถานะเอกสารของ ${updatedTeacher.fName}` : `แก้ไขข้อมูลครู: ${updatedTeacher.fName}`
            });
        }

        return NextResponse.json({ success: true, data: updatedTeacher });
    } catch (error) {
        console.error("PUT Error:", error);
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
        const teacher = await prisma.teacher.findUnique({ where: { id } });
        if (!teacher) return NextResponse.json({ success: false, message: "Not found" });

        await prisma.teacher.delete({ where: { id } });

        if (teacher.image) {
            try { await unlink(path.join(process.cwd(), "public", teacher.image)); } catch (e) { }
        }

        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token')?.value;
        if (adminToken) {
            await logAdminAction({
                adminId: parseInt(adminToken),
                action: "DELETE",
                entity: "Teacher",
                entityId: id,
                details: `ลบข้อมูลครู: ${teacher.fName} ${teacher.lName}`
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Delete failed" }, { status: 500 });
    }
}