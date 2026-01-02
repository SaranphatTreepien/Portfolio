import Link from "next/link";
import {
  FaFacebookF,
  FaGithub,
  FaLinkedinIn,
  FaFilePdf, // ไอคอนสำหรับ PDF
  FaUserTie, // ไอคอนสำหรับ Resume (มาดนักธุรกิจ/โปรไฟล์)
} from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { BsFileEarmarkPersonFill } from "react-icons/bs"; // อีกตัวเลือกที่สวยสำหรับ Resume

const socials = [
  { icon: <RiInstagramFill />, path: "https://www.instagram.com/maxtree289_/#" },
  { icon: <FaFacebookF />, path: "https://web.facebook.com/Saranphat7S/" },
  { icon: <FaGithub />, path: "https://github.com/SaranphatTreepien" },
  { icon: <FaLinkedinIn />, path: "https://www.linkedin.com/in/saranphat-treepien-4284402b2" },
  // เปลี่ยนตรงนี้
  { icon: <BsFileEarmarkPersonFill />, path: "/resume", title: "Resume" }, // ไอคอนรูปเอกสารมีตัวคน
  { icon: <FaFilePdf />, path: "/cv", title: "CV" },                 // ไอคอน PDF ชัดเจน
];

const Socials = ({ containerStyles, iconStyles }) => {
  return (
    <div className={containerStyles}>
      {socials.map((item, index) => {
        const isPdf = item.path.endsWith(".pdf");

        return (
          <Link
            href={item.path}
            key={index}
            target={isPdf ? "_blank" : undefined}
            rel={isPdf ? "noopener noreferrer" : undefined}
          >
            <span className={iconStyles} title={item.title}>
              {item.icon}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default Socials;