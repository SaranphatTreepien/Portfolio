"use client";

import { FiDownload, FiMonitor, FiSmartphone, FiPlay } from "react-icons/fi";
import DesignGallery from "./DesignGallery";
import { ProjectTopBar, ProjectIntro, SectionHeading, DemoFrame, BackLinks } from "@/components/ProjectDetail";
import { useLang } from "@/components/LanguageProvider";
import { liveProjects } from "@/data/liveProjects";
import { demos, designPdf, webDesignPages, mobileDesignPages } from "@/data/aiGovernance";

const project = liveProjects.find((item) => item.slug === "ai-governance");

const sectionNav = [
    { href: "#demo", label: "Demo", icon: FiPlay },
    { href: "#design-web", label: { th: "Design · เว็บ", en: "Design · Web" }, icon: FiMonitor },
    { href: "#design-mobile", label: { th: "Design · มือถือ", en: "Design · Mobile" }, icon: FiSmartphone },
];

export default function AiGovernancePage() {
    const { tx } = useLang();
    const pdfButton = (
        <a
            href={designPdf}
            download
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 hover:border-primary hover:text-primary transition-colors"
            aria-label={tx({ th: "ดาวน์โหลด Product design (PDF)", en: "Download the product design (PDF)" })}
        >
            <FiDownload className="h-4 w-4" />
            <span className="hidden sm:inline">PDF</span>
        </a>
    );

    return (
        <main className="min-h-screen pb-24">
            <ProjectTopBar nav={sectionNav} action={pdfButton} />
            <ProjectIntro
                project={project}
                note={{
                    th: "ข้อมูลทุกชิ้นในเดโมและดีไซน์เป็นข้อมูลสังเคราะห์ ไม่มีข้อมูลจริงของบุคคลหรือองค์กร",
                    en: "All data in the demos and designs is synthetic. No real people or companies.",
                }}
            />

            <section id="demo" className="container mx-auto scroll-mt-20 pt-16">
                <SectionHeading
                    eyebrow="01 · Demo"
                    title={{ th: "ลองเล่นเดโม", en: "Try the demo" }}
                    text={{
                        th: "สองหน้าที่ใช้ตอนนำเสนอ กดเล่นในหน้านี้ได้เลย หรือเปิดเต็มจอในแท็บใหม่ (เนื้อหาเดโมเป็นภาษาไทย)",
                        en: "The two pages used in the presentation. Play them here or open full screen in a new tab. (The demo content is in Thai.)",
                    }}
                />
                <div className="flex flex-col gap-12">
                    {demos.map((demo) => (
                        <DemoFrame key={demo.id} demo={demo} projectName={project.name} />
                    ))}
                </div>
            </section>

            <section id="design-web" className="container mx-auto scroll-mt-20 pt-20">
                <SectionHeading
                    eyebrow={{ th: "02 · Product design · เว็บ", en: "02 · Product design · Web" }}
                    title={{ th: "ออกแบบหน้าจอ: เว็บ", en: "Screen design: Web" }}
                    text={{
                        th: `${webDesignPages.length} หน้า เรียงตามเล่ม: ภาพรวม → พนักงาน (ขั้น 1-7) → Admin (ขั้น 8-12) → Observability → สรุป · คลิกรูปเพื่อเปิดภาพเต็ม`,
                        en: `${webDesignPages.length} pages in book order: overview → employee (steps 1-7) → admin (steps 8-12) → observability → summary · click an image to open it full size`,
                    }}
                    action={
                        <a
                            href={designPdf}
                            download
                            className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:border-primary hover:text-primary transition-colors"
                        >
                            <FiDownload /> {tx({ th: "ดาวน์โหลดเล่ม PDF", en: "Download PDF" })}
                        </a>
                    }
                />
                <DesignGallery pages={webDesignPages} />
            </section>

            <section id="design-mobile" className="container mx-auto scroll-mt-20 pt-20">
                <SectionHeading
                    eyebrow={{ th: "03 · Product design · มือถือ", en: "03 · Product design · Mobile" }}
                    title={{ th: "ออกแบบหน้าจอ: มือถือ", en: "Screen design: Mobile" }}
                    text={{
                        th: "ใช้งานบนโทรศัพท์ผ่านด่านตรวจชุดเดียวกับเว็บ · คลิกรูปเพื่อเปิดภาพเต็ม",
                        en: "On the phone, through the same checks as the web · click an image to open it full size",
                    }}
                />
                <DesignGallery pages={mobileDesignPages} />
                <BackLinks demoHref="#demo" />
            </section>
        </main>
    );
}
