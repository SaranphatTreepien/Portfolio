import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { Badge } from "@/components/ui/badge"; // เช็ค path import ให้ตรงกับของคุณ

// 1. รับ slug เข้ามาใน props
const WorkItem = ({ slug, category, img, title }) => {
  return (
    // 2. ใช้ slug สร้าง URL: /work/ชื่อ-slug
    <Link href={`/work/${slug}`} className="group">
      <div className="text-white w-full h-[300px] p-8 rounded-[30px] flex items-center justify-center mb-6 relative overflow-hidden bg-[#f4f4f4]">
        <Badge className="bg-primary text-base z-40 absolute top-6 left-6 capitalize">
          {category}
        </Badge>
        <Image
          src={img}
          alt={title || "Project image"}
          fill
          priority
          quality={100}
          className="object-cover group-hover:scale-105 transition-all duration-500"
        />
      </div>
      <div className="flex items-center justify-center">
        <div className="flex-1">
          <h3 className="h3">{title}</h3>
        </div>
        <button className="bg-accent text-white rounded-full w-[48px] h-[48px] flex items-center justify-center -rotate-45 group-hover:rotate-0 transition-all duration-500">
          <FiArrowRight className="text-2xl" />
        </button>
      </div>
    </Link>
  );
};

export default WorkItem;