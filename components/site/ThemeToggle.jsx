"use client";

import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { useLang } from "../LanguageProvider";
import { THEME_KEY } from "./theme";
import { todayKey } from "./accent";

// Day or night follows the time in Thailand (components/site/theme.js); this switch overrides it for the rest of the day.
export const THEME_EVENT = "themechange";

export default function ThemeToggle({ className = "" }) {
    const { tx } = useLang();
    const [dark, setDark] = useState(true);

    // Read the real state on mount, and stay in step with the other switch (desktop sidebar / phone bar)
    useEffect(() => {
        const sync = () => setDark(document.documentElement.classList.contains("dark"));
        sync();
        window.addEventListener(THEME_EVENT, sync);
        return () => window.removeEventListener(THEME_EVENT, sync);
    }, []);

    const toggle = () => {
        const next = !document.documentElement.classList.contains("dark");
        document.documentElement.classList.toggle("dark", next);
        // A manual choice holds until midnight, then the clock takes over again
        try {
            localStorage.setItem(THEME_KEY, JSON.stringify({ mode: next ? "dark" : "light", day: todayKey() }));
        } catch {}
        window.dispatchEvent(new Event(THEME_EVENT));
    };

    const label = dark ? tx({ th: "เปลี่ยนเป็นโหมดสว่าง", en: "Switch to light theme" }) : tx({ th: "เปลี่ยนเป็นโหมดมืด", en: "Switch to dark theme" });
    const hint = tx({ th: " (ปกติเปลี่ยนเองตามเวลาไทย)", en: " (normally follows the time in Thailand)" });
    return (
        <button
            type="button"
            onClick={toggle}
            aria-label={label}
            title={label + hint}
            className={`flex h-8 w-8 items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-gray-100 hover:text-primary ${className}`}
        >
            {dark ? <FiSun className="h-[17px] w-[17px]" /> : <FiMoon className="h-[17px] w-[17px]" />}
        </button>
    );
}
