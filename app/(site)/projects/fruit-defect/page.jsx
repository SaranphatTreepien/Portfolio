import FruitDefectPage from "@/components/FruitDefectPage";
import { liveProjects } from "@/data/liveProjects";

const project = liveProjects.find((item) => item.slug === "fruit-defect");

export const metadata = {
    title: `${project.name} — CPE447 team project | Saranphat`,
    description: project.description.en,
};

export default function Page() {
    return <FruitDefectPage />;
}
