"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SiGmail } from "react-icons/si";
import { FaDownload, FaUser, FaBriefcase, FaBuilding, FaPhone, FaPaperPlane, FaTimes, FaLock, FaCalendarAlt, FaFilePdf, FaFileSignature, FaImage, FaTrash } from "react-icons/fa";
import { MdEmail, MdDateRange } from "react-icons/md";
import Confetti from "react-confetti";

// --- ⚙️ ตั้งรหัสผ่าน Admin ---
const ADMIN_PASSWORD = "1234"; 

// --- 📂 ตั้งค่า Path ไฟล์ PDF (ใน folder public) ---
const RESUME_PATH = "/assets/document/resume.pdf"; 
const CV_PATH = "/assets/document/CV.pdf";

// Component Input Helper
const InputField = ({ icon: Icon, className, label, ...props }) => (
  <div className={`relative group ${className || ""}`}>
    {label && <label className="text-xs font-semibold text-gray-500 mb-1 block ml-1">{label}</label>}
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

export default function ResumePage() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  
  // State Modal
  const [showDownloadAlert, setShowDownloadAlert] = useState(false);
  const [showSendAlert, setShowSendAlert] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // State Admin
  const [isAdmin, setIsAdmin] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const [language, setLanguage] = useState("TH"); 
  const [docType, setDocType] = useState("RESUME"); 
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // 📝 Form State
  const [form, setForm] = useState({
    firstName: "ศรัณย์ภัทร",
    lastName: "ตรีเพียร",
    emailSender: "saranphat.tre289@gmail.com", 
    position: "", 
    company: "", 
    receiverEmail: "", 
    phone: "0614461930",
    startDate: "", 
    endDate: "", 
    customMessage: "",
  });

  // 🆕 State จัดการชื่อไฟล์
  const [resumeFileName, setResumeFileName] = useState("");
  const [cvFileName, setCvFileName] = useState("");
  const [isManualResume, setIsManualResume] = useState(false);
  const [isManualCV, setIsManualCV] = useState(false);

  // 🆕 State รูปภาพ
  const [attachedImage, setAttachedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [isManualEdit, setIsManualEdit] = useState(false); 
  const textareaRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "...";
    const parts = dateString.split('-'); 
    if (parts.length === 3) {
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1; 
        const day = parseInt(parts[2]);
        const date = new Date(year, month, day);
        return date.toLocaleDateString(language === "TH" ? 'th-TH' : 'en-GB', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    }
    return dateString;
  };

  // 🔄 Auto Generate Filename
  useEffect(() => {
    const safePos = form.position.trim().replace(/\s+/g, '_') || "Position";
    const fName = form.firstName.trim() || "Firstname";
    const lName = form.lastName.trim() || "Lastname";

    const generateName = (prefix) => {
        if (language === "TH") {
            return `${prefix}_${fName}_${lName}_${safePos}.pdf`;
        } else {
            return `${prefix}_${fName}__${lName}_${safePos}.pdf`;
        }
    };

    if (!isManualResume) setResumeFileName(generateName("Resume"));
    if (!isManualCV) setCvFileName(generateName("CV"));

  }, [form.firstName, form.lastName, form.position, language, isManualResume, isManualCV]);

  // 🔄 Auto Generate Body Text
  useEffect(() => {
    if (!isManualEdit) {
        const fullName = `${form.firstName} ${form.lastName}`;
        const template = `เรียน ฝ่ายทรัพยากรบุคคล ${form.company ? `บริษัท ${form.company}` : ""}

ผมนาย ${fullName} ขออนุญาตสมัครฝึกงานในตำแหน่ง "${form.position || "..."}"

เริ่มฝึกงาน ตั้งแต่ วันที่ ${formatDate(form.startDate)} - วันที่ ${formatDate(form.endDate)}

ผมได้แนบ ${docType === 'BOTH' ? 'Resume และ CV' : docType} (PDF)${attachedImage ? ' และรูปภาพเพิ่มเติม' : ''} มาเพื่อพิจารณา
จึงเรียนมาเพื่อขอความกรุณาครับ

ขอบคุณครับ
${fullName}
${form.phone}`;

        setForm(prev => ({ ...prev, customMessage: template }));
    }
  }, [form.firstName, form.lastName, form.position, form.company, form.startDate, form.endDate, form.phone, docType, isManualEdit, attachedImage]);

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [form.customMessage, showForm]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setAttachedImage(null);
    setImagePreview(null);
  };

  const handleVerifyPassword = (e) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
        setIsAdmin(true);
        setShowAuthModal(false);
        setShowForm(true);
        setPasswordInput(""); 
        showToast("🔓 ปลดล็อกระบบ Admin เรียบร้อย");
    } else {
        showToast("❌ รหัสผ่านไม่ถูกต้อง");
    }
  };

  const handleAdminClick = () => {
    if (isAdmin) {
        setShowForm(!showForm);
    } else {
        setShowAuthModal(true);
    }
  };

  const getActiveAttachments = () => {
    const files = [];
    if (docType === "RESUME" || docType === "BOTH") {
        files.push({ type: "Resume", path: RESUME_PATH, fileName: resumeFileName });
    }
    if (docType === "CV" || docType === "BOTH") {
        files.push({ type: "CV", path: CV_PATH, fileName: cvFileName });
    }
    return files;
  };

  // Helper แปลงไฟล์เป็น Base64
  const toBase64 = (file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
  });

  // 🚀 Send Email Logic (เชื่อมต่อ API)
  const sendEmail = async () => {
    if (!form.receiverEmail) {
      showToast("⚠️ กรุณาระบุอีเมลผู้รับ");
      return;
    }
    setLoading(true);

    try {
        // 1. เตรียม Attachments (PDFs)
        const attachmentsPayload = getActiveAttachments().map(file => ({
            type: "PDF",
            path: file.path,      // Path บน Server
            fileName: file.fileName // ชื่อไฟล์ที่แก้แล้ว
        }));

        // 2. ถ้ามีรูปภาพ แปลงเป็น Base64
        if (attachedImage) {
            const base64Image = await toBase64(attachedImage);
            attachmentsPayload.push({
                type: "Image",
                fileName: attachedImage.name,
                content: base64Image
            });
        }

        const payload = {
            ...form,
            fullName: `${form.firstName} ${form.lastName}`,
            bodyText: form.customMessage,
            attachments: attachmentsPayload
        };

        // 3. เรียก API Backend
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.success) {
            showToast(`📧 ส่งอีเมลสำเร็จ!`);
            setSuccess(true);
            setShowForm(false);
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

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = RESUME_PATH;  
    link.download = resumeFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`📄 กำลังโหลด: ${resumeFileName}`);
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  return (
    <div className="relative min-h-screen py-10 px-4 md:py-20 bg-[#eaeff2] overflow-hidden font-sans text-gray-800">
      
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#7edad2]/15 rounded-full blur-[80px] -z-10 mix-blend-multiply animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#a0e4de]/15 rounded-full blur-[60px] -z-10 mix-blend-multiply" />

      {/* Navigation */}
      <nav className="max-w-5xl mx-auto flex justify-between items-center mb-10">
        <Link href="/">
          <motion.button
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 text-gray-600 hover:text-[#7edad2] font-medium transition-colors bg-white/60 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-white/50"
          >
            <span>←</span> กลับหน้าหลัก
          </motion.button>
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight mb-2">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7edad2] to-[#5fb3a9]">Profile</span>
          </motion.h1>
          <p className="text-gray-500">พร้อมสำหรับโอกาสใหม่ๆ เสมอ</p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-6 mb-12">
          <motion.button
            onClick={handleAdminClick}
            className={`flex items-center gap-3 px-6 py-3 rounded-full shadow-lg transition-all border ${
              isAdmin
                ? showForm
                    ? "bg-[#f8fafc] text-[#7edad2] border-[#7edad2]" 
                    : "bg-gradient-to-r from-[#7edad2] to-[#6ccbc2] text-white border-transparent" 
                : "bg-gray-200 text-gray-500 border-transparent hover:bg-gray-300" 
            }`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {isAdmin ? (
               showForm ? <><FaTimes /> ปิดฟอร์ม</> : <><SiGmail className="text-xl" /> สร้างอีเมลสมัครงาน</>
            ) : (
               <><FaLock /> Admin Only</>
            )}
          </motion.button>

          <motion.button
            onClick={() => setShowDownloadAlert(true)}
            className="flex items-center gap-3 px-6 py-3 bg-[#f8fafc] text-gray-700 rounded-full shadow-md border border-gray-200 hover:bg-white transition-all"
            whileHover={{ scale: 1.05, y: -2 }}
          >
            <FaDownload /> ดาวน์โหลด PDF
          </motion.button>
        </div>

        {/* 📧 Email Form & Live Preview Section */}
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
                
                {/* Form Header */}
                <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                        <FaPaperPlane className="text-[#7edad2]" /> กรอกข้อมูลเพื่อสร้างอีเมล
                    </h3>
                    <div className="flex gap-2">
                        <div className="bg-gray-200 p-1 rounded-full flex text-xs font-semibold">
                            <button onClick={() => setLanguage("TH")} className={`px-3 py-1 rounded-full ${language === "TH" ? "bg-white shadow-sm" : "text-gray-500"}`}>TH</button>
                            <button onClick={() => setLanguage("EN")} className={`px-3 py-1 rounded-full ${language === "EN" ? "bg-white shadow-sm" : "text-gray-500"}`}>EN</button>
                        </div>
                    </div>
                </div>

                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50">
                   {/* --- ส่วน Input ข้อมูล --- */}
                   <div className="md:col-span-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">1. ข้อมูลการสมัคร</div>
                   
                   <InputField icon={FaUser} label="ชื่อจริง (First Name)" placeholder="ชื่อจริง" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
                   <InputField icon={FaUser} label="นามสกุล (Last Name)" placeholder="นามสกุล" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />

                   <InputField icon={FaPhone} label="เบอร์โทร" placeholder="0xx-xxx-xxxx" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                   <InputField icon={FaBriefcase} label="ตำแหน่งที่สมัคร (Subject)" placeholder="เช่น Sale, Developer" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} required />
                   <InputField icon={FaBuilding} label="ชื่อบริษัท" placeholder="บริษัท..." value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="md:col-span-2" required />
                   
                   <InputField type="date" icon={FaCalendarAlt} label="วันเริ่มงาน" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                   <InputField type="date" icon={MdDateRange} label="วันสิ้นสุดงาน" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />

                   {/* Email Info */}
                   <div className="md:col-span-2 text-sm font-semibold text-gray-400 uppercase tracking-wider mt-2">2. ข้อมูลการส่ง</div>
                   <InputField icon={MdEmail} label="อีเมลผู้รับ (HR)" placeholder="hr@company.com" value={form.receiverEmail} onChange={(e) => setForm({ ...form, receiverEmail: e.target.value })} className="md:col-span-2" />

                   {/* Attachment Select */}
                   <div className="md:col-span-2 bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
                      {/* Radio Selection */}
                      <div>
                        <span className="text-sm font-semibold text-gray-500 mb-2 block">เลือกประเภทไฟล์:</span>
                        <div className="flex gap-4">
                            {["RESUME", "CV", "BOTH"].map((type) => (
                                <label key={type} className="flex items-center gap-2 cursor-pointer select-none">
                                    <input 
                                        type="radio" 
                                        name="docType" 
                                        checked={docType === type} 
                                        onChange={() => setDocType(type)} 
                                        className="text-[#7edad2] focus:ring-[#7edad2] w-4 h-4"
                                    />
                                    <span className="text-sm text-gray-700 font-medium">{type}</span>
                                </label>
                            ))}
                        </div>
                      </div>

                      {/* 🆕 Filename Editable Input (แยกกัน) */}
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                          <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                                <FaFileSignature /> แก้ไขชื่อไฟล์ PDF (อิสระ):
                          </label>

                          {/* ช่องแก้ชื่อ Resume */}
                          {(docType === "RESUME" || docType === "BOTH") && (
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-400">RESUME:</span>
                                <input 
                                    value={resumeFileName}
                                    onChange={(e) => { setResumeFileName(e.target.value); setIsManualResume(true); }}
                                    className="w-full pl-20 bg-white border border-gray-300 text-gray-700 text-sm px-3 py-2 rounded focus:outline-none focus:border-[#7edad2]"
                                />
                                {isManualResume && <button onClick={() => { setIsManualResume(false); }} className="absolute right-2 top-2.5 text-[10px] text-red-400 hover:text-red-600">รีเซ็ต</button>}
                            </div>
                          )}

                          {/* ช่องแก้ชื่อ CV */}
                          {(docType === "CV" || docType === "BOTH") && (
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-400">CV:</span>
                                <input 
                                    value={cvFileName}
                                    onChange={(e) => { setCvFileName(e.target.value); setIsManualCV(true); }}
                                    className="w-full pl-20 bg-white border border-gray-300 text-gray-700 text-sm px-3 py-2 rounded focus:outline-none focus:border-[#7edad2]"
                                />
                                {isManualCV && <button onClick={() => { setIsManualCV(false); }} className="absolute right-2 top-2.5 text-[10px] text-red-400 hover:text-red-600">รีเซ็ต</button>}
                            </div>
                          )}
                          <p className="text-[10px] text-gray-400 mt-1 italic">* นามสกุล .pdf จำเป็นต้องมี</p>
                      </div>

                      {/* 🆕 Image Attachment */}
                      <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 border-dashed">
                          <label className="text-xs font-bold text-gray-500 flex items-center gap-2 mb-2">
                             <FaImage className="text-blue-400"/> แนบรูปภาพเพิ่มเติม (Optional):
                          </label>
                          
                          {!attachedImage ? (
                              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <p className="text-xs text-gray-500"><span className="font-semibold">คลิกเพื่ออัปโหลด</span></p>
                                    <p className="text-[10px] text-gray-400">PNG, JPG (MAX. 5MB)</p>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                              </label>
                          ) : (
                              <div className="flex items-center justify-between bg-white p-2 rounded border border-gray-200 shadow-sm">
                                  <div className="flex items-center gap-3">
                                      {imagePreview && (
                                          <img src={imagePreview} alt="Preview" className="w-10 h-10 object-cover rounded bg-gray-200" />
                                      )}
                                      <div className="overflow-hidden">
                                          <p className="text-xs font-semibold text-gray-700 truncate w-40">{attachedImage.name}</p>
                                          <p className="text-[10px] text-gray-400">{(attachedImage.size / 1024).toFixed(0)} KB</p>
                                      </div>
                                  </div>
                                  <button onClick={removeImage} className="text-gray-400 hover:text-red-500 p-2 transition-colors">
                                      <FaTrash size={14}/>
                                  </button>
                              </div>
                          )}
                      </div>
                   </div>
                </div>

                {/* --- 💌 Live Preview Section --- */}
                <div className="border-t-4 border-[#7edad2] bg-white p-6 md:p-8">
                    <h3 className="text-gray-400 font-bold mb-4 uppercase text-xs tracking-widest text-center">--- ตัวอย่างอีเมล (แก้ไขข้อความด้านล่างได้) ---</h3>
                    
                    <div className="shadow-2xl rounded-lg overflow-hidden border border-gray-200 font-sans max-w-3xl mx-auto">
                        <div className="bg-[#f2f6fc] px-4 py-3 border-b border-gray-200 flex items-center gap-2">
                            <span className="text-gray-500 text-sm font-medium">เรื่อง:</span>
                            <span className="text-gray-900 font-semibold text-sm md:text-base">
                                สมัครฝึกงานตำแหน่ง “{form.position || '...'}”
                            </span>
                        </div>
                        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                {form.firstName ? form.firstName.charAt(0) : <FaUser />}
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-gray-900 font-bold text-sm truncate">
                                    {form.firstName} {form.lastName}
                                    <span className="text-gray-500 font-normal text-xs ml-2 hidden sm:inline">&lt;{form.emailSender}&gt;</span>
                                </span>
                                <span className="text-gray-500 text-xs truncate">ถึง {form.receiverEmail || '...'}</span>
                            </div>
                        </div>
                        <div className="px-6 py-6 min-h-[200px] relative group cursor-text">
                           <textarea
                                ref={textareaRef}
                                value={form.customMessage}
                                onChange={(e) => {
                                    setForm({...form, customMessage: e.target.value});
                                    setIsManualEdit(true); 
                                }}
                                className="w-full bg-transparent resize-none outline-none text-gray-800 text-sm md:text-base leading-relaxed whitespace-pre-wrap"
                                spellCheck="false"
                                placeholder="พิมพ์เนื้อหาอีเมลที่นี่..."
                           />
                        </div>

                        {/* Attachments Preview */}
                        <div className="px-6 pb-6 pt-2 flex gap-3 flex-wrap">
                            {getActiveAttachments().map((file, index) => (
                                <div key={index} className="inline-block border border-gray-300 rounded-md overflow-hidden hover:bg-gray-50 transition cursor-pointer group w-48 bg-white shadow-sm relative">
                                    <a href={file.path} target="_blank" rel="noreferrer" className="block">
                                        <div className="h-24 bg-red-50 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform duration-300">
                                            <FaFilePdf size={40} />
                                        </div>
                                        <div className="p-2 bg-white border-t border-gray-200">
                                            <div className="text-xs font-bold text-red-600 truncate">{file.type.toUpperCase()}</div>
                                            <div className="text-xs text-gray-700 truncate font-medium">
                                                {file.fileName}
                                            </div>
                                            <div className="text-[10px] text-gray-400 mt-1">PDF Document</div>
                                        </div>
                                    </a>
                                </div>
                            ))}

                            {attachedImage && (
                                <div className="inline-block border border-blue-200 rounded-md overflow-hidden hover:bg-blue-50 transition cursor-pointer group w-48 bg-white shadow-sm relative">
                                    <div className="h-24 bg-blue-50 flex items-center justify-center text-blue-400 overflow-hidden">
                                        {imagePreview ? (
                                            <img src={imagePreview} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform" />
                                        ) : (
                                            <FaImage size={40} />
                                        )}
                                    </div>
                                    <div className="p-2 bg-white border-t border-gray-200">
                                        <div className="text-xs font-bold text-blue-600 truncate">IMAGE</div>
                                        <div className="text-xs text-gray-700 truncate font-medium">{attachedImage.name}</div>
                                        <div className="text-[10px] text-gray-400 mt-1">Attached File</div>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="bg-[#f9fafb] px-4 py-3 border-t border-gray-200 flex justify-between items-center gap-2">
                             <div className="text-xs text-gray-400 italic">
                                {isManualEdit ? "* คุณแก้ไขข้อความเองแล้ว" : ""}
                             </div>
                             <div className="flex gap-2">
                                <button 
                                    onClick={() => { setIsManualEdit(false); setForm({...form}); }} 
                                    className="px-4 py-2 text-gray-600 text-sm hover:bg-gray-200 rounded"
                                >
                                    รีเซ็ตข้อความ
                                </button>
                                <button 
                                    onClick={() => setShowSendAlert(true)}
                                    disabled={loading}
                                    className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded shadow hover:bg-blue-700 transition flex items-center gap-2"
                                >
                                    ส่ง <FaPaperPlane size={12}/>
                                </button>
                             </div>
                        </div>
                    </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* ... (Modals ส่วนเดิม) ... */}
        <AnimatePresence>
            {showAuthModal && (
                <motion.div className="fixed inset-0 bg-black/50 z-[90] flex items-center justify-center" onClick={() => setShowAuthModal(false)}>
                    <div className="bg-white p-6 rounded-xl shadow-2xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold mb-4">ใส่รหัสผ่าน Admin</h3>
                        <form onSubmit={handleVerifyPassword}>
                            <input type="password" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} className="border p-2 rounded w-full mb-4 text-center" autoFocus placeholder="1234"/>
                            <button className="bg-[#7edad2] w-full py-2 rounded text-white font-bold">ยืนยัน</button>
                        </form>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
        <AnimatePresence>
            {lightbox && (
            <motion.div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4" onClick={() => setLightbox(false)}>
                <img src="/assets/document/resume.png" className="max-h-[90vh] rounded shadow-2xl" />
            </motion.div>
            )}
        </AnimatePresence>
        <AnimatePresence>
            {(showDownloadAlert || showSendAlert) && (
            <div className="fixed inset-0 bg-black/50 z-[90] flex items-center justify-center p-4">
                <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full text-center">
                    <h3 className="text-xl font-bold mb-2">ยืนยัน?</h3>
                    <p className="text-gray-600 mb-6">
                        {showDownloadAlert ? `โหลดไฟล์ ${resumeFileName}?` : `ส่งอีเมลหา ${form.receiverEmail}?`}
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button onClick={() => { setShowDownloadAlert(false); setShowSendAlert(false); }} className="px-4 py-2 bg-gray-200 rounded">ยกเลิก</button>
                        <button 
                            onClick={() => {
                                if(showDownloadAlert) handleDownload();
                                if(showSendAlert) sendEmail();
                                setShowDownloadAlert(false);
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
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg z-[100]">
                {toastMessage}
            </motion.div>
            )}
        </AnimatePresence>
        {success && windowSize.width > 0 && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={300} />}
        
        {/* Resume Image Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative group cursor-pointer mt-10"
          onClick={() => setLightbox(true)}
        >
          <div className="relative bg-[#f8fafc] p-2 rounded-2xl shadow-xl overflow-hidden border border-white/50">
             <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors z-10 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-sm text-sm font-medium transition-all">
                    🔍 คลิกเพื่อขยาย
                </span>
             </div>
             <img src="/assets/document/resume.png" alt="Resume Preview" className="w-full h-auto rounded-lg object-cover" onError={(e) => e.target.style.display='none'}/>
          </div>
        </motion.div>
    </div>
    </div>
  );
}