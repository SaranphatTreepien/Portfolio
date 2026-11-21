"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { UI } from "@/lib/i18n";

// Site-wide Thai / English switch. The choice is kept in localStorage; first visit follows the browser language.
// The server always renders English, then the client swaps to the saved language after mount.

const LANGS = ["th", "en"];
const STORAGE_KEY = "lang";
const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
    const [lang, setLangState] = useState("en");

    useEffect(() => {
        let saved = null;
        try {
            saved = localStorage.getItem(STORAGE_KEY);
        } catch {}
        const initial = LANGS.includes(saved) ? saved : navigator.language?.toLowerCase().startsWith("th") ? "th" : "en";
        setLangState(initial);
    }, []);

    useEffect(() => {
        document.documentElement.lang = lang;
    }, [lang]);

    const setLang = useCallback((next) => {
        if (!LANGS.includes(next)) return;
        setLangState(next);
        try {
            localStorage.setItem(STORAGE_KEY, next);
        } catch {}
    }, []);

    const value = useMemo(() => {
        // tx: pick the current language from a {th, en} object; plain strings pass through
        const tx = (v) => (v && typeof v === "object" && !Array.isArray(v) && ("th" in v || "en" in v) ? v[lang] ?? v.en : v);
        // t: look up a key in the shared UI dictionary; function entries take arguments
        const t = (key, ...args) => {
            const v = tx(UI[key]);
            if (v === undefined) return key;
            return typeof v === "function" ? v(...args) : v;
        };
        return { lang, setLang, t, tx };
    }, [lang, setLang]);

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error("useLang must be used inside <LanguageProvider>");
    return ctx;
}

export function LanguageToggle({ className = "", dark = false }) {
    const { lang, setLang } = useLang();
    const base = dark ? "border-white/30 bg-white/10" : "border-gray-200 bg-white";
    return (
        <div role="group" aria-label="Language / ภาษา" className={`inline-flex shrink-0 items-center gap-0.5 rounded-full border p-0.5 ${base} ${className}`}>
            {LANGS.map((code) => (
                <button
                    key={code}
                    type="button"
                    onClick={() => setLang(code)}
                    aria-pressed={lang === code}
                    className={`rounded-full px-2.5 py-1 text-xs font-bold transition-colors ${
                        lang === code ? "bg-primary text-white" : dark ? "text-white/80 hover:text-white" : "text-gray-500 hover:text-primary"
                    }`}
                >
                    {code.toUpperCase()}
                </button>
            ))}
        </div>
    );
}
