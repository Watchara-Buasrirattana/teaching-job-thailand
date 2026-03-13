// src/components/NewsCard.tsx
import Image from "next/image";
import { Link } from "@/i18n/routing";

interface NewsCardProps {
    id: string;
    title: string;
    detail: string;
    date: string;
    img: string;
}

export default function NewsCard({ id, title, detail, date, img }: NewsCardProps) {
    return (
        <Link 
            href={`/news/${id}`} 
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
                        โพสต์เมื่อ: {date}
                    </span>
                </div>
            </div>
        </Link>
    );
}