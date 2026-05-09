// src/app/[locale]/layout.tsx
import { Prompt } from "next/font/google";
import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import PageTracker from '@/components/PageTracker';

const prompt = Prompt({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ["latin", "thai"],
    variable: "--font-prompt",
});

const BASE_URL = 'https://teachingjobthailand.com';

// Metadata แยกตามภาษา
const metadataByLocale: Record<string, Metadata> = {
    en: {
        title: {
            default: 'Teaching Job Thailand | Foreign Teacher Recruitment',
            template: '%s | Teaching Job Thailand',
        },
        description: 'Teaching Job Thailand provides full-service foreign teacher recruitment, visa support, and curriculum development for schools across Thailand.',
        keywords: ['teaching job thailand', 'foreign teacher thailand', 'english teacher thailand', 'teach in thailand'],
        openGraph: {
            type: 'website',
            locale: 'en_US',
            url: BASE_URL,
            siteName: 'Teaching Job Thailand',
            title: 'Teaching Job Thailand | Foreign Teacher Recruitment',
            description: 'Full-service foreign teacher recruitment for schools in Thailand.',
            images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: 'Teaching Job Thailand' }],
        },
        twitter: {
            card: 'summary_large_image',
            title: 'Teaching Job Thailand',
            description: 'Full-service foreign teacher recruitment for schools in Thailand.',
            images: [`${BASE_URL}/og-image.jpg`],
        },
        alternates: {
            canonical: BASE_URL,
            languages: { 'en': `${BASE_URL}/en`, 'th': `${BASE_URL}/th` },
        },
        robots: { index: true, follow: true },
    },
    th: {
        title: {
            default: 'Teaching Job Thailand | บริการครูต่างชาติครบวงจร',
            template: '%s | Teaching Job Thailand',
        },
        description: 'Teaching Job Thailand ให้บริการจัดหาครูต่างชาติครบวงจร ดูแลวีซ่า ใบอนุญาต และพัฒนาหลักสูตรสำหรับโรงเรียนทั่วประเทศไทย',
        keywords: ['ครูต่างชาติ', 'จัดหาครูต่างชาติ', 'ครูภาษาอังกฤษ', 'teaching job thailand'],
        openGraph: {
            type: 'website',
            locale: 'th_TH',
            url: `${BASE_URL}/th`,
            siteName: 'Teaching Job Thailand',
            title: 'Teaching Job Thailand | บริการครูต่างชาติครบวงจร',
            description: 'บริการจัดหาครูต่างชาติครบวงจร ดูแลวีซ่าและใบอนุญาตทำงาน',
            images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: 'Teaching Job Thailand' }],
        },
        alternates: {
            canonical: `${BASE_URL}/th`,
            languages: { 'en': `${BASE_URL}/en`, 'th': `${BASE_URL}/th` },
        },
        robots: { index: true, follow: true },
    },
};

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    return metadataByLocale[locale] ?? metadataByLocale['en'];
}

export default async function RootLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    const messages = await getMessages();

    return (
        <html lang={locale}>
            <body className={`${prompt.variable} antialiased font-prompt`}>
                <NextIntlClientProvider messages={messages}>
                    <PageTracker />
                    <Navbar />
                    <main>{children}</main>
                    <Footer />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}