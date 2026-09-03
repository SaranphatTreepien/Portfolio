"use client";
import { Link as ScrollLink } from "react-scroll";

const links = [
  { name: "Home" },
  { name: "About" },
  { name: "Learning" },
  { name: "Journey" },
  { name: "Contact" },
];

const Nav = ({ containerStyles, listStyles, linkStyles, spy }) => {
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
            className={`
              ${linkStyles}
              relative cursor-pointer
              inline-flex items-center justify-center
              h-[40px] px-4 rounded-full
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
            {link.name}
          </ScrollLink>
        ))}
      </ul>
    </nav>
  );
};

export default Nav;
