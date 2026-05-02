import NewsCard from "@/components/NewsCard";
import Pagination from "@/components/Pagination";
import Breadcrumb from "@/components/Breadcrumb";
import { getTranslations, getLocale } from "next-intl/server";
import prisma from "@/lib/prisma";

export default async function NewsPage({
    searchParams
}: {
    searchParams: Promise<{ page?: string }>
}) {
    // ใช้ next-intl/server เพื่อดึงภาษาปัจจุบัน (th หรือ en)
    const locale = await getLocale();
    const t = await getTranslations("News");
    const t2 = await getTranslations("Navbar");

    // 1. ตั้งค่าการแบ่งหน้า
    const itemsPerPage = 8;
    const { page } = await searchParams;
    const currentPage = Number(page) || 1;

    // 2. นับจำนวนข่าวทั้งหมดที่เป็น "Published" เพื่อทำ Pagination
    const totalNews = await prisma.news.count({
        where: { status: 'Published' }
    });
    const totalPages = Math.ceil(totalNews / itemsPerPage);

    // 3. ดึงข้อมูลจาก Database ตามหน้าปัจจุบัน
    const dbNews = await prisma.news.findMany({
        where: { status: 'Published' },
        orderBy: { createdAt: 'desc' }, // เรียงข่าวใหม่ล่าสุดขึ้นก่อน
        skip: (currentPage - 1) * itemsPerPage,
        take: itemsPerPage,
    });

    // 4. แปลงข้อมูลจาก DB ให้เข้ากับรูปแบบของ NewsCard และกรองตามภาษา
    const displayedNews = dbNews.map((item) => {

        const title = locale === 'th'
            ? (item.headlineTh || item.headlineEn)
            : (item.headlineEn || item.headlineTh);

        const detail = locale === 'th'
            ? (item.bodyTh || item.bodyEn)
            : (item.bodyEn || item.bodyTh);

        return {
            id: item.id.toString(),
            slug: item.slug,
            createdAt: item.createdAt,
            title: title || "Untitled",
            detail: detail ? detail.substring(0, 100) + "..." : "",
            date: new Date(item.createdAt).toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
            }),
            img: item.featuredImage || "/defaultImageContent.png" // ถ้ารูปไม่มีให้ใส่รูปสำรอง
        };
    });

    return (
        <main className="min-h-screen bg-white pb-20 font-prompt">
            {/* Breadcrumb & Title */}
            <div className="container mx-auto max-w-7xl px-4 pt-10">
                <Breadcrumb
                    paths={[
                        { label: t2('home'), href: "/" },
                        { label: t2('news') }
                    ]}
                />
                <h1 className="text-4xl font-bold text-primary text-center my-10 max-md:text-3xl">
                    {t('title')}
                </h1>
            </div>

            {/* News Grid */}
            <div className="container mx-auto max-w-7xl px-4">
                {displayedNews.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        {locale === 'th' ? 'ยังไม่มีข่าวสารในขณะนี้' : 'No news available.'}
                    </div>
                ) : (
                    <div className="grid grid-cols-4 gap-6 mb-16 max-md:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                        {displayedNews.map((item) => (
                            <NewsCard key={item.id} {...item} />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-4 flex justify-center">
                        <Pagination totalPages={totalPages} />
                    </div>
                )}
            </div>
        </main>
    );
}