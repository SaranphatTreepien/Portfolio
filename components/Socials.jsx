import Link from "next/link";
import {
  FaFacebookF,
  FaGithub,
  FaLinkedinIn,
  FaFileAlt,
} from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";

const socials = [
  { icon: <RiInstagramFill />, path: "https://www.instagram.com/saranphattree_/" },
  { icon: <FaFacebookF />, path: "https://web.facebook.com/Saranphat7S/" },
  { icon: <FaGithub />, path: "https://github.com/SaranphatTreepien" },
  { icon: <FaLinkedinIn />, path: "https://www.linkedin.com/in/saranphat-treepien-4284402b2" },
  { icon: <FaFileAlt />, path: "/resume", title: "Resume" }, // หน้า Resume
  { icon: <FaFileAlt />, path: "/cv.pdf", title: "CV" },     // PDF CV
];

const Socials = ({ containerStyles, iconStyles }) => {
  return (
    <div className={containerStyles}>
      {socials.map((item, index) => {
        const isPdf = item.path.endsWith(".pdf"); // ตรวจสอบไฟล์ PDF

        return (
          <Link
            href={item.path}
            key={index}
            target={isPdf ? "_blank" : undefined} // เปิด PDF ใน tab ใหม่
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
