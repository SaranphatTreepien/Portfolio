// Project types for the Work section and /projects. `color` is for text and dots on white, `soft` for chip backgrounds.
export const PROJECT_CATEGORIES = {
    internship: { label: { th: "สหกิจ / ฝึกงาน", en: "Internship" }, color: "#1a8a81", soft: "#e3f6f3" },
    freelance: { label: { th: "ฟรีแลนซ์", en: "Freelance" }, color: "#6d4ed8", soft: "#efebfd" },
    side: { label: { th: "โปรเจกต์ส่วนตัว", en: "Side project" }, color: "#d9622b", soft: "#fdeee5" },
    coursework: { label: { th: "งานวิชาเรียน", en: "Coursework" }, color: "#2f6fd6", soft: "#e8f0fc" },
};

// Real work first: internship, then freelance, then side projects, then coursework
export const CATEGORY_ORDER = ["internship", "freelance", "side", "coursework"];

export const sortByCategory = (projects) =>
    [...projects].sort((a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category));

// Where a project card leads: demos open their case-study page, live sites the full-screen /live page
export const projectHref = (project) => (project.kind === "demo" ? project.detailHref : `/live/${project.slug}`);
