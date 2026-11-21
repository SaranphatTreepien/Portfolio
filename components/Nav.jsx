"use client";
import { Link as ScrollLink } from "react-scroll";
import { useLang } from "./LanguageProvider";

const links = [
  { name: "Home" },
  { name: "Live" },
  { name: "Experience" },
  { name: "Journey" },
  { name: "About" },
  { name: "Contact" },
];

const Nav = ({ containerStyles, listStyles, linkStyles, spy, onLinkClick }) => {
  const { t, lang } = useLang();
  return (
    <nav className={containerStyles}>
      <ul
        className={`
          ${listStyles}
          p-2 rounded-full
          border border-[#7edad2]/45
          bg-white/10 backdrop-blur-sm
        `}
      >
        {links.map((link, index) => (
          <ScrollLink
            spy={spy}
            key={index}
            activeClass="active-nav-link"
            to={link.name}
            smooth={true}
            duration={500}
            offset={-70}
            onClick={onLinkClick}
            className={`
              ${linkStyles}
              relative cursor-pointer
              inline-flex items-center justify-center
              h-[40px] rounded-full whitespace-nowrap
              ${lang === "th" ? "px-3 !tracking-normal" : "px-4"}
              border border-transparent
              text-gray-400
              transition-all duration-300

              hover:text-[#7edad2] hover:bg-[#7edad2]/10 hover:border-[#7edad2]/45

              /* Active State */
              [&.active-nav-link]:text-[#7edad2]
              [&.active-nav-link]:font-semibold
              [&.active-nav-link]:bg-[#7edad2]/10
              [&.active-nav-link]:border-[#7edad2]/45
            `}
          >
            {t(`nav.${link.name}`)}
          </ScrollLink>
        ))}
      </ul>
    </nav>
  );
};

export default Nav;
