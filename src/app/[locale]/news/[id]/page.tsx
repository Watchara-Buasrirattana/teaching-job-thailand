import Image from "next/image";
import { Link } from "@/i18n/routing";
import Breadcrumb from "@/components/Breadcrumb";
import { useTranslations } from "next-intl";

export default function NewsDetail({ params }: { params: { id: string, locale: string } }) {
    const t = useTranslations('Navbar');
    const t2 = useTranslations('News');
    // ในอนาคตใช้ params.id ไปดึงข้อมูลจาก API หรือไฟล์ JSON
    const news = {
        title: "PKP ร่วมจัดกิจกรรม \"English Camp 2026\" มุ่งทักษะภาษาอังกฤษ สร้างความกล้าแสดงออกให้เยาวชน",
        date: "03/03/2569",
        content: `โรงเรียนเมืองสุวรรณภูมิได้จัดโครงการค่ายทักษะภาษาอังกฤษ หรือ "English Camp 2026" เพื่อส่งเสริมการเรียนรู้นอกห้องเรียน... (เนื้อหาเต็มของคุณ)`,
        mainImage: "/news-main.jpg",
        gallery: ["/news-1.jpg", "/news-2.jpg", "/news-3.jpg", "/news-4.jpg"]
    };


    return (
        <main className="min-h-screen bg-white pb-20 font-prompt">
            {/* 1. Breadcrumb (หน้าแรก > ข่าว > ชื่อข่าว) */}
            <div className="container mx-auto max-w-6xl px-4 py-6 text-sm flex gap-2 items-center">
                <Breadcrumb
                    paths={[
                        { label: t('home'), href: "/" },
                        { label: t('news'), href: "/news" },
                        { label: news.title } // หน้าปัจจุบัน
                    ]}
                />
            </div>

            <div className="container mx-auto px-4 max-w-6xl">
                {/* 2. หัวข้อข่าวและวันที่ */}
                <div className="mb-8">
                    <div className="flex gap-4 items-start">
                        <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight">
                            {news.title}
                        </h1>
                    </div>
                    <p className="text-gray-400 text-sm mt-4">{t2('posted')} {news.date}</p>
                </div>

                {/* 3. รูปภาพหลัก (ใช้ relative + aspect-video) */}
                <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg mb-10">
                    {/* <Image
                        src={news.mainImage}
                        alt={news.title}
                        fill
                        className="object-cover"
                        priority
                    /> */}
                </div>

                {/* 4. เนื้อหาข่าว */}
                <article className="text-gray-700 leading-relaxed text-lg mb-16 whitespace-pre-line">
                    {news.content}
                </article>

                {/* 5. Gallery รูปประกอบด้านล่าง */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {news.gallery.map((img, index) => (
                        <div key={index} className="relative aspect-video rounded-lg overflow-hidden shadow-md group">
                            {/* <Image
                                src={img}
                                alt={`Gallery ${index}`}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                            /> */}
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}