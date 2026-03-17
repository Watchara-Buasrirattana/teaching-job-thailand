// src/app/[locale]/team/page.tsx
import Breadcrumb from "@/components/Breadcrumb";
import TeacherCard from "@/components/TeacherCard";
import Pagination from "@/components/Pagination";
import ReviewCard from "@/components/ReviewCard";
import { useTranslations } from "next-intl";

export default function TeamPage({
    searchParams
}: {
    searchParams: { page?: string }
}) {
    const t = useTranslations("Team");

    // --- ส่วนของระบบ Pagination ---
    const itemsPerPage = 5; // แสดงครู 10 คนต่อหน้า (2 แถวบน Desktop)
    const currentPage = Number(searchParams.page) || 1;

    // ข้อมูลสมมติ (ในอนาคตดึงจาก Database)
    const allTeachers = Array(7).fill({
        name: "Name - Surname",
        nationality: "Nationality"
    });

    const totalPages = Math.ceil(allTeachers.length / itemsPerPage);
    const displayedTeachers = allTeachers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const reviews = [
        {
            title: "มีความเป็นมืออาชีพและไม่ต้องกังวลเรื่องเอกสาร!",
            text: "การย้ายมาสอนที่ไทยดูเป็นเรื่องใหญ่ แต่ PKP ช่วยให้ขั้นตอนวีซ่าและใบอนุญาตทำงานราบรื่นอย่างไม่น่าเชื่อ...",
            name: "Jonathan Davies",
            country: "สหรัฐอเมริกา",
            image: "/teacher.png"
        },
        // ก๊อปปี้เพิ่มให้ครบ 6 อันตามรูป
    ];
    // ----------------------------

    return (
        <main className="bg-white pb-20 font-prompt">
            <div className="container mx-auto max-w-7xl px-4 py-10">
                <Breadcrumb
                    paths={[
                        { label: "Home", href: "/" },
                        { label: "Team&Partners" }
                    ]}
                />

                <h1 className="text-5xl font-bold text-primary text-center my-10 max-md:text-3xl">
                    {t('title')}
                </h1>

                <p className="max-w-7xl mx-auto text-center mb-12 text-sm md:text-base leading-relaxed">
                    {t('detail')}
                </p>

                {/* 1. ส่วนแสดงการ์ดครู (ที่มี Pagination) */}
                <div className="grid grid-cols-5 gap-4 mb-10 max-md:grid-cols-2">
                    {displayedTeachers.map((teacher, index) => (
                        <TeacherCard
                            key={index}
                            name={teacher.name}
                            nationality={teacher.nationality}
                        />
                    ))}
                </div>

                {/* ปุ่มควบคุมหน้า (แสดงเฉพาะเมื่อมีมากกว่า 1 หน้า) */}
                {totalPages > 1 && (
                    <div className="flex justify-center mb-20 pt-10">
                        <Pagination totalPages={totalPages} />
                    </div>
                )}
                
                <section className="py-12 bg-[#ECF0FF]">
                    <div className="container mx-auto max-w-7xl px-4">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <h2 className="text-5xl font-bold text-primary mb-6 max-md:text-3xl">
                                {t('review')}
                            </h2>
                            <p className="max-w-6xl mx-auto text-sm md:text-base leading-relaxed">
                                {t('reviewdetail')}
                            </p>
                        </div>

                        {/* Grid: Desktop 3 columns / Mobile 1 column */}
                        <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1">
                            {reviews.map((item, index) => (
                                <ReviewCard key={index} {...item} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* 2. ส่วนรายชื่อ Executives / Coordinators (ไม่ต้องทำ Pagination) */}
                <div className="grid grid-cols-3 gap-10 pt-16 max-md:grid-cols-1">
                    <section>
                        <h2 className="text-3xl font-bold text-primary mb-6">{t('executives')}</h2>
                        <ul className="space-y-2 text-gray-700">
                            <li>1. Mr. Damian Ketsemabom Akuli</li>
                            <li>2. Mrs. Parinda Akuli</li>
                        </ul>
                    </section>
                    <section>
                        <h2 className="text-3xl font-bold text-primary mb-6">{t('coordinators')}</h2>
                        <ul className="space-y-2 text-gray-700">
                            <li>1. Miss Ploypailin Patiyansupong</li>
                            <li>2. Mrs. Orathai Tatawatorn</li>
                            <li>3. Miss Netinart Paiboonworapisit</li>
                            <li>4. Miss Chanakarn Limtongnoi</li>
                        </ul>
                    </section>
                    <section>
                        <h2 className="text-3xl font-bold text-primary mb-6">{t('legalAdvisor')}</h2>
                        <p className="text-gray-700">Mr. Thawatchai Lakornthai</p>
                    </section>
                </div>

                {/* 3. ส่วนพันธมิตร (Trusted by...) */}
                <section className="mt-32 pt-16">
                    <h2 className="text-4xl font-bold text-primary text-center mb-10 max-md:text-2xl">
                        {t('trusted')}
                    </h2>
                    {/* ใช้ columns-2 เพื่อประหยัดพื้นที่บนจอใหญ่ */}
                    <div className="text-[13px] text-gray-600 space-y-3 max-w-6xl mx-auto md:columns-2 gap-20 max-md:columns-1">
                        <p>• Kaennakhon Witthayayon School (International Program), Khon Kaen</p>
                        <p>• Ban Phai School, Khon Kaen</p>
                        <p>• Nakhon Khon Kaen School, Khon Kaen</p>
                        <p>• Ubolratana Pittayakom School, Khon Kaen</p>
                        {/* ... รายชื่อโรงเรียนอื่นๆ ใส่ต่อได้เลยครับ ... */}
                    </div>
                </section>

                {/* แถบสรุปสีเหลืองด้านล่างสุด */}
                <div className="mt-20 bg-accent p-8 text-center rounded-sm shadow-sm">
                    <p className="text-primary font-bold max-md:text-sm">
                        {t('more')}
                    </p>
                </div>
            </div>
        </main>
    );
}