"use client";
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { useState } from 'react';

export default function Navbar() {
    const t = useTranslations('Navbar');
    const pathname = usePathname();
    const router = useRouter();
    const locale = useLocale();

    // ✅ State สำหรับควบคุมการเปิด/ปิดเมนูมือถือ
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleLanguage = () => {
        const nextLocale = locale === 'th' ? 'en' : 'th';
        router.replace(pathname, { locale: nextLocale, scroll: false });
        setIsMobileMenuOpen(false); // ปิดเมนูหลังจากเปลี่ยนภาษา
    };

    const getLinkClass = (path: string) => {
        const isActive = pathname === path;
        const baseClass = "text-xl transition font-medium max-2xl:text-base";
        if (isActive) {
            return `${baseClass} text-accent hover:text-accent/75`;
        }
        return `${baseClass} text-primary hover:text-primary/75`;
    };

    return (
        <header className="bg-background sticky top-0 z-50 shadow-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    
                    {/* Logo Section */}
                    <div className="flex items-center">
                        <Link className="text-primary font-black text-2xl" href="/">
                            <Image 
                                src={`/logo.png`} 
                                alt='Teaching Job Thailand Logo' 
                                width={130} 
                                height={113} 
                                priority 
                                className="w-auto h-12 md:h-16 object-contain" // ปรับขนาดโลโก้ให้พอดีกับ Header
                            />
                        </Link>
                    </div>

                    {/* ✅ Desktop Navigation (ซ่อนในมือถือด้วย max-lg:hidden) */}
                    <nav aria-label="Global" className="max-lg:hidden">
                        <ul className="flex items-center gap-12">
                            <li>
                                <Link className={getLinkClass('/')} href="/">
                                    {t('home')}
                                </Link>
                            </li>
                            <li>
                                <Link className={getLinkClass('/news')} href="/news">
                                    {t('news')}
                                </Link>
                            </li>
                            <li>
                                <Link className={getLinkClass('/team')} href="/team">
                                    {t('team')}
                                </Link>
                            </li>
                            <li>
                                <Link className="bg-primary text-white text-xl transition hover:bg-blue-900 py-2 px-8 rounded-full shadow-md hover:scale-105 active:scale-95 max-2xl:text-base" href="/contact">
                                    {t('contact')}
                                </Link>
                            </li>
                            <li>
                                <button onClick={toggleLanguage} className="bg-accent text-primary text-xl py-2 px-6 rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-md max-2xl:text-base">
                                    ไทย/EN
                                </button>
                            </li>
                        </ul>
                    </nav>

                    {/* ✅ Hamburger Button (โชว์เฉพาะในมือถือด้วย max-lg:block) */}
                    <div className="hidden max-lg:block">
                        <button 
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2 text-primary hover:text-blue-900 transition"
                            aria-label="Open Menu"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* ✅ Mobile Sidebar Overlay (ฉากหลังสีดำจางๆ) */}
            <div 
                className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* ✅ Mobile Sidebar Menu (เลื่อนมาจากด้านขวา) */}
            <div className={`fixed top-0 right-0 h-full w-72 bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"} flex flex-col font-prompt`}>
                
                {/* ปุ่มปิด (X) */}
                <div className="flex items-center justify-end p-6 border-b border-gray-100">
                    <button 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2 text-gray-400 hover:text-primary transition bg-gray-50 rounded-full"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                {/* เมนูรายการในมือถือ */}
                <nav className="flex flex-col p-6 gap-6 overflow-y-auto">
                    <Link className={getLinkClass('/')} href="/" onClick={() => setIsMobileMenuOpen(false)}>
                        {t('home')}
                    </Link>
                    <Link className={getLinkClass('/news')} href="/news" onClick={() => setIsMobileMenuOpen(false)}>
                        {t('news')}
                    </Link>
                    <Link className={getLinkClass('/team')} href="/team" onClick={() => setIsMobileMenuOpen(false)}>
                        {t('team')}
                    </Link>
                    
                    <div className="h-px bg-gray-100 my-2"></div> {/* เส้นคั่น */}

                    <Link className="bg-primary text-white text-center text-xl transition hover:bg-blue-900 py-3 rounded-full shadow-md" href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                        {t('contact')}
                    </Link>
                    <button onClick={toggleLanguage} className="bg-accent text-primary text-xl py-3 rounded-full font-bold transition shadow-md w-full">
                        ไทย/EN
                    </button>
                </nav>
            </div>
        </header>
    );
}