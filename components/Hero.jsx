"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiFileText } from "react-icons/fi";
import { SiCredly } from "react-icons/si";

import { IconGoogle } from "./icons";
import { useLang } from "./LanguageProvider";
import HeroPhoto from "./site/HeroPhoto";
import { googleSkillsProfile, credlyProfileUrl } from "@/data/credentials";

// Opening of the home page: a hello, a short timeline in plain sentences, and a photo with a note.

const rise = {
    initial: { opacity: 0, y: 14 },
    animate: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: 0.06 * i, ease: [0.22, 1, 0.36, 1] } }),
};

// Newest last, like reading a diary. Thai shows Buddhist-era years. `link` turns the lead words into a link.
const TIMELINE = [
    {
        years: { th: "2566–ปัจจุบัน", en: "2023–now" },
        lead: { th: "วิศวกรรมคอมพิวเตอร์", en: "Computer Engineering" },
        text: { th: " มหาวิทยาลัยศรีปทุม เก็บ badge ด้าน cloud และ network ไปพร้อมกับเรียน", en: " at Sripatum University, collecting cloud and network badges along the way." },
        link: "/#Journey",
    },
    {
        years: { th: "2567–2568", en: "2024–2025" },
        lead: { th: "IoT ตู้น้ำหยอดเหรียญ", en: "IoT for water vending" },
        text: { th: " ดูแลระบบของตู้ที่ใช้งานจริงกว่า 70 ตู้", en: ": kept the systems of 70+ commercial machines running." },
    },
    {
        years: { th: "2569", en: "2026" },
        lead: { th: "AI agent (ฟรีแลนซ์)", en: "AI agents (freelance)" },
        text: {
            th: " ที่ AAppoint (พ.ค.–พ.ย.) สร้าง agent ด้วย LangChain และ Gemini สำหรับจองร้านอาหารและช่วยร้านจัดการการจอง บน LINE OA ตั้งแต่จองจนจ่ายเงิน",
            en: " at AAppoint (May–Nov): built LangChain + Gemini agents that booked restaurant tables and helped shops manage them on LINE OA, from booking through payment.",
        },
        link: "/projects/travel-plan-booking",
    },
    {
        years: { th: "2569–ปัจจุบัน", en: "2026–now" },
        lead: { th: "AI Engineer (สหกิจ)", en: "AI engineer (co-op)" },
        text: { th: " ที่ Lightster สร้าง AI Governance Gateway ที่ปิดข้อมูลส่วนตัวก่อนส่งให้ LLM", en: " at Lightster: building an AI Governance Gateway that masks personal data before it reaches an LLM." },
        link: "/projects/ai-governance",
    },
];

const PROFILES = [
    { label: "Credly", href: credlyProfileUrl, Icon: SiCredly, color: "text-[#ff6b00]" },
    { label: "Google Skills", href: googleSkillsProfile.url, Icon: IconGoogle },
];

const Hero = () => {
    const { t, tx, lang } = useLang();

    return (
        // overflow-x-clip: the spinning orbit's box grows past the edge on narrow phones
        <section id="Home" className="container mx-auto overflow-x-clip pb-16 pt-10 sm:pt-14 lg:pb-20 lg:pt-16">
            {/* Narrower than xl the photo comes first, above the hello */}
            <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-14">
                {/* --- Words --- */}
                <div className="min-w-0 max-w-[640px]">
                    <motion.h1
                        variants={rise}
                        initial="initial"
                        animate="animate"
                        className="text-[40px] font-semibold leading-[1.05] tracking-[-0.035em] text-primary sm:text-[52px]"
                    >
                        {lang === "th" ? "สวัสดีครับ ผมแม็กซ์!" : "Hey, I'm Max!"}
                    </motion.h1>
                    <motion.p variants={rise} initial="initial" animate="animate" custom={1} className="mt-3 text-[18px] text-gray-600 sm:text-[20px]">
                        {/* Full name right under the nickname: the line people quote and search for */}
                        <span className="font-semibold text-primary">Saranphat Treepian</span>
                        <span aria-hidden="true" className="mx-2 text-gray-400">·</span>
                        {tx({ th: "วิศวกรคอมพิวเตอร์ สาย cloud, network และระบบ AI", en: "Computer engineer, cloud & network tinkerer, AI systems builder." })}
                    </motion.p>

                    <motion.h2 variants={rise} initial="initial" animate="animate" custom={2} className="mt-10 text-[17px] font-semibold text-primary">
                        {tx({ th: "ไทม์ไลน์ฉบับย่อ", en: "A brief timeline" })}
                    </motion.h2>
                    <ol className="mt-4 flex flex-col gap-4">
                        {TIMELINE.map((row, i) => (
                            <motion.li
                                key={row.lead.en}
                                variants={rise}
                                initial="initial"
                                animate="animate"
                                custom={3 + i}
                                className="grid grid-cols-[92px_1fr] gap-4 text-[16px] leading-[1.6] text-gray-700 sm:grid-cols-[108px_1fr]"
                            >
                                <span className="pt-[3px] font-mono text-[13px] tabular-nums text-gray-500">{tx(row.years)}</span>
                                <span>
                                    {row.link ? (
                                        <Link href={row.link} className="ink-link">
                                            {tx(row.lead)}
                                        </Link>
                                    ) : (
                                        <span className="font-semibold text-primary">{tx(row.lead)}</span>
                                    )}
                                    {tx(row.text)}
                                </span>
                            </motion.li>
                        ))}
                    </ol>

                    <motion.p variants={rise} initial="initial" animate="animate" custom={8} className="mt-7 text-[16px] leading-[1.6] text-gray-700">
                        <Link href="/#Experience" className="ink-link">
                            {tx({ th: "นอกจากนี้", en: "Also" })}
                        </Link>
                        {tx({
                            th: ": นักสะสม badge สาย cloud, ขาประจำงาน tech event ในกรุงเทพฯ และเป็นคนที่ชอบอ่าน log จนจบ",
                            en: ": cloud badge collector, regular at Bangkok tech events, and the person who actually reads the whole log file.",
                        })}
                    </motion.p>

                    <motion.div variants={rise} initial="initial" animate="animate" custom={9} className="mt-9 flex flex-wrap items-center gap-3">
                        <Link
                            href="/#Live"
                            className="group inline-flex h-11 items-center gap-2 rounded-full bg-brand-700 px-5 text-[15px] font-semibold text-white transition-colors hover:bg-brand-800"
                        >
                            {t("hero.viewWork")}
                            <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
                        </Link>
                        <Link
                            href="/cv"
                            className="inline-flex h-11 items-center gap-2 rounded-full border border-gray-900/10 bg-white/70 px-5 text-[15px] font-medium text-primary transition-colors hover:border-gray-900/25 hover:bg-white"
                        >
                            <FiFileText className="text-gray-500" /> CV
                        </Link>
                        <span className="mx-1 hidden h-5 w-px bg-gray-900/10 sm:block" />
                        {PROFILES.map(({ label, href, Icon, color = "" }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-9 items-center gap-1.5 rounded-full px-2 text-[14px] text-gray-600 transition-colors hover:text-primary"
                            >
                                <Icon className={`h-4 w-4 ${color}`} />
                                {label}
                            </a>
                        ))}
                    </motion.div>
                </div>

                {/* --- Photo with a note --- */}
                <motion.figure
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="order-first mx-auto flex w-full max-w-[300px] flex-col items-center pt-6 xl:order-none xl:mx-0 xl:pt-16"
                >
                    <HeroPhoto />
                </motion.figure>
            </div>
        </section>
    );
};

export default Hero;
