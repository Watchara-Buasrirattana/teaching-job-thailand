import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import NewsCard from "@/components/NewsCard";
import prisma from "@/lib/prisma";

export default async function News() {
    const t = await getTranslations("News");
    const locale = await getLocale();

    const dbNews = await prisma.news.findMany({
        where: { status: 'Published' },
        orderBy: { createdAt: 'desc' },
        take: 4,
    });

    const newsItems = dbNews.map((item) => {
        const title = locale === 'th' ? item.headlineTh : item.headlineEn;
        const detail = locale === 'th' ? item.bodyTh : item.bodyEn;

        return {
            id: item.id,
            slug: item.slug,
            createdAt: item.createdAt,
            title: title || "Untitled",
            detail: detail ? detail.substring(0, 100) + "..." : "",
            date: new Date(item.createdAt).toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
            }),
            img: item.featuredImage || "/placeholder.webp"
        };
    });

    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                {/* Section title fade up — ใช้ CSS animation แทนเพราะเป็น server component */}
                <h2 className="text-4xl font-bold text-primary text-center mb-12 font-prompt max-md:text-3xl animate-fade-up">
                    {t('title')}
                </h2>

                {newsItems.length === 0 ? (
                    <div className="text-center text-gray-400 py-10">
                        {locale === 'th' ? 'ยังไม่มีข่าวสารใหม่ในขณะนี้' : 'No recent news available.'}
                    </div>
                ) : (
                    <div className="grid grid-cols-4 gap-6 mb-12 max-md:grid-cols-1 max-md:gap-8">
                        {newsItems.map((news, index) => (
                            // ส่ง index เพื่อให้ NewsCard animate แบบ stagger
                            <NewsCard key={news.id} {...news} index={index} />
                        ))}
                    </div>
                )}

                <div className="flex justify-center">
                    <Link
                        href="/news"
                        className="bg-primary text-white px-12 py-3 rounded-full font-bold transition-all hover:cursor-pointer hover:scale-105 active:scale-95"
                    >
                        {t('more')}
                    </Link>
                </div>
            </div>
        </section>
    );
}