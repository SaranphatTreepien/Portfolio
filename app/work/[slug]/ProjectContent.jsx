"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function ResumeCVPage({ content }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="min-h-screen py-10 px-6 bg-gradient-to-b from-[#f0f7f6] to-[#e6f1ef]">
      {/* Title */}
      <motion.h1
        className="text-4xl font-bold text-center text-gray-800 mb-8 drop-shadow-md"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        My Documents
      </motion.h1>

      {/* เส้นคั่นใต้ Title */}
      <motion.div
        className="w-28 h-1 bg-gradient-to-r from-[#7edad2] to-[#79d3cc] mx-auto mb-10 rounded-full"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* สองคอลัมน์: Resume | CV */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {content.slice(0, 2).map((item, index) => (
          <motion.div
            key={index}
            className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#d9f0ee] p-3 cursor-pointer relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
              borderColor: "#7edad2",
            }}
            onClick={() => setOpenIndex(index)}
          >
            {/* รูป — คลิกเพื่อเปิด modal */}
            <div className="relative w-full h-72 rounded-xl overflow-hidden group">
              <Image
                src={item.img}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105 group-hover:rotate-1"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  ดูเพิ่มเติม
                </span>
              </div>
            </div>

            {/* ชื่อเอกสาร */}
            <h2 className="mt-3 text-xl font-semibold text-gray-800">{item.title}</h2>

            {/* เนื้อหาแบบสั้น */}
            <p className="text-gray-700 text-base line-clamp-2 mt-2">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Modal แบบรูปใหญ่ + เนื้อหาเต็ม */}
      <AnimatePresence>
        {openIndex !== null && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-50 p-4"
            onClick={() => setOpenIndex(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 relative max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              drag
              dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
            >
              {/* ปุ่มปิดมุมบนขวา */}
              <button
                onClick={() => setOpenIndex(null)}
                className="absolute top-4 right-4 text-white bg-gradient-to-br from-[#7ed9c7] to-[#79d3cc] hover:from-[#79d3cc] hover:to-[#7ed9c7] rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold shadow-lg z-50"
              >
                ×
              </button>

              {/* รูปใหญ่ */}
              <div className="relative w-full mb-6 rounded-xl overflow-hidden">
                <Image
                  src={content[openIndex].img}
                  alt={content[openIndex].title}
                  width={content[openIndex].width || 800}
                  height={content[openIndex].height || 600}
                  className="object-contain w-full h-auto rounded-xl shadow-lg"
                />
              </div>

              {/* เนื้อหาเต็ม */}
              <p className="text-gray-700 text-base whitespace-pre-wrap leading-relaxed">
                {content[openIndex].description}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
