'use client';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function NotFound() {
    const t = useTranslations('NotFound');

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-white text-black">
            <div className="text-center px-4">
                <h1 className="text-9xl text-primary">404</h1>
                <p className="text-2xl md:text-4xl mt-4">
                    {t('title')}
                </p>
                <Link
                    href="/"
                    className="mt-8 inline-block bg-primary text-white font-bold px-8 py-3 rounded-full transition-all hover:scale-105"
                >
                    {t('backHome')}
                </Link>
            </div>
        </div>
    );
}