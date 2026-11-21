"use client";

import { Link as ScrollLink } from "react-scroll";
// components
import Logo from "./Logo";
import Nav from "./Nav";
import Socials from "./Socials";
import { LanguageToggle, useLang } from "./LanguageProvider";

const Header = () => {
  const { t } = useLang();
  return (
    <header className="w-full absolute py-8 xl:py-[48px] z-30">
      <div className="container mx-auto">
        <div
          className="flex flex-col lg:flex-row items-center gap-4
             lg:justify-between"
        >
          {/* logo */}
          <Logo subtitle={t("header.subtitle")} />
          <div className="flex items-center gap-12"></div>
          {/* nav & socials */}
          <Nav
            containerStyles={"hidden xl:flex"}
            listStyles={"flex gap-1"}
            linkStyles="text-primary font-primary text-lg tracking-[1.4px]"
            transition-all
            duration-300
            cursor-pointer
          />
          <div className="flex items-center gap-3">
            <Socials containerStyles="flex items-center gap-2" 
            iconStyles="text-base w-[32px] h-[32px] bg-primary text-white flex
            items-center justify-center rounded-full"/>
            <LanguageToggle />
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
