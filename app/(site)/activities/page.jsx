import Work from "@/components/Work/Work";

export const metadata = {
    title: "Activities · Saranphat",
    description: "Events, competitions, labs and certificates by Saranphat Treepian, by year.",
    alternates: { canonical: "/activities" },
};

// The experience log (events, labs, certificates) on its own page, so the home page stays short
export default function ActivitiesPage() {
    return (
        <main id="Activities">
            <Work />
        </main>
    );
}
