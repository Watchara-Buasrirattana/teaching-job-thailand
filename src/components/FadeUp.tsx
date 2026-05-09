'use client';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeUpProps {
    children: ReactNode;
    delay?: number;
    className?: string;
}

// Component กลางสำหรับ fade up — ใช้ซ้ำได้ทุกหน้า
export default function FadeUp({ children, delay = 0, className }: FadeUpProps) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay }}
        >
            {children}
        </motion.div>
    );
}