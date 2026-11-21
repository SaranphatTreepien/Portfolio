"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SiGmail } from "react-icons/si";
import {
  FaDownload,
  FaUser,
  FaFileAlt,
  FaBriefcase,
  FaBuilding,
  FaPhone,
  FaPaperPlane,
  FaTimes,
  FaLock,
  FaCalendarAlt,
  FaFilePdf,
  FaFileSignature,
  FaImage,
  FaTrash,
  FaFileUpload,
  FaPencilAlt,
  FaShare,
} from "react-icons/fa";
import { MdEmail, MdDateRange } from "react-icons/md";
import Confetti from "react-confetti";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { LanguageToggle, useLang } from "@/components/LanguageProvider";

// Text for the public part of the page. The admin-only application email form below stays Thai:
// it writes a Thai email to HR.
const T = {
  back: { th: "กลับหน้าหลัก", en: "Back to home" },
  eyebrow: { th: "โปรไฟล์ส่วนตัว", en: "Personal profile" },
  title: { th: "CV", en: "CV" },
  lead: {
    th: "ทำความรู้จักประสบการณ์ ทักษะ และเส้นทางการทำงานของ Saranphat พร้อมดาวน์โหลดเอกสารสำหรับโอกาสใหม่ๆ",
    en: "Get to know Saranphat's experience, skills and career path, and download the document for new opportunities.",
  },
  available: { th: "พร้อมรับโอกาสใหม่", en: "Available for opportunities" },
  openTo: { th: "เปิดรับงานที่มีความหมาย", en: "Open to meaningful work" },
  preview: { th: "ตัวอย่างเอกสาร", en: "Document preview" },
  download: { th: "ดาวน์โหลด CV (PDF)", en: "Download CV PDF" },
  share: { th: "แชร์ CV (PDF)", en: "Share CV PDF" },
  hint: { th: "PDF · คลิกเพื่อขยาย", en: "PDF · Click to expand" },
  zoom: { th: "🔍 คลิกเพื่อขยาย", en: "🔍 Click to expand" },
  loading: { th: "⏳ กำลังโหลด CV...", en: "⏳ Loading CV..." },
  preparing: { th: "⏳ กำลังเตรียมไฟล์...", en: "⏳ Preparing the file..." },
  downloaded: { th: (f) => `✅ ดาวน์โหลด: ${f} เรียบร้อย`, en: (f) => `✅ Downloaded: ${f}` },
  downloadFailed: { th: "❌ ไม่สามารถดาวน์โหลดไฟล์ได้", en: "❌ Couldn't download the file" },
  sharedLink: { th: "🔗 แชร์ Link แทน (อุปกรณ์ไม่รองรับแชร์ไฟล์)", en: "🔗 Shared a link instead (this device can't share files)" },
  copied: { th: "📋 คัดลอกลิงก์แล้ว!", en: "📋 Link copied!" },
  shareFailed: { th: "❌ แชร์ไม่สำเร็จ", en: "❌ Couldn't share" },
  shareMessage: {
    th: "สวัสดีครับ ผมศรัณย์ภัทร ตรีเพียร\nขออนุญาตส่ง CV เพื่อพิจารณาครับผม 🙇‍♂️📄",
    en: "Hello, I'm Saranphat Treepien.\nPlease find my CV attached for your consideration. 📄",
  },
  nameTitle: { th: "ตั้งชื่อไฟล์", en: "Name the file" },
  nameLead: {
    th: (a) => `กรอกตำแหน่ง (ไม่บังคับ) ก่อน${a === "download" ? "โหลด" : "แชร์"}`,
    en: (a) => `Add the position (optional) before you ${a === "download" ? "download" : "share"}`,
  },
  namePlaceholder: { th: "เช่น DevSecOps", en: "e.g. DevSecOps" },
  fileName: { th: "ชื่อไฟล์:", en: "File name:" },
  ok: { th: "ตกลง", en: "OK" },
  skip: { th: "ไม่กรอก", en: "Skip" },
  cancel: { th: "ยกเลิก", en: "Cancel" },
};
// --- ⚙️ ตั้งรหัสผ่าน Admin ---

// --- 📂 ตั้งค่า Path ไฟล์ PDF ---
// The CV (one document). The file keeps its old name so links that were already shared keep working.
const CV_PATH = "/assets/document/Saranphat_Treepian_Resume.pdf";

// ✨ Component ช่วยไฮไลท์ข้อความ (คลิกแล้วจะส่ง event ไปบอก Parent ว่าขอแก้)
const Highlight = ({ children, label }) => (
  <span className="relative group inline-block cursor-pointer mx-1 align-baseline">
    <span className="bg-yellow-100 text-yellow-800 border-b-2 border-yellow-300 px-1 rounded-t-sm font-medium transition-colors group-hover:bg-yellow-200">
      {children || (
        <span className="text-gray-400 italic text-sm">...{label}...</span>
      )}
    </span>
    {/* Tooltip */}
    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10 pointer-events-none shadow-lg">
      คลิกเพื่อแก้ไข "{label}"
    </span>
  </span>
);

// Component Input Helper
const InputField = ({ icon: Icon, className, label, ...props }) => (
  <div className={`relative group ${className || ""}`}>
    {label && (
      <label className="text-xs font-semibold text-gray-500 mb-1 block ml-1">
        {label}
      </label>
    )}
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#7edad2] transition-colors">
        <Icon />
      </div>
      <input
        {...props}
        className="w-full pl-10 pr-4 py-3 bg-[#f8fafc] border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7edad2] focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400 text-gray-700 text-sm shadow-sm"
      />
    </div>
  </div>
);

export default function CVPage() {
  const { tx } = useLang();
  const L = (key, ...args) => { const v = tx(T[key]); return typeof v === "function" ? v(...args) : v; };
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // State Modal
  const [showSendAlert, setShowSendAlert] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showExportNameModal, setShowExportNameModal] = useState(false);
  const [pendingExportAction, setPendingExportAction] = useState(null);

  // State Admin
  const [isAdmin, setIsAdmin] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const [language, setLanguage] = useState("TH");
  const docType = "CV"; // single document; the RESUME / BOTH choice was removed with the old CV file
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [exportPosition, setExportPosition] = useState("");

  // 📝 Form State
  const [form, setForm] = useState({
    firstName: "Saranphat",
    lastName: "Treepian",
    emailSender: "saranphat.tre289@gmail.com",
    position: "",
    company: "",
    receiverEmail: "",
    phone: "0614461930",
    startDate: "",
    endDate: "",
    customMessage: "",
  });

  // State จัดการชื่อไฟล์
  const [cvFileName, setCvFileName] = useState("");
  const [isManualCV, setIsManualCV] = useState(false);

  // State ไฟล์แนบ
  const [attachedImages, setAttachedImages] = useState([]);
  const [attachedPdfs, setAttachedPdfs] = useState([]);

  const [isManualEdit, setIsManualEdit] = useState(false);
  const textareaRef = useRef(null);
  const canvasRef = useRef(null);
  const [pdfThumbReady, setPdfThumbReady] = useState(false);

  useEffect(() => {
    let renderTask = null;
    let cancelled = false;

    const renderThumb = async () => {
      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.mjs",
          import.meta.url,
        ).toString();

        const pdf = await pdfjsLib.getDocument(CV_PATH).promise;
        if (cancelled) return; // ✅ ถ้า unmount แล้วให้หยุด

        const page = await pdf.getPage(1);
        if (cancelled) return;

        const scale = 2;
        const viewport = page.getViewport({ scale });

        const canvas = canvasRef.current;
        if (!canvas || cancelled) return;

        // ✅ Clear canvas ก่อน render ใหม่
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // ✅ เก็บ renderTask ไว้ cancel ได้
        renderTask = page.render({ canvasContext: ctx, viewport });

        await renderTask.promise;

        if (!cancelled) setPdfThumbReady(true);
      } catch (err) {
        if (err?.name !== "RenderingCancelledException") {
          console.error("PDF render error:", err);
        }
      }
    };

    renderThumb();

    // ✅ Cleanup: cancel เมื่อ component unmount หรือ re-render
    return () => {
      cancelled = true;
      if (renderTask) renderTask.cancel();
    };
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      const handleResize = () =>
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Helper: Format Date
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const parts = dateString.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1;
      const day = parseInt(parts[2]);
      const date = new Date(year, month, day);
      return date.toLocaleDateString(language === "TH" ? "th-TH" : "en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
    return dateString;
  };

  // Helper: Duration
  const calculateDuration = (start, end) => {
    if (!start || !end) return "";
    const startDate = new Date(start);
    const endDate = new Date(end);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    if (endDate < startDate) return "";
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return `(รวมระยะเวลา ${diffDays} วัน)`;
  };

  // 🔄 Auto Generate Filename
  useEffect(() => {
    const safePos = form.position.trim().replace(/\s+/g, "_") || "Position";
    const fName = form.firstName.trim() || "Firstname";
    const lName = form.lastName.trim() || "Lastname";

    const generateName = (prefix) => {
      if (language === "TH") {
        return `${prefix}_${fName}_${lName}_${safePos}.pdf`;
      } else {
        return `${prefix}_${fName}__${lName}_${safePos}.pdf`;
      }
    };

    if (!isManualCV) setCvFileName(generateName("CV"));
  }, [
    form.firstName,
    form.lastName,
    form.position,
    language,
    isManualCV,
  ]);

  // 🔄 Auto Generate Body Text (String version)
  // สร้าง string เพื่อเก็บลง State รอไว้ตลอดเวลา (แก้ปัญหาข้อความหาย)
  // 🔄 Auto Generate Body Text
  useEffect(() => {
    // ถ้าอยู่ในโหมดแก้ไขด้วยมือแล้ว ไม่ต้องยุ่ง (ปล่อยให้ user พิมพ์เอง)
    if (isManualEdit) return;

    // ดึงค่าปัจจุบันจาก form
    const fullName = `${form.firstName} ${form.lastName}`;
    const durationText = calculateDuration(form.startDate, form.endDate);
    const startDateStr = formatDate(form.startDate) || "...";
    const endDateStr = formatDate(form.endDate) || "...";

    const extraDocs = [docType];

    if (attachedPdfs.length > 0)
      extraDocs.push(`เอกสารแนบเพิ่มเติม (${attachedPdfs.length} ไฟล์)`);
    if (attachedImages.length > 0)
      extraDocs.push(`รูปภาพประกอบ (${attachedImages.length} รูป)`);

    // สร้าง Template
    const template = `เรียน ฝ่ายทรัพยากรบุคคล ${form.company ? `บริษัท ${form.company}` : ""}

ผมนาย ${fullName} ขออนุญาตสมัครฝึกงานในตำแหน่ง "${form.position || "..."}"

เริ่มฝึกงาน ตั้งแต่ วันที่ ${startDateStr} - วันที่ ${endDateStr} ${durationText}

ผมได้แนบ ${extraDocs.join(", ")} (PDF) มาเพื่อพิจารณา
จึงเรียนมาเพื่อขอความกรุณาครับ

ขอบคุณครับ
${fullName}
${form.phone}`;

    // อัปเดตเฉพาะ customMessage โดยไม่กระทบ field อื่น
    setForm((prev) => {
      // เช็คก่อนว่าข้อความเปลี่ยนจริงไหม เพื่อลดการ re-render ซ้ำซ้อน
      if (prev.customMessage === template) return prev;
      return { ...prev, customMessage: template };
    });
  }, [
    // Dependency List ต้องครบถ้วนเพื่อให้มันทำงานทุกครั้งที่ค่าเหล่านี้เปลี่ยน
    form.firstName,
    form.lastName,
    form.position,
    form.company,
    form.startDate,
    form.endDate,
    form.phone,
    docType,
    isManualEdit,
    attachedImages,
    attachedPdfs,
    language, // เพิ่ม language เข้าไปเผื่ออนาคต
  ]);

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      // 1. รีเซ็ตความสูงเป็น auto ก่อนเพื่อให้ได้ค่า scrollHeight ที่แท้จริง (ป้องกันมันยืดค้าง)
      textareaRef.current.style.height = "auto";

      // 2. ตั้งค่าความสูงใหม่ตามเนื้อหา
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [form.customMessage, showForm, isManualEdit]); // dependency เดิมถูกต้องแล้ว

  // --- Handlers ---
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file: file,
      preview: URL.createObjectURL(file),
    }));
    setAttachedImages((prev) => [...prev, ...newImages]);
    e.target.value = null;
  };

  const handlePdfChange = (e) => {
    const files = Array.from(e.target.files);
    const newPdfs = files.map((file) => ({ file: file }));
    setAttachedPdfs((prev) => [...prev, ...newPdfs]);
    e.target.value = null;
  };

  const removeImage = (index) =>
    setAttachedImages((prev) => prev.filter((_, i) => i !== index));
  const removePdf = (index) =>
    setAttachedPdfs((prev) => prev.filter((_, i) => i !== index));

  const handleVerifyPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || "รหัสผ่านผิด");
      }

      setIsAdmin(true);
      setShowAuthModal(false);
      setShowForm(true);
      setPasswordInput("");
      showToast("🔓 ปลดล็อกเรียบร้อย");
    } catch (error) {
      showToast(`❌ ${error.message || "รหัสผ่านผิด"}`);
    }
  };

  const handleAdminClick = () =>
    isAdmin ? setShowForm(!showForm) : setShowAuthModal(true);

  const getActiveAttachments = () => {
    return [{ type: "CV", path: CV_PATH, fileName: cvFileName }];
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const sendEmail = async () => {
    if (!form.receiverEmail) {
      showToast("⚠️ กรุณาระบุอีเมลผู้รับ");
      return;
    }
    // ✨ 2. เพิ่มส่วนนี้: เช็คว่าวันที่ถูกเลือกหรือยัง ✨
    if (!form.startDate || !form.endDate) {
      showToast("⚠️ กรุณาระบุวันเริ่มงานและวันสิ้นสุดงานให้ครบถ้วน");
      return; // สั่งหยุดทำงานทันที ไม่ส่งข้อมูลต่อ
    }

    // (Optional) เช็คข้อมูลสำคัญอื่นๆ เพื่อความชัวร์
    if (!form.firstName || !form.lastName || !form.position || !form.company) {
      showToast("⚠️ กรุณากรอกข้อมูลส่วนตัวและชื่อบริษัทให้ครบ");
      return;
    }
    setLoading(true);

    try {
      const attachmentsPayload = getActiveAttachments().map((file) => ({
        type: "SERVER_FILE",
        path: file.path,
        fileName: file.fileName,
      }));

      const imagePromises = attachedImages.map(async (img) => {
        const base64 = await toBase64(img.file);
        return {
          type: "UPLOAD_FILE",
          fileName: img.file.name,
          content: base64,
        };
      });

      const pdfPromises = attachedPdfs.map(async (pdf) => {
        const base64 = await toBase64(pdf.file);
        return {
          type: "UPLOAD_FILE",
          fileName: pdf.file.name,
          content: base64,
        };
      });

      const uploadedFiles = await Promise.all([
        ...imagePromises,
        ...pdfPromises,
      ]);
      const finalAttachments = [...attachmentsPayload, ...uploadedFiles];

      const payload = {
        ...form,
        fullName: `${form.firstName} ${form.lastName}`,
        bodyText: form.customMessage,
        attachments: finalAttachments,
      };

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        setShowForm(false);
        setAttachedImages([]);
        setAttachedPdfs([]);
        showToast(`✅ ส่งอีเมลเรียบร้อย!`);
        setTimeout(() => setSuccess(false), 5000);
      } else {
        throw new Error(result.error || "Failed to send");
      }
    } catch (err) {
      console.error(err);
      showToast(`❌ ผิดพลาด: ${err.message}`);
    }
    setLoading(false);
  };

  const sanitizeFilePart = (value, fallback = "") => {
    const cleaned = (value || "")
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[\\/:*?"<>|]/g, "");
    return cleaned || fallback;
  };

  const getResumeExportFileName = (positionValue = exportPosition) => {
    const fName = sanitizeFilePart(form.firstName, "Name");
    const lName = sanitizeFilePart(form.lastName, "Surname");
    const position = sanitizeFilePart(positionValue, "");

    return position
      ? `${fName}_${lName}_${position}_CV.pdf`
      : `${fName}_${lName}_CV.pdf`;
  };

  const openExportNameModal = (action) => {
    setPendingExportAction(action);
    setShowExportNameModal(true);
  };

  const runPendingExportAction = async (positionValue = exportPosition) => {
    const fileName = getResumeExportFileName(positionValue);

    if (pendingExportAction === "download") {
      await handleDownload(fileName);
      return;
    }

    if (pendingExportAction === "share") {
      await handleShareFile(fileName);
    }
  };

  const handleDownload = async (fileName = getResumeExportFileName()) => {
    try {
      showToast(L("preparing"));

      // 1. ใช้ fetch ดึงไฟล์มาเป็น Blob (ข้อมูลดิบ) เพื่อหลบ IDM
      const response = await fetch(CV_PATH);
      const blob = await response.blob();

      // 2. สร้าง URL จำลองจากข้อมูลไฟล์นั้น
      const url = window.URL.createObjectURL(blob);

      // 3. สร้างชื่อไฟล์ใหม่ที่ต้องการ
      const cleanFileName = fileName;

      // 4. สร้างลิงก์หลอกๆ เพื่อกดดาวน์โหลด
      const link = document.createElement("a");
      link.href = url;
      link.download = cleanFileName; // ✨ ชื่อนี้จะมีผลแน่นอน 100%
      document.body.appendChild(link);

      link.click(); // สั่งกดโหลด

      // 5. เก็บกวาดข้อมูลใน Memory
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showToast(L("downloaded", cleanFileName));
    } catch (error) {
      console.error("Download failed:", error);
      showToast(L("downloadFailed"));
    }
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const getResumePublicUrl = () =>
    new URL(CV_PATH, window.location.origin).toString();

  const isMobilePlatform = () =>
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || "");

  const shareMessage = L("shareMessage");
  // แชร์ผ่าน Web Share API (สำหรับแอปอื่นๆ)
  const handleShareFile = async (fileName = getResumeExportFileName()) => {
    try {
      showToast(L("preparing"));
      const response = await fetch(CV_PATH);
      const blob = await response.blob();
      const file = new File([blob], fileName, { type: "application/pdf" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        // ✅ Mobile — แชร์ไฟล์ PDF ได้เลย
        await navigator.share({
          title: shareMessage,
          text: shareMessage,
          files: [file],
        });
        return;
      }

      if (navigator.share) {
        // ⚠️ fallback ทุกแพลตฟอร์ม — แชร์แค่ Link
        await navigator.share({
          title: shareMessage,
          text: shareMessage,
          url: getResumePublicUrl(),
        });
        showToast(L("sharedLink"));
      } else {
        // Fallback — Copy Link
        await navigator.clipboard.writeText(getResumePublicUrl());
        showToast(L("copied"));
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        showToast(L("shareFailed"));
      }
    }
  };
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3fbfa] font-sans text-slate-800">
      {/* Soft mint background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_0%,rgba(126,218,210,0.3),transparent_34%),radial-gradient(circle_at_100%_22%,rgba(174,235,226,0.32),transparent_36%),linear-gradient(145deg,#f8fdfc_0%,#e8f7f4_52%,#f4fbfa_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(71,163,153,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(71,163,153,0.07)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />
      <div className="pointer-events-none absolute -left-32 top-48 h-80 w-80 rounded-full bg-[#7edad2]/20 blur-[100px]" />
      <div className="pointer-events-none absolute -right-32 bottom-24 h-96 w-96 rounded-full bg-cyan-500/10 blur-[110px]" />

      {/* Navigation */}
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-4 py-5 md:px-8">
        <Link href="/">
          <motion.button
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur-md transition-colors hover:bg-white hover:text-[#4fa99f]"
          >
            <span>←</span> {L("back")}
          </motion.button>
        </Link>
        <LanguageToggle />

      </nav>

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-32 md:px-8">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col items-center text-center"
        >
          <div className="flex flex-col items-center">
            <div className="mb-3 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#4fa99f]">
              <span className="h-px w-10 bg-[#7edad2]" />
              {L("eyebrow")}
            </div>
            <motion.h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-800 sm:text-5xl md:text-6xl">
              {tx({ th: "", en: "My " })}
              <span className="bg-gradient-to-r from-[#4fa99f] via-[#7edad2] to-[#8acfc7] bg-clip-text text-transparent">
                {L("title")}
              </span>
              {tx({ th: " ของผม", en: "" })}
            </motion.h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 md:text-base">
              {L("lead")}
            </p>
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-full border border-[#bce9e3] bg-white/70 px-4 py-2 text-xs text-[#4fa99f] shadow-sm backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-[#7edad2] shadow-[0_0_10px_#7edad2]" />
            <span className="font-semibold uppercase tracking-wider">
              {L("available")}
            </span>
            <span className="hidden text-slate-400 sm:inline">·</span>
            <span className="hidden text-slate-500 sm:inline">
              {L("openTo")}
            </span>
          </div>
        </motion.section>

        {/* 📧 Email Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              layout
              initial={{ height: 0, opacity: 0, marginBottom: 0 }}
              animate={{ height: "auto", opacity: 1, marginBottom: 40 }}
              exit={{ height: 0, opacity: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                {/* ... (Header Form เหมือนเดิม) ... */}
                <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                    <FaPaperPlane className="text-[#7edad2]" />{" "}
                    กรอกข้อมูลเพื่อสร้างอีเมล
                  </h3>
                  <div className="flex gap-2">
                    <div className="bg-gray-200 p-1 rounded-full flex text-xs font-semibold">
                      <button
                        onClick={() => setLanguage("TH")}
                        className={`px-3 py-1 rounded-full ${language === "TH" ? "bg-white shadow-sm" : "text-gray-500"}`}
                      >
                        TH
                      </button>
                      <button
                        onClick={() => setLanguage("EN")}
                        className={`px-3 py-1 rounded-full ${language === "EN" ? "bg-white shadow-sm" : "text-gray-500"}`}
                      >
                        EN
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50">
                  {/* ... (Input Fields เหมือนเดิม) ... */}
                  <div className="md:col-span-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    1. ข้อมูลการสมัคร
                  </div>
                  <InputField
                    icon={FaUser}
                    label="ชื่อจริง (First Name)"
                    placeholder="ชื่อจริง"
                    value={form.firstName}
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value })
                    }
                    required
                  />
                  <InputField
                    icon={FaUser}
                    label="นามสกุล (Last Name)"
                    placeholder="นามสกุล"
                    value={form.lastName}
                    onChange={(e) =>
                      setForm({ ...form, lastName: e.target.value })
                    }
                    required
                  />
                  <InputField
                    icon={FaPhone}
                    label="เบอร์โทร"
                    placeholder="0xx-xxx-xxxx"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    required
                  />
                  <InputField
                    icon={FaBriefcase}
                    label="ตำแหน่งที่สมัคร (Subject)"
                    placeholder="เช่น Sale, Developer"
                    value={form.position}
                    onChange={(e) =>
                      setForm({ ...form, position: e.target.value })
                    }
                    required
                  />
                  <InputField
                    icon={FaBuilding}
                    label="ชื่อบริษัท"
                    placeholder="บริษัท..."
                    value={form.company}
                    onChange={(e) =>
                      setForm({ ...form, company: e.target.value })
                    }
                    className="md:col-span-2"
                    required
                  />

                  <InputField
                    type="date"
                    icon={FaCalendarAlt}
                    label="วันเริ่มงาน"
                    value={form.startDate}
                    onChange={(e) => {
                      const newStart = e.target.value;
                      if (form.endDate && newStart > form.endDate) {
                        setForm({ ...form, startDate: newStart, endDate: "" });
                      } else {
                        setForm({ ...form, startDate: newStart });
                      }
                    }}
                  />
                  <InputField
                    type="date"
                    icon={MdDateRange}
                    label="วันสิ้นสุดงาน"
                    value={form.endDate}
                    min={form.startDate}
                    disabled={!form.startDate}
                    onChange={(e) =>
                      setForm({ ...form, endDate: e.target.value })
                    }
                  />

                  <div className="md:col-span-2 text-sm font-semibold text-gray-400 uppercase tracking-wider mt-2">
                    2. ข้อมูลการส่ง
                  </div>
                  <InputField
                    icon={MdEmail}
                    label="อีเมลผู้รับ (HR)"
                    placeholder="hr@company.com"
                    value={form.receiverEmail}
                    onChange={(e) =>
                      setForm({ ...form, receiverEmail: e.target.value })
                    }
                    className="md:col-span-2"
                  />

                  <div className="md:col-span-2 bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                      <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                        <FaFileSignature /> แก้ไขชื่อไฟล์ PDF (อิสระ):
                      </label>
                      {(
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-400">
                            CV:
                          </span>
                          <input
                            value={cvFileName}
                            onChange={(e) => {
                              setCvFileName(e.target.value);
                              setIsManualCV(true);
                            }}
                            className="w-full pl-20 bg-white border border-gray-300 text-gray-700 text-sm px-3 py-2 rounded focus:outline-none focus:border-[#7edad2]"
                          />
                          {isManualCV && (
                            <button
                              onClick={() => {
                                setIsManualCV(false);
                              }}
                              className="absolute right-2 top-2.5 text-[10px] text-red-400 hover:text-red-600"
                            >
                              รีเซ็ต
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Extra PDF (Multiple) */}
                    <div className="bg-orange-50/50 p-4 rounded-lg border border-orange-100 border-dashed">
                      <label className="text-xs font-bold text-gray-500 flex items-center gap-2 mb-2">
                        <FaFileUpload className="text-orange-400" /> แนบไฟล์ PDF
                        เพิ่มเติม (Transcript, Portfolio):
                      </label>
                      <label className="flex flex-col items-center justify-center w-full h-16 border-2 border-orange-200 border-dashed rounded-lg cursor-pointer bg-white hover:bg-orange-50 transition-colors mb-3">
                        <div className="flex items-center gap-2">
                          <FaFilePdf className="text-orange-300" />
                          <span className="text-xs text-gray-600">
                            คลิกเพื่อเพิ่มไฟล์ PDF (ได้มากกว่า 1)
                          </span>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="application/pdf"
                          multiple
                          onChange={handlePdfChange}
                        />
                      </label>
                      <div className="space-y-2">
                        {attachedPdfs.map((pdf, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-white p-3 rounded border border-orange-200 shadow-sm animate-fadeIn"
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="bg-red-50 p-2 rounded">
                                <FaFilePdf className="text-red-500" />
                              </div>
                              <div className="truncate">
                                <p className="text-xs font-semibold text-gray-700 truncate">
                                  {pdf.file.name}
                                </p>
                                <p className="text-[10px] text-gray-400">
                                  {(pdf.file.size / 1024).toFixed(0)} KB
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => removePdf(index)}
                              className="text-gray-400 hover:text-red-500 p-2"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Image (Multiple) */}
                    <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 border-dashed">
                      <label className="text-xs font-bold text-gray-500 flex items-center gap-2 mb-2">
                        <FaImage className="text-blue-400" /> แนบรูปภาพเพิ่มเติม
                        (Optional):
                      </label>
                      <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-blue-200 border-dashed rounded-lg cursor-pointer bg-white hover:bg-blue-50 transition-colors mb-3">
                        <div className="flex flex-col items-center justify-center">
                          <p className="text-xs text-gray-500">
                            <span className="font-semibold">
                              คลิกเพื่ออัปโหลดรูป
                            </span>
                          </p>
                          <p className="text-[10px] text-gray-400">
                            เลือกได้หลายรูป
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                        />
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {attachedImages.map((img, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-white p-2 rounded border border-blue-200 shadow-sm"
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <img
                                src={img.preview}
                                alt="Preview"
                                className="w-10 h-10 object-cover rounded bg-gray-200 flex-shrink-0"
                              />
                              <div className="overflow-hidden">
                                <p className="text-[10px] font-semibold text-gray-700 truncate">
                                  {img.file.name}
                                </p>
                                <p className="text-[9px] text-gray-400">
                                  {(img.file.size / 1024).toFixed(0)} KB
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => removeImage(index)}
                              className="text-gray-400 hover:text-red-500 p-1"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- 💌 Live Preview Section (Click to Edit) --- */}
                <div className="border-t-4 border-[#7edad2] bg-white p-6 md:p-8">
                  <h3 className="text-gray-400 font-bold mb-4 uppercase text-xs tracking-widest text-center">
                    --- ตัวอย่างอีเมล (Highlight ช่องที่กรอก) ---
                  </h3>
                  <div className="shadow-2xl rounded-lg overflow-hidden border border-gray-200 font-sans max-w-3xl mx-auto">
                    {/* Subject */}
                    <div className="bg-[#f2f6fc] px-4 py-3 border-b border-gray-200 flex items-center gap-2">
                      <span className="text-gray-500 text-sm font-medium">
                        เรื่อง:
                      </span>
                      <span className="text-gray-900 font-semibold text-sm md:text-base flex items-center">
                        สมัครฝึกงานตำแหน่ง “
                        <Highlight label="ตำแหน่ง">{form.position}</Highlight>”
                      </span>
                    </div>
                    {/* Sender */}
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {form.firstName ? form.firstName.charAt(0) : <FaUser />}
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-gray-900 font-bold text-sm truncate flex items-center">
                          <Highlight label="ชื่อ">{form.firstName}</Highlight>
                          &nbsp;
                          <Highlight label="นามสกุล">{form.lastName}</Highlight>
                          <span className="text-gray-500 font-normal text-xs ml-2">
                            &lt;{form.emailSender}&gt;
                          </span>
                        </span>
                        <span className="text-gray-500 text-xs truncate">
                          ถึง{" "}
                          <Highlight label="อีเมล HR">
                            {form.receiverEmail}
                          </Highlight>
                        </span>
                      </div>
                    </div>

                    {/* Body Preview with Click-to-Edit Logic */}
                    {!isManualEdit ? (
                      // --- โหมดแสดงผล (Highlight) ---
                      <div
                        onClick={() => setIsManualEdit(true)}
                        className="px-6 py-6 min-h-[200px] text-gray-800 text-sm md:text-base leading-relaxed whitespace-pre-wrap cursor-text hover:bg-gray-50 transition-colors group relative border-2 border-transparent hover:border-gray-200 rounded-b-lg"
                      >
                        {/* Tooltip Hint */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-gray-500 bg-white border border-gray-200 px-2 py-1 rounded shadow-sm pointer-events-none flex items-center gap-1">
                          <FaPencilAlt size={10} /> คลิกเพื่อพิมพ์แก้ไข
                        </div>
                        เรียน ฝ่ายทรัพยากรบุคคล{" "}
                        {form.company && (
                          <span>
                            บริษัท{" "}
                            <Highlight label="บริษัท">{form.company}</Highlight>
                          </span>
                        )}
                        <br />
                        <br />
                        ผมนาย{" "}
                        <Highlight label="ชื่อ">{form.firstName}</Highlight>
                        &nbsp;
                        <Highlight label="นามสกุล">
                          {form.lastName}
                        </Highlight>{" "}
                        ขออนุญาตสมัครฝึกงานในตำแหน่ง “
                        <Highlight label="ตำแหน่ง">{form.position}</Highlight>”
                        <br />
                        <br />
                        เริ่มฝึกงาน ตั้งแต่ วันที่{" "}
                        <Highlight label="วันเริ่ม">
                          {formatDate(form.startDate)}
                        </Highlight>{" "}
                        - วันที่{" "}
                        <Highlight label="วันสิ้นสุด">
                          {formatDate(form.endDate)}
                        </Highlight>
                        {calculateDuration(form.startDate, form.endDate) && (
                          <span className="text-gray-500 text-sm ml-2">
                            {calculateDuration(form.startDate, form.endDate)}
                          </span>
                        )}
                        <br />
                        <br />
                        ผมได้แนบ
                        <b> {docType}</b>
                        {attachedPdfs.length > 0 && (
                          <span>
                            ,{" "}
                            <Highlight label="ไฟล์แนบ">
                              {attachedPdfs.length} เอกสารเพิ่มเติม
                            </Highlight>
                          </span>
                        )}
                        {attachedImages.length > 0 && (
                          <span>
                            ,{" "}
                            <Highlight label="รูปภาพ">
                              {attachedImages.length} รูปภาพ
                            </Highlight>
                          </span>
                        )}
                        &nbsp;(PDF) มาเพื่อพิจารณา
                        <br />
                        จึงเรียนมาเพื่อขอความกรุณาครับ
                        <br />
                        <br />
                        ขอบคุณครับ
                        <br />
                        {form.firstName} {form.lastName}
                        <br />
                        <Highlight label="เบอร์โทร">{form.phone}</Highlight>
                      </div>
                    ) : (
                      // --- โหมดแก้ไข (Textarea) ---
                      <div className="relative">
                        <textarea
                          ref={textareaRef}
                          value={form.customMessage}
                          onChange={(e) => {
                            // ✅ 1. บอกระบบว่า "ฉันขอแก้เองนะ หยุด Auto เดี๋ยวนี้"
                            setIsManualEdit(true);

                            // ✅ 2. อัปเดตข้อความตามที่พิมพ์
                            setForm({ ...form, customMessage: e.target.value });
                          }}
                          className="w-full min-h-[150px] p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7edad2] outline-none text-gray-700 resize-none"
                          placeholder="พิมพ์ข้อความที่ต้องการ..."
                        />

                        {/* ปุ่มรีเซ็ต: ให้กลับมาใช้ Auto Generate เหมือนเดิม */}
                        {isManualEdit && (
                          <button
                            onClick={() => {
                              setIsManualEdit(false); // ปลดล็อค กลับไปใช้ Auto
                              // ระบบจะ Auto Generate ข้อความใหม่ให้ทันทีเพราะ useEffect จะทำงานต่อ
                            }}
                            className="absolute top-2 right-2 text-xs bg-red-100 text-red-500 px-2 py-1 rounded hover:bg-red-200 transition-colors"
                          >
                            <FaTimes className="inline mr-1" /> รีเซ็ตเป็นแบบ
                            Auto
                          </button>
                        )}
                      </div>
                    )}

                    {/* Attachments Preview */}
                    <div className="px-6 pb-6 pt-2 flex gap-3 flex-wrap bg-gray-50/50">
                      {getActiveAttachments().map((file, index) => (
                        <div
                          key={`server-${index}`}
                          className="inline-block border border-gray-300 rounded-md overflow-hidden bg-white shadow-sm w-32 relative group"
                        >
                          <div className="h-16 bg-red-50 flex items-center justify-center text-red-500">
                            <FaFilePdf size={24} />
                          </div>
                          <div className="p-2 border-t border-gray-200">
                            <div className="text-[9px] font-bold text-red-600">
                              MAIN PDF
                            </div>
                            <div className="text-[9px] text-gray-700 truncate">
                              {file.fileName}
                            </div>
                          </div>
                        </div>
                      ))}
                      {attachedPdfs.map((pdf, index) => (
                        <div
                          key={`pdf-${index}`}
                          className="inline-block border border-orange-200 rounded-md overflow-hidden bg-white shadow-sm w-32 relative group"
                        >
                          <div className="h-16 bg-orange-50 flex items-center justify-center text-orange-500">
                            <FaFilePdf size={24} />
                          </div>
                          <div className="p-2 border-t border-orange-200">
                            <div className="text-[9px] font-bold text-orange-600">
                              EXTRA PDF
                            </div>
                            <div className="text-[9px] text-gray-700 truncate">
                              {pdf.file.name}
                            </div>
                          </div>
                          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => removePdf(index)}
                              className="bg-red-500 text-white rounded-full p-1"
                            >
                              <FaTimes size={8} />
                            </button>
                          </div>
                        </div>
                      ))}
                      {attachedImages.map((img, index) => (
                        <div
                          key={`img-${index}`}
                          className="inline-block border border-blue-200 rounded-md overflow-hidden bg-white shadow-sm w-32 relative group"
                        >
                          <div className="h-16 bg-blue-50 flex items-center justify-center text-blue-400 overflow-hidden">
                            <Zoom>
                              <img
                                src={img.preview}
                                className="w-full h-full object-cover cursor-zoom-in"
                                alt={img.file.name}
                              />
                            </Zoom>
                          </div>
                          <div className="p-2 border-t border-blue-200">
                            <div className="text-[9px] font-bold text-blue-600">
                              IMAGE
                            </div>
                            <div className="text-[9px] text-gray-700 truncate">
                              {img.file.name}
                            </div>
                          </div>
                          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => removeImage(index)}
                              className="bg-red-500 text-white rounded-full p-1"
                            >
                              <FaTimes size={8} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer Controls */}
                    <div className="bg-[#f9fafb] px-4 py-3 border-t border-gray-200 flex justify-between items-center gap-2">
                      <div className="text-xs text-gray-400 italic">
                        {isManualEdit
                          ? "* คุณอยู่ในโหมดแก้ไขข้อความ (Highlight ถูกซ่อน)"
                          : ""}
                      </div>
                      <div className="flex gap-2">
                        {/* ปุ่มรีเซ็ต: จะเคลียร์โหมด Manual ทิ้ง แล้วให้ Auto Gen ทำงานใหม่ */}
                        <button
                          onClick={() => {
                            setIsManualEdit(false);
                            setForm({ ...form });
                          }}
                          className="px-4 py-2 text-gray-600 text-sm hover:bg-gray-200 rounded border border-gray-300"
                        >
                          รีเซ็ตข้อความ
                        </button>
                        <button
                          onClick={() => setShowSendAlert(true)}
                          disabled={loading}
                          className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded shadow hover:bg-blue-700 transition flex items-center gap-2"
                        >
                          ส่ง <FaPaperPlane size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-white"
            >
              <div className="relative">
                <motion.div
                  animate={{
                    x: [0, 100, 200],
                    y: [0, -50, -100],
                    opacity: [1, 1, 0],
                    scale: [1, 0.8, 0.5],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-10 -left-10 text-6xl text-[#7edad2]"
                >
                  <FaPaperPlane />
                </motion.div>
                <div className="w-24 h-24 border-4 border-white/20 border-t-[#7edad2] rounded-full animate-spin"></div>
              </div>
              <h2 className="mt-8 text-2xl font-bold tracking-wider">
                กำลังส่งอีเมล...
              </h2>
              <p className="mt-2 text-gray-300 animate-pulse">
                กรุณารอสักครู่ อย่าเพิ่งปิดหน้านี้
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showAuthModal && (
            <motion.div
              className="fixed inset-0 bg-black/50 z-[90] flex items-center justify-center"
              onClick={() => setShowAuthModal(false)}
            >
              <div
                className="bg-white p-6 rounded-xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-bold mb-4">ใส่รหัสผ่าน Admin</h3>
                <form onSubmit={handleVerifyPassword}>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="border p-2 rounded w-full mb-4 text-center"
                    autoFocus
                    // ✨ เพิ่ม 2 บรรทัดนี้ครับ ✨
                    autoComplete="new-password" // หลอก Browser ว่าเป็นการตั้งรหัสใหม่ (มันจะไม่ Auto Fill)
                    name="admin_password_input_field" // ตั้งชื่อให้ไม่ซ้ำกับที่ Browser เคยจำ
                  />
                  <button className="bg-[#7edad2] w-full py-2 rounded text-white font-bold">
                    ยืนยัน
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {lightbox && (
            <motion.div
              className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
              onClick={() => setLightbox(false)}
            >
              {/* ใช้ canvas เดิม scale ขึ้น */}
              <img
                src={canvasRef.current?.toDataURL()}
                className="max-h-[90vh] rounded shadow-2xl"
              />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showExportNameModal && (
            <div className="fixed inset-0 bg-black/50 z-[90] flex items-center justify-center p-4">
              <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full text-center">
                <h3 className="text-xl font-bold mb-2">{L("nameTitle")}</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  {L("nameLead", pendingExportAction)}
                </p>

                <input
                  type="text"
                  value={exportPosition}
                  onChange={(e) => setExportPosition(e.target.value)}
                  placeholder={L("namePlaceholder")}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7edad2] focus:border-transparent outline-none text-sm text-gray-700"
                />

                <p className="text-xs text-gray-500 mt-2 mb-6 break-all">
                  {L("fileName")} {getResumeExportFileName()}
                </p>

                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={async () => {
                      setShowExportNameModal(false);
                      await runPendingExportAction(exportPosition);
                      setPendingExportAction(null);
                    }}
                    className="px-4 py-2 bg-[#7edad2] text-white font-bold rounded"
                  >
                    {L("ok")}
                  </button>
                  <button
                    onClick={async () => {
                      setShowExportNameModal(false);
                      await runPendingExportAction("");
                      setPendingExportAction(null);
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded border border-gray-300"
                  >
                    {L("skip")}
                  </button>
                  <button
                    onClick={() => {
                      setShowExportNameModal(false);
                      setPendingExportAction(null);
                    }}
                    className="px-4 py-2 bg-gray-200 rounded"
                  >
                    {L("cancel")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showSendAlert && (
            <div className="fixed inset-0 bg-black/50 z-[90] flex items-center justify-center p-4">
              <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full text-center">
                <h3 className="text-xl font-bold mb-2">ยืนยัน?</h3>
                <p className="text-gray-600 mb-6">
                  {`ส่งอีเมลหา ${form.receiverEmail}?`}
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => {
                      setShowSendAlert(false);
                    }}
                    className="px-4 py-2 bg-gray-200 rounded"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={() => {
                      sendEmail();
                      setShowSendAlert(false);
                    }}
                    className="px-4 py-2 bg-[#7edad2] text-white font-bold rounded"
                  >
                    ยืนยัน
                  </button>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg z-[100]"
            >
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>
        {success && windowSize.width > 0 && (
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={300}
          />
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 flex justify-center"
        >
          <div className="w-full max-w-6xl">
            <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-white/80 bg-white/45 px-4 py-3 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="text-center sm:text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#4fa99f]">
                  {L("preview")}
                </p>
                <h2 className="mt-0.5 text-lg font-bold text-slate-800 md:text-xl">
                  CV / Saranphat Treepian
                </h2>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-end">
                <div className="flex items-center gap-2 rounded-2xl border border-white/90 bg-white/75 p-1.5 shadow-lg shadow-[#398f87]/15 backdrop-blur-xl">
                  <motion.button
                    onClick={() => openExportNameModal("download")}
                    aria-label={L("download")}
                    title={L("download")}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:-translate-y-1 hover:border-[#7edad2] hover:text-[#4fa99f]"
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    <FaDownload />
                  </motion.button>
                  <motion.button
                    onClick={() => openExportNameModal("share")}
                    aria-label={L("share")}
                    title={L("share")}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#7edad2] to-[#4fa99f] text-white shadow-md shadow-[#7edad2]/30 transition-all hover:-translate-y-1 hover:brightness-105"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaShare />
                  </motion.button>
                  <motion.button
                    onClick={handleAdminClick}
                    aria-label={isAdmin ? (showForm ? "Close email form" : "Create application email") : "Admin only"}
                    title={isAdmin ? (showForm ? "ปิดฟอร์ม" : "สร้างอีเมลสมัครงาน") : "Admin Only"}
                    className={`flex h-9 w-9 items-center justify-center rounded-xl border text-sm shadow-sm transition-all hover:-translate-y-1 ${
                      isAdmin
                        ? showForm
                          ? "border-[#7edad2] bg-white text-[#4fa99f]"
                          : "border-transparent bg-[#183d4b] text-white"
                        : "border-slate-200 bg-white text-slate-400 hover:text-slate-600"
                    }`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isAdmin ? (showForm ? <FaTimes /> : <SiGmail className="text-lg" />) : <FaLock className="text-xs" />}
                  </motion.button>
                </div>
                <span className="text-xs text-slate-500">
                  {L("hint")}
                </span>
              </div>
            </div>
            <div
              className="group relative cursor-pointer overflow-hidden rounded-[1.5rem] border border-white/20 bg-white/90 p-2 shadow-2xl shadow-black/30 sm:p-3"
              onClick={() => setLightbox(true)}
            >
              <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/5">
                <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 opacity-0 shadow-sm backdrop-blur transition-all group-hover:opacity-100">
                  {L("zoom")}
                </span>
              </div>

              {/* Canvas แทนรูป — render จาก PDF อัตโนมัติ */}
              <canvas
                ref={canvasRef}
                className="h-auto w-full rounded-xl"
                style={{ display: pdfThumbReady ? "block" : "none" }}
              />

              {!pdfThumbReady && (
                <div className="flex h-64 w-full items-center justify-center text-gray-400 animate-pulse">
                  {L("loading")}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
