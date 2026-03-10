import { Prompt } from "next/font/google";
import "../globals.css"; // เช็ค path ให้ถูก (ถ้ายูใน [locale] ต้องถอย 2 ชั้น)
import Navbar from "@/components/Navbar";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

const prompt = Prompt({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin", "thai"],
  variable: "--font-prompt",
});

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // 1. ดึงค่า locale จาก URL
  const { locale } = await params;

  // 2. ถ้าภาษาไม่อยู่ในรายการที่กำหนด ให้ขึ้น 404
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // 3. โหลดคำแปลจากไฟล์ JSON
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${prompt.variable} antialiased font-prompt`}>
        {/* 4. ต้องครอบด้วย Provider เพื่อให้ Navbar และหน้าเพจใช้ useTranslations ได้ */}
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main>
            {children}
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}