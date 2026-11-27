"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLang } from "../LanguageProvider";
import RocketOrbit from "./RocketOrbit";

// The hero photo is a launch button for the rocket orbiting it.
// Tap: one quick extra lap. Press and hold: the caption turns into a charge bar, the flame and a glow
// grow with it; at 100% a power aura flares and the photo trembles. Let go when full: shockwave,
// flash and three fast laps with a huge flame. Charge progress is written straight to a CSS variable
// (--charge) every frame, so holding never re-renders React.

const FULL_MS = 1100;

export default function HeroPhoto() {
    const { tx, lang } = useLang();
    const [phase, setPhase] = useState("idle"); // idle | charging | full | launch
    const [laps, setLaps] = useState(0);
    const [power, setPower] = useState("normal");
    const rootRef = useRef(null);
    const captionRef = useRef(null);
    const percentRef = useRef(null);
    const frame = useRef(0);
    const start = useRef(0);
    const charge = useRef(0);
    const holding = useRef(false);

    const setCharge = (v) => {
        charge.current = v;
        rootRef.current?.style.setProperty("--charge", v.toFixed(3));
        captionRef.current?.style.setProperty("--charge", v.toFixed(3));
        if (percentRef.current) percentRef.current.textContent = `${Math.round(v * 100)}%`;
    };

    const tick = useCallback(() => {
        const v = Math.min(1, (performance.now() - start.current) / FULL_MS);
        setCharge(v);
        if (v >= 1) {
            setPhase("full");
            return;
        }
        frame.current = requestAnimationFrame(tick);
    }, []);

    const begin = () => {
        if (holding.current || phase === "launch") return;
        holding.current = true;
        start.current = performance.now();
        setPhase("charging");
        frame.current = requestAnimationFrame(tick);
    };

    const finish = useCallback((cancelled = false) => {
        if (!holding.current) return;
        holding.current = false;
        cancelAnimationFrame(frame.current);
        const v = charge.current;
        setCharge(0);
        if (cancelled) return setPhase("idle");
        if (v >= 1) {
            setPower("super");
            setLaps((n) => n + 3);
            setPhase("launch");
        } else {
            // A tap or a half charge: one quick lap
            setPower("normal");
            setLaps((n) => n + 1);
            setPhase("idle");
        }
    }, []);

    // Let go anywhere on the page counts; a scroll gesture taking over cancels
    useEffect(() => {
        const up = () => finish(false);
        const cancel = () => finish(true);
        window.addEventListener("pointerup", up);
        window.addEventListener("pointercancel", cancel);
        window.addEventListener("blur", cancel);
        return () => {
            window.removeEventListener("pointerup", up);
            window.removeEventListener("pointercancel", cancel);
            window.removeEventListener("blur", cancel);
            cancelAnimationFrame(frame.current);
        };
    }, [finish]);

    // The launch effects play once, then everything settles
    useEffect(() => {
        if (phase !== "launch") return;
        const timer = setTimeout(() => setPhase("idle"), 2100);
        return () => clearTimeout(timer);
    }, [phase]);

    const onKeyDown = (e) => {
        if ((e.key === " " || e.key === "Enter") && !e.repeat) {
            e.preventDefault();
            begin();
        }
    };
    const onKeyUp = (e) => {
        if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            finish(false);
        }
    };

    const charging = phase === "charging" || phase === "full";

    return (
        <>
            <div
                ref={rootRef}
                role="button"
                tabIndex={0}
                aria-label={tx({ th: "กดค้างเพื่อชาร์จจรวด แล้วปล่อย", en: "Press and hold to charge the rocket, then let go" })}
                title={tx({ th: "กดค้างไว้เพื่อชาร์จ", en: "Press and hold to charge" })}
                onPointerDown={(e) => {
                    if (e.button !== 0) return;
                    begin();
                }}
                onKeyDown={onKeyDown}
                onKeyUp={onKeyUp}
                onContextMenu={(e) => e.preventDefault()}
                className={`hero-photo relative aspect-square w-[260px] cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-8 focus-visible:ring-offset-transparent rounded-full is-${phase}`}
                style={{ "--charge": 0 }}
            >
                {/* Glow that grows with the charge; flares into an aura when full */}
                <div aria-hidden="true" className="power-glow" />
                {phase === "full" && (
                    <div aria-hidden="true" className="power-aura">
                        {Array.from({ length: 10 }, (_, i) => (
                            <span key={i} className="power-spark" style={{ "--a": `${i * 36}deg`, "--d": `${(i % 3) * 0.12}s` }} />
                        ))}
                    </div>
                )}
                {phase === "launch" && power === "super" && (
                    <>
                        <div aria-hidden="true" className="power-shock" />
                        <div aria-hidden="true" className="power-shock power-shock--late" />
                    </>
                )}

                <div className="hero-photo-body absolute inset-0">
                    {/* Circle follows the accent colour */}
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full"
                        style={{ background: "radial-gradient(circle at 35% 30%, rgb(var(--b200)) 0%, rgb(var(--b400)) 55%, rgb(var(--b500)) 100%)" }}
                    />
                    {/* The cut-out photo rises out of the circle at the top, kept inside it at the bottom */}
                    <div className="absolute -top-10 inset-x-0 bottom-0 overflow-hidden rounded-b-full">
                        <Image
                            src="/assets/hero/dev3.png"
                            fill
                            priority
                            quality={85}
                            draggable={false}
                            className="pointer-events-none object-contain object-bottom"
                            alt="Saranphat Treepian"
                            sizes="260px"
                        />
                    </div>
                    {phase === "launch" && power === "super" && <div aria-hidden="true" className="power-flash" />}
                </div>

                <RocketOrbit laps={laps} power={power} charging={charging} />
            </div>

            {/* The caption doubles as the charge meter while the photo is held */}
            <figcaption ref={captionRef} style={{ "--charge": 0 }} className="relative mt-12 min-h-[58px] w-full rounded-xl border border-white/80 bg-white/75 px-4 py-2.5 text-center text-[14px] leading-snug text-gray-600 shadow-[0_6px_20px_-12px_rgba(16,21,31,0.3)]">
                <span aria-hidden="true" className="absolute -top-[7px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-white/80 bg-white/75" />
                {charging ? (
                    <span className="flex flex-col gap-1.5" aria-live="polite">
                        <span className="flex items-center justify-between font-mono text-[12px] font-bold uppercase tracking-wider">
                            <span className={phase === "full" ? "charge-full-text" : "text-brand-700"}>
                                {phase === "full" ? tx({ th: "เต็มแล้ว ปล่อยได้", en: "Full power, let go" }) : tx({ th: "กำลังชาร์จ…", en: "Charging…" })}
                            </span>
                            <span ref={percentRef} className="tabular-nums text-gray-500">
                                0%
                            </span>
                        </span>
                        <span className="charge-track">
                            <span className="charge-fill" />
                        </span>
                    </span>
                ) : phase === "launch" && power === "super" ? (
                    <span className="block py-1.5 font-mono text-[13px] font-bold uppercase tracking-wider text-brand-700">
                        {tx({ th: "ทะยาน", en: "Liftoff" })}
                    </span>
                ) : lang === "th" ? (
                    <span className="block py-1.5">กดค้างที่รูปเพื่อชาร์จจรวด</span>
                ) : (
                    <span className="block py-1.5">Press and hold the photo to charge the rocket</span>
                )}
            </figcaption>
        </>
    );
}
