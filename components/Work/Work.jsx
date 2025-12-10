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

  const [tabValue, setTabValue] = useState("all");
  const [visibleItems, setVisibleItems] = useState(6);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  // ✅ [NEW] State สำหรับปุ่มล้างบาง
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  const [isWipingData, setIsWipingData] = useState(false);

  const [passwordInput, setPasswordInput] = useState("");

  const [editingProject, setEditingProject] = useState(null);

  const [formData, setFormData] = useState({ title: "", category: "2569", slug: "", img: "" });
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    fetchProjects();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
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

  const uniqueCategories = Array.from(new Set(projects.map((item) => item.category))).sort().reverse();
  const tabData = [{ category: "all" }, ...uniqueCategories.map((category) => ({ category }))];
  const filterWork = tabValue === "all" ? projects : projects.filter((item) => item.category === tabValue);

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

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({ title: "", category: "2569", slug: "", img: "" });
    setIsFormModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      category: project.category,
      slug: project.slug,
      img: project.img
    });
    setIsFormModalOpen(true);
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = { ...formData };
    if (editingProject) {
      payload.originalSlug = editingProject.slug;
    }

    try {
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
          setFormData({ title: "", description: "", img: "", category: "", slug: "" });
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

  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  if (loading) return <div className="pt-24 text-center animate-pulse text-[#00ff99]">กำลังโหลดข้อมูล...</div>;

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
                  onClick={() => setVisibleItems(prev => prev + 2)}
                  className="btn btn-accent rounded-full px-6"
                >
                  Load more
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
                      <input required className="border p-3 rounded-xl w-full bg-gray-50 focus:ring-2 ring-[#00ff99]/20 outline-none border-gray-200 text-black transition-all" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ปี (Category)</label>
                        <input required placeholder="เช่น 2569" className="border p-3 rounded-xl w-full bg-gray-50 focus:ring-2 ring-[#00ff99]/20 outline-none border-gray-200 text-black transition-all" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                        <input required placeholder="eng-only-no-space" className="border p-3 rounded-xl w-full bg-gray-50 focus:ring-2 ring-[#00ff99]/20 outline-none border-gray-200 text-black transition-all" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">รูปปก (Image)</label>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer relative group"
                      >
                        <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={async (e) => { if (e.target.files[0]) { const base64 = await toBase64(e.target.files[0]); setFormData({ ...formData, img: base64 }); } }} />
                        {formData.img ? (
                          <div className="relative">
                            <img src={formData.img} alt="preview" className="h-40 mx-auto rounded-lg object-contain shadow-sm" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg text-white font-bold text-sm">เปลี่ยนรูป</div>
                          </div>
                        ) : (
                          <div className="text-gray-400 text-sm py-8"><span className="text-[#00ff99] font-bold">คลิกเพื่อเลือกรูป</span> หรือลากไฟล์มาวาง</div>
                        )}
                      </motion.div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                      <button type="button" onClick={() => setIsFormModalOpen(false)} className="px-6 py-2.5 text-gray-500 hover:bg-gray-100 rounded-xl font-medium transition-colors">ยกเลิก</button>

                      <motion.button
                        type="submit"
                        disabled={isSaving}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-8 py-2.5 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2 min-w-[140px] justify-center ${isSaving ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-[#00ff99] text-black hover:bg-[#00cc7a] shadow-[#00ff99]/20"}`}
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