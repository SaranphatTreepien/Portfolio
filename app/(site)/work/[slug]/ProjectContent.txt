"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation"; // ✅ 1. เพิ่ม hook สำหรับการนำทาง

// --- 🔒 ตั้งรหัสผ่าน Admin ตรงนี้ ---
const ADMIN_PASSWORD = "1234";

// --- Icons ---
const ArrowLeftIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>);
const EditIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>);
const TrashIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>);
const PlusIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>);
const UploadIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>);
const EyeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);
const LockIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>);
const UnlockIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>);
const FaTimes = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const CheckCircle = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-green-500"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ErrorCircle = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>;

export default function ExperienceEditor({ slug }) {
    const router = useRouter(); // ✅ 2. เรียกใช้ hook
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Auth States
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");
    const [pendingAction, setPendingAction] = useState(null);

    // Notification Toast State
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    // Modal States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [viewingProject, setViewingProject] = useState(null);
    const [mounted, setMounted] = useState(false);

    // Form State
    const [formData, setFormData] = useState({ title: "", description: "", img: "" });

    useEffect(() => {
        setMounted(true);
        if (slug) {
            fetchProjects();
        }
    }, [slug]);

    const fetchProjects = async () => {
        try {
            setIsLoading(true);
            const res = await fetch(`/api/projects?slug=${slug}`);
            const data = await res.json();
            setProjects(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveToDatabase = async (updatedProjects, successMessage = "บันทึกข้อมูลเรียบร้อย") => {
        try {
            await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    slug: slug,
                    items: updatedProjects
                }),
            });
            setProjects(updatedProjects);
            showToast(successMessage, "success");
        } catch (error) {
            showToast("เกิดข้อผิดพลาดในการบันทึก", "error");
        }
    };

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
    };

    const handleAuthCheck = (actionCallback) => {
        if (isAdmin) {
            actionCallback();
        } else {
            setPendingAction(() => actionCallback);
            setIsAuthModalOpen(true);
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (passwordInput === ADMIN_PASSWORD) {
            setIsAdmin(true);
            setIsAuthModalOpen(false);
            setPasswordInput("");
            showToast("เข้าสู่ระบบ Admin เรียบร้อย", "success");
            if (pendingAction) {
                pendingAction();
                setPendingAction(null);
            }
        } else {
            showToast("รหัสผ่านไม่ถูกต้อง", "error");
            setPasswordInput("");
        }
    };

    const toBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const handleAddNew = () => {
        handleAuthCheck(() => {
            setFormData({ title: "", description: "", img: "" });
            setEditingIndex(null);
            setIsEditModalOpen(true);
        });
    };

    const handleEdit = (index, item) => {
        handleAuthCheck(() => {
            setFormData({ ...item });
            setEditingIndex(index);
            setIsEditModalOpen(true);
        });
    };

    const handleBackupDownload = async () => {
        try {
            showToast("กำลังเตรียมไฟล์ Backup...", "success");

            const res = await fetch('/api/backup');
            if (!res.ok) throw new Error("Backup API Error");

            const data = await res.json();

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `projects-backup-${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            showToast("ดาวน์โหลด Backup สำเร็จ!", "success");
        } catch (error) {
            console.error("Backup Error:", error);
            showToast("เกิดข้อผิดพลาดในการ Backup", "error");
        }
    };

    const handleDelete = (index) => {
        handleAuthCheck(async () => {
            if (confirm("คุณแน่ใจหรือไม่ว่าจะลบรายการนี้? (กู้คืนไม่ได้)")) {
                const newProjects = projects.filter((_, i) => i !== index);
                await saveToDatabase(newProjects, "ลบข้อมูลเรียบร้อยแล้ว");
            }
        });
    };

    const handleView = (item) => setViewingProject(item);

    const handleSave = async (e) => {
        e.preventDefault();
        let newProjects = [...projects];

        if (editingIndex !== null) {
            newProjects[editingIndex] = formData;
        } else {
            newProjects = [formData, ...projects];
        }

        await saveToDatabase(newProjects, editingIndex !== null ? "แก้ไขข้อมูลสำเร็จ" : "เพิ่มข้อมูลสำเร็จ");
        setIsEditModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const base64Img = await toBase64(file);
            setFormData(prev => ({ ...prev, img: base64Img }));
        }
    };

    if (isLoading) return <div className="text-center py-20 animate-pulse text-gray-400">กำลังโหลดข้อมูล...</div>;

    return (
        <>
            <div className="max-w-7xl mx-auto px-4 py-10 relative">

                {/* ✅ 3. ปุ่มย้อนกลับ (Back Button) - วางไว้ด้านบนสุด */}
                <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ x: -4 }}
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-500 hover:text-[#7edad2] mb-8 transition-colors group w-fit"
                >
                    <div className="p-2 bg-white border border-gray-200 rounded-full shadow-sm group-hover:border-[#7edad2] transition-colors">
                        <ArrowLeftIcon />
                    </div>
                    <span className="font-medium text-sm">ย้อนกลับ</span>
                </motion.button>

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">จัดการประสบการณ์ทำงาน</h1>
                        <p className="text-gray-500 flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Online Mode {isAdmin && <span className="text-[#7edad2] font-semibold bg-[#7edad2]/10 px-2 py-0.5 rounded text-xs ml-2">ADMIN UNLOCKED</span>}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        {/* ปุ่ม Download Backup */}
                        {isAdmin && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleBackupDownload}
                                className="flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all text-sm border bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                </svg>
                                Backup
                            </motion.button>
                        )}
                        {/* ปุ่ม Login Admin */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                if (isAdmin) {
                                    setIsAdmin(false);
                                    showToast("ออกจากระบบ Admin แล้ว", "success");
                                } else {
                                    handleAuthCheck(() => { });
                                }
                            }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all text-sm border ${isAdmin ? 'bg-gray-100 text-gray-600 border-gray-200' : 'bg-white text-gray-500 border-gray-200 hover:border-[#7edad2] hover:text-[#7edad2]'}`}
                        >
                            {isAdmin ? <UnlockIcon /> : <LockIcon />}
                            {isAdmin ? "Logout" : "Admin Login"}
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAddNew}
                            className="flex items-center gap-2 bg-[#7edad2] hover:bg-[#6bcbc0] text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-[#7edad2]/30 transition-all"
                        >
                            <PlusIcon />
                            เพิ่มรายการใหม่
                        </motion.button>
                    </div>
                </div>

                {/* Grid Display */}
                {projects.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300 text-gray-400">
                        ยังไม่มีข้อมูลประสบการณ์ทำงาน กดปุ่ม "เพิ่มรายการใหม่" เพื่อเริ่มต้น
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((item, index) => (
                            <motion.div
                                key={index}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white rounded-3xl border border-gray-100 p-4 relative overflow-hidden group shadow-sm hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <button onClick={(e) => { e.stopPropagation(); handleView(item); }} className="p-2 bg-white/90 backdrop-blur text-gray-600 rounded-full shadow-md hover:bg-[#7edad2] hover:text-white transition"><EyeIcon /></button>
                                    <button onClick={(e) => { e.stopPropagation(); handleEdit(index, item); }} className="p-2 bg-white/90 backdrop-blur text-blue-500 rounded-full shadow-md hover:bg-blue-50 transition"><EditIcon /></button>
                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(index); }} className="p-2 bg-white/90 backdrop-blur text-red-500 rounded-full shadow-md hover:bg-red-50 transition"><TrashIcon /></button>
                                </div>

                                <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-gray-100 cursor-pointer" onClick={() => handleView(item)}>
                                    {item.img ? (
                                        <Image src={item.img} alt={`project-${index}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400">ไม่มีรูปภาพ</div>
                                    )}
                                </div>

                                <div className="pt-4 px-1">
                                    <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">{item.title || "ไม่มีชื่อหัวข้อ"}</h3>
                                    <div className="w-10 h-1 mb-3 bg-[#7edad2] rounded-full" />
                                    <p className="text-gray-500 text-sm line-clamp-3 font-light">{item.description || "ไม่มีรายละเอียด"}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Portals */}
            {mounted && createPortal(
                <>
                    {/* Auth Modal */}
                    <AnimatePresence>
                        {isAuthModalOpen && (
                            <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[10000] p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <motion.div
                                    className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl relative text-center"
                                    initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                                >
                                    <button onClick={() => { setIsAuthModalOpen(false); setPendingAction(null); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><FaTimes /></button>
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                                        <LockIcon />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">ยืนยันตัวตน Admin</h3>
                                    <p className="text-gray-500 text-sm mb-6">กรุณากรอกรหัสผ่านเพื่อดำเนินการต่อ</p>

                                    <form onSubmit={handleLogin}>
                                        <input
                                            type="password"
                                            autoFocus
                                            placeholder="Password"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl mb-4 text-center focus:border-[#7edad2] focus:ring-2 focus:ring-[#7edad2]/20 outline-none transition-all tracking-widest"
                                            value={passwordInput}
                                            onChange={(e) => setPasswordInput(e.target.value)}
                                        />
                                        <button type="submit" className="w-full py-3 bg-gray-800 hover:bg-black text-white rounded-xl font-semibold transition-all">ปลดล็อก</button>
                                    </form>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Notification Toast */}
                    <AnimatePresence>
                        {toast.show && (
                            <motion.div
                                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                                className="fixed inset-0 flex items-end justify-center pointer-events-none pb-12 z-[10001]"
                            >
                                <div className="bg-white/90 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl px-8 py-4 flex items-center gap-4">
                                    {toast.type === "success" ? <CheckCircle /> : <ErrorCircle />}
                                    <div>
                                        <h4 className={`font-bold ${toast.type === "success" ? "text-gray-800" : "text-red-600"}`}>
                                            {toast.type === "success" ? "สำเร็จ!" : "เกิดข้อผิดพลาด"}
                                        </h4>
                                        <p className="text-gray-600 text-sm">{toast.message}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Editor Modal */}
                    <AnimatePresence>
                        {isEditModalOpen && (
                            <motion.div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[9999] p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <motion.div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" initial={{ scale: 0.95, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 20, opacity: 0 }}>
                                    <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                        <h2 className="text-2xl font-bold text-gray-800">{editingIndex !== null ? "แก้ไขข้อมูล" : "เพิ่มประสบการณ์ใหม่"}</h2>
                                        <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
                                    </div>
                                    <div className="p-8 overflow-y-auto custom-scrollbar">
                                        <form id="project-form" onSubmit={handleSave} className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">รูปภาพหน้าปก</label>
                                                <div className="flex items-center gap-6">
                                                    <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex-shrink-0">
                                                        {formData.img ? <Image src={formData.img} alt="Preview" fill className="object-cover" /> : <div className="flex items-center justify-center h-full text-gray-400 text-xs text-center p-2">No Image</div>}
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors group">
                                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                <div className="text-gray-400 group-hover:text-[#7edad2] transition-colors mb-2"><UploadIcon /></div>
                                                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">คลิกเพื่ออัปโหลด</span></p>
                                                            </div>
                                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">หัวข้อ / ชื่อตำแหน่ง</label>
                                                <input type="text" name="title" required value={formData.title} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7edad2] outline-none" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">รายละเอียด</label>
                                                <textarea name="description" rows={5} value={formData.description} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7edad2] outline-none resize-none" />
                                            </div>
                                        </form>
                                    </div>
                                    <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                                        <button onClick={() => setIsEditModalOpen(false)} className="px-6 py-2.5 rounded-xl text-gray-600 hover:bg-gray-200">ยกเลิก</button>
                                        <button type="submit" form="project-form" className="px-6 py-2.5 rounded-xl bg-[#7edad2] hover:bg-[#6bcbc0] text-white font-semibold shadow-lg">บันทึกข้อมูล</button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Viewer Modal */}
                    <AnimatePresence>
                        {viewingProject && (
                            <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-[9999] p-4 md:p-8" onClick={() => setViewingProject(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <motion.div className="bg-white/95 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 relative max-w-5xl w-full max-h-[90vh] overflow-auto shadow-2xl border border-white/50" onClick={(e) => e.stopPropagation()} initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.98, opacity: 0, y: 10 }}>
                                    <button onClick={() => setViewingProject(null)} className="absolute top-5 right-5 text-gray-500 hover:text-white bg-gray-100 hover:bg-red-500 transition-colors rounded-full w-10 h-10 flex items-center justify-center text-2xl z-50 focus:outline-none"><FaTimes /></button>
                                    {viewingProject.img && <div className="relative w-full mb-8 rounded-3xl overflow-hidden shadow-lg bg-gray-50 min-h-[300px] md:min-h-[500px]"><Image src={viewingProject.img} alt="full-image" fill className="object-contain" /></div>}
                                    <div className="px-2 md:px-4"><h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">{viewingProject.title}</h2><p className="text-gray-700 text-lg whitespace-pre-wrap leading-8 font-light">{viewingProject.description}</p></div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
                , document.body)}
        </>
    );
}