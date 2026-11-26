"use client";

import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiArrowUpRight, FiGithub, FiLock, FiLayers } from "react-icons/fi";
import HeroLogo from "../AiGovernance/HeroLogo";
import { useLang } from "../LanguageProvider";
import { PROJECT_CATEGORIES, projectHref } from "@/lib/projectMeta";

export function CategoryChip({ category, className = "" }) {
    const { tx } = useLang();
    const meta = PROJECT_CATEGORIES[category];
    if (!meta) return null;
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold ${className}`}
            style={{ color: meta.color, background: meta.soft }}
        >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: meta.color }} />
            {tx(meta.label)}
        </span>
    );
}

// Screenshot in a light browser frame, peeking up from a panel tinted with the project's category color
function Preview({ project, size }) {
    const { tx } = useLang();
    const isDemo = project.kind === "demo";
    const tint = PROJECT_CATEGORIES[project.category]?.soft ?? "#f3f4f6";
    const showAgwLogo = project.previewStyle === "agw" && size === "lg";

    return (
        <div className="relative flex items-end overflow-hidden px-5 pt-5 sm:px-7 sm:pt-7" style={{ background: tint }}>
            <div className="w-full overflow-hidden rounded-t-xl border border-b-0 border-black/[0.08] bg-white shadow-[0_-8px_30px_-12px_rgba(16,21,31,0.18)] transition-transform duration-500 ease-out group-hover:-translate-y-1">
                <div className="flex h-8 items-center gap-2.5 border-b border-gray-100 bg-gray-50/80 px-3">
                    <span className="flex gap-1">
                        <span className="h-2 w-2 rounded-full bg-gray-300" />
                        <span className="h-2 w-2 rounded-full bg-gray-300" />
                        <span className="h-2 w-2 rounded-full bg-gray-300" />
                    </span>
                    <span className="flex min-w-0 items-center gap-1.5 text-[11px] text-gray-400">
                        {isDemo ? <FiLayers className="h-3 w-3 shrink-0" /> : <FiLock className="h-3 w-3 shrink-0 text-brand-500" />}
                        <span className="truncate">{project.displayUrl}</span>
                    </span>
                </div>

                {showAgwLogo ? (
                    // The chat screenshot has an empty area where the animated gateway logo sits
                    <div className="relative aspect-[1388/1148] w-full overflow-hidden">
                        <Image
                            src={project.poster}
                            alt={`${project.name}: ${tx({ th: "หน้าแชตที่ปกปิดข้อมูลก่อนส่งให้ AI", en: "chat screen that masks personal data before it reaches the AI" })}`}
                            fill
                            sizes="(max-width: 1024px) 100vw, 640px"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                        />
                        <span className="absolute left-[61.8%] top-[71.2%] w-[14%] -translate-x-1/2 -translate-y-1/2">
                            <HeroLogo className="aspect-square w-full" />
                        </span>
                    </div>
                ) : (
                    <div className={`relative w-full overflow-hidden ${size === "lg" ? "aspect-[16/11]" : "aspect-[16/10]"}`}>
                        <Image
                            src={project.poster}
                            alt={`${project.name} preview`}
                            fill
                            sizes={size === "lg" ? "(max-width: 1024px) 100vw, 640px" : "(max-width: 768px) 100vw, 560px"}
                            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ProjectCard({ project, size = "md" }) {
    const { t, tx } = useLang();
    const isDemo = project.kind === "demo";
    const href = projectHref(project);
    const lg = size === "lg";
    const techLimit = lg ? 6 : 4;
    const extraTech = project.tech.length - techLimit;
    const stats = (project.stats ?? []).slice(0, lg ? 3 : 2);
    // Live sites open full screen in a new tab; demos open their case-study page here
    const external = isDemo ? {} : { target: "_blank", rel: "noopener noreferrer" };
    const TitleLink = isDemo ? Link : "a";

    return (
        <article
            className={`group relative overflow-hidden rounded-3xl border border-gray-200/80 bg-white transition-[border-color,box-shadow,transform] duration-300 hover:border-gray-300 hover:shadow-[0_30px_60px_-36px_rgba(16,21,31,0.45)] ${
                lg ? "grid lg:grid-cols-[1.2fr_1fr]" : "flex h-full flex-col hover:-translate-y-1"
            }`}
        >
            <Preview project={project} size={size} />

            <div className={`flex flex-1 flex-col ${lg ? "p-6 sm:p-8 lg:p-10" : "p-6"}`}>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <CategoryChip category={project.category} />
                    {project.role && <span className="text-[13px] text-gray-500">{tx(project.role)}</span>}
                </div>

                <h3 className={`mt-4 font-semibold tracking-[-0.02em] text-primary ${lg ? "text-[26px] sm:text-[30px]" : "text-[20px]"}`}>
                    {/* Stretched link: the whole card opens the project, the small links below stay clickable on top */}
                    <TitleLink href={href} {...external} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
                        {project.name}
                    </TitleLink>
                </h3>
                <p className={`mt-2 text-gray-600 ${lg ? "text-[16px] leading-relaxed" : "line-clamp-2 text-[14.5px] leading-relaxed"}`}>
                    {tx(project.tagline)}
                </p>

                {stats.length > 0 && (
                    <div className={`mt-6 grid gap-4 border-t border-gray-100 pt-5 ${lg ? "grid-cols-3" : "grid-cols-2"}`}>
                        {stats.map((stat) => (
                            <div key={stat.label.en}>
                                <p className={`font-semibold tabular-nums tracking-tight text-primary ${lg ? "text-[24px]" : "text-[20px]"}`}>{tx(stat.value)}</p>
                                <p className="mt-0.5 text-[12px] leading-snug text-gray-500">{tx(stat.label)}</p>
                            </div>
                        ))}
                    </div>
                )}

                <ul className="mt-6 flex flex-wrap gap-1.5">
                    {project.tech.slice(0, techLimit).map((tech) => (
                        <li key={tech} className="rounded-full border border-gray-200 px-2.5 py-0.5 text-[12px] text-gray-600">
                            {tech}
                        </li>
                    ))}
                    {extraTech > 0 && <li className="px-1.5 py-0.5 text-[12px] text-gray-400">+{extraTech}</li>}
                </ul>

                <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-7 text-[14px] font-medium">
                    <span className="inline-flex items-center gap-1.5 text-primary">
                        {isDemo ? t("live.caseStudy") : t("live.open")}
                        <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                    {project.demoUrl && (
                        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="relative z-10 inline-flex items-center gap-1 text-gray-500 transition-colors hover:text-primary">
                            {t("live.demo")} <FiArrowUpRight />
                        </a>
                    )}
                    {project.repoUrl && (
                        <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="relative z-10 inline-flex items-center gap-1.5 text-gray-500 transition-colors hover:text-primary">
                            <FiGithub /> GitHub
                        </a>
                    )}
                    {!isDemo && project.url && (
                        <a href={project.url} target="_blank" rel="noopener noreferrer" className="relative z-10 inline-flex items-center gap-1 text-gray-500 transition-colors hover:text-primary">
                            {t("live.visit")} <FiArrowUpRight />
                        </a>
                    )}
                </div>
            </div>
        </article>
    );
}
