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
  FaMicrochip, // สำหรับ IoT
  FaUniversity,
} from "react-icons/fa";

// Data Separation: ใส่ icon component ลงไปตรงๆ เพื่อแก้ปัญหาภาพแตก
const journeyData = {
  experience: [
    {
      company: "Smart Plug IoT Project",
      icon: <FaMicrochip />, // ใช้ Icon แทนรูปภาพ
      duration: "2023",
      description: "Developed a Smart Plug IoT system using ESP32 and relay modules. Designed a basic electrical circuit to handle 220V AC input and convert it to 12V DC. Implemented remote control via Blynk and Alexa integration.",
      type: "default"
    },
    // สามารถเพิ่ม Experience อื่นๆ ได้ที่นี่
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
  skill: [
    {
      company: "HTML 5",
      icon: <FaHtml5 />,
      description: "Semantic Structure, Accessibility",
      type: "skill" // ระบุ type เพื่อให้ Card แสดงผลต่างออกไป
    },
    {
      company: "CSS 3",
      icon: <FaCss3Alt />,
      description: "Flexbox, Grid, Animations",
      type: "skill"
    },
    {
      company: "JavaScript",
      icon: <FaJs />,
      description: "ES6+, Async/Await, DOM",
      type: "skill"
    },
    {
      company: "React.JS",
      icon: <FaReact />,
      description: "Hooks, Context, Redux",
      type: "skill"
    },
    {
      company: "WordPress",
      icon: <FaWordpress />,
      description: "Theme Customization, CMS",
      type: "skill"
    },
    {
      company: "Figma",
      icon: <FaFigma />,
      description: "UI/UX Design, Prototyping",
      type: "skill"
    },
  ],
};

const Cards = () => {
  return (
    <Tabs
      defaultValue="experience"
      className="flex flex-col items-center w-full"
    >
      <TabsList className="flex bg-gray-100 p-1 rounded-full mb-10 gap-2">
        <TabsTrigger value="experience" className="rounded-full px-6 data-[state=active]:bg-accent data-[state=active]:text-white transition-all">Experience</TabsTrigger>
        <TabsTrigger value="education" className="rounded-full px-6 data-[state=active]:bg-accent data-[state=active]:text-white transition-all">Education</TabsTrigger>
        <TabsTrigger value="skill" className="rounded-full px-6 data-[state=active]:bg-accent data-[state=active]:text-white transition-all">My Skills</TabsTrigger>
      </TabsList>

      {/* Content Area */}
      <div className="w-full">
        {Object.entries(journeyData).map(([key, data]) => (
          <TabsContent value={key} key={key} className="w-full">
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                // Logic Grid: ถ้าเป็น skill ให้แสดงหลายคอลัมน์ (2-3-4) ถ้าเป็นอื่นแสดงแค่ (1-2)
                className={`grid gap-6 ${
                  key === "skill" 
                    ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4" 
                    : "grid-cols-1 xl:grid-cols-2"
                }`}
              >
                {data.map((item, index) => {
                  return <Card key={index} {...item} />;
                })}
              </motion.div>
            </AnimatePresence>
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
};

export default Cards;