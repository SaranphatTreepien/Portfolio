"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PhotoIcon } from "@heroicons/react/24/outline";
import Markdown from "./Markdown";

const OVERVIEW_COLLAPSE_CHARS = 900;

// Serve Cloudinary originals resized + auto format instead of the full-size upload.
const optimizeCloudinary = (url, width) =>
    typeof url === "string" && url.includes("res.cloudinary.com") && url.includes("/upload/") && !url.includes("/upload/f_auto")
        ? url.replace("/upload/", `/upload/f_auto,q_auto,c_limit,w_${width}/`)
        : url;

const toPlainText = (text = "") =>
    text
        .replace(/^#{1,6}\s+/gm, "")
        .replace(/^\s*[-*+]\s+/gm, "")
        .replace(/[*_`>]/g, "")
        .trim();

const isEmptyItem = (item) => {
    const hasImage = Array.isArray(item.img) ? item.img.some(Boolean) : Boolean(item.img);
    return !hasImage && !item.title && !item.description && !item.link;
};

// รหัสผ่านอยู่ใน .env.local (ADMIN_PASSWORD) — เช็คที่ server เท่านั้น

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

const ITEMS_PER_PAGE = 10;

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
    const [editMode, setEditMode] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItemIndex, setEditingItemIndex] = useState(null);
    const [viewingItem, setViewingItem] = useState(null);
    const [formData, setFormData] = useState({ title: "", description: "", img: "", category: "" });
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });
    const [isOverviewExpanded, setIsOverviewExpanded] = useState(false);
    // --- ✅ [ใหม่ 1] เพิ่ม State สำหรับเช็คสถานะการลาก ---
    const [isDragging, setIsDragging] = useState(false);
    const [draggedItemIndex, setDraggedItemIndex] = useState(null);
    const [dropHint, setDropHint] = useState({ index: null, position: null });
    const [currentPage, setCurrentPage] = useState(1);

    const listedItems = items
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => isAdmin || !isEmptyItem(item));

    useEffect(() => {
        const pageCount = Math.max(1, Math.ceil(listedItems.length / ITEMS_PER_PAGE));
        setCurrentPage(page => Math.min(page, pageCount));
    }, [listedItems.length]);

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
                setItems(Array.isArray(data.items) ? data.items : []);
            }
        } catch (error) {
            console.error("Error fetching project:", error);
        } finally {
            setIsLoading(false);
        }
    };
    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    };

    const saveToDatabaseStrict = async (payload) => {
        const res = await fetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || errorData.message || `Save failed (${res.status})`);
        }
    };

    const clearItemDragState = () => {
        setDraggedItemIndex(null);
        setDropHint({ index: null, position: null });
    };

    const reorderItems = async (fromIndex, targetIndex, position = "before") => {
        if (fromIndex === null || targetIndex === null) return;
        if (fromIndex === targetIndex) return;

        const nextItems = [...items];
        const [movedItem] = nextItems.splice(fromIndex, 1);

        let insertIndex = targetIndex;
        if (fromIndex < targetIndex) insertIndex -= 1;
        if (position === "after") insertIndex += 1;

        insertIndex = Math.max(0, Math.min(nextItems.length, insertIndex));
        nextItems.splice(insertIndex, 0, movedItem);

        setItems(nextItems);

        try {
            await saveToDatabaseStrict({ slug, items: nextItems, originalSlug: slug });
            showToast("บันทึกลำดับการ์ดเรียบร้อย", "success");
        } catch (error) {
            console.error("Reorder Error:", error);
            showToast("บันทึกลำดับไม่สำเร็จ", "error");
            await fetchProjectData();
        }
    };

    const handleItemDragStart = (e, index) => {
        if (!isAdmin) return;
        setDraggedItemIndex(index);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", String(index));
    };

    const handleItemDragOver = (e, index) => {
        if (!isAdmin || draggedItemIndex === null || draggedItemIndex === index) return;
        e.preventDefault();

        const rect = e.currentTarget.getBoundingClientRect();
        const position = e.clientY < rect.top + rect.height / 2 ? "before" : "after";
        setDropHint({ index, position });
        e.dataTransfer.dropEffect = "move";
    };

    const handleItemDrop = async (e, index) => {
        e.preventDefault();
        if (draggedItemIndex === null) return;

        const position = dropHint.index === index ? dropHint.position || "before" : "before";
        await reorderItems(draggedItemIndex, index, position);
        clearItemDragState();
    };

    const handleItemDragEnd = () => {
        clearItemDragState();
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

                // project.items อาจค้างค่าเก่า ใช้ items ปัจจุบันแทน กันการ์ดที่เพิ่ม/ลบไปแล้วถูกเขียนทับ
                items,
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
            // --- ส่วนที่ 1: จัดการเรื่องรูปภาพ (รูปทั้งหมดอยู่การ์ดเดียวกัน ใช้ title/description/link เดียวกัน) ---

            let finalImageUrls = Array.isArray(formData.img)
                ? formData.img.filter(Boolean)
                : (formData.img ? [formData.img] : []);

            // ถ้ามีการเลือกรูปใหม่ (รออัปโหลด)
            if (selectedFiles && selectedFiles.length > 0) {
                // อัปโหลดทุกรูปพร้อมกันด้วย Promise.all
                const uploadPromises = selectedFiles.map(file => uploadToCloudinary(file));
                const newUploadedUrls = await Promise.all(uploadPromises);

                // เอา URL ใหม่ที่ได้จาก Cloudinary ไปต่อท้ายรูปเดิม
                finalImageUrls = [...finalImageUrls, ...newUploadedUrls];
            }

            const newItem = {
                img: finalImageUrls,
                title: formData.title.trim(),
                description: formData.description.trim(),
                link: formData.link?.trim() || "",
            };

            let newItems = [...items];
            if (editingItemIndex !== null) {
                newItems.splice(editingItemIndex, 1, newItem);
            } else {
                newItems = [newItem, ...items];
            }

            newItems = newItems.map((item, index) => ({
                ...item,
                order: index + 1,
            }));

            // --- ส่วนที่ 3: บันทึกลง Database ---

            await saveToDatabase(
                { slug, items: newItems, originalSlug: slug },
                "บันทึกเนื้อหาเรียบร้อย"
            );

            // --- ส่วนที่ 4: อัปเดต UI และล้างค่า ---

            setItems(newItems);
            if (editingItemIndex === null) {
                setCurrentPage(1);
            }
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
        const reorderedItems = newItems.map((item, itemIndex) => ({
            ...item,
            order: itemIndex + 1,
        }));
        // 👇 เพิ่ม originalSlug: slug ตรงนี้
        await saveToDatabase({ slug, items: reorderedItems, originalSlug: slug }, "ลบรายการเรียบร้อย");
        setItems(reorderedItems);
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
        setFormData({
            title: "",
            description: "",
            img: "",
            link: "",
        });
        setImagePreview(null);
        setSelectedFile(null); // ✅ Reset ไฟล์
        setSelectedFiles([]);
        setImagePreviews([]);
        setIsModalOpen(true);
    };

    const openEditGalleryContent = () => {
        setEditMode('CONTENT');
        setEditingItemIndex(null);
        setFormData({
            title: project.galleryTitle || "เกี่ยวกับเนื้อหา",
            description: project.galleryDescription || "",
            img: "",
            link: project.galleryLink || "",
        });
        setIsModalOpen(true);
    };

    const handleSaveGalleryContent = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const contentFields = {
                galleryTitle: formData.title.trim() || "เกี่ยวกับเนื้อหา",
                galleryDescription: formData.description.trim(),
                galleryLink: formData.link?.trim() || "",
            };
            await saveToDatabase({ ...contentFields, slug, originalSlug: slug }, "บันทึกคำอธิบาย Gallery เรียบร้อย");
            setProject(prev => ({ ...prev, ...contentFields }));
            setIsModalOpen(false);
        } catch (error) {
            console.error("Gallery Content Error:", error);
            showToast("บันทึกคำอธิบายไม่สำเร็จ", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const openEditItem = (item, index) => {
        setEditMode('ITEM');
        setEditingItemIndex(index);
        setFormData({
            title: item.title || "",
            description: item.description || "",
            link: item.link || "",
            img: Array.isArray(item.img) ? item.img : (item.img ? [item.img] : []),
        });
        setImagePreview(item.img || null);
        setSelectedFile(null);       // ✅ Reset ไฟล์
        setSelectedFiles([]);        // ✅ Reset ไฟล์หลายรูป
        setImagePreviews([]);        // ✅ Reset previews
        setIsModalOpen(true);
    };
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/admin-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: passwordInput }),
            });
            if (res.ok) {
                setIsAdmin(true);
                setIsAuthModalOpen(false);
                setPasswordInput("");
                showToast("เข้าสู่ระบบ Admin สำเร็จ");
            } else {
                showToast("รหัสผ่านไม่ถูกต้อง", "error");
            }
        } catch (error) {
            showToast("เกิดข้อผิดพลาด กรุณาลองใหม่", "error");
        }
    };


    if (isLoading) return <div className="text-center py-20 text-[#7edad2] animate-pulse font-bold tracking-widest">LOADING...</div>;
    if (!project) return <div className="text-center py-20 text-red-500">Project not found</div>;

    const pageCount = Math.max(1, Math.ceil(listedItems.length / ITEMS_PER_PAGE));
    const pageStartIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const visibleItems = listedItems.slice(pageStartIndex, pageStartIndex + ITEMS_PER_PAGE);
    const isOverviewLong = (project.galleryDescription || "").length > OVERVIEW_COLLAPSE_CHARS;
    const isOverviewCollapsed = isOverviewLong && !isOverviewExpanded;
    const viewingImages = !viewingItem ? [] : Array.isArray(viewingItem.img) ? viewingItem.img.filter(Boolean) : (viewingItem.img ? [viewingItem.img] : []);

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
            <section className="relative mb-14 md:mb-20">
                {isAdmin && (
                    <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10 flex gap-2">
                        <button onClick={openEditProject} className="bg-white text-gray-700 px-4 py-2 rounded-full shadow-md font-bold flex items-center gap-2 hover:bg-[#7edad2] hover:text-white transition-colors">
                            <EditIcon /> <span className="hidden sm:inline">แก้ไขหน้าปก</span>
                        </button>
                        <button onClick={handleDeleteProject} className="bg-red-500 text-white px-4 py-2 rounded-full shadow-md font-bold flex items-center gap-2 hover:bg-red-600 transition-colors">
                            <TrashIcon /> <span className="hidden sm:inline">ลบหน้านี้</span>
                        </button>
                    </div>
                )}
                <div className="max-w-5xl mx-auto overflow-hidden rounded-[2rem] md:rounded-[2.5rem] border border-gray-800 bg-gray-900 bg-[radial-gradient(circle_at_100%_0%,rgba(126,218,210,0.16),transparent_45%)] text-white shadow-xl">
                    {project.img && (
                        <div className="bg-black/40 border-b border-white/5">
                            <img
                                src={optimizeCloudinary(project.img, 1600)}
                                alt={project.title}
                                decoding="async"
                                className="block w-full h-auto max-h-[70vh] object-contain mx-auto"
                            />
                        </div>
                    )}
                    <div className="p-6 md:p-12">
                        <span className="inline-flex bg-[#7edad2]/15 text-[#7edad2] px-3 py-1 rounded-full text-xs md:text-sm font-bold tracking-wide border border-[#7edad2]/30">
                            {project.category || "General"}
                        </span>
                        <h1 className="mt-4 text-2xl md:text-4xl font-bold leading-tight tracking-tight break-words">
                            {project.title}
                        </h1>
                        {project.description ? (
                            <div className="mt-5 border-l-4 border-[#7edad2] pl-4 md:pl-6">
                                <Markdown tone="dark">{project.description}</Markdown>
                            </div>
                        ) : (
                            <p className="mt-5 text-gray-400">ยังไม่มีรายละเอียด...</p>
                        )}
                    </div>
                </div>
            </section>

            {/* ส่วนที่ 2: ภาพรวมเนื้อหา */}
            <section className="max-w-6xl mx-auto">
                <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#2f9c93]">Content Overview</p>
                        <h2 className="mt-1 text-2xl md:text-3xl font-bold text-gray-900">{project.galleryTitle || "เกี่ยวกับเนื้อหา"}</h2>
                    </div>
                    {isAdmin && (
                        <button onClick={openEditGalleryContent} className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 shadow-sm hover:border-[#7edad2] hover:text-[#2f9c93] transition-colors">
                            <EditIcon /> แก้ไขคำอธิบาย
                        </button>
                    )}
                </div>

                <div className="rounded-3xl border border-gray-200/70 bg-white p-6 md:p-10 shadow-sm">
                    <div className={`relative ${isOverviewCollapsed ? "max-h-[520px] overflow-hidden" : ""}`}>
                        {project.galleryDescription ? (
                            <Markdown>{project.galleryDescription}</Markdown>
                        ) : (
                            <p className="text-gray-400">เพิ่มคำอธิบายเพื่อเล่าให้ผู้ชมเข้าใจว่า Gallery นี้เกี่ยวกับอะไร และคุณทำอะไรไว้บ้าง</p>
                        )}
                        {isOverviewCollapsed && (
                            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent" />
                        )}
                    </div>
                    {(isOverviewLong || project.galleryLink) && (
                        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-5">
                            {isOverviewLong && (
                                <button
                                    type="button"
                                    onClick={() => setIsOverviewExpanded(prev => !prev)}
                                    className="rounded-full bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-black transition-colors"
                                >
                                    {isOverviewExpanded ? "ย่อเนื้อหา" : "อ่านเพิ่มเติม"}
                                </button>
                            )}
                            {project.galleryLink && (
                                <a
                                    href={project.galleryLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full border border-[#7edad2]/50 px-5 py-2 text-sm font-semibold text-[#2f9c93] hover:bg-[#7edad2]/10 transition-colors"
                                >
                                    <LinkIcon /> เปิดลิงก์ที่เกี่ยวข้อง
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* ส่วนที่ 3: Gallery */}
            <section className="max-w-6xl mx-auto mt-14 md:mt-20">
                <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#2f9c93]">Gallery</p>
                        <h2 className="mt-1 text-2xl md:text-3xl font-bold text-gray-900">
                            ภาพผลงาน <span className="text-base font-medium text-gray-400">({listedItems.length})</span>
                        </h2>
                    </div>
                    {isAdmin && (
                        <div className="flex items-center gap-3">
                            <span className="hidden md:inline text-xs text-gray-400">ลากการ์ดเพื่อจัดลำดับ</span>
                            <button onClick={openAddItem} className="bg-[#7edad2] hover:bg-[#6bcbc0] text-white px-4 py-2 md:px-5 rounded-full font-bold flex items-center gap-2 shadow-md transition-colors text-sm md:text-base">
                                <PlusIcon /> <span>เพิ่มเนื้อหาใหม่</span>
                            </button>
                        </div>
                    )}
                </div>

                {listedItems.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-200 text-gray-400 flex flex-col items-center gap-2">
                        <PhotoIcon className="w-10 h-10 text-gray-300" />
                        <span>ยังไม่มีเนื้อหาเพิ่มเติม</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                        {visibleItems.map(({ item, index }) => {
                            const imgArray = Array.isArray(item.img) ? item.img.filter(Boolean) : (item.img ? [item.img] : []);
                            const hasImages = imgArray.length > 0;
                            const hasText = Boolean(item.title || item.description);
                            const isEmpty = isEmptyItem(item);
                            const isDragged = draggedItemIndex === index;
                            const isDropBefore = dropHint.index === index && dropHint.position === "before";
                            const isDropAfter = dropHint.index === index && dropHint.position === "after";
                            return (
                            <article
                                key={index}
                                onClick={isEmpty ? undefined : () => setViewingItem(item)}
                                draggable={isAdmin}
                                onDragStart={(e) => handleItemDragStart(e, index)}
                                onDragOver={(e) => handleItemDragOver(e, index)}
                                onDrop={(e) => handleItemDrop(e, index)}
                                onDragEnd={handleItemDragEnd}
                                className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white transition-[border-color,box-shadow] duration-200 hover:border-[#7edad2] hover:shadow-lg ${isEmpty ? "border-dashed border-gray-300" : "border-gray-200/70 shadow-sm cursor-pointer"} ${isAdmin ? "cursor-grab active:cursor-grabbing" : ""} ${isDragged ? "opacity-50" : ""}`}
                            >
                                {isAdmin && (
                                    <>
                                        <div className={`absolute left-3 right-3 top-1.5 z-20 h-1 rounded-full ${isDropBefore ? "bg-[#7edad2]" : "hidden"}`} />
                                        <div className={`absolute left-3 right-3 bottom-1.5 z-20 h-1 rounded-full ${isDropAfter ? "bg-[#7edad2]" : "hidden"}`} />
                                        <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                            <button onClick={(e) => { e.stopPropagation(); openEditItem(item, index); }} className="p-2 bg-white text-blue-500 rounded-full shadow-md hover:bg-blue-50 border border-gray-100"><EditIcon /></button>
                                            <button onClick={(e) => { e.stopPropagation(); handleDeleteItem(index); }} className="p-2 bg-white text-red-500 rounded-full shadow-md hover:bg-red-50 border border-gray-100"><TrashIcon /></button>
                                        </div>
                                    </>
                                )}

                                {hasImages && (
                                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 border-b border-gray-100">
                                        <Image
                                            src={imgArray[0]}
                                            alt={item.title || project.title || "gallery image"}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                                            className="object-cover object-top"
                                        />
                                        {imgArray.length > 1 && (
                                            <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-2.5 py-1 text-xs font-semibold text-white">
                                                +{imgArray.length - 1} รูป
                                            </span>
                                        )}
                                    </div>
                                )}

                                {(hasText || item.link) && (
                                    <div className={`flex flex-1 flex-col gap-1.5 p-4 md:p-5 ${hasImages ? "" : "border-l-4 border-[#7edad2]"}`}>
                                        {item.title && (
                                            <h3 className="font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-[#2f9c93] transition-colors">{item.title}</h3>
                                        )}
                                        {item.description && (
                                            <p className={`text-sm leading-6 text-gray-500 ${hasImages ? "line-clamp-2" : "line-clamp-5"}`}>{toPlainText(item.description)}</p>
                                        )}
                                        {item.link && (
                                            <a
                                                href={item.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="mt-auto pt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#2f9c93] hover:text-[#1f7f77] transition-colors"
                                            >
                                                <LinkIcon /> <span>เปิดลิงก์</span>
                                            </a>
                                        )}
                                    </div>
                                )}

                                {isEmpty && (
                                    <div className="flex h-40 flex-col items-center justify-center gap-2 text-gray-400">
                                        <PhotoIcon className="w-8 h-8" />
                                        <span className="text-xs">รายการว่าง (เห็นเฉพาะ Admin) — ลบได้</span>
                                    </div>
                                )}
                            </article>
                            );
                        })}
                    </div>
                )}

                {pageCount > 1 && (
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-10">
                        <button
                            type="button"
                            onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-full border border-gray-200 text-sm font-semibold text-gray-600 transition-colors hover:border-[#7edad2] hover:text-[#5bbeb5] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            ก่อนหน้า
                        </button>
                        {Array.from({ length: pageCount }, (_, index) => index + 1).map(page => (
                            <button
                                type="button"
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 rounded-full text-sm font-bold transition-colors ${
                                    currentPage === page
                                        ? "bg-[#7edad2] text-white shadow-md"
                                        : "border border-gray-200 text-gray-600 hover:border-[#7edad2] hover:text-[#5bbeb5]"
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={() => setCurrentPage(page => Math.min(pageCount, page + 1))}
                            disabled={currentPage === pageCount}
                            className="px-4 py-2 rounded-full border border-gray-200 text-sm font-semibold text-gray-600 transition-colors hover:border-[#7edad2] hover:text-[#5bbeb5] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            ถัดไป
                        </button>
                        <span className="w-full text-center text-xs text-gray-400">
                            หน้า {currentPage} จาก {pageCount} ({listedItems.length} รายการ)
                        </span>
                    </div>
                )}
            </section>

            {/* ... Modals (คงเดิม ไม่มีการเปลี่ยนแปลงในส่วน Modals) ... */}
            {typeof document !== 'undefined' && createPortal(
                <>
                    {/* Toast Notification */}
                    {toast.show && (
                    <div className="fixed bottom-6 right-6 z-[10001] animate-in fade-in slide-in-from-bottom-4 duration-200">
                        <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border ${toast.type === "success" ? "bg-white border-[#7edad2]" : "bg-red-50 border-red-200"}`}>
                            {toast.type === "success" ? <CheckCircleIcon /> : <span className="text-red-500">⚠️</span>}
                            <div>
                                <h4 className={`font-bold text-sm ${toast.type === "success" ? "text-gray-800" : "text-red-600"}`}>
                                    {toast.type === "success" ? "Success" : "Error"}
                                </h4>
                                <p className="text-xs text-gray-500">{toast.message}</p>
                            </div>
                        </div>
                    </div>
                    )}

                    {/* Auth Modal */}
                    {isAuthModalOpen && (
                        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
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
                        <div className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
                            <div className="bg-white p-6 md:p-10 rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto text-black relative">
                                <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                                    <h3 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-3">
                                        <span className="w-2 h-8 bg-[#7edad2] rounded-full"></span>
                                        {editMode === 'PROJECT' ? "แก้ไขหน้าปก" : editMode === 'CONTENT' ? "แก้ไขภาพรวมเนื้อหา" : (editingItemIndex !== null ? "แก้ไขรูปภาพและคำอธิบาย" : "เพิ่มรูปภาพและคำอธิบาย")}
                                    </h3>
                                    <button onClick={() => setIsModalOpen(false)} className="text-gray-300 hover:text-red-500 text-3xl transition-colors">&times;</button>
                                </div>
                                <form onSubmit={editMode === 'PROJECT' ? handleSaveProjectInfo : editMode === 'CONTENT' ? handleSaveGalleryContent : handleSaveItem} className="space-y-6">
                                    {editMode === 'CONTENT' && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-bold mb-2 text-gray-700">หัวข้อคำอธิบาย</label>
                                                <input
                                                    className="border border-gray-200 p-4 rounded-xl w-full bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7edad2] focus:bg-white transition-all shadow-sm"
                                                    value={formData.title}
                                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                    placeholder="เช่น สิ่งที่ทำในงานนี้"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold mb-2 text-gray-700">คำอธิบายทั้งหมด</label>
                                                <textarea
                                                    required
                                                    rows={14}
                                                    className="border border-gray-200 p-4 rounded-xl w-full bg-gray-50 text-gray-800 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#7edad2] focus:bg-white transition-all shadow-sm resize-y"
                                                    value={formData.description}
                                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                    placeholder="อธิบายภาพรวมของ Gallery นี้ว่าทำอะไรไปบ้าง..."
                                                />
                                                <p className="mt-2 text-xs text-gray-400">
                                                    รองรับ Markdown: <code>## หัวข้อ</code> <code>### หัวข้อย่อย</code> <code>**ตัวหนา**</code> <code>- รายการ</code> — บรรทัดใต้หัวข้อ &quot;Technologies &amp; Tools&quot; ที่คั่นด้วย , จะแสดงเป็นป้าย
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold mb-2 text-gray-700">ลิงก์ที่เกี่ยวข้อง (Optional)</label>
                                                <input
                                                    type="url"
                                                    className="border border-gray-200 p-4 rounded-xl w-full bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7edad2] focus:bg-white transition-all shadow-sm"
                                                    value={formData.link || ""}
                                                    onChange={e => setFormData({ ...formData, link: e.target.value })}
                                                    placeholder="https://www.example.com"
                                                />
                                            </div>
                                        </>
                                    )}
                                    {editMode !== 'CONTENT' && (
                                    <>
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
                                        {(imagePreviews.length > 0 || (Array.isArray(formData.img) ? formData.img.length > 0 : Boolean(formData.img))) && (
                                            <div className="mt-4 grid grid-cols-3 gap-3">

                                                {/* 1. แสดงรูปเก่าที่มีอยู่ใน Database */}
                                                {(Array.isArray(formData.img) ? formData.img : (formData.img ? [formData.img] : [])).map((url, idx) => (
                                                    <div key={`old-${idx}`} className="relative h-24 rounded-lg overflow-hidden border group/item">
                                                        <Image src={url} alt="old-preview" fill className="object-cover" />
                                                        {/* ปุ่มลบรูปเก่า */}
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const currentImages = Array.isArray(formData.img)
                                                                    ? formData.img
                                                                    : (formData.img ? [formData.img] : []);
                                                                setFormData({ ...formData, img: currentImages.filter((_, i) => i !== idx) });
                                                            }}
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
                                    </>
                                    )}
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
                            className="fixed inset-0 bg-black/95 z-[10000] flex items-center justify-center animate-in fade-in duration-200"
                            onClick={() => setViewingItem(null)}
                        >
                            <div
                                className="bg-[#0a0a0a] md:rounded-[2rem] overflow-hidden w-full md:max-w-[90vw] h-full md:h-[92vh] flex flex-col relative shadow-2xl"
                                onClick={e => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => setViewingItem(null)}
                                    className="absolute top-4 right-4 z-50 p-3 bg-black/70 text-white rounded-full border border-white/10 hover:bg-black"
                                >
                                    <CloseIcon />
                                </button>

                                {viewingImages.length > 0 && (
                                    <div className="relative flex-1 min-h-0 bg-[#050505]">
                                        <div className="h-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory">
                                            <div className="flex flex-col items-center gap-4 md:gap-8 py-6 md:py-10">
                                                {viewingImages.map((url, index) => (
                                                    <div
                                                        key={url + index}
                                                        className="relative w-full shrink-0 snap-center p-2 md:px-8 h-[64vh] md:h-[80vh]"
                                                    >
                                                        <div className="relative w-full h-full">
                                                            <Image
                                                                src={url}
                                                                alt={`${viewingItem.title || project.title}-${index + 1}`}
                                                                fill
                                                                sizes="90vw"
                                                                className="object-contain"
                                                                priority={index === 0}
                                                            />
                                                        </div>
                                                        {viewingImages.length > 1 && (
                                                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white/80 px-4 py-1.5 rounded-full text-sm font-medium border border-white/10 pointer-events-none">
                                                                {index + 1} / {viewingImages.length}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {(viewingItem.title || viewingItem.description || viewingItem.link) && (
                                    <div
                                        className={`border-t border-white/10 px-6 md:px-10 py-5 md:py-7 text-white overflow-y-auto ${viewingImages.length > 0 ? "shrink-0 max-h-[35vh]" : "flex-1 pt-16"}`}
                                    >
                                        {viewingItem.title && (
                                            <h3 className="text-lg md:text-2xl font-bold mb-3 pr-12">{viewingItem.title}</h3>
                                        )}
                                        {viewingItem.description && (
                                            <Markdown tone="dark">{viewingItem.description}</Markdown>
                                        )}
                                        {viewingItem.link && (
                                            <a
                                                href={viewingItem.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#7edad2] hover:text-[#a6ebe4]"
                                            >
                                                <LinkIcon /> เปิดลิงก์ที่เกี่ยวข้อง
                                            </a>
                                        )}
                                    </div>
                                )}

                            </div>
                        </div>
                    )}
                </>
                , document.body)}
        </div>
    );
}