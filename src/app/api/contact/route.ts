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

        // 2. Validate required fields ก่อน save
        if (!firstName || !lastName || !email || !phone) {
            return NextResponse.json(
                { success: false, message: "กรุณากรอกข้อมูลให้ครบถ้วน" },
                { status: 400 }
            );
        }

        // 3. จัดการไฟล์ — เช็ค size > 0 ด้วย เพราะ formData.get() คืน File object เสมอแม้ไม่ได้แนบไฟล์
        const resumeFile = formData.get('resume') as File;
        const coverLetterFile = formData.get('coverLetter') as File;

        // Resume บังคับแนบ
        if (!resumeFile || resumeFile.size === 0) {
            return NextResponse.json(
                { success: false, message: "กรุณาแนบไฟล์ Resume" },
                { status: 400 }
            );
        }
        let resumePath = "";
        let coverLetterPath = "";

        if (resumeFile && resumeFile.size > 0) {
            resumePath = await uploadFile(resumeFile, 'resume', 'applicants');
        }

        if (coverLetterFile && coverLetterFile.size > 0) {
            coverLetterPath = await uploadFile(coverLetterFile, 'coverLetter', 'applicants');
        }

        // 4. บันทึกลง Database
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
        console.error('[POST /api/contact]', error);
        return NextResponse.json({ success: false, message: "Error saving contact" }, { status: 500 });
    }
}