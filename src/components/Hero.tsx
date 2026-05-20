'use client';
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from '@/i18n/routing'

export default function Hero() {
    const t = useTranslations('Hero');

    return (
        <section className="relative w-full min-h-[500px] flex items-center bg-primary overflow-hidden max-lg:py-10">
            <div className="container mx-auto flex flex-row items-center max-lg:flex-col">
                {/* ฝั่งซ้าย: รูปกลุ่มครู — fade in */}
                <motion.div
                    className="w-full md:w-1/2 flex justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <Image src="/hero-teachers.png" alt="Teachers" fill priority className="object-cover object-[100%_62%] pt-4" />
                </motion.div>

                {/* ฝั่งขวา: ข้อความ — fade up ทีละบรรทัด */}
                <div className="w-1/2 text-right space-y-4 z-1 max-lg:w-full max-lg:text-center max-lg:mt-8">
                    <motion.h1
                        className="text-3xl font-bold text-black leading-tight max-lg:text-3xl whitespace-pre-line max-sm:text-2xl"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {t('title')}
                    </motion.h1>

                    <motion.p
                        className="whitespace-pre-line text-sm"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        {t('detail')}
                    </motion.p>
                    <Link href="/contact">
                        <motion.button
                            className="bg-accent text-primary px-8 py-2 rounded-full font-bold cursor-pointer transition hover:scale-105"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {t('contactUs')}
                        </motion.button>
                    </Link>
                </div>
            </div>
        </section>
    );
}