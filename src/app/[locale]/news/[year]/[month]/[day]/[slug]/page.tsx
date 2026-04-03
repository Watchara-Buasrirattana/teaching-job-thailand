// src/app/[locale]/news/[year]/[month]/[day]/[slug]/page.tsx
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumb";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

// แก้ไข Type ของ params ให้เป็น Promise
export default async function NewsDetail({
    params
}: {
    params: Promise<{ year: string, month: string, day: string, slug: string, locale: string }>
}) {
    // ดึงค่า id และ locale ออกมาจาก params ด้วย await (สำคัญมากสำหรับ Next.js 15+)
    const { year, month, day, slug, locale } = await params;

    // ถอดรหัส URL ภาษาไทยให้กลับมาเป็นคำอ่านปกติ
    const decodedSlug = decodeURIComponent(slug);

    const t = await getTranslations('Navbar');
    const t2 = await getTranslations('News');

    // ดึงข้อมูลจาก Database ตาม ID และเช็คว่าเป็นตัวเลขหรือไม่
    const newsItem = await prisma.news.findUnique({
        where: {
            slug: decodedSlug
        }
    });

    // ถ้าหาข่าวไม่เจอ หรือข่าวนั้นยังไม่ Publish ให้แสดงหน้า 404
    if (!newsItem || newsItem.status !== 'Published') {
        notFound();
    }

    // จัดการแสดงผลตามภาษา (Locale)
    const isThai = locale === 'th';
    const title = isThai 
        ? (newsItem.headlineTh || newsItem.headlineEn) 
        : (newsItem.headlineEn || newsItem.headlineTh);
        
    const content = isThai 
        ? (newsItem.bodyTh || newsItem.bodyEn) 
        : (newsItem.bodyEn || newsItem.bodyTh);
    const date = new Date(newsItem.createdAt).toLocaleDateString(isThai ? 'th-TH' : 'en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    const mainImage = newsItem.featuredImage || "/placeholder.jpg";
    // แปลงข้อมูล JSON จาก DB ให้เป็น Array ของ String
    const gallery = (newsItem.galleryImages as string[]) || [];

    return (
        <main className="min-h-screen bg-white pb-20 font-prompt">
            <div className="container mx-auto max-w-6xl px-4 py-6 text-sm flex gap-2 items-center">
                <Breadcrumb
                    paths={[
                        { label: t('home'), href: "/" },
                        { label: t('news'), href: "/news" },
                        { label: title || "News Detail" }
                    ]}
                />
            </div>

            <div className="container mx-auto px-4 max-w-6xl">
                {/* หัวข้อข่าวและวันที่ */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight">
                        {title}
                    </h1>
                    <p className="text-gray-400 text-sm mt-4">{t2('posted')} {date}</p>
                </div>

                {/* รูปภาพหลัก */}
                {mainImage && (
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg mb-10 bg-gray-100">
                        <Image
                            src={mainImage}
                            alt={title || "News Image"}
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 1280px) 100vw, 1280px"
                        />
                    </div>
                )}

                {/* เนื้อหาข่าว */}
                <article className="text-gray-700 leading-relaxed text-lg mb-16 whitespace-pre-line">
                    {content}
                </article>

                {/* Gallery รูปประกอบด้านล่าง */}
                {gallery.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                        {gallery.map((img, index) => (
                            <div key={index} className="relative aspect-video rounded-lg overflow-hidden shadow-md group bg-gray-100">
                                <Image
                                    src={img}
                                    alt={`Gallery ${index + 1}`}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}