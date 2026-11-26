// Accent colours: one per day of the week, the Thai day colours. Index = Date.getDay() (0 = Sunday).
// Today's colour is used automatically; a colour picked in the sidebar holds until the day changes.

export const DAY_ACCENTS = [
    { id: "red", dot: "#f87171", day: { th: "อาทิตย์", en: "Sunday" }, label: { th: "แดง", en: "Red" } },
    { id: "yellow", dot: "#facc15", day: { th: "จันทร์", en: "Monday" }, label: { th: "เหลือง", en: "Yellow" } },
    { id: "pink", dot: "#f472b6", day: { th: "อังคาร", en: "Tuesday" }, label: { th: "ชมพู", en: "Pink" } },
    { id: "green", dot: "#4cc3b8", day: { th: "พุธ", en: "Wednesday" }, label: { th: "เขียว", en: "Green" } },
    { id: "orange", dot: "#fb923c", day: { th: "พฤหัสบดี", en: "Thursday" }, label: { th: "ส้ม", en: "Orange" } },
    { id: "sky", dot: "#38bdf8", day: { th: "ศุกร์", en: "Friday" }, label: { th: "ฟ้า", en: "Sky blue" } },
    { id: "purple", dot: "#a78bfa", day: { th: "เสาร์", en: "Saturday" }, label: { th: "ม่วง", en: "Purple" } },
];

export const ACCENT_KEY = "accent";

export const todayKey = (d = new Date()) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

// Runs in <head> before the first paint (app/layout.jsx), so it must stay plain ES5 in a string.
// Green is the stylesheet default and needs no attribute.
export const ACCENT_SCRIPT = `try{var d=document.documentElement,ids=${JSON.stringify(DAY_ACCENTS.map((a) => a.id))},n=new Date(),t=n.getFullYear()+'-'+(n.getMonth()+1)+'-'+n.getDate(),a=ids[n.getDay()];try{var s=JSON.parse(localStorage.getItem('${ACCENT_KEY}')||'null');if(s&&s.day===t&&ids.indexOf(s.id)>-1)a=s.id}catch(e){}if(a!=='green')d.dataset.accent=a}catch(e){}`;

export function applyAccent(id) {
    const root = document.documentElement;
    if (id === "green") delete root.dataset.accent;
    else root.dataset.accent = id;
}
