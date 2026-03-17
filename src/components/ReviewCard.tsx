import Image from "next/image";

interface ReviewCardProps {
    title: string;
    text: string;
    name: string;
    country: string;
    image: string;
}

export default function ReviewCard({ title, text, name, country, image }: ReviewCardProps) {
    return (
        <div className="bg-white p-8 rounded-sm shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-shadow">
            <div>
                {/* 5 Stars */}
                <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-xl">★</span>
                    ))}
                    <span className="ml-2 text-gray-700 font-bold">5.0</span>
                </div>

                <h3 className="font-bold mb-3 leading-tight">
                    {title}
                </h3>
                <p className="text-sm font-extralight leading-relaxed mb-6">
                    {text}
                </p>
            </div>

            {/* Profile Section */}
            <div className="flex items-center justify-end gap-3 mt-auto">
                <div className="text-right">
                    <p className="font-bold leading-none">{name}</p>
                    <p className="font-extralight text-xs mt-1">{country}</p>
                </div>
                <div className="relative w-12 h-12 rounded-sm overflow-hidden border border-gray-100">
                    <Image src={image} alt={name} fill className="object-cover" />
                </div>
            </div>
        </div>
    );
}