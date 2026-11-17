import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowLeft, FiExternalLink } from "react-icons/fi";
import { getLiveProject, liveProjects } from "@/data/liveProjects";

export function generateStaticParams() {
    return liveProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const project = getLiveProject(slug);
    if (!project) return {};
    return {
        title: `${project.name} — Live | Saranphat`,
        description: project.description,
    };
}

const floatingButton =
    "fixed bottom-4 z-10 flex items-center gap-2 rounded-full border border-white/15 px-3 py-3 text-sm font-semibold text-white shadow-lg transition-colors sm:px-4 sm:py-2.5";

export default async function LiveProjectPage({ params }) {
    const { slug } = await params;
    const project = getLiveProject(slug);
    if (!project) notFound();

    return (
        <main className="fixed inset-0 bg-[#0b0a12]">
            <iframe
                src={project.url}
                title={`${project.name} live demo`}
                allow="geolocation; clipboard-write"
                className="block h-full w-full border-0"
            />

            {/* Bottom corners: the embedded site already uses its own top-corner buttons */}
            <Link href="/#Live" className={`${floatingButton} left-4 bg-black/75 hover:bg-black`} aria-label="กลับ Portfolio">
                <FiArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Portfolio</span>
            </Link>
            <a
                href={project.url}
                className={`${floatingButton} right-4 bg-gradient-to-r from-[#a855f7] to-[#ec4899] hover:opacity-90`}
                aria-label="ไปเว็บจริง"
            >
                <FiExternalLink className="h-4 w-4" />
                <span className="hidden sm:inline">ไปเว็บจริง</span>
            </a>
        </main>
    );
}
