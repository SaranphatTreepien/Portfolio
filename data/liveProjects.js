export const liveProjects = [
    {
        slug: "foodroll",
        name: "FoodRoll BKK",
        url: "https://foodroll-bkk.vercel.app/",
        displayUrl: "foodroll-bkk.vercel.app",
        poster: "/assets/projects/foodroll.png",
        tagline: "วันนี้กินอะไรดี? — ให้ดวงตัดสิน",
        description:
            "เว็บสุ่มร้านอาหารในกรุงเทพสไตล์กาชา ดึงข้อมูลร้านจาก Google Maps กว่า 100,000 ร้าน แทนที่จะไล่ดูรายการร้านยาวๆ แค่กดหมุนแล้วได้การ์ดร้านพร้อมระดับความหายาก ตั้งแต่ Common จนถึง Legendary",
        stats: [
            { value: "100,000+", label: "ร้านจาก Google Maps" },
            { value: "4", label: "ระดับ Rarity" },
            { value: "1–5 km", label: "ค้นหาจากตำแหน่งจริง" },
        ],
        features: [
            { icon: "🎲", text: "หมุนการ์ดร้านแบบกาชา พร้อมระบบ Rarity" },
            { icon: "📍", text: "กรองตามระยะทาง 1 / 3 / 5 km จากตำแหน่งจริง" },
            { icon: "🍜", text: "เลือกหมวด ร้านอาหาร คาเฟ่ บาร์ ปิ้งย่าง" },
            { icon: "🗺️", text: "ปักหมุดบนแผนที่ และนำทางด้วย Google Maps" },
        ],
        tech: ["Next.js 16", "React 19", "Tailwind CSS 4", "Framer Motion", "Supabase", "PostGIS", "Leaflet", "Vercel"],
    },
];

export const getLiveProject = (slug) => liveProjects.find((project) => project.slug === slug);
