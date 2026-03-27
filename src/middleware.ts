import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 1. ตั้งค่า next-intl middleware
const intlMiddleware = createMiddleware({
    locales: ['en', 'th'],
    defaultLocale: 'en'
});

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // --- ส่วนที่ 1: จัดการหน้า ADMIN ---
    if (pathname.startsWith('/admin')) {
        const adminToken = request.cookies.get('admin_token');

        // ถ้าพยายามเข้าหน้าอื่นที่ไม่ใช่ /admin/login และยังไม่ได้ Login
        if (pathname !== '/admin/login' && !adminToken) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
        
        // ถ้าเป็นทางฝั่ง /admin เราจะไม่ใช้ intlMiddleware (เพราะเราอยากให้ URL สั้น)
        return NextResponse.next();
    }

    // --- ส่วนที่ 2: จัดการหน้าบ้าน (User) ด้วย next-intl ---
    return intlMiddleware(request);
}

export const config = {
    // ปรับ Matcher ให้ครอบคลุมทั้งภาษา และโฟลเดอร์ admin
    matcher: [
        // Match next-intl (ภาษา)
        '/', 
        '/(th|en)/:path*',
        
        // Match admin
        '/admin/:path*'
    ]
};