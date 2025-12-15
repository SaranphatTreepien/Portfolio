import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight, FiLink, FiCalendar } from "react-icons/fi";
import { Badge } from "@/components/ui/badge";

// ✅ 1. เพิ่ม isCertificate เข้าไปในวงเล็บ props
const WorkItem = ({ slug, category, img, title, createdAt, link, isCertificate }) => {

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    : null;

  return (
    <div className="group block h-full select-none">

      {/* --- 1. Image Card --- */}
      <Link href={`/work/${slug}`} className="block w-full overflow-hidden rounded-[2rem]">
        <div className="relative w-full h-[320px] bg-gray-100 overflow-hidden">

          {/* Badge Top Left (Category - ของเดิม) */}
          <Badge className="absolute top-5 left-5 z-20 bg-white/90 backdrop-blur-md text-gray-900 px-4 py-1.5 text-xs font-bold uppercase tracking-wider shadow-sm border border-white/50 hover:bg-white">
            {category}
          </Badge>

      

          {/* Image */}
          <Image
            src={img}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
        </div>
      </Link>

      {/* --- 2. Content --- */}
      <div className="mt-6 px-1 flex flex-col gap-3">

        {/* Date & Meta Row */}
        <div className="flex items-center justify-between text-sm text-gray-400 h-6"> {/* เพิ่ม h-6 เพื่อล็อคความสูง */}

          {/* ฝั่งซ้าย: วันที่ */}
          {formattedDate ? (
            <div className="flex items-center gap-2">
              <FiCalendar className="text-gray-300" />
              <span>{formattedDate}</span>
            </div>
          ) : (
            <div></div> /* ใส่ div เปล่าๆ ไว้ดันทรงกรณีไม่มีวันที่ */
          )}

          {/* ✅ ฝั่งขวา: Certificate Badge (ย้ายมาตรงนี้) */}
          {isCertificate && (
            <div className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-md text-xs font-bold border border-yellow-200 shadow-sm">
              🏆 Certificate
            </div>
          )}

        </div>
        {/* Title & Arrow Row */}
        <Link href={`/work/${slug}`} className="flex items-start justify-between gap-4 group/title">
          <h3 className="text-2xl font-bold text-gray-800 leading-tight transition-colors duration-300 group-hover/title:text-accent">
            {title}
          </h3>

          {/* Arrow Button */}
          <span className="
            flex-shrink-0 w-12 h-12 rounded-full 
            border border-gray-200 bg-white 
            flex items-center justify-center 
            text-gray-400 transition-all duration-300 
            group-hover/title:bg-accent group-hover/title:border-accent group-hover/title:text-white
            group-hover/title:rotate-45
          ">
            <FiArrowUpRight className="text-xl" />
          </span>
        </Link>

        {/* External Link Section */}
        {link && (
          <div className="mt-1">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-2 px-3 py-1.5 -ml-3
                rounded-lg text-sm font-medium text-gray-500 
                hover:text-accent hover:bg-accent/5 
                transition-all duration-300
              "
            >
              <FiLink className="w-4 h-4" />
              <span className="truncate max-w-[200px] border-b border-transparent hover:border-accent/30">
                {link.replace(/^https?:\/\//, '')}
              </span>
            </a>
          </div>
        )}
      </div>

    </div>
  );
};

export default WorkItem;