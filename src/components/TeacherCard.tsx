import Image from "next/image";

export default function TeacherCard({ name, nationality }: { name: string, nationality: string }) {
    return (
        <div className="flex flex-col">
            <div className="relative aspect-[3/4] w-full overflow-hidden hover:grayscale-0 transition-all duration-500">
                <Image src="/teacher.png" alt={name} fill className="object-cover" />

                {/* แถบชื่อสีน้ำเงินด้านล่างรูป */}
                <div className="absolute bottom-0 left-0 w-full bg-[#1a1a8c] p-3 text-center">
                    <p className="text-yellow-400 font-bold text-xs truncate">{name}</p>
                    <p className="text-white text-[10px] opacity-80 mt-1">{nationality}</p>
                </div>
            </div>
        </div>
    );
}