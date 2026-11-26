import ProjectsIndex from "@/components/projects/ProjectsIndex";

export const metadata = {
    title: "Projects · Saranphat",
    description: "Co-op, freelance, side projects and coursework by Saranphat Treepian.",
    alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
    return <ProjectsIndex />;
}
