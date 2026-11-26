"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiAward, FiPlus } from "react-icons/fi";
import Reveal from "./ui/Reveal";
import { useLang } from "./LanguageProvider";
import { education, projects, skills, training, work } from "@/data/journey";

// Résumé layout: everything readable at once, no tabs. Work and projects on the left, a sticky sidebar on the right.

const GroupTitle = ({ children, count }) => (
    <h3 className="mb-6 flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-gray-400">
        {children}
        {count != null && <span className="font-medium tabular-nums text-gray-300">{count}</span>}
        <span aria-hidden="true" className="h-px flex-1 bg-gray-200" />
    </h3>
);

const LiveDot = () => (
    <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-60 motion-reduce:hidden" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
    </span>
);

const Chips = ({ items }) => (
    <ul className="flex flex-wrap gap-1.5">
        {items.map((item) => (
            <li key={typeof item === "string" ? item : item.en} className="rounded-full border border-gray-200 bg-white px-2.5 py-0.5 text-[12px] text-gray-600">
                {item}
            </li>
        ))}
    </ul>
);

function WorkEntry({ entry }) {
    const { tx } = useLang();
    return (
        <article className="grid gap-3 sm:grid-cols-[140px_1fr] sm:gap-8">
            <p className="flex items-center gap-2 self-start pt-1.5 text-[13px] tabular-nums text-gray-500">
                {entry.current && <LiveDot />}
                {tx(entry.period)}
            </p>
            <div>
                <h4 className="text-[20px] font-semibold tracking-[-0.015em] text-primary">{tx(entry.company)}</h4>
                <p className="mt-0.5 text-[14px] font-medium text-brand-700">{tx(entry.role)}</p>
                <p className="mt-3 text-[15px] leading-relaxed text-gray-600">{tx(entry.summary)}</p>
                <ul className="mt-4 space-y-2">
                    {entry.points.map((point) => (
                        <li key={point.label} className="grid grid-cols-[92px_1fr] gap-3 text-[14px] leading-relaxed">
                            <span className="font-medium text-primary">{point.label}</span>
                            <span className="text-gray-600">{tx(point)}</span>
                        </li>
                    ))}
                </ul>
                {entry.tech && (
                    <div className="mt-5">
                        <Chips items={entry.tech} />
                    </div>
                )}
            </div>
        </article>
    );
}

// One line each; opens in place to show the full write-up
function ProjectRow({ project, index }) {
    const { tx } = useLang();
    const [open, setOpen] = useState(false);
    const panelId = `journey-project-${index}`;

    return (
        <li>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls={panelId}
                className="group grid w-full grid-cols-[1fr_auto] items-center gap-4 py-4 text-left sm:grid-cols-[56px_1fr_auto] sm:gap-6"
            >
                <span className="hidden text-[13px] tabular-nums text-gray-400 sm:block">{tx(project.year)}</span>
                <span className="min-w-0">
                    <span className="block font-semibold text-primary transition-colors group-hover:text-brand-700">{tx(project.title)}</span>
                    <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-gray-500">
                        <span className="sm:hidden">{tx(project.year)} ·</span>
                        {tx(project.kind)}
                        {project.award && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[12px] font-medium text-amber-700">
                                <FiAward className="h-3 w-3" /> {tx(project.award)}
                            </span>
                        )}
                    </span>
                </span>
                <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full border text-gray-400 transition-all duration-300 group-hover:border-gray-400 group-hover:text-primary ${
                        open ? "rotate-45 border-gray-400 text-primary" : "border-gray-200"
                    }`}
                >
                    <FiPlus />
                </span>
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        id={panelId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="pb-5 sm:pl-[80px] sm:pr-14">
                            <p className="text-[14.5px] leading-relaxed text-gray-600">{tx(project.summary)}</p>
                            {project.tech && (
                                <div className="mt-3">
                                    <Chips items={project.tech} />
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </li>
    );
}

function Sidebar() {
    const { t, tx } = useLang();
    return (
        <aside className="flex flex-col gap-10 lg:sticky lg:top-28 lg:self-start">
            <section>
                <GroupTitle>{t("journey.education")}</GroupTitle>
                <ol className="relative space-y-6 border-l border-gray-200 pl-5">
                    {education.map((item) => (
                        <li key={item.school.en} className="relative">
                            <span
                                aria-hidden="true"
                                className={`absolute -left-[25px] top-1.5 h-[9px] w-[9px] rounded-full border-2 bg-white ${item.current ? "border-brand-500" : "border-gray-300"}`}
                            />
                            <p className="font-semibold text-primary">{tx(item.school)}</p>
                            <p className="mt-0.5 text-[14px] text-gray-600">{tx(item.degree)}</p>
                            <p className="mt-1 text-[13px] tabular-nums text-gray-400">{tx(item.period)}</p>
                        </li>
                    ))}
                </ol>
            </section>

            <section>
                <GroupTitle>{t("journey.skill")}</GroupTitle>
                <dl className="space-y-4">
                    {skills.map((skill) => (
                        <div key={typeof skill.group === "string" ? skill.group : skill.group.en}>
                            <dt className="mb-2 text-[13px] font-medium text-gray-500">{tx(skill.group)}</dt>
                            <dd>
                                <Chips items={skill.items.map(tx)} />
                            </dd>
                        </div>
                    ))}
                </dl>
            </section>

            <section>
                <GroupTitle>{t("journey.training")}</GroupTitle>
                <ul className="space-y-4">
                    {training.map((item) => (
                        <li key={item.course}>
                            <p className="text-[15px] font-medium leading-snug text-primary">{item.course}</p>
                            <p className="mt-0.5 text-[13px] text-gray-500">{item.provider}</p>
                        </li>
                    ))}
                </ul>
            </section>
        </aside>
    );
}

export default function Journey() {
    const { t } = useLang();
    return (
        <section id="Journey" className="border-t border-gray-200/70 py-24 lg:py-32">
            <div className="container mx-auto">
                <Reveal className="mb-14 max-w-2xl">
                    <p className="eyebrow">{t("journey.eyebrow")}</p>
                    <h2 className="section-title mt-3">{t("journey.title")}</h2>
                    <p className="mt-3 text-[16px] text-gray-500">{t("journey.subtitle")}</p>
                </Reveal>

                <div className="grid gap-16 lg:grid-cols-[1fr_340px] lg:gap-20">
                    <div className="flex min-w-0 flex-col gap-16">
                        <Reveal>
                            <GroupTitle count={work.length}>{t("journey.freelance")}</GroupTitle>
                            <div className="flex flex-col gap-12">
                                {work.map((entry) => (
                                    <WorkEntry key={entry.company.en ?? entry.company} entry={entry} />
                                ))}
                            </div>
                        </Reveal>

                        <Reveal>
                            <GroupTitle count={projects.length}>{t("journey.experience")}</GroupTitle>
                            <ul className="-mt-4 divide-y divide-gray-200/80">
                                {projects.map((project, i) => (
                                    <ProjectRow key={project.title} project={project} index={i} />
                                ))}
                            </ul>
                        </Reveal>
                    </div>

                    <Reveal delay={0.08}>
                        <Sidebar />
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
