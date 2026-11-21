import AiGovernancePage from "@/components/AiGovernance/AiGovernancePage";
import { liveProjects } from "@/data/liveProjects";

const project = liveProjects.find((item) => item.slug === "ai-governance");

export const metadata = {
    title: `${project.name} — Demo & Product design | Saranphat`,
    description: project.description.en,
};

export default function Page() {
    return <AiGovernancePage />;
}
