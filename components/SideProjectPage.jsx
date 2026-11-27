"use client";

import { FiFilm, FiShare2, FiUser, FiMaximize2, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import { ProjectTopBar, ProjectIntro, SectionHeading } from "@/components/ProjectDetail";
import { useLang } from "@/components/LanguageProvider";
import { liveProjects } from "@/data/liveProjects";
import { sideProjectPages } from "@/data/sideProjects";

// Detail page for a personal tool: recorded demo clips, what runs each part, and what I built.
// Same layout as the other /projects/* pages; content comes from data/sideProjects.js.

const sectionNav = [
    { href: "#demo", label: { th: "เดโม", en: "Demo" }, icon: FiFilm },
    { href: "#how", label: { th: "ทำงานยังไง", en: "How it works" }, icon: FiShare2 },
    { href: "#built", label: { th: "สิ่งที่ผมทำ", en: "What I built" }, icon: FiUser },
];

function Clip({ clip }) {
    const { tx } = useLang();
    return (
        <figure className="flex flex-col gap-3">
            <a
                href={clip.src}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block overflow-hidden rounded-xl border border-gray-200 bg-[#0b0a12] shadow-[0_18px_50px_-24px_rgba(16,21,31,0.35)]"
            >
                {/* Plain <img> so the animated WebP keeps playing */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={clip.src} alt={tx(clip.title)} loading="lazy" width={1280} height={800} className="block h-auto w-full" />
                <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    <FiMaximize2 className="h-4 w-4" />
                </span>
            </a>
            <figcaption className="flex flex-col gap-1">
                <span className="text-base font-semibold text-primary">{tx(clip.title)}</span>
                <span className="text-sm leading-6 text-gray-500">{tx(clip.caption)}</span>
            </figcaption>
        </figure>
    );
}

export default function SideProjectPage({ slug }) {
    const { tx } = useLang();
    const project = liveProjects.find((item) => item.slug === slug);
    const page = sideProjectPages[slug];

    return (
        <main className="min-h-screen pb-24">
            <ProjectTopBar nav={sectionNav} />
            <ProjectIntro project={project} note={page.note} />

            <section id="demo" className="container mx-auto scroll-mt-20 pt-16">
                <SectionHeading
                    title={{ th: "เดโมจากแอปจริง", en: "Recorded from the real app" }}
                    text={{ th: "กดที่คลิปเพื่อเปิดขนาดเต็ม", en: "Click a clip to open it full size" }}
                />
                <div className="grid gap-10 md:grid-cols-2">
                    {page.clips.map((clip) => (
                        <Clip key={clip.src} clip={clip} />
                    ))}
                    {page.stills?.map((still) => (
                        <Clip key={still.src} clip={still} />
                    ))}
                </div>
            </section>

            <section id="how" className="container mx-auto scroll-mt-20 pt-20">
                <SectionHeading title={page.flowTitle} text={page.flowText} />
                <ol className="grid gap-3 md:grid-cols-5">
                    {page.flow.map((step, i) => (
                        <li key={i} className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4">
                            <span className="font-mono text-xs text-gray-400">{String(i + 1).padStart(2, "0")}</span>
                            <b className="text-sm text-primary">{tx(step.who)}</b>
                            <span className="text-sm leading-6 text-gray-500">{tx(step.text)}</span>
                        </li>
                    ))}
                </ol>
            </section>

            <section id="built" className="container mx-auto scroll-mt-20 pt-20">
                <SectionHeading title={{ th: "สิ่งที่ผมทำ", en: "What I built" }} text={{ th: "ทำคนเดียวทั้งหมด", en: "All of it, on my own" }} />
                <ul className="grid gap-x-10 gap-y-3 md:grid-cols-2">
                    {page.built.map((item) => (
                        <li key={item.en} className="flex gap-3 border-b border-gray-100 pb-3 text-[15px] leading-7 text-gray-600">
                            <span className="text-gray-400">–</span>
                            <span>{tx(item)}</span>
                        </li>
                    ))}
                </ul>

                <div className="mt-16 flex justify-center">
                    <Link
                        href="/experience"
                        className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-primary hover:text-primary"
                    >
                        <FiArrowLeft /> {tx({ th: "กลับไปหน้าประสบการณ์", en: "Back to experience" })}
                    </Link>
                </div>
            </section>
        </main>
    );
}
