import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { logAdminAction } from '@/lib/logger';
import { cookies } from 'next/headers';
import { teacher } from '@/db/schema';
import { db } from '@/lib/db';
import { desc } from 'drizzle-orm';

// ดึงข้อมูลครูทั้งหมด (GET)
export async function GET() {
    try {
        const teachersList = await db.select().from(teacher).orderBy(desc(teacher.createdAt));
        return NextResponse.json({ success: true, data: teachersList });
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

        // 👈 1. สร้าง ID ด้วยตัวเอง (เพราะ Drizzle/MySQL ไม่คืนค่าแถวที่ Insert ออกมาให้ตรงๆ)
        const newId = crypto.randomUUID();

        // 👈 2. เปลี่ยนจาก prisma.teacher.create เป็น db.insert()
        await db.insert(teacher).values({
            id: newId,
            title, 
            fName, 
            lName, 
            country, 
            schoolProject, 
            phone, 
            email,
            passportNumber,
            visaExpiryDate: visaExpiryDate ? new Date(visaExpiryDate) : null,
            workPermitNumber,
            workPermitExpiryDate: workPermitExpiryDate ? new Date(workPermitExpiryDate) : null,
            status,
            image: imagePath
        });

        // จด Log
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token')?.value;
        if (adminToken) {
            await logAdminAction({
                adminId: parseInt(adminToken),
                action: "CREATE",
                entity: "Teacher",
                entityId: newId, // 👈 ใช้ newId
                details: `เพิ่มครูใหม่: ${fName} ${lName}`
            });
        }

        // 👈 3. สร้าง Object ข้อมูลครูที่เพิ่งเพิ่ม เพื่อส่งกลับไปให้หน้าบ้านรับรู้
        const newTeacherData = {
            id: newId,
            title, 
            fName, 
            lName, 
            country, 
            schoolProject, 
            phone, 
            email,
            passportNumber,
            visaExpiryDate: visaExpiryDate ? new Date(visaExpiryDate) : null,
            workPermitNumber,
            workPermitExpiryDate: workPermitExpiryDate ? new Date(workPermitExpiryDate) : null,
            status,
            image: imagePath
        };

        return NextResponse.json({ success: true, data: newTeacherData }, { status: 201 });
    } catch (error) {
        console.error("POST Error:", error);
        return NextResponse.json({ success: false, message: "Create failed" }, { status: 500 });
    }
}