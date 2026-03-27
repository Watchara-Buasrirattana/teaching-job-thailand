'use client';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/admin/login';

    // ถ้าเป็นหน้า Login ให้โชว์แค่เนื้อหา (ไม่เอา Sidebar)
    if (isLoginPage) {
        return <>{children}</>;
    }

    // ถ้าเป็นหน้าอื่นๆ ใน Admin ให้โชว์ Sidebar ตามปกติ
    return (
        <div className="flex font-prompt bg-[#F3F4F6] text-gray-800 antialiased min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}