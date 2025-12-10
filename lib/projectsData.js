// lib/projectsData.js

// 1. Categories (Tabs) - เรียงตามที่คุณต้องการ
export const categories = [
  { name: "ALL", value: "all" },
  { name: "2569", value: "2569" },
  { name: "2568", value: "2568" },
  { name: "2567", value: "2567" },
  { name: "2566", value: "2566" },
];

// 2. ข้อมูล Projects
// ปรับปรุง: เรียงลำดับ Array ตามวันที่จริง (date) จากล่าสุด -> เก่าสุด
export const projects = [
  // --- ปี 2569 (2026) ---
  {
    slug: "future-project-x",
    category: "2569",
    date: "2026-03-01", // เพิ่มวันที่เพื่อใช้ Sort (สมมติว่าเป็น มี.ค.)
    img: "/assets/work/thumb-1.png",
    title: "Future Project X",
    info: { year: "2026", role: "Lead Dev", tools: "Next.js 16", duration: "3 Months" }
  },

  // --- ปี 2568 (2025) ---
  {
    slug: "alpha-platform",
    category: "2568",
    date: "2025-06-15",
    img: "/assets/work/thumb-1.png",
    title: "Alpha Platform",
    info: { year: "2025", role: "Fullstack", tools: "React", duration: "2 Months" }
  },

  // --- ปี 2567 (2024) ---
  {
    slug: "luminex-ui-kit",
    category: "2567",
    date: "2024-02-10",
    img: "/assets/work/thumb-2.png",
    title: "Luminex UI Kit",
    info: { year: "2024", role: "UI Design", tools: "Figma", duration: "2 Weeks" }
  },

  // --- ปี 2566 (2023) ---
  // สมมติ Nebula ทำช่วงปลายปี (พ.ย.)
  {
    slug: "nebula-dashboard",
    category: "2566",
    date: "2023-11-20",
    img: "/assets/work/thumb-3.png",
    title: "Nebula Dashboard",
    info: { year: "2023", role: "Dev", tools: "Next.js", duration: "1 Month" }
  },
  // สมมติ Velox ทำช่วงต้นปี (ม.ค.) -> จึงอยู่ด้านล่าง Nebula
  {
    slug: "velox-app",
    category: "2566",
    date: "2023-01-15",
    img: "/assets/work/thumb-4.png",
    title: "Velox APP",
    info: { year: "2023", role: "Frontend", tools: "Vue", duration: "3 Weeks" }
  },
];

// (Optional) ถ้าต้องการฟังก์ชันที่มั่นใจว่าเรียงถูกต้องเสมอ 100% เวลาเรียกใช้
// คุณสามารถ export ฟังก์ชันนี้ไปใช้แทน array ดิบๆ ได้ครับ
export const getSortedProjects = () => {
  return projects.sort((a, b) => new Date(b.date) - new Date(a.date));
};