import Link from "next/link";
import {
  FaFacebookF,
  FaGithub,
  FaIntagram,
  FaLinkedinIn,
  FaFileAlt, // สำหรับ Resume/CV
  FaFilePdf, // สำหรับไฟล์ PDF
} from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";

const socials = [
  {
    icon: <RiInstagramFill />,
    path: "https://www.instagram.com/saranphattree_/",
  },
  {
    icon: <FaFacebookF />,
    path: "https://web.facebook.com/Saranphat7S/",
  },
  {
    icon: <FaGithub />,
    path: "https://github.com/SaranphatTreepien",
  },
  {
    icon: <FaLinkedinIn />,
    path: "https://www.linkedin.com/in/saranphat-treepien-4284402b2?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
  },
  {
    icon: <FaFileAlt />,
    path: "/resume.pdf", // ใส่ path ไฟล์ Resume ของคุณ
    title: "Resume",
  },
  {
    icon: <FaFileAlt />,
    path: "/cv.pdf", // ใส่ path ไฟล์ CV ของคุณ
    title: "CV",
  },
];

const Socials = ({ containerStyles, iconStyles }) => {
  return (
    <div className={containerStyles}>
      {socials.map((item, index) => (
        <Link
          href={item.path}
          key={index}
          target="_blank"
          rel="noopener noreferrer"
        >
          {/* title ใส่ที่ span */}
          <span className={iconStyles} title={item.title}>
            {item.icon}
          </span>
        </Link>
      ))}
    </div>
  );
};

export default Socials;
