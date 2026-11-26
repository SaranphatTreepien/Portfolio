"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useScroll, useSpring } from "framer-motion";
import { FiArrowRight, FiChevronDown, FiStar } from "react-icons/fi";
import { TOPIC_STYLE, isYearCategory, topicsOf } from "./topics";
import { useLang } from "../LanguageProvider";

// Newest years are open; older ones wait behind a button
const OPEN_YEARS = 2;

const formatMonth = (date, lang) =>
    date ? new Date(date).toLocaleDateString(lang === "th" ? "th-TH" : "en-US", { month: "short", year: "numeric" }) : "";

const TopicDots = ({ item }) => (
    <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {topicsOf(item).map((topic) => (
            <span key={topic} className="inline-flex items-center gap-1.5 text-[12px] text-gray-500">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: TOPIC_STYLE[topic].color }} />
                {TOPIC_STYLE[topic].label}
            </span>
        ))}
    </span>
);

// "Best" items: a card with the picture
const FeatureCard = ({ item }) => {
    const { lang } = useLang();
    return (
        <Link
            href={`/work/${item.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-white/80 bg-white/90 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-[0_20px_40px_-28px_rgba(16,21,31,0.45)]"
        >
            <span className="relative block aspect-[16/9] overflow-hidden bg-gray-100">
                {item.img && (
                    <Image
                        src={item.img}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, 420px"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                )}
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[11px] font-semibold text-amber-700 shadow-sm">
                    <FiStar className="h-3 w-3 fill-amber-400 text-amber-500" /> Best
                </span>
            </span>
            <span className="flex flex-1 flex-col gap-2 p-4">
                <span className="line-clamp-2 text-[15px] font-semibold leading-snug text-primary">{item.title}</span>
                <span className="mt-auto flex items-center justify-between gap-3">
                    <TopicDots item={item} />
                    <span className="shrink-0 text-[12px] tabular-nums text-gray-400">{formatMonth(item.createdAt, lang)}</span>
                </span>
            </span>
        </Link>
    );
};

// Everything else: one line each
const Row = ({ item }) => {
    const { lang } = useLang();
    return (
        <li>
            <Link href={`/work/${item.slug}`} className="group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-gray-50/80 sm:px-5">
                <span className="relative hidden h-11 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:block">
                    {item.img && <Image src={item.img} alt="" fill sizes="64px" className="object-cover" />}
                </span>
                <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14.5px] font-medium text-primary">{item.title}</span>
                    <span className="mt-0.5 block">
                        <TopicDots item={item} />
                    </span>
                </span>
                <span className="hidden shrink-0 text-[12px] tabular-nums text-gray-400 sm:block">{formatMonth(item.createdAt, lang)}</span>
                <FiArrowRight className="shrink-0 text-gray-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
        </li>
    );
};

// `split`: the list sits in a narrow column beside the graph on wide screens, so the year goes on top instead of in a side column
const YearGroup = ({ year, items, split, onActive }) => {
    const { t, lang } = useLang();
    const ref = useRef(null);
    const inView = useInView(ref, { margin: "-30% 0px -60% 0px" });
    useEffect(() => {
        if (inView) onActive?.(year);
    }, [inView, year, onActive]);
    const best = items.filter((item) => item.isBest);
    const rest = items.filter((item) => !item.isBest);
    const ceYear = isYearCategory(year) ? Number(year) - 543 : null;

    return (
        <div ref={ref} className={`relative grid gap-5 pb-14 pl-8 lg:grid-cols-[150px_1fr] lg:gap-10 lg:pl-0 ${split ? "2xl:grid-cols-1 2xl:gap-5 2xl:pl-8" : ""}`}>
            <span aria-hidden="true" className={`absolute left-0 top-[14px] h-[11px] w-[11px] rounded-full border-2 border-brand-500 bg-white lg:left-[150px] ${split ? "2xl:left-0" : ""}`} />
            <div className={`lg:sticky lg:top-8 lg:self-start lg:pr-8 lg:text-right ${split ? "2xl:static 2xl:pr-0 2xl:text-left" : ""}`}>
                <p className="text-[34px] font-semibold leading-none tracking-[-0.03em] text-primary">{lang === "en" && ceYear ? ceYear : year}</p>
                <p className="mt-2 text-[12px] text-gray-400">
                    {ceYear ? (lang === "en" ? `BE ${year}` : `ค.ศ. ${ceYear}`) : ""} · {t("work.items", items.length)}
                </p>
            </div>
            <div className={`flex min-w-0 flex-col gap-4 lg:pl-6 ${split ? "2xl:pl-0" : ""}`}>
                {best.length > 0 && (
                    <div className={`grid gap-4 sm:grid-cols-2 ${split ? "" : "2xl:grid-cols-3"}`}>
                        {best.map((item) => (
                            <FeatureCard key={item.slug} item={item} />
                        ))}
                    </div>
                )}
                {rest.length > 0 && (
                    <ul className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-white/80 bg-white/85">
                        {rest.map((item) => (
                            <Row key={item.slug} item={item} />
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default function ExperienceTimeline({ items, showAll = false, split = false, onActiveYear }) {
    const { t, lang } = useLang();
    const [expanded, setExpanded] = useState(false);
    const ref = useRef(null);

    // The teal line fills in as the timeline scrolls past
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
    const lineScale = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

    const groups = useMemo(() => {
        const byYear = new Map();
        for (const item of items) {
            const year = isYearCategory(item.category) ? String(item.category).trim() : "—";
            if (!byYear.has(year)) byYear.set(year, []);
            byYear.get(year).push(item);
        }
        return [...byYear.entries()].sort((a, b) => (b[0] === "—" ? -1 : a[0] === "—" ? 1 : Number(b[0]) - Number(a[0])));
    }, [items]);

    const open = showAll || expanded ? groups : groups.slice(0, OPEN_YEARS);
    const hidden = groups.slice(open.length);
    const hiddenCount = hidden.reduce((sum, [, list]) => sum + list.length, 0);
    const shownYear = (year) => (lang === "en" && isYearCategory(year) ? Number(year) - 543 : year);
    const hiddenRange = hidden.length ? [hidden[0][0], hidden[hidden.length - 1][0]].map(shownYear).filter((v, i, a) => a.indexOf(v) === i).join("–") : "";

    return (
        <div ref={ref} className="relative">
            <span aria-hidden="true" className={`absolute bottom-0 left-[5px] top-3 w-px bg-gray-900/10 lg:left-[155px] ${split ? "2xl:left-[5px]" : ""}`} />
            <motion.span
                aria-hidden="true"
                style={{ scaleY: lineScale }}
                className={`absolute bottom-0 left-[5px] top-3 w-px origin-top bg-brand-400 lg:left-[155px] ${split ? "2xl:left-[5px]" : ""}`}
            />

            {open.map(([year, list]) => (
                <YearGroup key={year} year={year} items={list} split={split} onActive={onActiveYear} />
            ))}

            {hidden.length > 0 && (
                <div className={`relative pl-8 lg:pl-[190px] ${split ? "2xl:pl-8" : ""}`}>
                    <button
                        type="button"
                        onClick={() => setExpanded(true)}
                        className="inline-flex h-10 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 text-[14px] font-medium text-gray-600 transition-colors hover:border-gray-400 hover:text-primary"
                    >
                        {t("work.showOlder", hiddenRange, hiddenCount)} <FiChevronDown />
                    </button>
                </div>
            )}
        </div>
    );
}
