"use client";

import { useState } from "react";
import Image from "next/image";
import { FiArrowUpRight, FiAward, FiCalendar } from "react-icons/fi";
import { credlyProfileUrl, googleSkillsProfile } from "@/data/credentials";
import { useCredentials } from "@/lib/useCredentials";
import { IconGoogle } from "./icons";
import LumaModal from "./LumaModal";
import Reveal from "./ui/Reveal";
import { useLang } from "./LanguageProvider";

// Seconds each tile spends crossing the screen; the strip speed stays the same however many badges there are
const SECONDS_PER_TILE = 3.2;

const formatDate = (date, lang) =>
    date ? new Date(date).toLocaleDateString(lang === "th" ? "th-TH" : "en-US", { month: "short", year: "numeric" }) : "";

// Google Skills completion badges have no public image, so they get a small drawn token
const CompletionToken = () => (
    <span className="relative flex h-[72px] w-[72px] items-center justify-center rounded-full border border-gray-200 bg-white shadow-[inset_0_-6px_12px_rgba(16,21,31,0.04)]">
        <IconGoogle className="h-8 w-8" />
        <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#34A853] text-[10px] font-bold text-white ring-2 ring-white">✓</span>
    </span>
);

const BadgeTile = ({ badge, hidden }) => {
    const { lang } = useLang();
    const isCertificate = badge.type === "certificate";
    const external = !isCertificate ? { target: "_blank", rel: "noopener noreferrer" } : {};

    return (
        <a
            href={badge.url}
            {...external}
            aria-hidden={hidden || undefined}
            tabIndex={hidden ? -1 : undefined}
            className="group flex w-[196px] shrink-0 flex-col rounded-2xl border border-gray-200/80 bg-white p-4 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_14px_30px_-16px_rgba(24,111,105,0.35)]"
        >
            <span className="flex h-[84px] items-center justify-center">
                {badge.image ? (
                    <span className={`relative block ${isCertificate ? "h-[76px] w-[112px] overflow-hidden rounded-lg border border-gray-100" : "h-[80px] w-[80px]"}`}>
                        <Image
                            src={badge.image}
                            alt=""
                            fill
                            sizes="120px"
                            className={`${isCertificate ? "object-cover" : "object-contain"} transition-transform duration-500 group-hover:scale-105`}
                        />
                    </span>
                ) : (
                    <CompletionToken />
                )}
            </span>
            <span className="mt-3 line-clamp-2 min-h-[2.6em] text-[13px] font-medium leading-[1.3] text-gray-800">{badge.name}</span>
            <span className="mt-1.5 flex items-center justify-between gap-2 text-[11px] text-gray-400">
                <span className="truncate">{badge.issuer}</span>
                <span className="shrink-0 tabular-nums">{formatDate(badge.issuedAt, lang)}</span>
            </span>
        </a>
    );
};

const SkeletonTile = () => <div className="h-[178px] w-[196px] shrink-0 animate-pulse rounded-2xl border border-gray-100 bg-white" />;

export default function Credentials() {
    const { t } = useLang();
    const badges = useCredentials();
    const [lumaOpen, setLumaOpen] = useState(false);

    if (badges && badges.length === 0) return null;

    // "Google Cloud 19 · AWS 1 · Certificates 10"
    const byIssuer = {};
    let certificateCount = 0;
    for (const badge of badges ?? []) {
        if (badge.type === "certificate") certificateCount++;
        else byIssuer[badge.issuer] = (byIssuer[badge.issuer] ?? 0) + 1;
    }
    const breakdown = [
        ...Object.entries(byIssuer).sort((a, b) => b[1] - a[1]).map(([issuer, n]) => `${issuer} ${n}`),
        ...(certificateCount ? [t("cred.certificates", certificateCount)] : []),
    ].join(" · ");

    return (
        <section id="Credentials" className="relative border-y border-gray-200/70 bg-white/60 py-14 lg:py-16">
            <div className="container mx-auto mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <Reveal>
                    <p className="eyebrow">
                        <FiAward /> {t("cred.eyebrow")}
                    </p>
                    <h2 className="mt-3 text-[26px] font-semibold tracking-[-0.02em] text-primary sm:text-[30px]">{t("cred.title")}</h2>
                    <p className="mt-1.5 min-h-[1.25rem] text-sm text-gray-500">{breakdown}</p>
                </Reveal>

                <Reveal delay={0.08} className="flex flex-wrap items-center gap-2">
                    <a
                        href={googleSkillsProfile.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-9 items-center gap-2 rounded-full border border-[#e9d3bd] bg-[#fbf5ee] px-3.5 text-[13px] font-medium text-[#8a5a2b] transition-colors hover:bg-[#f6eadc]"
                    >
                        <IconGoogle className="h-3.5 w-3.5" />
                        {googleSkillsProfile.league} · {googleSkillsProfile.points.toLocaleString("en-US")} pts
                    </a>
                    <button
                        type="button"
                        onClick={() => setLumaOpen(true)}
                        className="inline-flex h-9 items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 text-[13px] font-medium text-gray-700 transition-colors hover:border-gray-400"
                    >
                        <FiCalendar className="text-gray-400" /> {t("cred.luma")}
                    </button>
                    <a
                        href={credlyProfileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex h-9 items-center gap-1.5 rounded-full bg-brand-600 px-4 text-[13px] font-semibold text-white transition-colors hover:bg-brand-700"
                    >
                        {t("cred.viewAll")}
                        <FiArrowUpRight className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                </Reveal>
            </div>

            {/* Full-width strip that scrolls by itself and pauses under the pointer. Reduced motion: a normal scrollable row. */}
            <div className="marquee-scroller marquee-mask overflow-hidden py-2">
                {badges ? (
                    <div
                        className="marquee-track flex w-max animate-marquee"
                        style={{ "--marquee-duration": `${badges.length * SECONDS_PER_TILE}s` }}
                    >
                        {/* Spacing is padding, not gap, so each copy is exactly half the track and the loop has no jump */}
                        {badges.map((badge) => (
                            <div key={badge.id} className="pr-4">
                                <BadgeTile badge={badge} />
                            </div>
                        ))}
                        {/* Second copy so the loop has no seam */}
                        {badges.map((badge) => (
                            <div key={`dup-${badge.id}`} className="marquee-dup pr-4">
                                <BadgeTile badge={badge} hidden />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex gap-4 px-6">
                        {Array.from({ length: 8 }, (_, i) => (
                            <SkeletonTile key={i} />
                        ))}
                    </div>
                )}
            </div>

            <LumaModal open={lumaOpen} onClose={() => setLumaOpen(false)} />
        </section>
    );
}
