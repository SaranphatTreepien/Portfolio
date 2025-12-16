"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter } from "next/navigation";



const ADMIN_PASSWORD = "1234";

// --- Icons ---
// ... icons เดิม ...
const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>;
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#7edad2]"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg>;
const Spinner = () => <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

export default function ExperienceEditor({ slug }) {
    const router = useRouter();
    // ✅ 1. เพิ่ม State สำหรับเก็บไฟล์ที่เลือกรออัปโหลด
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    // --- State ---
    const [project, setProject] = useState(null);
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [isAdmin, setIsAdmin] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");

    const [editMode, setEditMode] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItemIndex, setEditingItemIndex] = useState(null);
    const [viewingItem, setViewingItem] = useState(null);
    const [isZoomed, setIsZoomed] = useState(false);
    const [formData, setFormData] = useState({ title: "", description: "", img: "", category: "" });
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });
    // --- ✅ [ใหม่ 1] เพิ่ม State สำหรับเช็คสถานะการลาก ---
    const [isDragging, setIsDragging] = useState(false);
    const processFile = (file) => {
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            alert("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
            return;
        }
        setSelectedFile(file);
        setImagePreview(URL.createObjectURL(file));
    };
    // --- ✅ [ใหม่ 3] useEffect สำหรับดักจับ Ctrl+V (Paste) ---
    useEffect(() => {
        const handlePaste = (e) => {
            if (!isModalOpen) return; // ทำงานเฉพาะตอนเปิด Modal
            const items = e.clipboardData?.items;
            if (!items) return;

            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf("image") !== -1) {
                    const file = items[i].getAsFile();
                    processFile(file);
                    e.preventDefault(); // ป้องกันการ paste รูปซ้ำใน text area (ถ้ามี)
                    break;
                }
            }
        };

        window.addEventListener("paste", handlePaste);
        return () => window.removeEventListener("paste", handlePaste);
    }, [isModalOpen]);
    // --- ✅ [ใหม่ 4] Drag Event Handlers ---
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            processFile(files[0]);
        }
    };
    // เพิ่ม state นี้ไว้เก็บรูปที่จะโชว์ใน Modal 
    // --- Load Data ---
    useEffect(() => {
        if (slug) fetchProjectData();
    }, [slug]);
    // ฟังก์ชันสำหรับย่อรูปและแปลงเป็น JPG
    // ✅ 2. ฟังก์ชันจัดการเมื่อเลือกไฟล์ (โชว์ Preview ทันที แต่ยังไม่อัปโหลด)
    // --- ฟังก์ชันเดิม ---
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        processFile(file); // เปลี่ยนมาใช้ฟังก์ชันกลาง
    };

    // ✅ 3. ฟังก์ชันอัปโหลดไป Cloudinary
    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET);
        formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error?.message || "Upload failed");

            return data.secure_url; // ได้ Link รูปกลับมา
        } catch (error) {
            console.error("Cloudinary Error:", error);
            throw error;
        }
    };
    const fetchProjectData = async () => {
        try {
            setIsLoading(true);
            const res = await fetch(`/api/projects?slug=${slug}`);
            const data = await res.json();

            if (data && data.slug) {
                setProject(data);
                if (data.items && Array.isArray(data.items)) {
                    setItems(data.items);
                } else {
                    setItems([]);
                }
            }
        } catch (error) {
            console.error("Error fetching project:", error);
        } finally {
            setIsLoading(false);
        }
    };



    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ ...toast, show: false }), 3000);
    };

    // --- Actions ---
    // [ใหม่] ฟังก์ชันสำหรับลบ Project ทั้งอัน
    const handleDeleteProject = async () => {
        if (!confirm("⚠️ คำเตือน: คุณแน่ใจหรือไม่ที่จะลบหน้านี้ถาวร? การกระทำนี้ไม่สามารถย้อนกลับได้")) return;

        setIsSaving(true);
        try {
            // หมายเหตุ: ต้องตรวจสอบว่า API route รองรับ method 'DELETE' หรือไม่
            // หาก API ของคุณใช้ POST สำหรับการลบ ให้เปลี่ยน method เป็น 'POST' และส่ง body บอก action
            const res = await fetch(`/api/projects?slug=${slug}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                showToast("ลบหน้านี้เรียบร้อยแล้ว", "success");
                // ให้เวลานิดนึงก่อนเด้งกลับหน้าแรก
                setTimeout(() => {
                    router.push('/');
                }, 1000);
            } else {
                throw new Error("Failed to delete project");
            }
        } catch (error) {
            console.error(error);
            showToast("ลบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง", "error");
            setIsSaving(false);
        }
    };

    const handleSaveProjectInfo = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            // 1. เช็คว่ามีการเปลี่ยนรูปไหม? ถ้ามีให้อัปโหลดใหม่ ถ้าไม่มีใช้ Link เดิม
            let imageUrl = formData.img;
            if (selectedFile) {
                imageUrl = await uploadToCloudinary(selectedFile);
            }

            // 2. ส่งข้อมูลเข้า DB (ส่ง URL ไป)
            const payload = {
                ...formData,
                img: imageUrl, // ใช้ URL ใหม่ (หรือเก่า)
                slug,
                originalSlug: slug
            };

            await saveToDatabase(payload, "อัปเดตข้อมูลปกเรียบร้อย");

            setProject({ ...project, ...payload });
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            showToast("อัปโหลดรูปไม่สำเร็จ", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveItem = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            // 1. เช็คว่ามีการเปลี่ยนรูปไหม?
            let imageUrl = formData.img;
            if (selectedFile) {
                imageUrl = await uploadToCloudinary(selectedFile);
            }

            // 2. เตรียมข้อมูลใหม่
            const newItemData = { ...formData, img: imageUrl };

            let newItems = [...items];
            if (editingItemIndex !== null) {
                newItems[editingItemIndex] = newItemData;
            } else {
                newItems = [newItemData, ...items];
            }

            // 3. บันทึกลง DB
            await saveToDatabase({ slug, items: newItems, originalSlug: slug }, "บันทึกเนื้อหาเรียบร้อย");

            setItems(newItems);
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            showToast("เกิดข้อผิดพลาดในการบันทึก", "error");
        } finally {
            setIsSaving(false);
        }
    };
    const handleDeleteItem = async (index) => {
        if (!confirm("คุณแน่ใจหรือไม่ว่าจะลบรายการนี้?")) return;
        setIsSaving(true);
        const newItems = items.filter((_, i) => i !== index);
        // 👇 เพิ่ม originalSlug: slug ตรงนี้
        await saveToDatabase({ slug, items: newItems, originalSlug: slug }, "ลบรายการเรียบร้อย");
        setItems(newItems);
        setIsSaving(false);
    };
    const saveToDatabase = async (payload, successMsg) => {
        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                showToast(successMsg, "success");
            } else {
                // --- ส่วนที่แก้ไข: อ่าน Error จาก Server ---
                const errorData = await res.json().catch(() => ({})); // กันกรณี response ไม่ใช่ json
                console.error("SERVER ERROR DETAILS:", errorData); // ดูค่านี้ใน Console Browser
                console.error("STATUS CODE:", res.status);

                throw new Error(errorData.error || errorData.message || "Save failed (Unknown reason)");
            }
        } catch (error) {
            console.error("CATCH ERROR:", error);
            // แสดง Error message จริงๆ ใน Toast เพื่อให้รู้เรื่อง
            showToast(`บันทึกไม่สำเร็จ: ${error.message}`, "error");
        }
    };

    const openEditProject = () => {
        setEditMode('PROJECT');
        setFormData({
            title: project.title || "",
            description: project.description || "",
            img: project.img || "", // Link รูปเดิม
            category: project.category || ""
        });
        setImagePreview(project.img || null); // โชว์รูปเดิม
        setSelectedFile(null); // ✅ Reset ไฟล์ที่จะอัปโหลด
        setIsModalOpen(true);
    };

    const openAddItem = () => {
        setEditMode('ITEM');
        setEditingItemIndex(null);
        setFormData({ title: "", description: "", img: "", link: "" });
        setImagePreview(null);
        setSelectedFile(null); // ✅ Reset ไฟล์
        setIsModalOpen(true);
    };

    const openEditItem = (item, index) => {
        setEditMode('ITEM');
        setEditingItemIndex(index);
        setFormData({ ...item });
        setImagePreview(item.img || null);
        setSelectedFile(null); // ✅ Reset ไฟล์
        setIsModalOpen(true);
    };
    const handleLogin = (e) => {
        e.preventDefault();
        if (passwordInput === ADMIN_PASSWORD) {
            setIsAdmin(true);
            setIsAuthModalOpen(false);
            showToast("เข้าสู่ระบบ Admin สำเร็จ");
        } else {
            alert("รหัสผ่านไม่ถูกต้อง");
        }
    };


    if (isLoading) return <div className="text-center py-20 text-[#7edad2] animate-pulse font-bold tracking-widest">LOADING...</div>;
    if (!project) return <div className="text-center py-20 text-red-500">Project not found</div>;

    return (
        <div className="container mx-auto py-12 px-4 pb-40 text-gray-800">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-[#7edad2] transition-colors group">
                    <div className="p-2 bg-white border border-gray-200 rounded-full shadow-sm group-hover:shadow-md transition-all"><ArrowLeftIcon /></div>
                    <span className="font-medium">ย้อนกลับ</span>
                </button>
                {!isAdmin ? (
                    <button onClick={() => setIsAuthModalOpen(true)} className="text-xs text-gray-400 hover:text-[#7edad2] transition-colors">Admin Login</button>
                ) : (
                    <span className="text-[#7edad2] text-sm font-bold bg-[#7edad2]/10 px-4 py-1.5 rounded-full border border-[#7edad2]/20 shadow-sm">
                        ● Admin Mode
                    </span>
                )}
            </div>

            {/* ส่วนที่ 1: หน้าปก */}
            <div className="relative group mb-16">
                {isAdmin && (
                    /* [แก้ไข] เปลี่ยนจากปุ่มเดียว เป็น div เพื่อใส่ 2 ปุ่ม (แก้ไข + ลบ) */
                    <div className="absolute top-6 right-6 z-10 flex gap-2">
                        <button onClick={openEditProject} className="bg-white/90 backdrop-blur-md text-gray-700 px-5 py-2.5 rounded-full shadow-lg font-bold flex items-center gap-2 hover:bg-[#7edad2] hover:text-white transition-all duration-300 transform hover:-translate-y-1">
                            <EditIcon /> <span className="hidden sm:inline">แก้ไขหน้าปก</span>
                        </button>
                        <button onClick={handleDeleteProject} className="bg-red-500/90 backdrop-blur-md text-white px-5 py-2.5 rounded-full shadow-lg font-bold flex items-center gap-2 hover:bg-red-600 transition-all duration-300 transform hover:-translate-y-1">
                            <TrashIcon /> <span className="hidden sm:inline">ลบหน้านี้</span>
                        </button>
                    </div>
                )}
                <div className="max-w-5xl mx-auto bg-gradient-to-b from-gray-900 to-gray-800 p-6 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden text-white border border-gray-700">

                    {/* Background Glow */}
                    <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#7edad2]/20 rounded-full blur-[100px] pointer-events-none"></div>

                    <div className="relative w-full h-[250px] md:h-[450px] rounded-2xl overflow-hidden mb-8 shadow-inner bg-black/40 border border-white/5">
                        {project.img ? <Image src={project.img} alt={project.title} fill className="object-contain p-4" /> : <div className="flex items-center justify-center h-full text-gray-500">ไม่มีรูปภาพ</div>}
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                        <span className="bg-[#7edad2]/20 text-[#7edad2] px-4 py-1.5 rounded-full text-sm font-bold tracking-wide border border-[#7edad2]/30 shadow-[0_0_15px_rgba(126,218,210,0.2)]">
                            {project.category || "General"}
                        </span>
                    </div>

                    <h1 className="text-2xl md:text-4xl font-bold text-white mb-6 leading-tight tracking-tight drop-shadow-sm break-words">
                        {project.title}
                    </h1>

                    <div className="text-gray-200 whitespace-pre-wrap break-words leading-loose text-base md:text-lg font-light border-l-4 border-[#7edad2] pl-6">
                        {project.description || "ยังไม่มีรายละเอียด..."}
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-200/60 my-16 max-w-6xl mx-auto"></div>

            {/* ส่วนที่ 2: เนื้อหาด้านใน (Gallery) */}
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-end mb-10">
                    <div className="mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 inline-block relative">
                            Gallery & Content
                            {/* เส้นขีดใต้ปรับให้บางลงและชิดขึ้น */}
                            <span className="absolute bottom-[-8px] left-0 w-1/2 h-1 bg-[#7edad2] rounded-full"></span>
                        </h2>
                    </div>
                    {isAdmin && (
                        <button onClick={openAddItem} className="bg-[#7edad2] hover:bg-[#6bcbc0] text-white px-4 py-2 md:px-6 md:py-3 rounded-full font-bold flex items-center gap-2 shadow-lg shadow-[#7edad2]/40 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 active:scale-95 text-sm md:text-base">
                            <PlusIcon /> <span className="hidden md:inline">เพิ่มเนื้อหาใหม่</span><span className="md:hidden">เพิ่ม</span>
                        </button>
                    )}
                </div>

                {items.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-gray-400 flex flex-col items-center">
                        <span className="text-4xl mb-2">📂</span>
                        <span>ยังไม่มีเนื้อหาเพิ่มเติม</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {items.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => setViewingItem(item)}
                                className="bg-white rounded-3xl p-5 shadow-md group relative hover:shadow-2xl hover:shadow-[#7edad2]/10 transition-all duration-300 border border-gray-100 cursor-pointer transform hover:-translate-y-2"
                            >
                                {isAdmin && (
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 translate-y-2 group-hover:translate-y-0">
                                        <button onClick={(e) => { e.stopPropagation(); openEditItem(item, index); }} className="p-2.5 bg-white text-blue-500 rounded-full shadow-md hover:bg-blue-50 border border-gray-100"><EditIcon /></button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteItem(index); }} className="p-2.5 bg-white text-red-500 rounded-full shadow-md hover:bg-red-50 border border-gray-100"><TrashIcon /></button>
                                    </div>
                                )}
                                <div className="relative w-full h-56 bg-gray-50 rounded-2xl overflow-hidden mb-5 border border-gray-100">
                                    {item.img ? <Image
                                        src={item.img}
                                        alt="item"
                                        fill
                                        // ✅ เพิ่มบรรทัดนี้ครับ สำคัญมาก!
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    /> : <div className="flex items-center justify-center h-full text-gray-300 text-sm">No Image</div>}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1 group-hover:text-[#7edad2] transition-colors">{item.title}</h3>
                                <p className="text-gray-500 text-xs md:text-sm line-clamp-3 ...">{item.description}</p>
                                {/* ✅✅✅ แทรกส่วนแสดงปุ่มลิงก์บนการ์ด ตรงนี้ครับ ✅✅✅ */}
                                {item.link && (
                                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-start">
                                        <a
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()} // สำคัญ! ป้องกันไม่ให้เด้งเปิด Modal ซ้อน
                                            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-[#7edad2] transition-colors group/link"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover/link:scale-110 transition-transform">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                                            </svg>
                                            <span>เปิดลิงก์</span>
                                        </a>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ... Modals (คงเดิม ไม่มีการเปลี่ยนแปลงในส่วน Modals) ... */}
            {typeof document !== 'undefined' && createPortal(
                <>
                    {/* Toast Notification */}
                    <div className={`fixed bottom-6 right-6 z-[10001] transition-all duration-500 transform ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border ${toast.type === "success" ? "bg-white/90 border-[#7edad2]" : "bg-red-50 border-red-200"}`}>
                            {toast.type === "success" ? <CheckCircleIcon /> : <span className="text-red-500">⚠️</span>}
                            <div>
                                <h4 className={`font-bold text-sm ${toast.type === "success" ? "text-gray-800" : "text-red-600"}`}>
                                    {toast.type === "success" ? "Success" : "Error"}
                                </h4>
                                <p className="text-xs text-gray-500">{toast.message}</p>
                            </div>
                        </div>
                    </div>

                    {/* Auth Modal */}
                    {isAuthModalOpen && (
                        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center backdrop-blur-sm p-4 animate-in fade-in duration-200">
                            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-[#7edad2]"></div>
                                <h3 className="text-2xl font-bold mb-2 text-gray-800">Admin Access</h3>
                                <p className="text-gray-500 text-sm mb-6">กรุณายืนยันตัวตนเพื่อแก้ไขข้อมูล</p>
                                <form onSubmit={handleLogin}>
                                    <input
                                        type="password"
                                        autoFocus
                                        className="border border-gray-200 bg-gray-50 p-3 rounded-xl w-full mb-4 text-center text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7edad2] focus:bg-white transition-all text-lg tracking-widest"
                                        value={passwordInput}
                                        onChange={e => setPasswordInput(e.target.value)}
                                        placeholder="••••"
                                    />
                                    <div className="flex justify-center gap-3">
                                        <button type="button" onClick={() => setIsAuthModalOpen(false)} className="px-5 py-2 text-gray-500 hover:bg-gray-100 rounded-xl transition">Cancel</button>
                                        <button type="submit" className="bg-gray-900 text-white px-6 py-2 rounded-xl font-medium hover:bg-black transition shadow-lg">Login</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Edit Modal */}
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-300">
                            <div className="bg-white p-6 md:p-10 rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto text-black relative">
                                <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                                    <h3 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-3">
                                        <span className="w-2 h-8 bg-[#7edad2] rounded-full"></span>
                                        {editMode === 'PROJECT' ? "แก้ไขหน้าปก" : (editingItemIndex !== null ? "แก้ไขเนื้อหา" : "เพิ่มเนื้อหาใหม่")}
                                    </h3>
                                    <button onClick={() => setIsModalOpen(false)} className="text-gray-300 hover:text-red-500 text-3xl transition-colors">&times;</button>
                                </div>
                                <form onSubmit={editMode === 'PROJECT' ? handleSaveProjectInfo : handleSaveItem} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-700">หัวข้อ (Title)</label>
                                        <input required className="border border-gray-200 p-4 rounded-xl w-full bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7edad2] focus:bg-white transition-all shadow-sm" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="ใส่หัวข้อที่นี่..." />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-700">รายละเอียด (Description)</label>
                                        <textarea rows={6} className="border border-gray-200 p-4 rounded-xl w-full bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7edad2] focus:bg-white transition-all shadow-sm resize-none" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="เขียนรายละเอียด..." />
                                    </div>
                                    {/* ✅ แทรกส่วนนี้: ช่องกรอก Link */}
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-700">ลิงก์แนบ (Optional)</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                <LinkIcon />
                                            </div>
                                            <input
                                                type="url"
                                                className="border border-gray-200 pl-10 p-4 rounded-xl w-full bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7edad2] focus:bg-white transition-all shadow-sm"
                                                value={formData.link || ""} // กัน error กรณีค่าว่าง
                                                onChange={e => setFormData({ ...formData, link: e.target.value })}
                                                placeholder="https://www.example.com"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-700">รูปภาพ</label>
                                        <label
                                            // เพิ่ม Event Handlers สำหรับ Drag & Drop ที่ Label นี้
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                            className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-all group relative overflow-hidden
                                        ${isDragging
                                                    ? "border-[#7edad2] bg-[#7edad2]/10 scale-[1.02]" // สไตล์ตอนลากของเข้ามา
                                                    : "border-gray-300 bg-gray-50 hover:bg-[#7edad2]/5 hover:border-[#7edad2]"
                                                }
                                    `}
                                        >
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6 relative z-10">
                                                <svg className={`w-8 h-8 mb-3 transition-colors ${isDragging ? "text-[#7edad2]" : "text-gray-400 group-hover:text-[#7edad2]"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                                </svg>
                                                <p className="mb-1 text-sm text-gray-500 group-hover:text-[#7edad2] font-medium">
                                                    {isDragging ? "วางรูปภาพที่นี่" : "คลิกเพื่ออัปโหลดรูปภาพ หรือลากไฟล์มาวาง"}
                                                </p>
                                                <p className="text-xs text-gray-400">หรือกด <span className="bg-gray-200 px-1 rounded text-gray-600">Ctrl + V</span> เพื่อวางรูป</p>
                                            </div>

                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                            />
                                        </label>

                                        {/* Preview */}
                                        {(imagePreview || formData.img) && (
                                            <div className="mt-4 relative h-40 w-full rounded-xl overflow-hidden shadow-md border animate-in fade-in zoom-in duration-300">
                                                <Image
                                                    src={imagePreview || formData.img}
                                                    alt="preview"
                                                    fill
                                                    className="object-contain bg-gray-100"
                                                />
                                                {/* ปุ่มลบรูป preview (Optional) */}
                                                <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded cursor-pointer hover:bg-red-500 transition-colors"
                                                    onClick={() => {
                                                        setImagePreview(null);
                                                        setSelectedFile(null);
                                                        // ถ้าต้องการลบรูปเก่าด้วย uncomment บรรทัดล่าง
                                                        // setFormData({ ...formData, img: "" });
                                                    }}>
                                                    เปลี่ยนรูปใหม่
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-gray-500 hover:bg-gray-100 rounded-xl transition font-medium">ยกเลิก</button>
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="bg-[#7edad2] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#6bcbc0] shadow-lg shadow-[#7edad2]/30 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {isSaving ? <><Spinner /> กำลังบันทึก...</> : "บันทึกข้อมูล"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {viewingItem && (
                        <div
                            className="fixed inset-0 bg-black/95 z-[10000] flex items-center justify-center p-4 backdrop-blur-lg animate-in fade-in duration-300"
                            onClick={() => { setViewingItem(null); setIsZoomed(false); }} // ✅ รีเซ็ตซูมเมื่อปิด
                        >
                            <div
                                className="bg-white rounded-[2rem] overflow-hidden w-full max-w-[90vw] h-[85vh] flex flex-col relative shadow-2xl animate-in zoom-in-95 duration-300"
                                onClick={e => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => { setViewingItem(null); setIsZoomed(false); }}
                                    className="absolute top-4 right-4 z-20 p-2 bg-black/50 text-white rounded-full hover:bg-red-500 transition shadow-lg backdrop-blur-sm"
                                >
                                    <CloseIcon />
                                </button>

                                {/* --- Layout: เปลี่ยนเป็น Flex Row เพื่อแบ่งซ้ายขวา --- */}
                                <div className="flex flex-col md:flex-row h-full">

                                    {/* ✅ ส่วนที่ 1: พื้นที่รูปภาพ (แก้ใหม่) */}
                                    <div className="relative w-full md:w-3/4 h-[50vh] md:h-full bg-black border-r border-gray-800 overflow-hidden">

                                        {/* Wrapper สำหรับ Scroll: จัดการการเลื่อนเมื่อซูม */}
                                        <div
                                            className={`w-full h-full overflow-auto flex items-center justify-center custom-scrollbar ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                                            onClick={() => setIsZoomed(!isZoomed)}
                                        >
                                            {/* ตัวรูปภาพ */}
                                            <div
                                                className={`relative transition-all duration-300 ease-in-out flex-shrink-0 ${isZoomed
                                                    ? 'w-[150%] h-[150%]' // ซูม: ขยายพื้นที่ 1.5 เท่า
                                                    : 'w-full h-full p-4' // ปกติ: เต็มจอ + มีขอบนิดหน่อยให้ดูไม่อึดอัด
                                                    }`}
                                            >
                                                {viewingItem.img ? (
                                                    <Image
                                                        src={viewingItem.img}
                                                        alt={viewingItem.title}
                                                        fill
                                                        className="object-contain" // ✅ สำคัญ: จัดรูปให้อยู่ในกรอบเสมอ สัดส่วนไม่เพี้ยน
                                                        priority
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                        No Image
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* ปุ่ม Hint ลอยอยู่ด้านล่าง */}
                                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md text-white/80 text-xs px-4 py-1.5 rounded-full pointer-events-none border border-white/10">
                                            {isZoomed ? 'คลิกเพื่อย่อ' : 'คลิกเพื่อซูม'}
                                        </div>
                                    </div>

                                    {/* ✅ ส่วนที่ 2: พื้นที่เนื้อหา (ลดลงเหลือ 1/4 หรือ 25%) 
                   - ใส่ border-l เพื่อแบ่งเขต
                */}
                                    <div className="w-full md:w-1/4 bg-white p-6 md:p-8 overflow-y-auto border-l border-gray-100 flex flex-col shadow-[-10px_0_20px_rgba(0,0,0,0.05)] z-10">
                                        <div>
                                            <span className="inline-block px-3 py-1 rounded-full bg-[#7edad2]/10 text-[#7edad2] text-xs font-bold mb-4">
                                                DETAILS
                                            </span>
                                            <h2 className="text-2xl font-bold text-gray-800 mb-4 leading-tight">
                                                {viewingItem.title}
                                            </h2>
                                            <div className="w-10 h-1 bg-[#7edad2] rounded-full mb-6"></div>

                                            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                                                {viewingItem.description}
                                            </p>
                                        </div>

                                        {/* ปุ่ม Link (ถ้ามี) */}
                                        {viewingItem.link && (
                                            <div className="mt-8 pt-6 border-t border-gray-100">
                                                <a
                                                    href={viewingItem.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block w-full text-center bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-[#7edad2] transition-colors shadow-lg shadow-gray-200"
                                                >
                                                    เปิดลิงก์เพิ่มเติม
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>
                        </div>
                    )}
                </>
                , document.body)}
        </div>
    );
}