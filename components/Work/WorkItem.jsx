import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiLink } from "react-icons/fi"; // ✅ 1. เพิ่มไอคอน Link
import { Badge } from "@/components/ui/badge";

// ✅ 2. รับ props 'link' เพิ่มเข้ามา
const WorkItem = ({ slug, category, img, title, createdAt, link }) => {
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleString("th-TH", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    // ✅ 3. เปลี่ยนตัวหุ้มจาก <Link> เป็น <div> แต่ยังคง class 'group' ไว้เพื่อให้ Hover effect ทำงาน
    <div className="group block h-full">
      
      {/* --- ส่วนที่ 1: รูปภาพ (กดแล้วไปหน้า Detail) --- */}
      <Link href={`/work/${slug}`} className="block w-full">
        <div className="text-white w-full h-[300px] relative rounded-[30px] overflow-hidden mb-6 bg-gray-100">
          <Badge className="bg-primary/90 backdrop-blur-sm text-base z-40 absolute top-6 left-6 capitalize shadow-lg border border-white/20">
            {category}
          </Badge>

          {formattedDate && (
            <div className="absolute bottom-6 right-6 z-40 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              <p className="text-xs text-white font-medium">{formattedDate}</p>
            </div>
          )}

          <Image
            src={img}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-all duration-700"
          />

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 z-10" />
        </div>
      </Link>

      {/* --- ส่วนที่ 2: เนื้อหาด้านล่าง --- */}
      <div className="px-2 flex flex-col gap-2"> {/* ✅ เพิ่ม flex-col เพื่อเรียงแนวตั้ง */}
        
        {/* 2.1 ชื่อโปรเจกต์ + ปุ่มลูกศร (กดแล้วไปหน้า Detail) */}
        <Link href={`/work/${slug}`} className="flex items-center justify-between gap-6">
          <h3 className="text-2xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
          <button className="bg-accent text-white rounded-full w-[50px] h-[50px] flex-shrink-0 flex items-center justify-center -rotate-45 group-hover:rotate-0 group-hover:scale-110 transition-all duration-300 shadow-md">
            <FiArrowRight className="text-2xl" />
          </button>
        </Link>

        {/* ✅ 2.2 ส่วนแสดงลิงก์ (แสดงเฉพาะถ้ามี link) */}
        {link && (
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors text-sm mt-1 w-fit"
          >
            <FiLink className="flex-shrink-0" />
            <span className="truncate max-w-[250px] underline decoration-dotted underline-offset-4">
              {link}
            </span>
          </a>
        )}
      </div>

    </div>
  );
};

export default WorkItem;