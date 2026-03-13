import Image from "next/image";
import { useTranslations } from "next-intl";

export default function AboutUs() {
    const t = useTranslations("AboutUs")

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl font-bold text-primary mb-6">{t('title')}</h2>
                <p className="max-w-7xl mx-auto text-base leading-relaxed mb-12 max-md:text-sm whitespace-pre-line">
                    {t('detail')}
                </p>

                {/* Grid รูปภาพ: Desktop 4 คอลัมน์ / Mobile 2 คอลัมน์ */}
                <div className="grid grid-cols-4 gap-4 max-md:grid-cols-2">
                    {[1, 2, 3, 4].map((id) => (
                        /* สำคัญมาก: ต้องมี relative เพื่อให้ Image fill ไม่ล้นออกไปนอกกรอบ */
                        <div key={id} className="relative aspect-[3/4] overflow-hidden rounded-sm shadow-md">
                            <Image
                                src={`/pic${id}.png`} // ใช้ id เพื่อให้รูปไม่ซ้ำกันถ้าคุณมีหลายไฟล์
                                alt="Activity"
                                fill
                                sizes="(max-width: 768px) 50vw, 25vw" // ช่วยเรื่อง performance
                                className="object-cover hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}