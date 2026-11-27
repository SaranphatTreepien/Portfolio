// Detail-page content for personal tools (no public repo or download): recorded demo clips,
// what each part runs on, and what I built. Card data (name, tagline, stats, tech) lives in liveProjects.js.
// Clips are animated WebP recorded from the real apps, so they keep playing like GIFs at a fraction of the size.

const se = (file) => `/assets/projects/scene-english/${file}`;
const ava = (file) => `/assets/projects/ava/${file}`;

export const sideProjectPages = {
    "scene-english": {
        note: {
            th: "เครื่องมือที่ทำไว้ใช้เอง รันบนเครื่องตัวเองด้วย API key ของผม จึงไม่ได้เปิดให้ดาวน์โหลด คลิปในหน้านี้อัดจากแอปจริง (ช่วงรอ AI ถูกเร่งให้สั้นลง)",
            en: "A tool I built for myself. It runs on my machine with my own API keys, so there is no download. The clips are recorded from the real app (waits for the AI are sped up).",
        },
        clips: [
            {
                src: se("new-lesson.webp"),
                title: { th: "สร้างบทเรียนจากสถานการณ์", en: "A lesson from a situation" },
                caption: {
                    th: "พิมพ์ “a busy coffee shop in the morning” แล้วระบบเลือกคำ แต่งเรื่อง วาดภาพ และตีกรอบของในภาพ",
                    en: "Type “a busy coffee shop in the morning”; it picks the words, writes the story, draws the picture and boxes the objects",
                },
            },
            {
                src: se("explore-scene.webp"),
                title: { th: "กดของในภาพเพื่อเรียนคำ", en: "Tap an object to learn the word" },
                caption: {
                    th: "คำอ่าน ความหมาย คำเหมือน คำที่ใช้คู่กัน และประโยคตัวอย่างครบ 12 tense พร้อมสีบอกชนิดคำในเรื่อง",
                    en: "Pronunciation, meaning, synonyms, collocations and an example in each of the 12 tenses, with word types coloured in the story",
                },
            },
            {
                src: se("speaking-practice.webp"),
                title: { th: "พูดตามแล้วได้คะแนนรายคำ", en: "Speak and get a per-word score" },
                caption: {
                    th: "Whisper ถอดเสียง เทียบกับประโยคเป้าหมายทีละคำ คำที่ขาดเป็นสีแดง แล้ว AI อธิบายวิธีออกเสียงเป็นภาษาไทย",
                    en: "Whisper transcribes, the result is aligned word by word with the target, missed words turn red and the AI explains the sound in Thai",
                },
            },
            {
                src: se("roleplay.webp"),
                title: { th: "Roleplay ตามสถานการณ์", en: "Roleplay in the scene" },
                caption: {
                    th: "AI เล่นเป็นบาริสต้าและพูดออกเสียง ฝั่งเราเห็นแค่คำใบ้ภาษาไทย ต้องพูดเป็นภาษาอังกฤษเอง",
                    en: "The AI plays the barista and speaks its lines; you only see a Thai hint and answer in English yourself",
                },
            },
            {
                src: se("compare-boxes.webp"),
                title: { th: "เทียบ Gemini กับ Qwen", en: "Gemini vs Qwen" },
                caption: {
                    th: "ให้สองโมเดลหาตำแหน่งของชุดเดียวกัน แล้วสลับดูได้ว่าตัวไหนตีกรอบแม่นกว่า",
                    en: "Both models locate the same objects, and you can switch to see which boxes are closer",
                },
            },
            {
                src: se("word-sets.webp"),
                title: { th: "ชุดคำศัพท์ตามหัวข้อ", en: "Word sets by topic" },
                caption: {
                    th: "โหมดไม่มีภาพ: ได้คำ 5–10 คำ พร้อมประโยคที่ใช้หลายคำในชุดเดียวกัน",
                    en: "A mode without pictures: 5–10 words plus sentences that combine several of them",
                },
            },
        ],
        flowTitle: { th: "งานแต่ละอย่างใช้อะไร", en: "What runs each part" },
        flowText: {
            th: "เลือกโมเดลตามงาน และงานที่สำคัญมีตัวสำรองเสมอ",
            en: "Each task uses the model that suits it, and the important ones have a backup",
        },
        flow: [
            { who: { th: "แต่งบทเรียน", en: "Lesson text" }, text: { th: "Gemini ก่อน ถ้าล่มสลับไป Groq GPT-OSS 120B อัตโนมัติ", en: "Gemini first, Groq GPT-OSS 120B automatically if it fails" } },
            { who: { th: "วาดภาพ", en: "Picture" }, text: { th: "FLUX.1 schnell ผ่าน Pollinations ขนาด 1000×1000", en: "FLUX.1 schnell via Pollinations at 1000×1000" } },
            { who: { th: "หาตำแหน่งของ", en: "Object boxes" }, text: { th: "Gemini และ Qwen VL พิกัด 0–1000 แปลงให้ตรงกับภาพ", en: "Gemini and Qwen VL, 0–1000 coordinates mapped onto the image" } },
            { who: { th: "ฟังเสียงพูด", en: "Speech in" }, text: { th: "Groq Whisper v3 Turbo แล้วให้คะแนนในเบราว์เซอร์", en: "Groq Whisper v3 Turbo, scored in the browser" } },
            { who: { th: "พูดตอบ", en: "Voice out" }, text: { th: "Groq Orpheus ถ้าใช้ไม่ได้ใช้เสียงของเบราว์เซอร์", en: "Groq Orpheus, or the browser's own voice as a fallback" } },
        ],
        built: [
            { th: "Backend Express ตัวเดียว งานสร้างบทเรียนรันเป็น background job ให้หน้าเว็บ poll สถานะ", en: "A single Express backend; lesson generation runs as a background job the page polls" },
            { th: "ชั้น AI ที่สลับผู้ให้บริการเมื่อล่ม และ retry เมื่อโมเดลไม่รับ JSON mode", en: "An AI layer that switches provider on failure and retries when a model rejects JSON mode" },
            { th: "แปลงพิกัดกรอบจากสองโมเดลที่ใช้รูปแบบต่างกัน ([y,x] กับ [x,y]) ให้วางบนภาพเดียวกันได้", en: "Box conversion for two models with different formats ([y,x] vs [x,y]) so both draw on the same image" },
            { th: "ให้คะแนนการพูดด้วยการจับคู่คำแบบ LCS ไม่ต้องเรียก AI ซ้ำ", en: "Speaking score from an LCS word alignment, with no extra AI call" },
            { th: "เก็บบทเรียน ภาพ เสียง และความคืบหน้าเป็นไฟล์ ประโยคที่แต่งแล้วเก็บไว้ใช้ซ้ำ", en: "Lessons, images, audio and progress stored as files; generated sentences are cached for reuse" },
            { th: "หน้าเว็บ vanilla JS ไม่ใช้ framework และรันด้วย Docker Compose คำสั่งเดียว", en: "A vanilla JS front end with no framework, run with one Docker Compose command" },
        ],
    },

    ava: {
        note: {
            th: "แอปที่ทำไว้ใช้เองบน Windows ใช้ API key ของผม จึงไม่ได้เปิดให้ดาวน์โหลด คลิปในหน้านี้อัดจากแอปจริงด้วยข้อมูลตัวอย่าง ไม่มีเสียง (คลิปเสียงใช้เสียงสังเคราะห์ป้อนเข้าไมค์)",
            en: "A Windows app I built for myself. It uses my own API keys, so there is no download. The clips are recorded from the real app with sample data and have no sound (the voice clip uses synthetic speech as the microphone).",
        },
        clips: [
            {
                src: ava("planner.webp"),
                title: { th: "วางแผนวัน", en: "Plan my day" },
                caption: {
                    th: "บอกงานที่ต้องทำ แล้วได้ตารางเวลาทั้งวันพร้อมลำดับความสำคัญ Must / Should / Could",
                    en: "List what needs doing and get a full-day schedule with Must / Should / Could priorities",
                },
            },
            {
                src: ava("coach.webp"),
                title: { th: "โหมดแก้ภาษาอังกฤษ", en: "Correct-me mode" },
                caption: {
                    th: "พิมพ์หรือพูดภาษาอังกฤษ แล้วได้คำแก้แต่ละจุดพร้อมเหตุผลภาษาไทย และประโยคที่ถูก",
                    en: "Write or say something in English and get each correction explained in Thai, plus the fixed sentence",
                },
            },
            {
                src: ava("voice-live.webp"),
                title: { th: "คุยด้วยเสียงแบบ real-time", en: "Real-time voice" },
                caption: {
                    th: "Gemini Live ฟังและตอบทันที ข้อความที่ถอดได้ขึ้นในแชตเดียวกัน สลับไปใช้ Groq ได้จากแถบด้านล่าง",
                    en: "Gemini Live listens and answers at once, with the transcript in the same chat; switch to Groq from the bar",
                },
            },
            {
                src: ava("todo-tools.webp"),
                title: { th: "บันทึก to-do และตั้งเตือน", en: "To-dos and reminders" },
                caption: {
                    th: "สั่งเป็นประโยคธรรมดา AI เรียก tool บันทึกลงฐานข้อมูล แล้วรายการก็ขึ้นในหน้า Notes & reminders",
                    en: "Ask in plain words; the AI calls a tool that writes to the database, and the item shows up in Notes & reminders",
                },
            },
            {
                src: ava("interview-pack.webp"),
                title: { th: "ฝึกสัมภาษณ์ด้วย scenario pack", en: "Interview practice with a pack" },
                caption: {
                    th: "Ctrl+K เลือกโหมดหรือ pack แล้ว AI รับบทผู้สัมภาษณ์ตามข้อมูลใน pack ถามทีละข้อ",
                    en: "Ctrl+K picks a mode or pack; the AI then plays the interviewer from the pack and asks one question at a time",
                },
            },
        ],
        stills: [
            { src: ava("settings.jpg"), title: { th: "Settings", en: "Settings" }, caption: { th: "เลือกผู้ให้บริการหลัก เสียง และภาษาตอบ แอปบอกแค่ว่าเจอคีย์ ไม่แสดงค่าคีย์", en: "Main provider, voice and reply language; the app only says a key was found, never shows it" } },
            { src: ava("library.jpg"), title: { th: "Library", en: "Library" }, caption: { th: "จัดการ knowledge pack และ scenario pack ที่ติดให้แต่ละแชตได้", en: "Knowledge and scenario packs that can be equipped per chat" } },
        ],
        flowTitle: { th: "ข้อความหนึ่งข้อความผ่านอะไรบ้าง", en: "What one message passes through" },
        flowText: {
            th: "ส่วนที่คุยกับ AI และฐานข้อมูลอยู่ใน main process ของ Electron หน้าต่างแชตเรียกผ่าน IPC เท่านั้น",
            en: "Everything that talks to the AI or the database lives in Electron's main process; the chat window only goes through IPC",
        },
        flow: [
            { who: { th: "ตรวจก่อนส่ง", en: "Secret check" }, text: { th: "ถ้าเจอรหัสผ่านหรือ API key ในข้อความหรือไฟล์แนบ จะเตือนและถามก่อนส่ง", en: "Warns and asks before sending if a message or file looks like it has a password or API key" } },
            { who: { th: "ประกอบ prompt", en: "Prompt" }, text: { th: "persona + โหมด + pack ที่ติดไว้ + ประวัติแชต", en: "Persona, mode, equipped packs and chat history" } },
            { who: { th: "เลือก AI", en: "Provider" }, text: { th: "Groq ก่อน ถ้าล่มกลางทางล้างคำตอบครึ่งเดียวแล้วต่อด้วย Gemini", en: "Groq first; if it fails mid-stream the partial reply is cleared and Gemini continues" } },
            { who: { th: "เรียก tool", en: "Tools" }, text: { th: "12 tool เช่น note, reminder, ค้นเว็บ ตรวจ argument ก่อนรันทุกครั้ง", en: "12 tools such as notes, reminders and web search, with arguments validated first" } },
            { who: { th: "เก็บข้อมูล", en: "Storage" }, text: { th: "SQLite บนเครื่องด้วย node:sqlite และ scheduler แจ้งเตือนตามเวลา", en: "Local SQLite through node:sqlite, plus a scheduler that fires reminders" } },
        ],
        built: [
            { th: "แอป Electron + TypeScript bundle ด้วย esbuild และทำไฟล์ติดตั้งด้วย electron-builder", en: "An Electron + TypeScript app bundled with esbuild and packaged with electron-builder" },
            { th: "อยู่ใน tray เปิดด้วย global hotkey และจำขนาดและตำแหน่งหน้าต่างไว้", en: "Lives in the tray, opens with a global hotkey and remembers its window size and position" },
            { th: "ชั้น AI ที่สลับ Groq / Gemini ได้ รวมถึงตอนที่คำตอบกำลังสตรีมอยู่", en: "An AI layer that falls back between Groq and Gemini, even while a reply is streaming" },
            { th: "คุยเสียงสองแบบ: Gemini Live แบบ real-time หรือ Whisper → GPT-OSS → Orpheus", en: "Two voice paths: Gemini Live in real time, or Whisper → GPT-OSS → Orpheus" },
            { th: "Tool calling ที่ตรวจ argument ก่อนรัน และบันทึกทุกการกระทำไว้ใน Action log", en: "Tool calls with validated arguments, every action written to an action log" },
            { th: "SQLite พร้อม migration, ติดตามโควตา API ต่อวัน และ test 73 เคสด้วย Vitest", en: "SQLite with migrations, daily API usage tracking, and 73 Vitest tests" },
        ],
    },
};
