"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";
import ProjectCard from "./ProjectCard";
import { useLang } from "../LanguageProvider";
import { liveProjects } from "@/data/liveProjects";
import { CATEGORY_ORDER, PROJECT_CATEGORIES, sortByCategory } from "@/lib/projectMeta";

const projects = sortByCategory(liveProjects);

export default function ProjectsIndex() {
    const { t, tx } = useLang();
    const [filter, setFilter] = useState("all");
    const shown = filter === "all" ? projects : projects.filter((project) => project.category === filter);

    const filters = [
        { value: "all", label: t("projects.all"), count: projects.length },
        ...CATEGORY_ORDER.map((category) => ({
            value: category,
            label: tx(PROJECT_CATEGORIES[category].label),
            color: PROJECT_CATEGORIES[category].color,
            count: projects.filter((project) => project.category === category).length,
        })).filter((item) => item.count > 0),
    ];

    return (
        <MotionConfig reducedMotion="user">
            <main className="container mx-auto pb-28 pt-10 lg:pt-14">
                <Link href="/#Live" className="group inline-flex items-center gap-2 text-[14px] font-medium text-gray-500 transition-colors hover:text-primary">
                    <FiArrowLeft className="transition-transform duration-200 group-hover:-translate-x-0.5" /> Portfolio
                </Link>

                <h1 className="mt-6 text-[40px] font-semibold leading-[1.05] tracking-[-0.035em] text-primary sm:text-[52px]">{t("projects.title")}</h1>
                <p className="mt-3 max-w-xl text-[17px] text-gray-500">{t("projects.subtitle")}</p>

                {/* Filter: the dark pill slides to the chosen type */}
                <LayoutGroup>
                    <div role="tablist" aria-label={t("projects.title")} className="mt-10 flex flex-wrap gap-2">
                        {filters.map((item) => {
                            const active = filter === item.value;
                            return (
                                <button
                                    key={item.value}
                                    type="button"
                                    role="tab"
                                    aria-selected={active}
                                    onClick={() => setFilter(item.value)}
                                    className={`relative inline-flex h-10 items-center gap-2 rounded-full border px-4 text-[14px] font-medium transition-colors ${
                                        active ? "border-brand-600 text-white" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-primary"
                                    }`}
                                >
                                    {active && (
                                        <motion.span layoutId="project-filter" className="absolute inset-0 -z-0 rounded-full bg-brand-600" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
                                    )}
                                    {item.color && <span className="relative h-1.5 w-1.5 rounded-full" style={{ background: active ? "#fff" : item.color }} />}
                                    <span className="relative">{item.label}</span>
                                    <span className={`relative tabular-nums ${active ? "text-white/70" : "text-gray-400"}`}>{item.count}</span>
                                </button>
                            );
                        })}
                    </div>

                    <motion.div layout className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        <AnimatePresence mode="popLayout" initial={false}>
                            {shown.map((project) => (
                                <motion.div
                                    key={project.slug}
                                    layout
                                    initial={{ opacity: 0, scale: 0.97 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.97 }}
                                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                    className="h-full"
                                >
                                    <ProjectCard project={project} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </LayoutGroup>
            </main>
        </MotionConfig>
    );
}
