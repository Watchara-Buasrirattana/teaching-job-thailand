import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
    locales: ['en', 'th'],
    defaultLocale: 'en'
});

function isValidToken(token: string | undefined): boolean {
    if (!token) return false;
    const id = parseInt(token, 10);
    return !isNaN(id) && id > 0 && Number.isInteger(id);
}

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith('/admin')) {
        const adminToken = request.cookies.get('admin_token')?.value;
        const isAuthenticated = isValidToken(adminToken);

        // ถ้ายังไม่ได้ login และพยายามเข้าหน้าอื่นที่ไม่ใช่ /admin/login
        if (pathname !== '/admin/login' && !isAuthenticated) {
            const loginUrl = new URL('/admin/login', request.url);
            // เก็บ path ที่ต้องการเข้า เพื่อ redirect กลับหลัง login สำเร็จ
            loginUrl.searchParams.set('callbackUrl', pathname);
            return NextResponse.redirect(loginUrl);
        }

        // ถ้า login แล้วแต่พยายามเข้าหน้า login อีก → ส่งไปหน้า dashboard
        if (pathname === '/admin/login' && isAuthenticated) {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }

        return NextResponse.next();
    }

    return intlMiddleware(request);
}

export const config = {
    matcher: [
        '/',
        '/(th|en)/:path*',
        '/admin/:path*'
    ]
};