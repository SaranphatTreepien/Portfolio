import SideProjectPage from "@/components/SideProjectPage";
import { liveProjects } from "@/data/liveProjects";

const project = liveProjects.find((item) => item.slug === "ava");

export const metadata = {
    title: `${project.name} — side project | Saranphat`,
    description: project.description.en,
};

export default function Page() {
    return <SideProjectPage slug="ava" />;
}
