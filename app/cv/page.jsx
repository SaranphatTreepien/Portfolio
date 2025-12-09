"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaDownload, FaTimes, FaFileAlt, FaArrowLeft, FaHome } from "react-icons/fa";

// --- 📂 ตั้งค่า Path ไฟล์ ---
const CV_PATH = "/assets/document/CV_Saranphat_Treepien.pdf";
const CV_IMAGE = "/assets/document/CV.png";
const DOWNLOAD_FILENAME = "CV_Saranphat_Treepien.pdf";

// --- ✨ Animation Variants (ตั้งค่าการขยับ) ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // ทยอยแสดงลูกทีละ 0.15 วิ
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 } // เด้งนุ่มๆ
  }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 300, damping: 25 } 
  },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
};

export default function CVPage() {
  const [lightbox, setLightbox] = useState(false);
  const [showDownloadAlert, setShowDownloadAlert] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = CV_PATH;
    link.download = DOWNLOAD_FILENAME;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`📄 กำลังดาวน์โหลด...`);
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  return (
    <div className="relative min-h-screen py-10 px-4 md:py-20 bg-[#eaeff2] overflow-hidden font-sans text-gray-800 selection:bg-[#7edad2] selection:text-white">
      
      {/* --- 🌊 Ambient Background (ขยับลอยไปมา) --- */}
      <motion.div 
        animate={{ x: [0, 50, 0], y: [0, 30, 0], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#7edad2]/20 rounded-full blur-[100px] -z-10 mix-blend-multiply pointer-events-none"
      />
      <motion.div 
        animate={{ x: [0, -40, 0], y: [0, -50, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#a0e4de]/20 rounded-full blur-[80px] -z-10 mix-blend-multiply pointer-events-none"
      />

      {/* --- 🧭 Navigation --- */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-5xl mx-auto flex justify-between items-center mb-10 z-20 relative"
      >
        <Link href="/resume">
          <motion.button
            whileHover={{ x: -4, backgroundColor: "rgba(255,255,255,0.8)" }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 text-gray-600 hover:text-[#5fb3a9] font-medium transition-all bg-white/60 backdrop-blur-md px-5 py-2.5 rounded-full shadow-sm border border-white/50"
          >
            <FaArrowLeft className="text-sm" /> <span>Resume</span>
          </motion.button>
        </Link>

        <Link href="/">
          <motion.button
            whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.8)" }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 text-gray-600 hover:text-[#5fb3a9] font-medium transition-all bg-white/60 backdrop-blur-md px-5 py-2.5 rounded-full shadow-sm border border-white/50"
          >
             <span>Home</span> <FaHome className="text-sm" />
          </motion.button>
        </Link>
      </motion.nav>

      {/* --- 📦 Main Content (Staggered) --- */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto relative z-10"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 tracking-tight mb-3 drop-shadow-sm">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7edad2] to-[#4aa39a]">CV</span>
          </h1>
          <p className="text-gray-500 text-lg font-light tracking-wide">
            Curriculum Vitae
          </p>
        </motion.div>

        {/* Action Button */}
        <motion.div variants={itemVariants} className="flex justify-center mb-14">
          <motion.button
            onClick={() => setShowDownloadAlert(true)}
            whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px rgba(126, 218, 210, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#7edad2] to-[#5fb3a9] text-white rounded-full shadow-xl shadow-[#7edad2]/20 font-bold text-lg tracking-wide transition-all"
          >
            <FaDownload className="group-hover:translate-y-1 transition-transform duration-300" /> 
            <span>CV PDF</span>
          </motion.button>
        </motion.div>

        {/* CV Image Preview (Interactive) */}
        <motion.div 
          variants={itemVariants}
          className="relative group cursor-zoom-in max-w-2xl mx-auto perspective-1000"
          onClick={() => setLightbox(true)}
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="relative bg-white p-3 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] overflow-hidden border border-white/60 transition-all duration-500 group-hover:shadow-[0_30px_60px_-15px_rgba(126,218,210,0.3)]">
             {/* Overlay Hint */}
             <div className="absolute inset-0 bg-black/0 group-hover:bg-[#7edad2]/10 transition-colors duration-500 z-10 flex items-center justify-center">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  whileHover={{ opacity: 1, scale: 1, y: 0 }}
                  className="bg-white/90 backdrop-blur-md text-gray-700 px-6 py-3 rounded-full shadow-lg text-sm font-semibold flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                   🔎 แตะเพื่อขยาย
                </motion.div>
             </div>
             
             {/* Image */}
             <img
               src={CV_IMAGE}
               alt="CV Preview"
               className="w-full h-auto rounded-lg object-cover"
               loading="lazy"
             />
          </div>
        </motion.div>
      </motion.div>

      {/* --- 🖼️ Lightbox Modal --- */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0f172a]/95 backdrop-blur-md flex items-center justify-center z-[999] p-4 cursor-zoom-out"
            onClick={() => setLightbox(false)}
          >
            <motion.div 
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative max-w-5xl w-full max-h-screen flex items-center justify-center"
              onClick={(e) => e.stopPropagation()} 
            >
              <img
                src={CV_IMAGE}
                alt="CV Fullscreen"
                className="max-w-full max-h-[90vh] w-auto h-auto rounded-lg shadow-2xl object-contain"
              />
              <motion.button 
                 whileHover={{ rotate: 90, scale: 1.1 }}
                 whileTap={{ scale: 0.9 }}
                 onClick={() => setLightbox(false)}
                 className="absolute -top-12 right-0 md:right-[-3rem] md:top-0 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition"
              >
                 <FaTimes size={24} />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- ⚠️ Download Alert Modal --- */}
      <AnimatePresence>
        {showDownloadAlert && (
          <motion.div
            className="fixed inset-0 bg-[#0f172a]/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDownloadAlert(false)}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center relative overflow-hidden border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 bg-[#7edad2]/10 rounded-full flex items-center justify-center mx-auto mb-5 text-[#7edad2]">
                  <FaDownload size={28} />
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">ยืนยันการดาวน์โหลด</h3>
              <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                คุณต้องการดาวน์โหลดไฟล์ CV <br/>
                <span className="font-semibold text-gray-700">{DOWNLOAD_FILENAME}</span> <br/>
                ใช่หรือไม่?
              </p>

              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ backgroundColor: "#f3f4f6" }}
                  whileTap={{ scale: 0.97 }}
                  className="px-4 py-3 bg-gray-100 text-gray-600 font-semibold rounded-xl transition"
                  onClick={() => setShowDownloadAlert(false)}
                >
                  ยกเลิก
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 4px 15px rgba(126,218,210,0.4)" }}
                  whileTap={{ scale: 0.97 }}
                  className="px-4 py-3 bg-gradient-to-r from-[#7edad2] to-[#6ccbc2] text-white font-semibold rounded-xl shadow-md transition"
                  onClick={() => {
                    handleDownload();
                    setShowDownloadAlert(false);
                  }}
                >
                  ยืนยัน
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- 🍞 Toast Notification --- */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900/90 backdrop-blur-md text-white pl-4 pr-6 py-3 rounded-full shadow-2xl z-[80] flex items-center gap-3 border border-gray-700/50"
          >
            <div className="bg-[#7edad2] p-1.5 rounded-full">
              <FaDownload size={10} className="text-white" />
            </div>
            <span className="font-medium text-sm">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}