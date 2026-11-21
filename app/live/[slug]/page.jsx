import { notFound } from "next/navigation";
import LiveButtons from "@/components/LiveButtons";
import { getLiveProject, livePages } from "@/data/liveProjects";

export function generateStaticParams() {
    return livePages.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const project = getLiveProject(slug);
    if (!project) return {};
    return {
        title: `${project.name} — Live | Saranphat`,
        description: project.description.en,
    };
}

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

            <LiveButtons url={project.url} />
        </main>
    );
}
