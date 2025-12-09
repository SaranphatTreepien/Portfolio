"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SiGmail } from "react-icons/si";
import { FaDownload, FaUser, FaBriefcase, FaBuilding, FaPhone, FaLink, FaPaperPlane, FaTimes } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { BiSolidDetail } from "react-icons/bi";
import Confetti from "react-confetti";

// 🚀 Performance Fix: แยก InputField ออกมาเพื่อลดการ Re-render
const InputField = ({ icon: Icon, className, ...props }) => (
  <div className={`relative group ${className || ""}`}>
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#7edad2] transition-colors">
      <Icon />
    </div>
    <input
      {...props}
      className="w-full pl-10 pr-4 py-3 bg-[#f8fafc] border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7edad2] focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400 text-gray-700 text-sm shadow-sm"
    />
  </div>
);

export default function ResumePage() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showDownloadAlert, setShowDownloadAlert] = useState(false);
  const [showSendAlert, setShowSendAlert] = useState(false);

  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const [form, setForm] = useState({
    fullName: "สมชาย ใจดี",
    position: "Frontend Developer",
    company: "บริษัทเทคโนโลยีไทย จำกัด",
    receiverName: "คุณอรพิน HR",
    receiverEmail: "maxnum752@gmail.com",
    skills: "React, Next.js, TailwindCSS",
    portfolio: "https://myportfolio.com",
    phone: "098-123-4567",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const sendEmail = async () => {
    if (!form.receiverEmail || !form.fullName) {
      showToast("⚠️ กรุณากรอกข้อมูลสำคัญให้ครบถ้วน");
      return;
    }
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // จำลองการโหลด

    try {
      const res = await fetch("/api/send-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        showToast("📧 ส่งอีเมลสมัครงานสำเร็จแล้ว!");
        setSuccess(true);
        setShowForm(false); 
        setTimeout(() => setSuccess(false), 5000);
      } else {
        // Fallback for demo
        showToast("📧 (Demo) ส่งข้อมูลเรียบร้อย!");
        setSuccess(true);
        setShowForm(false);
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err) {
      console.error(err);
      showToast("📧 (Demo) ส่งข้อมูลเรียบร้อย!");
      setSuccess(true);
      setShowForm(false);
      setTimeout(() => setSuccess(false), 5000);
    }
    setLoading(false);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/resume.pdf";
    link.download = "resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("📄 เริ่มดาวน์โหลดไฟล์ Resume...");
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
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
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight mb-2"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7edad2] to-[#5fb3a9]">Resume</span>
          </motion.h1>
          <motion.p 
            className="text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            พร้อมสำหรับโอกาสใหม่ๆ เสมอ
          </motion.p>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-6 mb-12">
          <motion.button
            onClick={() => setShowForm(!showForm)}
            className={`flex items-center gap-3 px-6 py-3 rounded-full shadow-lg transition-all border ${
              showForm 
              ? "bg-[#f8fafc] text-[#7edad2] border-[#7edad2]" 
              : "bg-gradient-to-r from-[#7edad2] to-[#6ccbc2] text-white border-transparent"
            }`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <SiGmail className="text-xl" />
            <span className="font-semibold">{showForm ? "ซ่อนฟอร์ม" : "ส่งอีเมลสมัครงาน"}</span>
          </motion.button>

          <motion.button
            onClick={() => setShowDownloadAlert(true)}
            className="flex items-center gap-3 px-6 py-3 bg-[#f8fafc] text-gray-700 rounded-full shadow-md border border-gray-200 hover:bg-white transition-all"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaDownload className="text-lg" />
            <span className="font-semibold">ดาวน์โหลด PDF</span>
          </motion.button>
        </div>

        {/* Email Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              layout
              initial={{ height: 0, opacity: 0, marginBottom: 0 }}
              animate={{ height: "auto", opacity: 1, marginBottom: 40 }}
              exit={{ height: 0, opacity: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-slate-50/95 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <FaPaperPlane className="text-[#7edad2]" /> แบบฟอร์มส่งอีเมล
                    </h3>
                    <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-red-500 transition"><FaTimes /></button>
                </div>
                
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setShowSendAlert(true);
                  }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-5"
                >
                  <div className="md:col-span-2 text-sm font-semibold text-gray-400 mt-2 uppercase tracking-wider">ข้อมูลของคุณ</div>
                  <InputField icon={FaUser} type="text" placeholder="ชื่อ–นามสกุลของคุณ" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
                  <InputField icon={FaPhone} type="text" placeholder="เบอร์โทรติดต่อ" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  <InputField icon={FaBriefcase} type="text" placeholder="ตำแหน่งที่สมัคร" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
                  <InputField icon={FaLink} type="text" placeholder="ลิงก์ Portfolio (ถ้ามี)" value={form.portfolio} onChange={(e) => setForm({ ...form, portfolio: e.target.value })} />

                  <div className="md:col-span-2 text-sm font-semibold text-gray-400 mt-4 uppercase tracking-wider">ข้อมูลผู้รับ (HR)</div>
                  <InputField icon={FaBuilding} type="text" placeholder="ชื่อบริษัท" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                  <InputField icon={FaUser} type="text" placeholder="ชื่อผู้รับ (HR/Recruiter)" value={form.receiverName} onChange={(e) => setForm({ ...form, receiverName: e.target.value })} />
                  <InputField icon={MdEmail} type="email" placeholder="อีเมลผู้รับ" value={form.receiverEmail} onChange={(e) => setForm({ ...form, receiverEmail: e.target.value })} required className="md:col-span-2" />
                  
                  <div className="md:col-span-2 relative group">
                      <div className="absolute top-3 left-3 pointer-events-none text-gray-400"><BiSolidDetail /></div>
                      <textarea 
                        placeholder="ทักษะหรือประสบการณ์เด่น (2–3 ข้อ)" 
                        className="w-full pl-10 pr-4 py-3 bg-[#f8fafc] border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7edad2] outline-none transition-all placeholder-gray-400 text-gray-700 text-sm h-24 resize-none shadow-sm"
                        value={form.skills} 
                        onChange={(e) => setForm({ ...form, skills: e.target.value })} 
                      />
                  </div>

                  <div className="md:col-span-2 mt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-4 rounded-xl font-bold text-white shadow-md transition-all duration-300 flex justify-center items-center gap-2 ${
                        loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-[#7edad2] to-[#5fb3a9] hover:shadow-lg hover:scale-[1.01]"
                      }`}
                    >
                      {loading ? "กำลังส่ง..." : <>ยืนยันการส่งอีเมล <FaPaperPlane /></>}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resume Preview - คืนค่ารูปภาพให้แล้ว */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative group cursor-pointer"
          onClick={() => setLightbox(true)}
        >
          <div className="relative bg-[#f8fafc] p-2 rounded-2xl shadow-xl overflow-hidden border border-white/50">
             <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors z-10 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 bg-white/90 backdrop-blur text-gray-700 px-4 py-2 rounded-full shadow-sm text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    คลิกเพื่อดูภาพขยาย
                </span>
             </div>
             {/* ✅ ใส่รูปภาพกลับคืนมา */}
             <img
               src="/resume.png"
               alt="Resume Preview"
               className="w-full h-auto rounded-lg object-cover"
             />
          </div>
        </motion.div>
      </div>

      {/* --- Modals --- */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 bg-[#0f172a]/90 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
            onClick={() => setLightbox(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
             {/* ✅ รูปภาพแบบขยายเต็มจอ */}
            <motion.img
              src="/resume.png"
              alt="Resume Fullscreen"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()} 
            />
            <button className="absolute top-5 right-5 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition">
                <FaTimes size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alert Modal */}
      <AnimatePresence>
        {(showDownloadAlert || showSendAlert) && (
          <motion.div
            className="fixed inset-0 bg-[#0f172a]/80 backdrop-blur-sm flex items-center justify-center z-[70] p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#f8fafc] rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center relative overflow-hidden border border-white/20"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
            >
              <div className="w-16 h-16 bg-[#7edad2]/20 rounded-full flex items-center justify-center mx-auto mb-4 text-[#7edad2]">
                  {showDownloadAlert ? <FaDownload size={24} /> : <FaPaperPlane size={24} />}
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">ยืนยันการทำรายการ</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {showDownloadAlert 
                    ? <>คุณต้องการดาวน์โหลดไฟล์ <span className="font-semibold text-gray-900">resume.pdf</span> ใช่หรือไม่?</>
                    : <>คุณต้องการส่ง Resume ไปที่ <span className="font-semibold text-gray-900 break-all">{form.receiverEmail}</span> ใช่หรือไม่?</>
                }
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  className="px-4 py-3 bg-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-300 transition"
                  onClick={() => { setShowDownloadAlert(false); setShowSendAlert(false); }}
                >
                  ยกเลิก
                </button>
                <button
                  className="px-4 py-3 bg-gradient-to-r from-[#7edad2] to-[#6ccbc2] text-white font-medium rounded-xl hover:shadow-lg transition transform hover:-translate-y-0.5"
                  onClick={() => {
                    if (showDownloadAlert) handleDownload();
                    if (showSendAlert) sendEmail();
                    setShowDownloadAlert(false);
                    setShowSendAlert(false);
                  }}
                >
                  ยืนยัน
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800/95 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-2xl z-[80] flex items-center gap-3 border border-gray-700"
          >
            <span className="w-2 h-2 rounded-full bg-[#7edad2]"></span>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confetti */}
      {success && windowSize.width > 0 && (
        <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={300} gravity={0.15} />
      )}
    </div>
  );
}