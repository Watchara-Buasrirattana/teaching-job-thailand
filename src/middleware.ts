import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
    // รายชื่อภาษาที่รองรับทั้งหมด
    locales: ['en', 'th'],
    defaultLocale: 'en'
});

export const config = {
    // ตั้งค่าให้ Middleware ทำงานเฉพาะหน้าเว็บต่างๆ
    // โดยข้ามไฟล์ระบบ (เช่น favicon, รูปภาพใน public, _next)
    matcher: ['/', '/(th|en)/:path*']
};