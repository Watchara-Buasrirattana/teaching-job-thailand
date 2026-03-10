import { getRequestConfig } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export default getRequestConfig(async ({ requestLocale }) => {
    // รับค่า locale มา และรอให้มันทำงานเสร็จ (await)
    let locale = await requestLocale;

    // ตรวจสอบว่าถ้าไม่มีค่า locale หรือค่านั้นไม่อยู่ในภาษาที่เราตั้งไว้
    if (!locale || !routing.locales.includes(locale as any)) {
        locale = routing.defaultLocale;
    }

    return {
        locale: locale as string,
        messages: (await import(`../../messages/${locale}.json`)).default
    };
});