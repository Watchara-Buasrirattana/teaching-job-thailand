// src/app/api/admin/teachers/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { logAdminAction } from '@/lib/logger';
import { cookies } from 'next/headers';

// ดึงข้อมูลครูทั้งหมด (GET)
export async function GET() {
    try {
        const teachers = await prisma.teacher.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ success: true, data: teachers });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
    }
}

// เพิ่มข้อมูลครูใหม่ (POST)
export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        const title = formData.get('title') as string;
        const fName = formData.get('fName') as string;
        const lName = formData.get('lName') as string;
        const country = formData.get('country') as string;
        const schoolProject = formData.get('schoolProject') as string;
        const phone = formData.get('phone') as string;
        const email = formData.get('email') as string;
        const passportNumber = formData.get('passportNumber') as string;
        const visaExpiryDate = formData.get('visaExpiryDate') as string;
        const workPermitNumber = formData.get('workPermitNumber') as string;
        const workPermitExpiryDate = formData.get('workPermitExpiryDate') as string;
        const status = (formData.get('status') as string) || 'Active';

        // จัดการรูปภาพ
        const imageFile = formData.get('image') as File;
        let imagePath = null;

        if (imageFile && imageFile.size > 0) {
            const uploadDir = path.join(process.cwd(), "public/uploads/teachers");
            await mkdir(uploadDir, { recursive: true });
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const filename = `teacher_${Date.now()}_${imageFile.name.replaceAll(" ", "_")}`;
            await writeFile(path.join(uploadDir, filename), buffer);
            imagePath = `/uploads/teachers/${filename}`;
        }

        const newTeacher = await prisma.teacher.create({
            data: {
                title, fName, lName, country, schoolProject, phone, email,
                passportNumber,
                visaExpiryDate: visaExpiryDate ? new Date(visaExpiryDate) : null,
                workPermitNumber,
                workPermitExpiryDate: workPermitExpiryDate ? new Date(workPermitExpiryDate) : null,
                status,
                image: imagePath
            }
        });

        // จด Log
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token')?.value;
        if (adminToken) {
            await logAdminAction({
                adminId: parseInt(adminToken),
                action: "CREATE",
                entity: "Teacher",
                entityId: newTeacher.id,
                details: `เพิ่มครูใหม่: ${fName} ${lName}`
            });
        }

        return NextResponse.json({ success: true, data: newTeacher });
    } catch (error) {
        console.error("POST Error:", error);
        return NextResponse.json({ success: false, message: "Create failed" }, { status: 500 });
    }
}