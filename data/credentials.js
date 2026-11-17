export const credlyUsername = "saranphat-treepian";
export const credlyProfileUrl = `https://www.credly.com/users/${credlyUsername}`;

export const googleSkillsProfile = {
    url: "https://www.skills.google/public_profiles/a5a766a1-9ea1-43fd-94af-736cee17ba2c",
    league: "Bronze League",
    points: 3549,
};

// Google Skills badges that are never issued to Credly (completion badges).
// Add new ones here: { name, issuedAt: "YYYY-MM-DD" } — optional `image` (URL) replaces the drawn completion badge.
export const manualBadges = [
    { name: "AI Boost Bites: Automate Tasks with Gemini and Apps Script", issuedAt: "2026-03-27" },
    { name: "Streamline App Development with Gemini Code Assist", issuedAt: "2026-03-27" },
    { name: "Gemini for Application Developers", issuedAt: "2026-03-27" },
    { name: "Model Armor: Securing AI Deployments", issuedAt: "2026-03-26" },
    { name: "Introduction to Security in the World of AI", issuedAt: "2026-03-25" },
    { name: "Gemini for Cloud Architects", issuedAt: "2026-03-23" },
    { name: "Gemini for Security Engineers", issuedAt: "2026-03-23" },
    { name: "Gemini for Network Engineers", issuedAt: "2026-03-23" },
    { name: "Gemini for DevOps Engineers", issuedAt: "2026-03-23" },
].map((badge) => ({
    issuer: "Google Cloud",
    type: "completion",
    url: googleSkillsProfile.url,
    ...badge,
}));
