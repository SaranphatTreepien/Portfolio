// AI Governance Gateway — product-design book pages (exported 2244×1586 JPG, A4 landscape @2x)
// Order follows the book. Pages 18–19 are the mobile screens and are shown in their own section.
// Text fields are {th, en}; the design images themselves are in Thai.

const img = (n) => `/assets/projects/ai-governance/d${String(n).padStart(2, "0")}.jpg`;

export const designPdf = "/assets/projects/ai-governance/AI-Governance-Gateway-Product-Design.pdf";

export const demos = [
    {
        id: "simulator",
        title: "Case simulator",
        src: "/demos/ai-governance/simulator.html",
        description: {
            th: "เลือกเคสจำลอง 15 เคส แล้วดูข้อความวิ่งผ่านด่านตรวจทีละด่าน: อะไรผ่านตรง อะไรถูกปกปิด อะไรถูกบล็อก",
            en: "Pick one of 15 simulated cases and watch the message pass each check: what goes through, what gets masked, what gets blocked.",
        },
    },
    {
        id: "data-flow",
        title: "Data flow",
        src: "/demos/ai-governance/data-flow.html",
        description: {
            th: "ข้อมูลวิ่งไปไหน และเก็บไว้ที่ไหน เทียบ demo ตอนนี้กับเป้าหมาย zero-retention",
            en: "Where the data goes and where it is stored, comparing today's demo with the zero-retention goal.",
        },
    },
];

const G = {
    overview: { th: "ภาพรวม", en: "Overview" },
    employee: { th: "พนักงาน", en: "Employee" },
    admin: { th: "Admin", en: "Admin" },
    obs: { th: "Observability", en: "Observability" },
    mobile: { th: "มือถือ", en: "Mobile" },
    summary: { th: "สรุป", en: "Summary" },
};

export const designPages = [
    { page: 1, group: G.overview,
      title: { th: "AI Governance Gateway", en: "AI Governance Gateway" },
      caption: { th: "หน้าปก: ด่านกลางระหว่างพนักงานกับ AI ทุกค่าย ตรวจ ปกปิด ส่ง ถอดกลับ แล้วลบ", en: "Cover: a checkpoint between staff and every AI provider. Inspect, mask, send, restore, delete." } },
    { page: 2, group: G.overview,
      title: { th: "Gateway ของเราคือ router ที่มีด่านตรวจ", en: "The gateway is a router with checkpoints" },
      caption: { th: "ทุกช่องทางเข้าที่เดียว ทุกค่าย LLM ออกที่เดียว และไม่เก็บเนื้อหาแชต", en: "Every channel comes in one place, every LLM goes out one place, and chat content is never stored." } },
    { page: 3, group: G.overview,
      title: { th: "BYOK: ลูกค้าใช้ key ของตัวเอง", en: "BYOK: customers bring their own keys" },
      caption: { th: "โมเดลธุรกิจ: องค์กรจ่ายค่า LLM กับค่ายโดยตรง เราขายแค่ gateway", en: "Business model: the company pays LLM providers directly; we only sell the gateway." } },
    { page: 4, group: G.employee,
      title: { th: "ขั้น 1 · เข้าด้วยบัญชีบริษัท (SSO)", en: "Step 1 · Sign in with the company account (SSO)" },
      caption: { th: "กดปุ่มเดียวด้วย Google Workspace, Entra ID หรือ Okta ออกจากบริษัทเมื่อไรก็เข้าไม่ได้ทันที", en: "One click with Google Workspace, Entra ID or Okta. Leave the company and access ends right away." } },
    { page: 5, group: G.employee,
      title: { th: "ขั้น 2 · เลือกโมเดลจากหลายค่าย", en: "Step 2 · Choose a model from many providers" },
      caption: { th: "เห็นเฉพาะโมเดลที่ admin เปิดให้แผนก หรือเลือก \"อัตโนมัติ\" ให้ gateway เลือกให้", en: "Only models the admin enabled for your team are shown, or pick \"Auto\" and let the gateway choose." } },
    { page: 6, group: G.employee,
      title: { th: "ขั้น 3 · ลากไฟล์เข้ามาในแชต", en: "Step 3 · Drop a file into the chat" },
      caption: { th: "แนบ PDF, Word, Excel หรือรูป ระบบอ่านข้อความออกมา (OCR) แล้วตรวจเหมือนข้อความที่พิมพ์", en: "Attach a PDF, Word, Excel or image. The text is extracted (OCR) and checked like typed text." } },
    { page: 7, group: G.employee,
      title: { th: "ขั้น 4 · ตรวจ แล้วปกปิดก่อนส่ง", en: "Step 4 · Check, then mask before sending" },
      caption: { th: "เจอชื่อ เบอร์โทร เลขบัตร ก็แทนเป็น token อย่าง [PERSON_001] ก่อนออกนอกบริษัท", en: "Names, phone and ID numbers become tokens like [PERSON_001] before anything leaves the company." } },
    { page: 8, group: G.employee,
      title: { th: "ขั้น 5 · AI ตอบ แล้วถอดค่าจริงคืนให้", en: "Step 5 · The AI answers, real values come back" },
      caption: { th: "คำตอบที่มี token ถูกแปลงกลับเป็นค่าจริงให้เฉพาะคนที่ส่ง", en: "Tokens in the answer are turned back into real values for the sender only." } },
    { page: 9, group: G.employee,
      title: { th: "ขั้น 6 · เคสก้ำกึ่งถามก่อน ความลับบล็อกทันที", en: "Step 6 · Ask when unsure, block secrets at once" },
      caption: { th: "ข้อมูลที่ไม่แน่ใจให้ผู้ใช้ยืนยัน ส่วน secret / API key ไม่ถูกส่งเลย", en: "Borderline data is confirmed by the user; secrets and API keys are never sent." } },
    { page: 10, group: G.employee,
      title: { th: "ขั้น 7 · ส่งเสร็จ แล้วลบทิ้ง", en: "Step 7 · Sent, then deleted" },
      caption: { th: "zero-retention: ลบ token และเนื้อหาหลังตอบเสร็จ เหลือแค่ metadata", en: "Zero-retention: tokens and content are deleted after the answer; only metadata remains." } },
    { page: 11, group: G.admin,
      title: { th: "ขั้น 8 · เชื่อม LLM หลายค่ายด้วย key ขององค์กร", en: "Step 8 · Connect many LLMs with the company's keys" },
      caption: { th: "เห็นทุกค่ายที่เชื่อมไว้ในหน้าเดียว: สถานะ ความเร็ว และระดับข้อมูลที่อนุญาต key เข้ารหัสก่อนเก็บ", en: "Every connected provider on one page: status, speed and allowed data level. Keys are encrypted at rest." } },
    { page: 12, group: G.admin,
      title: { th: "ขั้น 9 · เพิ่มค่ายใหม่", en: "Step 9 · Add a provider" },
      caption: { th: "รองรับค่ายใหญ่ cloud ของ hyperscaler LLM ภาษาไทย และโมเดลในบริษัท กดทดสอบด้วยข้อความสังเคราะห์", en: "Major APIs, hyperscaler clouds, Thai LLMs and in-house models. Test with a synthetic message." } },
    { page: 13, group: G.admin,
      title: { th: "ขั้น 10 · กฎ routing", en: "Step 10 · Routing rules" },
      caption: { th: "โหมดอัตโนมัติทำตามกฎจากบนลงล่าง ความลับชนะราคาและความเร็ว ไม่มีโมเดลที่ผ่านก็ไม่ส่ง (fail closed)", en: "Auto mode follows rules top to bottom. Sensitivity beats price and speed; no eligible model means nothing is sent (fail closed)." } },
    { page: 14, group: G.admin,
      title: { th: "ขั้น 11 · Policy และตัวตรวจจับ", en: "Step 11 · Policies and detectors" },
      caption: { th: "ตั้งว่าข้อมูลแต่ละชนิดให้ผ่าน ปกปิด ถามก่อน หรือบล็อก แล้วลอง dry-run ก่อนใช้จริง", en: "Choose allow, mask, ask or block per data type, then dry-run before going live." } },
    { page: 15, group: G.admin,
      title: { th: "ขั้น 12 · แอปภายในเรียกผ่าน gateway", en: "Step 12 · Internal apps call through the gateway" },
      caption: { th: "API แบบ OpenAI-compatible แอปเดิมแค่เปลี่ยน base URL กับ key ก็ได้การตรวจและ audit ครบ", en: "OpenAI-compatible API: existing apps change only the base URL and key to get checks and audit." } },
    { page: 16, group: G.obs,
      title: { th: "ต่อเข้า Grafana ขององค์กรเอง", en: "Plug into the company's own Grafana" },
      caption: { th: "ไม่สร้าง dashboard เอง แต่เปิด /metrics, log และ Audit API ให้ Grafana ที่องค์กรมีอยู่ดึงไปใช้", en: "No custom dashboard: /metrics, logs and an Audit API feed the Grafana the company already runs." } },
    { page: 17, group: G.obs,
      title: { th: "API spec สำหรับองค์กรที่จะต่อเอง", en: "API spec for companies that integrate themselves" },
      caption: { th: "ร่าง endpoint ทุกตัวส่งแค่ metadata และใช้ token แยกสิทธิ์แบบอ่านอย่างเดียว", en: "Draft endpoints return metadata only, using read-only scoped tokens." } },
    { page: 18, group: G.mobile, mobile: true,
      title: { th: "มือถือ: แชตได้ ด่านตรวจเดียวกัน", en: "Mobile: chat with the same checks" },
      caption: { th: "เว็บแบบ responsive / PWA ไม่ต้องลงแอป ทุกข้อความผ่าน gateway และ policy เดียวกับเว็บ", en: "Responsive web / PWA, nothing to install. Every message goes through the same gateway and policies." } },
    { page: 19, group: G.mobile, mobile: true,
      title: { th: "มือถือ: ถ่ายรูป ถามก่อนส่ง ดูแลระบบ", en: "Mobile: photos, ask-before-send, admin" },
      caption: { th: "รูปจากกล้องผ่าน OCR และด่านตรวจเหมือนไฟล์ ถามก่อนส่ง และ admin ดูแลระบบจากโทรศัพท์ได้", en: "Camera photos go through OCR and the same checks as files, ask before sending, and admins can manage from a phone." } },
    { page: 20, group: G.summary,
      title: { th: "มีอะไรแล้ว และจะไปต่ออย่างไร", en: "What's done and what's next" },
      caption: { th: "แกนตรวจ ปกปิด ถอดกลับใน demo ทำงานแล้ว ขั้นต่อไปคือเพิ่มช่องทาง ค่าย LLM และ observability", en: "The check-mask-restore core works in the demo; next come more channels, LLM providers and observability." } },
].map((item) => ({ ...item, src: img(item.page) }));

export const webDesignPages = designPages.filter((item) => !item.mobile);
export const mobileDesignPages = designPages.filter((item) => item.mobile);
