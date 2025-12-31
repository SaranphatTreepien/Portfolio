"use client";
import Card from "./Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";

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
const journeyData = {
  freelance: [
    {
      company: "Water Vending Machine System (IoT Commercial Project)",
      icon: <FaBriefcase />,
      duration: <Year>2567-2568</Year>,
      description: "Implemented and maintained IoT systems for over 70 commercial vending units. Focused on hardware reliability and stable network connectivity in residential environments.",
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
      company: "Smart Plug IoT Project",
      icon: <FaPlug />,
      duration: <Year>2566</Year>,
      description: "Developed a Smart Plug IoT system using ESP32 and relay modules.Designed an electrical circuit to safely convert 220V AC to 12V DC.Enabled remote control and automation via Blynk platform and Alexa voice integration.",
      type: "default"
    },
    {
      company: "Dangerous Animal Detection System",
      icon: <FaRobot />,
      duration: <Year>2566</Year>,
      description: "Developed a prototype for dangerous animal detection using YOLOv8 and Python. Integrated IP Cameras and ESP32-CAM to process real-time video feeds and implemented instant alert notifications via LINE Messaging API.",
      type: "default"
    },
    {
      company: "TourGuard: Smart AI Streetlight (I-New Gen Award 2025)",
      icon: <FaLightbulb />,
      duration: <Year>2567</Year>,
      description: "Award-winning project: Designed a smart streetlight system that integrates AI detection with physical warning mechanisms. The system triggers flashing lights and sends LINE notifications upon detecting dangerous animals. Received the Silver Medal at I-New Gen Award 2025 (NRCT).",
      type: "default"
    },
    {
      company: "Custom PCB Assembly & Sensor Integration",
      icon: <FaMicrochip />,
      duration: <Year>2567</Year>,
      description: "Specialized in hardware implementation and PCB assembly.Performed chip mounting, soldering, and circuit testing.Integrated environmental sensors (Light, Dust, Temperature) via GPIO interfaces to ensure system reliability.",
      type: "default"
    },
    {
      company: "Line Following Robot (Digital Logic Project)",
      icon: <FaCarSide />,
      duration: <Year>2567</Year>,
      description: "Designed a microcontroller-free robot using pure Logic Gates (ICs). Optimized complex control circuits using 5-variable K-Map to process sensor signals for precise navigation.",
      type: "default"
    },
    {
      company: "Smart Care Monitor System (OS Academic Project)",
      icon: <FaHeartbeat />,
      duration: <Year>2568</Year>,
      description: "Developed a cloud-based smart patient monitoring system for an Operating Systems course.Used Ubuntu as server to support multi-role access (doctors, nurses, patients).Implemented AI-generated health summaries to assist medical decision-making.",
      tech: "Flask (Python), Jinja2, HTMX, HTML5, MQTT, MongoDB, AI Microservice, Docker",
      type: "default"
    },
  ],
  education: [
    {
      company: "Thai-Austrian Technical College",
      icon: <FaUniversity />,
      qualification: "Higher Vocational Certificate (IT)",
      duration: <Year>May 2019 - Mar 2021</Year>,
      description: "Studied Information Technology (IT) with focus on hardware and networking basics.",
      type: "default"
    },
    {
      company: "Sripatum University",
      icon: <FaGraduationCap />,
      qualification: "Bachelor’s Degree (Student)",
      duration: <Year>2023 - Expected 2026</Year>,
      description: "Currently studying software development, web technologies, and practical computing skills.",
      type: "default"
    }
  ],
  skill: [
    {
      company: "Networking Fundamentals",
      icon: <FaNetworkWired />,
      description: "OSI model, TCP/IP, IPV4/IPV6, Routing, Switching, Network configuration & Troubleshooting.",
      type: "skill"
    },
    {
      company: "Cisco Technologies",
      icon: <FaServer />,
      description: "VLAN, Trunk, Tagging, SSH Telnet, Spanning Tree.",
      type: "skill"
    },
    {
      company: "Programming",
      icon: <FaCode />,
      description: "Basic Knowledge : C, C++, Python.",
      type: "skill"
    },
    {
      company: "Database",
      icon: <FaDatabase />,
      description: "SQL, NoSQL, Er-Diagram, Querying.",
      type: "skill"
    },
    {
      company: "Soft Skills",
      icon: <FaHandshake />,
      description: "Problem Solving, Teamwork, Communication, Adaptability.",
      type: "skill"
    }
  ],
  training: [
    {
      company: "CCNA Network Labs Professional",
      icon: <FaCertificate />,
      duration: <Year>NetPrime Training</Year>,
      description: "Focused on practical lab work regarding Networking and Cisco technologies.",
      type: "learning"
    },
    {
      company: "Intermediate and Advanced Computer Programming",
      icon: <FaCertificate />,
      duration: <Year>Mahidol MOOC</Year>,
      description: "Comprehensive study of programming structures and algorithms.",
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

const Cards = () => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-8">
      <Tabs
        defaultValue="freelance"// ตั้งค่าแท็บเริ่มต้นเป็น "freelance"
        className="flex flex-col items-center w-full"
      >
        {/* TabsList */}

        <TabsList className="flex flex-wrap justify-center gap-2 bg-white/50 backdrop-blur-md border border-gray-200 p-2 rounded-full mb-12 shadow-sm sticky top-4 z-10">
          <TabsTrigger
            value="freelance"
            className="rounded-full px-6 py-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-accent data-[state=active]:shadow-md transition-all duration-300"
          >
            Freelance
          </TabsTrigger>
          <TabsTrigger
            value="experience"
            className="rounded-full px-6 py-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-accent data-[state=active]:shadow-md transition-all duration-300"
          >
            Experience
          </TabsTrigger>
          <TabsTrigger
            value="education"
            className="rounded-full px-6 py-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-accent data-[state=active]:shadow-md transition-all duration-300"
          >
            Education
          </TabsTrigger>
          <TabsTrigger
            value="skill"
            className="rounded-full px-6 py-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-accent data-[state=active]:shadow-md transition-all duration-300"
          >
            Skills
          </TabsTrigger>
          <TabsTrigger
            value="training"
            className="rounded-full px-6 py-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-accent data-[state=active]:shadow-md transition-all duration-300"
          >
            Training
          </TabsTrigger>
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
                        <Card {...item} />
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