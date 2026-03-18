import { useTranslations } from 'next-intl';

export default function Features() {
    const t = useTranslations('Features');

    return (
        <section className="bg-primary py-10 text-white">
            <div className="container mx-auto grid grid-cols-4 max-xl:grid-cols-1 gap-8 px-4">
                <div className="flex gap-4">
                    <div className="w-12 bg-accent shrink-0"></div> {/* ใส่ไอคอนตรงนี้ */}
                    <div>
                        <h3 className="font-bold mb-4 leading-tight whitespace-pre-line">{t('title1')}</h3>
                        <p className="text-xs whitespace-pre-line">{t('detail1')}</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-12 bg-accent shrink-0"></div> {/* ใส่ไอคอนตรงนี้ */}
                    <div>
                        <h3 className="font-bold mb-4 leading-tight whitespace-pre-line">{t('title2')}</h3>
                        <p className="text-xs whitespace-pre-line">{t('detail2')}</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-12 bg-accent shrink-0"></div> {/* ใส่ไอคอนตรงนี้ */}
                    <div>
                        <h3 className="font-bold mb-4 leading-tight whitespace-pre-line">{t('title3')}</h3>
                        <p className="text-xs whitespace-pre-line">{t('detail3')}</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-12 bg-accent shrink-0"></div> {/* ใส่ไอคอนตรงนี้ */}
                    <div>
                        <h3 className="font-bold mb-4 leading-tight whitespace-pre-line">{t('title4')}</h3>
                        <p className="text-xs whitespace-pre-line">{t('detail4')}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}