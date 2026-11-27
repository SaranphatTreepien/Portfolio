"use client";

import { FiShoppingBag, FiUser, FiRepeat } from "react-icons/fi";
import { ProjectTopBar, ProjectIntro, SectionHeading, DemoFrame, TechPills, BackLinks } from "@/components/ProjectDetail";
import { useLang } from "@/components/LanguageProvider";
import { liveProjects } from "@/data/liveProjects";

const project = liveProjects.find((item) => item.slug === "travel-plan-booking");

const sectionNav = [
    { href: "#b2c", label: { th: "B2C · ลูกค้า", en: "B2C · Customers" }, icon: FiUser },
    { href: "#b2b", label: { th: "B2B · ร้าน", en: "B2B · Shops" }, icon: FiShoppingBag },
    { href: "#flow", label: "Flow", icon: FiRepeat },
];

// Both mocks read ?lang= (th / en / zh), so they open in the site's language.
const b2c = {
    title: "Travel Plan Booking",
    displayUrl: "travel-plan-booking · web chat (mock)",
    src: "/demos/travel-plan-booking/b2c.html",
    langParam: true,
    description: {
        th: "ลูกค้าคุยกับ AI concierge ในแชต: ขอแผนเที่ยว ดูร้าน แล้วจองโต๊ะทีละขั้นด้วยปุ่ม",
        en: "Customers talk to an AI concierge in chat: ask for a trip plan, look at restaurants, then book a table step by step with buttons.",
    },
    tech: ["Gemini", "LangChain", "Redis", "PostgreSQL"],
    tries: [
        { th: "กด “วางแผนเที่ยวกรุงเทพ 2 วัน” แล้วกดชื่อร้านในแผน", en: "Tap “Plan a 2-day Bangkok trip”, then tap a restaurant in the plan" },
        { th: "กด “จองร้านนี้” แล้วเลือกจำนวนคน วัน เวลา และกรอกฟอร์ม", en: "Tap “Book this place” and pick party size, day, time, then fill the form" },
        {
            th: "สลับภาษา ไทย · English · 中文 หรือพิมพ์เป็นภาษาไหนก็ได้ agent จะตอบเป็นภาษานั้น เช่น “清迈海鲜” หรือ “Bangkok trip”",
            en: "Switch between ไทย · English · 中文, or type in any of them and the agent answers in that language, e.g. “清迈海鲜” or “เที่ยวกรุงเทพ”",
        },
        { th: "ปุ่ม ดีล / การจองของฉัน ด้านบน และสลับธีม Web · LINE · Telegram · WhatsApp", en: "Deals / My bookings at the top, and the Web · LINE · Telegram · WhatsApp themes" },
    ],
};

const b2bDemo = {
    title: "Merchant Manager",
    displayUrl: "merchant-manager · dashboard + chat bot (mock)",
    src: "/demos/travel-plan-booking/b2b.html",
    langParam: true,
    description: {
        th: "ร้านสร้างหน้าร้าน ตั้งรอบเวลา และรับการจอง ส่วนแจ้งเตือน สรุปยอด และเมนูร้านอยู่ในแอปแชตที่ใช้อยู่แล้ว",
        en: "Shops set up their page, time slots and take bookings, while alerts, summaries and the shop menu live in the chat apps they already use.",
    },
    tech: ["Gemini", "Redis", "PostgreSQL"],
    frameClass: "h-[88vh] min-h-[640px] max-h-[880px]",
    tries: [
        { th: "กด “+ จำลองการจองใหม่” แล้วกดยืนยันในแชต แดชบอร์ดจะอัปเดตตาม", en: "Tap “+ จำลองการจองใหม่” (simulate a booking), then confirm it in the chat; the dashboard follows" },
        { th: "สลับ LINE · WhatsApp · Telegram แล้วลองเมนูร้าน เช่น คิววันนี้ / ปิดรับวันนี้", en: "Switch LINE · WhatsApp · Telegram and try the shop menu, e.g. today's queue / close today" },
        { th: "สลับภาษาบอท ไทย · EN · 中文 ข้อความในแชตทั้งหมดจะเปลี่ยนภาษาตาม (แดชบอร์ดเว็บเป็นภาษาไทย)", en: "Switch the bot language ไทย · EN · 中文 and the whole chat follows (the web dashboard is in Thai)" },
        { th: "แท็บ หน้าร้าน: แก้ข้อมูลร้านแล้วดูตัวอย่างการ์ดที่ลูกค้าจะเห็น", en: "The หน้าร้าน (shop page) tab: edit the shop and preview the card customers will see" },
    ],
};

const flow = [
    { who: { th: "ลูกค้า", en: "Customer" }, text: { th: "พิมพ์หรือกดปุ่มในแชต Web / LINE / WhatsApp / Telegram", en: "Types or taps buttons in Web / LINE / WhatsApp / Telegram" } },
    { who: "Agent (B2C)", text: { th: "วางแผน หาร้าน เช็กรอบว่าง แล้วเก็บข้อมูลการจอง", en: "Plans, finds a place, checks free slots and collects the booking" } },
    { who: "Merchant Manager", text: { th: "ส่งการจองใหม่เข้าแชตของร้าน พร้อมปุ่มยืนยัน / ปฏิเสธ", en: "Sends the new booking to the shop's chat with confirm / decline buttons" } },
    { who: { th: "ร้าน (B2B)", en: "Shop (B2B)" }, text: { th: "ยืนยันในแชตหรือแดชบอร์ด รอบเวลาและยอดอัปเดตทันที", en: "Confirms in chat or the dashboard; slots and totals update at once" } },
    { who: { th: "ลูกค้า", en: "Customer" }, text: { th: "ได้เลขที่การจองและข้อความยืนยันกลับในแชตเดิม", en: "Gets a booking number and confirmation back in the same chat" } },
];

function Tries({ demo }) {
    const { tx } = useLang();
    return (
        <div className="mt-3 flex flex-col gap-3">
            <TechPills tech={demo.tech} />
            <ul className="flex flex-col gap-1 text-sm leading-6 text-gray-600">
                {demo.tries.map((item) => (
                    <li key={item.en} className="flex gap-2">
                        <span className="text-gray-400">–</span>
                        <span>{tx(item)}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function TravelPlanBookingPage() {
    const { tx } = useLang();
    return (
        <main className="min-h-screen pb-24">
            <ProjectTopBar nav={sectionNav} />
            <ProjectIntro
                project={project}
                note={{
                    th: "งานจริงเป็นของลูกค้า หน้านี้จึงเป็นแบบจำลองที่กดได้ ไม่ได้ต่อ agent จริง ชื่อแบรนด์ โลโก้ ร้าน และคนเปลี่ยนเป็นข้อมูลสมมติทั้งหมด",
                    en: "The real system belongs to the client, so this is a clickable mock that isn't connected to the real agent. Brand, logo, venues and people are all fictional.",
                }}
            />

            <section id="b2c" className="container mx-auto scroll-mt-20 pt-16">
                <SectionHeading
                    eyebrow={{ th: "01 · B2C · ฝั่งลูกค้า", en: "01 · B2C · Customer side" }}
                    title="Travel Plan Booking"
                    text={{ th: "AI concierge วางทริปและจองโต๊ะให้จบในแชตเดียว", en: "An AI concierge that plans the trip and books the table in one chat" }}
                />
                <DemoFrame demo={b2c} projectName={project.name}>
                    <Tries demo={b2c} />
                </DemoFrame>
            </section>

            <section id="b2b" className="container mx-auto scroll-mt-20 pt-20">
                <SectionHeading
                    eyebrow={{ th: "02 · B2B · ฝั่งร้าน", en: "02 · B2B · Shop side" }}
                    title="Merchant Manager"
                    text={{
                        th: "แดชบอร์ดร้านบนเว็บ คู่กับบอทร้านในแอปแชต ทั้งสองฝั่งใช้ข้อมูลชุดเดียวกัน",
                        en: "A web dashboard for the shop plus a shop bot in chat apps, both on the same data",
                    }}
                />
                <DemoFrame demo={b2bDemo} projectName={project.name}>
                    <Tries demo={b2bDemo} />
                </DemoFrame>
            </section>

            <section id="flow" className="container mx-auto scroll-mt-20 pt-20">
                <SectionHeading
                    eyebrow="03 · Flow"
                    title={{ th: "การจองหนึ่งครั้งวิ่งผ่านใครบ้าง", en: "Who a single booking passes through" }}
                    text={{ th: "ลูกค้าและร้านไม่ต้องออกจากแอปแชตที่ใช้อยู่", en: "Neither the customer nor the shop has to leave the chat app they already use" }}
                />
                <ol className="grid gap-3 md:grid-cols-5">
                    {flow.map((step, i) => (
                        <li key={i} className="relative flex flex-col gap-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                            <span className="flex items-center gap-2">
                                <span className="rounded-md bg-primary px-2 py-0.5 font-mono text-xs font-bold text-white">{i + 1}</span>
                            </span>
                            <b className="text-sm text-primary">{tx(step.who)}</b>
                            <span className="text-sm leading-6 text-gray-500">{tx(step.text)}</span>
                        </li>
                    ))}
                </ol>
                <BackLinks demoHref="#b2c" />
            </section>
        </main>
    );
}
