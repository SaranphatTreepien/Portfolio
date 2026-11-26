"use client";
import { Link as ScrollLink } from "react-scroll";
import { useLang } from "./LanguageProvider";
import { openAbout } from "./AboutModal";

// Section ids stay the same; only the labels change with the language
const links = ["Home", "Live", "Experience", "Journey", "About", "Contact"];

const VARIANTS = {
  // Top bar: quiet text links in a frosted pill, the active one gets a soft fill
  bar: {
    list: "flex items-center gap-0.5 rounded-full border border-black/[0.06] bg-white/75 p-1 shadow-[0_1px_2px_rgba(16,21,31,0.04)] backdrop-blur-md",
    link: "inline-flex h-9 items-center rounded-full px-4 text-[14px] font-medium text-gray-500 transition-colors duration-200 hover:text-primary [&.active-nav-link]:bg-brand-50 [&.active-nav-link]:text-brand-700",
  },
  // Pop-up menu: large stacked links
  menu: {
    list: "flex flex-col gap-3",
    link: "text-[28px] font-semibold tracking-tight text-primary transition-colors hover:text-brand-600 [&.active-nav-link]:text-brand-600",
  },
};

const Nav = ({ containerStyles = "", variant = "bar", onLinkClick }) => {
  const { t } = useLang();
  const styles = VARIANTS[variant];
  return (
    <nav className={containerStyles}>
      <ul className={styles.list}>
        {links.map((name) => (
          <li key={name}>
            {name === "About" ? (
              // About opens a window instead of scrolling to a section
              <button
                type="button"
                onClick={() => {
                  onLinkClick?.();
                  openAbout();
                }}
                className={`cursor-pointer whitespace-nowrap ${styles.link}`}
              >
                {t(`nav.${name}`)}
              </button>
            ) : (
            <ScrollLink
              spy
              to={name}
              smooth
              duration={500}
              offset={-70}
              activeClass="active-nav-link"
              onClick={onLinkClick}
              className={`cursor-pointer whitespace-nowrap ${styles.link}`}
            >
              {t(`nav.${name}`)}
            </ScrollLink>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Nav;
