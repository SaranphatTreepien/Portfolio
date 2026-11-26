"use client";

import { Link as ScrollLink } from "react-scroll";
import { FiArrowUp } from "react-icons/fi";
import Logo from "./Logo";
import { openAbout } from "./AboutModal";
import { useLang } from "./LanguageProvider";

// Same section ids as the top menu; About opens its window
const LINKS = ["Home", "Live", "Experience", "Journey", "About", "Contact"];

const SOCIAL = [
  { label: "GitHub", href: "https://github.com/SaranphatTreepien" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/saranphat-treepien-4284402b2" },
  { label: "Instagram", href: "https://www.instagram.com/maxtree289_/" },
  { label: "Facebook", href: "https://web.facebook.com/Saranphat7S/" },
  { label: "X", href: "https://x.com/maxtree289_" },
];

const linkClass = "cursor-pointer text-[14px] text-white/65 transition-colors hover:text-white";

const Footer = () => {
  const { t } = useLang();
  return (
    <footer className="bg-brand-900 text-white">
      <div className="container mx-auto py-14 lg:py-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <Logo light subtitle={t("header.subtitle")} />
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {SOCIAL.map((item) => (
                <li key={item.label}>
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className={`${linkClass} underline decoration-white/25 underline-offset-4 hover:decoration-white`}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-12 gap-y-3 sm:grid-cols-3">
              {LINKS.map((name) => (
                <li key={name}>
                  {name === "About" ? (
                    <button type="button" onClick={openAbout} className={linkClass}>
                      {t(`nav.${name}`)}
                    </button>
                  ) : (
                    <ScrollLink to={name} href={`#${name}`} smooth duration={600} offset={-40} className={linkClass}>
                      {t(`nav.${name}`)}
                    </ScrollLink>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-[13px] text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>{t("footer.copyright", new Date().getFullYear())}</p>
          <ScrollLink to="Home" href="#Home" smooth duration={700} className="group inline-flex w-fit cursor-pointer items-center gap-1.5 transition-colors hover:text-white">
            {t("footer.top")}
            <FiArrowUp className="transition-transform duration-200 group-hover:-translate-y-0.5" />
          </ScrollLink>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
