"use client";

import { FiArrowUp } from "react-icons/fi";
import { useLang } from "./LanguageProvider";

// The sidebar already carries the menu and profiles, so the footer is just a quiet closing line.
const Footer = () => {
  const { t } = useLang();
  return (
    <footer className="container mx-auto pb-10 pt-6">
      <div className="flex flex-col gap-3 border-t border-gray-900/[0.08] pt-6 text-[13px] text-gray-500 sm:flex-row sm:items-center sm:justify-between">
        <p>{t("footer.copyright", new Date().getFullYear())}</p>
        <a href="#Home" className="group inline-flex w-fit items-center gap-1.5 transition-colors hover:text-primary">
          {t("footer.top")}
          <FiArrowUp className="transition-transform duration-200 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
