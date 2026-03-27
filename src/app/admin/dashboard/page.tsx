'use client';
import { LuEye } from 'react-icons/lu';
import { FiInfo } from 'react-icons/fi';
import { BiUserPlus, BiGroup } from 'react-icons/bi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// ข้อมูลจำลองสำหรับกราฟ
const data = [
    { name: 'Oct 7', views: 5 }, { name: 'Oct 8', views: 5 },
    { name: 'Oct 9', views: 19 }, { name: 'Oct 10', views: 9 },
    { name: 'Oct 11', views: 29 }, { name: 'Oct 12', views: 14 },
    { name: 'Oct 13', views: 18 },
];

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-700">Admin Dashboard</h1>

            {/* 4 Cards Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Card 1 */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                    <div className="flex items-center gap-2 text-[#0A0A8B] font-bold mb-4">
                        <LuEye size={20} /> Traffic Overview
                    </div>
                    <div className="flex gap-8 text-center">
                        <div><p className="text-gray-400 text-xs">Total Views</p><p className="text-4xl text-[#0A0A8B] font-light">56</p></div>
                        <div><p className="text-gray-400 text-xs">Active Users</p><p className="text-4xl text-[#0A0A8B] font-light">5</p></div>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                    <div className="flex items-center gap-2 text-[#0A0A8B] font-bold mb-4">
                        <FiInfo size={20} /> Content Update
                    </div>
                    <div className="flex gap-8 text-center">
                        <div><p className="text-gray-400 text-xs">Total Posted</p><p className="text-4xl text-[#0A0A8B] font-light">12</p></div>
                        <div><p className="text-gray-400 text-xs">Drafts</p><p className="text-4xl text-[#0A0A8B] font-light">1</p></div>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                    <div className="flex items-center gap-2 text-[#0A0A8B] font-bold mb-4">
                        <BiUserPlus size={20} /> New Applicants
                    </div>
                    <div className="flex gap-8 text-center">
                        <div><p className="text-gray-400 text-xs">Total Applicants</p><p className="text-4xl text-[#0A0A8B] font-light">4</p></div>
                        <div><p className="text-gray-400 text-xs">Unread</p><p className="text-4xl text-[#0A0A8B] font-light">3</p></div>
                    </div>
                </div>

                {/* Card 4 */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                    <div className="flex items-center gap-2 text-[#0A0A8B] font-bold mb-4">
                        <BiGroup size={20} /> Foreign Teachers
                    </div>
                    <div className="flex gap-8 text-center">
                        <div><p className="text-gray-400 text-xs">Teachers</p><p className="text-4xl text-[#0A0A8B] font-light">7</p></div>
                        <div><p className="text-gray-400 text-xs">Trainees</p><p className="text-4xl text-[#0A0A8B] font-light">15</p></div>
                    </div>
                </div>
            </div>

            {/* Analytics Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-[#0A0A8B] font-bold">Analytics <span className="text-gray-400 text-sm font-normal">Updated last Monday at 08:00 a.m.</span></h2>
                    </div>
                    <div className="flex gap-2">
                        <select className="border border-gray-200 rounded p-1 text-sm outline-none"><option>View</option></select>
                        <select className="border border-gray-200 rounded p-1 text-sm outline-none"><option>Last 7 days</option></select>
                    </div>
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dx={-10} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Line type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Teacher Status Table */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-[#0A0A8B] font-bold">Teacher Status</h2>
                    <input type="text" placeholder="🔍 Name Search" className="bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0A0A8B]/20" />
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
                            {/* แถวตัวอย่าง (เดี๋ยวเราค่อยดึงจาก DB มาใส่ทีหลัง) */}
                            <tr className="bg-red-50">
                                <td className="py-3 px-2 rounded-l-lg">Mr. John Smith</td>
                                <td className="py-3 text-red-400">โรงเรียนเตรียมอุดมศึกษา โครงการนานาชาติ</td>
                                <td className="py-3 text-red-400">25 Mar 2026</td>
                                <td className="py-3">081-xxx-xxxx</td>
                                <td className="py-3 rounded-r-lg flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-sm"></div> Urgent!</td>
                            </tr>
                            <tr className="border-b border-gray-50 hover:bg-gray-50">
                                <td className="py-3 px-2">Ms. Anna K.</td>
                                <td className="py-3 text-gray-500">ค่ายภาษาอังกฤษ (สพม.)</td>
                                <td className="py-3 text-gray-500">15 Apr 2026</td>
                                <td className="py-3">Line: ann_k</td>
                                <td className="py-3 flex items-center gap-2"><div className="w-3 h-3 bg-yellow-400 rounded-sm"></div> Warning</td>
                            </tr>
                            <tr className="border-b border-gray-50 hover:bg-gray-50">
                                <td className="py-3 px-2">Mr. David Cho</td>
                                <td className="py-3 text-gray-500">โรงเรียนนครขอนแก่น</td>
                                <td className="py-3 text-gray-500">25 Mar 2026</td>
                                <td className="py-3">089-xxx-xxxx</td>
                                <td className="py-3 flex items-center gap-2"><div className="w-3 h-3 bg-blue-400 rounded-sm"></div> Processing 📝</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}