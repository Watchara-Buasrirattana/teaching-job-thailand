// src/app/[locale]/team/page.tsx
import Breadcrumb from "@/components/Breadcrumb";
import TeacherCard from "@/components/TeacherCard";
import Pagination from "@/components/Pagination";
import ReviewCard from "@/components/ReviewCard";
import ReviewCarousel from '@/components/Reviewcarousel';
import FadeUp from "@/components/FadeUp";
import { getTranslations } from "next-intl/server";
import prisma from "@/lib/prisma";

export default async function TeamPage({
    searchParams
}: {
    searchParams: Promise<{ page?: string }>
}) {
    const t = await getTranslations("Team");
    const resolvedSearchParams = await searchParams;

    const executivesList = t.raw("executivesList");
    const coordinatorsList = t.raw("coordinatorsList");
    const schoolsList = t.raw("schoolsList");
    const honoredList = t.raw("honoredList");

    const itemsPerPage = 4;
    const currentPage = Number(resolvedSearchParams.page) || 1;

    const totalTeachers = await prisma.teacher.count({ where: { status: 'Active' } });
    const totalPages = Math.ceil(totalTeachers / itemsPerPage);

    const displayedTeachers = await prisma.teacher.findMany({
        where: { status: 'Active' },
        orderBy: { createdAt: 'desc' },
        skip: (currentPage - 1) * itemsPerPage,
        take: itemsPerPage,
    });

    const dbReviews = await prisma.review.findMany({
        where: { status: true },
        include: {
            teacher: { select: { title: true, fName: true, lName: true, country: true, image: true } }
        },
        orderBy: { createdAt: 'desc' },
    });

    const reviews = dbReviews.map((r) => ({
        title: r.title,
        text: r.content,
        name: `${r.teacher.title || ''} ${r.teacher.fName} ${r.teacher.lName}`.trim(),
        country: r.teacher.country || 'ไม่ระบุประเทศ',
        image: r.teacher.image || '/teacher.webp',
        rating: r.rating
    }));

    return (
        <main className="bg-white pb-20 font-prompt">
            <div className="container mx-auto max-w-7xl px-4 py-10">
                <Breadcrumb paths={[{ label: "Home", href: "/" }, { label: "Team&Partners" }]} />

                {/* Title + detail fade up */}
                <FadeUp>
                    <h1 className="text-5xl font-bold text-primary text-center my-10 max-md:text-3xl max-md:my-5">
                        {t('title')}
                    </h1>
                </FadeUp>
                <FadeUp delay={0.1}>
                    <p className="max-w-7xl mx-auto text-center mb-12 text-sm max-md:text-xs leading-relaxed">
                        {t('detail', { count: totalTeachers })}
                    </p>
                </FadeUp>

                {/* Teacher cards — stagger ตาม index */}
                {displayedTeachers.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">{t('noDataTeacher')}</div>
                ) : (
                    <div className="grid grid-cols-4 gap-4 mb-10 max-md:grid-cols-2">
                        {displayedTeachers.map((teacher, index) => (
                            <TeacherCard
                                key={teacher.id}
                                img={teacher.image || '/placeholder-avatar.jpg'}
                                name={`${teacher.title || ''} ${teacher.fName} ${teacher.lName}`.trim()}
                                country={teacher.country || ''}
                                index={index}
                            />
                        ))}
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex justify-center mb-20 pt-10">
                        <Pagination totalPages={totalPages} />
                    </div>
                )}

                {/* Reviews — stagger ตาม index */}
                <section className="py-12 max-md:py-6">
                    <div className="container mx-auto max-w-7xl px-4">
                        <FadeUp>
                            <div className="text-center mb-12">
                                <h2 className="text-5xl font-bold text-primary mb-6 max-md:text-3xl">{t('review')}</h2>
                                <p className="max-w-6xl mx-auto text-sm max-md:text-xs leading-relaxed">{t('reviewdetail')}</p>
                            </div>
                        </FadeUp>

                        {reviews.length === 0 ? (
                            <div className="text-center py-10 text-gray-400 border border-dashed border-gray-200 rounded-xl">
                                ยังไม่มีรีวิวในขณะนี้
                            </div>
                        ) : (
                            <ReviewCarousel reviews={reviews} dragHint={t('dragHint')} />
                        )}
                    </div>
                </section>

                {/* Executives / Coordinators */}
                <div className="grid grid-cols-3 gap-10 pt-16 max-md:grid-cols-1 max-md:justify-items-center max-md:pt-8">
                    {[
                        { title: t('executives'), list: executivesList },
                        { title: t('coordinators'), list: coordinatorsList },
                    ].map((section, i) => (
                        <FadeUp key={i} delay={i * 0.15}>
                            <section>
                                <h2 className="text-4xl font-bold text-primary mb-6 max-md:text-3xl">{section.title}</h2>
                                <ol className="list-decimal pl-5 space-y-2 max-md:text-xs">
                                    {section.list.map((name: string, idx: number) => (
                                        <li key={idx}>{name}</li>
                                    ))}
                                </ol>
                            </section>
                        </FadeUp>
                    ))}
                    <FadeUp delay={0.3}>
                        <section>
                            <h2 className="text-4xl font-bold text-primary mb-6 max-md:text-3xl">{t('legalAdvisor')}</h2>
                            <p className="max-md:text-xs">{t('legalAdvisorName')}</p>
                        </section>
                    </FadeUp>
                </div>

                {/* Trusted by */}
                <FadeUp>
                    <section className="mt-16 pt-16 max-md:mt-8 max-md:pt-8">
                        <h2 className="text-4xl font-bold text-primary text-center mb-10 max-md:text-2xl">{t('trusted')}</h2>
                        <p className="text-center mb-10 max-md:text-xs">{t('trustedDetail')}</p>
                        <ul className="list-disc pl-5 space-y-3 max-w-6xl mx-auto md:columns-2 gap-20 max-md:columns-1 max-md:text-xs">
                            {schoolsList.map((school: string, idx: number) => (
                                <li key={idx} className="break-inside-avoid">{school}</li>
                            ))}
                        </ul>
                        <p className="text-center m-10 max-md:text-xs max-md:m-8">{t('honored')}</p>
                        <ul className="list-disc pl-5 space-y-3 max-w-6xl mx-auto max-md:text-xs">
                            {honoredList.map((honored: string, idx: number) => (
                                <li key={idx} className="break-inside-avoid">{honored}</li>
                            ))}
                        </ul>
                    </section>
                </FadeUp>

                {/* Bottom banner */}
                <FadeUp delay={0.1}>
                    <div className="mt-20 bg-accent p-8 text-center rounded-sm shadow-sm max-md:p-4 max-md:mt-10">
                        <p className="text-primary font-bold max-md:text-[10px]">{t('more')}</p>
                    </div>
                </FadeUp>
            </div>
        </main>
    );
}