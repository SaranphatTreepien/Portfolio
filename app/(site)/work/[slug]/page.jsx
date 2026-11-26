import ExperienceEditor from "@/components/Work/ExperienceEditor"; // เรียกใช้ไฟล์ที่เราเพิ่งสร้าง

export default async function ProjectPage({ params }) {
  // 1. รอรับค่า slug จาก URL (เช่น future-project-x)
  const { slug } = await params; 

  // 2. ส่ง slug ไปให้ตัว Editor ทำงานต่อ
  return <ExperienceEditor slug={slug} />;
}