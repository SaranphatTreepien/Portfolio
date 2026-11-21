"use client";
import Card from "./Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "../LanguageProvider";

import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaWordpress,
  FaFigma,
  FaBriefcase,
  FaCarSide,
  FaGraduationCap,
  FaMicrochip,
  FaUniversity,
  FaPlug,
  FaRobot,
  FaLightbulb,
  FaHeartbeat,
  FaNetworkWired,
  FaServer,
  FaDatabase,
  FaCode,
  FaHandshake,
  FaCertificate,
} from "react-icons/fa";

// ✅ 1. แก้ไขตรงนี้: เปลี่ยนสไตล์เป็น "พื้นเหลือง-ตัวหนังสือดำ"
const Year = ({ children }) => (
  <span className="inline-block bg-[#FFD700] text-black px-2 py-0.5 rounded-md font-bold text-sm shadow-sm">
    {children}
  </span>
);

// --- Data Section ---
// Text is {th, en}; durations use Buddhist-era years in Thai and Gregorian years in English.
const journeyData = {
  freelance: [
    {
      company: "AAppoint — AI Agent / Backend Engineer (Freelance)",
      icon: <FaRobot />,
      duration: { th: "พ.ค. 2569 - ปัจจุบัน", en: "May 2026 - Present" },
      description: {
        th: "พัฒนา AI agent สองฝั่งสำหรับการจองร้านอาหารและการจัดการร้าน ด้วย LangChain และ Gemini",
        en: "Developed dual-facing AI agents for restaurant booking and shop management using LangChain and Gemini.",
      },
      details: [
        "B2C Agent: Customer-facing agent for restaurant booking, built with LangChain and Gemini.",
        "B2B Agent: Assists shop managers with booking summaries, cancellations, and shop information.",
        "Memory: Redis for short-term memory and PostgreSQL for long-term memory across both agents.",
        "Expanded agent capability from text-only responses to full booking-to-payment workflows, integrating with LINE OA via custom, token-authenticated API endpoints."
      ],
      type: "default"
    },
    {
      company: "Water Vending Machine System (IoT Commercial Project)",
      icon: <FaBriefcase />,
      duration: { th: "2567 - 2568", en: "2024 - 2025" },
      description: {
        th: "ติดตั้งและดูแลระบบ IoT ของตู้น้ำหยอดเหรียญเชิงพาณิชย์กว่า 70 ตู้ เน้นความเสถียรของฮาร์ดแวร์และการเชื่อมต่อเครือข่ายในพื้นที่ที่พักอาศัย",
        en: "Implemented and maintained IoT systems for over 70 commercial vending units. Focused on hardware reliability and stable network connectivity in residential environments.",
      },
      details: [
        "Hardware: PCB assembly, soldering, and chip-level troubleshooting for control boards.",
        "Network: SIM-based IoT configuration and IP management for machine-to-server communication.",
        "System: On-site troubleshooting and API integration testing with the backend team.",
        "Scale: Successfully deployed 70+ operational units."
      ],
      type: "default"
    },
  ],
  experience: [
    {
      company: "AI Agent & LLM Self-Study",
      icon: <FaRobot />,
      duration: { th: "2569", en: "2026" },
      description: {
        th: "ศึกษาสถาปัตยกรรม AI Agent และการพัฒนาแอปด้วย LLM ด้วยตัวเอง ทั้ง prompt engineering การออกแบบ agent ด้วย LangChain และระบบ memory (Redis, PostgreSQL) เพื่อเป็นพื้นฐานก่อนทำโปรเจกต์ AI agent ของ AAppoint",
        en: "Self-studied AI Agent architecture and LLM application development — prompt engineering, LangChain agent design, and memory systems (Redis, PostgreSQL) — as groundwork before building the AAppoint AI agent project.",
      },
      type: "default"
    },
    {
      company: "Smart Plug IoT Project",
      icon: <FaPlug />,
      duration: { th: "2566", en: "2023" },
      description: {
        th: "พัฒนาระบบปลั๊กอัจฉริยะ IoT ด้วย ESP32 และโมดูลรีเลย์ ออกแบบวงจรแปลงไฟ 220V AC เป็น 12V DC อย่างปลอดภัย สั่งงานระยะไกลและตั้งอัตโนมัติผ่าน Blynk และสั่งด้วยเสียงผ่าน Alexa",
        en: "Developed a Smart Plug IoT system using ESP32 and relay modules. Designed an electrical circuit to safely convert 220V AC to 12V DC. Enabled remote control and automation via Blynk platform and Alexa voice integration.",
      },
      type: "default"
    },
    {
      company: "Dangerous Animal Detection System",
      icon: <FaRobot />,
      duration: { th: "2566", en: "2023" },
      description: {
        th: "พัฒนาต้นแบบระบบตรวจจับสัตว์อันตรายด้วย YOLOv8 และ Python เชื่อมกล้อง IP และ ESP32-CAM เพื่อประมวลผลวิดีโอแบบเรียลไทม์ และแจ้งเตือนทันทีผ่าน LINE Messaging API",
        en: "Developed a prototype for dangerous animal detection using YOLOv8 and Python. Integrated IP Cameras and ESP32-CAM to process real-time video feeds and implemented instant alert notifications via LINE Messaging API.",
      },
      type: "default"
    },
    {
      company: "TourGuard: Smart AI Streetlight (I-New Gen Award 2025)",
      icon: <FaLightbulb />,
      duration: { th: "2567", en: "2024" },
      description: {
        th: "ผลงานได้รับรางวัล: ออกแบบเสาไฟถนนอัจฉริยะที่รวมการตรวจจับด้วย AI เข้ากับการเตือนภัยทางกายภาพ เมื่อพบสัตว์อันตราย ระบบจะเปิดไฟกะพริบและส่งแจ้งเตือนทาง LINE ได้รับรางวัลเหรียญเงิน I-New Gen Award 2025 (วช.)",
        en: "Award-winning project: Designed a smart streetlight system that integrates AI detection with physical warning mechanisms. The system triggers flashing lights and sends LINE notifications upon detecting dangerous animals. Received the Silver Medal at I-New Gen Award 2025 (NRCT).",
      },
      type: "default"
    },
    {
      company: "Custom PCB Assembly & Sensor Integration",
      icon: <FaMicrochip />,
      duration: { th: "2567", en: "2024" },
      description: {
        th: "งานฮาร์ดแวร์และการประกอบ PCB ทั้งติดตั้งชิป บัดกรี และทดสอบวงจร เชื่อมต่อเซนเซอร์สิ่งแวดล้อม (แสง ฝุ่น อุณหภูมิ) ผ่าน GPIO เพื่อให้ระบบทำงานได้เสถียร",
        en: "Specialized in hardware implementation and PCB assembly. Performed chip mounting, soldering, and circuit testing. Integrated environmental sensors (Light, Dust, Temperature) via GPIO interfaces to ensure system reliability.",
      },
      type: "default"
    },
    {
      company: "Line Following Robot (Digital Logic Project)",
      icon: <FaCarSide />,
      duration: { th: "2567", en: "2024" },
      description: {
        th: "ออกแบบหุ่นยนต์เดินตามเส้นที่ไม่ใช้ไมโครคอนโทรลเลอร์ ใช้ลอจิกเกต (IC) ล้วน ลดรูปวงจรควบคุมด้วย K-Map 5 ตัวแปร เพื่อประมวลผลสัญญาณเซนเซอร์ให้เดินตามเส้นได้แม่นยำ",
        en: "Designed a microcontroller-free robot using pure Logic Gates (ICs). Optimized complex control circuits using 5-variable K-Map to process sensor signals for precise navigation.",
      },
      type: "default"
    },
    {
      company: "Smart Care Monitor System (OS Academic Project)",
      icon: <FaHeartbeat />,
      duration: { th: "2568", en: "2025" },
      description: {
        th: "พัฒนาระบบติดตามผู้ป่วยอัจฉริยะบนคลาวด์สำหรับวิชาระบบปฏิบัติการ ใช้ Ubuntu เป็นเซิร์ฟเวอร์ รองรับผู้ใช้หลายบทบาท (แพทย์ พยาบาล ผู้ป่วย) และสรุปข้อมูลสุขภาพด้วย AI เพื่อช่วยการตัดสินใจทางการแพทย์",
        en: "Developed a cloud-based smart patient monitoring system for an Operating Systems course. Used Ubuntu as server to support multi-role access (doctors, nurses, patients). Implemented AI-generated health summaries to assist medical decision-making.",
      },
      tech: "Flask (Python), Jinja2, HTMX, HTML5, MQTT, MongoDB, AI Microservice, Docker",
      type: "default"
    },
  ],
  education: [
    {
      company: { th: "วิทยาลัยเทคนิคไทย-ออสเตรีย", en: "Thai-Austrian Technical College" },
      icon: <FaUniversity />,
      qualification: { th: "ประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.) สาขาเทคโนโลยีสารสนเทศ", en: "Higher Vocational Certificate (IT)" },
      duration: { th: "พ.ค. 2562 - มี.ค. 2564", en: "May 2019 - Mar 2021" },
      description: {
        th: "ศึกษาเทคโนโลยีสารสนเทศ (IT) เน้นพื้นฐานฮาร์ดแวร์และระบบเครือข่าย",
        en: "Studied Information Technology (IT) with focus on hardware and networking basics.",
      },
      type: "default"
    },
    {
      company: { th: "มหาวิทยาลัยศรีปทุม", en: "Sripatum University" },
      icon: <FaGraduationCap />,
      qualification: { th: "ปริญญาตรี (กำลังศึกษา)", en: "Bachelor’s Degree (Student)" },
      duration: { th: "2566 - คาดว่าจบ 2569", en: "2023 - Expected 2026" },
      description: {
        th: "กำลังศึกษาการพัฒนาซอฟต์แวร์ เทคโนโลยีเว็บ และทักษะคอมพิวเตอร์เชิงปฏิบัติ",
        en: "Currently studying software development, web technologies, and practical computing skills.",
      },
      type: "default"
    }
  ],
  skill: [
    {
      company: { th: "การพัฒนา AI Agent", en: "AI Agent Development" },
      icon: <FaRobot />,
      description: {
        th: "LangChain, Google Gemini, ออกแบบ memory ของ agent (Redis ระยะสั้น, PostgreSQL ระยะยาว), เชื่อมต่อ LINE OA API",
        en: "LangChain, Google Gemini, agent memory design (Redis short-term, PostgreSQL long-term), LINE OA API integration.",
      },
      type: "skill"
    },
    {
      company: { th: "พื้นฐานระบบเครือข่าย", en: "Networking Fundamentals" },
      icon: <FaNetworkWired />,
      description: {
        th: "OSI model, TCP/IP, IPv4/IPv6, Routing, Switching, การตั้งค่าและแก้ปัญหาเครือข่าย",
        en: "OSI model, TCP/IP, IPV4/IPV6, Routing, Switching, Network configuration & Troubleshooting.",
      },
      type: "skill"
    },
    {
      company: { th: "เทคโนโลยี Cisco", en: "Cisco Technologies" },
      icon: <FaServer />,
      description: "VLAN, Trunk, Tagging, SSH Telnet, Spanning Tree.",
      type: "skill"
    },
    {
      company: { th: "การเขียนโปรแกรม", en: "Programming" },
      icon: <FaCode />,
      description: { th: "พื้นฐาน: C, C++, Python", en: "Basic Knowledge : C, C++, Python." },
      type: "skill"
    },
    {
      company: { th: "ฐานข้อมูล", en: "Database" },
      icon: <FaDatabase />,
      description: { th: "SQL, NoSQL, ER Diagram, การเขียน query", en: "SQL, NoSQL, Er-Diagram, Querying." },
      type: "skill"
    },
    {
      company: "Soft Skills",
      icon: <FaHandshake />,
      description: {
        th: "การแก้ปัญหา การทำงานเป็นทีม การสื่อสาร และการปรับตัว",
        en: "Problem Solving, Teamwork, Communication, Adaptability.",
      },
      type: "skill"
    }
  ],
  training: [
    {
      company: "CCNA Network Labs Professional",
      icon: <FaCertificate />,
      duration: "NetPrime Training",
      description: {
        th: "เน้นการทำแล็บจริงด้านระบบเครือข่ายและเทคโนโลยี Cisco",
        en: "Focused on practical lab work regarding Networking and Cisco technologies.",
      },
      type: "learning"
    },
    {
      company: "Intermediate and Advanced Computer Programming",
      icon: <FaCertificate />,
      duration: "Mahidol MOOC",
      description: {
        th: "ศึกษาโครงสร้างโปรแกรมและอัลกอริทึมอย่างครบถ้วน",
        en: "Comprehensive study of programming structures and algorithms.",
      },
      type: "learning"
    }
  ]
};

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  },
};

const TABS = ["freelance", "experience", "education", "skill", "training"];
const TAB_CLASS =
  "rounded-full px-6 py-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-accent data-[state=active]:shadow-md transition-all duration-300";

const Cards = () => {
  const { t, tx } = useLang();
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-8">
      <Tabs
        defaultValue="freelance"// ตั้งค่าแท็บเริ่มต้นเป็น "freelance"
        className="flex flex-col items-center w-full"
      >
        {/* TabsList */}

        <TabsList className="flex flex-wrap justify-center gap-2 bg-white/50 backdrop-blur-md border border-gray-200 p-2 rounded-full mb-12 shadow-sm sticky top-4 z-10">
          {TABS.map((tab) => (
            <TabsTrigger key={tab} value={tab} className={TAB_CLASS}>
              {t(`journey.${tab}`)}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Content Area */}
        <div className="w-full min-h-[400px]">
          <AnimatePresence mode="wait">
            {Object.entries(journeyData).map(([key, data]) => (
              <TabsContent value={key} key={key} className="w-full mt-0">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={`grid gap-6 ${key === "skill"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-2"
                    : "grid-cols-1 lg:grid-cols-2"
                    }`}
                >
                  {data.map((item, index) => {
                    return (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        layout
                      >
                        <Card
                          {...item}
                          company={tx(item.company)}
                          description={tx(item.description)}
                          qualification={tx(item.qualification)}
                          duration={item.duration && <Year>{tx(item.duration)}</Year>}
                        />
                      </motion.div>
                    );
                  })}
                </motion.div>
              </TabsContent>
            ))}
          </AnimatePresence>
        </div>
      </Tabs>
    </section>
  );
};

export default Cards;