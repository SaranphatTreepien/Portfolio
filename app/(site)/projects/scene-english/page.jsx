import SideProjectPage from "@/components/SideProjectPage";
import { liveProjects } from "@/data/liveProjects";

const project = liveProjects.find((item) => item.slug === "scene-english");

export const metadata = {
    title: `${project.name} — side project | Saranphat`,
    description: project.description.en,
};

export default function Page() {
    return <SideProjectPage slug="scene-english" />;
}
