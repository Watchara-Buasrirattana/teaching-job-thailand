// src/app/sitemap.ts
// Next.js จะ generate /sitemap.xml ให้อัตโนมัติจากไฟล์นี้

import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

const BASE_URL = 'https://teachingjobthailand.com';
const locales = ['en', 'th'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // 1. Static pages — ทุก locale
    const staticPages = ['', '/news', '/team', '/contact'];
    const staticUrls = staticPages.flatMap(path =>
        locales.map(locale => ({
            url: `${BASE_URL}/${locale}${path}`,
            lastModified: new Date(),
            changeFrequency: path === '' ? 'weekly' as const : 'monthly' as const,
            priority: path === '' ? 1.0 : 0.8,
        }))
    );

    // 2. Dynamic news pages
    const newsItems = await prisma.news.findMany({
        where: { status: 'Published' },
        select: { slug: true, createdAt: true, updatedAt: true },
        orderBy: { createdAt: 'desc' },
    });

    const newsUrls = newsItems.flatMap(item => {
        const d = new Date(item.createdAt);
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        const day = d.getDate();

        return locales.map(locale => ({
            url: `${BASE_URL}/${locale}/news/${year}/${month}/${day}/${item.slug}`,
            lastModified: item.updatedAt,
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        }));
    });

    return [...staticUrls, ...newsUrls];
}