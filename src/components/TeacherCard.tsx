'use client';
import { motion } from "framer-motion";

interface TeacherCardProps {
    name: string;
    country: string;
    img: string;
    index?: number;
}

export default function TeacherCard({ name, country, img, index = 0 }: TeacherCardProps) {
    return (
        <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <div className="relative aspect-[3/4] w-full overflow-hidden hover:grayscale-0 transition-all duration-500">
                <img src={img} alt={name} className="w-full h-full object-cover pb-6" />
                <div className="absolute bottom-0 left-0 w-full bg-primary p-3 text-center">
                    <p className="text-accent font-bold text-[12px] truncate">{name}</p>
                    <p className="text-white text-[10px] opacity-90 mt-1">{country}</p>
                </div>
            </div>
        </motion.div>
    );
}