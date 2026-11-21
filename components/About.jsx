import Image from "next/image";
import { motion } from "framer-motion";
import AnimatedText from "./AnimatedText";
import { useLang } from "./LanguageProvider";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaUser } from "react-icons/fa"; // Import Icons

const About = () => {
  const { t, lang } = useLang();
  // ข้อมูลส่วนตัวแยกออกมาเพื่อให้แก้ได้ง่าย
  const info = [
    { icon: <FaUser />, field: t("about.field.name"), value: "Saranphat (Max)" },
    { icon: <FaMapMarkerAlt />, field: t("about.field.location"), value: t("about.locationValue") },
    { icon: <FaPhoneAlt />, field: t("about.field.phone"), value: "+66 61 446 1930" },
    {
      icon: <FaEnvelope />,
      field: t("about.field.email"),
      value: "saranphat.tre289@gmail.com",
    },
  ];

  // ดึง Skills เด่นๆ ออกมาจาก Text ของคุณเพื่อทำเป็น Tags
  const skills = [
    "Network Engineering",
    "AI & Computer Vision",
    "IoT (MQTT/HTTP)",
    "Hardware/Circuits",
    "Data Analysis",
    "Risk Assessment",
    "Next.js",
    "PostgreSQL",
    "Docker",
    "Kubernetes",
    "AWS",
    "CI/CD",
  ];

  return (
    <section className="relative pt-16 pb-32 overflow-hidden" id="About">
      <div className="container mx-auto h-full">
        <div className="flex flex-col xl:flex-row items-center justify-between gap-12 xl:gap-20">
          {/* --- Image Section --- */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 flex justify-center xl:justify-start relative"
          >
            {/* Background Decorative Shape */}
            <div className="absolute w-[300px] h-[300px] xl:w-[450px] xl:h-[450px] bg-[radial-gradient(circle,rgba(126,218,210,0.35)_0%,transparent_70%)] rounded-full -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>

            <div className="relative w-full max-w-[420px]">
              {/* Solid Shape Behind */}
              <div className="w-[90%] h-[90%] bg-accent absolute -left-4 -top-4 -z-10 rounded-tl-[20px] rounded-br-[20px]"></div>

              {/* Image Container */}
              <div className="rounded-tl-[20px] rounded-br-[20px] rounded-tr-[80px] rounded-bl-[80px] overflow-hidden bg-[#e5f8f6] shadow-2xl border-4 border-white aspect-[3/4]">
                <Image
                  src="/assets/about/dev3.png"
                  width={420}
                  height={560}
                  quality={85}
                  priority
                  alt="Max Saranphat"
                  className="object-cover object-center w-full h-full transform hover:scale-105 transition-transform duration-500"
                  placeholder="empty"
                />
              </div>
            </div>
          </motion.div>

          {/* --- Text Content Section --- */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex-1 flex flex-col items-center xl:items-start text-center xl:text-left"
          >
            {/* Header */}
            <div className="mb-6">
              <span className="text-accent font-semibold tracking-wider uppercase text-sm">
                {t("about.eyebrow")}
              </span>
              <AnimatedText
                text={t("about.name")}
                textStyles="h2 text-4xl font-bold mt-2 mb-2"
              />
              <p className="text-xl text-primary font-medium">
                {t("about.degree")}
              </p>
            </div>

            {/* Main Description */}
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8 max-w-[700px]">
              {lang === "th" ? (
                <>
                  ผมสนใจด้าน{" "}
                  <span className="text-accent font-semibold">Network Infrastructure</span>{" "}
                  และชอบความท้าทายในการดูแลเซิร์ฟเวอร์ สวิตช์ และเราเตอร์ นอกจากนี้ยังถนัดด้าน{" "}
                  <span className="text-accent font-semibold">AI & Computer Vision</span>{" "}
                  สำหรับงานด้านความปลอดภัย และ{" "}
                  <span className="text-accent font-semibold">IoT protocols</span>{" "}
                  (MQTT, HTTP, I2C) ผมชอบนำความรู้ด้านฮาร์ดแวร์มาผสานกับการวิเคราะห์ข้อมูล
                  เพื่อสร้างระบบอัจฉริยะที่ใช้งานได้จริงและแก้ปัญหาในชีวิตจริง
                </>
              ) : (
                <>
                  I am passionate about{" "}
                  <span className="text-accent font-semibold">Network Infrastructure</span>
                  , enjoying the challenge of managing servers, switches, and
                  routers. My expertise extends to{" "}
                  <span className="text-accent font-semibold">AI & Computer Vision</span>{" "}
                  for safety solutions and{" "}
                  <span className="text-accent font-semibold">IoT protocols</span>{" "}
                  (MQTT, HTTP, I2C). I love combining hardware knowledge with data
                  analysis to build practical, intelligent systems that solve
                  real-world problems.
                </>
              )}
            </p>

            {/* Skills Tags (Optional: ดีไซน์แบบป้ายกำกับ) */}
            <div className="flex flex-wrap justify-center xl:justify-start gap-3 mb-10">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm rounded-full font-medium border border-gray-200 dark:border-gray-700"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Contact Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {info.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 bg-accent/10 text-accent rounded-lg flex items-center justify-center text-lg">
                    {item.icon}
                  </div>
                  <div className="text-left">
                    <div className="text-xs uppercase font-bold text-gray-400 tracking-wide">
                      {item.field}
                    </div>
                    <div className="text-sm font-semibold text-gray-800 dark:text-white break-all">
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
