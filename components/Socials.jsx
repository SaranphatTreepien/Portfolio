import Link from "next/link";
import {
  FaFacebookF,
  FaGithub,
  FaIntagram,
  FaLinkedinIn,
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
];

const Socials = ({containerStyles,iconStyles}) => {
  return (
    <div className={containerStyles}>
      {socials.map((item, index) => {
        return (
          <Link href={item.path} key={index} className={iconStyles}>
            <span>{item.icon}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default Socials;
