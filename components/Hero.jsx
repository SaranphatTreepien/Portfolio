"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import { FiArrowRight, FiFileText, FiMapPin } from "react-icons/fi";
import { SiCredly } from "react-icons/si";

import Header from "./Header";
import { IconGitHub, IconGoogle, IconLinkedIn } from "./icons";
import { useLang } from "./LanguageProvider";
import { googleSkillsProfile, credlyProfileUrl } from "@/data/credentials";

// Small profile links in each brand's own color
const PROFILES = [
  { label: "GitHub", href: "https://github.com/SaranphatTreepien", Icon: IconGitHub, color: "text-[#181717]" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/saranphat-treepien-4284402b2", Icon: IconLinkedIn, color: "text-[#0a66c2]" },
  { label: "Credly", href: credlyProfileUrl, Icon: SiCredly, color: "text-[#ff6b00]", size: "h-5 w-5" },
  { label: "Google Skills", href: googleSkillsProfile.url, Icon: IconGoogle },
];

// Text column enters line by line
const stagger = { animate: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
const rise = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const LEAD = {
  en: { before: "Computer engineer building ", accent: "secure, cloud-ready", after: " systems, from network labs to an AI gateway for my co-op." },
  th: { before: "วิศวกรคอมพิวเตอร์ที่สร้างระบบ", accent: "ปลอดภัยและพร้อมขึ้นคลาวด์", after: " ตั้งแต่แล็บเน็ตเวิร์กไปจนถึง AI gateway ในงานสหกิจ" },
};

const Hero = () => {
  const { t, lang } = useLang();
  const lead = LEAD[lang] ?? LEAD.en;


  return (
    <section id="Home" className="relative overflow-hidden">
      {/* Background: faint dot grid on the left, teal panel behind the photo on the right */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(rgba(148,163,184,0.35)_1px,transparent_1px)] [background-size:22px_22px]"
        style={{
          maskImage: "radial-gradient(ellipse 70% 70% at 25% 40%, black 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 25% 40%, black 30%, transparent 80%)",
        }}
      />
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="hero-panel absolute right-0 top-0 -z-10 hidden h-full w-[44%] lg:block"
      />

      <Header />

      <div className="container mx-auto grid items-end gap-6 px-6 pt-28 sm:px-8 lg:min-h-[700px] lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:pt-32 xl:min-h-[740px]">
        {/* --- Text --- */}
        <motion.div variants={stagger} initial="initial" animate="animate" className="relative z-10 self-center pb-4 lg:pb-16">
          <motion.p variants={rise}>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 py-1 pl-2.5 pr-3 text-[13px] font-medium text-brand-700 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
              </span>
              {t("hero.status")}
            </span>
          </motion.p>

          <motion.p variants={rise} className="mt-7 text-[15px] font-medium text-gray-500">
            {t("hero.hi")}
          </motion.p>
          <motion.h1
            variants={rise}
            className="mt-2 text-[44px] font-semibold leading-[0.98] tracking-[-0.04em] text-primary sm:text-[60px] xl:text-[76px]"
          >
            Saranphat
            <br />
            Treepian
          </motion.h1>

          <motion.p variants={rise} className="mt-6 max-w-[34rem] text-[17px] leading-[1.65] text-gray-600 sm:text-lg">
            {lead.before}
            <span className={`text-brand-700 ${lang === "en" ? "font-serif text-[1.2em] italic leading-none" : "font-medium"}`}>{lead.accent}</span>
            {lead.after}
          </motion.p>

          {/* Profiles */}
          <motion.ul variants={rise} className="mt-7 flex flex-wrap items-center gap-2">
            {PROFILES.map(({ label, href, Icon, color = "", size = "h-[15px] w-[15px]" }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex h-8 items-center gap-1.5 rounded-full border border-gray-200 bg-white/80 pl-2.5 pr-3 text-[13px] font-medium text-gray-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:text-primary hover:shadow-[0_6px_16px_-8px_rgba(16,21,31,0.35)]"
                >
                  <Icon className={`${size} ${color} shrink-0`} />
                  {label}
                </a>
              </li>
            ))}
          </motion.ul>

          {/* Actions */}
          <motion.div variants={rise} className="mt-9 flex flex-wrap items-center gap-3">
            <ScrollLink
              to="Live"
              href="#Live"
              smooth
              duration={600}
              offset={-40}
              className="group inline-flex h-12 cursor-pointer items-center gap-2 rounded-full bg-brand-600 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-brand-700"
            >
              {t("hero.viewWork")}
              <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </ScrollLink>
            <Link
              href="/cv"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-gray-300 bg-white px-5 text-[15px] font-medium text-primary transition-colors hover:border-primary"
            >
              <FiFileText className="text-gray-500" /> CV
            </Link>
          </motion.div>
        </motion.div>

        {/* --- Photo --- */}
        <div className="relative mx-auto h-[400px] w-full max-w-[420px] sm:h-[480px] lg:mx-0 lg:h-[600px] lg:max-w-none xl:h-[640px]">
          {/* Mobile: teal arch behind the photo (desktop uses the full-height panel) */}
          <div aria-hidden="true" className="hero-panel absolute inset-x-6 bottom-0 top-16 rounded-t-[200px] lg:hidden" style={{ borderBottomLeftRadius: 0 }} />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src="/assets/hero/dev3.png"
              fill
              priority
              quality={85}
              className="object-contain object-bottom drop-shadow-[0_20px_40px_rgba(16,21,31,0.18)]"
              alt="Saranphat Treepian"
              sizes="(max-width: 1024px) 420px, 600px"
            />
          </motion.div>

          {/* Small floating detail card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="absolute bottom-10 left-0 hidden items-center gap-3 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-[0_12px_32px_-12px_rgba(16,21,31,0.25)] backdrop-blur sm:flex lg:-left-6 lg:bottom-20"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <FiMapPin />
            </span>
            <span className="text-[13px] leading-tight">
              <span className="block font-semibold text-primary">{t("menu.locationValue")}</span>
              <span className="text-gray-500">{t("hero.location").split(" · ")[1]}</span>
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
