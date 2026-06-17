'use client';
import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReviewCard from './ReviewCard';

interface Review {
    title: string;
    text: string;
    name: string;
    country: string;
    image: string;
}

interface Props {
    reviews: Review[];
    dragHint: string;
}

const VISIBLE_DESKTOP = 3;

export default function ReviewCarousel({ reviews, dragHint }: Props) {
    const [isDragging, setIsDragging] = useState(false);
    const [dragLimit, setDragLimit] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const mobileScrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const calcLimit = () => {
            if (!containerRef.current || !trackRef.current) return;
            const containerW = containerRef.current.offsetWidth;
            const trackW = trackRef.current.scrollWidth;
            setDragLimit(Math.max(0, trackW - containerW));
        };
        calcLimit();
        window.addEventListener('resize', calcLimit);
        return () => window.removeEventListener('resize', calcLimit);
    }, [reviews]);

    const handleMobileScroll = () => {
        const el = mobileScrollRef.current;
        if (!el) return;
        const cardWidth = el.scrollWidth / reviews.length;
        const index = Math.round(el.scrollLeft / cardWidth);
        setActiveIndex(index);
    };

    return (
        <div className="relative">
            {/* Desktop */}
            <div
                ref={containerRef}
                className="hidden lg:block overflow-hidden cursor-grab active:cursor-grabbing"
            >
                <motion.div
                    ref={trackRef}
                    className="flex gap-6"
                    drag={reviews.length > VISIBLE_DESKTOP ? 'x' : false}
                    dragConstraints={{ left: -dragLimit, right: 0 }}
                    dragElastic={0.1}
                    dragMomentum={true}
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={() => setTimeout(() => setIsDragging(false), 100)}
                >
                    {reviews.map((item, index) => (
                        <div
                            key={index}
                            className="shrink-0 w-[calc((100%-48px)/3)]"
                            onClick={(e) => isDragging && e.preventDefault()}
                        >
                            <ReviewCard {...item} index={index} />
                        </div>
                    ))}
                </motion.div>
            </div>

            {reviews.length > VISIBLE_DESKTOP && (
                <p className="hidden lg:block text-center text-xs text-gray-400 mt-6 select-none">
                    {dragHint}
                </p>
            )}

            {/* Mobile — snap scroll */}
            <div
                ref={mobileScrollRef}
                onScroll={handleMobileScroll}
                className="md:hidden overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2"
            >
                <div className="flex gap-4" style={{ width: 'max-content' }}>
                    {reviews.map((item, index) => (
                        <div key={index} className="snap-center shrink-0 w-[85vw]">
                            <ReviewCard {...item} index={index} />
                        </div>
                    ))}
                </div>
            </div>

            {reviews.length > 1 && (
                <div className="flex md:hidden justify-center gap-1.5 mt-4">
                    {reviews.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIndex
                                    ? 'bg-primary w-4'
                                    : 'bg-gray-300 w-1.5'
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}