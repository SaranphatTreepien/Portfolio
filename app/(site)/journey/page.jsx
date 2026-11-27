import Journey from "@/components/Journey";

export const metadata = {
    title: "Journey · Saranphat",
    description: "Work, projects, education and skills of Saranphat Treepian.",
    alternates: { canonical: "/journey" },
};

export default function JourneyPage() {
    return (
        <main>
            <Journey />
        </main>
    );
}
