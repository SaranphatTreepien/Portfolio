"use client";

// Visitor-facing pieces of the experience detail page: photo groups that lay themselves out,
// the full-screen photo viewer, and the previous / next links.

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft, FiArrowRight, FiArrowUpRight, FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import { useLang } from "../LanguageProvider";
import { isYearCategory } from "./topics";

export const imagesOf = (item) => (Array.isArray(item?.img) ? item.img.filter(Boolean) : item?.img ? [item.img] : []);

// Cloudinary originals resized + auto format
export const optimizeCloudinary = (url, width) =>
    typeof url === "string" && url.includes("res.cloudinary.com") && url.includes("/upload/") && !url.includes("/upload/f_auto")
        ? url.replace("/upload/", `/upload/f_auto,q_auto,c_limit,w_${width}/`)
        : url;

// "-" or blank counts as empty
export const hasText = (value) => typeof value === "string" && value.trim() !== "" && value.trim() !== "-";

// Fixed layout: every photo is the same 4:3 tile, 3 per row (2 on phones).
// Photos are cropped to fill the tile; the viewer shows each one whole.
const MAX_TILES = 9;

export function PhotoGrid({ images, title, onOpen }) {
    const shown = images.slice(0, MAX_TILES);
    const hidden = images.length - shown.length;

    return (
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
            {shown.map((src, i) => {
                const more = i === shown.length - 1 ? hidden : 0;
                return (
                    <li key={src + i}>
                        <button
                            type="button"
                            onClick={() => onOpen(i)}
                            aria-label={more > 0 ? `${title || "photo"}: +${more}` : `${title || "photo"} ${i + 1}`}
                            className="group/tile relative block aspect-[4/3] w-full overflow-hidden rounded-md bg-gray-100"
                        >
                            <Image
                                src={src}
                                alt=""
                                fill
                                sizes="(max-width: 640px) 50vw, 280px"
                                className="object-cover transition-transform duration-700 ease-out group-hover/tile:scale-[1.03]"
                            />
                            {more > 0 && (
                                <span className="absolute inset-0 flex items-center justify-center bg-primary/55 text-[20px] font-semibold text-white">+{more}</span>
                            )}
                        </button>
                    </li>
                );
            })}
        </ul>
    );
}

// Cover in a fixed 16:10 frame: the whole picture is shown, and a blurred copy of it fills the empty sides
export function CoverFrame({ src, alt, onOpen }) {
    return (
        <button type="button" onClick={onOpen} className="group/tile relative block aspect-[16/10] w-full overflow-hidden rounded-md bg-gray-900">
            <Image src={src} alt="" aria-hidden="true" fill sizes="200px" className="scale-110 object-cover opacity-60 blur-2xl" />
            <Image
                src={src}
                alt={alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 760px"
                className="object-contain transition-transform duration-700 ease-out group-hover/tile:scale-[1.015]"
            />
        </button>
    );
}

// Full-screen viewer: one photo at a time, arrows / swipe / keyboard, thumbnails underneath
export function PhotoViewer({ viewer, onClose }) {
    const { tx } = useLang();
    const [index, setIndex] = useState(viewer?.index ?? 0);
    const touchX = useRef(null);
    const thumbsRef = useRef(null);
    const images = viewer?.images ?? [];
    const count = images.length;
    const caption = viewer?.captions?.[index];
    const [showFullText, setShowFullText] = useState(false);
    useEffect(() => setShowFullText(false), [caption?.description]);

    useEffect(() => setIndex(viewer?.index ?? 0), [viewer]);

    const go = useCallback((step) => setIndex((i) => (i + step + count) % count), [count]);

    useEffect(() => {
        if (!viewer) return;
        const onKey = (e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") go(1);
            if (e.key === "ArrowLeft") go(-1);
        };
        document.addEventListener("keydown", onKey);
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = previous;
        };
    }, [viewer, go, onClose]);

    // Keep the current thumbnail in view
    useEffect(() => {
        thumbsRef.current?.children[index]?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    }, [index]);

    if (!viewer || typeof document === "undefined") return null;

    return createPortal(
        <div className="fixed inset-0 z-[10000] flex flex-col bg-[#0c1110] text-white" role="dialog" aria-modal="true" aria-label={viewer.title || "Photos"}>
            <div className="flex items-center gap-4 border-b border-white/10 px-4 py-3 sm:px-6">
                <p className="min-w-0 flex-1 truncate text-[14px] font-medium text-white/85">{caption?.title || viewer.title}</p>
                {count > 1 && (
                    <p className="shrink-0 text-[13px] tabular-nums text-white/50">
                        {index + 1} / {count}
                    </p>
                )}
                <button type="button" onClick={onClose} aria-label={tx({ th: "ปิด", en: "Close" })} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-white/70 transition-colors hover:bg-white/10 hover:text-white">
                    <FiX className="h-5 w-5" />
                </button>
            </div>

            <div
                className="relative min-h-0 flex-1"
                onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
                onTouchEnd={(e) => {
                    if (touchX.current == null) return;
                    const dx = e.changedTouches[0].clientX - touchX.current;
                    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
                    touchX.current = null;
                }}
            >
                <Image key={images[index]} src={images[index]} alt={`${viewer.title || "photo"} ${index + 1}`} fill sizes="100vw" priority className="object-contain p-3 sm:p-8" />
                {count > 1 && (
                    <>
                        <button type="button" onClick={() => go(-1)} aria-label={tx({ th: "รูปก่อนหน้า", en: "Previous photo" })} className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md bg-black/40 text-white/80 transition-colors hover:bg-black/70 hover:text-white sm:left-4">
                            <FiChevronLeft className="h-6 w-6" />
                        </button>
                        <button type="button" onClick={() => go(1)} aria-label={tx({ th: "รูปถัดไป", en: "Next photo" })} className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md bg-black/40 text-white/80 transition-colors hover:bg-black/70 hover:text-white sm:right-4">
                            <FiChevronRight className="h-6 w-6" />
                        </button>
                    </>
                )}
            </div>

            {/* The photo's own text, kept short; tap to read all of it */}
            {(caption?.description || caption?.link) && (
                <div className="mx-auto w-full max-w-3xl border-t border-white/10 px-4 py-3 sm:px-6">
                    {caption.description && (
                        <div className={`text-[13.5px] leading-relaxed text-white/70 ${showFullText ? "max-h-[30vh] overflow-y-auto whitespace-pre-line" : "line-clamp-2"}`}>{caption.description}</div>
                    )}
                    <div className="mt-1.5 flex gap-4 text-[13px]">
                        {caption.description && caption.description.length > 160 && (
                            <button type="button" onClick={() => setShowFullText((v) => !v)} className="text-brand-300 hover:text-brand-200">
                                {showFullText ? tx({ th: "ย่อ", en: "Show less" }) : tx({ th: "อ่านทั้งหมด", en: "Read all" })}
                            </button>
                        )}
                        {caption.link && (
                            <a href={caption.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-brand-300 hover:text-brand-200">
                                {tx({ th: "เปิดลิงก์", en: "Open link" })} <FiArrowUpRight className="h-3.5 w-3.5" />
                            </a>
                        )}
                    </div>
                </div>
            )}

            {count > 1 && (
                <div ref={thumbsRef} className="flex gap-1.5 overflow-x-auto border-t border-white/10 px-4 py-3 sm:justify-center sm:px-6">
                    {images.map((src, i) => (
                        <button
                            key={src + i}
                            type="button"
                            onClick={() => setIndex(i)}
                            aria-label={`${i + 1}`}
                            aria-current={i === index}
                            className={`relative h-12 w-16 shrink-0 overflow-hidden rounded-[4px] transition-opacity ${i === index ? "opacity-100 ring-2 ring-brand-400" : "opacity-45 hover:opacity-80"}`}
                        >
                            <Image src={src} alt="" fill sizes="64px" className="object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>,
        document.body
    );
}

// Same order as the Experience timeline: newest year first, the saved order inside each year
export function NeighborNav({ slug }) {
    const { tx } = useLang();
    const [neighbors, setNeighbors] = useState(null);

    useEffect(() => {
        let alive = true;
        fetch("/api/projects")
            .then((res) => res.json())
            .then((list) => {
                if (!alive || !Array.isArray(list)) return;
                const yearOf = (p) => (isYearCategory(p.category) ? Number(p.category) : -1);
                const ordered = list.map((p, i) => ({ p, i })).sort((a, b) => yearOf(b.p) - yearOf(a.p) || a.i - b.i).map(({ p }) => p);
                const at = ordered.findIndex((p) => p.slug === slug);
                if (at === -1) return;
                setNeighbors({ prev: ordered[at - 1] ?? null, next: ordered[at + 1] ?? null });
            })
            .catch(() => {});
        return () => {
            alive = false;
        };
    }, [slug]);

    if (!neighbors || (!neighbors.prev && !neighbors.next)) return null;

    const Item = ({ project, dir }) =>
        project ? (
            <Link href={`/work/${project.slug}`} className={`group flex min-w-0 flex-col gap-1 py-6 ${dir === "next" ? "items-end text-right" : ""}`}>
                <span className="inline-flex items-center gap-1.5 text-[13px] text-gray-500">
                    {dir === "prev" && <FiArrowLeft className="transition-transform duration-200 group-hover:-translate-x-0.5" />}
                    {dir === "prev" ? tx({ th: "ก่อนหน้า", en: "Previous" }) : tx({ th: "ถัดไป", en: "Next" })}
                    {dir === "next" && <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />}
                </span>
                <span className="line-clamp-2 text-[16px] font-semibold text-primary transition-colors group-hover:text-brand-700">{project.title}</span>
            </Link>
        ) : (
            <span />
        );

    return (
        <nav aria-label={tx({ th: "ผลงานอื่น", en: "More experience" })} className="mt-20 grid grid-cols-2 gap-8 border-t border-gray-200">
            <Item project={neighbors.prev} dir="prev" />
            <Item project={neighbors.next} dir="next" />
        </nav>
    );
}

export const ExternalLink = ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline decoration-gray-300 underline-offset-4 transition-colors hover:text-brand-700 hover:decoration-brand-600">
        {children}
        <FiArrowUpRight className="h-3.5 w-3.5" />
    </a>
);
