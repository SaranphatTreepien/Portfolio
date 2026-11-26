"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { scroller } from "react-scroll";
import { FiArrowRight, FiCheck, FiCopy, FiFileText, FiMail, FiMapPin, FiPhone, FiX } from "react-icons/fi";
import { useLang } from "./LanguageProvider";

// Anything on the page can open the About window: openAbout()
const OPEN_EVENT = "open-about";
export const openAbout = () => window.dispatchEvent(new Event(OPEN_EVENT));

const EMAIL = "saranphat.tre289@gmail.com";
const PHONE = "+66 61 446 1930";

const BIO = {
    en: [
        <>I&apos;m Max, a computer engineering student in Bangkok who builds <b>software for the cloud and AI</b>.</>,
        <>Right now I build <b>AI agents</b> as a freelancer for AAppoint, with LangChain, Gemini, Redis and PostgreSQL. For my co-op I built an <b>AI governance gateway</b> that masks personal data before it reaches the model.</>,
        <>I started out in networking and IoT hardware, so I care about what runs under the app: servers, networks and the devices at the edge. These days most of my learning goes into Google Cloud.</>,
    ],
    th: [
        <>ผมชื่อแม็กซ์ นักศึกษาวิศวกรรมคอมพิวเตอร์ในกรุงเทพฯ ที่ชอบสร้าง<b>ซอฟต์แวร์บนคลาวด์และระบบ AI</b></>,
        <>ตอนนี้รับงานฟรีแลนซ์พัฒนา <b>AI agent</b> ให้ AAppoint ด้วย LangChain, Gemini, Redis และ PostgreSQL ส่วนงานสหกิจ ผมสร้าง <b>AI governance gateway</b> ที่ปกปิดข้อมูลส่วนบุคคลก่อนส่งให้โมเดล</>,
        <>ผมเริ่มจากสายเครือข่ายและฮาร์ดแวร์ IoT เลยสนใจสิ่งที่อยู่ใต้แอปด้วย ทั้งเซิร์ฟเวอร์ เครือข่าย และอุปกรณ์ปลายทาง ช่วงนี้กำลังเรียนรู้ Google Cloud เป็นหลัก</>,
    ],
};

const NOW = [
    { tag: { th: "ฟรีแลนซ์", en: "Freelance" }, text: { th: "AI agent / backend · AAppoint", en: "AI agent / backend · AAppoint" }, live: true },
    { tag: { th: "สหกิจ", en: "Co-op" }, text: { th: "AI Governance Gateway", en: "AI Governance Gateway" } },
    { tag: { th: "เรียน", en: "Study" }, text: { th: "วศ.บ. วิศวกรรมคอมพิวเตอร์ · ม.ศรีปทุม", en: "B.Eng. Computer Engineering · Sripatum University" } },
];

const STACK = [
    { group: { th: "สร้างแอป", en: "Build" }, items: ["Next.js", "React", "FastAPI", "Python", "Tailwind"] },
    { group: "AI", items: ["LangChain", "Gemini", "LiteLLM", "Presidio"] },
    { group: { th: "ข้อมูล", en: "Data" }, items: ["PostgreSQL", "Redis", "MongoDB", "Supabase"] },
    { group: { th: "คลาวด์", en: "Cloud & ops" }, items: ["Google Cloud", "AWS", "Docker", "Kubernetes", "CI/CD"] },
    { group: { th: "เครือข่าย & IoT", en: "Network & IoT" }, items: ["Cisco", "TCP/IP", "MQTT", "ESP32"] },
];

function CopyEmail() {
    const { t } = useLang();
    const [copied, setCopied] = useState(false);
    const copy = async () => {
        try {
            await navigator.clipboard.writeText(EMAIL);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
        } catch {
            /* clipboard blocked: the mailto link still works */
        }
    };
    return (
        <button
            type="button"
            onClick={copy}
            aria-label={t("about.copy")}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-brand-50 hover:text-brand-700"
        >
            {copied ? <FiCheck className="text-brand-600" /> : <FiCopy className="h-3.5 w-3.5" />}
        </button>
    );
}

export default function AboutModal() {
    const { t, tx, lang } = useLang();
    const [open, setOpen] = useState(false);
    const closeRef = useRef(null);

    useEffect(() => {
        const onOpen = () => setOpen(true);
        window.addEventListener(OPEN_EVENT, onOpen);
        return () => window.removeEventListener(OPEN_EVENT, onOpen);
    }, []);

    // Esc closes; the page behind stops scrolling while open
    useEffect(() => {
        if (!open) return;
        const onKeyDown = (e) => e.key === "Escape" && setOpen(false);
        document.addEventListener("keydown", onKeyDown);
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeRef.current?.focus();
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = previous;
        };
    }, [open]);

    const goToContact = () => {
        setOpen(false);
        setTimeout(() => scroller.scrollTo("Contact", { smooth: true, duration: 600, offset: -40 }), 150);
    };

    const bio = BIO[lang] ?? BIO.en;

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[9999] flex items-end justify-center bg-brand-900/40 backdrop-blur-[6px] sm:items-center sm:p-6"
                    onClick={() => setOpen(false)}
                >
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="about-title"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 16 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative max-h-[94vh] w-full max-w-[980px] overflow-y-auto overscroll-contain rounded-t-2xl bg-white px-6 pb-7 pt-6 shadow-[0_30px_80px_-30px_rgba(23,74,71,0.5)] sm:rounded-2xl sm:px-9 sm:pb-8 sm:pt-8"
                    >
                        {/* Header: small photo, name, close */}
                        <div className="flex items-center gap-4 border-b border-gray-200 pb-5">
                            <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-[linear-gradient(165deg,#9be3dc,#26a99e)]">
                                <Image src="/assets/about/dev3.png" alt="Saranphat (Max) Treepian" fill sizes="64px" className="object-cover object-top" />
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="eyebrow">{t("about.eyebrow")}</p>
                                <h2 id="about-title" className="mt-1 text-[24px] font-semibold leading-tight tracking-[-0.02em] text-primary sm:text-[26px]">
                                    {t("about.name")}
                                </h2>
                                <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-[13px] text-gray-500">
                                    Saranphat Treepian <span className="text-gray-300">·</span> <FiMapPin className="text-brand-600" /> {t("menu.locationValue")}
                                </p>
                            </div>
                            <button
                                ref={closeRef}
                                type="button"
                                onClick={() => setOpen(false)}
                                aria-label={t("hero.close")}
                                className="flex h-9 w-9 shrink-0 items-center justify-center self-start rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-primary"
                            >
                                <FiX className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mt-6 grid gap-8 md:grid-cols-[1.1fr_1fr] md:gap-10">
                            {/* Left: who I am and what I do now */}
                            <div>
                                <div className="space-y-2.5 text-[14.5px] leading-[1.65] text-gray-600 [&_b]:font-semibold [&_b]:text-brand-700">
                                    {bio.map((paragraph, i) => (
                                        <p key={i}>{paragraph}</p>
                                    ))}
                                </div>

                                <h3 className="mt-6 text-[12px] font-semibold uppercase tracking-[0.14em] text-gray-400">{t("about.now")}</h3>
                                <ul className="mt-2 divide-y divide-gray-100 border-y border-gray-200">
                                    {NOW.map((item) => (
                                        <li key={item.tag.en} className="flex items-baseline gap-3 py-2.5">
                                            <span className="inline-flex w-[76px] shrink-0 items-center gap-1.5 text-[12px] font-semibold text-brand-700">
                                                {item.live && (
                                                    <span className="relative flex h-1.5 w-1.5 self-center">
                                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-70 motion-reduce:hidden" />
                                                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-500" />
                                                    </span>
                                                )}
                                                {tx(item.tag)}
                                            </span>
                                            <span className="min-w-0 text-[14px] font-medium text-primary">{tx(item.text)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Right: tools, contact, actions */}
                            <div>
                                <h3 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-gray-400">{t("about.stack")}</h3>
                                <dl className="mt-3 space-y-2">
                                    {STACK.map((row) => (
                                        <div key={typeof row.group === "string" ? row.group : row.group.en} className="grid grid-cols-[92px_1fr] items-baseline gap-2">
                                            <dt className="text-[13px] text-gray-500">{tx(row.group)}</dt>
                                            <dd className="flex flex-wrap gap-1">
                                                {row.items.map((item) => (
                                                    <span key={item} className="rounded bg-brand-50 px-2 py-0.5 text-[12px] font-medium text-brand-800">
                                                        {item}
                                                    </span>
                                                ))}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>

                                <ul className="mt-6 divide-y divide-gray-100 border-y border-gray-200 text-[14px]">
                                    <li className="flex items-center gap-3 py-1.5">
                                        <FiMail className="shrink-0 text-brand-600" aria-label={t("about.field.email")} />
                                        <a href={`mailto:${EMAIL}`} className="min-w-0 flex-1 truncate font-medium text-primary hover:text-brand-700">
                                            {EMAIL}
                                        </a>
                                        <CopyEmail />
                                    </li>
                                    <li className="flex items-center gap-3 py-2.5">
                                        <FiPhone className="shrink-0 text-brand-600" aria-label={t("about.field.phone")} />
                                        <a href={`tel:${PHONE.replace(/\s/g, "")}`} className="font-medium text-primary hover:text-brand-700">
                                            {PHONE}
                                        </a>
                                    </li>
                                </ul>

                                <div className="mt-5 flex flex-wrap gap-2.5">
                                    <button
                                        type="button"
                                        onClick={goToContact}
                                        className="group inline-flex h-10 items-center gap-2 rounded-lg bg-brand-600 px-4 text-[14px] font-semibold text-white transition-colors hover:bg-brand-700"
                                    >
                                        {t("about.contact")}
                                        <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
                                    </button>
                                    <Link
                                        href="/cv"
                                        className="inline-flex h-10 items-center gap-2 rounded-lg border border-gray-300 px-4 text-[14px] font-medium text-primary transition-colors hover:border-brand-500 hover:text-brand-700"
                                    >
                                        <FiFileText /> CV
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
