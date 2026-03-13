import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { FaFacebook, FaFacebookMessenger } from "react-icons/fa";

export default function Footer() {
    const t = useTranslations("Footer");

    return (
        <footer className="bg-primary text-white py-8">
            <div className="flex justify-between items-start mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* --- กลุ่มฝั่งซ้าย (Logo + ข้อความ 1) --- */}
                <div className="flex gap-8 items-center">
                    {/* Logo */}
                    <Link href="/">
                        <Image src="/w-logo.png" alt="Logo" width={130} height={113} priority />
                    </Link>

                    {/* ข้อความชุดที่ 1 (ติดต่อเรา) */}
                    <div className="flex flex-col">
                        <h3 className="font-bold text-xl text-accent pb-2">{t('contact')}</h3>
                        <p className="text-lg">บริษัท พีแอนด์เค โพรเกรซซิฟ อิงลิช จำกัด</p>
                        <p className="text-lg">P&K PROGRESSIVE ENGLISH COMPANY LIMITED</p>
                        <p className="text-sm mt-2">© 2026 P&K PROGRESSIVE ENGLISH COMPANY LIMITED. All rights reserved.</p>
                    </div>
                </div>

                {/* --- กลุ่มฝั่งขวา (ข้อความ 2 + Social Icons) --- */}
                <div className="flex flex-col items-end text-right">
                    <p className="text-lg">{t('address1')}</p>
                    <p className="text-lg">{t('address2')}</p>
                    <p className="text-lg">{t('address3')}</p>

                    {/* Social Icons */}
                    <div className="flex gap-4 mt-2">
                        <FaFacebookMessenger className="w-8 h-8 text-accent rounded-full"></FaFacebookMessenger>
                        <FaFacebook className="w-8 h-8 text-accent rounded-full"></FaFacebook>
                    </div>
                </div>

            </div>
        </footer>
    )
}