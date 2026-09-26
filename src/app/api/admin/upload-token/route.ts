// src/app/api/admin/upload-token/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { cookies } from 'next/headers';

const UPLOAD_API_SECRET = process.env.UPLOAD_API_SECRET!;
const TOKEN_TTL_SECONDS = 300; // 5 นาที

export async function POST(req: NextRequest) {
    // เช็ค admin login ก่อน (reuse logic เดิมที่ middleware ใช้)
    const adminToken = (await cookies()).get('admin_token')?.value;
    if (!adminToken) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { folder } = await req.json();
    if (!['news', 'teachers', 'applicants'].includes(folder)) {
        return NextResponse.json({ success: false, message: 'Invalid folder' }, { status: 400 });
    }

    const expiry = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;
    const payload = `${folder}:${expiry}`;
    const signature = crypto
        .createHmac('sha256', UPLOAD_API_SECRET)
        .update(payload)
        .digest('hex');

    return NextResponse.json({
        success: true,
        folder,
        expiry,
        signature,
    });
}