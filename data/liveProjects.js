// Cards in the "Live Project" section. Text fields are {th, en}; pick one with useLang().tx().
export const liveProjects = [
    {
        // Demo project: no public site, the card opens a detail page instead of /live/[slug]
        kind: "demo",
        slug: "ai-governance",
        category: "internship", // internship | freelance | side | coursework (lib/projectMeta.js)
        role: { th: "สหกิจศึกษา · เดโม", en: "Co-op · Demo" },
        featured: true, // shown on the home page
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
            { text: { th: "ตรวจจับ PII ไทย (บัตรประชาชน เบอร์โทร ชื่อ) และ secret / API key", en: "Detects Thai PII (ID card, phone, names) and secrets / API keys" } },
            { text: { th: "ปกปิดเป็น token ก่อนส่ง แล้วถอดค่าจริงคืนให้ผู้ส่ง", en: "Masks values as tokens before sending, restores them for the sender" } },
            { text: { th: "Policy Allow / Mask / Block และ fail closed เมื่อไม่แน่ใจ", en: "Allow / Mask / Block policies, fails closed when unsure" } },
            { text: { th: "Audit แค่ metadata ดูผ่าน Grafana ขององค์กร", en: "Metadata-only audit, viewed in the company's own Grafana" } },
        ],
        tech: ["FastAPI", "Next.js", "Presidio", "PyThaiNLP", "Redis", "PostgreSQL", "LiteLLM", "Docker"],
    },
    {
        // Course team project: no public site, the card opens a detail page with GIFs and the GitHub repo
        kind: "demo",
        slug: "fruit-defect",
        category: "coursework", // internship | freelance | side | coursework (lib/projectMeta.js)
        role: { th: "ทีม 4 คน · ผมดูแล Platform & Dashboard", en: "Team of 4 · I owned Platform & Dashboard" },
        name: "CIRA CORE Fruit Defect Sorter",
        badge: { th: "โปรเจกต์ทีม CPE447 · Platform & Dashboard", en: "CPE447 Team Project · Platform & Dashboard" },
        detailHref: "/projects/fruit-defect",
        repoUrl: "https://github.com/SaranphatTreepien/cira-fruit-defect-dashboard",
        displayUrl: "fruit-defect · dashboard (Next.js)",
        poster: "/assets/projects/fruit-defect/system-diagram.jpg",
        previewLabel: { th: "ดูเดโม + สถาปัตยกรรม →", en: "Demo + architecture →" },
        detailLabel: { th: "ดูเดโมและรายละเอียด", en: "See the demo and details" },
        tagline: {
            th: "Edge AI คัดผลไม้ดี/เสียบนสายพาน แล้วส่งผลขึ้น Dashboard แบบ real-time",
            en: "Edge AI sorts good / defective fruit on a conveyor and streams results to a real-time dashboard",
        },
        description: {
            th: "โปรเจกต์ทีม 4 คน ผมรับส่วน Platform & Dashboard: โมเดลใน CiRA CORE ตรวจส้ม/แอปเปิลบนสายพาน แล้วส่ง 1 event ต่อผลไม้ผ่าน MQTT ฝั่งผมทำ adapter ที่ตรวจและกันข้อมูลซ้ำก่อนลง PostgreSQL, เว็บ Next.js ที่แสดงผล real-time (มีฉาก 3D), log, รอบการทำงาน, alert และ Telegram bot ที่ใช้ Gemini สรุปสถานการณ์ ทั้งหมดรันใน Docker",
            en: "A 4-person team project where I owned Platform & Dashboard. A model in CiRA CORE inspects oranges / apples on a conveyor and sends one event per fruit over MQTT. I built the adapter that validates and de-duplicates events into PostgreSQL, the Next.js dashboard with a real-time (and 3D) view, logs, runs, alerts, and a Telegram bot that uses Gemini to summarise what's happening. Everything runs in Docker.",
        },
        stats: [
            { value: "1–3 s", label: { th: "จาก CiRA CORE ถึงหน้าจอ", en: "from CiRA CORE to screen" } },
            { value: "7", label: { th: "หน้าหลักใน Dashboard", en: "dashboard pages" } },
            { value: "7", label: { th: "service ใน Docker Compose", en: "services in Docker Compose" } },
        ],
        features: [
            { text: { th: "รับ event + heartbeat จาก CiRA CORE ผ่าน MQTT", en: "Takes events + heartbeats from CiRA CORE over MQTT" } },
            { text: { th: "Adapter ตรวจ payload กันนับซ้ำ batch insert ทนล่ม", en: "Adapter validates payloads, de-duplicates, batch-inserts, survives outages" } },
            { text: { th: "Live: ผลไม้วิ่งบนสายพาน 2D / 3D ตามเวลาจริง", en: "Live: fruit moves along a 2D / 3D belt in real time" } },
            { text: { th: "Alert + รายงานรายวัน + Telegram bot สรุปด้วย Gemini", en: "Alerts, daily reports and a Telegram bot with Gemini summaries" } },
        ],
        tech: ["CiRA CORE", "MQTT", "Python", "PostgreSQL", "Next.js", "Three.js", "Docker", "Telegram", "Gemini"],
    },
    {
        // Group HMI project (18 people, 4 screens); I built page 2, lighting control, on my own. No public repo.
        kind: "demo",
        slug: "smart-classroom",
        category: "coursework", // internship | freelance | side | coursework (lib/projectMeta.js)
        role: { th: "งานกลุ่ม 18 คน · ผมทำหน้าระบบไฟคนเดียว", en: "Group of 18 · I built the lighting page solo" },
        name: "Smart Classroom · Lighting Control",
        badge: { th: "งานกลุ่ม HMI · หน้า 2 ระบบไฟ (ทำคนเดียว)", en: "Group HMI Project · Page 2 Lighting (solo)" },
        detailHref: "/projects/smart-classroom",
        displayUrl: "Wecon PI Studio · HMI 1920×1080",
        poster: "/assets/projects/smart-classroom/poster.jpg",
        previewLabel: { th: "ดูหน้าจอและผลทดสอบ →", en: "Screens + test results →" },
        detailLabel: { th: "ดูหน้าจอและตรรกะ", en: "See the screens and logic" },
        tagline: {
            th: "หน้าจอ HMI ที่เปิด-ปิดไฟห้องเรียนเองตามแสงและจำนวนคน และเตือนเมื่อลืมปิดไฟ",
            en: "An HMI screen that switches classroom lights by daylight and head count, and warns when someone forgets them",
        },
        description: {
            th: "ห้องเรียนอัจฉริยะจำลองบน Wecon PI Studio งานกลุ่ม 18 คนแบ่ง 4 หน้า ผมทำหน้า 2 \"ระบบควบคุมไฟ\" คนเดียวทั้งหน้า: เลย์เอาต์และภาพ ตรรกะ AUTO/MANUAL แยก 2 โซน สคริปต์จำลองค่า Lux และจำนวนคน แอนิเมชัน ป้ายสถานะ แผงตั้งค่า และส่งข้อมูลห้องเป็น JSON ผ่าน MQTT เขียนด้วย Lua พร้อมชุดทดสอบอัตโนมัติ",
            en: "A simulated smart classroom in Wecon PI Studio, built by a group of 18 across 4 screens. I built page 2, lighting control, on my own: layout and artwork, two-zone AUTO / MANUAL logic, Lux and head-count simulation, animation, status banners, a settings panel, and room data published as JSON over MQTT. Written in Lua with an automated test suite.",
        },
        stats: [
            { value: "345", label: { th: "เช็กในชุดทดสอบ Lua ผ่านหมด", en: "Lua test checks, all passing" } },
            { value: "18", label: { th: "เคสทดสอบบนจอจำลอง", en: "test cases on the simulator" } },
            { value: "2 s", label: { th: "ส่ง JSON ผ่าน MQTT", en: "JSON over MQTT" } },
        ],
        features: [
            { text: { th: "AUTO: มืดและมีคนจึงเปิด คนน้อยเปิดแค่โซนหน้า", en: "AUTO: lights on when dark and occupied, front zone only for a small group" } },
            { text: { th: "แดดพอหรือห้องว่างเกิน 5 วิ ไฟปิดเอง", en: "Enough daylight or an empty room for 5 s turns lights off" } },
            { text: { th: "MANUAL ลืมปิดไฟ 60 วิ: บังคับปิด + ป้ายแดง", en: "MANUAL, lights left on for 60 s: forced off + red banner" } },
            { text: { th: "ส่งสถานะห้องเป็น JSON ผ่าน MQTT ทุก 2 วิ", en: "Publishes room state as JSON over MQTT every 2 s" } },
        ],
        tech: ["Wecon PI Studio", "HMI", "Lua", "MQTT", "Python (asset generator)"],
    },
    {
        // Freelance work shown as a clickable mock: renamed brand, fictional venues and people
        kind: "demo",
        slug: "travel-plan-booking",
        category: "freelance", // internship | freelance | side | coursework (lib/projectMeta.js)
        role: { th: "เดโมจำลองที่กดได้ · ข้อมูลสมมติ", en: "Clickable mock · fictional data" },
        featured: true, // shown on the home page
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
            { text: { th: "วางแผนทริปหลายวัน พร้อมร้านแนะนำทุกมื้อ", en: "Plans multi-day trips with a restaurant for every meal" } },
            { text: { th: "จองโต๊ะด้วยปุ่ม: จำนวนคน วัน เวลา แล้วยืนยัน", en: "Book with buttons: party size, day, time, confirm" } },
            { text: { th: "ร้านสร้างหน้าร้าน ตั้งรอบเวลา และรับการจอง", en: "Shops set up their page, time slots and take bookings" } },
            { text: { th: "แจ้งเตือนและสรุปยอดเข้า LINE / WhatsApp / Telegram", en: "Alerts and daily summaries in LINE / WhatsApp / Telegram" } },
        ],
        tech: ["Gemini", "LangChain", "Redis", "PostgreSQL", "LINE", "WhatsApp", "Telegram"],
    },
    {
        // Personal tool, used daily. No public repo or download; the detail page shows recorded demos.
        kind: "demo",
        slug: "scene-english",
        category: "side", // internship | freelance | side | coursework (lib/projectMeta.js)
        role: { th: "ทำเอง · ใช้เองทุกวัน", en: "Solo · Personal tool" },
        name: "Scene English",
        badge: { th: "โปรเจกต์ส่วนตัว · เว็บฝึกภาษาอังกฤษ", en: "Side project · English practice web app" },
        detailHref: "/projects/scene-english",
        displayUrl: "localhost:3000 · Scene English",
        poster: "/assets/projects/scene-english/poster.jpg",
        tagline: {
            th: "เว็บฝึกอังกฤษจากภาพสถานการณ์: AI แต่งเรื่อง วาดภาพ ชี้ของในภาพ และฟังเราพูด",
            en: "English practice from a picture: AI writes a scene, draws it, points out objects and listens to you speak",
        },
        description: {
            th: "ทำไว้ฝึกภาษาอังกฤษเอง พิมพ์สถานการณ์ เช่น ร้านกาแฟตอนเช้า แล้วระบบแต่งเรื่องตามระดับ A1–B2 วาดภาพ และตีกรอบของในภาพให้กดดูคำศัพท์ได้ แต่ละคำมีประโยคครบ 12 tense กดพูดตามแล้วได้คะแนนรายคำกับคำแนะนำเป็นภาษาไทย และมีบทสนทนา roleplay ให้พูดโต้ตอบ ใช้ AI หลายเจ้าแบบ free tier โดยงานข้อความมีตัวสำรองเมื่อตัวหลักล่ม",
            en: "Built for my own English practice. Type a situation such as a morning coffee shop and it writes a story at A1–B2, draws the scene and boxes the objects so you can tap them for vocabulary. Every word gets a sentence in all 12 tenses; speak a sentence to get a per-word score and tips in Thai, then practise a roleplay. It runs on free-tier AI APIs, and text tasks fall back to a second provider when the first fails.",
        },
        stats: [
            { value: "6", label: { th: "โมเดล AI ที่ใช้ร่วมกัน", en: "AI models working together" } },
            { value: "12", label: { th: "tense ต่อคำศัพท์", en: "tenses per word" } },
            { value: "Free tier", label: { th: "ใช้ API ฟรีทั้งหมด", en: "APIs only" } },
        ],
        tech: ["Node.js", "Express", "Vanilla JS", "Gemini", "Groq", "Qwen VL", "FLUX", "Whisper", "Docker"],
    },
    {
        // Personal desktop app, used daily. No public repo or download; the detail page shows recorded demos.
        kind: "demo",
        slug: "ava",
        category: "side", // internship | freelance | side | coursework (lib/projectMeta.js)
        role: { th: "ทำเอง · ใช้เองทุกวัน", en: "Solo · Personal tool" },
        name: "AVA Desktop Assistant",
        badge: { th: "โปรเจกต์ส่วนตัว · แอป desktop บน Windows", en: "Side project · Windows desktop app" },
        detailHref: "/projects/ava",
        displayUrl: "AVA · Electron (Windows)",
        poster: "/assets/projects/ava/poster.jpg",
        tagline: {
            th: "ผู้ช่วยบน desktop สำหรับวางแผนงานและฝึกพูดอังกฤษ ทั้งพิมพ์และคุยด้วยเสียงแบบ real-time",
            en: "A desktop assistant for planning my day and practising spoken English, by text or real-time voice",
        },
        description: {
            th: "แอป Windows ที่อยู่ใน tray เปิดได้จากทุกหน้าจอด้วย Ctrl+Alt+Space มีโหมดวางแผนงาน โหมดคุยอังกฤษแบบไม่แก้และแบบแก้ให้ทุกประโยค และฝึกสัมภาษณ์ด้วย scenario pack คุยด้วยเสียงได้ผ่าน Gemini Live หรือ Groq บันทึก to-do และตั้งเตือนผ่าน tool calling เก็บข้อมูลใน SQLite บนเครื่อง และเตือนก่อนส่งถ้าข้อความมีรหัสผ่านหรือ API key",
            en: "A Windows tray app that opens from anywhere with Ctrl+Alt+Space. It has a planner mode, English chat with or without corrections, and interview practice through scenario packs. You can talk to it in real time through Gemini Live or Groq, it saves to-dos and reminders through tool calls, keeps everything in a local SQLite database, and warns before sending anything that looks like a password or API key.",
        },
        stats: [
            { value: "73", label: { th: "test อัตโนมัติ (Vitest)", en: "automated tests (Vitest)" } },
            { value: "12", label: { th: "tool ที่ AI เรียกใช้ได้", en: "tools the AI can call" } },
            { value: "2", label: { th: "ผู้ให้บริการ AI สลับกันได้", en: "AI providers with fallback" } },
        ],
        tech: ["Electron", "TypeScript", "esbuild", "SQLite", "Gemini Live", "Groq", "Vitest"],
    },
    {
        slug: "foodroll",
        category: "side", // internship | freelance | side | coursework (lib/projectMeta.js)
        role: { th: "ทำเอง · เว็บที่ใช้งานจริง", en: "Solo · Live site" },
        featured: true, // shown on the home page
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
            { text: { th: "หมุนการ์ดร้านแบบกาชา พร้อมระบบ Rarity", en: "Gacha-style spins with a rarity system" } },
            { text: { th: "กรองตามระยะทาง 1 / 3 / 5 km จากตำแหน่งจริง", en: "Filter by 1 / 3 / 5 km from where you are" } },
            { text: { th: "เลือกหมวด ร้านอาหาร คาเฟ่ บาร์ ปิ้งย่าง", en: "Pick a category: restaurants, cafés, bars, BBQ" } },
            { text: { th: "ปักหมุดบนแผนที่ และนำทางด้วย Google Maps", en: "Pins on a map, directions via Google Maps" } },
        ],
        tech: ["Next.js 16", "React 19", "Tailwind CSS 4", "Framer Motion", "Supabase", "PostGIS", "Leaflet", "Vercel"],
    },
];

// Only projects with a real public site get a full-screen /live/[slug] page
export const livePages = liveProjects.filter((project) => project.kind !== "demo");

export const getLiveProject = (slug) => livePages.find((project) => project.slug === slug);
