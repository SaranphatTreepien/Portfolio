// Light / dark follows the clock in Thailand: day 06:00–18:00, night otherwise, with a warm sky for
// dawn (05:00–07:00) and dusk (17:00–19:00). Flipping the sidebar switch overrides it until midnight.

export const THEME_KEY = "theme";

// Hours in Bangkok (UTC+7, no daylight saving), as a fraction: 17.5 = 17:30
export const bangkokHour = (d = new Date()) => ((d.getUTCHours() + 7) % 24) + d.getUTCMinutes() / 60;

export const autoMode = (h = bangkokHour()) => (h >= 6 && h < 18 ? "light" : "dark");
export const skyAt = (h = bangkokHour()) => (h >= 17 && h < 19 ? "dusk" : h >= 5 && h < 7 ? "dawn" : "");

// Runs in <head> before the first paint (app/layout.jsx), so it stays plain ES5 in a string; mirrors the helpers above.
export const THEME_SCRIPT = `try{var d=document.documentElement,n=new Date(),h=(n.getUTCHours()+7)%24+n.getUTCMinutes()/60,t=n.getFullYear()+'-'+(n.getMonth()+1)+'-'+n.getDate(),m=null;try{var s=JSON.parse(localStorage.getItem('${THEME_KEY}')||'null');if(s&&s.day===t&&(s.mode==='light'||s.mode==='dark'))m=s.mode}catch(e){}if(!m)m=(h>=6&&h<18)?'light':'dark';if(m==='light')d.classList.remove('dark');var k=(h>=17&&h<19)?'dusk':(h>=5&&h<7)?'dawn':'';if(k)d.dataset.sky=k}catch(e){}`;
