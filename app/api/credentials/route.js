import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { credlyUsername, manualBadges } from "@/data/credentials";

const ONE_DAY = 60 * 60 * 24;

const normalize = (text = "") => text.toLowerCase().replace(/[^a-z0-9ก-๙]/g, "");

const fetchCertificateProjects = async () => {
    try {
        const client = await clientPromise;
        const projects = await client
            .db("my_portfolio")
            .collection("projects")
            .find(
                { $or: [{ isCertificate: true }, { specialTopics: "Certificate" }, { specialTopic: "Certificate" }] },
                { projection: { title: 1, slug: 1, img: 1, createdAt: 1 } }
            )
            .toArray();
        return projects.map((project) => ({
            id: `cert-${project.slug}`,
            name: project.title?.trim() || project.slug,
            issuer: "Certificate",
            issuedAt: project.createdAt ? new Date(project.createdAt).toISOString().slice(0, 10) : "",
            image: project.img,
            url: `/work/${project.slug}`,
            type: "certificate",
        }));
    } catch {
        return [];
    }
};

const shortIssuer = (name = "") => {
    if (/amazon|aws/i.test(name)) return "AWS";
    if (/google/i.test(name)) return "Google Cloud";
    return name;
};

const fetchCredlyBadges = async () => {
    try {
        const res = await fetch(`https://www.credly.com/users/${credlyUsername}/badges.json`, {
            headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0 (portfolio badge widget)" },
            next: { revalidate: ONE_DAY },
        });
        if (!res.ok) return [];
        const json = await res.json();
        return (json.data || [])
            .filter((badge) => badge.public !== false && badge.state === "accepted")
            .map((badge) => ({
                id: badge.id,
                name: badge.badge_template?.name?.replace(/\s+Skill Badge$/i, "") || "Badge",
                issuer: shortIssuer(badge.issuer?.entities?.find((e) => e.primary)?.entity?.name),
                issuedAt: badge.issued_at_date,
                image: badge.badge_template?.image_url,
                url: `https://www.credly.com/badges/${badge.id}/public_url`,
                type: "credly",
            }));
    } catch {
        return [];
    }
};

export async function GET() {
    const [credlyBadges, certificates] = await Promise.all([fetchCredlyBadges(), fetchCertificateProjects()]);

    // A certificate already verifiable on Credly (e.g. AWS Academy) is shown once, as the Credly badge.
    const credlyNames = credlyBadges.map((badge) => normalize(badge.name));
    const uniqueCertificates = certificates.filter((cert) => !credlyNames.some((name) => name.includes(normalize(cert.name))));

    const badges = [
        ...credlyBadges,
        ...manualBadges.map((badge, i) => ({ id: `manual-${i}`, ...badge })),
        ...uniqueCertificates,
    ].sort((a, b) =>
        String(b.issuedAt).localeCompare(String(a.issuedAt))
    );

    return NextResponse.json(badges, {
        headers: { "Cache-Control": `public, max-age=0, s-maxage=${ONE_DAY}, stale-while-revalidate=${ONE_DAY}` },
    });
}
