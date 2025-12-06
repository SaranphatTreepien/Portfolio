"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SiGmail } from "react-icons/si";
import { FaDownload } from "react-icons/fa";
import Confetti from "react-confetti"; // ต้องติดตั้ง react-confetti
import emailjs from "emailjs-com";

export default function ResumePage() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [lightbox, setLightbox] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSend = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus("");
        setSuccess(false);

        try {
            emailjs.init("2j9WROJO9dwKKgzQ8"); // ใส่ EmailJS User ID
            const templateParams = {
                to_email: email,           // อีเมลผู้รับ
                from_name: "Saranphat",    // ชื่อผู้ส่ง (อาจเอาจาก input หรือ fix ชื่อคุณ)
                resume_link: window.location.origin + "/resume.pdf", // ลิงก์ Resume
            };

            await emailjs.send("service_vwi57vh", "template_yy6buhf", templateParams);
            setStatus("✅ Email sent successfully!");
            setSuccess(true);
            setTimeout(() => setSuccess(false), 5000); // Confetti 5 วินาที
        } catch (err) {
            console.error(err);
            setStatus("❌ Failed to send email.");
        }

        setLoading(false);
    };

    return (
        <div className="relative min-h-screen py-20 px-4 overflow-hidden bg-gradient-to-b from-[#f0f7f6] to-[#e6f1ef]">

            {/* Floating circles */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#cde7e3] rounded-full opacity-25 blur-3xl -z-10 animate-spin-slow"></div>
            <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#bde1dc] rounded-full opacity-20 blur-2xl -z-10 animate-spin-slow-reverse"></div>

            {/* Back Button */}
            <Link href="/">
                <button className="fixed top-6 left-6 z-50 p-3 bg-[#7edad2] text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition backdrop-blur-md">
                    ←
                </button>
            </Link>

            {/* Title */}
            <motion.h1
                className="text-4xl font-bold text-center text-gray-800 drop-shadow-md"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                My Resume
            </motion.h1>

            <motion.div
                className="w-28 h-1 bg-gradient-to-r from-[#7edad2] to-[#79d3cc] mx-auto mt-3 mb-6 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5 }}
            />

            {/* Gmail + Download Buttons */}
            <div className="flex justify-center gap-4 mb-6">
                <motion.button
                    onClick={() => setShowForm(!showForm)}
                    className="text-white p-3 rounded-full shadow-md text-2xl flex items-center justify-center"
                    style={{ backgroundColor: "#7edad2" }}
                    whileHover={{ scale: 1.1 }}
                    title={showForm ? "Hide Email Form" : "Send via Gmail"}
                >
                    <SiGmail />
                </motion.button>

                <motion.a
                    href="/resume.pdf"
                    download
                    className="text-white bg-gray-700 p-3 rounded-full shadow-md text-2xl flex items-center justify-center"
                    whileHover={{ scale: 1.1, backgroundColor: "#4b5563" }}
                    title="Download Resume PDF"
                >
                    <FaDownload />
                </motion.a>
            </div>

            {/* Email Form */}
            {showForm && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-md mx-auto mb-8 p-4 bg-white rounded-xl shadow-lg border border-[#d9f0ee]"
                >
                    <form onSubmit={handleSend} className="flex flex-col gap-3">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter recipient email"
                            className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7edad2]"
                            required
                        />
                        <button
                            type="submit"
                            className={`w-full text-white p-2 rounded-lg shadow-md transition-all duration-300 ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#7edad2] hover:bg-[#79d3cc]"
                                }`}
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Send Email"}
                        </button>
                        {status && <p className="mt-2 text-gray-700 text-sm">{status}</p>}
                    </form>
                </motion.div>
            )}

            {/* Resume Image */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex justify-center"
            >
                <motion.div
                    className="inline-block bg-white p-2 rounded-xl shadow-lg hover:shadow-2xl transition-transform duration-300 hover:-translate-y-1 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setLightbox(true)}
                >
                    <img
                        src="/resume.png"
                        alt="Resume Preview"
                        className="block w-full max-w-[800px] h-auto object-contain rounded"
                    />
                </motion.div>
            </motion.div>

            {/* Lightbox Modal */}
            {lightbox && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
                    onClick={() => setLightbox(false)}
                >
                    <motion.img
                        src="/resume.png"
                        alt="Resume Fullscreen"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-full max-h-full rounded shadow-2xl"
                    />
                </div>
            )}

            {/* Confetti */}
            {success && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} />}
        </div>
    );
}
