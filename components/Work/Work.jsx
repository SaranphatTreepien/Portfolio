"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createPortal } from "react-dom";
import AnimatedText from "../AnimatedText";
import WorkItem from "./WorkItem";

// --- Icons ---
const TrashIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>);
const PencilIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>);
const BackupIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>);
const CheckCircleIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#00ff99]"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg>);
const XCircleIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-500"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" /></svg>);
const SkullIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-red-600"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>);

// --- Animation Variants - ลด animation เพื่อประหยัด GPU ---
const cardVariants = {
  hidden: { opacity: 0, scale: 0.98, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.15 } },
  hover: { y: -4, transition: { duration: 0.2 } }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.98, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, scale: 0.98, y: 20, transition: { duration: 0.15 } }
};

const defaultFormData = {
  title: "", category: "2569", slug: "", img: "", createdAt: "", link: "",
  specialTopics: [],
  isCertificate: false, isBest: false, isCloud: false, isNetwork: false, isCommunity: false,
};

const specialTopicOptions = [
  { value: "Cloud", label: "☁️ Cloud" },
  { value: "Network", label: "🌐 Network" },
  { value: "DevSecOps", label: "🛡️ DevSecOps" },
  { value: "Certificate", label: "📜 Certificate" },
  { value: "Community", label: "🤝 Community" },
];

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
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  const [isYearsCollapsed, setIsYearsCollapsed] = useState(true);

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isWipingData, setIsWipingData] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [editingProject, setEditingProject] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [isTopicDropdownOpen, setIsTopicDropdownOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [draggedSlug, setDraggedSlug] = useState(null);
  const [dropHint, setDropHint] = useState({ slug: null, position: null });
  const [isReordering, setIsReordering] = useState(false);

  // --- File handlers ---
  const handleProcessFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { showToast("กรุณาเลือกไฟล์รูปภาพเท่านั้น", "error"); return; }
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    const handlePaste = (e) => {
      if (!isFormModalOpen) return;
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) { handleProcessFile(items[i].getAsFile()); break; }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [isFormModalOpen]);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files?.[0]) { handleProcessFile(e.dataTransfer.files[0]); e.dataTransfer.clearData(); }
  };

  useEffect(() => { fetchProjects(); }, []);
  useEffect(() => { setVisibleItems(6); }, [tabValue]);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  const sortProjectsForDisplay = (list) => {
    return [...list].sort((a, b) => {
      const aOrder = Number(a.order);
      const bOrder = Number(b.order);
      const aHasOrder = Number.isFinite(aOrder);
      const bHasOrder = Number.isFinite(bOrder);

      if (aHasOrder && bHasOrder && aOrder !== bOrder) return aOrder - bOrder;
      if (aHasOrder !== bHasOrder) return aHasOrder ? -1 : 1;
      if (a.isBest === true && b.isBest !== true) return -1;
      if (a.isBest !== true && b.isBest === true) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  const normalizeProjects = (list) => {
    return sortProjectsForDisplay(list).map((item, index) => ({
      ...item,
      order: Number.isFinite(Number(item.order)) ? Number(item.order) : index + 1,
    }));
  };

  const clearDragState = () => {
    setDraggedSlug(null);
    setDropHint({ slug: null, position: null });
  };

  const persistProjectOrder = async (orderedProjects) => {
    const updates = orderedProjects.map((item, index) => {
      const nextOrder = index + 1;
      if (Number(item.order) === nextOrder) return null;

      return fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: item.slug,
          originalSlug: item.slug,
          order: nextOrder,
        }),
      });
    }).filter(Boolean);

    if (updates.length > 0) {
      await Promise.all(updates);
    }
  };

  const handleDragStart = (e, slug) => {
    if (!isAdmin) return;
    setDraggedSlug(slug);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', slug);
  };

  const handleDragOverCard = (e, slug) => {
    if (!isAdmin || !draggedSlug || draggedSlug === slug) return;
    e.preventDefault();

    const rect = e.currentTarget.getBoundingClientRect();
    const position = e.clientY < rect.top + rect.height / 2 ? 'before' : 'after';
    setDropHint({ slug, position });
    e.dataTransfer.dropEffect = 'move';
  };

  const moveProject = async (dragSlug, targetSlug, position = 'before') => {
    if (!dragSlug || !targetSlug || dragSlug === targetSlug) return;

    const currentProjects = [...projects];
    const fromIndex = currentProjects.findIndex((item) => item.slug === dragSlug);
    const targetIndex = currentProjects.findIndex((item) => item.slug === targetSlug);

    if (fromIndex === -1 || targetIndex === -1) return;

    const nextProjects = [...currentProjects];
    const [movedItem] = nextProjects.splice(fromIndex, 1);

    let insertIndex = targetIndex;
    if (fromIndex < targetIndex) insertIndex -= 1;
    if (position === 'after') insertIndex += 1;

    insertIndex = Math.max(0, Math.min(nextProjects.length, insertIndex));
    nextProjects.splice(insertIndex, 0, movedItem);

    const orderedProjects = nextProjects.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    setProjects(orderedProjects);
    setIsReordering(true);

    try {
      await persistProjectOrder(orderedProjects);
      showToast('จัดลำดับการ์ดเรียบร้อยแล้ว', 'success');
    } catch (error) {
      console.error(error);
      showToast('บันทึกลำดับไม่สำเร็จ', 'error');
      await fetchProjects();
    } finally {
      setIsReordering(false);
    }
  };

  const handleDropCard = async (e, slug) => {
    e.preventDefault();
    if (!draggedSlug) return;

    const position = dropHint.slug === slug ? dropHint.position || 'before' : 'before';
    await moveProject(draggedSlug, slug, position);
    clearDragState();
  };

  const handleDragEnd = () => {
    clearDragState();
  };

  const handleRestore = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!confirm(`⚠️ คุณแน่ใจหรือไม่ที่จะ "กู้คืนข้อมูล" จากไฟล์ ${file.name}? ข้อมูลปัจจุบันจะถูกเขียนทับ`)) { e.target.value = null; return; }
    const reader = new FileReader();
    reader.onload = async (event) => {
      setIsRestoring(true);
      try {
        const data = JSON.parse(event.target.result);
        const res = await fetch('/api/restoreDBMongo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || "Restore failed"); }
        await fetchProjects();
        showToast("กู้คืนข้อมูลสำเร็จ! ฐานข้อมูลถูกอัปเดตแล้ว", "success");
      } catch (error) { showToast(error.message || "เกิดข้อผิดพลาดในการกู้คืนข้อมูล", "error"); }
      finally { setIsRestoring(false); e.target.value = null; }
    };
    reader.readAsText(file);
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      const data = await res.json();
      setProjects(normalizeProjects(Array.isArray(data) ? data : []));
    } catch { setProjects([]); }
    finally { setLoading(false); }
  };

  // --- Tabs data ---
  const isYearCategory = (value) => /^\d{4}$/.test(String(value || "").trim());
  const uniqueYearCategories = Array.from(
    new Set(
      projects
        .map((item) => String(item.category || "").trim())
        .filter(isYearCategory)
    )
  ).sort((a, b) => Number(b) - Number(a));
  
  // แยกหมวดหมู่พิเศษกับปี
  const specialCategories = [
    { category: "all", label: "All" },
    { category: "Best", label: "⭐ Best" },
    { category: "Cloud", label: "☁️ Cloud" },
    { category: "Network", label: "🌐 Network" },
    { category: "DevSecOps", label: "🛡️ DevSecOps" },
    { category: "Certificate", label: "📜 Certificate" },
    { category: "Community", label: "🤝 Community" },
  ];
  
  const yearCategories = uniqueYearCategories.map((c) => ({ category: c, label: c }));
  const canCollapseYears = yearCategories.length > 0;

  const handleToggleYears = () => {
    setIsYearsCollapsed((prev) => {
      const next = !prev;

      // เมื่อซ่อนปีทั้งหมด ถ้ากำลังอยู่แท็บปีให้กลับไป All
      if (next && isYearCategory(tabValue)) {
        setTabValue("all");
      }

      return next;
    });
  };
  
  // แสดงปีตามสถานะการหุบ/ขยาย
  const displayedYears = (() => {
    if (!canCollapseYears || !isYearsCollapsed) return yearCategories;
    return [];
  })();
  
  const tabData = [...specialCategories, ...displayedYears];

  const hasSpecialTopic = (item, topic) => {
    if (Array.isArray(item.specialTopics) && item.specialTopics.includes(topic)) return true;
    if (item.specialTopic === topic) return true;
    if (topic === "Cloud") return item.isCloud === true;
    if (topic === "Network") return item.isNetwork === true;
    if (topic === "DevSecOps") return item.isDevSecOps === true;
    if (topic === "Certificate") return item.isCertificate === true;
    if (topic === "Community") return item.isCommunity === true;
    return false;
  };

  const filterWork = projects
    .filter((item) => {
      if (tabValue === "all") return true;
      if (tabValue === "Best") return item.isBest === true;
      if (tabValue === "Cloud") return hasSpecialTopic(item, "Cloud");
      if (tabValue === "Network") return hasSpecialTopic(item, "Network");
      if (tabValue === "DevSecOps") return hasSpecialTopic(item, "DevSecOps");
      if (tabValue === "Certificate") return hasSpecialTopic(item, "Certificate");
      if (tabValue === "Community") return hasSpecialTopic(item, "Community");
      return item.category === tabValue;
    })
    .sort((a, b) => {
      const aOrder = Number(a.order);
      const bOrder = Number(b.order);
      const aHasOrder = Number.isFinite(aOrder);
      const bHasOrder = Number.isFinite(bOrder);

      if (aHasOrder && bHasOrder && aOrder !== bOrder) return aOrder - bOrder;
      if (aHasOrder !== bHasOrder) return aHasOrder ? -1 : 1;
      if (a.isBest === true && b.isBest !== true) return -1;
      if (a.isBest !== true && b.isBest === true) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  // --- Auth & CRUD handlers ---
  const handleLogin = (e) => {
    e.preventDefault();
    fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: passwordInput }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "รหัสผ่านไม่ถูกต้อง");

        setIsAdmin(true);
        setIsAuthModalOpen(false);
        setPasswordInput("");
        showToast("เข้าสู่ระบบ Admin สำเร็จ!");
      })
      .catch((error) => {
        showToast(error.message || "รหัสผ่านไม่ถูกต้อง", "error");
      });
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    if (newDate) {
      const yearBE = (parseInt(newDate.split("-")[0]) + 543).toString();
      setFormData({ ...formData, createdAt: newDate, category: yearBE });
    } else {
      setFormData({ ...formData, createdAt: newDate });
    }
  };

  const uploadToCloudinary = async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;
    fd.append("upload_preset", uploadPreset);
    fd.append("cloud_name", cloudName);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "Upload failed");
    return data.secure_url;
  };

  const openAddModal = () => {
    setEditingProject(null);
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    const currentThaiYear = (today.getFullYear() + 543).toString();
    setFormData({ ...defaultFormData, category: currentThaiYear, createdAt: dateString });
    setIsTopicDropdownOpen(false);
    setSelectedFile(null);
    setImagePreview("");
    setIsFormModalOpen(true);
  };

  const openEditModal = (project) => {
    const legacyTopics = [
      project.isCloud ? "Cloud" : null,
      project.isNetwork ? "Network" : null,
      project.isDevSecOps ? "DevSecOps" : null,
      project.isCertificate ? "Certificate" : null,
      project.isCommunity ? "Community" : null,
    ].filter(Boolean);

    const mergedTopics = Array.from(new Set([
      ...(Array.isArray(project.specialTopics) ? project.specialTopics : []),
      ...(project.specialTopic ? [project.specialTopic] : []),
      ...legacyTopics,
    ]));

    setEditingProject(project);
    setFormData({
      title: project.title, category: project.category, slug: project.slug, img: project.img,
      createdAt: project.createdAt ? new Date(project.createdAt).toISOString().split('T')[0] : "",
      link: project.link || "",
      specialTopics: mergedTopics,
      isCertificate: project.isCertificate || false,
      isBest: project.isBest || false,
      isCloud: project.isCloud || false,
      isNetwork: project.isNetwork || false,
      isCommunity: project.isCommunity || false,
    });
    setIsTopicDropdownOpen(false);
    setImagePreview(project.img);
    setSelectedFile(null);
    setIsFormModalOpen(true);
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!formData.slug || formData.slug.trim() === "") { showToast("กรุณาระบุ Slug สำหรับ URL ด้วยครับ", "error"); return; }
    setIsSaving(true);
    try {
      let finalImageUrl = formData.img;
      if (selectedFile) finalImageUrl = await uploadToCloudinary(selectedFile);
      const normalizedTopics = Array.from(new Set(formData.specialTopics || []));
      const payload = {
        ...formData,
        img: finalImageUrl,
        specialTopics: normalizedTopics,
        specialTopic: normalizedTopics[0] || "",
        isCloud: normalizedTopics.includes("Cloud"),
        isNetwork: normalizedTopics.includes("Network"),
        isDevSecOps: normalizedTopics.includes("DevSecOps"),
        isCertificate: normalizedTopics.includes("Certificate"),
        isCommunity: normalizedTopics.includes("Community"),
      };
      if (editingProject) payload.originalSlug = editingProject.slug;
      const res = await fetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (res.ok) {
        await fetchProjects();
        setTimeout(() => {
          setIsFormModalOpen(false); setIsSaving(false); setEditingProject(null);
          setIsTopicDropdownOpen(false);
          setFormData(defaultFormData); setSelectedFile(null); setImagePreview("");
          showToast(editingProject ? "แก้ไขงานสำเร็จ!" : "เพิ่มงานใหม่สำเร็จ!", "success");
        }, 800);
      } else {
        if (res.status === 409) showToast(data.error, "error");
        else throw new Error(data.error || "Save failed");
        setIsSaving(false);
      }
    } catch (error) { showToast(error.message || "เกิดข้อผิดพลาดในการบันทึก", "error"); setIsSaving(false); }
  };

  const handleDeleteProject = async (slug) => {
    if (!confirm("⚠️ คุณแน่ใจหรือไม่ว่าจะลบงานนี้?")) return;
    setDeletingId(slug);
    try {
      const res = await fetch(`/api/projects?slug=${slug}`, { method: 'DELETE' });
      if (res.ok) {
        setTimeout(() => { setProjects((prev) => prev.filter((item) => item.slug !== slug)); setDeletingId(null); showToast("ลบงานเรียบร้อยแล้ว"); }, 600);
      } else throw new Error("Delete failed");
    } catch { showToast("ลบไม่สำเร็จ กรุณาลองใหม่", "error"); setDeletingId(null); }
  };

  const handleWipeDatabase = async () => {
    if (deleteConfirmationText !== "CONFIRM-DELETE") return;
    setIsWipingData(true);
    try {
      const res = await fetch(`/api/resetDBMongo`, { method: 'DELETE' });
      if (res.ok) { setProjects([]); setIsDeleteAllModalOpen(false); setDeleteConfirmationText(""); showToast("ล้างข้อมูลทั้งหมดเรียบร้อยแล้ว", "success"); }
      else { const err = await res.json().catch(() => ({})); throw new Error(err.error || "Wipe failed"); }
    } catch { showToast("เกิดข้อผิดพลาดในการล้างข้อมูล", "error"); }
    finally { setIsWipingData(false); }
  };

  const handleBackup = async () => {
    if (!confirm("ต้องการสำรองข้อมูล (Backup) ทั้งหมดใช่หรือไม่?")) return;
    setIsBackingUp(true);
    try {
      const res = await fetch('/api/backup');
      if (!res.ok) throw new Error("Backup failed");
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `backup_portfolio_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(url);
      showToast("Backup ข้อมูลเรียบร้อยแล้ว!");
    } catch { showToast("เกิดข้อผิดพลาดในการ Backup", "error"); }
    finally { setIsBackingUp(false); }
  };

  const toggleSpecialTopic = (topic) => {
    setFormData((prev) => {
      const exists = prev.specialTopics.includes(topic);
      const nextTopics = exists
        ? prev.specialTopics.filter((t) => t !== topic)
        : [...prev.specialTopics, topic];
      return { ...prev, specialTopics: nextTopics };
    });
  };

  if (loading) return (
    <div className="pt-24 flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 border-4 border-[#7edad2]/20 border-t-[#7edad2] rounded-full animate-spin"></div>
      <div className="text-center animate-pulse text-[#7edad2] font-semibold tracking-wide">กำลังโหลดข้อมูล...</div>
    </div>
  );

  return (
    <section className="pt-24 min-h-[1000px]" id="work">
      <div className="container mx-auto">

        {/* --- Header & ปุ่ม Admin --- */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-8 gap-4">
          <AnimatedText text="My Experience" textStyles="h2" />
          {!isAdmin ? (
            <button onClick={() => setIsAuthModalOpen(true)} className="text-xs text-gray-400 hover:text-[#00ff99] transition-colors">
              Admin Access
            </button>
          ) : (
            <div className="flex flex-wrap gap-3 items-center justify-center">
              <motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-xs text-[#00ff99] bg-[#00ff99]/10 px-2 py-1 rounded border border-[#00ff99]/20">
                Admin Mode
              </motion.span>
              <span className="text-xs text-gray-400 self-center">
                {isReordering ? 'กำลังบันทึกลำดับ...' : 'ลากการ์ดเพื่อจัดลำดับได้'}
              </span>
              <motion.button
                initial={{ opacity: 0 }} animate={{ opacity: 0.1 }}
                onClick={() => { setDeleteConfirmationText(""); setIsDeleteAllModalOpen(true); }}
                className="text-[10px] text-gray-400 px-2 py-1 transition-all cursor-pointer font-mono tracking-widest border border-transparent hover:border-red-500/30 hover:opacity-100 hover:text-red-500 rounded"
                title="DANGER ZONE: RESET DATABASE"
              >
                [RESET DB]
              </motion.button>
              <label htmlFor="restore-file-input"
                className={`bg-red-500 text-white px-4 py-2 rounded-full font-bold transition-all text-sm flex items-center gap-2 shadow-sm cursor-pointer hover:scale-105 active:scale-95 ${isRestoring ? 'opacity-50' : 'hover:bg-red-600'}`}
              >
                {isRestoring ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span> : <BackupIcon />}
                <span>Restore</span>
                <input type="file" id="restore-file-input" accept=".json" onChange={handleRestore} disabled={isRestoring} className="hidden" />
              </label>
              <button onClick={handleBackup} disabled={isBackingUp}
                className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-full font-bold hover:bg-gray-100 transition-all text-sm flex items-center gap-2 shadow-sm disabled:opacity-50 hover:scale-105 active:scale-95"
              >
                {isBackingUp ? <span className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full"></span> : <BackupIcon />}
                <span>Backup</span>
              </button>
              <button onClick={openAddModal}
                className="bg-[#00ff99] text-black px-4 py-2 rounded-full font-bold hover:bg-[#00cc7a] transition-all text-sm flex items-center gap-2 shadow-lg shadow-[#00ff99]/20 hover:scale-105 active:scale-95"
              >
                + เพิ่มงานใหม่
              </button>
            </div>
          )}
        </div>

        {/* --- Tabs --- */}
        <Tabs value={tabValue} onValueChange={setTabValue} className="w-full flex flex-col">
          <div className="flex items-center mb-[30px]">
            <TabsList className="w-full md:w-auto max-w-full h-auto flex flex-row flex-wrap items-center justify-center md:justify-start gap-1 p-2 rounded-[28px] border-[#7edad2]/80 shadow-[0_0_0_1px_rgba(126,218,210,0.35),0_0_18px_rgba(126,218,210,0.22)] mx-auto md:mx-0">
              {tabData.map((item, index) => (
                <TabsTrigger key={index} value={item.category} className="capitalize w-auto min-w-[96px] px-4 border border-[#7edad2]/45 data-[state=active]:border-[#7edad2]">
                  {item.label}
                </TabsTrigger>
              ))}

              {/* ปุ่มหุบ/ขยายปีให้อยู่ใน bar เดียวกับ Tabs */}
              {canCollapseYears && (
                <button
                  type="button"
                  onClick={handleToggleYears}
                  className="inline-flex items-center justify-center gap-1 whitespace-nowrap h-[40px] rounded-full px-4 text-sm font-medium transition-all text-gray-500 hover:text-[#00ff99] hover:bg-[#00ff99]/10 border border-[#7edad2]/45"
                >
                  <span>{isYearsCollapsed ? `Years(${yearCategories.length})` : 'Hide'}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className={`w-4 h-4 transition-transform ${isYearsCollapsed ? '' : 'rotate-180'}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
              )}
            </TabsList>
          </div>

          <TabsContent value={tabValue} className="w-full">
            {filterWork.length === 0 ? (
              <div className="text-center text-gray-500 py-10">ยังไม่มีข้อมูลในหมวดนี้</div>
            ) : (
              <motion.div layout className="grid grid-cols-1 lg:grid-cols-3 gap-[30px]">
                <AnimatePresence mode="popLayout">
                  {filterWork.slice(0, visibleItems).map((item, index) => {
                    const isDeleting = deletingId === item.slug;
                    const isDraggingCard = draggedSlug === item.slug;
                    const isDropBefore = dropHint.slug === item.slug && dropHint.position === 'before';
                    const isDropAfter = dropHint.slug === item.slug && dropHint.position === 'after';
                    return (
                      <motion.div
                        layout key={item._id || item.slug || index}
                        variants={cardVariants}
                        initial="hidden"
                        animate={isDeleting ? { x: [0, -10, 10, -10, 10, 0], transition: { duration: 0.4 } } : "visible"}
                        exit="exit" whileHover="hover"
                        draggable={isAdmin}
                        onDragStart={(e) => handleDragStart(e, item.slug)}
                        onDragOver={(e) => handleDragOverCard(e, item.slug)}
                        onDrop={(e) => handleDropCard(e, item.slug)}
                        onDragEnd={handleDragEnd}
                        className={`relative group rounded-3xl overflow-hidden ${isAdmin ? "cursor-grab active:cursor-grabbing" : ""} ${isDraggingCard ? "opacity-60 scale-[0.98]" : ""} ${isDeleting ? "ring-4 ring-red-500 shadow-2xl shadow-red-500/50" : ""}`}
                      >
                        {isAdmin && (
                          <>
                            <div className={`absolute left-4 right-4 top-2 z-20 h-1 rounded-full transition-opacity ${isDropBefore ? 'bg-[#00ff99] opacity-100' : 'opacity-0'}`} />
                            <div className={`absolute left-4 right-4 bottom-2 z-20 h-1 rounded-full transition-opacity ${isDropAfter ? 'bg-[#00ff99] opacity-100' : 'opacity-0'}`} />
                            <div className="absolute top-4 left-4 z-20 pointer-events-none">
                              <span className="text-[10px] tracking-[0.25em] font-mono text-white/90 bg-black/60 px-2 py-1 rounded-full border border-white/10">
                                DRAG
                              </span>
                            </div>
                          </>
                        )}
                        <div className="absolute top-14 left-4 z-20 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-[10px] tracking-wider font-mono text-white/90 bg-black/70 px-2 py-1 rounded border border-white/10 shadow-sm">
                            /{item.slug}
                          </span>
                        </div>
                        {isDeleting && (
                          <div className="absolute inset-0 z-50 bg-red-500/30 flex items-center justify-center">
                            <div className="bg-white/90 p-3 rounded-full shadow-lg"><TrashIcon className="w-8 h-8 text-red-600 animate-bounce" /></div>
                          </div>
                        )}
                        <WorkItem {...item} />
                        {isAdmin && !isDeleting && (
                          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-10 translate-y-2 group-hover:translate-y-0">
                            <button
                              onClick={(e) => { e.stopPropagation(); openEditModal(item); }}
                              className="p-2.5 bg-white text-blue-500 rounded-full shadow-lg hover:bg-blue-500 hover:text-white border border-blue-100 hover:scale-110 active:scale-90 transition-transform"
                            ><PencilIcon /></button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeleteProject(item.slug); }}
                              className="p-2.5 bg-white text-red-500 rounded-full shadow-lg hover:bg-red-500 hover:text-white border border-red-100 hover:scale-110 active:scale-90 transition-transform"
                            ><TrashIcon /></button>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
            {visibleItems < filterWork.length && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => setVisibleItems(prev => prev + 6)} 
                  className="btn btn-accent rounded-full px-6 hover:scale-105 active:scale-95 transition-transform"
                >
                  Load more ({filterWork.length - visibleItems})
                </button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* --- Portals (Toast + Modals) --- */}
      {typeof document !== 'undefined' && createPortal(
        <>
          {/* Toast - ลด animation เพื่อประหยัด GPU */}
          <AnimatePresence>
            {toast.show && (
              <motion.div
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="fixed bottom-6 right-6 z-[10000] cursor-pointer"
                onClick={() => setToast({ ...toast, show: false })}
              >
                <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border ${toast.type === "success" ? "bg-black/90 border-[#00ff99]/50" : "bg-black/90 border-red-500/50"}`}>
                  {toast.type === "success" ? <CheckCircleIcon /> : <XCircleIcon />}
                  <div>
                    <h4 className={`font-bold text-sm ${toast.type === "success" ? "text-white" : "text-red-400"}`}>{toast.type === "success" ? "สำเร็จ" : "ข้อผิดพลาด"}</h4>
                    <p className="text-xs text-gray-300">{toast.message}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Admin Login Modal - ลด blur และ animation */}
          <AnimatePresence>
            {isAuthModalOpen && (
              <div className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-xs overflow-hidden">
                  <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">Admin Login</h3>
                  <form onSubmit={handleLogin}>
                    <input type="password" autoFocus placeholder="Password"
                      className="border border-gray-300 p-2 rounded-lg w-full mb-4 text-center text-gray-800 outline-none focus:border-[#00ff99] transition-colors"
                      value={passwordInput} onChange={e => setPasswordInput(e.target.value)} />
                    <div className="flex justify-between gap-2">
                      <button type="button" onClick={() => setIsAuthModalOpen(false)} className="text-gray-500 text-sm hover:text-gray-700">Cancel</button>
                      <button type="submit" className="bg-black text-white px-6 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors">Unlock</button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Delete All Modal - ลด animation */}
          <AnimatePresence>
            {isDeleteAllModalOpen && (
              <div className="fixed inset-0 bg-red-950/85 z-[10000] flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border-4 border-red-500 text-center relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-4 bg-[repeating-linear-gradient(45deg,#ef4444,#ef4444_10px,#b91c1c_10px,#b91c1c_20px)]"></div>
                  <div className="flex flex-col items-center gap-4 mt-4">
                    <SkullIcon />
                    <h3 className="text-3xl font-black text-red-600 uppercase tracking-widest">Danger Zone</h3>
                    <p className="text-gray-600 text-sm">คุณกำลังจะ <span className="font-bold text-red-600">ลบข้อมูลทั้งหมด</span> ในฐานข้อมูล<br />การกระทำนี้ <u className="font-bold">ไม่สามารถกู้คืนได้</u></p>
                  </div>
                  <div className="mt-6">
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">พิมพ์ "CONFIRM-DELETE" เพื่อยืนยัน</label>
                    <input type="text"
                      className="border-2 border-red-200 bg-red-50 p-3 rounded-xl w-full text-center font-bold text-red-600 focus:outline-none focus:border-red-500 placeholder:text-red-200"
                      placeholder="CONFIRM-DELETE" value={deleteConfirmationText} onChange={e => setDeleteConfirmationText(e.target.value)} />
                  </div>
                  <div className="flex justify-between gap-3 mt-8">
                    <button onClick={() => setIsDeleteAllModalOpen(false)} className="w-full py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">ยกเลิก</button>
                    <button onClick={handleWipeDatabase} disabled={deleteConfirmationText !== "CONFIRM-DELETE" || isWipingData}
                      className="w-full py-3 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {isWipingData ? "กำลังล้างข้อมูล..." : "ลบทั้งหมดเดี๋ยวนี้"}
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Form Modal (Add / Edit) - ลด animation */}
          <AnimatePresence>
            {isFormModalOpen && (
              <div className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                      {editingProject ? <><PencilIcon /> แก้ไขโปรเจกต์</> : "+ เพิ่มโปรเจกต์ใหม่"}
                    </h3>
                    <button onClick={() => setIsFormModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors text-2xl">&times;</button>
                  </div>

                  <form onSubmit={handleSaveProject} className="flex flex-col gap-4">

                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อโปรเจกต์ (Title)</label>
                      <input required className="border p-3 rounded-xl w-full bg-gray-50 outline-none border-gray-200 text-black transition-all"
                        value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                    </div>

                    {/* Category (readonly) + Slug + Date */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ปี (Category)</label>
                        <input required readOnly className="border p-3 rounded-xl w-full bg-gray-100 outline-none border-gray-200 text-black"
                          value={formData.category} />
                      </div>
                      <div>
                        <label className="flex justify-between items-end mb-1">
                          <span className="text-sm font-medium text-gray-700">Slug (URL)</span>
                          <span className="text-xs text-red-500 font-normal">*ห้ามมีช่องว่าง</span>
                        </label>
                        <input required placeholder="eng-only-no-space"
                          className="border p-3 rounded-xl w-full bg-gray-50 outline-none border-gray-200 text-black transition-all"
                          value={formData.slug}
                          onChange={e => setFormData({ ...formData, slug: e.target.value.replace(/\s+/g, '') })} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">วันที่ (Date)</label>
                        <input type="date" required
                          className="border p-3 rounded-xl w-full bg-gray-50 outline-none border-gray-200 text-black transition-all"
                          value={formData.createdAt} onChange={handleDateChange} />
                      </div>
                    </div>

                    {/* Special Topics */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">หัวข้อพิเศษ (เลือกได้หลายอย่าง)</label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsTopicDropdownOpen((prev) => !prev)}
                          className="w-full border p-3 rounded-xl bg-gray-50 outline-none border-gray-200 text-black transition-all text-left flex items-center justify-between"
                        >
                          <span className="text-sm text-gray-700 truncate pr-3">
                            {formData.specialTopics.length > 0
                              ? `${formData.specialTopics.length} แท็กที่เลือก`
                              : "ไม่มี"}
                          </span>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 text-gray-500 transition-transform ${isTopicDropdownOpen ? "rotate-180" : ""}`}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </button>

                        {isTopicDropdownOpen && (
                          <div className="absolute z-30 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                            {specialTopicOptions.map((option) => {
                              const selected = formData.specialTopics.includes(option.value);
                              return (
                                <button
                                  key={option.value}
                                  type="button"
                                  onClick={() => toggleSpecialTopic(option.value)}
                                  className={`w-full px-3 py-2.5 text-left text-sm flex items-center justify-between transition-colors ${selected ? "bg-[#7edad2]/15 text-gray-900" : "text-gray-600 hover:bg-gray-50"}`}
                                >
                                  <span>{option.label}</span>
                                  {selected && (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-[#00a777]">
                                      <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.01 7a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.42l2.293 2.29 6.303-6.29a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {formData.specialTopics.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.specialTopics.map((topic) => {
                            const topicLabel = specialTopicOptions.find((opt) => opt.value === topic)?.label || topic;
                            return (
                              <button
                                key={topic}
                                type="button"
                                onClick={() => toggleSpecialTopic(topic)}
                                className="text-xs px-2.5 py-1 rounded-full bg-[#7edad2]/20 text-[#005b44] border border-[#7edad2]/40 hover:bg-[#7edad2]/30 transition-colors"
                              >
                                {topicLabel} ×
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Best Tag */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Highlight</label>
                      <div className="grid grid-cols-1 gap-2">
                        <button
                          type="button"
                          className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all select-none ${formData.isBest ? "bg-yellow-50 border-yellow-400 text-yellow-600 shadow-sm" : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"}`}
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
                          <span className="font-medium text-sm">⭐ Best Project</span>
                        </button>
                      </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">รูปปก (Image)</label>
                      <motion.div
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer relative group ${isDragging ? "border-[#7edad2] bg-[#7edad2]/10 scale-105" : "border-gray-300 hover:bg-gray-50"}`}
                      >
                        <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                          onChange={(e) => handleProcessFile(e.target.files[0])} />
                        {imagePreview ? (
                          <div className="relative">
                            <img src={imagePreview} alt="preview" className="h-40 mx-auto rounded-lg object-contain shadow-sm" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg text-white font-bold text-sm pointer-events-none">เปลี่ยนรูป</div>
                          </div>
                        ) : (
                          <div className="text-gray-400 text-sm py-8 pointer-events-none flex flex-col items-center gap-1">
                            <div><span className="text-[#7edad2] font-bold">คลิกเพื่อเลือกรูป</span> หรือลากไฟล์มาวาง</div>
                            <div className="text-xs text-gray-300">
                              หรือกด <kbd className="font-sans border border-gray-200 rounded px-1 bg-white text-gray-500">Ctrl</kbd> + <kbd className="font-sans border border-gray-200 rounded px-1 bg-white text-gray-500">V</kbd> เพื่อวางรูป
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </div>

                    {/* Link */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        แนบลิงก์ผลงาน (Link / URL) <span className="text-xs text-gray-400 font-normal">(ไม่บังคับ)</span>
                      </label>
                      <input type="url" placeholder="https://..."
                        className="border p-3 rounded-xl w-full bg-gray-50 outline-none border-gray-200 text-black transition-all placeholder:text-gray-300"
                        value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} />
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                      <button type="button" onClick={() => setIsFormModalOpen(false)} className="px-6 py-2.5 text-gray-500 hover:bg-gray-100 rounded-xl font-medium transition-colors">ยกเลิก</button>
                      <button type="submit" disabled={isSaving}
                        className={`px-8 py-2.5 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2 min-w-[140px] justify-center hover:scale-105 active:scale-95 ${isSaving ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-[#00ff99] text-black hover:bg-[#00cc7a]"}`}
                      >
                        {isSaving ? (
                          <><span className="animate-spin h-5 w-5 border-2 border-gray-600 border-t-transparent rounded-full"></span><span>บันทึก...</span></>
                        ) : (
                          editingProject ? "บันทึกการแก้ไข" : "เพิ่มงานใหม่"
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </>,
        document.body
      )}
    </section>
  );
}