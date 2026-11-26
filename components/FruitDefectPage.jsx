"use client";

import Image from "next/image";
import { FiFilm, FiShare2, FiUser, FiGithub, FiMaximize2 } from "react-icons/fi";
import { ProjectTopBar, ProjectIntro, SectionHeading } from "@/components/ProjectDetail";
import { useLang } from "@/components/LanguageProvider";
import { liveProjects } from "@/data/liveProjects";

const project = liveProjects.find((item) => item.slug === "fruit-defect");
const ASSETS = "/assets/projects/fruit-defect";

const sectionNav = [
    { href: "#demo", label: { th: "เดโม", en: "Demo" }, icon: FiFilm },
    { href: "#architecture", label: { th: "สถาปัตยกรรม", en: "Architecture" }, icon: FiShare2 },
    { href: "#role", label: { th: "ส่วนที่ผมทำ", en: "My part" }, icon: FiUser },
];

// Screen recordings from the final demo. Plain <img> so the GIFs keep animating.
const clips = [
    {
        src: `${ASSETS}/cira-core-detect.gif`,
        title: { th: "CiRA CORE ตรวจผลไม้บนสายพาน", en: "CiRA CORE inspecting fruit on the belt" },
        caption: {
            th: "flow แบบ node: VideoFile → DeepDetect + Tracking → Python สร้าง JSON 1 event ต่อผลไม้ → MqttPub",
            en: "Node flow: VideoFile → DeepDetect + Tracking → Python builds one JSON event per fruit → MqttPub",
        },
    },
    {
        src: `${ASSETS}/dashboard-live.gif`,
        title: { th: "หน้า Live", en: "Live page" },
        caption: {
            th: "ยอดดี/เสีย defect rate และ live feed อัปเดตตามข้อมูลจริงใน DB ผลไม้เล่นซ้ำทีละลูกตามเวลาของ CORE",
            en: "Good / defect counts, defect rate and the live feed update from the DB; each fruit replays in CORE's own timing",
        },
    },
    {
        src: `${ASSETS}/dashboard-pages.gif`,
        title: { th: "Runs & Models · Alert", en: "Runs & Models · Alerts" },
        caption: {
            th: "รอบการทำงานตัดอัตโนมัติจากสถานะเครื่อง เทียบผลแยกตาม model_version และกฎแจ้งเตือน",
            en: "Runs are cut automatically from machine state, compared per model_version, next to the alert rules",
        },
    },
    {
        src: `${ASSETS}/ai-summary.gif`,
        title: { th: "AI สรุปด้วย Gemini", en: "AI summary with Gemini" },
        caption: {
            th: "สรุปสถานการณ์และคาดการณ์ 60 นาทีจากข้อมูลจริง พร้อมรายงานรายวัน",
            en: "A situation summary and 60-minute forecast from real data, plus the daily report",
        },
    },
    {
        src: `${ASSETS}/telegram-bot.gif`,
        title: { th: "Telegram bot", en: "Telegram bot" },
        caption: {
            th: "แจ้ง alert อัตโนมัติ และเมนูถามสถานะ ยอดวันนี้ ประวัติเครื่อง หรือให้ AI สรุป",
            en: "Pushes alerts on its own, with a menu for status, today's totals, machine history or an AI summary",
        },
        narrow: true,
    },
    {
        src: `${ASSETS}/failure-alert.gif`,
        title: { th: "ทดสอบระบบล่ม", en: "Failure test" },
        caption: {
            th: "หยุด container ใน Docker แล้วดูว่าเว็บและ Telegram แจ้งทันที และข้อมูลไม่หายเมื่อกลับมา",
            en: "Stop a Docker container and watch the web and Telegram flag it at once, with no data lost on recovery",
        },
    },
];

const flow = [
    { icon: "🎥", who: "CiRA CORE", text: { th: "ตรวจผลไม้ นับเมื่อข้ามเส้น ส่ง event + heartbeat", en: "Inspects fruit, counts it at the line, sends events + heartbeats" } },
    { icon: "📡", who: "Mosquitto", text: { th: "MQTT broker รับ cira/fruit/events และ status", en: "MQTT broker for cira/fruit/events and status" } },
    { icon: "🧹", who: "mqtt_to_db.py", text: { th: "ตรวจ payload กันซ้ำ batch insert ack หลัง commit", en: "Validates, de-duplicates, batch-inserts, acks after commit" } },
    { icon: "🗄️", who: "PostgreSQL", text: { th: "เก็บ event สถานะเครื่อง รอบการทำงาน และ alert", en: "Stores events, machine state, runs and alerts" } },
    { icon: "📊", who: { th: "Dashboard + Telegram", en: "Dashboard + Telegram" }, text: { th: "เว็บอ่านจาก DB อย่างเดียว ส่วน watcher แจ้งเตือน", en: "The web only reads the DB; a watcher sends alerts" } },
];

const myPart = [
    { th: "ออกแบบ JSON event กลาง และ schema PostgreSQL (เปลี่ยนด้วย migration แบบ idempotent)", en: "Designed the shared JSON event and the PostgreSQL schema (changed only through idempotent migrations)" },
    { th: "เขียน adapter MQTT → DB: ตรวจ payload, กันนับผลไม้ซ้ำด้วย run + track_id, ลงทะเบียนโมเดลใหม่ให้อัตโนมัติ", en: "Wrote the MQTT → DB adapter: payload checks, de-duplication by run + track_id, auto-registering new models" },
    { th: "ทำเว็บ Next.js ทั้ง 7 หน้า พร้อม login แบบ admin / viewer และฉาก Live แบบ 2D / 3D (three.js)", en: "Built all 7 Next.js pages with admin / viewer login and a 2D / 3D (three.js) Live scene" },
    { th: "ทำ alert watcher, รายงานรายวัน และ Telegram bot ที่ใช้ Gemini", en: "Built the alert watcher, daily report and a Telegram bot backed by Gemini" },
    { th: "ตัวจำลอง CiRA CORE (mqtt_sim.py) ให้พัฒนาได้ก่อนโมเดลจริงพร้อม และสคริปต์ทดสอบระบบล่ม", en: "A CiRA CORE simulator (mqtt_sim.py) so the web could be built before the model was ready, plus failure-test scripts" },
    { th: "รันทั้งระบบด้วย Docker Compose คำสั่งเดียว", en: "The whole stack runs with one Docker Compose command" },
];

function GitHubButton() {
    return (
        <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity sm:text-sm"
        >
            <FiGithub className="h-4 w-4" /> GitHub
        </a>
    );
}

export default function FruitDefectPage() {
    const { tx } = useLang();
    return (
        <main className="min-h-screen bg-[#f7f8fa] pb-24">
            <ProjectTopBar nav={sectionNav} action={<GitHubButton />} />
            <ProjectIntro
                project={project}
                note={{
                    th: "งานรายวิชา CPE447 ทีม 4 คน: A Data · B Training · C Real-time · D Platform & Dashboard (ผม) ภาพในหน้านี้อัดจากระบบจริงตอนเดโม",
                    en: "CPE447 course project, team of 4: A Data · B Training · C Real-time · D Platform & Dashboard (me). Recordings on this page are from the real system during the demo.",
                }}
            />

            <section id="demo" className="container mx-auto scroll-mt-20 pt-16">
                <SectionHeading
                    eyebrow={{ th: "01 · เดโม", en: "01 · Demo" }}
                    title={{ th: "ระบบทำงานจริง", en: "The system running" }}
                    text={{ th: "จากกล้องใน CiRA CORE ไปถึงเว็บและ Telegram ภายใน 1–3 วินาที", en: "From the camera in CiRA CORE to the web and Telegram within 1–3 seconds" }}
                    action={
                        <a
                            href={project.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-[#a855f7] to-[#ec4899] px-4 py-2 text-sm font-semibold text-white shadow-md hover:opacity-90 transition-opacity"
                        >
                            <FiGithub /> {tx({ th: "ดูโค้ดบน GitHub ↗", en: "View the code on GitHub ↗" })}
                        </a>
                    }
                />
                <div className="grid gap-10 md:grid-cols-2">
                    {clips.map((clip) => (
                        <figure key={clip.src} className="flex flex-col gap-3">
                            <a
                                href={clip.src}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`group relative block overflow-hidden rounded-xl border border-gray-200 bg-[#0b0a12] shadow-[0_18px_50px_-24px_rgba(16,21,31,0.35)] ${clip.narrow ? "aspect-[16/9]" : ""}`}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={clip.src}
                                    alt={tx(clip.title)}
                                    loading="lazy"
                                    className={clip.narrow ? "mx-auto block h-full w-auto" : "block h-auto w-full"}
                                />
                                <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                                    <FiMaximize2 className="h-4 w-4" />
                                </span>
                            </a>
                            <figcaption className="flex flex-col gap-1">
                                <span className="text-base font-bold text-primary">{tx(clip.title)}</span>
                                <span className="text-sm leading-6 text-gray-500">{tx(clip.caption)}</span>
                            </figcaption>
                        </figure>
                    ))}
                </div>

                <figure className="mt-12 flex flex-col gap-3">
                    <a
                        href={`${ASSETS}/live-3d.jpg`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_18px_50px_-24px_rgba(16,21,31,0.35)]"
                    >
                        <Image
                            src={`${ASSETS}/live-3d.jpg`}
                            alt={tx({ th: "ฉาก Live แบบ 3D", en: "3D Live scene" })}
                            width={1600}
                            height={840}
                            sizes="(max-width: 1200px) 100vw, 1170px"
                            className="block h-auto w-full"
                        />
                    </a>
                    <figcaption className="flex flex-col gap-1">
                        <span className="text-base font-bold text-primary">{tx({ th: "ฉาก Live แบบ 3D", en: "3D Live scene" })}</span>
                        <span className="text-sm leading-6 text-gray-500">
                            {tx({
                                th: "สายพานและตะกร้าดี/เสียสร้างด้วย three.js ตัวเลขบนจอมาจาก DB ภาพนี้คือตอนเครื่องหยุด (ไม่มี heartbeat)",
                                en: "Belt and good / defect bins built with three.js; the numbers come from the DB. Captured while the machine was stopped (no heartbeat).",
                            })}
                        </span>
                    </figcaption>
                </figure>
            </section>

            <section id="architecture" className="container mx-auto scroll-mt-20 pt-20">
                <SectionHeading
                    eyebrow={{ th: "02 · สถาปัตยกรรม", en: "02 · Architecture" }}
                    title={{ th: "ข้อมูลผลไม้หนึ่งลูกวิ่งผ่านอะไรบ้าง", en: "What one fruit's data passes through" }}
                    text={{
                        th: "CiRA CORE คุม Start/Stop โมเดล และ threshold เอง เว็บจึงรับข้อมูลและดักสถานะผ่าน MQTT เท่านั้น",
                        en: "CiRA CORE owns Start/Stop, the model and thresholds, so the web only receives data and watches status over MQTT",
                    }}
                />
                <a
                    href={`${ASSETS}/system-diagram.jpg`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_18px_50px_-24px_rgba(16,21,31,0.35)]"
                >
                    <Image
                        src={`${ASSETS}/system-diagram.jpg`}
                        alt={tx({ th: "แผนภาพระบบ CIRA CORE Fruit Defect Sorter", en: "CIRA CORE Fruit Defect Sorter system diagram" })}
                        width={1672}
                        height={941}
                        sizes="(max-width: 1200px) 100vw, 1170px"
                        className="block h-auto w-full"
                    />
                </a>
                <ol className="mt-8 grid gap-3 md:grid-cols-5">
                    {flow.map((step, i) => (
                        <li key={i} className="flex flex-col gap-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                            <span className="flex items-center gap-2">
                                <span className="text-2xl">{step.icon}</span>
                                <span className="rounded-md bg-primary px-2 py-0.5 font-mono text-xs font-bold text-white">{i + 1}</span>
                            </span>
                            <b className="text-sm text-primary">{tx(step.who)}</b>
                            <span className="text-sm leading-6 text-gray-500">{tx(step.text)}</span>
                        </li>
                    ))}
                </ol>
            </section>

            <section id="role" className="container mx-auto scroll-mt-20 pt-20">
                <SectionHeading
                    eyebrow={{ th: "03 · ส่วนที่ผมทำ", en: "03 · My part" }}
                    title="Platform & Dashboard"
                    text={{ th: "ทุกอย่างหลัง CiRA CORE ตั้งแต่ MQTT จนถึงหน้าจอและ Telegram", en: "Everything after CiRA CORE, from MQTT to the screen and Telegram" }}
                />
                <ul className="grid gap-3 md:grid-cols-2">
                    {myPart.map((item) => (
                        <li key={item.en} className="flex gap-3 rounded-2xl border border-gray-200 bg-white p-4 text-sm leading-6 text-gray-600 shadow-sm">
                            <span className="text-[#a855f7]">▸</span>
                            <span>{tx(item)}</span>
                        </li>
                    ))}
                </ul>
                <div className="mt-16 flex flex-wrap items-center justify-center gap-3">
                    <a
                        href="/#Live"
                        className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:border-primary hover:text-primary transition-colors"
                    >
                        ← {tx({ th: "กลับ Portfolio", en: "Back to portfolio" })}
                    </a>
                    <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#a855f7] to-[#ec4899] px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-90 transition-opacity"
                    >
                        <FiGithub /> {tx({ th: "ดูโค้ดบน GitHub ↗", en: "View the code on GitHub ↗" })}
                    </a>
                </div>
            </section>
        </main>
    );
}
