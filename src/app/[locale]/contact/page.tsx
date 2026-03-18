'use client';
import { useState } from 'react';
import { Link } from '@/i18n/routing';
import Breadcrumb from '@/components/Breadcrumb';
import SuccessModal from '@/components/SuccessModal';
import { useTranslations } from 'next-intl';

export default function ContactPage() {
    const t = useTranslations("Navbar");
    const t2 = useTranslations("Contact");

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // ทำ Logic การส่งข้อมูลที่นี่
        setIsModalOpen(true); // เมื่อส่งสำเร็จให้เปิด Modal
    };

    return (
        <main className="bg-white pb-20 font-prompt">
            <div className="container mx-auto max-w-7xl px-4 pt-10">
                <Breadcrumb
                    paths={[
                        { label: t('home'), href: "/" },
                        { label: t('contact') }
                    ]}
                />

                <section className="text-center mt-10 mb-16">
                    <h1 className="text-5xl font-bold text-primary mb-6">{t2('title')}</h1>
                    <p className="max-w-5xl mx-auto text-sm md:text-base leading-relaxed whitespace-pre-line">
                        {t2('detail')}
                    </p>
                </section>

                <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
                    {/* แถวที่ 1: คำนำหน้า, ชื่อ, นามสกุล */}
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12 md:col-span-2">
                            <label className="block text-sm font-bold mb-2">{t2('titleName')}</label>
                            <select className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/20">
                                <option>เลือก</option>
                                <option>นาย</option>
                                <option>นางสาว</option>
                                <option>นาง</option>
                            </select>
                        </div>
                        <div className="col-span-12 md:col-span-5">
                            <label className="block text-sm font-bold mb-2">{t2('fName')}</label>
                            <input type="text" placeholder={t2('fName')} required className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                        <div className="col-span-12 md:col-span-5">
                            <label className="block text-sm font-bold mb-2">{t2('lName')}</label>
                            <input type="text" placeholder={t2('lName')} required className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                    </div>

                    {/* แถวที่ 2: อีเมล, เบอร์ติดต่อ */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold mb-2">{t2('email')}</label>
                            <input type="email" placeholder="you@company.com" required className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2">{t2('phone')}</label>
                            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                                <input type="text" placeholder="+66 (0) 00-000-0000" required className="w-full p-3 outline-none" />
                            </div>
                        </div>
                    </div>

                    {/* ส่วนอัปโหลดไฟล์ */}
                    {['Resume', 'Cover Letter'].map((label) => (
                        <div key={label}>
                            <label className="block text-sm font-bold mb-2">{label}</label>
                            <div className="flex gap-2">
                                <div className="flex-1 border border-gray-300 rounded-lg p-3 text-gray-400 text-sm flex items-center bg-white">
                                    {t2('upload')}
                                </div>
                                <button type="button" className="bg-gray-100 px-6 py-3 rounded-lg font-bold text-gray-600 hover:bg-gray-200 transition">
                                    {t2('uploadFile')}
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* ข้อความถึงเรา */}
                    <div>
                        <label className="block text-sm font-bold mb-2">{t2('message')}</label>
                        <textarea rows={4} placeholder={t2('messageInput')} className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/20"></textarea>
                    </div>

                    {/* Consent */}
                    <div className="flex items-center gap-2 text-sm">
                        <input type="checkbox" id="consent" className="w-4 h-4 rounded border-gray-300" />
                        <label htmlFor="consent" className="text-gray-700">{t2('agreement')}</label>
                    </div>

                    {/* ปุ่มส่งข้อมูล */}
                    <div className="flex justify-center pt-6">
                        <button type="submit" className="bg-primary text-white px-20 py-4 rounded-full text-xl font-bold shadow-lg hover:bg-blue-900 transition-all hover:scale-105 active:scale-95 w-full md:w-auto">
                            {t2('submit')}
                        </button>
                    </div>
                </form>
            </div>

            {/* Modal แจ้งเตือน */}
            <SuccessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </main>
    );
}