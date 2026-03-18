"use client";
import { Link } from "@/i18n/routing";

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-3xl p-10 max-w-lg w-full text-center shadow-2xl animate-in zoom-in duration-300">
                {/* เครื่องหมายถูกสีเหลือง */}
                <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 rounded-full border-4 border-yellow-400 flex items-center justify-center">
                        <svg className="w-12 h-12 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                </div>

                <h2 className="text-4xl font-bold text-primary mb-4">ส่งข้อมูลเรียบร้อยแล้ว!</h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                    ส่งข้อมูลเรียบร้อยแล้ว ทีมงานได้รับเรซูเม่ของคุณแล้ว<br />
                    และจะติดต่อกลับโดยเร็วที่สุด
                </p>

                <Link
                    href="/"
                    className="inline-block bg-primary text-white px-10 py-3 rounded-full text-lg font-bold hover:bg-blue-900 transition-all"
                >
                    กลับสู่หน้าหลัก
                </Link>
            </div>
        </div>
    );
}