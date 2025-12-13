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
      <ul className={listStyles}>
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
              relative cursor-pointer py-4 px-2
              text-gray-400
              transition-all duration-300

              hover:text-[#7edad2]

              /* Active State */
              [&.active-nav-link]:text-[#7edad2]
              [&.active-nav-link]:font-semibold
            `}
          >
            {link.name}

            {/* Top Light Effect */}
            <span
              className={`
                absolute top-0 left-1/2 -translate-x-1/2
                w-full h-[40px] -z-10 opacity-0
                transition-all duration-500
                bg-gradient-to-b from-[#7edad2]/30 to-transparent
                rounded-b-xl

                /* Active */
                [.active-nav-link_&]:opacity-100
                [.active-nav-link_&]:h-[60px]
              `}
            />

            {/* Top Border Bar */}
            <span
              className={`
                absolute top-0 left-1/2 -translate-x-1/2
                h-[3px] w-0
                bg-[#7edad2]
                transition-all duration-300
                rounded-b-full

                hover:w-1/2
                [.active-nav-link_&]:w-full
              `}
            />
          </ScrollLink>
        ))}
      </ul>
    </nav>
  );
};

export default Nav;
