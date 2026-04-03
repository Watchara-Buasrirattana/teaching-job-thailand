'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import { FiSearch, FiTrash2, FiEdit, FiEye, FiEyeOff, FiPlus, FiX } from 'react-icons/fi';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { BiSortAlt2 } from 'react-icons/bi';

export default function TeachersPage() {
    const [teachers, setTeachers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [activeTab, setActiveTab] = useState<'General' | 'Documents'>('General');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' | null }>({ key: '', direction: null });
    const [showPassport, setShowPassport] = useState(false);
    const [showWorkPermit, setShowWorkPermit] = useState(false);

    // --- Modal States ---
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [viewData, setViewData] = useState<any>(null); // สำหรับ Preview
    const [editData, setEditData] = useState<any>(null); // สำหรับ Edit
    const [docsData, setDocsData] = useState<any>(null); // สำหรับ Update Docs Status
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- Form States (ใช้ร่วมกันตอน Add / Edit) ---
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const photoRef = useRef<HTMLInputElement>(null);

    const initialFormState = {
        title: '',
        fName: '',
        lName: '',
        country: '',
        schoolProject: '',
        phone: '',
        email: '',
        passportNumber: '',
        visaExpiryDate: '',
        workPermitNumber: '',
        workPermitExpiryDate: '',
        status: 'Active'
    };
    const [formData, setFormData] = useState(initialFormState);

    const fetchTeachers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/teachers');
            if (res.ok) setTeachers((await res.json()).data || []);
        } catch (error) { console.error(error); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchTeachers(); }, []);

    // Filter & Sort
    const filteredTeachers = useMemo(() => {
        return teachers.filter(t => {
            const fullName = `${t.fName || ''} ${t.lName || ''}`.toLowerCase();
            const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || (t.email && t.email.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesStatus = statusFilter === "All" || t.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [teachers, searchQuery, statusFilter]);

    const sortedTeachers = useMemo(() => {
        let sortableItems = [...filteredTeachers];
        if (sortConfig.direction !== null && sortConfig.key !== '') {
            sortableItems.sort((a, b) => {
                let aValue = a[sortConfig.key] || '';
                let bValue = b[sortConfig.key] || '';
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [filteredTeachers, sortConfig]);

    const requestSort = (key: string) => {
        let direction: 'asc' | 'desc' | null = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        else if (sortConfig.key === key && sortConfig.direction === 'desc') direction = null;
        setSortConfig({ key, direction });
    };

    const getSortIcon = (columnKey: string) => {
        if (sortConfig.key !== columnKey || sortConfig.direction === null) return <FaSort className="text-gray-300 ml-1 inline" />;
        if (sortConfig.direction === 'asc') return <FaSortUp className="text-primary ml-1 inline" />;
        return <FaSortDown className="text-primary ml-1 inline" />;
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) setSelectedIds(sortedTeachers.map(t => t.id));
        else setSelectedIds([]);
    };

    const handleSelectOne = (id: string) => {
        if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
        else setSelectedIds([...selectedIds, id]);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลครูท่านนี้?")) return;
        try {
            await fetch(`/api/admin/teachers/${id}`, { method: 'DELETE' });
            fetchTeachers();
            setViewData(null);
        } catch (error) { }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Urgent': return 'text-red-500';
            case 'Warning': return 'text-yellow-500';
            case 'Processing': return 'text-blue-500';
            case 'Active': return 'text-green-500';
            default: return 'text-gray-500';
        }
    };

    const counts = {
        All: teachers.length,
        Urgent: teachers.filter(t => t.status === 'Urgent').length,
        Warning: teachers.filter(t => t.status === 'Warning').length,
        Processing: teachers.filter(t => t.status === 'Processing').length,
        Active: teachers.filter(t => t.status === 'Active').length,
    };

    // --- Action Handlers ---
    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const openEditModal = (teacher: any) => {
        setFormData({
            title: teacher.title || '',
            fName: teacher.fName || '',
            lName: teacher.lName || '',
            country: teacher.country || '',
            schoolProject: teacher.schoolProject || '',
            phone: teacher.phone || '',
            email: teacher.email || '',
            passportNumber: teacher.passportNumber || '',
            visaExpiryDate: teacher.visaExpiryDate ? teacher.visaExpiryDate.split('T')[0] : '',
            workPermitNumber: teacher.workPermitNumber || '',
            workPermitExpiryDate: teacher.workPermitExpiryDate ? teacher.workPermitExpiryDate.split('T')[0] : '',
            status: teacher.status || 'Active'
        });
        setPhoto(null);
        setPhotoPreview(teacher.image || null);
        setEditData(teacher);
    };

    // ส่งฟอร์ม Add / Edit
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('fName', formData.fName);
            data.append('lName', formData.lName);
            data.append('country', formData.country);
            data.append('schoolProject', formData.schoolProject);
            data.append('phone', formData.phone);
            data.append('email', formData.email);
            data.append('passportNumber', formData.passportNumber);
            data.append('visaExpiryDate', formData.visaExpiryDate);
            data.append('workPermitNumber', formData.workPermitNumber);
            data.append('workPermitExpiryDate', formData.workPermitExpiryDate);
            data.append('status', formData.status);
            if (photo) data.append('image', photo);

            const url = editData ? `/api/admin/teachers/${editData.id}` : '/api/admin/teachers';
            const method = editData ? 'PUT' : 'POST';

            const res = await fetch(url, { method, body: data });
            if (res.ok) {
                setIsAddModalOpen(false);
                setEditData(null);
                fetchTeachers();
                setFormData(initialFormState);
                setPhoto(null); setPhotoPreview(null);
            }
        } catch (error) { alert("Error"); }
        finally { setIsSubmitting(false); }
    };

    // ส่งฟอร์ม Update Docs Checklist
    const handleDocsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const data = new FormData();
            data.append('isDocsUpdate', 'true');
            data.append('docReady', docsData.docReady.toString());
            data.append('docSigned', docsData.docSigned.toString());
            data.append('docSubmitted', docsData.docSubmitted.toString());
            data.append('docCompleted', docsData.docCompleted.toString());
            data.append('docNote', docsData.docNote || '');
            data.append('visaExpiryDate', docsData.visaExpiryDate || '');
            data.append('workPermitExpiryDate', docsData.workPermitExpiryDate || '');

            const res = await fetch(`/api/admin/teachers/${docsData.id}`, { method: 'PUT', body: data });
            if (res.ok) {
                setDocsData(null);
                fetchTeachers();
                // ถ้าแก้จากหน้า Edit ให้ปิดหน้า Edit ด้วย เพื่อรีเฟรชข้อมูลใหม่
                setEditData(null);
            }
        } catch (error) { alert("Error"); }
        finally { setIsSubmitting(false); }
    };

    return (
        <div className="space-y-6 text-gray-800 font-prompt pb-10">
            {/* Header & Controls */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">

                {/* แถวที่ 1: Search + Bulk Actions (ซ้าย) | Add Teacher (ขวา) */}
                <div className="flex flex-wrap items-center justify-between gap-4">

                    {/* กลุ่มเครื่องมือด้านซ้าย */}
                    <div className="flex flex-wrap items-center gap-4 flex-1">
                        {/* Search Bar */}
                        <div className="relative w-full max-w-sm">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Name search..."
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
                                    checked={sortedTeachers.length > 0 && selectedIds.length === sortedTeachers.length}
                                    onChange={handleSelectAll}
                                    className="rounded border-gray-300 w-4 h-4 accent-primary"
                                />
                                <span>Select all</span>
                            </label>
                            <div className="w-px h-4 bg-gray-300 mx-1"></div>
                            <button disabled={selectedIds.length === 0} className="text-gray-500 hover:text-red-500 disabled:opacity-30 transition">
                                <FiTrash2 size={16} />
                            </button>
                        </div>
                            {/* Status Filters */}
                            <div className="flex items-center gap-4 md:gap-6 font-medium text-sm overflow-x-auto pb-2 md:pb-0">
                                <button onClick={() => setStatusFilter("All")} className={`px-4 py-1.5 rounded-full whitespace-nowrap cursor-pointer ${statusFilter === "All" ? "bg-gray-200 text-gray-800" : "text-gray-500 hover:bg-gray-100"}`}>
                                    All : {counts.All}
                                </button>
                                <button onClick={() => setStatusFilter("Urgent")} className={`px-4 py-1.5 rounded-full whitespace-nowrap cursor-pointer ${getStatusColor('Urgent')} ${statusFilter === "Urgent" ? "bg-gray-200 text-gray-800" : "hover:bg-gray-100"}`}>
                                    Urgent : {counts.Urgent}
                                </button>
                                <button onClick={() => setStatusFilter("Warning")} className={`px-4 py-1.5 rounded-full whitespace-nowrap cursor-pointer ${getStatusColor('Warning')} ${statusFilter === "Warning" ? "bg-gray-200 text-gray-800" : "hover:bg-gray-100"}`}>
                                    Warning : {counts.Warning}
                                </button>
                                <button onClick={() => setStatusFilter("Processing")} className={`px-4 py-1.5 rounded-full whitespace-nowrap cursor-pointer ${getStatusColor('Processing')} ${statusFilter === "Processing" ? "bg-gray-200 " : "hover:bg-gray-100"}`}>
                                    Processing : {counts.Processing}
                                </button>
                                <button onClick={() => setStatusFilter("Active")} className={`px-4 py-1.5 rounded-full whitespace-nowrap cursor-pointer ${getStatusColor('Active')} ${statusFilter === "Active" ? "bg-gray-200 text-gray-800" : "hover:bg-gray-100"}`}>
                                    Active : {counts.Active}
                                </button>
                            </div>
                    </div>

                    {/* ปุ่ม Add Teacher ด้านขวา */}
                    <button
                        onClick={() => { setFormData(initialFormState); setPhotoPreview(null); setIsAddModalOpen(true); }}
                        className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-blue-900 shadow-md whitespace-nowrap"
                    >
                        <FiPlus /> Add Teacher
                    </button>
                </div>

                {/* แถวที่ 2: Title (ซ้าย) | Status Filters (ขวา) */}
                <div className="flex flex-wrap items-center justify-between gap-6 pt-2">

                    {/* Title ด้านซ้าย */}
                    <div className="flex items-baseline gap-4">
                        <h1 className="text-2xl font-bold text-primary">Teachers</h1>
                        <span className="text-gray-400 text-sm">Manage teacher's information..</span>
                    </div>
                </div>
            </div>

            {/* Tabs & Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex border-b border-gray-200">
                    <button onClick={() => setActiveTab('General')} className={`px-6 py-4 font-bold text-sm transition-colors border-b-2 ${activeTab === 'General' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>General Info</button>
                    <button onClick={() => setActiveTab('Documents')} className={`px-6 py-4 font-bold text-sm transition-colors border-b-2 ${activeTab === 'Documents' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>Documents & Legal</button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="text-gray-400 border-b bg-white">
                            <tr>
                                <th className="py-4 px-4 font-normal w-10"></th>
                                {activeTab === 'General' ? (
                                    <>
                                        <th className="py-4 px-4 font-normal">Image</th>
                                        <th className="py-4 px-4 font-normal cursor-pointer hover:text-gray-700 select-none" onClick={() => requestSort('fName')}>Name {getSortIcon('fName')}</th>
                                        <th className="py-4 px-4 font-normal cursor-pointer hover:text-gray-700 select-none" onClick={() => requestSort('country')}>Country {getSortIcon('country')}</th>
                                        <th className="py-4 px-4 font-normal cursor-pointer hover:text-gray-700 select-none" onClick={() => requestSort('schoolProject')}>School / Project {getSortIcon('schoolProject')}</th>
                                        <th className="py-4 px-4 font-normal cursor-pointer hover:text-gray-700 select-none" onClick={() => requestSort('phone')}>Contact {getSortIcon('phone')}</th>
                                        <th className="py-4 px-4 font-normal cursor-pointer hover:text-gray-700 select-none" onClick={() => requestSort('email')}>Email {getSortIcon('email')}</th>
                                    </>
                                ) : (
                                    <>
                                        <th className="py-4 px-4 font-normal cursor-pointer hover:text-gray-700 select-none" onClick={() => requestSort('fName')}>Name {getSortIcon('fName')}</th>
                                        <th className="py-4 px-4 font-normal select-none">
                                            <div className="flex items-center gap-2">
                                                Passport No.
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassport(!showPassport)}
                                                    className="text-gray-400 hover:text-primary transition outline-none"
                                                >
                                                    {!showPassport ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                                                </button>
                                            </div>
                                        </th>
                                        <th className="py-4 px-4 font-normal cursor-pointer hover:text-gray-700 select-none" onClick={() => requestSort('visaExpiryDate')}>Visa Expiry {getSortIcon('visaExpiryDate')}</th>
                                        <th className="py-4 px-4 font-normal select-none">
                                            <div className="flex items-center gap-2">
                                                Work Permit No.
                                                <button
                                                    type="button"
                                                    onClick={() => setShowWorkPermit(!showWorkPermit)}
                                                    className="text-gray-400 hover:text-primary transition outline-none"
                                                >
                                                    {!showWorkPermit ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                                                </button>
                                            </div>
                                        </th>
                                        <th className="py-4 px-4 font-normal cursor-pointer hover:text-gray-700 select-none" onClick={() => requestSort('workPermitExpiryDate')}>WP Expiry {getSortIcon('workPermitExpiryDate')}</th>
                                        <th className="py-4 px-4 font-normal cursor-pointer hover:text-gray-700 select-none" onClick={() => requestSort('status')}>Status {getSortIcon('status')}</th>
                                    </>
                                )}
                                <th className="py-4 px-4 font-normal text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? <tr><td colSpan={8} className="text-center py-10">Loading...</td></tr>
                                : sortedTeachers.length === 0 ? <tr><td colSpan={8} className="text-center py-10">No teachers found.</td></tr>
                                    : sortedTeachers.map((teacher) => (
                                        <tr key={teacher.id} className={`border-b border-gray-50 transition-colors ${selectedIds.includes(teacher.id) ? 'bg-blue-50/50' : teacher.status === 'Urgent' ? 'bg-red-50 hover:bg-red-100/50' : 'hover:bg-gray-50/50'}`}>
                                            <td className="py-4 px-4"><input type="checkbox" checked={selectedIds.includes(teacher.id)} onChange={() => handleSelectOne(teacher.id)} className="rounded border-gray-300 w-4 h-4 accent-primary cursor-pointer" /></td>

                                            {activeTab === 'General' ? (
                                                <>
                                                    <td className="py-4 px-4"><div className="w-10 h-10 bg-gray-200 rounded-md overflow-hidden border">{teacher.image ? <img src={teacher.image} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-100"></div>}</div></td>
                                                    <td className="py-4 px-4 font-medium text-gray-700">{teacher.title} {teacher.fName} {teacher.lName}</td>
                                                    <td className="py-4 px-4 text-gray-500">{teacher.country || '-'}</td>
                                                    <td className="py-4 px-4 text-gray-500">{teacher.schoolProject || '-'}</td>
                                                    <td className="py-4 px-4 text-gray-500">{teacher.phone || '-'}</td>
                                                    <td className="py-4 px-4 text-gray-500">{teacher.email || '-'}</td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="py-4 px-4 font-medium text-gray-700">{teacher.fName} {teacher.lName}</td>
                                                    <td className="py-4 px-4 text-gray-500 font-mono tracking-widest">
                                                        {teacher.passportNumber ? (showPassport ? teacher.passportNumber : '*********') : '-'}
                                                    </td>
                                                    <td className="py-4 px-4 text-gray-500">{teacher.visaExpiryDate ? new Date(teacher.visaExpiryDate).toLocaleDateString('en-GB') : '-'}</td>
                                                    <td className="py-4 px-4 text-gray-500 font-mono tracking-widest">
                                                        {teacher.workPermitNumber ? (showWorkPermit ? teacher.workPermitNumber : '*********') : '-'}
                                                    </td>
                                                    <td className="py-4 px-4 text-gray-500">{teacher.workPermitExpiryDate ? new Date(teacher.workPermitExpiryDate).toLocaleDateString('en-GB') : '-'}</td>
                                                    <td className="py-4 px-4 font-bold"><span className={getStatusColor(teacher.status)}>{teacher.status}</span></td>
                                                </>
                                            )}

                                            {/* 👉 ปุ่ม Action ครบถ้วน! */}
                                            <td className="py-4 px-4 text-center">
                                                <div className="flex items-center justify-center gap-3">
                                                    <button onClick={() => setViewData(teacher)} className="text-primary hover:scale-110 transition-transform" title="View"><FiEye size={16} /></button>
                                                    <button onClick={() => openEditModal(teacher)} className="text-primary hover:scale-110 transition-transform" title="Edit"><FiEdit size={16} /></button>
                                                    <button onClick={() => handleDelete(teacher.id)} className="text-primary hover:text-red-500 hover:scale-110 transition-transform" title="Delete"><FiTrash2 size={16} /></button>
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

            {/* 1. Modal: Preview Teacher (R - Read) */}
            {viewData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
                        <div className="p-6 border-b flex justify-between items-center bg-white">
                            <h2 className="text-xl font-bold text-primary">Teacher Details</h2>
                            <button onClick={() => setViewData(null)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-full"><FiX size={18} /></button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="flex gap-6 items-start">
                                <div className="w-24 h-28 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200 shadow-sm">
                                    {viewData.image ? <img src={viewData.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400">No Photo</div>}
                                </div>
                                <div className="space-y-2 flex-1">
                                    <h2 className="text-2xl font-bold text-primary">{viewData.title} {viewData.fName} {viewData.lName}</h2>
                                    <div className="flex items-center gap-2">
                                        <span className={`w-3 h-3 rounded-sm ${viewData.status === 'Urgent' ? 'bg-red-500' : viewData.status === 'Warning' ? 'bg-yellow-500' : viewData.status === 'Processing' ? 'bg-blue-400' : 'bg-green-500'}`}></span>
                                        <span className="font-bold">{viewData.status}!</span>
                                    </div>
                                    <p className="text-gray-500 text-sm">Country : <span className="font-medium text-gray-800">{viewData.country}</span></p>
                                    <p className="text-gray-500 text-sm">School / Project : <span className="font-medium text-gray-800">{viewData.schoolProject}</span></p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-primary font-bold border-l-4 border-primary pl-3 mb-3">Contact Information</h3>
                                <div className="grid grid-cols-2 gap-4 border p-4 rounded-xl bg-gray-50/50">
                                    <div><p className="text-gray-500 text-sm">Phone Number</p><p className="font-bold">{viewData.phone || '-'}</p></div>
                                    <div><p className="text-gray-500 text-sm">Email Address</p><p className="font-bold">{viewData.email || '-'}</p></div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-primary font-bold border-l-4 border-primary pl-3 mb-3">Documents & Legal</h3>
                                <div className="grid grid-cols-2 gap-4 border p-4 rounded-xl bg-gray-50/50">
                                    <div><p className="text-gray-500 text-sm">Passport Number</p><p className="font-bold">{viewData.passportNumber || '-'}</p></div>
                                    <div><p className="text-gray-500 text-sm">Visa Expiry Date</p><p className="font-bold">{viewData.visaExpiryDate ? new Date(viewData.visaExpiryDate).toLocaleDateString('en-GB') : '-'}</p></div>
                                    <div><p className="text-gray-500 text-sm">Work Permit Number</p><p className="font-bold">{viewData.workPermitNumber || '-'}</p></div>
                                    <div><p className="text-gray-500 text-sm">Work Permit Expiry</p><p className="font-bold">{viewData.workPermitExpiryDate ? new Date(viewData.workPermitExpiryDate).toLocaleDateString('en-GB') : '-'}</p></div>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t flex justify-end gap-3 bg-gray-50">
                            <button onClick={() => setViewData(null)} className="px-6 py-2 text-gray-600 hover:bg-gray-200 rounded-full font-bold transition">Close</button>
                            <button onClick={() => { setViewData(null); openEditModal(viewData); }} className="bg-primary text-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-blue-900 transition">Edit Teacher</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Modal: Add & Edit Teacher (C & U - Create / Update) */}
            {(isAddModalOpen || editData) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">

                        <div className="p-6 border-b flex justify-between items-center bg-white shrink-0">
                            <h2 className="text-xl font-bold text-primary">{editData ? 'Edit Teacher' : 'Add New Teacher'}</h2>
                            <button onClick={() => { setIsAddModalOpen(false); setEditData(null); }} className="text-blue-500 hover:bg-blue-50 p-2 rounded-full"><FiX size={18} /></button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="overflow-y-auto p-8 space-y-8 text-sm text-gray-700">

                            {/* General Information */}
                            <div className="space-y-4">
                                <h3 className="text-primary font-bold text-lg border-l-4 border-primary pl-3">General Information</h3>
                                <div className="flex items-center gap-6">
                                    <div className="w-24 h-28 bg-gray-100 border flex items-center justify-center text-gray-400 overflow-hidden shrink-0">
                                        {photoPreview ? <img src={photoPreview} className="w-full h-full object-cover" /> : "No Photo"}
                                    </div>
                                    <div className="flex-1 border rounded-lg p-4">
                                        <p className="mb-1">Teacher Photo</p>
                                        <p className="text-[10px] text-gray-400 mb-3">Recommended: Square image, at least 200x200 px</p>
                                        <input type="file" accept="image/*" ref={photoRef} className="hidden" onChange={handlePhotoChange} />
                                        <button type="button" onClick={() => photoRef.current?.click()} className="bg-gray-100 w-full py-2 rounded-lg font-bold hover:bg-gray-200 transition">
                                            {photoPreview ? 'Change Photo' : 'Upload Photo'}
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-5 gap-4">
                                    <div className="col-span-1">
                                        <label className="block mb-1 text-gray-500">Title <span className="text-red-500">*</span></label>
                                        <select required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full border rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary">
                                            <option value="">Select</option>
                                            <option value="Mr.">Mr.</option>
                                            <option value="Ms.">Ms.</option>
                                            <option value="Mrs.">Mrs.</option>
                                        </select>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block mb-1 text-gray-500">First Name <span className="text-red-500">*</span></label>
                                        <input required type="text" placeholder="First Name" value={formData.fName} onChange={e => setFormData({ ...formData, fName: e.target.value })} className="w-full border rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block mb-1 text-gray-500">Last Name <span className="text-red-500">*</span></label>
                                        <input required type="text" placeholder="Last Name" value={formData.lName} onChange={e => setFormData({ ...formData, lName: e.target.value })} className="w-full border rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div className="col-span-1">
                                        <label className="block mb-1 text-gray-500">Country <span className="text-red-500">*</span></label>
                                        {/* เปลี่ยนจาก <select> เป็น <input type="text"> */}
                                        <input required type="text" placeholder="Enter country" value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })} className="w-full border rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary" />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block mb-1 text-gray-500">School / Project</label>
                                        <input type="text" placeholder="Enter school or project name" value={formData.schoolProject} onChange={e => setFormData({ ...formData, schoolProject: e.target.value })} className="w-full border rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary" />
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-4">
                                <h3 className="text-primary font-bold text-lg border-l-4 border-primary pl-3">Contact Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-1 text-gray-500">Phone Number <span className="text-red-500">*</span></label>
                                        <input required type="text" placeholder="xxx-xxx-xxxx" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full border rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary" />
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-gray-500">Email Address <span className="text-red-500">*</span></label>
                                        <input required type="email" placeholder="teacher@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full border rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary" />
                                    </div>
                                </div>
                            </div>

                            {/* Documents & Legal */}
                            <div className="space-y-4">
                                <h3 className="text-primary font-bold text-lg border-l-4 border-primary pl-3">Documents & Legal</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-1 text-gray-500">Passport Number <span className="text-red-500">*</span></label>
                                        <input required type="text" placeholder="XX1234567" value={formData.passportNumber} onChange={e => setFormData({ ...formData, passportNumber: e.target.value })} className="w-full border rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary" />
                                    </div>

                                    <div className="relative">
                                        <label className="block mb-1 text-gray-500">Visa Expiry Date <span className="text-red-500">*</span></label>
                                        <div className="flex gap-2 items-center">
                                            <input required type="date" value={formData.visaExpiryDate} onChange={e => setFormData({ ...formData, visaExpiryDate: e.target.value })} className="w-full border rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary" />
                                            {/* ปุ่มเล็กๆ ให้กดอัปเดตสถานะเอกสารตามภาพดีไซน์ */}
                                            {editData && (
                                                <button type="button" onClick={() => setDocsData({ ...editData, visaExpiryDate: formData.visaExpiryDate, workPermitExpiryDate: formData.workPermitExpiryDate })} className="border p-2.5 rounded-lg text-primary hover:bg-blue-50 transition" title="Update Docs Status"><FiEdit /></button>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-gray-500">Work Permit Number <span className="text-red-500">*</span></label>
                                        <input required type="text" placeholder="XX-123" value={formData.workPermitNumber} onChange={e => setFormData({ ...formData, workPermitNumber: e.target.value })} className="w-full border rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary" />
                                    </div>

                                    <div className="relative">
                                        <label className="block mb-1 text-gray-500">Work Permit Expiry Date <span className="text-red-500">*</span></label>
                                        <div className="flex gap-2 items-center">
                                            <input required type="date" value={formData.workPermitExpiryDate} onChange={e => setFormData({ ...formData, workPermitExpiryDate: e.target.value })} className="w-full border rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary" />
                                            {editData && (
                                                <button type="button" onClick={() => setDocsData({ ...editData, visaExpiryDate: formData.visaExpiryDate, workPermitExpiryDate: formData.workPermitExpiryDate })} className="border p-2.5 rounded-lg text-primary hover:bg-blue-50 transition" title="Update Docs Status"><FiEdit /></button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="w-1/2 pr-2">
                                    <label className="block mb-1 text-gray-500">Status <span className="text-red-500">*</span></label>
                                    <select required value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full border rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary">
                                        <option value="Active">🟢 Active</option>
                                        <option value="Processing">🔵 Processing</option>
                                        <option value="Warning">🟡 Warning</option>
                                        <option value="Urgent">🔴 Urgent</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-4 border-t mt-4">
                                <button type="button" onClick={() => { setIsAddModalOpen(false); setEditData(null); }} className="px-6 py-2.5 rounded-full text-blue-500 font-bold hover:bg-gray-50">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="bg-primary text-white px-8 py-2.5 rounded-full font-bold hover:bg-blue-900 shadow-md disabled:opacity-50">
                                    {isSubmitting ? 'Saving...' : editData ? 'Edit Teacher' : 'Add Teacher'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 3. Modal: Update Docs Status (Checkbox Process) */}
            {docsData && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden p-6 border-t-4 border-primary">
                        <h2 className="text-xl font-bold text-primary text-center mb-4">Update Docs Status</h2>
                        <p className="text-sm text-center text-gray-500 mb-6">Teacher: {docsData.title} {docsData.fName} {docsData.lName}</p>

                        <form onSubmit={handleDocsSubmit} className="space-y-4 text-sm">
                            <p className="text-gray-500 mb-1">Progress:</p>
                            <div className="space-y-2 border p-3 rounded-lg bg-blue-50/50">
                                <label className="flex items-center gap-3 cursor-pointer p-1">
                                    <input type="checkbox" checked={docsData.docReady} onChange={e => setDocsData({ ...docsData, docReady: e.target.checked })} className="w-4 h-4 accent-primary cursor-pointer" />
                                    <span>เตรียมเอกสาร (Ready)</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer p-1">
                                    <input type="checkbox" checked={docsData.docSigned} onChange={e => setDocsData({ ...docsData, docSigned: e.target.checked })} className="w-4 h-4 accent-primary cursor-pointer" />
                                    <span>สังกัดเซ็นแล้ว (Signed)</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer p-1">
                                    <input type="checkbox" checked={docsData.docSubmitted} onChange={e => setDocsData({ ...docsData, docSubmitted: e.target.checked })} className="w-4 h-4 accent-primary cursor-pointer" />
                                    <span>ยื่นแล้ว (Submitted)</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer p-1">
                                    <input type="checkbox" checked={docsData.docCompleted} onChange={e => setDocsData({ ...docsData, docCompleted: e.target.checked })} className="w-4 h-4 accent-primary cursor-pointer" />
                                    <span>รับเล่มคืน (Completed)</span>
                                </label>
                            </div>

                            <textarea
                                placeholder="Note here..."
                                value={docsData.docNote || ''}
                                onChange={e => setDocsData({ ...docsData, docNote: e.target.value })}
                                className="w-full border rounded-lg p-3 outline-none focus:ring-1 focus:ring-primary resize-none h-20"
                            ></textarea>

                            {/* เลื่อนวันหมดอายุได้ตรงนี้เลย */}
                            <div>
                                <label className="block mb-1 text-gray-500">New Expiry Date: <span className="text-red-500">*</span></label>
                                <input required type="date" value={docsData.visaExpiryDate} onChange={e => setDocsData({ ...docsData, visaExpiryDate: e.target.value })} className="w-full border rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary mb-2" />
                            </div>

                            <div className="pt-4 flex flex-col gap-3">
                                <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white py-3 rounded-full font-bold shadow-md hover:bg-blue-900 transition">
                                    {isSubmitting ? 'Updating...' : 'Confirm & Update'}
                                </button>
                                <button type="button" onClick={() => setDocsData(null)} className="w-full border border-gray-300 text-gray-500 py-3 rounded-full font-bold hover:bg-gray-50 transition">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}