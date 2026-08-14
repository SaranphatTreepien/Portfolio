"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import { Link as ScrollLink } from "react-scroll";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
// Icons สำหรับการ์ด
import { FiTrendingUp, FiCpu, FiGlobe, FiZap } from "react-icons/fi";
// Icons ปุ่ม Resume
import { FiFileText, FiArrowRight, FiX } from "react-icons/fi";

// components
import Header from "./Header";

// ข้อมูลการ์ด
const stats = [
  {
    icon: <FiTrendingUp className="w-8 h-8 lg:w-10 lg:h-10 text-[#7edad2]" />,
    title: "Growth Mindset",
    description:
      "I love learning and improving myself. I am hardworking, open-minded, and enjoy sharing ideas.",
  },
  {
    icon: <FiCpu className="w-8 h-8 lg:w-10 lg:h-10 text-[#7edad2]" />,
    title: "AI & Vision",
    description:
      "Built a dangerous animal detection project using YOLOv8. Experimented with training models to optimize performance.",
  },
  {
    icon: <FiGlobe className="w-8 h-8 lg:w-10 lg:h-10 text-[#7edad2]" />,
    title: "Networks",
    description:
      "My current passion. Active with NetPrime training and Cisco labs to master network configuration.",
  },
  {
    icon: <FiZap className="w-8 h-8 lg:w-10 lg:h-10 text-[#7edad2]" />,
    title: "AIoT Integration",
    description:
      "Developed detection systems using ESP32-CAM. Strong hardware skills including complex soldering.",
  },
];

const LUMA_PROFILE_URL = "https://luma.com/user/max289";

const Hero = () => {
  const [isLumaModalOpen, setIsLumaModalOpen] = useState(false);

  useEffect(() => {
    if (!isLumaModalOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsLumaModalOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isLumaModalOpen]);

  return (
    <section
      className="relative w-full min-h-screen overflow-hidden flex flex-col font-sans"
      id="Home"
    >
      {/* --- Background Layers --- */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent to-[#005f5f] lg:from-white lg:to-gray-50 -z-20">
        {/* Static gradient orbs */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(126,218,210,0.4) 0%, transparent 70%)",
            top: "20%",
            right: "10%",
          }}
        ></div>
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(0,168,168,0.3) 0%, transparent 70%)",
            bottom: "10%",
            left: "5%",
          }}
        ></div>
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] lg:bg-[radial-gradient(#cbd5e1_1.5px,transparent_1.5px)] [background-size:32px_32px] opacity-15 lg:opacity-40"></div>
      </div>

      {/* --- Tech Elements (Binary / Code Symbols) --- */}
      <div className="hidden lg:block absolute top-20 left-10 font-mono text-accent/5 text-8xl font-bold select-none z-0 rotate-12 pointer-events-none">
        {"< />"}
      </div>
      <div className="hidden lg:block absolute bottom-1/3 right-10 font-mono text-accent/5 text-6xl font-bold select-none z-0 -rotate-12 pointer-events-none">
        010011
      </div>

      <div className="hidden lg:block absolute top-0 right-0 w-[50%] h-full bg-gradient-to-bl from-accent to-[#00a8a8] -z-10 rounded-bl-[250px] shadow-[-20px_0_100px_rgba(0,0,0,0.08)]"></div>

      {/* Header */}
      <div className="absolute top-0 left-0 w-full z-50">
        <Header />
      </div>

      <div className="container mx-auto h-full px-6 sm:px-8 flex-grow flex flex-col pt-28 lg:pt-32 relative">
        {/* --- Main Content Row --- */}
        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between w-full flex-grow pb-12 lg:pb-0 gap-10 lg:gap-0 z-10">
          {/* --- Text Content (Left Side) --- */}
          <div className="w-full lg:w-[50%] text-center lg:text-left z-20 order-2 lg:order-1 flex flex-col items-center lg:items-start space-y-6 mb-10 lg:mb-32">
            {/* Badge */}
            <div>
              <span className="inline-flex items-center gap-2 py-2 px-5 rounded-full bg-white/10 border border-white/20 lg:bg-accent/5 lg:border-accent/10 backdrop-blur-sm shadow-sm">
                <span className="relative flex h-3 w-3">
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-white lg:text-accent font-semibold tracking-wide text-xs sm:text-sm uppercase">
                  Welcome to my portfolio
                </span>
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl xl:text-8xl font-black leading-none tracking-tight">
              {/* บรรทัดที่ 1 */}
              <span className="block text-white lg:text-gray-800 drop-shadow-lg lg:drop-shadow-none">
                I'M COMPUTER
              </span>

              {/* บรรทัดที่ 2 */}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/60 lg:from-accent lg:via-emerald-500 lg:to-teal-600 pb-2">
                ENGINEERING
              </span>
            </h1>

            {/* Type Animation */}
            <div className="text-xl sm:text-2xl md:text-3xl font-bold h-[40px] flex justify-center lg:justify-start items-center text-white/90 lg:text-gray-500">
              <span className="mr-3 font-medium">Currently </span>
              <TypeAnimation
                sequence={[
                  "Not perfect yet",
                  1500,
                  "But learning every day",
                  1500,
                  "Small progress",
                  1500,
                  "Is still progress 🤍",
                  2000,
                ]}
                speed={50}
                repeat={Infinity}
                wrapper="span"
                cursor={true}
                className="text-white lg:text-accent font-extrabold border-b-4 border-white/40 lg:border-accent/40 pb-1"
              />
            </div>

            {/* Description */}
            <p className="text-white/80 lg:text-gray-500 max-w-[90%] sm:max-w-[550px] text-sm sm:text-lg leading-relaxed font-normal">
              Passionate about building{" "}
              <strong className="text-white lg:text-accent font-bold">
                real products
              </strong>{" "}
              with modern web and{" "}
              <strong className="text-white lg:text-accent font-bold">
                cloud technologies
              </strong>
              . From idea to deployment — always learning, always shipping.
            </p>

            {/* Buttons Area */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 w-full pt-4">
              {/* 1. Contact Button */}
              <ScrollLink to="Contact" smooth duration={500} offset={-50}>
                <button className="h-[50px] sm:h-[56px] px-6 sm:px-8 rounded-full bg-white text-accent lg:bg-accent lg:text-white font-bold shadow-lg">
                  <span className="flex items-center gap-2">
                    Contact Me <span className="text-lg">➔</span>
                  </span>
                </button>
              </ScrollLink>

              {/* 2. Learning Button */}
              <ScrollLink to="Learning" smooth duration={500} offset={-50}>
                <button className="h-[50px] sm:h-[56px] px-6 sm:px-8 rounded-full border-2 border-white lg:border-accent text-white lg:text-accent font-bold">
                  My Experience
                </button>
              </ScrollLink>

              {/* 3. Resume Button */}
              <Link href="/resume" passHref>
                <button className="flex items-center gap-2 sm:gap-3 h-[50px] sm:h-[56px] px-6 sm:px-8 rounded-full border-2 border-white/30 lg:border-gray-300 text-white lg:text-gray-600 font-bold bg-white/5 lg:bg-transparent backdrop-blur-sm">
                  <FiFileText className="text-lg sm:text-xl" />
                  <span className="font-bold tracking-wide text-xs sm:text-sm uppercase whitespace-nowrap">
                    Resume
                  </span>
                  <FiArrowRight className="text-lg" />
                </button>
              </Link>
            </div>

            {/* Credential coin badges */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-5 w-full justify-center lg:justify-start">
              {CREDENTIAL_BADGES.map((badge) => (
                <CoinBadge
                  key={badge.label}
                  {...badge}
                  onClick={
                    badge.label === "Luma"
                      ? () => setIsLumaModalOpen(true)
                      : undefined
                  }
                />
              ))}
            </div>
          </div>

          {/* --- Image Area (Right Side) --- */}
          <div className="w-full lg:w-[45%] z-10 relative h-[400px] sm:h-[500px] lg:h-[750px] flex justify-center lg:justify-end items-center lg:items-end order-1 lg:order-2 mb-8 lg:mb-0">
            <div className="relative w-[300px] h-[340px] sm:w-[400px] sm:h-[460px] lg:w-[550px] lg:h-[650px]">
              {/* Glow effect */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/15 blur-[40px] rounded-full -z-10"></div>

              {/* Decorative Geometric Shapes */}
              <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Curved line shape */}
                <div className="absolute top-[-15%] -left-[10%] opacity-80">
                  <svg
                    width="80"
                    height="80"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 80 C 10 80, 20 20, 50 20 C 80 20, 80 50, 50 50 C 20 50, 20 80, 90 90"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray="6 6"
                    />
                  </svg>
                </div>

                {/* Circle accent */}
                <div className="absolute top-[15%] -right-4 lg:top-[10%] lg:right-[0%] opacity-90">
                  <div className="w-12 h-12 rounded-full border-[3px] border-white/60"></div>
                </div>
              </div>

              {/* Profile Image */}
              <div className="relative w-full h-full drop-shadow-2xl z-10">
                <Image
                  src="/assets/hero/dev3.png"
                  fill
                  priority
                  quality={85}
                  className="object-contain lg:object-bottom"
                  alt="Saranphat Profile"
                  sizes="(max-width: 640px) 300px, (max-width: 1024px) 400px, 550px"
                  placeholder="empty"
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- Cards Section --- */}
        <div className="relative z-30 w-full mt-4 lg:-mt-20 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((item, index) => (
              <div
                key={index}
                className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl p-8 min-h-[200px] flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              >
                {/* Icon Wrapper */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/80 to-white/40 shadow-sm border border-white/50 flex items-center justify-center mb-6">
                  <div className="text-accent text-2xl">{item.icon}</div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-grow font-medium">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isLumaModalOpen && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsLumaModalOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="luma-modal-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,168,168,0.15)] border border-accent/25 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setIsLumaModalOpen(false)}
                className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-accent/10 hover:text-accent transition-colors"
                aria-label="Close"
              >
                <FiX className="h-5 w-5" />
              </button>

              <div className="p-5 sm:p-6 pt-6">
                <div className="rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/icon/luma-events.gif"
                    alt="Luma event attendance proof"
                    className="w-full h-auto object-contain"
                  />
                </div>

                <div className="mt-4 text-center space-y-1">
                  <p
                    id="luma-modal-title"
                    className="text-base sm:text-lg font-bold text-gray-800"
                  >
                    PREVIEW
                  </p>
                  <p className="text-sm text-gray-500">Event attendance proof</p>
                </div>

                <a
                  href={LUMA_PROFILE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex items-center justify-center gap-2 w-full py-3 px-4 rounded-full bg-accent text-white font-bold text-sm sm:text-base shadow-lg shadow-accent/25 hover:bg-[#00a8a8] transition-colors"
                >
                  View Luma Profile
                  <FiArrowRight className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

const CREDENTIAL_BADGES = [
  {
    label: "GitHub",
    href: "https://github.com/SaranphatTreepien",
    icon: IconGitHub,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/saranphat-treepien-4284402b2",
    icon: IconLinkedIn,
  },
  {
    label: "Credly",
    href: "https://www.credly.com/users/saranphat-treepian/edit/badges/credly",
    imageSrc: "/assets/icon/credlyicon.svg",
    imageClassName: "object-cover",
  },
  {
    label: "Google Skills",
    href: "https://www.skills.google/public_profiles/a5a766a1-9ea1-43fd-94af-736cee17ba2c",
    icon: IconGoogleSkills,
    tag: "#ChaiyoGCP66",
  },
  {
    label: "Luma",
    imageSrc: "/assets/icon/lumaIcon.png",
    imageClassName: "object-contain scale-[1.4] origin-center",
  },
];

const CoinBadge = ({
  href,
  label,
  icon: Icon,
  imageSrc,
  imageClassName = "object-contain",
  tag,
  counter,
  counterLabel,
  onClick,
}) => {
  const ariaLabel =
    counterLabel
      ? `${label} — ${counterLabel}`
      : tag
        ? `${label} — ${tag}`
        : label;

  const badgeShell = (
    <>
      <span
        className="relative flex h-11 w-11 min-h-[44px] min-w-[44px] sm:h-14 sm:w-14 lg:h-16 lg:w-16 items-center justify-center rounded-full p-[3px] shadow-[0_4px_16px_rgba(0,168,168,0.28)] transition-shadow duration-300 group-hover:shadow-[0_0_0_4px_rgba(126,218,210,0.35),0_10px_28px_rgba(126,218,210,0.45)]"
        style={{
          background:
            "linear-gradient(145deg, #7edad2 0%, #00a8a8 55%, #005f5f 100%)",
        }}
      >
        <span
          className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(0,0,0,0.06)] lg:from-[#f8fffe] lg:via-white lg:to-[#e8f7f5]"
        >
          {imageSrc ? (
            imageSrc.endsWith(".svg") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageSrc}
                alt=""
                className={`h-full w-full ${imageClassName}`}
              />
            ) : (
              <Image
                src={imageSrc}
                alt=""
                width={64}
                height={64}
                className={`h-full w-full ${imageClassName}`}
                sizes="(max-width: 640px) 44px, (max-width: 1024px) 56px, 64px"
              />
            )
          ) : (
            <span className="text-gray-700 lg:text-gray-600 transition-colors duration-300 group-hover:text-accent">
              <Icon />
            </span>
          )}
        </span>
      </span>
      {tag && (
        <span
          className="absolute -top-0.5 -right-1 sm:-top-1 sm:-right-1.5 flex max-w-[calc(100%+4px)] items-center justify-center rounded-full bg-gradient-to-br from-accent to-[#00a8a8] px-1 sm:px-1.5 py-0.5 text-[6px] sm:text-[7px] lg:text-[8px] font-bold leading-none text-white shadow-[0_2px_8px_rgba(0,168,168,0.55)] ring-2 ring-white lg:ring-gray-50 whitespace-nowrap"
          aria-hidden="true"
        >
          {tag}
        </span>
      )}
      {counter != null && (
        <span
          className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 flex h-5 min-w-5 sm:h-[22px] sm:min-w-[22px] items-center justify-center rounded-full bg-gradient-to-br from-accent to-[#00a8a8] px-1 text-[10px] sm:text-[11px] font-bold leading-none text-white shadow-[0_2px_8px_rgba(0,168,168,0.55)] ring-2 ring-white lg:ring-gray-50"
          aria-hidden="true"
        >
          {counter}
        </span>
      )}
    </>
  );

  const sharedClassName =
    "group relative shrink-0 rounded-full transition-all duration-300 ease-out hover:scale-[1.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2";

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        title={ariaLabel}
        className={sharedClassName}
      >
        {badgeShell}
      </button>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      title={ariaLabel}
      className={sharedClassName}
    >
      {badgeShell}
    </a>
  );
};

function IconGitHub() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.537H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.126 0 2.063 2.063 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.536v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function IconGoogleSkills() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.06z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export default Hero;
