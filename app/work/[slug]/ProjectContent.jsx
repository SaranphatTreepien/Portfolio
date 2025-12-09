"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// Easing function สำหรับความรู้สึกหรูหรา นุ่มนวล (เริ่มเร็ว จบช้า)
const luxuryEase = [0.22, 1, 0.36, 1];

export default function ProjectContent({ content }) {
  const [openIndex, setOpenIndex] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // ป้องกันการ scroll ของ body เมื่อเปิด modal
    if (openIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [openIndex]);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12 py-10">
        {content.map((item, index) => (
          <motion.div
            key={index}
            // ปรับ border และ shadow ให้ดูนุ่มนวลขึ้น
            className="bg-white/90 backdrop-blur-xl rounded-3xl border border-gray-100 p-4 cursor-pointer relative overflow-hidden group"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: luxuryEase }}
            whileHover={{
              y: -8, // ลอยขึ้น
              scale: 1.02, // ขยายนิดเดียวพอ
              boxShadow: "0 20px 40px -15px rgba(0,0,0,0.1)", // เงาที่นุ่มและลึก
              borderColor: "#7edad2",
            }}
            onClick={() => setOpenIndex(index)}
          >
            {/* รูปภาพใน Wrap */}
            <div className="relative w-full h-64 rounded-2xl overflow-hidden">
              <Image
                src={item.img}
                alt={`project-img-${index}`}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" // zoom ช้าๆ นุ่มๆ
              />
              {/* Overlay แบบ Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6">
                <span className="text-white font-medium text-lg px-4 py-2 bg-white/20 backdrop-blur-md rounded-full">
                  เปิดดูรายละเอียด
                </span>
              </div>
            </div>

            {/* เนื้อหาการ์ด */}
            <div className="pt-5 px-2">
               {/* สมมติว่ามี Title ถ้าไม่มีก็ลบได้ */}
               {item.title && <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>}
               
              <div className="w-16 h-1 mb-4 bg-gradient-to-r from-[#7edad2] to-[#a0e4de] rounded-full" />
              <p className="text-gray-600 text-base line-clamp-2 leading-relaxed font-light">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal Portal */}
      {mounted && createPortal(
        <AnimatePresence>
          {openIndex !== null && (
            <motion.div
              // Backdrop: เพิ่มการ animate blur
              className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-[9999] p-4 md:p-8"
              onClick={() => setOpenIndex(null)}
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <motion.div
                // Content Box
                className="bg-white/95 backdrop-blur-md rounded-[2rem] p-6 md:p-8 relative max-w-5xl w-full max-h-[90vh] overflow-auto shadow-2xl border border-white/50"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.98, opacity: 0, y: 10 }}
                // ใช้ luxuryEase แทน spring เพื่อความนุ่มนวล
                transition={{ duration: 0.5, ease: luxuryEase }}
                drag
                dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
                dragElastic={0.1} // ลดแรงหนืดตอนลากให้รู้สึกหนักแน่นขึ้น
              >
                {/* ปุ่มปิด อัปเกรดดีไซน์ */}
                <button
                  onClick={() => setOpenIndex(null)}
                  className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full w-10 h-10 flex items-center justify-center text-2xl z-50 focus:outline-none focus:ring-2 focus:ring-[#7edad2]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* รูปใหญ่ */}
                <div className="relative w-full mb-8 rounded-3xl overflow-hidden shadow-sm bg-gray-50">
                  <Image
                    src={content[openIndex].img}
                    alt="full-image"
                    width={content[openIndex].width || 1200}
                    height={content[openIndex].height || 800}
                    className="object-contain w-full h-auto"
                  />
                </div>

                {/* เนื้อหาเต็ม จัด Typography ให้อ่านง่าย */}
                <div className="px-2 md:px-4">
                    {/* เพิ่ม Title ใน Modal ถ้ามี */}
                    {content[openIndex].title && (
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                        {content[openIndex].title}
                      </h2>
                    )}
                  <p className="text-gray-700 text-lg whitespace-pre-wrap leading-8 font-light">
                    {content[openIndex].description}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}