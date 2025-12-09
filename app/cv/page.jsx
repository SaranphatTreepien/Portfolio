"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaDownload, FaTimes, FaFileAlt } from "react-icons/fa"; // ✅ เพิ่ม Icon

// --- 📂 ตั้งค่า Path ไฟล์ CV ---
const CV_PATH = "/assets/document/CV.pdf";
const CV_IMAGE = "/assets/document/CV.png";
const DOWNLOAD_FILENAME = "CV_Saranphat_Treepien.pdf"; 

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
    showToast(`📄 กำลังดาวน์โหลด: ${DOWNLOAD_FILENAME}`);
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

      {/* ✅ Navigation Section (เพิ่มปุ่ม Resume ทางขวา) */}
      <nav className="max-w-5xl mx-auto flex justify-between items-center mb-10">
        {/* ปุ่มกลับหน้าหลัก */}
        <Link href="/resume">
          <motion.button
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-gray-600 hover:text-[#7edad2] font-medium transition-colors bg-white/60 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-white/50"
          >
            <span>←</span> ไปที่หน้า Resume
          </motion.button>
        </Link>

        {/* ปุ่มไปหน้า Resume */}
        <Link href="/">
          <motion.button
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-gray-600 hover:text-[#7edad2] font-medium transition-colors bg-white/60 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-white/50"
          >
             <FaFileAlt className="text-sm" /> กลับหน้าหลัก 
          </motion.button>
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight mb-2"
          >
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7edad2] to-[#5fb3a9]">CV</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500"
          >
            Curriculum Vitae
          </motion.p>
        </div>

        {/* Action Button */}
        <div className="flex justify-center gap-6 mb-12">
          <motion.button
            onClick={() => setShowDownloadAlert(true)}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#7edad2] to-[#5fb3a9] text-white rounded-full shadow-lg shadow-[#7edad2]/30 hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold text-lg"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaDownload /> ดาวน์โหลด PDF
          </motion.button>
        </div>

        {/* CV Image Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative group cursor-pointer max-w-2xl mx-auto"
          onClick={() => setLightbox(true)}
        >
          <div className="relative bg-[#f8fafc] p-3 rounded-2xl shadow-2xl overflow-hidden border border-white/50">
             {/* Overlay Hint */}
             <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors z-10 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 bg-white/90 backdrop-blur text-gray-700 px-6 py-3 rounded-full shadow-lg text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2">
                   🔎 คลิกเพื่อดูภาพขยาย
                </span>
             </div>
             {/* Image */}
             <img
               src={CV_IMAGE}
               alt="CV Preview"
               className="w-full h-auto rounded-lg object-cover shadow-sm"
             />
          </div>
        </motion.div>
      </div>

      {/* --- Modals --- */}
      
      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 bg-[#0f172a]/90 backdrop-blur-sm flex items-center justify-center z-[999] p-4"
            onClick={() => setLightbox(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-full max-h-full"
            >
                <img
                src={CV_IMAGE}
                alt="CV Fullscreen"
                className="max-w-full max-h-[90vh] rounded-lg shadow-2xl select-none"
                onClick={(e) => e.stopPropagation()} 
                />
                 <button className="absolute -top-12 right-0 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition">
                    <FaTimes size={24} />
                 </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Download Alert */}
      <AnimatePresence>
        {showDownloadAlert && (
          <motion.div
            className="fixed inset-0 bg-[#0f172a]/80 backdrop-blur-sm flex items-center justify-center z-[70] p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDownloadAlert(false)}
          >
            <motion.div
              className="bg-[#f8fafc] rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center relative overflow-hidden border border-white/20"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 bg-[#7edad2]/20 rounded-full flex items-center justify-center mx-auto mb-4 text-[#7edad2]">
                  <FaDownload size={24} />
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">ดาวน์โหลด CV?</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                คุณต้องการดาวน์โหลดไฟล์ <br/>
                <span className="font-semibold text-gray-900">{DOWNLOAD_FILENAME}</span> <br/>
                ใช่หรือไม่?
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  className="px-4 py-3 bg-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-300 transition"
                  onClick={() => setShowDownloadAlert(false)}
                >
                  ยกเลิก
                </button>
                <button
                  className="px-4 py-3 bg-gradient-to-r from-[#7edad2] to-[#6ccbc2] text-white font-medium rounded-xl hover:shadow-lg transition transform hover:-translate-y-0.5"
                  onClick={() => {
                    handleDownload();
                    setShowDownloadAlert(false);
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
    </div>
  );
}