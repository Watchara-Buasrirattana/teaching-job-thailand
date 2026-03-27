import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    // สั่งลบ Cookie อย่างเด็ดขาดจากฝั่ง Server
    (await cookies()).delete('admin_token');

    return NextResponse.json({ success: true, message: "Logged out successfully" });
}