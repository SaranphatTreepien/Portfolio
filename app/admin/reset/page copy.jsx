"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ADMIN_PASSWORD = "1234"; // 🔒 รหัสผ่านสำหรับยืนยัน

export default function ResetPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null

  const handleReset = async () => {
    // 1. เช็ก password หน้าบ้านเบื้องต้น
    if (password !== ADMIN_PASSWORD) {
      alert("รหัสผ่านไม่ถูกต้อง! ไม่อนุญาตให้ลบข้อมูล");
      return;
    }

    // 2. ถามย้ำอีกครั้ง
    if (!confirm("⚠️ ยืนยันครั้งสุดท้าย ข้อมูลจะหายกู้คืนไม่ได้?")) return;

    setIsLoading(true);
    try {
      // ✅ แก้ไขตรงนี้: เรียกไปที่ /api/resetDBMongo ให้ตรงกับชื่อโฟลเดอร์
      const res = await fetch('/api/resetDBMongo', {
        method: 'DELETE', 
      });

      const data = await res.json();
      
      if (res.ok) {
        setStatus("success");
        // หน่วงเวลา 2 วินาที แล้วปิด Modal
        setTimeout(() => {
             setIsModalOpen(false);
             setStatus(null);
             setPassword("");
        }, 2000);
      } else {
        alert("เกิดข้อผิดพลาด: " + (data.error || "Unknown error"));
        setStatus("error");
      }
    } catch (error) {
      console.error(error);
      alert("เชื่อมต่อ API ไม่ได้ (ตรวจสอบชื่อไฟล์/โฟลเดอร์ API หรือยัง?)");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      
      <div className="text-center space-y-4 max-w-md">
        <h1 className="text-3xl font-bold text-gray-800">Admin Database Control</h1>
        <p className="text-gray-500">
          โซนอันตราย! การล้างข้อมูลจะไม่สามารถกู้คืนได้ กรุณาตรวจสอบให้แน่ใจก่อนดำเนินการ
        </p>

        {/* ปุ่มเปิด Modal */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-red-500/30 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          ล้างข้อมูลทั้งหมด (Reset DB)
        </button>
      </div>

      {/* --- MODAL (Toggle กลางจอ) --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            
            {/* Background Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl relative z-10 overflow-hidden"
            >
              {/* Header สีแดงด้านบน */}
              <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>

              {status === "success" ? (
                <div className="text-center py-6 text-green-600">
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="font-bold text-xl">ล้างข้อมูลสำเร็จ!</h3>
                  <p className="text-sm text-gray-500 mt-2">Database สะอาดหมดจดแล้ว</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">ยืนยันการล้างข้อมูล?</h2>
                        <p className="text-red-500 text-xs font-bold mt-1">⚠️ คำเตือน: กู้คืนไม่ได้</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                  </div>

                  <div className="space-y-4">
                    <p className="text-gray-600 text-sm">
                      กรุณากรอกรหัสผ่าน Admin เพื่อยืนยันว่าคุณต้องการลบข้อมูล <strong>ทุกอย่าง</strong> ใน Collection นี้
                    </p>

                    <input
                      type="password"
                      autoFocus
                      placeholder="Admin Password"
                      className="w-full border-2 border-gray-200 rounded-xl p-3 text-center text-lg focus:border-red-500 focus:ring-red-200 focus:outline-none transition-all"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition"
                      >
                        ยกเลิก
                      </button>
                      
                      <button
                        onClick={handleReset}
                        disabled={isLoading || !password}
                        className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 shadow-lg shadow-red-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                      >
                        {isLoading ? (
                            <>
                                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                                กำลังลบ...
                            </>
                        ) : (
                            "ยืนยันการลบ"
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}