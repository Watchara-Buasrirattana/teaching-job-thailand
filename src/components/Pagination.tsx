// src/components/Pagination.tsx
"use client";
import { useRouter, usePathname } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";

interface PaginationProps {
    totalPages: number;
}

export default function Pagination({ totalPages }: PaginationProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    // ดึงหน้าปัจจุบันจาก URL ถ้าไม่มีให้เป็นหน้า 1
    const currentPage = Number(searchParams.get("page")) || 1;

    const createPageUrl = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", pageNumber.toString());
        // สั่งเปลี่ยน URL โดยไม่เลื่อนจอขึ้นบนสุด
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="flex items-center gap-4 text-primary font-bold font-prompt select-none">
            {/* ปุ่มไปหน้าแรกสุด */}
            <button 
                onClick={() => createPageUrl(1)}
                disabled={currentPage === 1}
                className="hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed"
            >
                {"|<<"}
            </button>

            {/* ปุ่มย้อนกลับ */}
            <button 
                onClick={() => createPageUrl(currentPage - 1)}
                disabled={currentPage === 1}
                className="hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed"
            >
                {"<"}
            </button>
            
            <div className="flex border-b-4 border-primary">
                {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    const isActive = page === currentPage;

                    return (
                        <button
                            key={page}
                            onClick={() => createPageUrl(page)}
                            className={`px-4 py-2 transition-colors ${
                                isActive 
                                ? "bg-accent text-primary" 
                                : "hover:bg-gray-100 text-primary"
                            }`}
                        >
                            {page}
                        </button>
                    );
                })}
            </div>

            {/* ปุ่มไปหน้าถัดไป */}
            <button 
                onClick={() => createPageUrl(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed"
            >
                {">"}
            </button>

            {/* ปุ่มไปหน้าสุดท้าย */}
            <button 
                onClick={() => createPageUrl(totalPages)}
                disabled={currentPage === totalPages}
                className="hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed"
            >
                {">>|"}
            </button>
        </div>
    );
}