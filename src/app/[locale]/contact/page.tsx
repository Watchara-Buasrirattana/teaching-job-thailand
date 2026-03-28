'use client';
import { useState, useRef } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import SuccessModal from '@/components/SuccessModal';
import { useTranslations } from 'next-intl';

export default function ContactPage() {
    const t = useTranslations("Navbar");
    const t2 = useTranslations("Contact");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // เพิ่มสถานะ Loading
    const [agreement, setAgreement] = useState(false); // ไว้เช็คการติ๊กถูก

    // สร้าง Ref สำหรับไฟล์ (เอาไว้สั่งให้คลิกปุ่มแล้วไปเปิดหน้าเลือกไฟล์)
    const resumeRef = useRef<HTMLInputElement>(null);
    const coverLetterRef = useRef<HTMLInputElement>(null);
    const [resumeName, setResumeName] = useState("");
    const [coverLetterName, setCoverLetterName] = useState("");

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const newErrors: { [key: string]: string } = {};
        if (!resumeName) {
            newErrors.resume = t2('errorResume');
        }
        if (!agreement) {
            newErrors.agreement = t2('errorAgreement');
        }
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            setIsSubmitting(false);
            return;
        }


        // 1. 👉 ดึง form เก็บไว้ในตัวแปรก่อนเลย (ก่อนที่จะไปทำ await)
        const form = e.currentTarget;

        try {
            const formData = new FormData(form); // ใช้ตัวแปร form แทน e.currentTarget

            const res = await fetch('/api/contact', {
                method: 'POST',
                body: formData,
            });

            const result = await res.json();

            if (result.success) {
                setIsModalOpen(true);

                // 2. 👉 สั่งล้างข้อมูลโดยใช้ตัวแปร form
                form.reset();

                setResumeName("");
                setCoverLetterName("");
                setAgreement(false); // แถม: เคลียร์ติ๊กถูกให้ด้วยครับ
            } else {
                alert("เกิดข้อผิดพลาด: " + result.message);
            }
        } catch (error) {
            alert("เกิดข้อผิดพลาดในการส่งข้อมูล: " + (error as Error).message);
        } finally {
            setIsSubmitting(false);
        }
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
                            <label className="block text-sm font-bold mb-2">{t2('titleName')}<span className="text-red-500"> * </span></label>
                            {/* เพิ่ม name="..." เพื่อให้ FormData ดึงข้อมูลได้ */}
                            <select name="title" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/20" required>
                                <option value="">{t2('select')}</option>
                                <option value="Mr.">{t2('mr')}</option>
                                <option value="Ms.">{t2('miss')}</option>
                                <option value="Mrs.">{t2('mrs')}</option>
                            </select>
                        </div>
                        <div className="col-span-12 md:col-span-5">
                            <label className="block text-sm font-bold mb-2">{t2('fName')}<span className="text-red-500"> * </span></label>
                            <input name="firstName" type="text" placeholder={t2('fName')} required className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                        <div className="col-span-12 md:col-span-5">
                            <label className="block text-sm font-bold mb-2">{t2('lName')}<span className="text-red-500"> * </span></label>
                            <input name="lastName" type="text" placeholder={t2('lName')} required className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                    </div>

                    {/* แถวที่ 2: อีเมล, เบอร์ติดต่อ */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold mb-2">{t2('email')}<span className="text-red-500"> * </span></label>
                            <input name="email" type="email" placeholder="you@company.com" required className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2">{t2('phone')}<span className="text-red-500"> * </span></label>
                            <input name="phone" type="text" placeholder="+66 (0) 00-000-0000" required className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                    </div>

                    {/* ส่วนอัปโหลดไฟล์ Resume */}
                    <div>
                        <label className="block text-sm font-bold mb-2">Resume (PDF)<span className="text-red-500"> * </span></label>
                        <input
                            type="file"
                            name="resume"
                            ref={resumeRef}
                            accept=".pdf"
                            className="hidden"
                            onChange={(e) => {
                                setResumeName(e.target.files?.[0]?.name || "");
                                if (e.target.files?.[0]) setErrors(prev => ({ ...prev, resume: "" })); // ล้าง error เมื่อเลือกไฟล์
                            }}
                        />
                        <div className={`flex gap-2 ${errors.resume ? 'ring-2 ring-red-500 rounded-lg' : ''}`}>
                            <div className="flex-1 border border-gray-300 rounded-lg p-3 text-gray-500 text-sm flex items-center bg-gray-50">
                                {resumeName || <span className="text-gray-400">{t2('upload')}</span>}
                            </div>
                            <button
                                type="button"
                                onClick={() => resumeRef.current?.click()}
                                className="bg-gray-100 px-6 py-3 rounded-lg font-bold text-gray-600 hover:bg-gray-200 transition"
                            >
                                {t2('uploadFile')}
                            </button>
                        </div>
                        {errors.resume && <p className="text-red-500 text-xs mt-1">{errors.resume}</p>}
                    </div>

                    {/* ส่วนอัปโหลดไฟล์ Cover Letter */}
                    <div>
                        <label className="block text-sm font-bold mb-2">Cover Letter (PDF)</label>
                        <input
                            type="file"
                            name="coverLetter"
                            ref={coverLetterRef}
                            accept=".pdf"
                            className="hidden"
                            onChange={(e) => setCoverLetterName(e.target.files?.[0]?.name || "")}
                        />
                        <div className="flex gap-2">
                            <div className="flex-1 border border-gray-300 rounded-lg p-3 text-gray-500 text-sm flex items-center bg-gray-50">
                                {coverLetterName || <span className="text-gray-400">{t2('upload')}</span>}
                            </div>
                            <button
                                type="button"
                                onClick={() => coverLetterRef.current?.click()}
                                className="bg-gray-100 px-6 py-3 rounded-lg font-bold text-gray-600 hover:bg-gray-200 transition"
                            >
                                {t2('uploadFile')}
                            </button>
                        </div>
                    </div>

                    {/* ข้อความถึงเรา */}
                    <div>
                        <label className="block text-sm font-bold mb-2">{t2('message')}</label>
                        <textarea name="message" rows={4} placeholder={t2('messageInput')} className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/20"></textarea>
                    </div>

                    {/* Consent */}
                    <div className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            id="consent"
                            checked={agreement}
                            onChange={(e) => setAgreement(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-primary"
                        />
                        <label htmlFor="consent" className="text-gray-700 cursor-pointer">{t2('agreement')}</label>
                    </div>

                    {/* ปุ่มส่งข้อมูล */}
                    <div className="flex justify-center pt-6">
                        <div className={`relative group w-full md:w-auto ${(!agreement || isSubmitting) ? 'cursor-not-allowed' : ''}`}>

                            <button
                                type="submit"
                                disabled={!agreement || isSubmitting}
                                className="bg-primary text-white px-20 py-4 rounded-full text-xl font-bold hover:bg-blue-900 transition-all hover:scale-105 active:scale-95 w-full md:w-auto disabled:bg-gray-300 disabled:text-gray-500 disabled:pointer-events-none"
                            >
                                {isSubmitting ? t2('sending') : t2('submit')}
                            </button>

                            {(!agreement || isSubmitting) && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 hidden group-hover:block w-max bg-gray-800 text-white text-sm py-2 px-4 rounded-lg shadow-xl z-10">
                                    {!agreement ? t2('agreementRequired') : t2('sending')}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-800"></div>
                                </div>
                            )}
                        </div>
                    </div>

                </form>
            </div>

            <SuccessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </main>
    );
}