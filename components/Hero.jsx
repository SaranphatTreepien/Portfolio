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

      {/* --- Background Layers --- */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent to-[#005f5f] lg:from-white lg:to-gray-50 -z-20">
        {/* Static gradient orbs */}
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-30 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(126,218,210,0.4) 0%, transparent 70%)',
            top: '20%',
            right: '10%',
          }}
        ></div>
        <div 
          className="absolute w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(0,168,168,0.3) 0%, transparent 70%)',
            bottom: '10%',
            left: '5%',
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
            <p className="text-white/80 lg:text-gray-500 max-w-[90%] sm:max-w-[550px] text-sm sm:text-lg leading-relaxed font-normal">
              Passionate about exploring <strong className="text-white lg:text-accent font-bold">Data, Networks, AI</strong>, and <strong className="text-white lg:text-accent font-bold">AIoT</strong>. Turning complex problems into elegant, intelligent solutions.
            </p>

            {/* Buttons Area */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 w-full pt-4">

              {/* 1. Contact Button */}
              <ScrollLink to="Contact" smooth duration={500} offset={-50}>
                <button className="h-[50px] sm:h-[56px] px-6 sm:px-8 rounded-full bg-white text-accent lg:bg-accent lg:text-white font-bold shadow-lg">
                  <span className="flex items-center gap-2">Contact Me <span className="text-lg">➔</span></span>
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

            {/* Socials */}
            <div className="flex items-center gap-6 pt-4">
              <SocialLink href="https://github.com/SaranphatTreepien" icon={<FaGithub />} label="GitHub" />
              <SocialLink href="https://www.linkedin.com/in/saranphat-treepien-4284402b2" icon={<FaLinkedin />} label="LinkedIn" />
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
                  <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 80 C 10 80, 20 20, 50 20 C 80 20, 80 50, 50 50 C 20 50, 20 80, 90 90" stroke="white" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 6" />
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
                  <div className="text-accent text-2xl">
                    {item.icon}
                  </div>
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
    className="text-white/70 lg:text-gray-400 text-3xl"
  >
    {icon}
  </a>
);

export default Hero;