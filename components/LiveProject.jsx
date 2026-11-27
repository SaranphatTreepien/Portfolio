"use client";

import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import ProjectCard, { CategoryChip } from "./projects/ProjectCard";
import Reveal from "./ui/Reveal";
import { liveProjects } from "@/data/liveProjects";
import { projectHref, sortByCategory } from "@/lib/projectMeta";
import { useLang } from "./LanguageProvider";

// Home page "Work" section: one big featured project, two beside each other, then a short list of the rest
export default function LiveProject() {
    const { t, tx } = useLang();
    const featured = sortByCategory(liveProjects.filter((project) => project.featured));
    const others = sortByCategory(liveProjects.filter((project) => !project.featured));
    const [lead, ...rest] = featured;

    return (
        <section id="Experience" className="scroll-mt-16 py-20 lg:scroll-mt-0 lg:py-24">
            <div className="container mx-auto">
                <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <Reveal>
                        <p className="eyebrow">{t("live.eyebrow")}</p>
                        <h2 className="section-title mt-3">{t("live.title")}</h2>
                        <p className="mt-3 max-w-xl text-[16px] text-gray-500">{t("live.subtitle")}</p>
                    </Reveal>
                    <Reveal delay={0.08}>
                        <AllProjectsLink label={t("live.all", liveProjects.length)} />
                    </Reveal>
                </div>

                <div className="flex flex-col gap-6">
                    {lead && (
                        <Reveal>
                            <ProjectCard project={lead} size="lg" />
                        </Reveal>
                    )}
                    <div className="grid gap-6 md:grid-cols-2">
                        {rest.map((project, i) => (
                            <Reveal key={project.slug} delay={i * 0.08} className="h-full">
                                <ProjectCard project={project} />
                            </Reveal>
                        ))}
                    </div>
                </div>

                {others.length > 0 && (
                    <Reveal className="mt-6">
                        <ul className="divide-y divide-gray-100 overflow-hidden rounded-3xl border border-gray-200/80 bg-white">
                            {others.map((project) => (
                                <li key={project.slug}>
                                    <Link
                                        href={projectHref(project)}
                                        className="group flex flex-col gap-2 px-6 py-5 transition-colors hover:bg-gray-50/80 sm:flex-row sm:items-center sm:gap-6"
                                    >
                                        <CategoryChip category={project.category} className="w-fit shrink-0" />
                                        <span className="min-w-0 flex-1">
                                            <span className="block font-semibold text-primary">{project.name}</span>
                                            <span className="block truncate text-[14px] text-gray-500">{tx(project.tagline)}</span>
                                        </span>
                                        <FiArrowRight className="hidden shrink-0 text-gray-300 transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary sm:block" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </Reveal>
                )}
            </div>
        </section>
    );
}

function AllProjectsLink({ label }) {
    return (
        <Link
            href="/experience"
            className="group inline-flex h-11 items-center gap-2 rounded-full border border-gray-300 bg-white px-5 text-[14px] font-medium text-primary transition-colors hover:border-primary"
        >
            {label}
            <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
    );
}
