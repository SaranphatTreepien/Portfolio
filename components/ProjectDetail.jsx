"use client";

import Link from "next/link";
import { FiArrowLeft, FiExternalLink, FiMaximize2 } from "react-icons/fi";
import { LanguageToggle, useLang } from "./LanguageProvider";

// Shared building blocks for the /projects/* detail pages (same look as the Live Project cards).
// Text props may be plain strings or {th, en} objects.

export function ProjectTopBar({ nav, action }) {
    const { tx } = useLang();
    return (
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur">
            <div className="container mx-auto flex h-14 items-center gap-2 sm:gap-3">
                <Link
                    href="/#Live"
                    className="inline-flex shrink-0 items-center gap-2 rounded-full px-2 py-1.5 text-sm font-semibold text-gray-600 hover:text-primary transition-colors"
                >
                    <FiArrowLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Portfolio</span>
                </Link>
                <nav className="flex min-w-0 flex-1 gap-0.5 overflow-x-auto [scrollbar-width:none] sm:justify-center sm:gap-1 [&::-webkit-scrollbar]:hidden">
                    {nav.map(({ href, label, icon: Icon }) => (
                        <a
                            key={href}
                            href={href}
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 hover:text-primary transition-colors sm:px-3 sm:text-sm"
                        >
                            <Icon className="hidden h-4 w-4 sm:block" />
                            {tx(label)}
                        </a>
                    ))}
                </nav>
                {action}
                <LanguageToggle />
            </div>
        </header>
    );
}

export function ProjectIntro({ project, note }) {
    const { tx } = useLang();
    return (
        <section className="container mx-auto pt-12">
            <div className="flex max-w-3xl flex-col gap-4">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#7edad2]/50 bg-[#7edad2]/10 px-3 py-1 text-xs font-bold tracking-wide text-[#1f7f77]">
                    <span className="h-2 w-2 rounded-full bg-[#14b8a6]" /> {tx(project.badge)}
                </span>
                <h1 className="text-3xl font-bold text-primary sm:text-4xl xl:text-5xl">{project.name}</h1>
                <p className="text-base font-medium text-[#a21caf] sm:text-lg">{tx(project.tagline)}</p>
                <p className="text-sm leading-7 text-gray-600 sm:text-base">{tx(project.description)}</p>
            </div>

            <div className="mt-8 grid max-w-3xl grid-cols-3 divide-x divide-gray-200 rounded-2xl border border-gray-200 bg-white py-4 shadow-sm">
                {project.stats.map((stat) => (
                    <div key={tx(stat.label)} className="px-2 text-center">
                        <div className="bg-gradient-to-r from-[#a855f7] to-[#ec4899] bg-clip-text text-xl font-extrabold text-transparent sm:text-2xl">
                            {tx(stat.value)}
                        </div>
                        <div className="text-[11px] leading-4 text-gray-500 sm:text-xs">{tx(stat.label)}</div>
                    </div>
                ))}
            </div>

            <TechPills tech={project.tech} className="mt-6 max-w-3xl" />
            {note && <p className="mt-4 text-xs text-gray-400">{tx(note)}</p>}
        </section>
    );
}

export function TechPills({ tech, className = "" }) {
    return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
            {tech.map((item) => (
                <span key={item} className="rounded-full border border-[#7edad2]/40 bg-[#7edad2]/10 px-3 py-1 text-xs font-semibold text-[#1f7f77]">
                    {item}
                </span>
            ))}
        </div>
    );
}

export function SectionHeading({ eyebrow, title, text, action }) {
    const { tx } = useLang();
    return (
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-1.5">
                <span className="text-xs font-bold uppercase tracking-widest text-[#a21caf]">{tx(eyebrow)}</span>
                <h2 className="text-2xl font-bold text-primary sm:text-3xl">{tx(title)}</h2>
                <p className="max-w-2xl text-sm leading-6 text-gray-500">{tx(text)}</p>
            </div>
            {action}
        </div>
    );
}

// Embedded standalone demo page in a browser frame, with a full-screen link.
// demo.langParam: the demo understands ?lang=, so it opens in the site's language.
export function DemoFrame({ demo, projectName, children }) {
    const { t, tx, lang } = useLang();
    const src = demo.langParam ? `${demo.src}?lang=${lang}` : demo.src;
    const title = tx(demo.title);
    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h3 className="text-lg font-bold text-primary">{title}</h3>
                    <p className="text-sm leading-6 text-gray-500">{tx(demo.description)}</p>
                    {children}
                </div>
                <a
                    href={src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-[#a855f7] to-[#ec4899] px-4 py-2 text-sm font-semibold text-white shadow-md hover:opacity-90 transition-opacity"
                >
                    <FiMaximize2 /> {t("detail.fullscreen")}
                </a>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-800 bg-[#0b0a12] shadow-[0_24px_60px_-20px_rgba(76,29,149,0.45)]">
                <div className="flex h-11 items-center gap-3 border-b border-white/10 bg-[#15131f] px-4">
                    <div className="flex gap-1.5">
                        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                    </div>
                    <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-gray-400">
                        <span className="truncate">{demo.displayUrl ?? demo.src}</span>
                    </div>
                    <a
                        href={src}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t("detail.fullscreenAria", title)}
                        className="text-gray-500 hover:text-white transition-colors"
                    >
                        <FiExternalLink className="h-4 w-4" />
                    </a>
                </div>
                <iframe
                    key={src}
                    src={src}
                    title={`${projectName} — ${title}`}
                    loading="lazy"
                    className={`block w-full border-0 bg-white ${demo.frameClass ?? "h-[78vh] min-h-[560px] max-h-[920px]"}`}
                />
            </div>
        </div>
    );
}

export function BackLinks({ demoHref }) {
    const { t } = useLang();
    return (
        <div className="mt-16 flex flex-wrap items-center justify-center gap-3">
            <Link
                href="/#Live"
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:border-primary hover:text-primary transition-colors"
            >
                <FiArrowLeft /> {t("detail.back")}
            </Link>
            <a
                href={demoHref}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#a855f7] to-[#ec4899] px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-90 transition-opacity"
            >
                ▶ {t("detail.backToDemo")}
            </a>
        </div>
    );
}
