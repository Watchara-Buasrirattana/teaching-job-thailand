'use client';
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

interface NewsCardProps {
    id: string;
    slug: string;
    createdAt: Date | string;
    title: string;
    detail: string;
    date: string;
    img: string;
    index?: number; // รับ index เพื่อ stagger delay
}

export default function NewsCard({ id, slug, createdAt, title, detail, date, img, index = 0 }: NewsCardProps) {
    const t2 = useTranslations('News');

    const createdDate = new Date(createdAt);
    const year = createdDate.getFullYear();
    const month = createdDate.getMonth() + 1;
    const day = createdDate.getDate();
    const newsUrl = `/news/${year}/${month}/${day}/${slug}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <Link
                href={newsUrl}
                className="group block bg-primary overflow-hidden shadow-sm hover:shadow-xl transition-all border-b-4 border-primary"
            >
                <div className="relative aspect-video w-full overflow-hidden">
                    <Image
                        src={img}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                </div>

                <div className="p-4 bg-primary text-white min-h-[160px] flex flex-col justify-between">
                    <div>
                        <h3 className="font-medium text-accent leading-relaxed mb-2 line-clamp-2">
                            {title}
                        </h3>
                        <p className="text-sm line-clamp-2 leading-relaxed opacity-90">
                            {detail}
                        </p>
                    </div>
                    <div className="flex justify-end items-end mt-4">
                        <span className="text-[10px] opacity-70">
                            {t2('posted')} {date}
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}