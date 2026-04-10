import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight, FiLink, FiCalendar, FiStar } from "react-icons/fi";
import { Badge } from "@/components/ui/badge";

const WorkItem = ({ slug, category, specialTopic, specialTopics, img, title, createdAt, link, isCertificate, isBest, isCloud, isNetwork, isCommunity, isDevSecOps }) => {
  const displayCategory = category || (Array.isArray(specialTopics) && specialTopics[0]) || specialTopic;
  const tagLabelMap = {
    Cloud: "☁️ Cloud",
    Network: "🌐 Network",
    DevSecOps: "🛡️ DevSecOps",
    Certificate: "📜 Certificate",
    Community: "🤝 Community",
  };

  const topicValues = new Set(Array.isArray(specialTopics) ? specialTopics : []);
  if (specialTopic) topicValues.add(specialTopic);
  if (isCloud) topicValues.add("Cloud");
  if (isNetwork) topicValues.add("Network");
  if (isDevSecOps) topicValues.add("DevSecOps");
  if (isCertificate) topicValues.add("Certificate");
  if (isCommunity) topicValues.add("Community");

  const topicChips = [...topicValues].map((value) => tagLabelMap[value] || value);

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    : null;

  return (
    <div className="group block h-full select-none rounded-[2rem] border border-[#7edad2]/35 p-3 bg-white transition-colors duration-300 hover:border-[#7edad2]/60">

      {/* --- 1. Image Card --- */}
      <Link href={`/work/${slug}`} className="block w-full overflow-hidden rounded-[1.6rem]">
        <div className="relative w-full h-[320px] bg-gray-100 overflow-hidden">

          {/* Badge Top Left (Category - ของเดิม) */}
          <Badge className="absolute top-5 left-5 z-20 bg-white/90 backdrop-blur-md text-gray-900 px-4 py-1.5 text-xs font-bold uppercase tracking-wider shadow-sm border border-white/50 hover:bg-white">
            {displayCategory}
          </Badge>

          {topicChips.length > 0 && (
            <div className="absolute bottom-5 right-5 z-20 flex flex-wrap justify-end gap-1.5 max-w-[72%]">
              {topicChips.map((tag) => (
                <span key={tag} className="text-[10px] leading-none px-2 py-1 rounded-md bg-black/45 text-white border border-white/20 backdrop-blur-sm">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* ✅ Badge Theme: Rose Pink (แดงชมพู) */}
          {/* ✅ Badge Theme: Rose Pink + Active Hover Effects */}
          {/* ✅ Badge Theme: Solid Gold (พื้นเหลือง) + Active Hover Effects */}
          {isBest && (
            <div className="absolute bottom-4 left-4 z-20">
              <div className="
      relative overflow-hidden cursor-default
      flex items-center gap-1.5 px-3 py-1.5 rounded-full 
      
      /* --- 1. ปรับพื้นหลังเป็นสีเหลืองทอง (Solid Yellow) --- */
      bg-yellow-400 
      border border-yellow-200/50
      text-yellow-950  /* ตัวหนังสือสีน้ำตาลเข้มเกือบดำ อ่านง่ายบนพื้นเหลือง */
      shadow-[0_4px_10px_-2px_rgba(250,204,21,0.5)] /* เงาสีเหลือง */
      
      /* --- Hover Effects (เมื่อชี้ที่รูปใหญ่) --- */
      transition-all duration-500 ease-out
      group-hover:scale-110 
      group-hover:bg-yellow-300 /* สีสว่างขึ้นนิดนึงตอน Hover */
      group-hover:shadow-[0_0_20px_0px_rgba(250,204,21,0.8)] /* เงาฟุ้งกระจาย */
    ">

                {/* ✨ Shine Effect: แสงวิบวับวิ่งผ่าน (สีขาวจางๆ) */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-[200%] bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-1000 ease-in-out w-full h-full skew-x-12" />

                {/* ⭐ Icon: ดาวสีเข้ม หมุนดุ๊กดิ๊กตอน Hover */}
                <FiStar className="fill-yellow-950 text-yellow-950 w-3.5 h-3.5 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />


              </div>
            </div>
          )}

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
        <div className="flex items-center justify-between text-sm text-gray-400 h-6">

          {/* ฝั่งซ้าย: วันที่ */}
          {formattedDate ? (
            <div className="flex items-center gap-2">
              <FiCalendar className="text-gray-300" />
              <span>{formattedDate}</span>
            </div>
          ) : (
            <div></div>
          )}

          {/* ฝั่งขวา: Certificate Badge */}
          {isCertificate && (
            <div className="flex items-center gap-1 text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md text-xs font-bold border border-teal-200 shadow-sm">
              📜 Certificate
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