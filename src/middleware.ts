import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
    // รายชื่อภาษาที่รองรับทั้งหมด
    locales: ['en', 'th'],

    // ภาษาเริ่มต้นถ้าผู้ใช้เข้าหน้าเว็บแบบไม่มีรหัสภาษา
    defaultLocale: 'en'
});

export const config = {
    // ตั้งค่าให้ Middleware ทำงานเฉพาะหน้าเว็บต่างๆ
    // โดยข้ามไฟล์ระบบ (เช่น favicon, รูปภาพใน public, _next)
    matcher: ['/', '/(th|en)/:path*']
};