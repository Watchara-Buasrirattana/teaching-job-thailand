// app/api/contact/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { uploadFile } from '@/lib/upload'

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
        const coverLetterFile = formData.get('coverLetter') as File;
        let resumePath = "";
        let coverLetterPath = "";


        if (resumeFile) {
            resumePath = await uploadFile(resumeFile, 'resume', 'applicants');
        }

        if (coverLetterFile) {
            coverLetterPath = await uploadFile(coverLetterFile, 'coverLetter', 'applicants');
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
                coverLetter: coverLetterPath,
                message: message || "",
            }
        });

        return NextResponse.json({ success: true, data: newEntry }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Error saving contact" }, { status: 500 });
    }
}