"use client";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import { Link as ScrollLink } from "react-scroll";
import Link from "next/link";
// Icons สำหรับ Social
import { FaGithub, FaLinkedin } from "react-icons/fa";
// Icons สำหรับการ์ด
import { FiTrendingUp, FiCpu, FiGlobe, FiZap } from "react-icons/fi";
// Icons ปุ่ม Resume
import { FiFileText, FiArrowRight } from "react-icons/fi";

// components
import RotatingShape from "./RotatingShape";
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

const Hero = () => {
  return (
    <section className="relative w-full min-h-screen overflow-hidden flex flex-col font-sans" id="Home">

      {/* --- 1. Noise Texture Overlay (เพิ่มความมีมิติ) --- */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {/* --- Background Layers --- */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent to-[#005f5f] lg:from-white lg:to-gray-50 -z-20 transition-colors duration-300">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] lg:bg-[radial-gradient(#cbd5e1_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-20 lg:opacity-60 mix-blend-overlay lg:mix-blend-normal"></div>
      </div>

      {/* --- 2. Tech Elements (Binary / Code Symbols) --- */}
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
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <span className="inline-flex items-center gap-2 py-2 px-5 rounded-full bg-white/10 border border-white/20 lg:bg-accent/5 lg:border-accent/10 backdrop-blur-md shadow-sm">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-white lg:text-accent font-semibold tracking-wide text-xs sm:text-sm uppercase">
                  Welcome to my portfolio
                </span>
              </span>
            </div>

            {/* Main Title */}
            <h1
              className="text-4xl sm:text-6xl md:text-7xl xl:text-8xl font-black leading-none tracking-tight animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            >
              {/* บรรทัดที่ 1 */}
              <span className="block text-white lg:text-gray-800 drop-shadow-lg lg:drop-shadow-none">
                I'M COMPUTER
              </span>

              {/* บรรทัดที่ 2: ลบ mt-2 ออก เพื่อให้ขยับขึ้นไปชิดข้างบน */}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/60 lg:from-accent lg:via-emerald-500 lg:to-teal-600 pb-2">
                ENGINEERING
              </span>
            </h1>

            {/* Type Animation */}
            <div className="text-xl sm:text-2xl md:text-3xl font-bold h-[40px] flex justify-center lg:justify-start items-center text-white/90 lg:text-gray-500 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <span className="mr-3 font-medium">Currently </span>
              <TypeAnimation
                sequence={[
                  "Not perfect yet", 1500,
                  "But learning every day", 1500,
                  "Small progress", 1500,
                  "Is still progress 🤍", 2000
                ]}
                speed={50}
                repeat={Infinity}
                wrapper="span"
                cursor={true}
                className="text-white lg:text-accent font-extrabold border-b-4 border-white/40 lg:border-accent/40 pb-1"
              />
            </div>

            {/* Description */}
            <p className="text-white/80 lg:text-gray-500 max-w-[90%] sm:max-w-[550px] text-sm sm:text-lg leading-relaxed font-normal animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              Passionate about exploring <strong className="text-white lg:text-accent font-bold">Data, Networks, AI</strong>, and <strong className="text-white lg:text-accent font-bold">AIoT</strong>. Turning complex problems into elegant, intelligent solutions.
            </p>

            {/* Buttons Area */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 w-full pt-4 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>

              {/* 1. Contact Button */}
              <ScrollLink to="Contact" smooth duration={500} offset={-50}>
                <button className="group relative h-[50px] sm:h-[56px] px-6 sm:px-8 rounded-full bg-white text-accent lg:bg-accent lg:text-white font-bold overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-accent/50">
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></span>
                  <span className="relative z-10 flex items-center gap-2">Contact Me <span className="text-lg">➔</span></span>
                </button>
              </ScrollLink>

              {/* 2. Learning Button */}
              <ScrollLink to="Learning" smooth duration={500} offset={-50}>
                <button className="h-[50px] sm:h-[56px] px-6 sm:px-8 rounded-full border-2 border-white lg:border-accent text-white lg:text-accent font-bold hover:bg-white/10 lg:hover:bg-accent lg:hover:text-white transition-all duration-300">
                  My Learning
                </button>
              </ScrollLink>

              {/* 3. Resume Button */}
              <Link href="/resume" passHref>
                <button className="
                  group flex items-center gap-2 sm:gap-3 
                  h-[50px] sm:h-[56px] px-6 sm:px-8 rounded-full 
                  border-2 border-white/30 lg:border-gray-300 
                  text-white lg:text-gray-600 font-bold 
                  bg-white/5 lg:bg-transparent backdrop-blur-sm
                  hover:bg-white hover:text-accent lg:hover:border-accent lg:hover:text-accent
                  transition-all duration-300 ease-in-out relative overflow-hidden
                ">
                  <FiFileText className="text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-bold tracking-wide text-xs sm:text-sm uppercase whitespace-nowrap">
                    Resume <span className="text-accent lg:text-accent mx-1">/</span> CV
                  </span>
                  <FiArrowRight className="text-lg opacity-0 -translate-x-2 w-0 group-hover:w-auto group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </button>
              </Link>

            </div>

            {/* Socials */}
            <div className="flex items-center gap-6 pt-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <SocialLink href="https://github.com/SaranphatTreepien" icon={<FaGithub />} label="GitHub" />
              <SocialLink href="https://www.linkedin.com/in/saranphat-treepien-4284402b2" icon={<FaLinkedin />} label="LinkedIn" />
            </div>
          </div>

          {/* --- Image Area (Right Side) --- */}
          <div className="w-full lg:w-[45%] z-10 relative h-[400px] sm:h-[500px] lg:h-[750px] flex justify-center lg:justify-end items-center lg:items-end order-1 lg:order-2 animate-fade-in-up mb-8 lg:mb-0">
            <div className="relative w-[300px] h-[340px] sm:w-[400px] sm:h-[460px] lg:w-[550px] lg:h-[650px]">

              {/* Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/20 blur-[80px] rounded-full -z-10 animate-pulse-slow"></div>

              {/* Decorative Geometric Shapes */}
              <div className="absolute inset-0 z-0 pointer-events-none">
                <FloatingElement className="top-[-15%] -left-[10%] opacity-100 animate-float-slow">
                  <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 80 C 10 80, 20 20, 50 20 C 80 20, 80 50, 50 50 C 20 50, 20 80, 90 90" stroke="white" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 6" />
                  </svg>
                </FloatingElement>

                <FloatingElement className="bottom-[30%] -left-[5%] opacity-100 animate-float-delayed delay-500">
                  <div className="w-8 h-8 border-[3px] border-white animate-[spin_20s_linear_infinite] shadow-lg"></div>
                </FloatingElement>

                <FloatingElement className="bottom-[40%] -right-[8%] opacity-100 animate-float-slow delay-200">
                  <svg width="50" height="50" viewBox="0 0 100 100" fill="none" className="animate-[spin_25s_linear_infinite] drop-shadow-md">
                    <path d="M50 5 L93 25 L93 75 L50 95 L7 75 L7 25 Z" stroke="white" strokeWidth="3" />
                  </svg>
                </FloatingElement>

                {/* Orbiting Circle */}
                <div className="absolute top-[40%] left-[5%] z-20">
                  <div className="relative w-[60px] h-[60px] flex items-center justify-center animate-[spin_3s_linear_infinite]">
                    <div className="absolute top-0 w-5 h-5 rounded-full border-[3px] border-white bg-white/20 shadow-[0_0_15px_rgba(255,255,255,0.6)]"></div>
                    <div className="absolute bottom-0 w-2 h-2 rounded-full bg-white opacity-80"></div>
                    <div className="absolute inset-0 rounded-full border border-white/20"></div>
                  </div>
                </div>
              </div>

              {/* Profile Image */}
              <div className="relative w-full h-full drop-shadow-2xl filter hover:brightness-105 transition-all duration-500 z-10">
                <Image
                  src="/assets/hero/dev3.png"
                  fill
                  priority
                  className="object-contain lg:object-bottom hover:-translate-y-2 transition-transform duration-500"
                  alt="Saranphat Profile"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              <FloatingElement className="top-[15%] -right-4 lg:top-[10%] lg:right-[0%] animate-float-medium delay-700">
                <RotatingShape
                  content={<Image src="/assets/hero/shape-2.svg" width={40} height={40} alt="shape2" className="brightness-0 invert drop-shadow-lg" />}
                  direction="right" duration={5}
                />
              </FloatingElement>

            </div>
          </div>
        </div>

        {/* --- 3. Scroll Down Indicator (เพิ่มการโต้ตอบ) --- */}
        <div className="hidden lg:flex absolute bottom-32 left-1/2 -translate-x-1/2 z-20 flex-col items-center animate-fade-in-up delay-700 pointer-events-none">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2 font-semibold">Scroll</span>
          <div className="w-[26px] h-[44px] rounded-full border-2 border-gray-300 flex justify-center p-1.5 shadow-sm bg-white/20 backdrop-blur-sm">
            <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce"></div>
          </div>
        </div>

        {/* --- 4. Cards Section (Glassmorphism Style) --- */}
        {/* --- 4. Cards Section (Premium Glass Style) --- */}
        <div className="relative z-30 w-full mt-4 lg:-mt-20 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((item, index) => (
              <div
                key={index}
                className="
          group relative overflow-hidden
          bg-white/60 backdrop-blur-2xl 
          border border-white/40
          rounded-2xl p-8 h-full flex flex-col
          shadow-[0_8px_30px_rgb(0,0,0,0.04)]
          hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]
          hover:-translate-y-2 transition-all duration-500
          /* เพิ่มเส้นขอบเงาๆ เพื่อให้ตัดกับพื้นหลัง */
          ring-1 ring-white/50
        "
              >
                {/* Decorative Background Blob (แสงจางๆ ด้านหลังการ์ด) */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/20 rounded-full blur-3xl group-hover:bg-accent/30 transition-all duration-500"></div>

                {/* Icon Wrapper */}
                <div className="
          relative z-10 w-14 h-14 rounded-2xl 
          bg-gradient-to-br from-white/80 to-white/40 
          shadow-sm border border-white/50
          flex items-center justify-center mb-6 
          group-hover:scale-110 group-hover:rotate-3 
          transition-transform duration-500 ease-out
        ">
                  <div className="text-accent text-2xl group-hover:text-accent-dark transition-colors duration-300">
                    {item.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="relative z-10 text-xl font-bold text-gray-800 mb-3 group-hover:text-accent transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="relative z-10 text-gray-500 text-sm leading-relaxed flex-grow font-medium">
                  {item.description}
                </p>

                {/* Bottom Border Highlight on Hover */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

// Helper Components
const SocialLink = ({ href, icon, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="text-white/70 lg:text-gray-400 hover:text-white lg:hover:text-accent text-3xl transition-all duration-300 hover:scale-110 hover:rotate-6"
  >
    {icon}
  </a>
);

const FloatingElement = ({ children, className }) => (
  <div className={`absolute z-20 hover:scale-110 transition-transform duration-300 ${className}`}>
    {children}
  </div>
);

export default Hero;