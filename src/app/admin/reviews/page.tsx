// src/app/admin/reviews/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { FiSearch, FiTrash2, FiEdit, FiEye, FiPlus, FiX } from 'react-icons/fi';

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    // States สำหรับ Checkbox
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // States สำหรับ Modals
    const [viewData, setViewData] = useState<any>(null);
    const [editData, setEditData] = useState<any>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initial Form State
    const initialFormState = {
        teacherId: '',
        title: '',
        content: '',
        rating: 5,
        status: true // true = Active, false = Hidden
    };
    const [formData, setFormData] = useState(initialFormState);

    // Sort States (แถมให้เพื่อให้เหมือนตารางเดิม)
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const resReviews = await fetch('/api/admin/reviews');
            if (resReviews.ok) {
                const data = await resReviews.json();
                // เช็คว่าเป็น Array ไหม ถ้าไม่ใช่ให้หา key .data
                setReviews(Array.isArray(data) ? data : data.data || []);
            }

            const resTeachers = await fetch('/api/admin/teachers');
            if (resTeachers.ok) {
                const data = await resTeachers.json();
                // 🛑 แก้ไขจุดนี้: ป้องกัน Error teachers.map is not a function
                setTeachers(Array.isArray(data) ? data : data.data || []);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // คำนวณจำนวน (Counts) สำหรับ Filter
    const counts = {
        All: reviews.length,
        Active: reviews.filter(r => r.status === true).length,
        Hidden: reviews.filter(r => r.status === false).length,
    };

    // Filter Logic
    const filteredReviews = reviews.filter((review) => {
        const teacherName = `${review.teacher?.fName || ''} ${review.teacher?.lName || ''}`.toLowerCase();
        const matchesSearch = review.title.toLowerCase().includes(searchQuery.toLowerCase()) || teacherName.includes(searchQuery.toLowerCase());

        const reviewStatus = review.status ? "Active" : "Hidden";
        const matchesStatus = statusFilter === "All" || reviewStatus === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Sort Logic
    const sortedReviews = [...filteredReviews].sort((a, b) => {
        if (!sortConfig) return 0;
        const { key, direction } = sortConfig;

        let aVal = a[key];
        let bVal = b[key];

        // กรณี sort ชื่อครู
        if (key === 'teacherName') {
            aVal = `${a.teacher?.fName || ''} ${a.teacher?.lName || ''}`;
            bVal = `${b.teacher?.fName || ''} ${b.teacher?.lName || ''}`;
        }

        if (aVal < bVal) return direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    const requestSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: string) => {
        if (!sortConfig || sortConfig.key !== key) return <span className="text-gray-300 ml-1 text-xs">↕</span>;
        return sortConfig.direction === 'asc' ? <span className="text-primary ml-1 text-xs">↑</span> : <span className="text-primary ml-1 text-xs">↓</span>;
    };

    // Handlers
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) setSelectedIds(sortedReviews.map(r => r.id));
        else setSelectedIds([]);
    };

    const handleSelectOne = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${selectedIds.length} reviews?`)) return;
        // ... (ใส่ Logic ยิง API Delete แบบ Bulk ที่นี่)
        setSelectedIds([]);
        fetchData();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this review?')) return;
        await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
        fetchData();
    };

    const openEditModal = (review: any) => {
        setEditData(review);
        setFormData({
            teacherId: review.teacherId,
            title: review.title,
            content: review.content,
            rating: review.rating,
            status: review.status
        });
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const url = editData ? `/api/admin/reviews/${editData.id}` : '/api/admin/reviews';
        const method = editData ? 'PUT' : 'POST';

        try {
            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            setIsAddModalOpen(false);
            setEditData(null);
            fetchData();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 text-gray-800 font-prompt pb-10">
            {/* Header & Controls */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">

                {/* แถวที่ 1: Search + Bulk Actions (ซ้าย) | Add Review (ขวา) */}
                <div className="flex flex-wrap items-center justify-between gap-4">

                    {/* กลุ่มเครื่องมือด้านซ้าย */}
                    <div className="flex flex-wrap items-center gap-4 flex-1">
                        {/* Search Bar */}
                        <div className="relative w-full max-w-sm">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search title or teacher..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full outline-none focus:ring-2 focus:ring-primary/20 transition"
                            />
                        </div>

                        {/* Bulk Actions */}
                        <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
                            <label className="flex items-center gap-2 cursor-pointer text-gray-500 text-sm">
                                <input
                                    type="checkbox"
                                    checked={sortedReviews.length > 0 && selectedIds.length === sortedReviews.length}
                                    onChange={handleSelectAll}
                                    className="rounded border-gray-300 w-4 h-4 accent-primary"
                                />
                                <span>Select all</span>
                            </label>
                            <div className="w-px h-4 bg-gray-300 mx-1"></div>
                            <button
                                disabled={selectedIds.length === 0}
                                onClick={handleBulkDelete}
                                className="text-gray-500 hover:text-red-500 disabled:opacity-30 transition"
                            >
                                <FiTrash2 size={16} />
                            </button>
                        </div>
                    </div>

                    {/* ปุ่ม Add Review ด้านขวา */}
                    <button
                        onClick={() => { setFormData(initialFormState); setIsAddModalOpen(true); }}
                        className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-blue-900 shadow-md whitespace-nowrap transition"
                    >
                        <FiPlus /> Add Review
                    </button>
                </div>

                {/* แถวที่ 2: Title (ซ้าย) | Status Filters (ขวา) */}
                <div className="flex flex-wrap items-center justify-between gap-6 pt-2">
                    {/* Title ด้านซ้าย */}
                    <div className="flex items-baseline gap-4">
                        <h1 className="text-2xl font-bold text-primary">Reviews</h1>
                        <span className="text-gray-400 text-sm">Manage teacher reviews & testimonials..</span>
                    </div>

                    {/* Status Filters ด้านขวา */}
                    <div className="flex items-center gap-4 md:gap-6 font-medium text-sm overflow-x-auto pb-2 md:pb-0">
                        <button onClick={() => setStatusFilter("All")} className={`px-4 py-1.5 rounded-full whitespace-nowrap cursor-pointer transition ${statusFilter === "All" ? "bg-gray-200 text-gray-800" : "text-gray-500 hover:bg-gray-100"}`}>
                            All : {counts.All}
                        </button>
                        <button onClick={() => setStatusFilter("Active")} className={`px-4 py-1.5 rounded-full whitespace-nowrap cursor-pointer transition text-green-600 ${statusFilter === "Active" ? "bg-green-100" : "hover:bg-gray-100"}`}>
                            Active : {counts.Active}
                        </button>
                        <button onClick={() => setStatusFilter("Hidden")} className={`px-4 py-1.5 rounded-full whitespace-nowrap cursor-pointer transition text-red-500 ${statusFilter === "Hidden" ? "bg-red-100" : "hover:bg-gray-100"}`}>
                            Hidden : {counts.Hidden}
                        </button>
                    </div>
                </div>
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="text-gray-400 border-b bg-white">
                            <tr>
                                <th className="py-4 px-4 font-normal w-10"></th>
                                <th className="py-4 px-4 font-normal cursor-pointer hover:text-gray-700 select-none" onClick={() => requestSort('teacherName')}>Teacher {getSortIcon('teacherName')}</th>
                                <th className="py-4 px-4 font-normal cursor-pointer hover:text-gray-700 select-none" onClick={() => requestSort('title')}>Review Title {getSortIcon('title')}</th>
                                <th className="py-4 px-4 font-normal cursor-pointer hover:text-gray-700 select-none" onClick={() => requestSort('rating')}>Rating {getSortIcon('rating')}</th>
                                <th className="py-4 px-4 font-normal cursor-pointer hover:text-gray-700 select-none" onClick={() => requestSort('status')}>Status {getSortIcon('status')}</th>
                                <th className="py-4 px-4 font-normal text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? <tr><td colSpan={6} className="text-center py-10 text-gray-500">Loading reviews...</td></tr>
                                : sortedReviews.length === 0 ? <tr><td colSpan={6} className="text-center py-10 text-gray-500">No reviews found.</td></tr>
                                    : sortedReviews.map((review) => (
                                        <tr key={review.id} className={`border-b border-gray-50 transition-colors ${selectedIds.includes(review.id) ? 'bg-blue-50/50' : 'hover:bg-gray-50/50'}`}>
                                            <td className="py-4 px-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(review.id)}
                                                    onChange={() => handleSelectOne(review.id)}
                                                    className="rounded border-gray-300 w-4 h-4 accent-primary cursor-pointer"
                                                />
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border">
                                                        {review.teacher?.image ? (
                                                            <img src={review.teacher.image} alt="avatar" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No</div>
                                                        )}
                                                    </div>
                                                    <span className="font-medium text-gray-700">
                                                        {review.teacher?.fName} {review.teacher?.lName}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-gray-600 truncate max-w-[200px]">{review.title}</td>
                                            <td className="py-4 px-4">
                                                <div className="flex text-[#F5B000]">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <span key={i} className={i < review.rating ? "opacity-100" : "opacity-30"}>★</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 font-bold">
                                                <span className={review.status ? "text-green-500" : "text-red-500"}>
                                                    {review.status ? 'Active' : 'Hidden'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <div className="flex items-center justify-center gap-3">
                                                    <button onClick={() => setViewData(review)} className="text-primary hover:scale-110 transition-transform" title="View"><FiEye size={16} /></button>
                                                    <button onClick={() => openEditModal(review)} className="text-primary hover:scale-110 transition-transform" title="Edit"><FiEdit size={16} /></button>
                                                    <button onClick={() => handleDelete(review.id)} className="text-primary hover:text-red-500 hover:scale-110 transition-transform" title="Delete"><FiTrash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ========================================= */}
            {/* MODALS AREA */}
            {/* ========================================= */}

            {/* 1. Modal: View Review Details */}
            {viewData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                        <div className="p-6 border-b flex justify-between items-center bg-white">
                            <h2 className="text-xl font-bold text-primary">Review Details</h2>
                            <button onClick={() => setViewData(null)} className="text-primary hover:bg-blue-50 p-2 rounded-full transition"><FiX size={18} /></button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="flex flex-col items-center gap-3 text-center mb-2">
                                <div className="w-20 h-20 bg-gray-100 rounded-full overflow-hidden border border-gray-200 shadow-sm">
                                    {viewData.teacher?.image ? (
                                        <img src={viewData.teacher.image} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">No Photo</div>
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-primary">{viewData.teacher?.fName} {viewData.teacher?.lName}</h2>
                                    <div className="flex justify-center text-[#F5B000] text-lg mt-1">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <span key={i} className={i < viewData.rating ? "opacity-100" : "opacity-30"}>★</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 border p-5 rounded-xl space-y-3">
                                <div>
                                    <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Title</p>
                                    <h3 className="font-bold text-gray-800 text-lg">"{viewData.title}"</h3>
                                </div>
                                <div className="w-full h-px bg-gray-200"></div>
                                <div>
                                    <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-2">Content</p>
                                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{viewData.content}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t flex justify-end gap-3 bg-gray-50">
                            <button onClick={() => setViewData(null)} className="px-6 py-2 text-gray-600 hover:bg-gray-200 rounded-full font-bold transition">Close</button>
                            <button onClick={() => { setViewData(null); openEditModal(viewData); }} className="bg-primary text-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-blue-900 transition">Edit Review</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Modal: Add & Edit Review */}
            {(isAddModalOpen || editData) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
                        <div className="p-6 border-b flex justify-between items-center bg-white shrink-0">
                            <h2 className="text-xl font-bold text-primary">{editData ? 'Edit Review' : 'Add New Review'}</h2>
                            <button onClick={() => { setIsAddModalOpen(false); setEditData(null); }} className="text-primary hover:bg-blue-50 p-2 rounded-full transition"><FiX size={18} /></button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="overflow-y-auto p-8 space-y-6 text-sm text-gray-700">

                            {/* General Information */}
                            <div className="space-y-4">
                                <h3 className="text-primary font-bold text-lg border-l-4 border-primary pl-3">Review Information</h3>

                                <div>
                                    <label className="block mb-1 text-gray-500">Teacher <span className="text-red-500">*</span></label>
                                    <select
                                        required
                                        value={formData.teacherId}
                                        onChange={e => setFormData({ ...formData, teacherId: e.target.value })}
                                        className="w-full border rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary bg-white"
                                    >
                                        <option value="">-- Select Teacher --</option>

                                        {/* 🛑 เพิ่ม Array.isArray() เช็คก่อน map */}
                                        {Array.isArray(teachers) && teachers.map(t => (
                                            <option key={t.id} value={t.id}>{t.fName} {t.lName}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-1 text-gray-500">Review Title <span className="text-red-500">*</span></label>
                                    <input
                                        required type="text" placeholder="Enter review title"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full border rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1 text-gray-500">Content <span className="text-red-500">*</span></label>
                                    <textarea
                                        required placeholder="Write the full review here..."
                                        value={formData.content}
                                        onChange={e => setFormData({ ...formData, content: e.target.value })}
                                        className="w-full border rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary h-32 resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-1 text-gray-500">Rating (1-5) <span className="text-red-500">*</span></label>
                                        <select
                                            required
                                            value={formData.rating}
                                            onChange={e => setFormData({ ...formData, rating: Number(e.target.value) })}
                                            className="w-full border rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary bg-white"
                                        >
                                            <option value={5}>5 - Excellent (⭐⭐⭐⭐⭐)</option>
                                            <option value={4}>4 - Good (⭐⭐⭐⭐)</option>
                                            <option value={3}>3 - Average (⭐⭐⭐)</option>
                                            <option value={2}>2 - Poor (⭐⭐)</option>
                                            <option value={1}>1 - Terrible (⭐)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-gray-500">Visibility Status <span className="text-red-500">*</span></label>
                                        <select
                                            required
                                            value={formData.status.toString()}
                                            onChange={e => setFormData({ ...formData, status: e.target.value === 'true' })}
                                            className="w-full border rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary bg-white"
                                        >
                                            <option value="true">🟢 Active (Show on Website)</option>
                                            <option value="false">🔴 Hidden (Do not show)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-4 border-t mt-6">
                                <button type="button" onClick={() => { setIsAddModalOpen(false); setEditData(null); }} className="px-6 py-2.5 rounded-full text-primary font-bold hover:bg-gray-50 transition">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="bg-primary text-white px-8 py-2.5 rounded-full font-bold hover:bg-blue-900 shadow-md disabled:opacity-50 transition">
                                    {isSubmitting ? 'Saving...' : editData ? 'Update Review' : 'Save Review'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}