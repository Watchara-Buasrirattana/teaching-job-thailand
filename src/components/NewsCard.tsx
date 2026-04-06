// src/components/NewsCard.tsx
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

interface NewsCardProps {
    id: string;
    slug: string;           // เพิ่ม slug
    createdAt: Date | string; // เพิ่มวันที่สร้าง (เพื่อเอามาดึง ปี/เดือน/วัน)
    title: string;
    detail: string;
    date: string;
    img: string;
}

export default function NewsCard({ id, slug, createdAt, title, detail, date, img }: NewsCardProps) {
    const t2 = useTranslations('News');

    // คำนวณ URL ให้เป็นรูปแบบ /news/year/month/day/slug
    const createdDate = new Date(createdAt);
    const year = createdDate.getFullYear();
    const month = createdDate.getMonth() + 1; // ใน JS เดือนเริ่มที่ 0 เลยต้อง +1
    const day = createdDate.getDate();
    
    const newsUrl = `/news/${year}/${month}/${day}/${slug}`;

    return (
        <Link 
            href={newsUrl} // เปลี่ยนมาใช้ตัวแปร newsUrl ที่เราประกอบเสร็จแล้ว
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
    );
}