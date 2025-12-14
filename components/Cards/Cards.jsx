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
  FaGraduationCap,
  FaMicrochip,
  FaUniversity,
  FaPlug,
  FaRobot,
  FaLightbulb,
  FaHeartbeat,
  FaNetworkWired, // Networking
  FaServer,       // เพิ่ม icon สำหรับ Cisco/Server
  FaDatabase,     // Database
  FaCode,         // Programming
  FaHandshake,    // Soft Skills
  FaCertificate,  // Training
} from "react-icons/fa";

// --- Data Section ---
const journeyData = {
  experience: [
    {
      company: "Smart Plug IoT Project",
      icon: <FaPlug />,
      duration: "2566",
      description: "Developed a Smart Plug IoT system using ESP32 and relay modules. Designed a basic electrical circuit to handle 220V AC input and convert it to 12V DC. Implemented remote control via Blynk and Alexa integration.",
      type: "default"
    },
    {
      company: "Dangerous Animal Detection AI",
      icon: <FaRobot />,
      duration: "2566",
      description: "Developed an AI-based system using YOLOv8 and Python to detect dangerous animals via IP Camera and ESP32-CAM. Upon detection (e.g., tigers), the system sends real-time alerts through LINE Messaging API. The project was developed for the I-NEW GEN Inventor Award 2025.",
      type: "default"
    },
    {
      company: "Smart AI Streetlight System (Academic Project)", 
      icon: <FaLightbulb />,
      duration: "2567",
      description: "Developed the full prototype of a smart streetlight. Integrated the AI detection module with the physical control system. Designed the logic to trigger flashing lights and send LINE notifications instantly when dangerous animals are detected.",
      type: "default"
    },
    {
      company: "Custom PCB Assembly & Sensor Integration", 
      icon: <FaMicrochip />,
      duration: "2567",
      description: "Specialized in hardware implementation. Assembled and soldered a custom PCB board (Chip mounting & Soldering). Tested circuit connectivity and integrated environmental sensors (Light, Dust, Temperature) via GPIO interface to ensure hardware reliability.",
      type: "default"
    },
    {
      company: "Smart Care Monitor System (OS Academic Project)",
      icon: <FaHeartbeat />,
      duration: "2568",
      description: "Academic project developed for an Operating Systems course. Built a smart patient monitoring system using Ubuntu as a server. The system allows doctors, nurses, and patients to monitor bedside health data via the cloud, with AI-generated health summaries to support medical decision-making.",
      tech: "Flask (Python), Jinja2, HTMX, HTML5, MQTT, MongoDB, AI Microservice, Docker",
      type: "default"
    },
  ],
  education: [
    {
      company: "Thai-Austrian Technical College",
      icon: <FaUniversity />,
      qualification: "Higher Vocational Certificate (IT)",
      duration: "May 2019 - Mar 2021",
      description: "Studied Information Technology (IT) with focus on hardware and networking basics.",
      type: "default"
    },
    {
      company: "Sripatum University",
      icon: <FaGraduationCap />,
      qualification: "Bachelor’s Degree (Student)",
      duration: "2023 - Expected 2026",
      description: "Currently studying software development, web technologies, and practical computing skills.",
      type: "default"
    }
  ],
  // --- Skills ปรับปรุงใหม่ตามข้อมูลล่าสุด ---
  skill: [
    {
      company: "Networking Fundamentals",
      icon: <FaNetworkWired />,
      description: "OSI model, TCP/IP, IPV4/IPV6, Routing, Switching, Network configuration & Troubleshooting.",
      type: "skill"
    },
    {
      company: "Cisco Technologies",
      icon: <FaServer />, // ใช้รูป Server/Rack เพื่อสื่อถึง Cisco
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
  // --- Training ตามข้อมูลล่าสุด ---
  training: [
    {
      company: "CCNA Network Labs Professional",
      icon: <FaCertificate />,
      duration: "NetPrime Training",
      description: "Focused on practical lab work regarding Networking and Cisco technologies.",
      type: "learning"
    },
    {
      company: "Intermediate and Advanced Computer Programming",
      icon: <FaCertificate />,
      duration: "Mahidol MOOC",
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
        defaultValue="experience"
        className="flex flex-col items-center w-full"
      >
        {/* TabsList */}
        <TabsList className="flex flex-wrap justify-center gap-2 bg-white/50 backdrop-blur-md border border-gray-200 p-2 rounded-full mb-12 shadow-sm sticky top-4 z-10">
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
                  className={`grid gap-6 ${
                    key === "skill"
                      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-2" // Skill ใช้ 2 คอลัมน์เพื่อความอ่านง่าย
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