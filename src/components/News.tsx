"use client";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import NewsCard from "@/components/NewsCard"; // ✅ Import มาใช้ที่นี่

export default function News() {
    const t = useTranslations("News");

    const newsItems = [
        { id: "1", title: "PKP ร่วมจัดกิจกรรม “English Camp 2026”...", detail: "...", date: "22/02/2569", img: "/pic1.png" },
        { id: "2", title: "โรงเรียนในเครือข่าย จัดกิจกรรม...", detail: "...", date: "15/02/2569", img: "/pic2.png" },
        { id: "3", title: "อบรมครูต่างชาติมืออาชีพ...", detail: "...", date: "10/02/2569", img: "/pic3.png" },
        { id: "4", title: "กิจกรรมสานสัมพันธ์ครู...", detail: "...", date: "01/02/2569", img: "/pic4.png" },
    ];

    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-primary text-center mb-12 font-prompt max-md:text-3xl">
                    {t('title')}
                </h2>

                <div className="grid grid-cols-4 gap-6 mb-12 max-md:grid-cols-1 max-md:gap-8">
                    {newsItems.map((news) => (
                        <NewsCard key={news.id} {...news} />
                    ))}
                </div>

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