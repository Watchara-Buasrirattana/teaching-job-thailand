export default function TeacherCard({ name, country, img }: { name: string, country: string, img: string }) {
    return (
        <div className="flex flex-col">
            <div className="relative aspect-[3/4] w-full overflow-hidden hover:grayscale-0 transition-all duration-500">
                <img src={img} alt={name} className="w-full h-full object-cover pb-6" />

                {/* แถบชื่อสีน้ำเงินด้านล่างรูป */}
                <div className="absolute bottom-0 left-0 w-full bg-primary p-3 text-center">
                    <p className="text-accent font-bold text-[12px] truncate">{name}</p>
                    <p className="text-white text-[10px] opacity-90 mt-1">{country}</p>
                </div>
            </div>
        </div>
    );
}