'use client';
import { useState, useEffect } from 'react';
import { FiSearch, FiTrash2, FiEdit, FiEye } from 'react-icons/fi';
import { BiSortAlt2 } from 'react-icons/bi';

export default function ApplicantsPage() {
    const [applicants, setApplicants] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    // States สำหรับ Checkbox
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // States สำหรับ Modals
    const [viewData, setViewData] = useState<any>(null); // สำหรับดูข้อมูลเต็ม
    const [editData, setEditData] = useState<any>(null); // สำหรับเปลี่ยนสถานะ
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ดึงข้อมูลจาก API
    const fetchApplicants = async () => {
        setIsLoading(true);
        try {
            // สมมติว่าดึงจาก API ที่เราจะสร้างทีหลัง
            const res = await fetch('/api/admin/applicants');
            if (res.ok) {
                const result = await res.json();
                setApplicants(result.data || []);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchApplicants();
    }, []);

    // ฟังก์ชันช่วยกรองข้อมูล (ค้นหา + สถานะ)
    const filteredApplicants = applicants.filter(app => {
        const fullName = `${app.title || ''} ${app.firstName || ''} ${app.lastName || ''}`.toLowerCase();
        const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || (app.email && app.email.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesStatus = statusFilter === "All" || app.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // จัดการ Checkbox
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(filteredApplicants.map(app => app.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    // บันทึกการเปลี่ยนสถานะ
    const handleUpdateStatus = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/admin/applicants/${editData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: editData.status })
            });
            if (res.ok) {
                fetchApplicants();
                setEditData(null);
            } else {
                alert("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // ลบข้อมูล
    const handleDelete = async (id: string) => {
        if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบผู้สมัครรายนี้?")) return;
        try {
            await fetch(`/api/admin/applicants/${id}`, { method: 'DELETE' });
            fetchApplicants();
        } catch (error) {
            console.error(error);
        }
    };

    // ลบข้อมูลแบบหลายรายการ
    const handleDeleteSelected = async () => {
        if (selectedIds.length === 0) return;
        if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบผู้สมัคร ${selectedIds.length} รายนี้?`)) return;

        try {
            await Promise.all(selectedIds.map(id => fetch(`/api/admin/applicants/${id}`, { method: 'DELETE' })));
            fetchApplicants();
            setSelectedIds([]);
        } catch (error) {
            console.error(error);
        }
    };

    // ตัวช่วยตกแต่งสีสถานะ
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'New': return 'text-green-500';
            case 'Under Review': return 'text-yellow-500';
            case 'Trainee': return 'text-blue-400';
            case 'Teacher': return 'text-primary'; // ม่วง/น้ำเงิน
            case 'Rejected': return 'text-red-500';
            default: return 'text-gray-500';
        }
    };
    

    // สรุปยอดตามสถานะ
    const counts = {
        All: applicants.length,
        New: applicants.filter(a => a.status === 'New').length,
        UnderReview: applicants.filter(a => a.status === 'Under Review').length,
        Trainee: applicants.filter(a => a.status === 'Trainee').length,
        Teacher: applicants.filter(a => a.status === 'Teacher').length,
        Rejected: applicants.filter(a => a.status === 'Rejected').length,
    };

    return (
        <div className="space-y-6 text-gray-800 font-prompt">
            {/* Header & Controls */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">

                {/* แถว 1: Title & Search */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-baseline gap-4">
                        <h1 className="text-2xl font-bold text-[#0A0A8B]">Applicants</h1>
                        <span className="text-gray-400 text-sm">Manage your applicants.</span>
                    </div>
                </div>

                {/* แถว 2: Filters & Bulk Actions */}
                <div className="flex flex-wrap items-center gap-6 text-sm">
                    {/* กล่องค้นหา */}
                    <div className="relative flex-1 max-w-xs">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Name search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full outline-none focus:ring-2 focus:ring-[#0A0A8B]/20 transition"
                        />
                    </div>

                    {/* Checkbox & Delete Bulk */}
                    <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
                        <label className="flex items-center gap-2 cursor-pointer text-gray-500">
                            <input 
                                type="checkbox" 
                                checked={filteredApplicants.length > 0 && selectedIds.length === filteredApplicants.length}
                                onChange={handleSelectAll}
                                className="rounded border-gray-300 w-4 h-4 accent-[#0A0A8B]"
                            />
                            <span>Select all</span>
                        </label>
                        <div className="w-px h-4 bg-gray-300 mx-1"></div>
                        <button onClick={handleDeleteSelected} disabled={selectedIds.length === 0} className="text-gray-500 hover:text-red-500 disabled:opacity-30 transition">
                            <FiTrash2 size={16} />
                        </button>
                    </div>

                    {/* Status Summary (คลิกเพื่อกรองได้) */}
                    <div className="flex items-center gap-6 ml-auto font-medium">
                        <button onClick={() => setStatusFilter("All")} className={`px-3 py-1 rounded-full ${statusFilter === "All" ? "bg-gray-200 text-gray-800" : "text-gray-500 hover:bg-gray-100"}`}>
                            All : {counts.All}
                        </button>
                        <button onClick={() => setStatusFilter("New")} className={`px-3 py-1 rounded-full ${statusFilter === "New" ? "bg-gray-200 text-green-600" : "text-green-500 hover:bg-gray-100"}`}>
                            New : {counts.New}
                        </button>
                        <button onClick={() => setStatusFilter("Under Review")} className={`italic ${getStatusColor('Under Review')} ${statusFilter === "Under Review" ? "underline" : "opacity-70 hover:opacity-100"}`}>
                            Under Review : {counts.UnderReview}
                        </button>
                        <button onClick={() => setStatusFilter("Trainee")} className={`italic ${getStatusColor('Trainee')} ${statusFilter === "Trainee" ? "underline" : "opacity-70 hover:opacity-100"}`}>
                            Trainee : {counts.Trainee}
                        </button>
                        <button onClick={() => setStatusFilter("Teacher")} className={`italic ${getStatusColor('Teacher')} ${statusFilter === "Teacher" ? "underline" : "opacity-70 hover:opacity-100"}`}>
                            Teacher : {counts.Teacher}
                        </button>
                        <button onClick={() => setStatusFilter("Rejected")} className={`italic ${getStatusColor('Rejected')} ${statusFilter === "Rejected" ? "underline" : "opacity-70 hover:opacity-100"}`}>
                            Rejected : {counts.Rejected}
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="text-gray-400 border-b bg-white">
                            <tr>
                                <th className="py-4 px-4 font-normal w-10"></th>
                                <th className="py-4 px-4 font-normal">Name</th>
                                <th className="py-4 px-4 font-normal">Submitted Date</th>
                                <th className="py-4 px-4 font-normal">Email</th>
                                <th className="py-4 px-4 font-normal">Phone Number</th>
                                <th className="py-4 px-4 font-normal">Document <span className="text-[10px] bg-gray-100 px-1 rounded-full border cursor-help" title="CV = Resume, CL = Cover Letter">?</span></th>
                                <th className="py-4 px-4 font-normal">Status</th>
                                <th className="py-4 px-4 font-normal text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={9} className="text-center py-10 text-gray-500">Loading...</td></tr>
                            ) : filteredApplicants.length === 0 ? (
                                <tr><td colSpan={9} className="text-center py-10 text-gray-500">No applicants found.</td></tr>
                            ) : (
                                filteredApplicants.map((app) => (
                                    <tr key={app.id} className={`border-b border-gray-50 transition-colors ${selectedIds.includes(app.id) ? 'bg-blue-50/50' : 'hover:bg-gray-50/50'}`}>
                                        <td className="py-4 px-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(app.id)}
                                                onChange={() => handleSelectOne(app.id)}
                                                className="rounded border-gray-300 w-4 h-4 accent-[#0A0A8B] cursor-pointer"
                                            />
                                        </td>
                                        <td className="py-4 px-4 text-gray-600">{app.title} {app.firstName} {app.lastName}</td>
                                        <td className="py-4 px-4 text-gray-400">{new Date(app.createdAt).toLocaleDateString('en-GB')}</td>
                                        <td className="py-4 px-4 text-gray-500 max-w-[100px] truncate">{app.email}</td>
                                        <td className="py-4 px-4 text-gray-500">{app.phone}</td>
                                        <td className="py-4 px-4">
                                            <div className="flex gap-1.5">
                                                {/* CV Badge */}
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${app.resume ? 'bg-[#0A0A8B] text-white border-[#0A0A8B]' : 'bg-transparent text-gray-300 border-gray-200'}`}>CV</span>
                                                {/* CL Badge */}
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${app.coverLetter ? 'bg-[#0A0A8B] text-white border-[#0A0A8B]' : 'bg-transparent text-gray-300 border-gray-200'}`}>CL</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`italic font-medium ${getStatusColor(app.status)}`}>{app.status || 'New'}</span>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <div className="flex items-center justify-center gap-3">
                                                <button onClick={() => setViewData(app)} className="text-[#0A0A8B] hover:scale-110 transition-transform" title="View Details">
                                                    <FiEye size={16} />
                                                </button>
                                                <button onClick={() => setEditData(app)} className="text-[#0A0A8B] hover:scale-110 transition-transform" title="Update Status">
                                                    <FiEdit size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(app.id)} className="text-[#0A0A8B] hover:text-red-500 hover:scale-110 transition-transform" title="Delete">
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ========================================= */}
            {/* MODALS AREA */}
            {/* ========================================= */}

            {/* 1. Modal ดูข้อมูล (View) */}
            {viewData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-2xl font-bold text-[#0A0A8B]">Applicant Details</h2>
                            <button onClick={() => setViewData(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><p className="text-sm text-gray-500">Name</p><p className="font-bold">{viewData.title} {viewData.firstName} {viewData.lastName}</p></div>
                                <div><p className="text-sm text-gray-500">Submitted Date</p><p className="font-bold">{new Date(viewData.createdAt).toLocaleDateString()}</p></div>
                                <div><p className="text-sm text-gray-500">Email</p><p className="font-bold">{viewData.email}</p></div>
                                <div><p className="text-sm text-gray-500">Phone</p><p className="font-bold">{viewData.phone}</p></div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Message</p>
                                <div className="p-4 bg-gray-50 rounded-lg text-sm whitespace-pre-line">{viewData.message || 'No message provided.'}</div>
                            </div>
                            <div className="pt-4 flex gap-4">
                                {viewData.resume && (
                                    <a href={viewData.resume} target="_blank" className="bg-[#0A0A8B] text-white px-6 py-2 rounded-full text-sm font-bold shadow-md hover:bg-blue-900">View Resume (CV)</a>
                                )}
                                {viewData.coverLetter && (
                                    <a href={viewData.coverLetter} target="_blank" className="border-2 border-[#0A0A8B] text-[#0A0A8B] px-6 py-2 rounded-full text-sm font-bold hover:bg-blue-50">View Cover Letter</a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Modal เปลี่ยนสถานะ (Edit) */}
            {editData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-[#0A0A8B]">Update Status</h2>
                            <button onClick={() => setEditData(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        <form onSubmit={handleUpdateStatus} className="p-6">
                            <p className="mb-4 text-sm text-gray-600">Change status for: <strong>{editData.firstName} {editData.lastName}</strong></p>
                            <label className="block text-sm font-bold mb-2">Status</label>
                            <select
                                value={editData.status}
                                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#0A0A8B]/20 mb-6"
                            >
                                <option value="New">New</option>
                                <option value="Under Review">Under Review</option>
                                <option value="Trainee">Trainee</option>
                                <option value="Teacher">Teacher</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setEditData(null)} className="px-6 py-2 rounded-full text-gray-600 hover:bg-gray-100 font-bold">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="bg-[#0A0A8B] text-white px-6 py-2 rounded-full font-bold hover:bg-blue-900 disabled:opacity-50">
                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}