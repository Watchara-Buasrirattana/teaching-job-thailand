import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function NotFound() {
    const t = useTranslations('NotFound');

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="justify-center text-center py-20 gap-6">
                <h1 className="text-9xl font-bold text-primary">404</h1>
                <p className="text-4xl mt-4">{t('title')}</p>
                <Link
                    href="/"
                    className="mt-8 inline-block bg-accent text-primary font-bold px-8 py-3 rounded-full shadow-lg"
                >
                    {t('backHome')}
                </Link>
            </div>
        </div>
    );
}