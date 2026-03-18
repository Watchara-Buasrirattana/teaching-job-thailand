import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Hero() {
    const t = useTranslations('Hero');

    return (
        <section className="relative w-full min-h-[500px] flex items-center bg-primary overflow-hidden max-md:py-10">
            <div className="container mx-auto flex flex-row items-center max-md:flex-col">
                {/* ฝั่งซ้าย: รูปกลุ่มครู */}
                <div className="w-full md:w-1/2 flex justify-center">
                    <Image src="/hero-teachers.png" alt="Teachers" fill className="object-cover object-[100%_62%] pt-4" />
                </div>
                {/* ฝั่งขวา: ข้อความ */}
                <div className="w-1/2 text-right space-y-4 z-1 max-md:w-full max-md:text-center max-md:mt-8">
                    <h1 className="text-3xl font-bold text-black leading-tight max-md:text-3xl whitespace-pre-line">
                        {t('title')}
                    </h1>
                    <p className="whitespace-pre-line text-sm">{t('detail')}</p>
                    <button className="bg-accent text-primary px-8 py-2 rounded-full font-bold cursor-pointer transition hover:scale-105">
                        {t('contactUs')}
                    </button>
                </div>
            </div>
        </section>
    );
}