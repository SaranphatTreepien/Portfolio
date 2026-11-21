// Shared UI strings (Thai / English). Use with useLang().t("key"); entries can be functions that take arguments.
// Content that belongs to one component (Journey cards, project data) lives next to that data as {th, en} objects.

export const UI = {
    // navigation (ids stay the same; only labels change)
    "nav.Home": { th: "หน้าแรก", en: "Home" },
    "nav.Live": { th: "ผลงาน", en: "Live" },
    "nav.Experience": { th: "ประสบการณ์", en: "Experience" },
    "nav.Journey": { th: "เส้นทาง", en: "Journey" },
    "nav.About": { th: "เกี่ยวกับ", en: "About" },
    "nav.Contact": { th: "ติดต่อ", en: "Contact" },
    "header.subtitle": { th: "วิศวกรคอมพิวเตอร์ · Cloud & Network", en: "Computer Engineer · Cloud & Network" },
    "menu.location": { th: "ที่อยู่", en: "Location" },
    "menu.locationValue": { th: "กรุงเทพฯ ประเทศไทย", en: "Bangkok, Thailand" },
    "menu.phone": { th: "โทรศัพท์", en: "Phone" },
    "menu.email": { th: "อีเมล", en: "Email" },
    "menu.open": { th: "เปิดเมนู", en: "Open menu" },
    "menu.close": { th: "ปิดเมนู", en: "Close menu" },

    // hero
    "hero.resume": { th: "CV", en: "CV" },
    "hero.close": { th: "ปิด", en: "Close" },
    "hero.lumaPreview": { th: "ตัวอย่าง", en: "PREVIEW" },
    "hero.lumaProof": { th: "หลักฐานการเข้าร่วมงานอีเวนต์", en: "Event attendance proof" },
    "hero.lumaView": { th: "ดูโปรไฟล์ Luma", en: "View Luma Profile" },
    "cred.title": { th: "Badges และใบรับรอง", en: "Badges & Certifications" },
    "cred.counts": { th: (b, c) => `${b} badges · ${c} ใบรับรอง`, en: (b, c) => `${b} badges · ${c} certificates` },
    "cred.viewAll": { th: "ดูทั้งหมดบน Credly", en: "View all on Credly" },
    "cred.prev": { th: "เลื่อนไปทางซ้าย", en: "Scroll left" },
    "cred.next": { th: "เลื่อนไปทางขวา", en: "Scroll right" },

    // live projects
    "live.title": { th: "ผลงานเด่น", en: "Live Project" },
    "live.subtitle": { th: "เว็บจริงและเดโมที่ลองเล่นได้ — กดแล้วเปิดดูเต็มจอ", en: "Real sites and playable demos — click to open full screen" },
    "live.badgeLive": { th: "LIVE · โปรเจกต์ส่วนตัว", en: "LIVE · Side Project" },
    "live.play": { th: "เล่นเต็มจอ ↗", en: "Play full screen ↗" },
    "live.playAria": { th: (n) => `เล่น ${n} เต็มจอในแท็บใหม่`, en: (n) => `Play ${n} full screen in a new tab` },
    "live.visit": { th: "ไปเว็บจริง", en: "Visit site" },
    "live.tryFull": { th: "ลองเดโมเต็มจอ", en: "Try the demo full screen" },
    "live.back": { th: "กลับ Portfolio", en: "Back to portfolio" },

    // experience (public part; admin tools stay Thai)
    "work.title": { th: "ประสบการณ์ของผม", en: "My Experience" },
    "work.loading": { th: "กำลังโหลดข้อมูล...", en: "Loading..." },
    "work.empty": { th: "ยังไม่มีข้อมูลในหมวดนี้", en: "Nothing in this category yet" },
    "work.all": { th: (n) => `ทั้งหมด (${n})`, en: (n) => `All (${n})` },
    "work.years": { th: (n) => `ปี (${n})`, en: (n) => `Years (${n})` },
    "work.hide": { th: "ซ่อน", en: "Hide" },
    "work.loadMore": { th: (n) => `ดูเพิ่ม (${n})`, en: (n) => `Load more (${n})` },
    "work.adminAccess": { th: "Admin Access", en: "Admin Access" },
    "graph.year": { th: "ปี (เส้นประ = ไทม์ไลน์)", en: "Year (dashed = timeline)" },
    "graph.help": {
        th: "คลิกหัวข้อ/ปีเพื่อกรองผลงานด้านล่าง · คลิกจุดเพื่อเปิดผลงาน · ลากเพื่อเลื่อน · Ctrl + scroll เพื่อซูม",
        en: "Click a topic/year to filter the work below · click a dot to open it · drag to pan · Ctrl + scroll to zoom",
    },
    "graph.zoomIn": { th: "ซูมเข้า", en: "Zoom in" },
    "graph.zoomOut": { th: "ซูมออก", en: "Zoom out" },
    "graph.fit": { th: "พอดีจอ", en: "Fit to view" },
    "graph.reset": { th: "รีเซ็ตตำแหน่งกลับเป็นแบบเดิม", en: "Reset layout" },

    // journey
    "journey.title": { th: "เส้นทางของผม", en: "My Journey" },
    "journey.freelance": { th: "ฟรีแลนซ์", en: "Freelance" },
    "journey.experience": { th: "ประสบการณ์", en: "Experience" },
    "journey.education": { th: "การศึกษา", en: "Education" },
    "journey.skill": { th: "ทักษะ", en: "Skills" },
    "journey.training": { th: "การอบรม", en: "Training" },

    // about
    "about.eyebrow": { th: "เกี่ยวกับผม", en: "About Me" },
    "about.name": { th: "ผมชื่อแม็กซ์", en: "My Name is Max" },
    "about.degree": { th: "วศ.บ. วิศวกรรมคอมพิวเตอร์", en: "B.Eng., Computer Engineering" },
    "about.field.name": { th: "ชื่อ", en: "Name" },
    "about.field.location": { th: "ที่อยู่", en: "Location" },
    "about.field.phone": { th: "โทรศัพท์", en: "Phone" },
    "about.field.email": { th: "อีเมล", en: "Email" },
    "about.locationValue": { th: "กรุงเทพฯ", en: "Bangkok" },

    // contact
    "contact.title": { th: "มาร่วมงานกัน", en: "Let's Work Together" },
    "contact.lead1": { th: "มีโปรเจกต์ในใจอยู่ไหม? ", en: "Got a project in mind? " },
    "contact.lead2": { th: "ฝากข้อมูลติดต่อไว้ด้านล่าง", en: "Please leave your contact details below" },
    "contact.lead3": { th: " แล้วผมจะติดต่อกลับโดยเร็วที่สุด", en: ", and I will get back to you as soon as possible." },
    "contact.first": { th: "ชื่อ", en: "First Name" },
    "contact.last": { th: "นามสกุล", en: "Last Name" },
    "contact.email": { th: "อีเมล", en: "Email Address" },
    "contact.phone": { th: "เบอร์โทรศัพท์", en: "Phone Number" },
    "contact.message": { th: "ข้อความ", en: "Message" },
    "contact.phFirst": { th: "สมชาย", en: "John" },
    "contact.phLast": { th: "ใจดี", en: "Doe" },
    "contact.phMessage": { th: "เล่ารายละเอียดโปรเจกต์ของคุณ...", en: "Tell me about your project details..." },
    "contact.sending": { th: "กำลังส่ง...", en: "Sending..." },
    "contact.send": { th: "ส่งข้อความ", en: "Send Message" },
    "contact.sent": { th: "ส่งข้อความเรียบร้อยแล้ว!", en: "Message Sent Successfully!" },
    "contact.success": { th: "สำเร็จ!", en: "Success!" },
    "contact.successText": { th: "ผมจะติดต่อกลับโดยเร็ว", en: "I'll get back to you shortly." },
    "contact.failed": { th: "ส่งข้อความไม่สำเร็จ", en: "Message not sent" },
    "contact.imageAlt": { th: "ภาพประกอบการติดต่อ", en: "Contact image" },

    // footer
    "footer.tagline": { th: "สร้างประสบการณ์ดิจิทัลที่น่าสนใจด้วยเทคโนโลยีเว็บสมัยใหม่", en: "Crafting engaging digital experiences with modern web technologies." },
    "footer.quickLinks": { th: "ลิงก์ด่วน", en: "Quick Links" },
    "footer.home": { th: "หน้าแรก", en: "Home" },
    "footer.about": { th: "เกี่ยวกับผม", en: "About Me" },
    "footer.experience": { th: "ประสบการณ์ของผม", en: "My Experience" },
    "footer.copyright": { th: (y) => `สงวนลิขสิทธิ์ © ${y} · ออกแบบและพัฒนาโดย Saranphat Treepien`, en: (y) => `Copyright © ${y} · Designed & Developed by Saranphat Treepien` },
    "footer.top": { th: "กลับขึ้นด้านบน", en: "Back to Top" },

    // project detail pages
    "detail.fullscreen": { th: "เปิดเต็มจอ ↗", en: "Open full screen ↗" },
    "detail.fullscreenAria": { th: (n) => `เปิด ${n} เต็มจอในแท็บใหม่`, en: (n) => `Open ${n} full screen in a new tab` },
    "detail.back": { th: "กลับ Portfolio", en: "Back to portfolio" },
    "detail.backToDemo": { th: "กลับไปลองเดโม", en: "Back to the demo" },
    "detail.openImage": { th: (n) => `เปิดหน้า ${n} ขนาดเต็มในแท็บใหม่`, en: (n) => `Open page ${n} full size in a new tab` },
    "detail.page": { th: (n) => `หน้า ${n}`, en: (n) => `Page ${n}` },
};
