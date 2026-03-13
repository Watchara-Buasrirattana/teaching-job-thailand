'use client';
import { useState } from 'react';
import { Link } from '@/i18n/routing';
import Breadcrumb from '@/components/Breadcrumb';
import SuccessModal from '@/components/SuccessModal';

export default function ContactPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // ทำ Logic การส่งข้อมูลที่นี่
        setIsModalOpen(true); // เมื่อส่งสำเร็จให้เปิด Modal
    };

    return (
        <main className="min-h-screen bg-white pb-20 font-prompt">
            <div className="container mx-auto max-w-5xl px-4 pt-10">
                <Breadcrumb 
                    paths={[{ label: "หน้าแรก", href: "/" }, { label: "ร่วมงานกับเรา" }]} 
                />

                <section className="text-center mt-10 mb-16">
                    <h1 className="text-5xl font-bold text-primary mb-6">ร่วมงานกับเรา</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                        หากคุณรักในการสอนและอยากสัมผัสประสบการณ์ใหม่ๆ ในโรงเรียนในประเทศไทย
                        เราพร้อมเป็นพาร์ทเนอร์ที่ช่วยดูแลคุณ ทั้งการจัดหาโรงเรียนที่เหมาะสมและการดูแลอย่างใกล้ชิด
                    </p>
                </section>

                <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
                    {/* แถวที่ 1: คำนำหน้า, ชื่อ, นามสกุล */}
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12 md:col-span-2">
                            <label className="block text-sm font-bold mb-2">คำนำหน้า</label>
                            <select className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/20">
                                <option>เลือก</option>
                                <option>นาย</option>
                                <option>นางสาว</option>
                                <option>นาง</option>
                            </select>
                        </div>
                        <div className="col-span-12 md:col-span-5">
                            <label className="block text-sm font-bold mb-2">ชื่อ</label>
                            <input type="text" placeholder="ชื่อ" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                        <div className="col-span-12 md:col-span-5">
                            <label className="block text-sm font-bold mb-2">นามสกุล</label>
                            <input type="text" placeholder="นามสกุล" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                    </div>

                    {/* แถวที่ 2: อีเมล, เบอร์ติดต่อ */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold mb-2">อีเมล</label>
                            <input type="email" placeholder="you@company.com" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2">เบอร์ติดต่อ</label>
                            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                                <div className="bg-gray-50 px-3 flex items-center border-r">TH ▾</div>
                                <input type="text" placeholder="+66 (0) 00-000-0000" className="w-full p-3 outline-none" />
                            </div>
                        </div>
                    </div>

                    {/* ส่วนอัปโหลดไฟล์ */}
                    {['Resume', 'Cover Letter'].map((label) => (
                        <div key={label}>
                            <label className="block text-sm font-bold mb-2">{label}</label>
                            <div className="flex gap-2">
                                <div className="flex-1 border border-gray-300 rounded-lg p-3 text-gray-400 text-sm flex items-center bg-white">
                                    ลากไฟล์และวางที่นี่ หรือคลิกเพื่ออัปโหลดไฟล์ (.pdf)
                                </div>
                                <button type="button" className="bg-gray-100 px-6 py-3 rounded-lg font-bold text-gray-600 hover:bg-gray-200 transition">
                                    อัปโหลดไฟล์
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* ข้อความถึงเรา */}
                    <div>
                        <label className="block text-sm font-bold mb-2">ข้อความถึงเรา</label>
                        <textarea rows={4} placeholder="พิมพ์ข้อความหรือคำถามเพิ่มเติมที่นี่ (ถ้ามี)" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/20"></textarea>
                    </div>

                    {/* Consent */}
                    <div className="flex items-center gap-2 text-sm">
                        <input type="checkbox" id="consent" className="w-4 h-4 rounded border-gray-300" />
                        <label htmlFor="consent" className="text-gray-700">ฉันยอมรับนโยบายความเป็นส่วนตัว</label>
                    </div>

                    {/* ปุ่มส่งข้อมูล */}
                    <div className="flex justify-center pt-6">
                        <button type="submit" className="bg-[#0b0087] text-white px-20 py-4 rounded-full text-xl font-bold shadow-lg hover:bg-blue-900 transition-all hover:scale-105 active:scale-95 w-full md:w-auto">
                            ยืนยันการส่งข้อมูล
                        </button>
                    </div>
                </form>
            </div>

            {/* Modal แจ้งเตือน */}
            <SuccessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </main>
    );
}