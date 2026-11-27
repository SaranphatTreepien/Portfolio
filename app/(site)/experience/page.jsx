import ProjectsIndex from "@/components/projects/ProjectsIndex";

export const metadata = {
    title: "Experience · Saranphat",
    description: "Internship, freelance, side projects and coursework by Saranphat Treepian.",
    alternates: { canonical: "/experience" },
};

export default function ExperiencePage() {
    return <ProjectsIndex />;
}
