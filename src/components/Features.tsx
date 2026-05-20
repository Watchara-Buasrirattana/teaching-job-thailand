'use client';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

// Stagger container — ลูกๆ จะ animate ทีละอัน
const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.15 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Features() {
    const t = useTranslations('Features');

    const items = [
        { title: t('title1'), detail: t('detail1') },
        { title: t('title2'), detail: t('detail2') },
        { title: t('title3'), detail: t('detail3') },
        { title: t('title4'), detail: t('detail4') },
    ];

    return (
        <section className="bg-primary py-10 text-white">
            <motion.div
                className="container mx-auto grid grid-cols-4 xl:grid-cols-4 lg:grid-cols-2 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-8 px-4"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
                {items.map((item, index) => (
                    <motion.div key={index} className="flex gap-4" variants={itemVariants}>
                        <div className="w-12 bg-accent shrink-0"></div>
                        <div>
                            <p className="font-bold mb-4 leading-tight whitespace-pre-line">{item.title}</p>
                            <p className="text-xs whitespace-pre-line">{item.detail}</p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}