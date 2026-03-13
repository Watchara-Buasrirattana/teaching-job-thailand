import { Link } from "@/i18n/routing";

interface Path {
    label: string;
    href?: string; // ถ้าไม่มี href แสดงว่าเป็นหน้าปัจจุบัน (กดไม่ได้)
}

interface BreadcrumbProps {
    paths: Path[];
}

export default function Breadcrumb({ paths }: BreadcrumbProps) {
    return (
        <nav className="flex items-center text-sm mb-6 font-prompt overflow-hidden">
            {paths.map((path, index) => {
                const isLast = index === paths.length - 1;

                return (
                    <div key={index} className="flex items-center">
                        {path.href && !isLast ? (
                            // ส่วนที่กดได้
                            <Link
                                href={path.href}
                                className="text-primary hover:opacity-100 hover:text-accent transition-all whitespace-nowrap"
                            >
                                {path.label}
                            </Link>
                        ) : (
                            // ส่วนหน้าปัจจุบัน (กดไม่ได้)
                            <span className="text-accent font-bold truncate max-w-[200px] md:max-w-md">
                                {path.label}
                            </span>
                        )}

                        {/* แสดงลูกศร ยกเว้นตัวสุดท้าย */}
                        {!isLast && (
                            <span className="mx-2 text-primary select-none">
                                {">"}
                            </span>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}