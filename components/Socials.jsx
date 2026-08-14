import Link from "next/link";
import { FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { RiInstagramFill } from "react-icons/ri";
import { BsFileEarmarkPersonFill } from "react-icons/bs";

const socials = [
  { icon: <RiInstagramFill />, path: "https://www.instagram.com/maxtree289_/#", external: true },
  { icon: <FaFacebookF />, path: "https://web.facebook.com/Saranphat7S/", external: true },
  { icon: <FaXTwitter />, path: "https://x.com/maxtree289_", external: true, title: "X" },
  { icon: <BsFileEarmarkPersonFill />, path: "/resume", title: "Resume" },
];

const Socials = ({ containerStyles, iconStyles }) => {
  return (
    <div className={containerStyles}>
      {socials.map((item, index) => {
        const isExternal = item.external || item.path.endsWith(".pdf");

        return (
          <Link
            href={item.path}
            key={index}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
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