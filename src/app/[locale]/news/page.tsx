import NewsCard from "@/components/NewsCard";
import Pagination from "@/components/Pagination";
import Breadcrumb from "@/components/Breadcrumb";
import { useTranslations } from "next-intl";

// ✅ รับ searchParams เพื่ออ่านค่าหน้าจาก URL (เช่น ?page=2)
export default function NewsPage({
    searchParams
}: {
    searchParams: { page?: string }
}) {
    const t = useTranslations("News");
    const t2 = useTranslations("Navbar");

    // 1. ตั้งค่าการแบ่งหน้า
    const itemsPerPage = 8; // แสดง 8 ข่าวต่อหน้า
    const currentPage = Number(searchParams.page) || 1;

    // 2. ข้อมูลสมมติ (รวมทั้งหมด)
    const allNews = [
        { id: "1", title: "ข่าวที่ 1", detail: "รายละเอียดข่าว...", date: "13/03/2569", img: "/pic1.png" },
        { id: "2", title: "ข่าวที่ 2", detail: "รายละเอียดข่าว...", date: "12/03/2569", img: "/pic2.png" },
        { id: "3", title: "ข่าวที่ 3", detail: "รายละเอียดข่าว...", date: "11/03/2569", img: "/pic3.png" },
        { id: "4", title: "ข่าวที่ 4", detail: "รายละเอียดข่าว...", date: "10/03/2569", img: "/pic4.png" },
        { id: "1", title: "ข่าวที่ 1", detail: "รายละเอียดข่าว...", date: "13/03/2569", img: "/pic1.png" },
        { id: "2", title: "ข่าวที่ 2", detail: "รายละเอียดข่าว...", date: "12/03/2569", img: "/pic2.png" },
        { id: "3", title: "ข่าวที่ 3", detail: "รายละเอียดข่าว...", date: "11/03/2569", img: "/pic3.png" },
        { id: "4", title: "ข่าวที่ 4", detail: "รายละเอียดข่าว...", date: "10/03/2569", img: "/pic4.png" },
        // เพิ่มข้อมูลให้เยอะพอสำหรับการแบ่งหน้า...
    ];

    // 3. คำนวณหาจำนวนหน้าทั้งหมด
    const totalPages = Math.ceil(allNews.length / itemsPerPage);

    // 4. ตัดข้อมูลเพื่อแสดงเฉพาะหน้าปัจจุบัน
    const displayedNews = allNews.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <main className="min-h-screen bg-white pb-20">
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
                <div className="grid grid-cols-4 gap-6 max-md:grid-cols-1">
                    {allNews.map((item, index) => (
                        <NewsCard key={index} {...item} />
                    ))}
                </div>

                {/* Pagination ส่วนล่าง */}
                {totalPages > 1 && (
                    <div className="mt-4 flex justify-center">
                        <Pagination totalPages={totalPages} />
                    </div>
                )}
            </div>
        </main>
    );
}