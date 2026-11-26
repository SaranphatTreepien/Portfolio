import SmartClassroomPage from "@/components/SmartClassroomPage";
import { liveProjects } from "@/data/liveProjects";

const project = liveProjects.find((item) => item.slug === "smart-classroom");

export const metadata = {
    title: `${project.name} — HMI group project | Saranphat`,
    description: project.description.en,
};

export default function Page() {
    return <SmartClassroomPage />;
}
