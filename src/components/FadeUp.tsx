'use client'
import dynamic from 'next/dynamic'
import { ReactNode } from 'react'
const MotionDiv = dynamic(
    () => import('framer-motion').then(m => m.motion.div),
    { ssr: false }
)

interface FadeUpProps {
    children: ReactNode
    delay?: number
    className?: string
}

export default function FadeUp({ children, delay = 0, className }: FadeUpProps) {
    return (
        <MotionDiv
            className={className}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay }}
        >
            {children}
        </MotionDiv>
    )
}