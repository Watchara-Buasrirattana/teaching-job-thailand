'use client';
import { useState, useRef, useEffect } from 'react';
import { FiSearch, FiTrash2, FiEdit, FiPlus, FiX, FiCheck, FiAlertTriangle } from 'react-icons/fi';

export default function ContentPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newsList, setNewsList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // เปลี่ยน editId เป็น string (UUID)
    const [editId, setEditId] = useState<string | null>(null);

    // --- 🟢 NEW: States สำหรับควบคุม Popup Modals ---
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showUnsavedModal, setShowUnsavedModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [newsToDelete, setNewsToDelete] = useState<any>(null); // เก็บข้อมูลข่าวที่จะลบ
    const [isFormDirty, setIsFormDirty] = useState(false); // เช็คว่ามีการพิมพ์ฟอร์มหรือยัง

    // Form States
    const [headlineTh, setHeadlineTh] = useState("");
    const [headlineEn, setHeadlineEn] = useState("");
    const [bodyTh, setBodyTh] = useState("");
    const [bodyEn, setBodyEn] = useState("");

    // Image States
    const [featuredImage, setFeaturedImage] = useState<File | null>(null);
    const [featuredPreview, setFeaturedPreview] = useState<string | null>(null);

    // Gallery States
    const [galleryImages, setGalleryImages] = useState<File[]>([]);
    const [existingGallery, setExistingGallery] = useState<string[]>([]);

    const featuredRef = useRef<HTMLInputElement>(null);
    const galleryRef = useRef<HTMLInputElement>(null);

    // 1. ดึงข้อมูล
    const fetchNews = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/news');
            const result = await res.json();
            if (result.success) setNewsList(result.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    // 2. รีเซ็ตฟอร์ม
    const resetForm = () => {
        setEditId(null);
        setHeadlineTh(""); setHeadlineEn("");
        setBodyTh(""); setBodyEn("");
        setFeaturedImage(null); setFeaturedPreview(null);
        setGalleryImages([]); setExistingGallery([]);
        setIsFormDirty(false); // ล้างค่าเช็คการแก้ไข
    };

    // 3. เพิ่มข่าวใหม่
    const handleAddNews = () => {
        resetForm();
        setIsModalOpen(true);
    };

    // 4. แก้ไขข่าว
    const handleEdit = (id: string) => {
        const news = newsList.find(n => n.id === id);
        if (!news) return alert("News not found");

        setEditId(news.id);
        setHeadlineTh(news.headlineTh || "");
        setHeadlineEn(news.headlineEn || "");
        setBodyTh(news.bodyTh || "");
        setBodyEn(news.bodyEn || "");
        setFeaturedPreview(news.featuredImage || null);
        setFeaturedImage(null);
        setExistingGallery(news.galleryImages || []);
        setGalleryImages([]);
        setIsFormDirty(false); // เริ่มต้นถือว่ายังไม่ได้แก้
        setIsModalOpen(true);
    };

    // 5. เลือกรูปปก
    const handleFeaturedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFeaturedImage(file);
            setFeaturedPreview(URL.createObjectURL(file));
            setIsFormDirty(true);
        }
    };

    // 6. เลือกรูป Gallery
    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setGalleryImages(prev => {
                const combined = [...prev, ...newFiles];
                if (existingGallery.length + combined.length > 4) {
                    alert("อัปโหลดแกลลอรี่รวมทั้งหมดได้สูงสุด 4 รูปเท่านั้นครับ");
                    return combined.slice(0, 4 - existingGallery.length);
                }
                setIsFormDirty(true);
                return combined;
            });
        }
    };

    const removeGalleryImage = (index: number) => {
        setGalleryImages(prev => prev.filter((_, i) => i !== index));
        setIsFormDirty(true);
    };
    const removeExistingGalleryImage = (index: number) => {
        setExistingGallery(prev => prev.filter((_, i) => i !== index));
        setIsFormDirty(true);
    };

    // 7. ปิด Add/Edit Modal แบบปลอดภัย (มีแจ้งเตือน)
    const handleCloseMainModal = () => {
        if (isFormDirty) {
            setShowUnsavedModal(true); // ถ้าพิมพ์แล้วให้โชว์เตือน
        } else {
            setIsModalOpen(false);
            resetForm();
        }
    };

    // 8. บันทึก
    const handleSubmit = async (status: 'Published' | 'Draft') => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('headlineTh', headlineTh);
            formData.append('headlineEn', headlineEn);
            formData.append('bodyTh', bodyTh);
            formData.append('bodyEn', bodyEn);
            formData.append('status', status);

            if (featuredImage) {
                formData.append('featuredImage', featuredImage);
            } else if (!featuredPreview && editId) {
                formData.append('removeFeatured', 'true');
            }

            formData.append('existingGallery', JSON.stringify(existingGallery));
            galleryImages.forEach(file => formData.append('galleryImages', file));

            const url = editId ? `/api/admin/news/${editId}` : '/api/admin/news';
            const method = editId ? 'PUT' : 'POST';

            const res = await fetch(url, { method, body: formData });
            const result = await res.json();

            if (result.success) {
                setIsModalOpen(false);
                fetchNews();
                resetForm();
                setShowSuccessModal(true); // โชว์ Popup Success
            } else {
                alert("Error: " + result.message);
            }
        } catch (error) {
            alert("Upload failed.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // 9. ลบข่าว (เรียก Popup ขึ้นมาถามก่อน)
    const handleDeleteClick = (news: any) => {
        setNewsToDelete(news);
        setShowDeleteModal(true);
    };

    // ยืนยันการลบจริงๆ (เมื่อกด Yes, delete!)
    const confirmDelete = async () => {
        if (!newsToDelete) return;
        try {
            const res = await fetch(`/api/admin/news/${newsToDelete.id}`, { method: 'DELETE' });
            const result = await res.json();
            if (result.success) {
                fetchNews();
                setShowDeleteModal(false);
                setNewsToDelete(null);
            } else {
                alert("ลบไม่สำเร็จ: " + result.message);
            }
        } catch (error) {
            alert("เกิดข้อผิดพลาดในการลบ");
        }
    };

    return (
        <div className="space-y-6 text-gray-800">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 flex-1">
                    <h1 className="text-xl font-bold text-primary">News Management</h1>
                </div>
                <button
                    onClick={handleAddNews}
                    className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-blue-900 shadow-md"
                >
                    <FiPlus /> Add News
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-gray-400 border-b bg-gray-50/50">
                            <tr>
                                <th className="py-3 px-4 font-normal w-20">Preview</th>
                                <th className="py-3 px-4 font-normal">Headline</th>
                                <th className="py-3 px-4 font-normal">Date</th>
                                <th className="py-3 px-4 font-normal">Language</th>
                                <th className="py-3 px-4 font-normal">Status</th>
                                <th className="py-3 px-4 font-normal text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={5} className="text-center py-10 text-gray-500">Loading...</td></tr>
                            ) : newsList.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-10 text-gray-500">No news found.</td></tr>
                            ) : (
                                newsList.map((news) => (
                                    <tr key={news.id} className="border-b border-gray-50 hover:bg-blue-50/50">
                                        <td className="py-3 px-4">
                                            {news.featuredImage ? (
                                                <div className="w-12 h-10 bg-gray-200 rounded object-cover overflow-hidden">
                                                    <img src={news.featuredImage} alt="preview" className="w-full h-full object-cover" />
                                                </div>
                                            ) : <div className="w-12 h-10 bg-gray-100 rounded"></div>}
                                        </td>
                                        <td className="py-3 px-4 text-gray-700">{news.headlineTh || news.headlineEn || "Untitled"}</td>
                                        <td className="py-3 px-4 text-gray-500">{new Date(news.createdAt).toLocaleDateString()}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex gap-2">
                                                {/* ถ้ามีหัวข้อภาษาไทย ให้โชว์ป้าย TH */}
                                                <span className={`font-bold px-2 py-2 rounded border ${news.headlineTh
                                                    ? 'bg-primary text-white border-primary' // สีทึบน้ำเงิน (มีข้อมูล)
                                                    : 'bg-transparent text-gray-400 border-gray-300' // สีโปร่งเทาจางๆ (ไม่มีข้อมูล)
                                                    }`}>
                                                    TH
                                                </span>

                                                {/* ถ้ามีหัวข้อภาษาอังกฤษ ให้โชว์ป้าย EN */}
                                                <span className={`font-bold px-2 py-2 rounded border ${news.headlineEn
                                                        ? 'bg-primary text-white border-primary' // สีทึบน้ำเงิน (มีข้อมูล)
                                                        : 'bg-transparent text-gray-400 border-gray-300' // สีโปร่งเทาจางๆ (ไม่มีข้อมูล)
                                                    }`}>
                                                    EN
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`italic ${news.status === 'Published' ? 'text-primary' : 'text-accent'}`}>{news.status}</span>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <button onClick={() => handleEdit(news.id)} className="text-blue-500 hover:scale-110 transition-transform mr-3">
                                                <FiEdit size={16} />
                                            </button>
                                            <button onClick={() => handleDeleteClick(news)} className="text-red-500 hover:scale-110 transition-transform">
                                                <FiTrash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MAIN MODAL: Add / Edit News */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-7xl h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b shrink-0 flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-primary">
                                    {editId ? "Edit News" : "Add News"}
                                </h2>
                            </div>
                            <button onClick={handleCloseMainModal} className="text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full">
                                <FiX size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 bg-gray-50/30">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">

                                {/* คอลัมน์ 1: TH */}
                                <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col">
                                    <h3 className="font-bold text-primary text-lg mb-4">ภาษาไทย (TH)</h3>
                                    <input value={headlineTh} onChange={(e) => { setHeadlineTh(e.target.value); setIsFormDirty(true); }} placeholder="Headline (TH)" className="w-full border p-3 rounded-lg mb-4 outline-none focus:border-primary" />
                                    <textarea value={bodyTh} onChange={(e) => { setBodyTh(e.target.value); setIsFormDirty(true); }} placeholder="Body (TH)" className="w-full h-full min-h-[200px] border p-3 rounded-lg outline-none focus:border-primary resize-none"></textarea>
                                </div>

                                {/* คอลัมน์ 2: EN */}
                                <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col">
                                    <h3 className="font-bold text-primary text-lg mb-4">English (EN)</h3>
                                    <input value={headlineEn} onChange={(e) => { setHeadlineEn(e.target.value); setIsFormDirty(true); }} placeholder="Headline (EN)" className="w-full border p-3 rounded-lg mb-4 outline-none focus:border-primary" />
                                    <textarea value={bodyEn} onChange={(e) => { setBodyEn(e.target.value); setIsFormDirty(true); }} placeholder="Body (EN)" className="w-full h-full min-h-[200px] border p-3 rounded-lg outline-none focus:border-primary resize-none"></textarea>
                                </div>

                                {/* คอลัมน์ 3: รูปภาพ */}
                                <div className="space-y-4 flex flex-col">

                                    {/* Featured Image */}
                                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                                        <label className="block text-gray-500 text-sm mb-2 font-bold">Featured Image (Cover):</label>
                                        <input type="file" ref={featuredRef} accept="image/*" className="hidden" onChange={handleFeaturedChange} />

                                        {featuredPreview ? (
                                            <div className="relative w-full aspect-video mb-3 rounded-lg overflow-hidden border">
                                                <img src={featuredPreview} className="w-full h-full object-cover" alt="Preview" />
                                                <button onClick={() => { setFeaturedImage(null); setFeaturedPreview(null); setIsFormDirty(true); }} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600">
                                                    <FiX size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div onClick={() => featuredRef.current?.click()} className="w-full aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg mb-3 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition">
                                                <FiPlus className="text-gray-400" size={24} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Gallery Upload */}
                                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                                        <label className="block text-gray-500 text-sm mb-2 font-bold">Gallery (Max 4):</label>
                                        <input type="file" multiple ref={galleryRef} accept="image/*" className="hidden" onChange={handleGalleryChange} />

                                        <div className="grid grid-cols-2 gap-2 mb-2">
                                            {existingGallery.map((imgPath, idx) => (
                                                <div key={`old-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border">
                                                    <img src={imgPath} className="w-full h-full object-cover" alt="Old Gallery" />
                                                    <button onClick={() => removeExistingGalleryImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 shadow-md">
                                                        <FiX size={12} />
                                                    </button>
                                                </div>
                                            ))}

                                            {galleryImages.map((file, idx) => (
                                                <div key={`new-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border">
                                                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="New Gallery" />
                                                    <button onClick={() => removeGalleryImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 shadow-md">
                                                        <FiX size={12} />
                                                    </button>
                                                </div>
                                            ))}

                                            {(existingGallery.length + galleryImages.length) < 4 && (
                                                <div onClick={() => galleryRef.current?.click()} className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100">
                                                    <FiPlus className="text-gray-400" size={20} />
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-blue-500 mb-2 font-medium">Selected: {existingGallery.length + galleryImages.length}/4</p>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-auto space-y-3 pt-4">
                                        <button onClick={() => handleSubmit('Draft')} disabled={isSubmitting} className="w-full border border-primary text-primary font-bold py-3 rounded-full hover:bg-blue-50 transition">
                                            Save as Draft
                                        </button>
                                        <button onClick={() => handleSubmit('Published')} disabled={isSubmitting} className="w-full bg-primary text-white font-bold py-3 rounded-full hover:bg-blue-900 transition shadow-lg disabled:bg-gray-400">
                                            {isSubmitting ? 'Saving...' : (editId ? 'Update & Publish' : 'Publish Now')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {/* ========================================================= */}
            {/* 🟢 POPUPS DESIGN AREA 🟢 */}
            {/* ========================================================= */}

            {/* 1. Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-md p-10 flex flex-col items-center text-center shadow-2xl zoom-in-95">
                        <div className="w-20 h-20 rounded-full border-2 border-yellow-400 flex items-center justify-center mb-6">
                            <FiCheck className="text-yellow-400 text-4xl" />
                        </div>
                        <h2 className="text-3xl font-bold text-primary mb-2">Success!</h2>
                        <p className="text-sm text-gray-700 mb-8 font-medium">Content has been published successfully!</p>
                        <button onClick={() => setShowSuccessModal(false)} className="bg-primary text-white px-12 py-3 rounded-full font-bold hover:bg-blue-900 transition-all w-full">
                            OK
                        </button>
                    </div>
                </div>
            )}

            {/* 2. Unsaved Changes Modal */}
            {showUnsavedModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-md p-10 flex flex-col items-center text-center shadow-2xl zoom-in-95">
                        <div className="mb-6 text-yellow-400">
                            <FiAlertTriangle size={72} strokeWidth={1.5} />
                        </div>
                        <h2 className="text-3xl font-bold text-primary mb-2">Unsaved Changes!</h2>
                        <p className="text-sm text-gray-700 mb-8 font-medium">Are you sure you want to leave this page? Your changes will not be saved.</p>
                        <div className="flex gap-4 w-full justify-center">
                            <button onClick={() => { setShowUnsavedModal(false); setIsModalOpen(false); resetForm(); }} className="border-2 border-gray-200 text-gray-600 px-6 py-3 rounded-full font-bold hover:bg-gray-50 transition-all flex-1">
                                Yes, leave page
                            </button>
                            <button onClick={() => setShowUnsavedModal(false)} className="bg-primary text-white px-6 py-3 rounded-full font-bold hover:bg-blue-900 transition-all flex-1">
                                No, keep editing
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. Delete News Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-md p-10 flex flex-col items-center text-center shadow-2xl zoom-in-95">
                        <div className="mb-6 text-yellow-400">
                            <FiAlertTriangle size={72} strokeWidth={1.5} />
                        </div>
                        <h2 className="text-3xl font-bold text-[#DF3000] mb-2">Delete News</h2>
                        <p className="text-sm text-gray-700 mb-8 font-medium">
                            You're going to delete "{newsToDelete?.headlineTh || newsToDelete?.headlineEn || 'Selected News'}"
                        </p>
                        <div className="flex gap-4 w-full justify-center">
                            <button onClick={() => { setShowDeleteModal(false); setNewsToDelete(null); }} className="border-2 border-gray-200 text-gray-600 px-6 py-3 rounded-full font-bold hover:bg-gray-50 transition-all flex-1">
                                No, keep it.
                            </button>
                            <button onClick={confirmDelete} className="bg-[#DF3000] text-white px-6 py-3 rounded-full font-bold hover:bg-orange-700 transition-all flex-1">
                                Yes, delete!
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}