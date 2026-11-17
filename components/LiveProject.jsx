import Image from "next/image";
import { FiExternalLink, FiLock, FiPlay, FiMaximize2 } from "react-icons/fi";
import AnimatedText from "./AnimatedText";
import { liveProjects } from "@/data/liveProjects";

const project = liveProjects[0];
const livePageHref = `/live/${project.slug}`;

export default function LiveProject() {
    return (
        <section id="Live" className="pt-24">
            <div className="container mx-auto">
                <div className="mb-10 flex flex-col items-center gap-2 text-center lg:items-start lg:text-left">
                    <AnimatedText text="Live Project" textStyles="h2" />
                    <p className="text-gray-500">เว็บจริงที่ใช้งานได้ — กดแล้วเปิดเล่นเต็มจอในแท็บใหม่</p>
                </div>

                <div className="grid items-stretch gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] xl:gap-14">
                    {/* Browser mockup → opens full-screen live page in a new tab */}
                    <a
                        href={livePageHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`เล่น ${project.name} เต็มจอในแท็บใหม่`}
                        className="group flex flex-col overflow-hidden rounded-2xl border border-gray-800 bg-[#0b0a12] shadow-[0_24px_60px_-20px_rgba(76,29,149,0.45)] transition-shadow hover:shadow-[0_28px_70px_-18px_rgba(168,85,247,0.6)]"
                    >
                        <div className="flex h-11 shrink-0 items-center gap-3 border-b border-white/10 bg-[#15131f] px-4">
                            <div className="flex gap-1.5">
                                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                                <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                            </div>
                            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-gray-400">
                                <FiLock className="h-3 w-3 shrink-0 text-[#28c840]" />
                                <span className="truncate">{project.displayUrl}</span>
                            </div>
                            <FiMaximize2 className="h-4 w-4 text-gray-500 group-hover:text-white transition-colors" />
                        </div>

                        <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-0 lg:flex-1">
                            <Image
                                src={project.poster}
                                alt={`${project.name} preview`}
                                fill
                                sizes="(max-width: 1024px) 100vw, 60vw"
                                className="object-cover object-top"
                            />
                            <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                            <span className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 pb-8 md:pb-10">
                                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#a855f7] to-[#ec4899] text-white shadow-[0_0_40px_rgba(217,70,239,0.55)] transition-transform duration-200 group-hover:scale-110">
                                    <FiPlay className="ml-1 h-7 w-7 fill-white" />
                                </span>
                                <span className="rounded-full bg-black/70 px-4 py-1.5 text-sm font-semibold text-white">
                                    เล่นเต็มจอ ↗
                                </span>
                            </span>
                        </div>
                    </a>

                    {/* Info */}
                    <div className="flex flex-col gap-4">
                        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#d946ef]/30 bg-[#d946ef]/10 px-3 py-1 text-xs font-bold tracking-wide text-[#a21caf]">
                            <span className="h-2 w-2 rounded-full bg-[#22c55e]" /> LIVE · Side Project
                        </span>
                        <div>
                            <h3 className="text-2xl font-bold text-primary xl:text-3xl">{project.name}</h3>
                            <p className="mt-1 text-sm font-medium text-[#a21caf]">{project.tagline}</p>
                        </div>
                        <p className="text-sm leading-6 text-gray-600">{project.description}</p>

                        {project.stats && (
                            <div className="grid grid-cols-3 divide-x divide-gray-200 rounded-2xl border border-gray-200 bg-white py-3 shadow-sm">
                                {project.stats.map((stat) => (
                                    <div key={stat.label} className="px-2 text-center">
                                        <div className="bg-gradient-to-r from-[#a855f7] to-[#ec4899] bg-clip-text text-lg font-extrabold text-transparent xl:text-xl">
                                            {stat.value}
                                        </div>
                                        <div className="text-[11px] leading-4 text-gray-500">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <ul className="grid gap-x-4 gap-y-1.5 sm:grid-cols-2">
                            {project.features.map((feature) => (
                                <li key={feature.text} className="flex gap-2 text-sm leading-6 text-gray-600">
                                    <span>{feature.icon}</span>
                                    <span>{feature.text}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="flex flex-wrap gap-2">
                            {project.tech.map((tech) => (
                                <span key={tech} className="rounded-full border border-[#7edad2]/40 bg-[#7edad2]/10 px-3 py-1 text-xs font-semibold text-[#1f7f77]">
                                    {tech}
                                </span>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:border-primary hover:text-primary transition-colors"
                            >
                                <FiExternalLink /> ไปเว็บจริง
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
