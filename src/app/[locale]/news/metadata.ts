// src/app/[locale]/news/metadata.ts
// วางไว้เป็น reference — copy generateMetadata ไปใส่ในแต่ละ page.tsx

// ===== news/page.tsx =====
// เพิ่มฟังก์ชันนี้ก่อน export default function NewsPage

import type { Metadata } from 'next';

const BASE_URL = 'https://teachingjobthailand.com';

export async function generateMetadataNews({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const isThai = locale === 'th';
    return {
        title: isThai ? 'ข่าวสาร & ประชาสัมพันธ์' : 'News & Updates',
        description: isThai
            ? 'ติดตามข่าวสารและประชาสัมพันธ์ล่าสุดจาก Teaching Job Thailand'
            : 'Latest news and updates from Teaching Job Thailand',
        alternates: {
            canonical: `${BASE_URL}/${locale}/news`,
            languages: { en: `${BASE_URL}/en/news`, th: `${BASE_URL}/th/news` },
        },
    };
}

// ===== team/page.tsx =====
export async function generateMetadataTeam({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const isThai = locale === 'th';
    return {
        title: isThai ? 'ทีมงาน & พันธมิตร' : 'Team & Partners',
        description: isThai
            ? 'รู้จักทีมงานและโรงเรียนพันธมิตรของ Teaching Job Thailand'
            : 'Meet our team and partner schools across Thailand',
        alternates: {
            canonical: `${BASE_URL}/${locale}/team`,
            languages: { en: `${BASE_URL}/en/team`, th: `${BASE_URL}/th/team` },
        },
    };
}

// ===== contact/page.tsx =====
export async function generateMetadataContact({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const isThai = locale === 'th';
    return {
        title: isThai ? 'ร่วมงานกับเรา' : 'Join Us',
        description: isThai
            ? 'สมัครงานเป็นครูต่างชาติกับ Teaching Job Thailand ส่ง Resume ได้เลย'
            : 'Apply to become a foreign teacher with Teaching Job Thailand',
        alternates: {
            canonical: `${BASE_URL}/${locale}/contact`,
            languages: { en: `${BASE_URL}/en/contact`, th: `${BASE_URL}/th/contact` },
        },
    };
}