"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiArrowRight, FiEdit2, FiPlus, FiStar, FiTrash2 } from "react-icons/fi";
import Markdown from "./Markdown";
import { useLang } from "../LanguageProvider";
import { TOPIC_STYLE, isYearCategory, topicsOf } from "./topics";
import { CoverFrame, ExternalLink, NeighborNav, PhotoGrid, PhotoViewer, hasText, imagesOf } from "./ExperienceView";

const OVERVIEW_COLLAPSE_CHARS = 900;

const isEmptyItem = (item) => {
    const hasImage = Array.isArray(item.img) ? item.img.some(Boolean) : Boolean(item.img);
    return !hasImage && !item.title && !item.description && !item.link;
};

// รหัสผ่านอยู่ใน .env.local (ADMIN_PASSWORD) — เช็คที่ server เท่านั้น

// --- Icons ---
// ... icons เดิม ...
const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#7edad2]"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg>;
const Spinner = () => <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

const ITEMS_PER_PAGE = 10;

// Frosted card that keeps text and photos clear of the sea behind
const PANEL = "rounded-3xl border border-white/80 bg-white/65 p-5 sm:p-7";

const DetailRow = ({ label, children }) => (
    <div className="grid gap-0.5 py-3 2xl:grid-cols-[84px_1fr] 2xl:gap-3">
        <dt className="text-[12px] text-gray-500 2xl:text-[14px]">{label}</dt>
        <dd className="min-w-0 text-primary">{children}</dd>
    </div>
);

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
    const { t, tx, lang } = useLang();
    // Full-screen photo viewer: { images, index, title }
    const [viewer, setViewer] = useState(null);
    const closeViewer = useCallback(() => setViewer(null), []);
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


    if (isLoading) return <div className="container mx-auto py-32 text-center text-[14px] text-gray-400">{tx({ th: "กำลังโหลด…", en: "Loading…" })}</div>;
    if (!project)
        return (
            <div className="container mx-auto py-32 text-center">
                <p className="text-gray-500">{tx({ th: "ไม่พบหน้านี้", en: "This page was not found." })}</p>
                <Link href="/#Experience" className="mt-4 inline-block text-[14px] text-brand-700 underline underline-offset-4">{t("nav.Experience")}</Link>
            </div>
        );

    const pageCount = Math.max(1, Math.ceil(listedItems.length / ITEMS_PER_PAGE));
    const pageStartIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const visibleItems = listedItems.slice(pageStartIndex, pageStartIndex + ITEMS_PER_PAGE);
    const isOverviewLong = (project.galleryDescription || "").length > OVERVIEW_COLLAPSE_CHARS;
    const isOverviewCollapsed = isOverviewLong && !isOverviewExpanded;

    const topics = topicsOf(project);
    const year = isYearCategory(project.category) ? String(project.category).trim() : null;
    const yearLabel = year ? (lang === "en" ? `${Number(year) - 543} (BE ${year})` : `${year} (ค.ศ. ${Number(year) - 543})`) : null;
    const dateLabel = project.createdAt
        ? new Date(project.createdAt).toLocaleDateString(lang === "th" ? "th-TH" : "en-US", { day: "numeric", month: "long", year: "numeric" })
        : null;
    const photoCount = items.reduce((sum, item) => sum + imagesOf(item).length, 0);
    // Visitors see every photo in one grid; each photo keeps its group's title and text for the viewer
    const photoList = listedItems.flatMap(({ item }) => imagesOf(item).map((src) => ({ src, title: item.title, description: item.description, link: item.link })));
    const openPhoto = (i) => setViewer({ images: photoList.map((photo) => photo.src), captions: photoList, index: i, title: project.title });
    const photosLabel = (n) => (lang === "th" ? `${n} รูป` : `${n} ${n === 1 ? "photo" : "photos"}`);
    const aboutTitle = project.galleryTitle && project.galleryTitle !== "เกี่ยวกับเนื้อหา" ? project.galleryTitle : tx({ th: "เกี่ยวกับงานนี้", en: "About this work" });
    const showAbout = hasText(project.galleryDescription) || isAdmin;
    const showGallery = listedItems.length > 0 || isAdmin;
    const adminBtn = "inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-[13px] font-medium text-gray-700 transition-colors hover:border-gray-400 hover:text-primary";

    const goBack = () => {
        if (document.referrer.startsWith(window.location.origin) && window.history.length > 1) router.back();
        else router.push("/#Experience");
    };

    return (
        <div className="pb-24 text-gray-800">
            <main className="container mx-auto pt-8 lg:pt-14">
                <button type="button" onClick={goBack} className="group inline-flex items-center gap-1.5 text-[14px] text-gray-500 transition-colors hover:text-primary">
                    <FiArrowLeft className="transition-transform duration-200 group-hover:-translate-x-0.5" /> {t("nav.Experience")}
                </button>

                {/* Title */}
                <div className="mt-8 max-w-3xl">
                    {(topics.length > 0 || project.isBest) && (
                        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-gray-500">
                            {topics.map((topic) => (
                                <span key={topic} className="inline-flex items-center gap-1.5">
                                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: TOPIC_STYLE[topic].color }} />
                                    {TOPIC_STYLE[topic].label}
                                </span>
                            ))}
                            {project.isBest && (
                                <span className="inline-flex items-center gap-1 font-medium text-amber-700">
                                    <FiStar className="h-3.5 w-3.5 fill-amber-400 text-amber-500" /> Best
                                </span>
                            )}
                        </p>
                    )}
                    <h1 className="mt-3 break-words text-[30px] font-semibold leading-[1.15] tracking-[-0.025em] text-primary sm:text-[40px]">{project.title}</h1>
                    {hasText(project.description) && (
                        <div className="mt-4 text-[17px] leading-relaxed text-gray-600">
                            <Markdown>{project.description}</Markdown>
                        </div>
                    )}
                </div>

                <div className="mt-10 grid gap-10 border-t border-gray-900/[0.08] pt-10 2xl:grid-cols-[minmax(0,1fr)_240px] 2xl:gap-14">
                    <div className="min-w-0">
                        {/* Cover in a fixed frame */}
                        {project.img && <CoverFrame src={project.img} alt={project.title} onOpen={() => setViewer({ images: [project.img], index: 0, title: project.title })} />}

                        {/* About */}
                        {showAbout && (
                            <section className={`${PANEL} ${project.img ? "mt-10" : ""}`}>
                                <div className="mb-5 flex items-end justify-between gap-4 border-b border-gray-200 pb-3">
                                    <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-primary">{aboutTitle}</h2>
                                    {isAdmin && (
                                        <button type="button" onClick={openEditGalleryContent} className={adminBtn}>
                                            <FiEdit2 className="h-3.5 w-3.5" /> {tx({ th: "แก้ไข", en: "Edit" })}
                                        </button>
                                    )}
                                </div>
                                {hasText(project.galleryDescription) ? (
                                    <>
                                        <div className={`relative ${isOverviewCollapsed ? "max-h-[520px] overflow-hidden" : ""}`}>
                                            <Markdown>{project.galleryDescription}</Markdown>
                                            {isOverviewCollapsed && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />}
                                        </div>
                                        {isOverviewLong && (
                                            <button type="button" onClick={() => setIsOverviewExpanded((v) => !v)} className="mt-4 text-[14px] font-medium text-brand-700 underline underline-offset-4">
                                                {isOverviewExpanded ? tx({ th: "ย่อ", en: "Show less" }) : tx({ th: "อ่านต่อ", en: "Read more" })}
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-[14px] text-gray-400">{tx({ th: "ยังไม่มีคำอธิบาย (เห็นเฉพาะ Admin)", en: "No description yet (only Admin sees this)" })}</p>
                                )}
                            </section>
                        )}

                        {/* Photos: each group lays itself out by how many photos it has */}
                        {showGallery && (
                            <section className={`${PANEL} ${project.img || showAbout ? "mt-10" : ""}`}>
                                <div className="mb-6 flex items-end justify-between gap-4 border-b border-gray-200 pb-3">
                                    <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-primary">
                                        {tx({ th: "ภาพบรรยากาศ", en: "Photos" })}
                                        {photoCount > 0 && <span className="ml-2 text-[14px] font-normal text-gray-400">{photosLabel(photoCount)}</span>}
                                    </h2>
                                    {isAdmin && (
                                        <span className="flex items-center gap-3">
                                            <span className="hidden text-[12px] text-gray-400 md:inline">{tx({ th: "ลากชุดรูปเพื่อจัดลำดับ", en: "Drag to reorder" })}</span>
                                            <button type="button" onClick={openAddItem} className={adminBtn}>
                                                <FiPlus className="h-3.5 w-3.5" /> {tx({ th: "เพิ่มชุดรูป", en: "Add photos" })}
                                            </button>
                                        </span>
                                    )}
                                </div>

                                {listedItems.length === 0 ? (
                                    <p className="text-[14px] text-gray-400">{tx({ th: "ยังไม่มีรูป", en: "No photos yet" })}</p>
                                ) : !isAdmin ? (
                                    <PhotoGrid images={photoList.map((photo) => photo.src)} title={project.title} onOpen={openPhoto} />
                                ) : (
                                    <div className="space-y-12">
                                        {visibleItems.map(({ item, index }) => {
                                            const images = imagesOf(item);
                                            const isEmpty = isEmptyItem(item);
                                            const isDropBefore = dropHint.index === index && dropHint.position === "before";
                                            const isDropAfter = dropHint.index === index && dropHint.position === "after";
                                            const showHead = item.title || isAdmin;
                                            return (
                                                <article
                                                    key={index}
                                                    draggable={isAdmin}
                                                    onDragStart={(e) => handleItemDragStart(e, index)}
                                                    onDragOver={(e) => handleItemDragOver(e, index)}
                                                    onDrop={(e) => handleItemDrop(e, index)}
                                                    onDragEnd={handleItemDragEnd}
                                                    className={`relative ${isAdmin ? "cursor-grab active:cursor-grabbing" : ""} ${draggedItemIndex === index ? "opacity-50" : ""}`}
                                                >
                                                    {isDropBefore && <div className="absolute -top-6 left-0 right-0 h-0.5 bg-brand-500" />}
                                                    {isDropAfter && <div className="absolute -bottom-6 left-0 right-0 h-0.5 bg-brand-500" />}

                                                    {showHead && (
                                                        <div className="mb-3 flex items-baseline justify-between gap-4">
                                                            <h3 className="text-[16px] font-semibold text-primary">
                                                                {item.title}
                                                                {images.length > 1 && listedItems.length > 1 && <span className="ml-2 text-[13px] font-normal text-gray-400">{photosLabel(images.length)}</span>}
                                                            </h3>
                                                            {isAdmin && (
                                                                <span className="flex shrink-0 gap-2">
                                                                    <button type="button" onClick={() => openEditItem(item, index)} className={adminBtn}>
                                                                        <FiEdit2 className="h-3.5 w-3.5" /> {tx({ th: "แก้ไข", en: "Edit" })}
                                                                    </button>
                                                                    <button type="button" onClick={() => handleDeleteItem(index)} aria-label={tx({ th: "ลบ", en: "Delete" })} className={`${adminBtn} hover:border-red-300 hover:text-red-600`}>
                                                                        <FiTrash2 className="h-3.5 w-3.5" />
                                                                    </button>
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                    {item.description && <p className="mb-4 line-clamp-2 max-w-3xl text-[13.5px] text-gray-500">{item.description}</p>}
                                                    {images.length > 0 && (
                                                        <PhotoGrid images={images} title={item.title || project.title} onOpen={(i) => setViewer({ images, index: i, title: item.title || project.title })} />
                                                    )}
                                                    {item.link && (
                                                        <p className="mt-3 text-[14px] text-gray-600">
                                                            <ExternalLink href={item.link}>{tx({ th: "เปิดลิงก์", en: "Open link" })}</ExternalLink>
                                                        </p>
                                                    )}
                                                    {isEmpty && (
                                                        <p className="rounded-md border border-dashed border-gray-300 p-6 text-center text-[13px] text-gray-400">
                                                            {tx({ th: "ชุดว่าง (เห็นเฉพาะ Admin) ลบได้", en: "Empty group (only Admin sees this)" })}
                                                        </p>
                                                    )}
                                                </article>
                                            );
                                        })}
                                    </div>
                                )}

                                {isAdmin && pageCount > 1 && (
                                    <div className="mt-12 flex items-center justify-between border-t border-gray-200 pt-5 text-[14px]">
                                        <button type="button" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="inline-flex items-center gap-1.5 text-gray-600 transition-colors hover:text-primary disabled:opacity-30">
                                            <FiArrowLeft /> {tx({ th: "ก่อนหน้า", en: "Previous" })}
                                        </button>
                                        <span className="tabular-nums text-gray-400">
                                            {currentPage} / {pageCount}
                                        </span>
                                        <button type="button" onClick={() => setCurrentPage((p) => Math.min(pageCount, p + 1))} disabled={currentPage === pageCount} className="inline-flex items-center gap-1.5 text-gray-600 transition-colors hover:text-primary disabled:opacity-30">
                                            {tx({ th: "ถัดไป", en: "Next" })} <FiArrowRight />
                                        </button>
                                    </div>
                                )}
                            </section>
                        )}
                    </div>

                    {/* Details */}
                    <aside className="order-first 2xl:order-none 2xl:sticky 2xl:top-8 2xl:self-start">
                        <h2 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-gray-400">{tx({ th: "รายละเอียด", en: "Details" })}</h2>
                        <dl className="mt-3 grid grid-cols-2 gap-x-6 rounded-2xl border border-white/80 bg-white/60 px-4 text-[14px] sm:grid-cols-3 2xl:block 2xl:divide-y 2xl:divide-gray-900/[0.08] 2xl:rounded-none 2xl:border-x-0 2xl:border-y 2xl:border-gray-900/[0.08] 2xl:bg-transparent 2xl:px-0">
                            {yearLabel && <DetailRow label={tx({ th: "ปี", en: "Year" })}>{yearLabel}</DetailRow>}
                            {dateLabel && <DetailRow label={tx({ th: "วันที่", en: "Date" })}>{dateLabel}</DetailRow>}
                            {topics.length > 0 && <DetailRow label={tx({ th: "ประเภท", en: "Type" })}>{topics.map((topic) => TOPIC_STYLE[topic].label).join(", ")}</DetailRow>}
                            {photoCount > 0 && <DetailRow label={tx({ th: "รูป", en: "Photos" })}>{photosLabel(photoCount)}</DetailRow>}
                            {project.link && (
                                <DetailRow label={tx({ th: "ต้นทาง", en: "Source" })}>
                                    <ExternalLink href={project.link}>{tx({ th: "โพสต์ต้นทาง", en: "Original post" })}</ExternalLink>
                                </DetailRow>
                            )}
                            {project.galleryLink && (
                                <DetailRow label={tx({ th: "ลิงก์", en: "Link" })}>
                                    <ExternalLink href={project.galleryLink}>{tx({ th: "ลิงก์ที่เกี่ยวข้อง", en: "Related link" })}</ExternalLink>
                                </DetailRow>
                            )}
                        </dl>

                        {isAdmin && (
                            <div className="mt-6 flex flex-wrap gap-2">
                                <button type="button" onClick={openEditProject} className={adminBtn}>
                                    <FiEdit2 className="h-3.5 w-3.5" /> {tx({ th: "แก้ไขหัวเรื่อง/ปก", en: "Edit title & cover" })}
                                </button>
                                <button type="button" onClick={handleDeleteProject} className={`${adminBtn} hover:border-red-300 hover:text-red-600`}>
                                    <FiTrash2 className="h-3.5 w-3.5" /> {tx({ th: "ลบหน้านี้", en: "Delete page" })}
                                </button>
                            </div>
                        )}
                    </aside>
                </div>

                <NeighborNav slug={slug} />

                <div className="mt-10 text-right">
                    {isAdmin ? (
                        <span className="text-[12px] font-medium text-brand-700">● Admin mode</span>
                    ) : (
                        <button type="button" onClick={() => setIsAuthModalOpen(true)} className="text-[12px] text-gray-400 transition-colors hover:text-primary">
                            Admin
                        </button>
                    )}
                </div>
            </main>

            <PhotoViewer viewer={viewer} onClose={closeViewer} />

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
                                        <button type="submit" className="bg-brand-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-700 transition">Login</button>
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
                </>
                , document.body)}
        </div>
    );
}