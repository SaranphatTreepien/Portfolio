import TravelPlanBookingPage from "@/components/TravelPlanBookingPage";
import { liveProjects } from "@/data/liveProjects";

const project = liveProjects.find((item) => item.slug === "travel-plan-booking");

export const metadata = {
    title: `${project.name} — Freelance mock | Saranphat`,
    description: project.description.en,
};

export default function Page() {
    return <TravelPlanBookingPage />;
}
