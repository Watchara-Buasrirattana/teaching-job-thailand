"use client";
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import Image from 'next/image'
import { useLocale } from 'next-intl';

export default function Navbar() {
    const t = useTranslations('Navbar');
    const pathname = usePathname();
    const router = useRouter();    // ตัวสั่งเปลี่ยนหน้า
    const locale = useLocale();    // ภาษาปัจจุบัน (th หรือ en)

    const toggleLanguage = () => {
        // ถ้าตอนนี้เป็น th ให้สลับไป en, ถ้าเป็น en ให้สลับไป th
        const nextLocale = locale === 'th' ? 'en' : 'th';
        
        // สั่งเปลี่ยนภาษาโดยรักษา URL เดิมไว้
        router.replace(pathname, { locale: nextLocale });
    };

    // ฟังก์ชันช่วยจัดการสี Active
    const getLinkClass = (path: string) => {
        const isActive = pathname === path;

        const baseClass = "text-xl transition ";
        if (isActive) {
            return `${baseClass} text-accent hover:text-accent/75`;
        }
        return `${baseClass} text-primary hover:text-primary/75`;
    };

    return (
        <header className="bg-background sticky top-0 z-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">

                    {/* Logo Section */}
                    <div className="md:flex md:items-center">
                        <Link className="text-primary font-black text-2xl top-16" href="/">
                            <Image src={`/logo.png`} alt='Teaching Job Thailand Logo' width={130} height={113} priority />
                        </Link>
                    </div>

                    {/* Navigation Menu */}
                    <div className="hidden md:block">
                        <nav aria-label="Global">
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
                                    <Link className={getLinkClass('/work')} href="/work">
                                        {t('work')}
                                    </Link>
                                </li>

                                <li>
                                    <Link className={`bg-primary text-white text-xl transition hover:bg-primary/75 py-2 px-6 rounded-full '}`} href="/contact">
                                        {t('contact')}
                                    </Link>
                                </li>

                                <li>
                                    <button onClick={toggleLanguage} className="text-xl py-2 px-4 rounded-full transition-all hover:cursor-pointer hover:scale-105 bg-accent text-primary active:scale-95">
                                        ไทย/EN
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>

                </div>
            </div>
        </header>
    );
}