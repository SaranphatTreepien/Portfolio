"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FiAward, FiChevronLeft, FiChevronRight, FiExternalLink } from "react-icons/fi";
import { credlyProfileUrl, googleSkillsProfile } from "@/data/credentials";

const AUTOPLAY_MS = 3500;
const CARD_SHELL =
    "w-[calc((100%-1rem)/2)] shrink-0 snap-start rounded-2xl border border-white/60 bg-white/90 p-3 shadow-[0_8px_30px_rgb(0,0,0,0.06)]";

const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric" });

const GoogleWordmark = () => (
    <span className="text-[10px] font-medium tracking-tight">
        <span className="text-[#4285F4]">G</span>
        <span className="text-[#EA4335]">o</span>
        <span className="text-[#FBBC05]">o</span>
        <span className="text-[#4285F4]">g</span>
        <span className="text-[#34A853]">l</span>
        <span className="text-[#EA4335]">e</span>
        <span className="text-gray-500"> Cloud</span>
    </span>
);

// Google Skills completion badges have no public image URL, so they are drawn to match the original design.
const CompletionBadge = ({ name }) => (
    <div className="flex h-full w-[150px] max-w-full flex-col items-center justify-between rounded border border-gray-200 bg-white px-2 py-3 text-center">
        <GoogleWordmark />
        <p className="line-clamp-3 text-xs leading-snug text-gray-600">{name}</p>
        <div className="flex flex-col items-center gap-0.5">
            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#4285F4] text-[8px] font-bold text-white">✓</span>
            <span className="text-[7px] tracking-[0.15em] text-gray-500">COMPLETION BADGE</span>
        </div>
    </div>
);

const BadgeCard = ({ badge }) => {
    const isCertificate = badge.type === "certificate";
    const linkProps = isCertificate ? {} : { target: "_blank", rel: "noopener noreferrer" };

    return (
        <a
            href={badge.url}
            {...linkProps}
            className={`${CARD_SHELL} group flex flex-col transition-[border-color,box-shadow] duration-200 hover:border-[#7edad2] hover:shadow-lg`}
        >
            <div className={`relative flex h-[150px] items-center justify-center sm:h-[170px] ${isCertificate ? "overflow-hidden rounded-xl bg-gray-100" : ""}`}>
                {badge.image ? (
                    <Image
                        src={badge.image}
                        alt={badge.name}
                        fill
                        sizes="(max-width: 1024px) 45vw, 260px"
                        className={isCertificate ? "object-cover" : "object-contain"}
                    />
                ) : (
                    <CompletionBadge name={badge.name} />
                )}
            </div>
            <p className="mt-2.5 line-clamp-2 min-h-[2.5rem] text-[13px] font-bold leading-5 text-gray-800 group-hover:text-[#2f9c93] transition-colors">
                {badge.name}
            </p>
            <div className="mt-1.5 flex items-center justify-between gap-2 text-[11px] text-gray-400">
                <span className="truncate">{badge.issuer}</span>
                <span className="shrink-0">{formatDate(badge.issuedAt)}</span>
            </div>
        </a>
    );
};

const ArrowButton = ({ direction, onClick }) => {
    const Icon = direction === "prev" ? FiChevronLeft : FiChevronRight;
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={direction === "prev" ? "เลื่อนไปทางซ้าย" : "เลื่อนไปทางขวา"}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm hover:border-[#7edad2] hover:text-[#2f9c93] transition-colors"
        >
            <Icon className="h-5 w-5" />
        </button>
    );
};

const SummaryHeader = ({ badgeCount, certificateCount, onPrev, onNext }) => (
    <div className="mb-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/60 bg-white/85 shadow-sm">
                    <FiAward className="h-5 w-5 text-[#2f9c93]" />
                </span>
                <div className="min-w-0 text-left">
                    <h3 className="text-lg font-bold leading-tight text-white lg:text-gray-800">Badges & Certifications</h3>
                    <p className="text-xs font-medium text-white/80 lg:text-gray-500">
                        {badgeCount} badges · {certificateCount} certificates · Google Cloud · AWS · Cisco
                    </p>
                </div>
            </div>
            <div className="flex shrink-0 gap-2">
                <ArrowButton direction="prev" onClick={onPrev} />
                <ArrowButton direction="next" onClick={onNext} />
            </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
            <a
                href={googleSkillsProfile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[#cd7f32]/40 bg-[#fbf3ea] px-3 py-1.5 text-xs font-semibold text-[#8a5a2b] hover:bg-[#f5e6d3] transition-colors"
            >
                <FiAward /> {googleSkillsProfile.league} · {googleSkillsProfile.points.toLocaleString("en-US")} pts
            </a>
            <a
                href={credlyProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-primary hover:text-primary transition-colors"
            >
                ดูทั้งหมดบน Credly <FiExternalLink />
            </a>
        </div>
    </div>
);

export default function Credentials() {
    const [badges, setBadges] = useState(null);
    const trackRef = useRef(null);
    const pausedRef = useRef(false);

    useEffect(() => {
        fetch("/api/credentials")
            .then((res) => (res.ok ? res.json() : []))
            .then(setBadges)
            .catch(() => setBadges([]));
    }, []);

    const scroll = useCallback((direction) => {
        const track = trackRef.current;
        if (!track?.firstElementChild) return;
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        const step = track.firstElementChild.getBoundingClientRect().width + gap;
        const maxScroll = track.scrollWidth - track.clientWidth;

        if (direction === "next") {
            track.scrollTo({ left: track.scrollLeft >= maxScroll - 4 ? 0 : track.scrollLeft + step, behavior: "smooth" });
        } else {
            track.scrollTo({ left: track.scrollLeft <= 4 ? maxScroll : track.scrollLeft - step, behavior: "smooth" });
        }
    }, []);

    useEffect(() => {
        if (!badges?.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const timer = setInterval(() => {
            if (!pausedRef.current && !document.hidden) scroll("next");
        }, AUTOPLAY_MS);
        return () => clearInterval(timer);
    }, [badges, scroll]);

    if (badges && badges.length === 0) return null;

    const certificateCount = badges ? badges.filter((badge) => badge.type === "certificate").length : 0;
    const badgeCount = badges ? badges.length - certificateCount : 0;

    return (
        <div
            id="Credentials"
            onMouseEnter={() => (pausedRef.current = true)}
            onMouseLeave={() => (pausedRef.current = false)}
            onFocus={() => (pausedRef.current = true)}
            onBlur={() => (pausedRef.current = false)}
            onTouchStart={() => (pausedRef.current = true)}
        >
            {badges && (
                <SummaryHeader
                    badgeCount={badgeCount}
                    certificateCount={certificateCount}
                    onPrev={() => scroll("prev")}
                    onNext={() => scroll("next")}
                />
            )}
            <div
                ref={trackRef}
                className="-mb-2 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                {badges
                    ? badges.map((badge) => <BadgeCard key={badge.id} badge={badge} />)
                    : Array.from({ length: 2 }, (_, i) => <div key={i} className={`${CARD_SHELL} h-[250px] animate-pulse`} />)}
            </div>
        </div>
    );
}
