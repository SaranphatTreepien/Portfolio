import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { Badge } from "@/components/ui/badge";

const WorkItem = ({ slug, category, img, title, createdAt }) => {
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleString("th-TH", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <Link href={`/work/${slug}`} className="group block">
      <div className="text-white w-full h-[300px] relative rounded-[30px] overflow-hidden mb-6 bg-gray-100">
        {/* Badge ซ้ายบน */}
        <Badge className="bg-primary/90 backdrop-blur-sm text-base z-40 absolute top-6 left-6 capitalize shadow-lg border border-white/20">
          {category}
        </Badge>
        
        {/* ✅ Date ย้ายมา ขวาล่าง (bottom-6 right-6) */}
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
        
        {/* Overlay มืดๆ ตอน Hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 z-10" />
      </div>

      <div className="flex items-center justify-between gap-6 px-2">
        <h3 className="text-2xl font-bold leading-tight group-hover:text-primary transition-colors">
          {title}
        </h3>
        <button className="bg-accent text-white rounded-full w-[50px] h-[50px] flex items-center justify-center -rotate-45 group-hover:rotate-0 group-hover:scale-110 transition-all duration-300 shadow-md">
          <FiArrowRight className="text-2xl" />
        </button>
      </div>
    </Link>
  );
};

export default WorkItem;