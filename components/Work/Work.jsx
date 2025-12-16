"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createPortal } from "react-dom";
import AnimatedText from "../AnimatedText";
import WorkItem from "./WorkItem";

// --- 🔒 รหัสผ่าน Admin ---
const ADMIN_PASSWORD = "1234";

// --- Icons ---
const TrashIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>);
const PencilIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>);
const BackupIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>);
const CheckCircleIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#00ff99]"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg>);
const XCircleIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-500"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" /></svg>);
const SkullIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-red-600"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>);

// --- Animation Variants ---
const cardVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  },
  exit: {
    opacity: 0,
    scale: 0.5,
    y: -20,
    transition: { duration: 0.3 }
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: { type: "spring", stiffness: 400, damping: 10 }
  }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 }
  },
  exit: { opacity: 0, scale: 0.8, y: 50, transition: { duration: 0.2 } }
};

export default function Work() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [tabValue, setTabValue] = useState("all");
  const [visibleItems, setVisibleItems] = useState(6);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  // ✅ [NEW] State สำหรับปุ่มล้างบาง
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  // ✅ [NEW] State สำหรับจัดการรูปภาพ (เพิ่มใหม่)
  const [selectedFile, setSelectedFile] = useState(null); // เก็บไฟล์ดิบรออัปโหลด
  const [imagePreview, setImagePreview] = useState("");   // เก็บ URL รูปตัวอย่าง

  const [isWipingData, setIsWipingData] = useState(false);

  const [passwordInput, setPasswordInput] = useState("");

  const [editingProject, setEditingProject] = useState(null);
  const [isDragging, setIsDragging] = useState(false); // ✅ เพิ่ม state เพื่อทำ Effect ตอนลากไฟล์เข้ามา
  // ✅ 1. สร้างฟังก์ชันกลางสำหรับจัดการไฟล์ (ใช้ร่วมกันทั้ง เลือกไฟล์, ลากวาง, ก๊อปวาง)
  const handleProcessFile = (file) => {
    if (!file) return;

    // เช็คว่าเป็นรูปภาพหรือไม่
    if (!file.type.startsWith("image/")) {
      showToast("กรุณาเลือกไฟล์รูปภาพเท่านั้น", "error");
      return;
    }

    setSelectedFile(file); // เก็บไฟล์สำหรับอัปโหลด
    setImagePreview(URL.createObjectURL(file)); // สร้างพรีวิว
  };

  // ✅ 2. ดักจับการกด Paste (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e) => {
      // ทำงานเฉพาะตอน Modal เปิดอยู่
      if (!isFormModalOpen) return;

      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          handleProcessFile(file); // เรียกใช้ฟังก์ชันกลาง
          break; // เอาแค่รูปแรกที่เจอ
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [isFormModalOpen]);

  // ✅ 3. ฟังก์ชันสำหรับ Drag & Drop
  const handleDragOver = (e) => {
    e.preventDefault(); // สำคัญ! ต้องใส่เพื่อบอก Browser ว่ายอมให้วางไฟล์ได้
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };
  const [formData, setFormData] = useState({
    title: "",
    category: "2569",
    slug: "",
    img: "",
    createdAt: "",
    link: "",
    isCertificate: false,// ✅ เพิ่มตรงนี้
    isBest: false // ✅ [เพิ่ม] ค่าเริ่มต้นสำหรับ Best Project
  });
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    fetchProjects();
  }, []);
  // ✅ เพิ่ม useEffect นี้:
  useEffect(() => {
    // รีเซ็ตจำนวนที่แสดงเป็น 6 ทุกครั้งที่เปลี่ยน Tab
    setVisibleItems(6);
  }, [tabValue]);
  // ✅ ฟังก์ชันแสดง Toast
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };
  // ✅ [NEW] ฟังก์ชันจัดการการ Restore (อัปโหลดไฟล์)
  const handleRestore = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!confirm(`⚠️ คุณแน่ใจหรือไม่ที่จะ "กู้คืนข้อมูล" จากไฟล์ ${file.name}? ข้อมูลปัจจุบันจะถูกเขียนทับ`)) {
      e.target.value = null; // Clear file input
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      setIsRestoring(true);
      try {
        const data = JSON.parse(event.target.result);

        // ส่งข้อมูล JSON ไปให้ API ใหม่ (API ที่ชื่อว่า /api/restoreDBMongo)
        const res = await fetch('/api/restoreDBMongo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || "Restore failed");
        }

        await fetchProjects(); // ดึงข้อมูลใหม่มาแสดงผล
        showToast("กู้คืนข้อมูลสำเร็จ! ฐานข้อมูลถูกอัปเดตแล้ว", "success");
      } catch (error) {
        console.error("Restore Error:", error);
        showToast(error.message || "เกิดข้อผิดพลาดในการกู้คืนข้อมูล", "error");
      } finally {
        setIsRestoring(false);
        e.target.value = null; // ล้าง input file
      }
    };
    reader.readAsText(file);
  };
  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // 1. หาปีที่มีทั้งหมด (เหมือนเดิม)
  const uniqueCategories = Array.from(new Set(projects.map((item) => item.category))).sort().reverse();

  // 2. สร้าง Tabs: เริ่มด้วย all -> แทรก Certificate -> ตามด้วยปีต่างๆ
  const tabData = [
    { category: "all" },
    { category: "Best" },        // ✅ 1. เพิ่ม Tab "Best" ตรงนี้ (ให้เป็นอันดับ 2 รองจาก all)
    { category: "Certificate" }, 
    
    ...uniqueCategories.map((category) => ({ category }))
  ];

  // 3. แก้เงื่อนไขการกรอง (Filter)
 const filterWork = projects
    .filter((item) => {
      if (tabValue === "all") return true;
      if (tabValue === "Best") return item.isBest === true; // ✅ 2. เพิ่ม Logic กรองเฉพาะงานที่มีดาว (isBest)
      if (tabValue === "Certificate") return item.isCertificate === true;
      return item.category === tabValue;
    })
    .sort((a, b) => {
      // ✅ Logic การเรียงลำดับ (เอา Best ขึ้นก่อนเสมอ ในทุกๆ Tab)
      if (a.isBest === true && b.isBest !== true) return -1;
      if (a.isBest !== true && b.isBest === true) return 1;
      
      // ถ้าสถานะเหมือนกัน ให้เรียงตามวันที่ (ใหม่สุดขึ้นก่อน)
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  // --- Handlers ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setIsAuthModalOpen(false);
      showToast("เข้าสู่ระบบ Admin สำเร็จ!");
    } else {
      showToast("รหัสผ่านไม่ถูกต้อง", "error");
    }
  };
  const handleDateChange = (e) => {
    const newDate = e.target.value;

    // ถ้ามีการเลือกวันที่
    if (newDate) {
      const yearAD = parseInt(newDate.split("-")[0]); // ดึงปี ค.ศ. (ตัวหน้าสุด)
      const yearBE = yearAD + 543; // แปลงเป็น พ.ศ.

      setFormData({
        ...formData,
        createdAt: newDate,
        category: yearBE.toString() // อัปเดตช่อง Category อัตโนมัติ
      });
    } else {
      // ถ้าลบวันที่ออก ก็แค่อัปเดตวันที่เป็นค่าว่าง
      setFormData({ ...formData, createdAt: newDate });
    }
  };
  // ✅ ปรับปรุง handleFileChange เดิม ให้มาเรียกใช้ฟังก์ชันกลาง
  const handleFileChangeRevised = (e) => {
    if (e.target.files?.[0]) {
      handleProcessFile(e.target.files[0]);
    }
  };

  // ✅ [UPDATED] ฟังก์ชันอัปโหลด (ใช้ Env Variables)
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    // ดึงค่าจาก .env.local
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;

    formData.append("upload_preset", uploadPreset);
    formData.append("cloud_name", cloudName);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Upload failed");

      return data.secure_url; // คืนค่า URL รูปภาพ
    } catch (error) {
      console.error("Cloudinary Error:", error);
      throw error;
    }
  };
  const openAddModal = () => {
    setEditingProject(null);
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    const currentThaiYear = (today.getFullYear() + 543).toString();

    setFormData({
      title: "",
      category: currentThaiYear,
      slug: "",
      img: "",
      createdAt: dateString,
      link: "",
      isCertificate: false,
      isBest: false // ✅ [เพิ่ม] Reset ค่า
    });

    // เคลียร์รูป
    setSelectedFile(null);
    setImagePreview("");

    setIsFormModalOpen(true);
  };

  // 3. อัปเดตฟังก์ชัน openEditModal (ดึงค่าเดิมมาใส่)
  // ✅ [UPDATED] ดึงรูปเดิมมาโชว์ เมื่อเปิด Modal แก้ไข
  const openEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      category: project.category,
      slug: project.slug,
      img: project.img,
      createdAt: project.createdAt ? new Date(project.createdAt).toISOString().split('T')[0] : "",
      link: project.link || "",
      isCertificate: project.isCertificate || false,
      isBest: project.isBest || false // ✅ [เพิ่ม] ดึงค่าเดิมมาใส่
    });

    // โชว์รูปเดิม
    setImagePreview(project.img);
    setSelectedFile(null); // เคลียร์ไฟล์ใหม่ เพราะยังไม่ได้เลือก

    setIsFormModalOpen(true);
  };
  // ✅ [UPDATED] บันทึกข้อมูล (อัปโหลดรูปก่อน แล้วค่อยเซฟลง DB)
  const handleSaveProject = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let finalImageUrl = formData.img; // เริ่มต้นด้วยรูปเดิม

      // 1. เช็คว่า user เลือกไฟล์ใหม่มาไหม?
      if (selectedFile) {
        // ถ้ามีไฟล์ใหม่ ให้อัปโหลดไป Cloudinary ก่อน
        finalImageUrl = await uploadToCloudinary(selectedFile);
      }

      // 2. เตรียมข้อมูลส่งเข้า MongoDB (ตอนนี้ img จะเป็น URL แล้ว)
      const payload = {
        ...formData,
        img: finalImageUrl
      };

      if (editingProject) {
        payload.originalSlug = editingProject.slug;
      }

      // 3. ส่งข้อมูลไป API (ส่วนนี้เหมือนเดิม)
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        await fetchProjects();
        setTimeout(() => {
          setIsFormModalOpen(false);
          setIsSaving(false);
          setEditingProject(null);
          // Reset ค่าทั้งหมด
          setFormData({ title: "", category: "2569", slug: "", img: "", createdAt: "", link: "", isCertificate: false });
          setSelectedFile(null);
          setImagePreview("");

          showToast(editingProject ? "แก้ไขงานสำเร็จ!" : "เพิ่มงานใหม่สำเร็จ!", "success");
        }, 800);
      } else {
        if (res.status === 409) {
          showToast(data.error, "error");
        } else {
          throw new Error(data.error || "Save failed");
        }
        setIsSaving(false);
      }
    } catch (error) {
      console.error(error);
      showToast(error.message || "เกิดข้อผิดพลาดในการบันทึก", "error");
      setIsSaving(false);
    }
  };

  const handleDeleteProject = async (slug) => {
    if (!confirm("⚠️ คุณแน่ใจหรือไม่ว่าจะลบงานนี้?")) return;
    setDeletingId(slug);
    try {
      const res = await fetch(`/api/projects?slug=${slug}`, { method: 'DELETE' });
      if (res.ok) {
        setTimeout(() => {
          setProjects((prev) => prev.filter((item) => item.slug !== slug));
          setDeletingId(null);
          showToast("ลบงานเรียบร้อยแล้ว");
        }, 600);
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      showToast("ลบไม่สำเร็จ กรุณาลองใหม่", "error");
      setDeletingId(null);
    }
  };

  // ✅ [NEW] ฟังก์ชันล้างข้อมูลทั้งหมด
  // ✅ [FIXED] ฟังก์ชันล้างข้อมูลทั้งหมด
  const handleWipeDatabase = async () => {
    if (deleteConfirmationText !== "CONFIRM-DELETE") {
      return;
    }

    setIsWipingData(true);
    try {
      // ❌ ของเดิม: เรียกผิดไฟล์
      // const res = await fetch(`/api/projects?slug=DELETE_ALL_DATA_PERMANENTLY`, { method: 'DELETE' });

      // ✅ ของใหม่: เรียกไฟล์ resetDBMongo โดยตรง
      const res = await fetch(`/api/resetDBMongo`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setProjects([]); // เคลียร์หน้าจอ
        setIsDeleteAllModalOpen(false);
        setDeleteConfirmationText("");
        showToast("ล้างข้อมูลทั้งหมดเรียบร้อยแล้ว", "success");
      } else {
        // อ่าน Error จาก API เพื่อ debug ง่ายขึ้น
        const errorData = await res.json().catch(() => ({}));
        console.error("Reset Failed:", errorData);
        throw new Error(errorData.error || "Wipe failed");
      }
    } catch (error) {
      console.error(error);
      showToast("เกิดข้อผิดพลาดในการล้างข้อมูล", "error");
    } finally {
      setIsWipingData(false);
    }
  };
  const handleBackup = async () => {
    if (!confirm("ต้องการสำรองข้อมูล (Backup) ทั้งหมดใช่หรือไม่?")) return;
    setIsBackingUp(true);
    try {
      const res = await fetch('/api/backup');
      if (!res.ok) throw new Error("Backup failed");
      const data = await res.json();
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `backup_portfolio_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast("Backup ข้อมูลเรียบร้อยแล้ว!");
    } catch (error) {
      showToast("เกิดข้อผิดพลาดในการ Backup", "error");
    } finally {
      setIsBackingUp(false);
    }
  };



  if (loading) return <div className="pt-24 text-center animate-pulse text-[##7edad2]">กำลังโหลดข้อมูล...</div>;

  return (
    <section className="pt-24 min-h-[1000px]" id="work">
      <div className="container mx-auto">

        {/* --- Header & ปุ่ม Admin --- */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-8 gap-4">
          <AnimatedText text="My Learning" textStyles="h2" />

          {!isAdmin ? (
            <button onClick={() => setIsAuthModalOpen(true)} className="text-xs text-gray-400 hover:text-[#00ff99] transition-colors">
              Admin Access
            </button>
          ) : (
            <div className="flex flex-wrap gap-3 items-center justify-center">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs text-[#00ff99] bg-[#00ff99]/10 px-2 py-1 rounded border border-[#00ff99]/20"
              >
                Admin Mode
              </motion.span>

              {/* ✅ [NEW] ปุ่มลับ! (Reset DB) - ทำให้มองเห็นยากๆ (Opacity 10% -> 100% on hover) */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                whileHover={{ opacity: 1, color: "#ef4444" }}
                onClick={() => { setDeleteConfirmationText(""); setIsDeleteAllModalOpen(true); }}
                className="text-[10px] text-gray-400 px-2 py-1 transition-all cursor-pointer font-mono tracking-widest border border-transparent hover:border-red-500/30 rounded"
                title="DANGER ZONE: RESET DATABASE"
              >
                [RESET DB]
              </motion.button>
              {/* ✅ [NEW] ปุ่ม Restore (เป็นปุ่มซ่อน Input File) */}
              <motion.label
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                htmlFor="restore-file-input"
                className={`bg-red-500 text-white px-4 py-2 rounded-full font-bold transition-all text-sm flex items-center gap-2 shadow-sm cursor-pointer ${isRestoring ? 'opacity-50' : 'hover:bg-red-600'}`}
              >
                {isRestoring ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span> : <BackupIcon className="rotate-180" />}
                <span>Restore</span>
                <input
                  type="file"
                  id="restore-file-input"
                  accept=".json"
                  onChange={handleRestore}
                  disabled={isRestoring}
                  className="hidden"
                />
              </motion.label>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBackup}
                disabled={isBackingUp}
                className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-full font-bold hover:bg-gray-100 transition-all text-sm flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                {isBackingUp ? <span className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full"></span> : <BackupIcon />}
                <span>Backup</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openAddModal}
                className="bg-[#00ff99] text-black px-4 py-2 rounded-full font-bold hover:bg-[#00cc7a] transition-all text-sm flex items-center gap-2 shadow-lg shadow-[#00ff99]/20"
              >
                + เพิ่มงานใหม่
              </motion.button>
            </div>
          )}
        </div>

        {/* --- Tabs --- */}
        <Tabs value={tabValue} onValueChange={setTabValue} className="w-full flex flex-col">
          <TabsList className="max-w-max h-full mb-[30px] flex flex-col md:flex-row gap-4 md:gap-0 mx-auto md:mx-0">
            {tabData.map((item, index) => (
              <TabsTrigger key={index} value={item.category} className="capitalize w-[120px]">
                {item.category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={tabValue} className="w-full">
            {filterWork.length === 0 ? (
              <div className="text-center text-gray-500 py-10">ยังไม่มีข้อมูลในหมวดนี้</div>
            ) : (
              <motion.div layout className="grid grid-cols-1 lg:grid-cols-3 gap-[30px]">
                <AnimatePresence mode="popLayout">
                  {filterWork.slice(0, visibleItems).map((item, index) => {
                    const isDeleting = deletingId === item.slug;
                    return (
                      <motion.div
                        layout
                        key={item._id || item.slug || index}
                        variants={cardVariants}
                        initial="hidden"
                        animate={isDeleting ? { x: [0, -10, 10, -10, 10, 0], transition: { duration: 0.4 } } : "visible"}
                        exit="exit"
                        whileHover="hover"
                        className={`relative group rounded-3xl overflow-hidden ${isDeleting ? "ring-4 ring-red-500 shadow-2xl shadow-red-500/50" : ""}`}
                      >
                        {/* Slug Badge */}
                        <div className="absolute top-14 left-4 z-20 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-[10px] tracking-wider font-mono text-white/90 bg-black/60 px-2 py-1 rounded backdrop-blur-md border border-white/10 shadow-sm">
                            /{item.slug}
                          </span>
                        </div>

                        {isDeleting && (
                          <div className="absolute inset-0 z-50 bg-red-500/20 backdrop-blur-[2px] flex items-center justify-center">
                            <div className="bg-white/90 p-3 rounded-full shadow-lg">
                              <TrashIcon className="w-8 h-8 text-red-600 animate-bounce" />
                            </div>
                          </div>
                        )}
                        <WorkItem {...item} />

                        {/* Buttons */}
                        {isAdmin && !isDeleting && (
                          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-10 translate-y-2 group-hover:translate-y-0">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => { e.stopPropagation(); openEditModal(item); }}
                              className="p-2.5 bg-white text-blue-500 rounded-full shadow-lg hover:bg-blue-500 hover:text-white border border-blue-100"
                            >
                              <PencilIcon />
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => { e.stopPropagation(); handleDeleteProject(item.slug); }}
                              className="p-2.5 bg-white text-red-500 rounded-full shadow-lg hover:bg-red-500 hover:text-white border border-red-100"
                            >
                              <TrashIcon />
                            </motion.button>
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </motion.div>
            )}
            {visibleItems < filterWork.length && (
              <div className="flex justify-center mt-12">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setVisibleItems(prev => prev + 6)}
                  className="btn btn-accent rounded-full px-6"
                >
                  Load more ({filterWork.length - visibleItems})
                </motion.button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* --- Portals --- */}
      {typeof document !== 'undefined' && createPortal(
        <>
          {/* Toast Notification */}
          <AnimatePresence>
            {toast.show && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1, transition: { type: "spring" } }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                className="fixed bottom-6 right-6 z-[10000] cursor-pointer"
                onClick={() => setToast({ ...toast, show: false })}
              >
                <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border ${toast.type === "success" ? "bg-black/80 border-[#00ff99]/50 shadow-[#00ff99]/20" : "bg-black/80 border-red-500/50 shadow-red-500/20"}`}>
                  {toast.type === "success" ? <CheckCircleIcon /> : <XCircleIcon />}
                  <div>
                    <h4 className={`font-bold text-sm ${toast.type === "success" ? "text-white" : "text-red-400"}`}>
                      {toast.type === "success" ? "สำเร็จ" : "ข้อผิดพลาด"}
                    </h4>
                    <p className="text-xs text-gray-300">{toast.message}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Admin Login Modal */}
          <AnimatePresence>
            {isAuthModalOpen && (
              <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center backdrop-blur-sm p-4">
                <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit" className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-xs overflow-hidden">
                  <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">Admin Login</h3>
                  <form onSubmit={handleLogin}>
                    <input type="password" autoFocus placeholder="Password" className="border border-gray-300 p-2 rounded-lg w-full mb-4 text-center text-gray-800 outline-none focus:border-[#00ff99] transition-colors" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} />
                    <div className="flex justify-between gap-2">
                      <button type="button" onClick={() => setIsAuthModalOpen(false)} className="text-gray-500 text-sm hover:text-gray-700">Cancel</button>
                      <button type="submit" className="bg-black text-white px-6 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors">Unlock</button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* ✅ [NEW] Delete All Warning Modal */}
          <AnimatePresence>
            {isDeleteAllModalOpen && (
              <div className="fixed inset-0 bg-red-950/80 z-[10000] flex items-center justify-center p-4 backdrop-blur-md">
                <motion.div
                  variants={modalVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border-4 border-red-500 text-center relative overflow-hidden"
                >
                  {/* Background warning stripes */}
                  <div className="absolute top-0 left-0 w-full h-4 bg-[repeating-linear-gradient(45deg,#ef4444,#ef4444_10px,#b91c1c_10px,#b91c1c_20px)]"></div>

                  <div className="flex flex-col items-center gap-4 mt-4">
                    <SkullIcon />
                    <h3 className="text-3xl font-black text-red-600 uppercase tracking-widest">Danger Zone</h3>
                    <p className="text-gray-600 text-sm">
                      คุณกำลังจะ <span className="font-bold text-red-600">ลบข้อมูลทั้งหมด</span> ในฐานข้อมูล <br />
                      การกระทำนี้ <u className="font-bold">ไม่สามารถกู้คืนได้</u>
                    </p>
                  </div>

                  <div className="mt-6">
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">พิมพ์ "CONFIRM-DELETE" เพื่อยืนยัน</label>
                    <input
                      type="text"
                      className="border-2 border-red-200 bg-red-50 p-3 rounded-xl w-full text-center font-bold text-red-600 focus:outline-none focus:border-red-500 placeholder:text-red-200"
                      placeholder="CONFIRM-DELETE"
                      value={deleteConfirmationText}
                      onChange={e => setDeleteConfirmationText(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-between gap-3 mt-8">
                    <button onClick={() => setIsDeleteAllModalOpen(false)} className="w-full py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">ยกเลิก</button>
                    <button
                      onClick={handleWipeDatabase}
                      disabled={deleteConfirmationText !== "CONFIRM-DELETE" || isWipingData}
                      className="w-full py-3 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {isWipingData ? "กำลังล้างข้อมูล..." : "ลบทั้งหมดเดี๋ยวนี้"}
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Form Modal (Add/Edit) */}
          <AnimatePresence>
            {isFormModalOpen && (
              <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
                <motion.div
                  variants={modalVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                      {editingProject ? <><PencilIcon /> แก้ไขโปรเจกต์</> : "+ เพิ่มโปรเจกต์ใหม่"}
                    </h3>
                    <button onClick={() => setIsFormModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors text-2xl">&times;</button>
                  </div>

                  <form onSubmit={handleSaveProject} className="flex flex-col gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อโปรเจกต์ (Title)</label>
                      <input required className="border p-3 rounded-xl w-full bg-gray-50 focus:ring-2 ring-[##7edad2]/20 outline-none border-gray-200 text-black transition-all" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ปี (Category)</label>
                        <input required placeholder="เช่น 2569" readOnly className="border p-3 rounded-xl w-full bg-gray-50 focus:ring-2 ring-[##7edad2]/20 outline-none border-gray-200 text-black transition-all" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                        <input required placeholder="eng-only-no-space" className="border p-3 rounded-xl w-full bg-gray-50 focus:ring-2 ring-[##7edad2]/20 outline-none border-gray-200 text-black transition-all" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} />
                      </div>
                      {/* ✅ เพิ่มช่องวันที่ตรงนี้ (วางต่อจาก Grid ด้านบน) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">วันที่ (Date)</label>
                        <input
                          type="date"
                          required
                          className="border p-3 rounded-xl w-full bg-gray-50 focus:ring-2 ring-[##7edad2]/20 outline-none border-gray-200 text-black transition-all"
                          value={formData.createdAt}

                          // ✅ เปลี่ยนตรงนี้: เรียกใช้ฟังก์ชันใหม่
                          onChange={handleDateChange}
                        />
                      </div>
                      <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200 cursor-pointer" onClick={() => setFormData({ ...formData, isCertificate: !formData.isCertificate })}>
                        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${formData.isCertificate ? "bg-[#7edad2] border-[#7edad2]" : "border-gray-300 bg-white"}`}>
                          {formData.isCertificate && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className="text-gray-700 font-small select-none">Certificate/Award🏆</span>

                        {/* Input ซ่อนไว้แต่ทำงานจริง */}
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={formData.isCertificate}
                          onChange={(e) => setFormData({ ...formData, isCertificate: e.target.checked })}
                        />
                      </div>
                      {/* 2. ปุ่ม Best Project (เพิ่มใหม่ ⭐) */}
                      <div
                        className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all select-none
                            ${formData.isBest
                            ? "bg-yellow-50 border-yellow-400 text-yellow-600 shadow-sm"
                            : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
                          }`}
                        onClick={() => setFormData({ ...formData, isBest: !formData.isBest })}
                      >
                        {formData.isBest ? (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-500 animate-pulse">
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.563.045.797.777.385 1.178l-4.154 4.045a.563.563 0 00-.153.518l1.268 5.443c.129.554-.474.975-.92.68l-4.665-2.923a.563.563 0 00-.606 0L6.92 21.24c-.445.295-1.05-.126-.92-.68l1.268-5.443a.563.563 0 00-.153-.518L2.96 10.575c-.412-.401-.178-1.133.386-1.178l5.518-.442a.563.563 0 00.474-.345L11.48 3.5z" />
                          </svg>
                        )}
                        <span className="font-medium text-sm">Best Project</span>
                      </div>
                      {/* ... จบส่วนที่เพิ่ม ... */}
                    </div>
                    <div>
                      {/* ... ส่วน Label ... */}
                      <label className="block text-sm font-medium text-gray-700 mb-1">รูปปก (Image)</label>

                      {/* ✅ ส่วนอัปโหลดที่แก้ใหม่ */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        // เพิ่ม Event Handlers สำหรับ Drag & Drop
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer relative group ${isDragging
                          ? "border-[#7edad2] bg-[#7edad2]/10 scale-105" // สีตอนลากไฟล์เข้ามา
                          : "border-gray-300 hover:bg-gray-50"
                          }`}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                          // เปลี่ยนไปใช้ฟังก์ชันกลาง handleProcessFile
                          onChange={(e) => handleProcessFile(e.target.files[0])}
                        />

                        {imagePreview ? (
                          <div className="relative">
                            <img src={imagePreview} alt="preview" className="h-40 mx-auto rounded-lg object-contain shadow-sm" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg text-white font-bold text-sm pointer-events-none">
                              เปลี่ยนรูป
                            </div>
                          </div>
                        ) : (
                          <div className="text-gray-400 text-sm py-8 pointer-events-none flex flex-col items-center gap-1">
                            <div>
                              <span className="text-[#7edad2] font-bold">คลิกเพื่อเลือกรูป</span> หรือลากไฟล์มาวาง
                            </div>
                            {/* เพิ่มข้อความแนะนำ Ctrl+V */}
                            <div className="text-xs text-gray-300">
                              หรือกด <kbd className="font-sans border border-gray-200 rounded px-1 bg-white text-gray-500">Ctrl</kbd> + <kbd className="font-sans border border-gray-200 rounded px-1 bg-white text-gray-500">V</kbd> เพื่อวางรูป
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </div>
                    {/* ✅ ช่องกรอกลิงก์ (Link) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        แนบลิงก์ผลงาน (Link / URL) <span className="text-xs text-gray-400 font-normal">(ไม่บังคับ)</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://www.instagram.com/..."
                        className="border p-3 rounded-xl w-full bg-gray-50 focus:ring-2 ring-[##7edad2]/20 outline-none border-gray-200 text-black transition-all placeholder:text-gray-300"
                        value={formData.link}
                        onChange={e => setFormData({ ...formData, link: e.target.value })}
                      />
                    </div>
                    <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                      <button type="button" onClick={() => setIsFormModalOpen(false)} className="px-6 py-2.5 text-gray-500 hover:bg-gray-100 rounded-xl font-medium transition-colors">ยกเลิก</button>

                      <motion.button
                        type="submit"
                        disabled={isSaving}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-8 py-2.5 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2 min-w-[140px] justify-center ${isSaving ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-[##7edad2] text-black hover:bg-[##7edad2] shadow-[#00ff99]/20"}`}
                      >
                        {isSaving ? (
                          <>
                            <span className="animate-spin h-5 w-5 border-2 border-gray-600 border-t-transparent rounded-full"></span>
                            <span>บันทึก...</span>
                          </>
                        ) : (
                          editingProject ? "บันทึกการแก้ไข" : "เพิ่มงานใหม่"
                        )}
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </>
        , document.body)}
    </section>
  );
}