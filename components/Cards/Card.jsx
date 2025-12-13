import React from "react";
import { motion } from "framer-motion";

const Card = ({
  company,
  logoUrl,
  icon,
  duration,
  description,
  qualification,
  type = "default", // รับ prop type เพื่อแยกดีไซน์
}) => {
  // ดีไซน์สำหรับ Skills (Icon ใหญ่ ตรงกลาง เรียบง่าย)
  if (type === "skill") {
    return (
      <div className="w-full h-full p-6 rounded-2xl bg-[#f8f9fa] border border-gray-200 hover:border-accent transition-all duration-300 hover:shadow-lg group text-center flex flex-col items-center gap-4">
        <div className="text-5xl text-gray-600 group-hover:text-accent transition-colors duration-300">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">{company}</h3>
          {/* ซ่อน Description ไว้ ถ้าอยากให้ Clean หรือจะใส่ Tooltip แทนก็ได้ */}
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">{description}</p>
        </div>
      </div>
    );
  }

  // ดีไซน์สำหรับ Experience & Education (มี Header, Date, Detail)
  return (
    <div className="w-full h-full p-6 md:p-8 rounded-2xl bg-[#f8f9fa] border border-gray-200 hover:border-accent transition-all duration-300 hover:shadow-lg flex flex-col md:flex-row gap-6 items-start">
      {/* ส่วน Logo/Icon */}
      <div className="flex-shrink-0 w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm text-3xl text-accent border border-gray-100">
        {icon ? icon : <img src={logoUrl} alt={company} className="w-10 h-10 object-contain" />}
      </div>

      {/* ส่วนเนื้อหา */}
      <div className="flex-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{company}</h3>
            {qualification && <span className="text-sm font-medium text-gray-500">{qualification}</span>}
          </div>
          <span className="inline-block mt-2 md:mt-0 px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-full w-max">
            {duration}
          </span>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed mt-2">{description}</p>
      </div>
    </div>
  );
};

export default Card;