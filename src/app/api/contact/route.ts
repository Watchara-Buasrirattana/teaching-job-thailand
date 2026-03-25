// app/api/contact/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises'; // 👈 เพิ่ม mkdir ตรงนี้
import path from 'path';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        // 1. ดึงข้อมูลตัวอักษร
        const title = formData.get('title') as string;
        const firstName = formData.get('firstName') as string;
        const lastName = formData.get('lastName') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const message = formData.get('message') as string;

        // 2. จัดการไฟล์ Resume
        const resumeFile = formData.get('resume') as File;
        let resumePath = "";

        if (resumeFile) {
            // 👇 โค้ดส่วนที่เพิ่มมาใหม่: เช็คและสร้างโฟลเดอร์ uploads ถ้ายังไม่มี
            const uploadDir = path.join(process.cwd(), "public/uploads");
            await mkdir(uploadDir, { recursive: true });

            const buffer = Buffer.from(await resumeFile.arrayBuffer());
            const filename = Date.now() + "_" + resumeFile.name.replaceAll(" ", "_");
            await writeFile(path.join(uploadDir, filename), buffer);
            resumePath = "/uploads/" + filename;
        }

        // (ถ้ามี Cover Letter ด้วย ก็ใช้วิธีเดียวกันนี้ได้เลยครับ)

        // 3. บันทึกลง Database
        const newEntry = await prisma.applicationForm.create({
            data: {
                title: title || "",
                firstName,
                lastName,
                email,
                phone,
                resumeUrl: resumePath,
                message: message || "",
            }
        });

        return NextResponse.json({ success: true, data: newEntry }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Error saving contact" }, { status: 500 });
    }
}