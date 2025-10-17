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
} from "react-icons/fa";

const Journey = [
  // Experience
  {
    type: "experience",
    company: "ABC University",
    logoUrl: "/assets/journey/experience/logo-1.svg",
    position: "Web Development Student",
    duration: "Jul 2021 - Present",
    description: `Pursuing a Bachelor's degree in Computer Science with a focus on web development. 
    Gained hands-on experience in building responsive websites and web applications using HTML, CSS, 
    JavaScript, and React.js.`,
  },
  {
    type: "experience",
    company: "Stack3d Lab",
    logoUrl: "/assets/journey/experience/logo-2.svg",
    position: "Frontend Developer",
    duration: "Mar 2010 - jun 2021",
    description: `Pursuing a Bachelor's degree in Computer Science with a focus on web development. 
    Gained hands-on experience in building responsive websites and web applications using HTML, CSS, 
    JavaScript, and React.js.`,
  },
  {
    type: "experience",
    company: "Mogolie",
    logoUrl: "/assets/journey/experience/logo-3.svg",
    position: "UI/UX Designer",
    duration: "Mar 2017 - jun 2019",
    description: `Pursuing a Bachelor's degree in Computer Science with a focus on web development. 
    Gained hands-on experience in building responsive websites and web applications using HTML, CSS, 
    JavaScript, and React.js.`,
  },
  {
    type: "experience",
    company: "Warpseed Inc.",
    logoUrl: "/assets/journey/experience/logo-4.svg",
    position: "Full Stack Developer",
    duration: "Aug 2010 - jun 2021",
    description: `Pursuing a Bachelor's degree in Computer Science with a focus on web development. 
    Gained hands-on experience in building responsive websites and web applications using HTML, CSS, 
    JavaScript, and React.js.`,
  },
  // Education
  {
    type: "education",
    company: "Udemy",
    logoUrl: "/assets/journey/education/logo-1.svg",
    qualification: "Frontend Developer",
    duration: "Mar 2010-jun 2021",
    description: `Pursuing a Bachelor's degree in Computer Science with a focus on web development. 
    Gained hands-on experience in building responsive websites and web applications using HTML, CSS, 
    JavaScript, and React.js.`,
  },
  {
    type: "education",
    company: "CodeAcademy Bootcamp",
    logoUrl: "/assets/journey/education/logo-2.svg",
    qualification: "Frontend Developer",
    duration: "Mar 2010-jun 2021",
    description: `Pursuing a Bachelor's degree in Computer Science with a focus on web development. 
    Gained hands-on experience in building responsive websites and web applications using HTML, CSS, 
    JavaScript, and React.js.`,
  },
  {
    type: "education",
    company: "Design Intitute",
    logoUrl: "/assets/journey/education/institution.svg",
    qualification: "UX/UI Diploma",
    duration: "Mar 2010-jun 2021",
    description: `Pursuing a Bachelor's degree in Computer Science with a focus on web development. 
    Gained hands-on experience in building responsive websites and web applications using HTML, CSS, 
    JavaScript, and React.js.`,
  },
  {
    type: "education",
    company: "Business School",
    logoUrl: "/assets/journey/education/institution.svg",
    qualification: "UX/UI Diploma",
    duration: "Mar 2010-jun 2021",
    description: `Pursuing a Bachelor's degree in Computer Science with a focus on web development. 
    Gained hands-on experience in building responsive websites and web applications using HTML, CSS, 
    JavaScript, and React.js.`,
  },
  //skills
  {
    type: "skill",
    company: "HTML",
    icon: <FaHtml5 />,
    duration: "Mar 2010-jun 2021",
    description: `Pursuing a Bachelor's degree in Computer Science with a focus on web development. 
    Gained hands-on experience in building responsive websites and web applications using HTML, CSS, 
    JavaScript, and React.js.`,
  },
  {
    type: "skill",
    company: "CSS",
    icon: <FaCss3Alt />,
    duration: "Mar 2010-jun 2021",
    description: `Pursuing a Bachelor's degree in Computer Science with a focus on web development. 
    Gained hands-on experience in building responsive websites and web applications using HTML, CSS, 
    JavaScript, and React.js.`,
  },
  {
    type: "skill",
    company: "JavaScript",
    icon: <FaJs />,
    duration: "Mar 2010-jun 2021",
    description: `Pursuing a Bachelor's degree in Computer Science with a focus on web development. 
    Gained hands-on experience in building responsive websites and web applications using HTML, CSS, 
    JavaScript, and React.js.`,
  },
  {
    type: "skill",
    company: "React.JS",
    icon: <FaReact />,
    duration: "Mar 2010-jun 2021",
    description: `Pursuing a Bachelor's degree in Computer Science with a focus on web development. 
    Gained hands-on experience in building responsive websites and web applications using HTML, CSS, 
    JavaScript, and React.js.`,
  },
  {
    type: "skill",
    company: "WordPress",
    icon: <FaWordpress />,
    duration: "Mar 2010-jun 2021",
    description: `Pursuing a Bachelor's degree in Computer Science with a focus on web development. 
    Gained hands-on experience in building responsive websites and web applications using HTML, CSS, 
    JavaScript, and React.js.`,
  },
  {
    type: "skill",
    company: "Figma",
    icon: <FaFigma />,
    duration: "Mar 2010-jun 2021",
    description: `Pursuing a Bachelor's degree in Computer Science with a focus on web development. 
    Gained hands-on experience in building responsive websites and web applications using HTML, CSS, 
    JavaScript, and React.js.`,
  },
];

const Cards = () => {
  return (
    <>
      <Tabs
        defaultValue="experience"
        className="w-full flex flex-col items-center"
      >
        <TabsList className="max-w-max mb-[30px]">
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skill">My Skills</TabsTrigger>
        </TabsList>
        <TabsContent value="experience" className="w-full">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              {Journey.filter((item) => item.type === "experience").map(
                (card, index) => {
                  return <Card key={index} {...card} />;
                }
              )}
            </motion.div>
          </AnimatePresence>
        </TabsContent>
        <TabsContent value="education" className="w-full">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              {Journey.filter((item) => item.type === "education").map(
                (card, index) => {
                  return <Card key={index} {...card} />;
                }
              )}
            </motion.div>
          </AnimatePresence>
        </TabsContent>
        <TabsContent value="skill" className="w-full">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              {Journey.filter((item) => item.type === "skill").map(
                (card, index) => {
                  return <Card key={index} {...card} />;
                }
              )}
            </motion.div>
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Cards;
