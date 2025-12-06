"use client";

import works from "@/data/works";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function WorkDetailPage({ params }) {
  const { slug } = params;

  const project = works.find((item) => item.slug === slug);

  if (!project) {
    return <div className="p-10 text-red-500">Project not found.</div>;
  }

  return (
    <div className="relative min-h-screen py-20 px-4 overflow-hidden">

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f0f7f6] to-[#e6f1ef] -z-10"></div>

      {/* Soft blur decorative circles */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#cde7e3] rounded-full opacity-25 blur-3xl -z-10"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#bde1dc] rounded-full opacity-20 blur-2xl -z-10"></div>

    <Link href="/">
  <button className="fixed top-6 left-6 z-50 p-3 bg-[#7edad2] text-white 
    rounded-full shadow-lg hover:shadow-xl hover:scale-110 
    transition backdrop-blur-md">
    ←
  </button>
</Link>


      {/* Title */}
      <h1 className="text-4xl font-bold text-center text-gray-800 drop-shadow-md">
        {project.title}
      </h1>

      {/* Divider */}
      <div className="w-24 h-1 bg-[#7edad2] mx-auto mt-3 mb-12 rounded-full"></div>

      {/* Project Info */}
<div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-[#d9f0ee] mb-16">
  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
    Project Info
  </h2>

  <ul className="text-gray-700 space-y-2">
    <li><strong>Year:</strong> {project.info?.year}</li>
    <li><strong>Role:</strong> {project.info?.role}</li>
    <li><strong>Tools:</strong> {project.info?.tools}</li>
    <li><strong>Duration:</strong> {project.info?.duration}</li>
  </ul>
</div>

      {/* Content Cards */}
      {project.content.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <div className="p-[1px] rounded-xl bg-gradient-to-r from-[#7edad2] to-[#79d3cc]">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-transform duration-300 hover:-translate-y-1">

              {/* Image */}
              <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
                <Image
                  src={item.img}
                  alt={`project-image-${index}`}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Description */}
              <p className="mt-4 text-lg text-gray-700 whitespace-pre-line leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Back Home Button */}
      <div className="text-center mt-10">
        <Link href="/">
          <button className="px-6 py-3 rounded-lg text-white bg-[#7edad2] hover:bg-[#79d3cc] shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
            กลับหน้า Home
          </button>
        </Link>
      </div>

    </div>
  );
}
