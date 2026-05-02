import { useTranslations } from 'next-intl';
import Image from "next/image";
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import AboutUs from '@/components/AboutUs';
import News from '@/components/News';

export default function HomePage() {
  const t = useTranslations("Home");

  return (
    <div className="flex flex-col gap-0 font-prompt">
      {/* 1. Hero Section (รูปครูต่างชาติ + ข้อความขวา) */}
      <Hero />

      {/* 2. Features Section (แถบสีน้ำเงิน 4 ช่อง) */}
      <Features />

      {/* 3. About Us (เกี่ยวกับเรา) */}
      <AboutUs />

      {/* 4. News Section (ข่าวประชาสัมพันธ์) */}
      <News />
    </div>
  );
}