// src/app/admin/dashboard/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { LuEye } from 'react-icons/lu';
import { FiInfo } from 'react-icons/fi';
import { BiUserPlus, BiGroup } from 'react-icons/bi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// ข้อมูลจำลองสำหรับกราฟ (เพราะฐานข้อมูลยังไม่มีการเก็บ Log ยอดเข้าชมเว็บ)
const mockChartData = [
    { name: 'Oct 7', views: 5 }, { name: 'Oct 8', views: 5 },
    { name: 'Oct 9', views: 19 }, { name: 'Oct 10', views: 9 },
    { name: 'Oct 11', views: 29 }, { name: 'Oct 12', views: 14 },
    { name: 'Oct 13', views: 18 },
];

export default function DashboardPage() {
    const [stats, setStats] = useState({
        news: { total: 0, drafts: 0 },
        applicants: { total: 0, unread: 0 },
        teachers: { total: 0, processing: 0 }
    });
    const [recentTeachers, setRecentTeachers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await fetch('/api/admin/dashboard');
                const data = await res.json();
                if (data.success) {
                    setStats(data.stats);
                    setRecentTeachers(data.recentTeachers);
                }
            } catch (error) {
                console.error("Failed to load dashboard:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // ฟังก์ชันช่วยกำหนดสไตล์สีตาม Status ครู
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Urgent': return { bg: 'bg-red-50', text: 'text-red-500', dot: 'bg-red-500', label: 'Urgent!' };
            case 'Warning': return { bg: 'hover:bg-gray-50', text: 'text-yellow-500', dot: 'bg-yellow-400', label: 'Warning' };
            case 'Processing': return { bg: 'hover:bg-gray-50', text: 'text-blue-500', dot: 'bg-blue-400', label: 'Processing 📝' };
            default: return { bg: 'hover:bg-gray-50', text: 'text-green-500', dot: 'bg-green-500', label: 'Active' };
        }
    };

    if (isLoading) {
        return <div className="p-10 text-center text-gray-500">Loading Dashboard...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-700">Admin Dashboard</h1>

            {/* 4 Cards Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Card 1: Traffic (อันนี้ยังเป็น Mock เพราะไม่มีข้อมูลยอดวิวใน DB) */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center opacity-80">
                    <div className="flex items-center gap-2 text-primary font-bold mb-4">
                        <LuEye size={20} /> Traffic Overview
                    </div>
                    <div className="flex gap-8 text-center">
                        <div><p className="text-gray-400 text-xs">Total Views</p><p className="text-4xl text-primary font-light">--</p></div>
                        <div><p className="text-gray-400 text-xs">Active Users</p><p className="text-4xl text-primary font-light">--</p></div>
                    </div>
                </div>

                {/* Card 2: News Content (ข้อมูลจริง) */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                    <div className="flex items-center gap-2 text-primary font-bold mb-4">
                        <FiInfo size={20} /> Content Update
                    </div>
                    <div className="flex gap-8 text-center">
                        <div><p className="text-gray-400 text-xs">Total Posted</p><p className="text-4xl text-primary font-light">{stats.news.total}</p></div>
                        <div><p className="text-gray-400 text-xs">Drafts</p><p className="text-4xl text-primary font-light">{stats.news.drafts}</p></div>
                    </div>
                </div>

                {/* Card 3: Applicants (ข้อมูลจริง) */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                    <div className="flex items-center gap-2 text-primary font-bold mb-4">
                        <BiUserPlus size={20} /> New Applicants
                    </div>
                    <div className="flex gap-8 text-center">
                        <div><p className="text-gray-400 text-xs">Total Applicants</p><p className="text-4xl text-primary font-light">{stats.applicants.total}</p></div>
                        <div><p className="text-gray-400 text-xs">New</p><p className="text-4xl text-primary font-light">{stats.applicants.unread}</p></div>
                    </div>
                </div>

                {/* Card 4: Teachers (ข้อมูลจริง) */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                    <div className="flex items-center gap-2 text-primary font-bold mb-4">
                        <BiGroup size={20} /> Foreign Teachers
                    </div>
                    <div className="flex gap-8 text-center">
                        <div><p className="text-gray-400 text-xs">Total Teachers</p><p className="text-4xl text-primary font-light">{stats.teachers.total}</p></div>
                        <div><p className="text-gray-400 text-xs">Processing</p><p className="text-4xl text-primary font-light">{stats.teachers.processing}</p></div>
                    </div>
                </div>
            </div>

            {/* Analytics Chart (ยังเป็น Mock) */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-primary font-bold">Analytics <span className="text-gray-400 text-sm font-normal">(Sample Data)</span></h2>
                    </div>
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockChartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dx={-10} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Line type="monotone" dataKey="views" stroke="#13008C" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Teacher Status Table (ข้อมูลจริง) */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-primary font-bold">Recent Teacher Status</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="text-gray-400 border-b">
                            <tr>
                                <th className="py-3 font-normal">Name</th>
                                <th className="py-3 font-normal">School / Project</th>
                                <th className="py-3 font-normal">Document Expiry</th>
                                <th className="py-3 font-normal">Contact</th>
                                <th className="py-3 font-normal">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentTeachers.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-4 text-gray-400">No teachers found</td></tr>
                            ) : (
                                recentTeachers.map((teacher) => {
                                    const style = getStatusStyle(teacher.status);
                                    return (
                                        <tr key={teacher.id} className={`border-b border-gray-50 transition-colors ${style.bg}`}>
                                            <td className="py-3 px-2 rounded-l-lg font-medium text-gray-800">
                                                {teacher.title} {teacher.fName} {teacher.lName}
                                            </td>
                                            <td className="py-3">{teacher.schoolProject || '-'}</td>
                                            <td className="py-3">
                                                {teacher.visaExpiryDate 
                                                    ? new Date(teacher.visaExpiryDate).toLocaleDateString('en-GB') 
                                                    : '-'}
                                            </td>
                                            <td className="py-3">{teacher.phone || '-'}</td>
                                            <td className="py-3 rounded-r-lg flex items-center gap-2">
                                                <div className={`w-3 h-3 rounded-sm ${style.dot}`}></div> 
                                                <span className={style.text}>{style.label}</span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}