"use client";

import Link from "next/link";
import { FiArrowLeft, FiExternalLink, FiMaximize2 } from "react-icons/fi";
import { useLang } from "./LanguageProvider";

// Shared building blocks for the /projects/* detail pages (same look as the Live Project cards).
// Text props may be plain strings or {th, en} objects.

export function ProjectTopBar({ nav, action }) {
    const { tx } = useLang();
    return (
        <header className="bar sticky top-14 z-30 border-b border-gray-200 lg:top-0">
            <div className="container mx-auto flex h-14 items-center gap-2 sm:gap-3">
                <Link
                    href="/#Experience"
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
            </div>
        </header>
    );
}

export function ProjectIntro({ project, note }) {
    const { tx } = useLang();
    return (
        <section className="container mx-auto pt-12">
            <div className="flex max-w-3xl flex-col gap-4">
                <p className="text-sm text-gray-500">{tx(project.badge)}</p>
                <h1 className="text-3xl font-semibold tracking-tight text-primary sm:text-4xl xl:text-[44px]">{project.name}</h1>
                <p className="text-lg leading-relaxed text-gray-700">{tx(project.tagline)}</p>
                <p className="text-[15px] leading-7 text-gray-600">{tx(project.description)}</p>
            </div>

            <dl className="mt-8 flex max-w-3xl flex-wrap gap-x-10 gap-y-4 border-t border-gray-200 pt-6">
                {project.stats.map((stat) => (
                    <div key={tx(stat.label)}>
                        <dt className="sr-only">{tx(stat.label)}</dt>
                        <dd className="text-xl font-semibold tabular-nums text-primary">{tx(stat.value)}</dd>
                        <dd className="text-[13px] text-gray-500">{tx(stat.label)}</dd>
                    </div>
                ))}
            </dl>

            <TechPills tech={project.tech} className="mt-6 max-w-3xl" />
            {note && <p className="mt-4 max-w-3xl text-[13px] leading-6 text-gray-500">{tx(note)}</p>}
        </section>
    );
}

export function TechPills({ tech, className = "" }) {
    return (
        <ul className={`flex flex-wrap gap-1.5 ${className}`}>
            {tech.map((item) => (
                <li key={item} className="rounded-md border border-gray-200 px-2 py-0.5 font-mono text-[12px] text-gray-600">
                    {item}
                </li>
            ))}
        </ul>
    );
}

// Plain heading: title and one line under it. `eyebrow` is still accepted from older callers but not shown.
// eslint-disable-next-line no-unused-vars
export function SectionHeading({ eyebrow, title, text, action }) {
    const { tx } = useLang();
    return (
        <div className="mb-8 flex flex-col gap-4 border-b border-gray-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-1.5">
                <h2 className="text-2xl font-semibold tracking-tight text-primary sm:text-[28px]">{tx(title)}</h2>
                {text && <p className="max-w-2xl text-[15px] leading-6 text-gray-500">{tx(text)}</p>}
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
                    className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
                >
                    <FiMaximize2 /> {t("detail.fullscreen")}
                </a>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-800 bg-[#0b0a12] shadow-[0_20px_50px_-28px_rgba(16,21,31,0.45)]">
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
                href="/#Experience"
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:border-primary hover:text-primary transition-colors"
            >
                <FiArrowLeft /> {t("detail.back")}
            </Link>
            <a
                href={demoHref}
                className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
            >
                {t("detail.backToDemo")}
            </a>
        </div>
    );
}
