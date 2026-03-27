'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { MdOutlineSpaceDashboard, MdContentCopy, MdLogout } from 'react-icons/md';
import { BiUserPlus, BiGroup } from 'react-icons/bi';
import { FaRegCommentAlt } from 'react-icons/fa';

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const menuItems = [
        { name: 'Dashboard', icon: MdOutlineSpaceDashboard, path: '/admin/dashboard' },
        { name: 'Content', icon: MdContentCopy, path: '/admin/content' },
        { name: 'Applicants', icon: BiUserPlus, path: '/admin/applicants' },
        { name: 'Teachers', icon: BiGroup, path: '/admin/teachers' },
        { name: 'Reviews', icon: FaRegCommentAlt, path: '/admin/reviews' },
    ];

    // เปลี่ยนจาก document.cookie เป็นการเรียก API
    const handleLogout = async () => {
        try {
            // ยิงไปที่ API เพื่อลบ Cookie
            await fetch('/api/admin/logout', { method: 'POST' });

            // เด้งกลับหน้า Login
            router.push('/admin/login');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <aside className="w-64 bg-[#0A0A8B] text-white min-h-screen flex flex-col font-prompt fixed">
            {/* Logo Area */}
            <div className="h-24 flex items-center justify-center border-b border-white/10 p-4">
                <div className="text-center">
                    {/* ตรงนี้ใส่โลโก้ PKP ของคุณได้เลย */}
                    <h1 className="font-bold text-xl tracking-wider">PKP<br /><span className="text-xs font-normal">English Co.,Ltd.</span></h1>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 py-6 space-y-2 px-4">
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;
                    const Icon = item.icon;
                    return (
                        <Link key={item.name} href={item.path}>
                            <div className={`flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition-all ${isActive
                                ? 'bg-[#FFC107] text-[#0A0A8B] font-bold shadow-md'
                                : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                }`}>
                                <Icon size={24} />
                                <span>{item.name}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile & Logout */}
            <div className="bg-[#F3F4F6] text-[#0A0A8B] p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center overflow-hidden">
                        {/* รูป Avatar จำลอง */}
                        <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Admin" alt="avatar" />
                    </div>
                    <div>
                        <p className="text-sm font-bold">Username</p>
                        <p className="text-xs text-gray-500">Admin</p>
                    </div>
                </div>
                <button onClick={handleLogout} className="text-[#0A0A8B] hover:text-red-600 transition p-2">
                    <MdLogout size={24} />
                </button>
            </div>
        </aside>
    );
}