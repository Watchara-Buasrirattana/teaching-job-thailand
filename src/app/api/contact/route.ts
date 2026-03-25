// app/api/contact/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { writeFile } from 'fs/promises';
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
            const buffer = Buffer.from(await resumeFile.arrayBuffer());
            const filename = Date.now() + "_" + resumeFile.name.replaceAll(" ", "_");
            await writeFile(path.join(process.cwd(), "public/uploads/" + filename), buffer);
            resumePath = "/uploads/" + filename; // เก็บ path ไว้ลง DB
        }

        // 3. บันทึกลง Database
        const newEntry = await prisma.applicationForm.create({
            data: {
                title: title || "",
                firstName,
                lastName,
                email,
                phone,
                resumeUrl: resumePath, // บันทึกตำแหน่งไฟล์
                message: message || "",
            }
        });

        return NextResponse.json({ success: true, data: newEntry }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Error saving contact" }, { status: 500 });
    }
}