import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import NewsCard from "@/components/NewsCard";
import prisma from "@/lib/prisma"; // 👉 Import Prisma เข้ามา

export default async function News() {
    // 1. ดึงฟังก์ชันแปลภาษาและภาษาปัจจุบันของหน้าเว็บ
    const t = await getTranslations("News");
    const locale = await getLocale();

    // 2. ดึงข่าวล่าสุดจาก Database 4 ข่าว (เฉพาะที่ Publish แล้ว)
    const dbNews = await prisma.news.findMany({
        where: { status: 'Published' },
        orderBy: { createdAt: 'desc' }, // เรียงจากใหม่ไปเก่า
        take: 4, // ดึงมาแสดงแค่ 4 ข่าวล่าสุด
    });

    // 3. แปลงข้อมูลให้เข้ากับ Props ของ NewsCard และรองรับ 2 ภาษา
    const newsItems = dbNews.map((item) => {
        const title = locale === 'th' ? item.headlineTh : item.headlineEn;
        const detail = locale === 'th' ? item.bodyTh : item.bodyEn;

        return {
            id: item.id, // ใช้ UUID string จาก DB
            title: title || "Untitled",
            detail: detail ? detail.substring(0, 100) + "..." : "", // ตัดข้อความให้สั้นลง
            date: new Date(item.createdAt).toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
            }),
            img: item.featuredImage || "/placeholder.jpg" // ถ้ารูปไม่มีให้ใส่รูปสำรอง
        };
    });

    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-primary text-center mb-12 font-prompt max-md:text-3xl">
                    {t('title')}
                </h2>

                {/* แสดงผลข่าว */}
                {newsItems.length === 0 ? (
                    <div className="text-center text-gray-400 py-10">
                        {locale === 'th' ? 'ยังไม่มีข่าวสารใหม่ในขณะนี้' : 'No recent news available.'}
                    </div>
                ) : (
                    <div className="grid grid-cols-4 gap-6 mb-12 max-md:grid-cols-1 max-md:gap-8">
                        {newsItems.map((news) => (
                            <NewsCard key={news.id} {...news} />
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