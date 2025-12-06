"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function ProjectContent({ content }) {
  return (
    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 gap-10">
      {content.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="
            bg-white 
            rounded-2xl 
            shadow-lg 
            border 
            border-[#d9f0ee] 
            p-6 
            hover:shadow-2xl 
            transition 
            duration-300 
            hover:-translate-y-1
            w-full
          "
        >
          {/* รูปภาพ */}
          <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4">
            <Image
              src={item.img}
              alt={`project-image-${index}`}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>

          {/* เส้นคั่น */}
          <div className="w-20 h-1 bg-gradient-to-r from-[#7edad2] to-[#79d3cc] rounded-full mb-4" />

          {/* Description */}
          <p className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap">
            {item.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
