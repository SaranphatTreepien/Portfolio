"use client";

import Image from "next/image";
import { FiMonitor, FiGitBranch, FiCheckCircle, FiMaximize2 } from "react-icons/fi";
import { ProjectTopBar, ProjectIntro, SectionHeading } from "@/components/ProjectDetail";
import { useLang } from "@/components/LanguageProvider";
import { liveProjects } from "@/data/liveProjects";

const project = liveProjects.find((item) => item.slug === "smart-classroom");
const ASSETS = "/assets/projects/smart-classroom";

const sectionNav = [
    { href: "#screens", label: { th: "หน้าจอ", en: "Screens" }, icon: FiMonitor },
    { href: "#logic", label: { th: "ตรรกะ", en: "Logic" }, icon: FiGitBranch },
    { href: "#tests", label: { th: "ทดสอบ", en: "Tests" }, icon: FiCheckCircle },
];

// Screenshots from the off-line simulator test run (cases T1–T18).
const screens = [
    {
        file: "auto-dark-both-zones",
        title: { th: "AUTO · มืดและคนเยอะ", en: "AUTO · dark and busy" },
        caption: { th: "Lux ต่ำกว่าค่าตั้ง และมีคนเกินเกณฑ์ เปิดไฟทั้งโซนหน้าและหลัง", en: "Lux below the set point and more than a small group: both front and rear zones on" },
    },
    {
        file: "auto-few-people-front",
        title: { th: "AUTO · คนน้อย", en: "AUTO · small group" },
        caption: { th: "10 คนหรือน้อยกว่า เปิดเฉพาะโซนหน้า ประหยัดไฟครึ่งห้อง", en: "10 people or fewer: only the front zone turns on, saving half the room" },
    },
    {
        file: "auto-daylight-off",
        title: { th: "AUTO · แดดพอ", en: "AUTO · enough daylight" },
        caption: { th: "Lux สูงกว่าค่าตั้ง + hysteresis ไฟปิดแม้มีคน", en: "Lux above the set point plus hysteresis: lights off even with people in" },
    },
    {
        file: "auto-nobody-off",
        title: { th: "AUTO · ห้องว่าง", en: "AUTO · empty room" },
        caption: { th: "ไม่มีคนต่อเนื่อง 5 วินาที ไฟดับทั้งห้อง", en: "No one for 5 seconds in a row: the whole room goes dark" },
    },
    {
        file: "manual-zone-button",
        title: { th: "MANUAL · ปุ่มโซน", en: "MANUAL · zone buttons" },
        caption: { th: "สวิตช์ผนังเปิด-ปิดทั้งห้อง ปุ่มโซนสั่งแยกหน้า/หลัง", en: "The wall switch drives the whole room; zone buttons switch front / rear separately" },
    },
    {
        file: "forgot-off-alarm",
        title: { th: "ลืมปิดไฟ!", en: "Lights left on!" },
        caption: { th: "MANUAL ไฟเปิดในห้องว่าง 60 วิ ระบบบังคับปิดและขึ้นป้ายแดงกะพริบ", en: "MANUAL with lights on in an empty room for 60 s: forced off with a flashing red banner" },
    },
    {
        file: "manual-auto-return",
        title: { th: "กลับ AUTO เอง", en: "Back to AUTO by itself" },
        caption: { th: "ไม่มีใครแตะปุ่ม 120 วิ ระบบนับถอยหลังแล้วกลับเป็น AUTO", en: "No button pressed for 120 s: a countdown, then the screen returns to AUTO" },
    },
    {
        file: "settings-50-people",
        title: { th: "แผงตั้งค่า · 50 คน", en: "Settings panel · 50 people" },
        caption: { th: "ปรับเกณฑ์และเวลาได้บนจอ หุ่นคนแสดง 12 ตัว ที่เหลือเป็นป้าย \"+38 คน\"", en: "Thresholds and timers editable on screen; 12 figures are drawn and the rest show as \"+38\"" },
    },
];

const rules = [
    { mode: "AUTO", when: { th: "มืด (Lux < SP − Hyst) และมีคน", en: "Dark (Lux < SP − Hyst) and occupied" }, then: { th: "เปิดไฟ · ≤ 10 คนเปิดแค่โซนหน้า", en: "Lights on · ≤ 10 people: front zone only" } },
    { mode: "AUTO", when: { th: "แดดพอ (Lux > SP + Hyst)", en: "Enough daylight (Lux > SP + Hyst)" }, then: { th: "ปิดไฟทั้งหมด", en: "All lights off" } },
    { mode: "AUTO", when: { th: "ไม่มีคนต่อเนื่อง 5 วิ", en: "Empty for 5 s" }, then: { th: "ปิดไฟทั้งหมด", en: "All lights off" } },
    { mode: "MANUAL", when: { th: "กดสวิตช์ผนัง / ปุ่มโซน", en: "Wall switch / zone button" }, then: { th: "ไฟตามที่สั่ง", en: "Lights follow the command" } },
    { mode: "MANUAL", when: { th: "ไฟเปิดในห้องว่าง 60 วิ", en: "Lights on in an empty room for 60 s" }, then: { th: "บังคับปิด + ป้าย \"ลืมปิดไฟ!\"", en: "Forced off + \"lights left on!\" banner" } },
    { mode: "MANUAL", when: { th: "ไม่แตะอะไร 120 วิ", en: "Nothing touched for 120 s" }, then: { th: "กลับเป็น AUTO", en: "Back to AUTO" } },
];

const scripts = [
    { name: "Script_BG.lua", text: { th: "รอบหลัก ค่าเริ่มต้น และเรียกทุกโมดูล", en: "Main loop, defaults, calls every module" } },
    { name: "L2_Tags.lua", text: { th: "ตาราง tag → address ที่เดียวทั้งหน้า", en: "One table mapping every tag to its address" } },
    { name: "L2_Sim.lua", text: { th: "จำลองค่า Lux และจำนวนคน", en: "Simulates Lux and head count" } },
    { name: "L2_Logic.lua", text: { th: "ตรรกะ AUTO/MANUAL ตัวจับเวลา และป้ายสถานะ", en: "AUTO / MANUAL logic, timers, status codes" } },
    { name: "L2_Anim.lua", text: { th: "หุ่นคน ภาพไฟ และสถานะบนจอ", en: "People figures, light images, on-screen state" } },
    { name: "L2_Sun.lua", text: { th: "แสงแดดลอดหน้าต่าง 5 ระดับตาม Lux", en: "Window sunlight in 5 levels from Lux" } },
    { name: "L2_Mqtt.lua", text: { th: "ส่ง JSON ทุก 2 วิ broker ล่มลองใหม่ทุก 10 วิ", en: "JSON every 2 s, retries every 10 s if the broker is down" } },
];

const mqttSample = `{"group":"G1","system":"Classroom","room_id":"C101",
 "occupancy":15,"lux":800,"th_lux":300,"sun_level":4,
 "mode":"AUTO","light_front":0,"light_rear":0,"daylight":1,
 "status_code":0,"energy_wh":0,"saved_pct":0,"alarm":0}`;

function Shot({ src, alt, sizes = "(max-width: 768px) 100vw, 580px" }) {
    return (
        <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_18px_50px_-24px_rgba(16,21,31,0.35)]"
        >
            <Image src={src} alt={alt} width={1600} height={900} sizes={sizes} className="block h-auto w-full" />
            <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <FiMaximize2 className="h-4 w-4" />
            </span>
        </a>
    );
}

export default function SmartClassroomPage() {
    const { tx } = useLang();
    return (
        <main className="min-h-screen pb-24">
            <ProjectTopBar nav={sectionNav} />
            <ProjectIntro
                project={project}
                note={{
                    th: "งานกลุ่ม 18 คน 4 หน้า (Monitor + Alarm · ไฟ · พัดลม/แอร์ · จอ/ม่าน) หน้านี้แสดงเฉพาะหน้า 2 ที่ผมทำ ภาพทั้งหมดจากการทดสอบบนจอจำลองของ PI Studio",
                    en: "Group of 18, 4 screens (Monitor + Alarm · Lighting · Fan/AC · Screen/Curtain). This page shows only page 2, which I built. All images come from test runs on PI Studio's simulator.",
                }}
            />

            <section id="screens" className="container mx-auto scroll-mt-20 pt-16">
                <SectionHeading
                    eyebrow={{ th: "01 · หน้าจอ", en: "01 · Screens" }}
                    title={{ th: "หน้าจอในแต่ละสถานการณ์", en: "The screen in each situation" }}
                    text={{ th: "ห้องสว่างหรือมืดตามไฟที่เปิดจริง หุ่นคนนั่งตามจำนวนคน และแถบบนบอกว่าระบบกำลังทำอะไร", en: "The room lights up with the zones that are on, figures fill seats by head count, and the top banner says what the system is doing" }}
                />
                <div className="grid gap-10 md:grid-cols-2">
                    {screens.map((s) => (
                        <figure key={s.file} className="flex flex-col gap-3">
                            <Shot src={`${ASSETS}/${s.file}.jpg`} alt={tx(s.title)} />
                            <figcaption className="flex flex-col gap-1">
                                <span className="text-base font-bold text-primary">{tx(s.title)}</span>
                                <span className="text-sm leading-6 text-gray-500">{tx(s.caption)}</span>
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </section>

            <section id="logic" className="container mx-auto scroll-mt-20 pt-20">
                <SectionHeading
                    eyebrow={{ th: "02 · ตรรกะ", en: "02 · Logic" }}
                    title={{ th: "กฎควบคุมไฟ", en: "Lighting rules" }}
                    text={{
                        th: "ค่าตั้งแสง (SP) เริ่มที่ 300 lux ใช้ hysteresis 30 กันไฟกะพริบเมื่อแสงอยู่ใกล้เกณฑ์ ทุกค่าปรับได้ในแผงตั้งค่า",
                        en: "The light set point starts at 300 lux with 30 of hysteresis so lights don't flicker near the threshold; every value is adjustable in the settings panel",
                    }}
                />
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                            <tr>
                                <th className="px-4 py-3">{tx({ th: "โหมด", en: "Mode" })}</th>
                                <th className="px-4 py-3">{tx({ th: "เมื่อ", en: "When" })}</th>
                                <th className="px-4 py-3">{tx({ th: "ผล", en: "Then" })}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-600">
                            {rules.map((r, i) => (
                                <tr key={i}>
                                    <td className="px-4 py-3">
                                        <span className={`rounded-md px-2 py-0.5 font-mono text-xs font-bold ${r.mode === "AUTO" ? "bg-[#14b8a6]/15 text-[#1f7f77]" : "bg-amber-100 text-amber-700"}`}>{r.mode}</span>
                                    </td>
                                    <td className="px-4 py-3">{tx(r.when)}</td>
                                    <td className="px-4 py-3 font-medium text-primary">{tx(r.then)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-10 grid gap-6 lg:grid-cols-2">
                    <div className="flex flex-col gap-3">
                        <h3 className="text-lg font-bold text-primary">{tx({ th: "สคริปต์ Lua 7 ไฟล์", en: "7 Lua scripts" })}</h3>
                        <ul className="flex flex-col gap-2">
                            {scripts.map((s) => (
                                <li key={s.name} className="flex flex-col gap-0.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm sm:flex-row sm:items-baseline sm:gap-3">
                                    <code className="shrink-0 font-mono text-sm font-semibold text-brand-700">{s.name}</code>
                                    <span className="text-sm text-gray-500">{tx(s.text)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex flex-col gap-3">
                        <h3 className="text-lg font-bold text-primary">{tx({ th: "ข้อมูลที่ส่งผ่าน MQTT", en: "What goes out over MQTT" })}</h3>
                        <p className="text-sm leading-6 text-gray-500">
                            {tx({ th: "topic spu/campus/classroom ทุก 2 วินาที ให้ระบบอื่นของวิทยาเขตรับไปใช้ต่อ", en: "Topic spu/campus/classroom every 2 seconds, for other campus systems to pick up" })}
                        </p>
                        <pre className="overflow-x-auto rounded-xl bg-[#0b0a12] p-4 font-mono text-xs leading-6 text-[#7edad2]">{mqttSample}</pre>
                    </div>
                </div>
            </section>

            <section id="tests" className="container mx-auto scroll-mt-20 pt-20">
                <SectionHeading
                    eyebrow={{ th: "03 · ทดสอบ", en: "03 · Tests" }}
                    title={{ th: "ทดสอบสองชั้น", en: "Tested twice over" }}
                    text={{ th: "ตรรกะทดสอบอัตโนมัติด้วย lua.dll ของ PI Studio เอง แล้วยืนยันอีกรอบบนจอจำลอง", en: "The logic is tested automatically with PI Studio's own lua.dll, then confirmed again on the simulator" }}
                />
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <div className="text-3xl font-semibold tabular-nums text-primary">345 / 345</div>
                        <p className="mt-1 text-sm font-semibold text-primary">{tx({ th: "เช็กอัตโนมัติผ่านหมด", en: "automated checks passing" })}</p>
                        <p className="mt-2 text-sm leading-6 text-gray-500">
                            {tx({
                                th: "ครอบคลุมกฎ AUTO/MANUAL ตัวจับเวลา การนับ tick วนรอบ ระดับแดด การส่ง MQTT กรณี broker ล่ม และทดสอบสุ่มต่อเนื่อง 2 ชั่วโมง",
                                en: "Covers the AUTO / MANUAL rules, timers, tick-counter wrap, sun levels, MQTT publishing, a broker outage and a 2-hour random soak test",
                            })}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <div className="text-3xl font-semibold tabular-nums text-primary">T1–T18</div>
                        <p className="mt-1 text-sm font-semibold text-primary">{tx({ th: "เคสบนจอจำลอง ผ่านทุกเคส", en: "simulator cases, all passing" })}</p>
                        <p className="mt-2 text-sm leading-6 text-gray-500">
                            {tx({
                                th: "Compile 0 error 0 warning แต่ละเคสมีภาพหลักฐาน ภาพในหัวข้อ 01 มาจากชุดนี้",
                                en: "Compiles with 0 errors and 0 warnings; every case has a screenshot as evidence, and the images in section 01 come from this run",
                            })}
                        </p>
                    </div>
                </div>
                <div className="mt-16 flex justify-center">
                    <a
                        href="/#Experience"
                        className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:border-primary hover:text-primary transition-colors"
                    >
                        ← {tx({ th: "กลับ Portfolio", en: "Back to portfolio" })}
                    </a>
                </div>
            </section>
        </main>
    );
}
