// src/app/api/track/route.ts
// เรียกจาก frontend ทุกครั้งที่ user เข้าหน้าใดก็ตาม
// ไม่นับหน้า /admin เพื่อไม่ให้ admin เองเบิ้ล traffic

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const path = body.path as string;

        // ไม่นับหน้า admin
        if (!path || path.startsWith('/admin')) {
            return NextResponse.json({ success: true });
        }

        await prisma.pageView.create({
            data: { path }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        // ไม่ส่ง error กลับ เพื่อไม่ให้กระทบ user experience
        console.error('[POST /api/track]', error);
        return NextResponse.json({ success: true });
    }
}