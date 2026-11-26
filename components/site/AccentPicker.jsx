"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "../LanguageProvider";
import { THEME_EVENT } from "./ThemeToggle";
import { ACCENT_KEY, DAY_ACCENTS, applyAccent, todayKey } from "./accent";

// Accent colour picker: seven dots, one per day (Thai day colours). Today's colour is on by default
// (set in <head> by app/layout.jsx); a picked colour holds until midnight, then the next day's takes over.

const readAccent = () => document.documentElement.dataset.accent || "green";

export default function AccentPicker({ align = "left" }) {
    const { tx } = useLang();
    const [accent, setAccent] = useState("green");
    const [today, setToday] = useState(3);
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const sync = () => setAccent(readAccent());
        sync();
        setToday(new Date().getDay());
        window.addEventListener(THEME_EVENT, sync);
        return () => window.removeEventListener(THEME_EVENT, sync);
    }, []);

    useEffect(() => {
        if (!open) return;
        const onDown = (e) => !ref.current?.contains(e.target) && setOpen(false);
        const onKey = (e) => e.key === "Escape" && setOpen(false);
        document.addEventListener("pointerdown", onDown);
        window.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("pointerdown", onDown);
            window.removeEventListener("keydown", onKey);
        };
    }, [open]);

    const choose = (id) => {
        applyAccent(id);
        try {
            localStorage.setItem(ACCENT_KEY, JSON.stringify({ id, day: todayKey() }));
        } catch {}
        setOpen(false);
        // Same event as the theme switch: the graph and tab icon repaint, the other picker follows
        window.dispatchEvent(new Event(THEME_EVENT));
    };

    const current = DAY_ACCENTS.find((a) => a.id === accent) ?? DAY_ACCENTS[3];
    const name = (a) => `${tx({ th: "วัน", en: "" })}${tx(a.day)} · ${tx(a.label)}`;

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-haspopup="true"
                aria-label={tx({ th: "เลือกสีประจำวัน", en: "Choose accent colour" })}
                title={name(current)}
                className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-gray-100 ${open ? "ring-1 ring-brand-400" : ""}`}
            >
                <span className="h-[15px] w-[15px] rounded-full transition-colors" style={{ background: current.dot }} />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.96 }}
                        transition={{ duration: 0.14 }}
                        className={`absolute top-10 z-50 w-[164px] rounded-lg border border-gray-200 bg-white p-1.5 shadow-[0_14px_36px_-12px_rgba(0,0,0,0.5)] ${align === "right" ? "right-0" : "left-0"}`}
                    >
                        <p className="px-2 pb-1.5 pt-1 text-[11px] font-medium uppercase tracking-[0.12em] text-gray-500">
                            {tx({ th: "สีประจำวัน", en: "Colour of the day" })}
                        </p>
                        <ul role="menu" className="flex flex-col">
                            {DAY_ACCENTS.map((a, i) => {
                                const on = a.id === accent;
                                return (
                                    <li key={a.id}>
                                        <button
                                            type="button"
                                            role="menuitemradio"
                                            aria-checked={on}
                                            onClick={() => choose(a.id)}
                                            className={`flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-[13px] transition-colors hover:bg-gray-100 ${on ? "bg-gray-100 text-primary" : "text-gray-600"}`}
                                        >
                                            <span
                                                className="h-3.5 w-3.5 shrink-0 rounded-full"
                                                style={{ background: a.dot, boxShadow: on ? `0 0 0 2px rgb(var(--surface)), 0 0 0 3.5px ${a.dot}` : undefined }}
                                            />
                                            <span className="flex-1">{tx(a.day)}</span>
                                            {i === today && (
                                                <span className="rounded-sm bg-gray-100 px-1 font-mono text-[10px] text-gray-500">{tx({ th: "วันนี้", en: "today" })}</span>
                                            )}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
