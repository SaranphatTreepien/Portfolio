"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PhotoIcon } from "@heroicons/react/24/outline";


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
    const [selectedFiles, setSelectedFiles] = useState([]); // เก็บ File objects
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imagePreviews, setImagePreviews] = useState([]);
    // --- State ---
    const [project, setProject] = useState(null);
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [isAdmin, setIsAdmin] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");
    const [showZoomBar, setShowZoomBar] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(100);
    const [editMode, setEditMode] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItemIndex, setEditingItemIndex] = useState(null);
    const [viewingItem, setViewingItem] = useState(null);
    const [isZoomed, setIsZoomed] = useState(false);
    const [formData, setFormData] = useState({ title: "", description: "", img: "", category: "" });
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });
    const [isDescExpanded, setIsDescExpanded] = useState(false);
    // --- ✅ [ใหม่ 1] เพิ่ม State สำหรับเช็คสถานะการลาก ---
    const [isDragging, setIsDragging] = useState(false);
    const processFiles = (files) => {
        if (!files || files.length === 0) return;

        const newFiles = Array.from(files).filter(file => file.type.startsWith("image/"));

        if (newFiles.length === 0) {
            alert("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
            return;
        }

        // ✅ เพิ่มไฟล์ใหม่เข้าไปต่อจากไฟล์เดิม
        setSelectedFiles(prev => [...prev, ...newFiles]);

        // สร้าง Preview URLs สำหรับไฟล์ที่เพิ่มมาใหม่
        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);
    };
    // --- ✅ [ใหม่ 3] useEffect สำหรับดักจับ Ctrl+V (Paste) ---
    useEffect(() => {
        const handlePaste = (e) => {
            // 1. ตรวจสอบว่าเปิด Modal อยู่หรือไม่
            if (!isModalOpen) return;

            const clipboardItems = e.clipboardData?.items;
            if (!clipboardItems) return;

            // สร้าง Array เพื่อเก็บไฟล์รูปภาพที่พบใน Clipboard
            const filesToProcess = [];

            for (let i = 0; i < clipboardItems.length; i++) {
                // 2. เช็คว่าสิ่งที่ Paste มามีประเภทเป็น "image"
                if (clipboardItems[i].type.indexOf("image") !== -1) {
                    const file = clipboardItems[i].getAsFile();
                    if (file) {
                        filesToProcess.push(file);
                    }
                }
            }

            // 3. ถ้าเจอรูปภาพ ให้หยุดการทำงานปกติของ Browser และส่งไปประมวลผล
            if (filesToProcess.length > 0) {
                e.preventDefault();
                // ส่งไฟล์เข้าไปในรูปแบบ Array เพื่อให้ตรงกับที่ processFiles ต้องการ
                processFiles(filesToProcess);
            }
        };

        window.addEventListener("paste", handlePaste);
        return () => window.removeEventListener("paste", handlePaste);
    }, [isModalOpen, processFiles]); // เพิ่ม processFiles เข้าไปใน dependencies
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
        processFiles(e.dataTransfer.files); // ส่งทั้งหมดที่ลากมา
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
        processFiles(e.target.files); // ส่งทั้งหมดที่เลือก
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
            // 1. เช็คเรื่องรูปภาพ
            let imageUrl = formData.img;
            if (selectedFile) {
                imageUrl = await uploadToCloudinary(selectedFile);
            }

            // 2. เตรียมข้อมูลเข้า DB
            const payload = {
                // ✅ ขั้นตอนสำคัญ: ดึงข้อมูลเดิมที่มีอยู่ในโปรเจกต์มาทั้งหมดก่อน (รวม isBest, isCertificate)
                ...project,

                // ✅ เอาค่าที่ได้จากฟอร์ม (Title, Description) มาทับค่าเดิม
                ...formData,

                img: imageUrl,
                slug: slug,
                originalSlug: slug
            };

            // 3. บันทึกลง Database
            await saveToDatabase(payload, "อัปเดตข้อมูลปกเรียบร้อย");

            // 4. อัปเดต State ในหน้าจอให้มีค่าครบถ้วน
            setProject(payload);

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
            // --- ส่วนที่ 1: จัดการเรื่องรูปภาพ ---

            // ดึงรูปเดิมที่มีอยู่แล้วใน DB มาตั้งต้น (ป้องกันรูปเก่าหาย)
            // ถ้าเป็น Array อยู่แล้วก็ใช้เลย ถ้าเป็น string ก็จับใส่ [] ถ้าไม่มีก็เป็น []
            let finalImageUrls = Array.isArray(formData.img)
                ? [...formData.img]
                : (formData.img ? [formData.img] : []);

            // ถ้ามีการเลือกรูปใหม่ (รออัปโหลด)
            if (selectedFiles && selectedFiles.length > 0) {
                // อัปโหลดทุกรูปพร้อมกันด้วย Promise.all
                const uploadPromises = selectedFiles.map(file => uploadToCloudinary(file));
                const newUploadedUrls = await Promise.all(uploadPromises);

                // เอา URL ใหม่ที่ได้จาก Cloudinary ไปต่อท้ายรูปเดิม
                finalImageUrls = [...finalImageUrls, ...newUploadedUrls];
            }

            // --- ส่วนที่ 2: เตรียมข้อมูล Item ---

            // สร้าง Object ข้อมูลใหม่ โดยเปลี่ยนช่อง img ให้เป็น Array (finalImageUrls)
            const newItemData = { ...formData, img: finalImageUrls };

            let newItems = [...items];
            if (editingItemIndex !== null) {
                // กรณี "แก้ไข": แทนที่ตำแหน่งเดิม
                newItems[editingItemIndex] = newItemData;
            } else {
                // กรณี "เพิ่มใหม่": เอาไว้บนสุด
                newItems = [newItemData, ...items];
            }

            // --- ส่วนที่ 3: บันทึกลง Database ---

            await saveToDatabase(
                { slug, items: newItems, originalSlug: slug },
                "บันทึกเนื้อหาเรียบร้อย"
            );

            // --- ส่วนที่ 4: อัปเดต UI และล้างค่า ---

            setItems(newItems);
            setIsModalOpen(false);

            // ⚠️ สำคัญ: อย่าลืมล้างค่าไฟล์ที่เลือกไว้ด้วย เพื่อไม่ให้ติดไปตอนเพิ่ม Item ถัดไป
            setSelectedFiles([]);
            setImagePreviews([]);

        } catch (error) {
            console.error("Save Error:", error);
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
                                    {/* ✅ ปรับการเช็คเงื่อนไขตรงนี้ */}
                                    {item.img && (Array.isArray(item.img) ? item.img.length > 0 : item.img !== "") ? (
                                        <Image
                                            src={Array.isArray(item.img) ? item.img[0] : item.img} // ถ้าเป็น Array เอาตัวแรก ถ้าเป็น string ใช้ตัวนั้นเลย
                                            alt={item.title || "item"}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        /* กรณีไม่มีรูปเลย ให้แสดง Placeholder หรือสีพื้นหลังว่างๆ */
                                        <div className="flex items-center justify-center h-full text-gray-300">
                                            <PhotoIcon className="w-10 h-10" />
                                        </div>
                                    )}
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
                                        <label className="block text-sm font-bold mb-2 text-gray-700">รูปภาพ (อัปโหลดได้หลายรูป)</label>
                                        <label
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                            className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-all group relative overflow-hidden
            ${isDragging
                                                    ? "border-[#7edad2] bg-[#7edad2]/10 scale-[1.02]"
                                                    : "border-gray-300 bg-gray-50 hover:bg-[#7edad2]/5 hover:border-[#7edad2]"
                                                }`}
                                        >
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6 relative z-10">
                                                <svg className={`w-8 h-8 mb-3 transition-colors ${isDragging ? "text-[#7edad2]" : "text-gray-400 group-hover:text-[#7edad2]"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                                </svg>
                                                <p className="mb-1 text-sm text-gray-500 group-hover:text-[#7edad2] font-medium">
                                                    {isDragging ? "วางรูปภาพที่นี่" : "คลิกเพื่ออัปโหลด หรือลากหลายรูปมาวาง"}
                                                </p>
                                                <p className="text-xs text-gray-400">หรือกด <span className="bg-gray-200 px-1 rounded text-gray-600">Ctrl + V</span> เพื่อวางรูป</p>
                                            </div>

                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                multiple // ✅ เพิ่มให้เลือกได้หลายรูป
                                                onChange={handleFileChange}
                                            />
                                        </label>

                                        {/* ✅ Preview Multi-Images: แสดงทั้งรูปเก่าใน DB และรูปใหม่ที่กำลังจะเพิ่ม */}
                                        {(imagePreviews.length > 0 || (Array.isArray(formData.img) && formData.img.length > 0)) && (
                                            <div className="mt-4 grid grid-cols-3 gap-3">

                                                {/* 1. แสดงรูปเก่าที่มีอยู่ใน Database */}
                                                {Array.isArray(formData.img) && formData.img.map((url, idx) => (
                                                    <div key={`old-${idx}`} className="relative h-24 rounded-lg overflow-hidden border group/item">
                                                        <Image src={url} alt="old-preview" fill className="object-cover" />
                                                        {/* ปุ่มลบรูปเก่า */}
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, img: formData.img.filter((_, i) => i !== idx) })}
                                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-lg hover:scale-110 transition-transform opacity-0 group-hover/item:opacity-100"
                                                        >
                                                            &times;
                                                        </button>
                                                        <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-[8px] text-white text-center py-0.5">Existing</div>
                                                    </div>
                                                ))}

                                                {/* 2. แสดงรูปใหม่ที่เพิ่งเลือก (รออัปโหลด) */}
                                                {imagePreviews.map((url, idx) => (
                                                    <div key={`new-${idx}`} className="relative h-24 rounded-lg overflow-hidden border-2 border-[#7edad2] group/item">
                                                        <Image src={url} alt="new-preview" fill className="object-cover" />
                                                        {/* ปุ่มลบรูปใหม่ */}
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setImagePreviews(prev => prev.filter((_, i) => i !== idx));
                                                                setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
                                                            }}
                                                            className="absolute top-1 right-1 bg-gray-800 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-lg hover:scale-110 transition-transform"
                                                        >
                                                            &times;
                                                        </button>
                                                        <div className="absolute bottom-0 left-0 right-0 bg-[#7edad2]/80 text-[8px] text-black font-bold text-center py-0.5 uppercase">New</div>
                                                    </div>
                                                ))}
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
                            className="fixed inset-0 bg-black/98 z-[10000] flex items-center justify-center backdrop-blur-md animate-in fade-in duration-500"
                            onClick={() => {
                                setViewingItem(null);
                                setZoomLevel(100);
                                setShowZoomBar(false);
                                setIsDescExpanded(false);
                            }}
                        >
                            <div
                                className="bg-[#0a0a0a] md:rounded-[2.5rem] overflow-hidden w-full max-w-[100vw] md:max-w-[90vw] h-full md:h-[92vh] flex flex-col md:flex-row relative shadow-2xl"
                                onClick={e => e.stopPropagation()}
                            >
                                {/* ปุ่มปิด Modal หลัก */}
                                <button
                                    onClick={() => { setViewingItem(null); setZoomLevel(100); setShowZoomBar(false); }}
                                    className="absolute top-4 right-4 z-50 p-3 bg-black/40 text-white rounded-full backdrop-blur-xl border border-white/10"
                                >
                                    <CloseIcon />
                                </button>

                                {/* --- ส่วนที่ 1: พื้นที่รูปภาพ (Focus Area) --- */}
                                {/* --- ส่วนที่ 1: พื้นที่รูปภาพ (Focus Area) --- */}
                                <div className="relative w-full md:w-[70%] h-[50vh] md:h-full bg-[#050505] flex-shrink-0 overflow-hidden group">

                                    {/* ปุ่ม Zoom controls (ถ้ามี) วางตรงนี้ */}

                                    {/* พื้นที่ Scroll รูปภาพ */}
                                    <div className="w-full h-full overflow-y-auto overflow-x-hidden custom-scrollbar snap-y snap-mandatory">
                                        <div
                                            className="flex flex-col items-center min-w-full min-h-full py-8 md:py-12 gap-4 md:gap-8"
                                            style={{ width: `${zoomLevel}%`, transition: zoomLevel === 100 ? 'width 0.3s' : 'none' }}
                                        >
                                            {Array.isArray(viewingItem.img) && viewingItem.img.length > 0 ? (
                                                viewingItem.img.map((url, index) => (
                                                    <div
                                                        key={index}
                                                        // ✅ แก้ไขบรรทัดนี้: บังคับความสูง h-[50vh] สำหรับมือถือ และ h-[85vh] สำหรับจอคอม
                                                        className="relative w-full shrink-0 snap-center flex items-center justify-center p-2 h-[50vh] md:h-[85vh]"
                                                    >
                                                        <div className="relative w-full h-full rounded-xl md:rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/50">
                                                            <Image
                                                                src={url}
                                                                alt={`${viewingItem.title}-${index + 1}`}
                                                                fill
                                                                className="object-contain"
                                                                priority={index === 0}
                                                            />
                                                        </div>

                                                        {/* ตัวเลขบอกลำดับภาพ */}
                                                        {viewingItem.img.length > 1 && zoomLevel === 100 && (
                                                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-white/80 px-4 py-1.5 rounded-full text-sm font-medium border border-white/10 pointer-events-none z-20">
                                                                {index + 1} / {viewingItem.img.length}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                // Fallback กรณีมีรูปเดียว หรือเป็น string
                                                <div className="relative w-full h-[50vh] md:h-[85vh] p-4 flex items-center justify-center">
                                                    <Image
                                                        src={Array.isArray(viewingItem.img) ? (viewingItem.img[0] || "") : viewingItem.img}
                                                        alt={viewingItem.title}
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* --- ส่วนที่ 2: เนื้อหา (เว้นบรรทัดตามเดิม + Read more) --- */}
                                <div className="w-full md:w-[30%] bg-[#111] p-6 md:p-10 overflow-y-auto border-t md:border-t-0 md:border-l border-white/10 z-20 flex flex-col">
                                    <div className="flex-1 text-left">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#7edad2] animate-pulse"></span>
                                            <span className="text-[#7edad2] text-[10px] font-bold tracking-[0.2em] uppercase">Lab List</span>
                                        </div>

                                        <h2 className="text-xl md:text-2xl font-bold text-white mb-4 leading-tight">
                                            {viewingItem.title}
                                        </h2>

                                        <div className="relative">
                                            {/* whitespace-pre-wrap สำหรับรายการ LAB-26, 27... */}
                                            <p className={`text-gray-400 text-sm md:text-base leading-relaxed whitespace-pre-wrap transition-all duration-500 ${!isDescExpanded ? 'line-clamp-[5] md:line-clamp-none' : ''}`}>
                                                {viewingItem.description}
                                            </p>

                                            <button
                                                onClick={() => setIsDescExpanded(!isDescExpanded)}
                                                className="md:hidden text-[#7edad2] text-[11px] font-black mt-4 flex items-center gap-2 py-2 px-4 bg-white/5 rounded-lg border border-white/10 uppercase tracking-widest"
                                            >
                                                {isDescExpanded ? 'Close List ▲' : 'Open Lab List ▼'}
                                            </button>
                                        </div>
                                    </div>

                                    {viewingItem.link && (
                                        <div className="mt-8 pt-6 border-t border-white/5">
                                            <a
                                                href={viewingItem.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 w-full bg-[#7edad2] text-[#0a0a0a] py-4 rounded-xl font-bold text-xs tracking-widest uppercase transition-transform active:scale-95 shadow-lg shadow-[#7edad2]/10"
                                            >
                                                Access Course
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </>
                , document.body)}
        </div>
    );
}