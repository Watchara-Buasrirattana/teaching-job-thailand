// src/app/[locale]/news/[year]/[month]/[day]/[slug]/page.tsx
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumb";
import FadeUp from "@/components/FadeUp";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import prisma from "@/lib/prisma";

const BASE_URL = 'https://www.teachingjobthailand.com';

type Params = Promise<{ year: string; month: string; day: string; slug: string; locale: string }>;

// Dynamic metadata ตามเนื้อหาข่าวแต่ละชิ้น
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { slug, locale } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const newsItem = await prisma.news.findUnique({ where: { slug: decodedSlug } });

    if (!newsItem) return { title: 'News Not Found' };

    const isThai = locale === 'th';
    const title = isThai ? (newsItem.headlineTh || newsItem.headlineEn) : (newsItem.headlineEn || newsItem.headlineTh);
    const rawDesc = isThai ? newsItem.bodyTh : newsItem.bodyEn
    const cleanDesc = rawDesc?.replace(/<[^>]*>/g, '') ?? ''
    const description = cleanDesc.substring(0, 160)
    const image = newsItem.featuredImage || `${BASE_URL}/placeholder.webp`;

    const d = new Date(newsItem.createdAt);
    const urlPath = `/${locale}/news/${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}/${decodedSlug}`;

    return {
        title: title || 'News',
        description: description ? description.substring(0, 160) : '',
        openGraph: {
            title: title || 'News',
            description: description ? description.substring(0, 160) : '',
            url: `${BASE_URL}${urlPath}`,
            type: 'article',
            publishedTime: newsItem.createdAt.toISOString(),
            images: [{ url: image, width: 1200, height: 630, alt: title || 'News' }],
        },
        alternates: {
            canonical: `${BASE_URL}${urlPath}`,
            languages: {
                en: `${BASE_URL}/en/news/${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}/${decodedSlug}`,
                th: `${BASE_URL}/th/news/${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}/${decodedSlug}`,
            },
        },
    };
}

export default async function NewsDetail({ params }: { params: Params }) {
    const { slug, locale } = await params;
    const decodedSlug = decodeURIComponent(slug);

    const t = await getTranslations('Navbar');
    const t2 = await getTranslations('News');

    const newsItem = await prisma.news.findUnique({ where: { slug: decodedSlug } });
    if (!newsItem || newsItem.status !== 'Published') notFound();

    const isThai = locale === 'th';
    const title = isThai ? (newsItem.headlineTh || newsItem.headlineEn) : (newsItem.headlineEn || newsItem.headlineTh);
    const content = isThai ? (newsItem.bodyTh || newsItem.bodyEn) : (newsItem.bodyEn || newsItem.bodyTh);
    const date = new Date(newsItem.createdAt).toLocaleDateString(isThai ? 'th-TH' : 'en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    const mainImage = newsItem.featuredImage || "/placeholder.jpg";
    const gallery = (newsItem.galleryImages as string[]) || [];

    return (
        <main className="min-h-screen bg-white pb-20 font-prompt">
            <div className="container mx-auto max-w-6xl px-4 py-6 text-sm flex gap-2 items-center">
                <Breadcrumb paths={[
                    { label: t('home'), href: "/" },
                    { label: t('news'), href: "/news" },
                    { label: title || "News Detail" }
                ]} />
            </div>

            <div className="container mx-auto px-4 max-w-6xl">
                <FadeUp className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight">{title}</h1>
                    <p className="text-gray-400 text-sm mt-4">{t2('posted')} {date}</p>
                </FadeUp>

                {mainImage && (
                    <FadeUp delay={0.15} className="mb-10">
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg bg-gray-100">
                            <Image
                                src={mainImage}
                                alt={title || "News Image"}
                                fill
                                className="object-cover"
                                priority
                                sizes="(max-width: 1280px) 100vw, 1280px"
                            />
                        </div>
                    </FadeUp>
                )}

                <FadeUp delay={0.25}>
                    <article className="text-gray-700 leading-relaxed text-lg mb-16 whitespace-pre-line">
                        {content}
                    </article>
                </FadeUp>

                {gallery.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                        {gallery.map((img, index) => (
                            <FadeUp key={index} delay={index * 0.08}>
                                <div className="relative aspect-video rounded-lg overflow-hidden shadow-md group bg-gray-100">
                                    <Image
                                        src={img}
                                        alt={`${title} - รูปที่ ${index + 1}`}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                    />
                                </div>
                            </FadeUp>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}