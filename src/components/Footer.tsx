import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { FaFacebook, FaFacebookMessenger } from "react-icons/fa";

export default function Footer() {
    const t = useTranslations("Footer");

    return (
        <footer className="bg-primary text-white py-12 max-lg:py-8 font-prompt">
            {/* ✅ Main Container: เปลี่ยนจากแถว (Row) เป็นคอลัมน์ (Column) เมื่อจอเล็ก */}
            <div className="flex justify-between items-start mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 max-lg:flex-col max-lg:items-center max-lg:gap-10">

                {/* --- กลุ่มฝั่งซ้าย (Logo + ข้อความ 1) --- */}
                {/* ✅ Mobile: จับโลโก้กับข้อความเรียงซ้อนกันแนวตั้ง และจัดกึ่งกลาง */}
                <div className="flex gap-8 items-center max-lg:flex-col max-lg:text-center max-lg:gap-6">
                    {/* Logo */}
                    <Link href="/" className="shrink-0">
                        <Image 
                            src="/w-logo.png" 
                            alt="Logo" 
                            width={130} 
                            height={113} 
                            priority 
                            className="max-lg:w-[200px] h-auto object-contain" 
                        />
                    </Link>

                    {/* ข้อความชุดที่ 1 (ติดต่อเรา) */}
                    <div className="flex flex-col max-lg:items-center">
                        <h3 className="font-bold text-xl text-accent pb-2">{t('contact')}</h3>
                        <p className="text-lg max-xl:text-sm leading-relaxed">บริษัท พีแอนด์เค โพรเกรซซิฟ อิงลิช จำกัด</p>
                        <p className="text-lg max-xl:text-sm leading-relaxed">P&K PROGRESSIVE ENGLISH COMPANY LIMITED</p>
                        <p className="text-sm mt-4 max-xl:text-[10px]">
                            © 2026 P&K PROGRESSIVE ENGLISH COMPANY LIMITED. All rights reserved.
                        </p>
                    </div>
                </div>

                {/* --- กลุ่มฝั่งขวา (ข้อความ 2 + Social Icons) --- */}
                {/* ✅ Mobile: เปลี่ยนจากชิดขวา (items-end, text-right) เป็นกึ่งกลาง (items-center, text-center) */}
                <div className="flex flex-col items-end text-right max-lg:items-center max-lg:text-center">
                    <p className="text-lg max-xl:text-sm leading-relaxed">{t('address1')}</p>
                    <p className="text-lg max-xl:text-sm leading-relaxed">{t('address2')}</p>
                    <p className="text-lg max-xl:text-sm leading-relaxed">{t('address3')}</p>
                    <p className="text-lg max-xl:text-sm leading-relaxed">{t('address4')}</p>

                    {/* Social Icons */}
                    <div className="flex gap-4 mt-6">
                        {/* ✅ ใส่ Link ครอบ Icon ไว้ เพื่อให้กดไปที่เพจ/แชทได้ และเพิ่ม Effect Hover */}
                        <Link href="#" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform active:scale-95">
                            <FaFacebookMessenger className="w-8 h-8 text-accent"></FaFacebookMessenger>
                        </Link>
                        <Link href="#" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform active:scale-95">
                            <FaFacebook className="w-8 h-8 text-accent"></FaFacebook>
                        </Link>
                    </div>
                </div>

            </div>
        </footer>
    )
}