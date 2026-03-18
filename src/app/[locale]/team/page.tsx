// src/app/[locale]/team/page.tsx
import Breadcrumb from "@/components/Breadcrumb";
import TeacherCard from "@/components/TeacherCard";
import Pagination from "@/components/Pagination";
import ReviewCard from "@/components/ReviewCard";
import { useTranslations } from "next-intl";
import { use } from "react"; // ✅ 1. Import 'use' จาก React

export default function TeamPage({
    searchParams
}: {
    searchParams: Promise<{ page?: string }> // ✅ 2. เปลี่ยน Type เป็น Promise
}) {
    const t = useTranslations("Team");

    // ✅ 3. ใช้ use() เพื่อแกะค่าออกจาก Promise ก่อนนำไปใช้
    const resolvedSearchParams = use(searchParams);

    const executivesList = t.raw("executivesList");
    const coordinatorsList = t.raw("coordinatorsList");
    const schoolsList = t.raw("schoolsList");
    const honoredList = t.raw("honoredList");

    // --- ส่วนของระบบ Pagination ---
    const itemsPerPage = 5; // แสดงครู 5 คนต่อหน้า (2 แถวบน Desktop)
    const currentPage = Number(resolvedSearchParams.page) || 1; // ✅ เรียกใช้ผ่านตัวที่แกะกล่องแล้ว

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

                <h1 className="text-5xl font-bold text-primary text-center my-10 max-md:text-3xl max-md:my-5">
                    {t('title')}
                </h1>

                <p className="max-w-7xl mx-auto text-center mb-12 text-sm max-md:text-xs leading-relaxed">
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

                <section className="py-12 max-md:py-6">
                    <div className="container mx-auto max-w-7xl px-4">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <h2 className="text-5xl font-bold text-primary mb-6 max-md:text-3xl">
                                {t('review')}
                            </h2>
                            <p className="max-w-6xl mx-auto text-sm max-md:text-xs leading-relaxed">
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
                <div className="grid grid-cols-3 gap-10 pt-16 max-md:grid-cols-1 max-md:justify-items-center max-md:pt-8">
                    <section>
                        <h2 className="text-4xl font-bold text-primary mb-6 max-md:text-3xl">{t('executives')}</h2>
                        <ol className="list-decimal pl-5 space-y-2 max-md:text-xs">
                            {executivesList.map((name: string, idx: number) => (
                                <li key={idx}>{name}</li>
                            ))}
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-4xl font-bold text-primary mb-6 max-md:text-3xl">
                            {t('coordinators')}
                        </h2>
                        <ol className="list-decimal pl-5 space-y-2 max-md:text-xs">
                            {coordinatorsList.map((name: string, idx: number) => (
                                <li key={idx}>{name}</li>
                            ))}
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-4xl font-bold text-primary mb-6 max-md:text-3xl">
                            {t('legalAdvisor')}
                        </h2>
                        <p className="max-md:text-xs">
                            {t('legalAdvisorName')}
                        </p>
                    </section>
                </div>

                {/* 3. ส่วนพันธมิตร (Trusted by...) */}
                <section className="mt-16 pt-16 max-md:mt-8 max-md:pt-8">
                    <h2 className="text-4xl font-bold text-primary text-center mb-10 max-md:text-2xl">
                        {t('trusted')}
                    </h2>
                    <p className="text-center mb-10 max-md:text-xs">
                        {t('trustedDetail')}
                    </p>

                    {/* ✅ ใช้ <ul> กับ list-disc และ pl-5 */}
                    <ul className="list-disc pl-5 space-y-3 max-w-6xl mx-auto md:columns-2 gap-20 max-md:columns-1 max-md:text-xs">
                        {schoolsList.map((school: string, idx: number) => (
                            <li key={idx} className="break-inside-avoid">{school}</li>
                        ))}
                    </ul>

                    <p className="text-center m-10 max-md:text-xs max-md:m-8">
                        {t('honored')}
                    </p>
                    <ul className="list-disc pl-5 space-y-3 max-w-6xl mx-auto max-md:text-xs">
                        {honoredList.map((honored: string, idx: number) => (
                            <li key={idx} className="break-inside-avoid">
                                {honored}
                            </li>
                        ))}
                    </ul>
                </section>

                {/* แถบสรุปสีเหลืองด้านล่างสุด */}
                <div className="mt-20 bg-accent p-8 text-center rounded-sm shadow-sm max-md:p-4 max-md:mt-10">
                    <p className="text-primary font-bold max-md:text-[10px]">
                        {t('more')}
                    </p>
                </div>
            </div>
        </main>
    );
}