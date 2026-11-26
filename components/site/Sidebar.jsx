"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { FiMail, FiMenu, FiX } from "react-icons/fi";
import { SiCredly } from "react-icons/si";

import { IconGitHub, IconLinkedIn } from "../icons";
import { useLang } from "../LanguageProvider";
import ThemeToggle from "./ThemeToggle";
import AccentPicker from "./AccentPicker";
import DayAvatar from "./DayAvatar";
import { credlyProfileUrl, googleSkillsProfile } from "@/data/credentials";

// A quiet notebook-style column: name, a line about me, the menu, and profile links at the foot.
// Desktop: sticky beside the page. Phones: a slim bar with a drop-down sheet.

const LINKS = [
    { id: "Home", href: "/", icon: "🏠", label: { th: "หน้าแรก", en: "Home" } },
    { id: "Live", href: "/#Live", icon: "🧰", label: { th: "ผลงาน", en: "Work" } },
    { id: "Experience", href: "/#Experience", icon: "🗺️", label: { th: "ประสบการณ์", en: "Experience" } },
    { id: "Journey", href: "/#Journey", icon: "🧭", label: { th: "เส้นทาง", en: "Journey" } },
    { id: "projects", href: "/projects", icon: "📂", label: { th: "โปรเจกต์ทั้งหมด", en: "Projects" } },
    { id: "cv", href: "/cv", icon: "📄", label: { th: "CV", en: "CV" } },
    { id: "Contact", href: "/#Contact", icon: "💌", label: { th: "ติดต่อ", en: "Contact" } },
];
const HOME_SECTIONS = ["Home", "Live", "Experience", "Journey", "Contact"];

// Each in its own brand colour (GitHub's mark is black or white, so it follows the text colour)
const SOCIALS = [
    { label: "Email", href: "mailto:saranphat.tre289@gmail.com", Icon: FiMail, color: "text-[#ea4335]" },
    { label: "GitHub", href: "https://github.com/SaranphatTreepien", Icon: IconGitHub, color: "text-primary" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/saranphat-treepien-4284402b2", Icon: IconLinkedIn, color: "text-[#0a66c2] dark:text-[#3b8fe0]" },
    { label: "Credly", href: credlyProfileUrl, Icon: SiCredly, color: "text-[#ff6b00]" },
];

// Which home section is on screen: the last one whose top has passed the upper third
function useHomeSection(enabled) {
    const [active, setActive] = useState("Home");
    useEffect(() => {
        if (!enabled) return;
        let frame = 0;
        const update = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                const line = window.innerHeight * 0.35;
                let current = "Home";
                for (const id of HOME_SECTIONS) {
                    const el = document.getElementById(id);
                    if (el && el.getBoundingClientRect().top <= line) current = id;
                }
                setActive(current);
            });
        };
        update();
        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
        };
    }, [enabled]);
    return active;
}

function useActiveId() {
    const pathname = usePathname();
    const onHome = pathname === "/";
    const section = useHomeSection(onHome);
    if (onHome) return section;
    if (pathname.startsWith("/work")) return "Experience";
    if (pathname.startsWith("/projects")) return "projects";
    if (pathname.startsWith("/cv")) return "cv";
    return null;
}

function NavList({ onNavigate }) {
    const { tx } = useLang();
    const activeId = useActiveId();
    return (
        <ul className="flex flex-col gap-0.5">
            {LINKS.map(({ id, href, icon, label }) => {
                const active = activeId === id;
                return (
                    <li key={id}>
                        <Link
                            href={href}
                            onClick={onNavigate}
                            aria-current={active ? "page" : undefined}
                            className={`group flex items-center gap-3 rounded-md px-2 py-[7px] text-[16px] transition-colors ${
                                active ? "bg-gray-100 font-medium text-primary" : "text-gray-700 hover:bg-gray-100/60 hover:text-primary"
                            }`}
                        >
                            <span aria-hidden="true" className="w-6 text-center text-[18px] leading-none transition-transform duration-200 group-hover:-rotate-6">
                                {icon}
                            </span>
                            {tx(label)}
                            {active && <span aria-hidden="true" className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-400" />}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
}

function Intro() {
    const { lang } = useLang();
    return lang === "th" ? (
        <p className="text-[15px] leading-[1.65] text-gray-700">
            ผม
            <Link href="/#Journey" className="ink-link">
                แม็กซ์
            </Link>{" "}
            วิศวกรคอมพิวเตอร์สาย cloud และ network ที่นี่คือท่าเรือเล็ก ๆ ที่เก็บงานของผมไว้ ⚓
        </p>
    ) : (
        <p className="text-[15px] leading-[1.65] text-gray-700">
            I&apos;m{" "}
            <Link href="/#Journey" className="ink-link">
                Max
            </Link>
            , computer engineer and cloud &amp; network tinkerer. This is my little harbor. ⚓
        </p>
    );
}

function Socials() {
    return (
        <ul className="flex items-center gap-1">
            {SOCIALS.map(({ label, href, Icon, color }) => (
                <li key={label}>
                    <a
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        aria-label={label}
                        title={label}
                        className={`flex h-8 w-8 items-center justify-center rounded-md transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-gray-100 ${color}`}
                    >
                        <Icon className="h-[18px] w-[18px]" />
                    </a>
                </li>
            ))}
        </ul>
    );
}

function FootLinks() {
    const { tx } = useLang();
    const items = [
        { label: "CV", href: "/cv" },
        { label: tx({ th: "โปรเจกต์", en: "Projects" }), href: "/projects" },
        { label: "Skills", href: googleSkillsProfile.url, external: true },
    ];
    return (
        <p className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] text-gray-500">
            {items.map((item, i) => (
                <span key={item.href} className="inline-flex items-center gap-2.5">
                    {i > 0 && <span aria-hidden="true" className="text-gray-300">|</span>}
                    {item.external ? (
                        <a href={item.href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-primary">
                            {item.label}
                        </a>
                    ) : (
                        <Link href={item.href} className="transition-colors hover:text-primary">
                            {item.label}
                        </Link>
                    )}
                </span>
            ))}
        </p>
    );
}

const Brand = ({ onNavigate }) => (
    <Link href="/" onClick={onNavigate} className="group flex min-w-0 items-center gap-2.5" aria-label="Saranphat Treepian, home">
        <DayAvatar className="h-8 w-8 rounded-[9px] transition-transform duration-300 group-hover:-rotate-6" />
        <span className="truncate font-mono text-[16px] font-bold tracking-tight text-primary">saranphat</span>
    </Link>
);

// One small button that offers the other language, so the brand keeps its room
function LangSwitch() {
    const { lang, setLang } = useLang();
    const next = lang === "th" ? "en" : "th";
    return (
        <button
            type="button"
            onClick={() => setLang(next)}
            aria-label={next === "th" ? "เปลี่ยนเป็นภาษาไทย" : "Switch to English"}
            title={next === "th" ? "ภาษาไทย" : "English"}
            className="flex h-8 min-w-8 items-center justify-center rounded-md px-1.5 font-mono text-[12px] font-bold text-gray-600 transition-colors hover:bg-gray-100 hover:text-brand-600"
        >
            {next.toUpperCase()}
        </button>
    );
}

const Rule = () => <div className="border-t border-gray-200" />;

// Desktop column; sits in the layout's flex row so it scrolls with nothing and the line runs full height
export function DesktopSidebar() {
    const { tx } = useLang();
    return (
        <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 flex-col border-r border-gray-200 px-6 lg:flex">
            <div className="flex items-center justify-between gap-2 py-5">
                <Brand />
                <span className="flex shrink-0 items-center gap-0.5">
                    <AccentPicker />
                    <ThemeToggle />
                </span>
            </div>
            <Rule />
            <div className="py-5">
                <Intro />
            </div>
            <Rule />
            <nav aria-label={tx({ th: "เมนูหลัก", en: "Main" })} className="-mx-2 flex-1 overflow-y-auto py-5">
                <NavList />
            </nav>
            <div className="pb-7 pt-4">
                <div className="flex items-center justify-between">
                    <Socials />
                    <LangSwitch />
                </div>
                <FootLinks />
            </div>
        </aside>
    );
}

// Phones and tablets: a bar at the top, the same content in a drop-down sheet
export function MobileBar() {
    const [open, setOpen] = useState(false);
    const { tx } = useLang();
    const pathname = usePathname();

    useEffect(() => setOpen(false), [pathname]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    return (
        <>
            <header className="bar sticky top-0 z-40 flex h-14 items-center justify-between gap-3 border-b border-gray-200 px-4 lg:hidden">
                <Brand />
                <div className="flex items-center gap-1.5">
                    <LangSwitch />
                    <AccentPicker align="right" />
                    <ThemeToggle />
                    <button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        aria-expanded={open}
                        aria-label={open ? tx({ th: "ปิดเมนู", en: "Close menu" }) : tx({ th: "เปิดเมนู", en: "Open menu" })}
                        className="flex h-9 w-9 items-center justify-center rounded-md text-primary transition-colors hover:bg-gray-100"
                    >
                        {open ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
                    </button>
                </div>
            </header>

            <AnimatePresence>
                {open && (
                    <>
                        <motion.div
                            key="scrim"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpen(false)}
                            className="fixed inset-0 top-14 z-30 bg-black/30 lg:hidden"
                        />
                        <motion.div
                            key="sheet"
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="fixed inset-x-3 top-[64px] z-40 max-h-[calc(100dvh-80px)] overflow-y-auto rounded-xl border border-gray-200 bg-white p-5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)] lg:hidden"
                        >
                            <Intro />
                            <div className="my-4">
                                <Rule />
                            </div>
                            <nav aria-label={tx({ th: "เมนูหลัก", en: "Main" })} className="-mx-2">
                                <NavList onNavigate={() => setOpen(false)} />
                            </nav>
                            <div className="my-4">
                                <Rule />
                            </div>
                            <Socials />
                            <FootLinks />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
