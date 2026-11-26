// Journey section content. Text is {th, en}; plain strings are the same in both languages.
// Dates use Buddhist-era years in Thai and Gregorian years in English.

// Paid work, newest first. `current` shows the live "Present" dot.
export const work = [
    {
        company: "AAppoint",
        role: { th: "AI Agent / Backend Engineer · ฟรีแลนซ์", en: "AI Agent / Backend Engineer · Freelance" },
        period: { th: "พ.ค. – พ.ย. 2569", en: "May – Nov 2026" },
        summary: {
            th: "พัฒนา AI agent สองฝั่งสำหรับการจองร้านอาหารและการจัดการร้าน ด้วย LangChain และ Gemini",
            en: "Dual-facing AI agents for restaurant booking and shop management, built with LangChain and Gemini.",
        },
        points: [
            {
                label: "B2C agent",
                th: "agent ฝั่งลูกค้าสำหรับจองร้านอาหาร สร้างด้วย LangChain และ Gemini",
                en: "Customer-facing agent for restaurant booking, built with LangChain and Gemini.",
            },
            {
                label: "B2B agent",
                th: "ช่วยผู้จัดการร้านสรุปการจอง ยกเลิกการจอง และตอบข้อมูลร้าน",
                en: "Helps shop managers with booking summaries, cancellations and shop information.",
            },
            {
                label: "Memory",
                th: "Redis เป็นความจำระยะสั้น และ PostgreSQL เป็นความจำระยะยาวของทั้งสอง agent",
                en: "Redis for short-term and PostgreSQL for long-term memory across both agents.",
            },
            {
                label: "LINE OA",
                th: "ขยายจากตอบข้อความอย่างเดียว เป็น flow ตั้งแต่จองจนชำระเงิน ผ่าน API ที่เขียนเองและยืนยันตัวตนด้วย token",
                en: "Grew the agents from text-only replies to a full booking-to-payment flow, through custom token-authenticated API endpoints.",
            },
        ],
        tech: ["LangChain", "Gemini", "Redis", "PostgreSQL", "LINE OA"],
    },
    {
        company: { th: "ระบบตู้น้ำหยอดเหรียญ", en: "Water Vending Machine System" },
        role: { th: "โปรเจกต์ IoT เชิงพาณิชย์", en: "IoT commercial project" },
        period: { th: "2567 – 2568", en: "2024 – 2025" },
        summary: {
            th: "ติดตั้งและดูแลระบบ IoT ของตู้น้ำหยอดเหรียญกว่า 70 ตู้ เน้นความเสถียรของฮาร์ดแวร์และการเชื่อมต่อเครือข่ายในพื้นที่ที่พักอาศัย",
            en: "Installed and maintained the IoT systems of 70+ commercial vending units, keeping hardware reliable and connected in residential areas.",
        },
        points: [
            {
                label: "Hardware",
                th: "ประกอบ PCB บัดกรี และไล่แก้ปัญหาบอร์ดควบคุมถึงระดับชิป",
                en: "PCB assembly, soldering and chip-level troubleshooting of control boards.",
            },
            {
                label: "Network",
                th: "ตั้งค่า IoT ผ่านซิมและจัดการ IP ให้ตู้สื่อสารกับเซิร์ฟเวอร์",
                en: "SIM-based IoT setup and IP management for machine-to-server traffic.",
            },
            {
                label: "System",
                th: "แก้ปัญหาหน้างาน และทดสอบการเชื่อม API ร่วมกับทีม backend",
                en: "On-site troubleshooting and API integration tests with the backend team.",
            },
            {
                label: "Scale",
                th: "ติดตั้งตู้ที่ใช้งานจริงแล้วกว่า 70 ตู้",
                en: "70+ units deployed and running.",
            },
        ],
        tech: ["PCB", "IoT", "SIM / IP", "API testing"],
    },
];

// Projects and self-study, newest first. `kind` is a short tag; `award` gets the medal line.
export const projects = [
    {
        title: "AI Agent & LLM Self-Study",
        kind: { th: "เรียนเอง", en: "Self-study" },
        year: { th: "2569", en: "2026" },
        summary: {
            th: "ศึกษาสถาปัตยกรรม AI Agent และการพัฒนาแอปด้วย LLM ด้วยตัวเอง ทั้ง prompt engineering การออกแบบ agent ด้วย LangChain และระบบ memory (Redis, PostgreSQL) เพื่อเป็นพื้นฐานก่อนทำโปรเจกต์ AI agent ของ AAppoint",
            en: "Self-studied AI agent architecture and LLM app development: prompt engineering, LangChain agent design and memory systems (Redis, PostgreSQL), as groundwork for the AAppoint agents.",
        },
    },
    {
        title: "Smart Care Monitor System",
        kind: { th: "วิชาระบบปฏิบัติการ", en: "OS course project" },
        year: { th: "2568", en: "2025" },
        summary: {
            th: "ระบบติดตามผู้ป่วยบนคลาวด์ ใช้ Ubuntu เป็นเซิร์ฟเวอร์ รองรับผู้ใช้หลายบทบาท (แพทย์ พยาบาล ผู้ป่วย) และสรุปข้อมูลสุขภาพด้วย AI เพื่อช่วยการตัดสินใจทางการแพทย์",
            en: "Cloud-based patient monitoring on an Ubuntu server, with separate roles for doctors, nurses and patients, and AI health summaries to support medical decisions.",
        },
        tech: ["Flask", "Jinja2", "HTMX", "MQTT", "MongoDB", "Docker"],
    },
    {
        title: "TourGuard: Smart AI Streetlight",
        kind: { th: "ประกวด", en: "Competition" },
        year: { th: "2567", en: "2024" },
        award: { th: "เหรียญเงิน · I-New Gen Award 2025 (วช.)", en: "Silver Medal · I-New Gen Award 2025 (NRCT)" },
        summary: {
            th: "เสาไฟถนนอัจฉริยะที่รวมการตรวจจับด้วย AI เข้ากับการเตือนภัยทางกายภาพ เมื่อพบสัตว์อันตราย ระบบจะเปิดไฟกะพริบและส่งแจ้งเตือนทาง LINE",
            en: "A smart streetlight that pairs AI detection with physical warnings: when it spots a dangerous animal it flashes its lights and sends a LINE alert.",
        },
    },
    {
        title: "Custom PCB Assembly & Sensor Integration",
        kind: { th: "ฮาร์ดแวร์", en: "Hardware" },
        year: { th: "2567", en: "2024" },
        summary: {
            th: "ประกอบ PCB ทั้งติดตั้งชิป บัดกรี และทดสอบวงจร เชื่อมต่อเซนเซอร์สิ่งแวดล้อม (แสง ฝุ่น อุณหภูมิ) ผ่าน GPIO เพื่อให้ระบบทำงานได้เสถียร",
            en: "PCB assembly: chip mounting, soldering and circuit testing, plus light, dust and temperature sensors wired over GPIO.",
        },
    },
    {
        title: "Line Following Robot",
        kind: { th: "วิชา Digital Logic", en: "Digital Logic course" },
        year: { th: "2567", en: "2024" },
        summary: {
            th: "หุ่นยนต์เดินตามเส้นที่ไม่ใช้ไมโครคอนโทรลเลอร์ ใช้ลอจิกเกต (IC) ล้วน ลดรูปวงจรควบคุมด้วย K-Map 5 ตัวแปร",
            en: "A line-following robot with no microcontroller, only logic-gate ICs; the control circuit was reduced with a 5-variable K-map.",
        },
    },
    {
        title: "Smart Plug IoT Project",
        kind: "IoT",
        year: { th: "2566", en: "2023" },
        summary: {
            th: "ปลั๊กอัจฉริยะด้วย ESP32 และโมดูลรีเลย์ ออกแบบวงจรแปลงไฟ 220V AC เป็น 12V DC อย่างปลอดภัย สั่งงานและตั้งเวลาผ่าน Blynk และสั่งด้วยเสียงผ่าน Alexa",
            en: "A smart plug on ESP32 and relay modules, with a circuit that safely steps 220V AC down to 12V DC; controlled and scheduled through Blynk and by voice through Alexa.",
        },
        tech: ["ESP32", "Blynk", "Alexa"],
    },
    {
        title: "Dangerous Animal Detection System",
        kind: "Computer vision",
        year: { th: "2566", en: "2023" },
        summary: {
            th: "ต้นแบบระบบตรวจจับสัตว์อันตรายด้วย YOLOv8 และ Python ใช้กล้อง IP และ ESP32-CAM ประมวลผลวิดีโอแบบเรียลไทม์ และแจ้งเตือนทันทีผ่าน LINE Messaging API",
            en: "A prototype that spots dangerous animals with YOLOv8 and Python, reading IP camera and ESP32-CAM video in real time and alerting through the LINE Messaging API.",
        },
        tech: ["YOLOv8", "Python", "ESP32-CAM", "LINE API"],
    },
];

// Newest first
export const education = [
    {
        school: { th: "มหาวิทยาลัยศรีปทุม", en: "Sripatum University" },
        degree: { th: "ปริญญาตรี (กำลังศึกษา)", en: "Bachelor’s degree (in progress)" },
        period: { th: "2566 – คาดว่าจบ 2569", en: "2023 – expected 2026" },
        current: true,
    },
    {
        school: { th: "วิทยาลัยเทคนิคไทย-ออสเตรีย", en: "Thai-Austrian Technical College" },
        degree: { th: "ปวส. สาขาเทคโนโลยีสารสนเทศ", en: "Higher Vocational Certificate, IT" },
        period: { th: "พ.ค. 2562 – มี.ค. 2564", en: "May 2019 – Mar 2021" },
    },
];

export const skills = [
    { group: { th: "AI Agent", en: "AI agents" }, items: ["LangChain", "Google Gemini", "Redis / PostgreSQL memory", "LINE OA API"] },
    { group: { th: "ระบบเครือข่าย", en: "Networking" }, items: ["OSI", "TCP/IP", "IPv4 / IPv6", "Routing", "Switching", "Troubleshooting"] },
    { group: "Cisco", items: ["VLAN", "Trunk / Tagging", "SSH / Telnet", "Spanning Tree"] },
    { group: { th: "ภาษาโปรแกรม", en: "Programming" }, items: ["C", "C++", "Python"] },
    { group: { th: "ฐานข้อมูล", en: "Databases" }, items: ["SQL", "NoSQL", "ER diagrams", "Queries"] },
    {
        group: "Soft skills",
        items: [
            { th: "การแก้ปัญหา", en: "Problem solving" },
            { th: "การทำงานเป็นทีม", en: "Teamwork" },
            { th: "การสื่อสาร", en: "Communication" },
            { th: "การปรับตัว", en: "Adaptability" },
        ],
    },
];

export const training = [
    { course: "CCNA Network Labs Professional", provider: "NetPrime Training" },
    { course: "Intermediate and Advanced Computer Programming", provider: "Mahidol MOOC" },
];
