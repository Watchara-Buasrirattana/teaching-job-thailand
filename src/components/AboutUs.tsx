'use client';
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function AboutUs() {
    const t = useTranslations("AboutUs");

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 text-center">
                {/* หัวข้อ fade up */}
                <motion.h2
                    className="text-4xl font-bold text-primary mb-6 max-md:text-3xl"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    {t('title')}
                </motion.h2>

                {/* เนื้อหา fade up */}
                <motion.p
                    className="max-w-7xl mx-auto text-base leading-relaxed mb-12 max-md:text-xs whitespace-pre-line"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {t('detail')}
                </motion.p>

                {/* รูปภาพ stagger ทีละอัน */}
                <div className="grid grid-cols-4 gap-4 max-md:grid-cols-2">
                    {[1, 2, 3, 4].map((id, index) => (
                        <motion.div
                            key={id}
                            className="relative aspect-[3/4] overflow-hidden rounded-sm shadow-md"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Image
                                src={`/pic${id}.webp`}
                                alt="Activity"
                                fill
                                sizes="(max-width: 768px) 50vw, 25vw"
                                className="object-cover hover:scale-105 transition-transform duration-500"
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}