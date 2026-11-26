"use client";

import Logo from "./Logo";
import Nav from "./Nav";
import { LanguageToggle, useLang } from "./LanguageProvider";

const Header = () => {
  const { t } = useLang();
  return (
    <header className="absolute inset-x-0 top-0 z-30 py-6 lg:py-8">
      <div className="container mx-auto flex items-center justify-between gap-6">
        <Logo subtitle={t("header.subtitle")} />
        <Nav containerStyles="hidden xl:block" />
        <LanguageToggle />
      </div>
    </header>
  );
};
export default Header;
