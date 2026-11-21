// Cards in the "Live Project" section. Text fields are {th, en}; pick one with useLang().tx().
export const liveProjects = [
    {
        // Demo project: no public site, the card opens a detail page instead of /live/[slug]
        kind: "demo",
        slug: "ai-governance",
        name: "AI Governance Gateway",
        badge: { th: "โปรเจกต์สหกิจ · Demo", en: "Coop Project · Demo" },
        detailHref: "/projects/ai-governance",
        demoUrl: "/demos/ai-governance/simulator.html",
        previewStyle: "agw", // chat screenshot + animated gateway logo
        previewLabel: { th: "ดูเดโม + ดีไซน์ →", en: "Demo + design →" },
        detailLabel: { th: "ดูเดโม + ดีไซน์ทั้งหมด", en: "See the demo + full design" },
        displayUrl: "gateway.example.co.th/chat",
        // Chat screen from design page 5: real values restored for the sender, masked tokens shown below
        poster: "/assets/projects/ai-governance/preview-chat.jpg",
        tagline: {
            th: "ด่านกลางระหว่างพนักงานกับ AI: ตรวจ ปกปิด ส่ง ถอดกลับ แล้วลบ",
            en: "A checkpoint between staff and AI: inspect, mask, send, restore, then delete",
        },
        description: {
            th: "โปรเจกต์สหกิจ: gateway ที่ตั้งอยู่ระหว่างพนักงานกับ LLM ภายนอก ตรวจหาข้อมูลส่วนบุคคลภาษาไทยและความลับ แล้วปกปิดเป็น token อย่าง [PERSON_001] ก่อนส่งออก เมื่อ AI ตอบกลับจึงถอดค่าจริงคืนให้เฉพาะผู้ส่ง ส่วน audit เก็บแค่ metadata ไม่เก็บเนื้อหาแชต",
            en: "Co-op project: a gateway between employees and external LLMs. It detects Thai personal data and secrets and masks them as tokens like [PERSON_001] before anything leaves. When the AI answers, the real values are restored for the sender only, and the audit log keeps metadata, never chat content.",
        },
        stats: [
            { value: "7", label: { th: "ด่านตรวจใน gateway", en: "checks in the gateway" } },
            { value: "15", label: { th: "เคสจำลองในเดโม", en: "simulated cases" } },
            { value: "25+", label: { th: "ค่าย LLM ผ่าน LiteLLM", en: "LLM providers via LiteLLM" } },
        ],
        features: [
            { icon: "🔎", text: { th: "ตรวจจับ PII ไทย (บัตรประชาชน เบอร์โทร ชื่อ) และ secret / API key", en: "Detects Thai PII (ID card, phone, names) and secrets / API keys" } },
            { icon: "🎭", text: { th: "ปกปิดเป็น token ก่อนส่ง แล้วถอดค่าจริงคืนให้ผู้ส่ง", en: "Masks values as tokens before sending, restores them for the sender" } },
            { icon: "🚦", text: { th: "Policy Allow / Mask / Block และ fail closed เมื่อไม่แน่ใจ", en: "Allow / Mask / Block policies, fails closed when unsure" } },
            { icon: "📊", text: { th: "Audit แค่ metadata ดูผ่าน Grafana ขององค์กร", en: "Metadata-only audit, viewed in the company's own Grafana" } },
        ],
        tech: ["FastAPI", "Next.js", "Presidio", "PyThaiNLP", "Redis", "PostgreSQL", "LiteLLM", "Docker"],
    },
    {
        // Freelance work shown as a clickable mock: renamed brand, fictional venues and people
        kind: "demo",
        slug: "travel-plan-booking",
        name: "Travel Plan Booking",
        badge: { th: "ฟรีแลนซ์ · Mock", en: "Freelance · Mock" },
        detailHref: "/projects/travel-plan-booking",
        demoUrl: "/demos/travel-plan-booking/b2c.html",
        displayUrl: "travel-plan-booking · web chat",
        poster: "/assets/projects/travel-plan-booking/preview-chat.jpg",
        previewLabel: { th: "ลองเดโม B2C + B2B →", en: "Try B2C + B2B demo →" },
        detailLabel: { th: "ดูเดโม B2C + B2B", en: "See the B2C + B2B demo" },
        tagline: {
            th: "AI concierge วางทริปและจองโต๊ะจบในแชต พร้อม Merchant Manager ให้ร้านจัดการผ่านแอปแชต",
            en: "An AI concierge that plans trips and books tables in chat, plus a Merchant Manager for shops in their chat apps",
        },
        description: {
            th: "งาน freelance: AI agent สองฝั่ง ฝั่งลูกค้า (B2C) วางแผนเที่ยว แนะนำร้าน และจองโต๊ะทีละขั้นด้วยปุ่มในแชต ฝั่งร้าน (B2B) สร้างหน้าร้าน รับการจอง และได้สรุปผลกับแจ้งเตือนพร้อมเมนูร้านใน LINE, WhatsApp และ Telegram agent คุยได้ทุกภาษา เดโมนี้เป็นแบบจำลองที่กดได้ ชื่อแบรนด์ ร้าน และคนเปลี่ยนเป็นข้อมูลสมมติทั้งหมด",
            en: "Freelance work: AI agents on two sides. Customers (B2C) plan trips, get restaurant picks and book a table step by step with buttons in chat. Shops (B2B) set up their page, take bookings and get summaries, alerts and a shop menu in LINE, WhatsApp and Telegram. The agent speaks any language. This is a clickable mock: brand, venues and people are all fictional.",
        },
        stats: [
            { value: "4", label: { th: "ช่องทาง Web · LINE · WhatsApp · Telegram", en: "channels: Web · LINE · WhatsApp · Telegram" } },
            { value: "2", label: { th: "ฝั่ง B2C · B2B", en: "sides: B2C · B2B" } },
            { value: { th: "3 ภาษา", en: "3 langs" }, label: { th: "ไทย · English · 中文 ในเดโม (agent รับทุกภาษา)", en: "Thai · English · 中文 in the demo (agent takes any language)" } },
        ],
        features: [
            { icon: "🗺️", text: { th: "วางแผนทริปหลายวัน พร้อมร้านแนะนำทุกมื้อ", en: "Plans multi-day trips with a restaurant for every meal" } },
            { icon: "📅", text: { th: "จองโต๊ะด้วยปุ่ม: จำนวนคน วัน เวลา แล้วยืนยัน", en: "Book with buttons: party size, day, time, confirm" } },
            { icon: "🏪", text: { th: "ร้านสร้างหน้าร้าน ตั้งรอบเวลา และรับการจอง", en: "Shops set up their page, time slots and take bookings" } },
            { icon: "🔔", text: { th: "แจ้งเตือนและสรุปยอดเข้า LINE / WhatsApp / Telegram", en: "Alerts and daily summaries in LINE / WhatsApp / Telegram" } },
        ],
        tech: ["Gemini", "LangChain", "Redis", "PostgreSQL", "LINE", "WhatsApp", "Telegram"],
    },
    {
        slug: "foodroll",
        name: "FoodRoll BKK",
        url: "https://foodroll-bkk.vercel.app/",
        displayUrl: "foodroll-bkk.vercel.app",
        poster: "/assets/projects/foodroll.png",
        tagline: { th: "วันนี้กินอะไรดี? — ให้ดวงตัดสิน", en: "What should I eat today? Let luck decide" },
        description: {
            th: "เว็บสุ่มร้านอาหารในกรุงเทพสไตล์กาชา ดึงข้อมูลร้านจาก Google Maps กว่า 100,000 ร้าน แทนที่จะไล่ดูรายการร้านยาวๆ แค่กดหมุนแล้วได้การ์ดร้านพร้อมระดับความหายาก ตั้งแต่ Common จนถึง Legendary",
            en: "A gacha-style restaurant picker for Bangkok, built on 100,000+ places from Google Maps. Instead of scrolling long lists, spin once and get a restaurant card with a rarity from Common to Legendary.",
        },
        stats: [
            { value: "100,000+", label: { th: "ร้านจาก Google Maps", en: "places from Google Maps" } },
            { value: "4", label: { th: "ระดับ Rarity", en: "rarity tiers" } },
            { value: "1–5 km", label: { th: "ค้นหาจากตำแหน่งจริง", en: "search from your location" } },
        ],
        features: [
            { icon: "🎲", text: { th: "หมุนการ์ดร้านแบบกาชา พร้อมระบบ Rarity", en: "Gacha-style spins with a rarity system" } },
            { icon: "📍", text: { th: "กรองตามระยะทาง 1 / 3 / 5 km จากตำแหน่งจริง", en: "Filter by 1 / 3 / 5 km from where you are" } },
            { icon: "🍜", text: { th: "เลือกหมวด ร้านอาหาร คาเฟ่ บาร์ ปิ้งย่าง", en: "Pick a category: restaurants, cafés, bars, BBQ" } },
            { icon: "🗺️", text: { th: "ปักหมุดบนแผนที่ และนำทางด้วย Google Maps", en: "Pins on a map, directions via Google Maps" } },
        ],
        tech: ["Next.js 16", "React 19", "Tailwind CSS 4", "Framer Motion", "Supabase", "PostGIS", "Leaflet", "Vercel"],
    },
];

// Only projects with a real public site get a full-screen /live/[slug] page
export const livePages = liveProjects.filter((project) => project.kind !== "demo");

export const getLiveProject = (slug) => livePages.find((project) => project.slug === slug);
