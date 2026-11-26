"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "../LanguageProvider";

// Mascots for the home-page sea: a cute green kaiju and a giant orange cat, both half in the water, squabbling.
// Click (or tap) one: the cat hops with a "meow" and hearts, the kaiju sneezes a puff of bubbles.
// One 4.8 s loop, all in CSS (app/globals.css, "Sea battle"): the kaiju's spikes charge up and it puffs a blue
// beam, the cat winds up and bats it away with a paw, a little "pow" star pops, the kaiju flinches, repeat.
// Only transform and opacity animate. Drawn between the middle and the nearest swell so the water hides their bellies.

const DARK = "#1f2937";
const KAIJU = "#5fb86a";
const KAIJU_SHADE = "#4a9c56";
const BELLY = "#d6f2bd";
const SPIKE = "#9fe7de";
const CAT = "#f4a259";
const CAT_STRIPE = "#d9803a";
const CREAM = "#fde7c8";
const PINK = "#ff9db0";

const SPIKES = ["M60 30 L 50 10 L 72 24 Z", "M47 52 L 28 40 L 53 40 Z", "M39 78 L 18 70 L 43 65 Z", "M34 104 L 14 100 L 36 91 Z"];

const Kaiju = () => (
    <svg className="kaiju" viewBox="0 0 150 160" aria-hidden="true">
        <g className="kaiju-body">
            <path d="M32 128 C 8 124 2 102 12 92 C 18 108 26 114 42 114 Z" fill={KAIJU_SHADE} />
            <g stroke={SPIKE} strokeWidth="4" strokeLinejoin="round" fill={SPIKE}>
                {SPIKES.map((d) => <path key={d} d={d} />)}
            </g>
            {/* Brighter copy of the spikes that fades in while charging */}
            <g className="kaiju-charge" stroke="#e6fdff" strokeWidth="4" strokeLinejoin="round" fill="#e6fdff">
                {SPIKES.map((d) => <path key={d} d={d} />)}
            </g>
            <ellipse cx="62" cy="120" rx="38" ry="44" fill={KAIJU} />
            <ellipse cx="74" cy="124" rx="20" ry="30" fill={BELLY} />
            <path d="M60 112 H 88 M58 124 H 90 M60 136 H 88" stroke="#b9e09c" strokeWidth="2" strokeLinecap="round" />
            <ellipse cx="82" cy="58" rx="34" ry="30" fill={KAIJU} />
            <ellipse cx="108" cy="67" rx="19" ry="13" fill={KAIJU} />
            <circle cx="121" cy="61" r="1.7" fill={DARK} />
            <circle cx="92" cy="48" r="7.5" fill="#fff" />
            <circle cx="94.5" cy="49" r="4.2" fill={DARK} />
            <circle cx="96" cy="47.2" r="1.5" fill="#fff" />
            <path d="M83 37 L 100 42" stroke={DARK} strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="101" cy="63" rx="5" ry="3" fill={PINK} opacity="0.7" />
            <path d="M111 74 Q 119 82 128 72" stroke={DARK} strokeWidth="2.6" fill="#7b2d3a" strokeLinecap="round" />
            <path d="M115 76 L 117.5 80.5 L 120 77 Z" fill="#fff" />
            <path d="M88 96 C 101 91 111 95 109 104 C 101 107 94 105 88 102 Z" fill={KAIJU} />
        </g>
    </svg>
);

const Cat = () => (
    <svg className="cat" viewBox="0 0 160 160" aria-hidden="true">
        <g className="cat-tail">
            <path d="M136 124 C 160 104 158 72 140 62" stroke={CAT} strokeWidth="13" strokeLinecap="round" fill="none" />
            <path d="M150 84 L 158 80 M152 98 L 160 96" stroke={CAT_STRIPE} strokeWidth="3" strokeLinecap="round" />
        </g>
        <ellipse cx="100" cy="128" rx="46" ry="40" fill={CAT} />
        <ellipse cx="92" cy="126" rx="22" ry="26" fill={CREAM} />
        <path d="M128 104 Q 136 112 132 122 M118 96 Q 128 102 128 112" stroke={CAT_STRIPE} strokeWidth="3.5" strokeLinecap="round" fill="none" />
        {/* Ears */}
        <path d="M43 56 L 45 17 L 71 42 Z" fill={CAT} />
        <path d="M86 40 L 105 13 L 111 52 Z" fill={CAT} />
        <path d="M49 49 L 50 28 L 64 42 Z" fill={PINK} />
        <path d="M92 41 L 103 24 L 106 47 Z" fill={PINK} />
        <circle cx="76" cy="77" r="38" fill={CAT} />
        <path d="M69 40 L 71 53 M78 39 L 78 53 M87 41 L 85 53" stroke={CAT_STRIPE} strokeWidth="3" strokeLinecap="round" />
        {/* Determined squint, little nose, "w" mouth, whiskers */}
        <path d="M52 71 L 63 77 L 52 83" stroke={DARK} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M95 71 L 84 77 L 95 83" stroke={DARK} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <ellipse cx="57" cy="91" rx="6" ry="3.5" fill={PINK} opacity="0.65" />
        <ellipse cx="93" cy="91" rx="6" ry="3.5" fill={PINK} opacity="0.65" />
        <path d="M71 86 H 78 L 74.5 90 Z" fill="#ff7f9a" />
        <path d="M74.5 90 Q 71 95 66 92 M74.5 90 Q 78 95 83 92" stroke={DARK} strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M50 87 L 33 83 M50 92 L 33 94 M100 87 L 117 83 M100 92 L 117 94" stroke="#fff7ed" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
        {/* The swiping paw, pivoting at the shoulder */}
        <g className="cat-paw">
            <path d="M66 122 C 52 110 40 102 31 93" stroke={CAT} strokeWidth="17" strokeLinecap="round" fill="none" />
            <circle cx="29" cy="91" r="12" fill={CAT} />
            <ellipse cx="27" cy="95" rx="4.5" ry="3.4" fill={PINK} />
            <circle cx="22" cy="88" r="2.3" fill={PINK} />
            <circle cx="28" cy="85" r="2.3" fill={PINK} />
            <circle cx="34" cy="88" r="2.3" fill={PINK} />
        </g>
    </svg>
);

const Pow = () => (
    <svg className="battle-pow" viewBox="0 0 60 60" aria-hidden="true">
        <path
            d="M30 2 L 36 20 L 56 14 L 42 29 L 58 42 L 38 40 L 34 58 L 26 41 L 8 50 L 18 33 L 2 22 L 22 21 Z"
            fill="#fde047"
            stroke="#f97316"
            strokeWidth="2.5"
            strokeLinejoin="round"
        />
        <circle cx="30" cy="30" r="7" fill="#fff" />
    </svg>
);

// They live in the background layer (behind the page, no pointer events), so pokes are found by position:
// a click that lands on a mascot and not on a link, button or field of the page makes it react.
const INTERACTIVE = "a, button, input, textarea, select, label, summary, [role='button'], [role='menuitemradio']";
const REACT_MS = 1500;

function useMascotPokes(refs, onPoke) {
    useEffect(() => {
        const hit = (x, y, target) => {
            if (target instanceof Element && target.closest(INTERACTIVE)) return null;
            for (const [name, ref] of Object.entries(refs)) {
                const r = ref.current?.getBoundingClientRect();
                if (r && r.width && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return name;
            }
            return null;
        };
        const onClick = (e) => {
            if (window.getSelection()?.toString()) return;
            const name = hit(e.clientX, e.clientY, e.target);
            if (name) onPoke(name);
        };
        // A pointer cursor over them, checked at most once a frame
        let frame = 0;
        const onMove = (e) => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => document.documentElement.classList.toggle("poke-cursor", !!hit(e.clientX, e.clientY, e.target)));
        };
        window.addEventListener("click", onClick);
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("click", onClick);
            window.removeEventListener("pointermove", onMove);
            document.documentElement.classList.remove("poke-cursor");
        };
    }, [refs, onPoke]);
}

export default function SeaBattle() {
    const { tx } = useLang();
    const kaijuRef = useRef(null);
    const catRef = useRef(null);
    const refs = useRef({ kaiju: kaijuRef, cat: catRef }).current;
    // Each poke bumps a counter, which remounts the reaction so it replays even on rapid clicks
    const [pokes, setPokes] = useState({ kaiju: 0, cat: 0 });
    const [active, setActive] = useState({ kaiju: false, cat: false });
    const timers = useRef({});

    const onPoke = useRef((name) => {
        setPokes((p) => ({ ...p, [name]: p[name] + 1 }));
        setActive((a) => ({ ...a, [name]: true }));
        clearTimeout(timers.current[name]);
        timers.current[name] = setTimeout(() => setActive((a) => ({ ...a, [name]: false })), REACT_MS);
    }).current;

    useMascotPokes(refs, onPoke);
    useEffect(() => () => Object.values(timers.current).forEach(clearTimeout), []);

    return (
        <div className="battle" aria-hidden="true">
            <div ref={kaijuRef} className={`battle-kaiju ${active.kaiju ? "is-poked" : ""}`}>
                <Kaiju />
                {active.kaiju && (
                    <div key={pokes.kaiju} className="mascot-react">
                        <span className="mascot-say mascot-say--kaiju">{tx({ th: "ฮัดชิ่ว!", en: "Achoo!" })}</span>
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                            <span key={i} className="sneeze-bubble" style={{ "--i": i }} />
                        ))}
                    </div>
                )}
            </div>
            <div className="battle-beam" />
            <Pow />
            <div ref={catRef} className={`battle-cat ${active.cat ? "is-poked" : ""}`}>
                <Cat />
                {active.cat && (
                    <div key={pokes.cat} className="mascot-react">
                        <span className="mascot-say mascot-say--cat">{tx({ th: "เมี้ยว~!", en: "Meow~!" })}</span>
                        {[0, 1, 2].map((i) => (
                            <span key={i} className="cat-heart" style={{ "--i": i }}>
                                ♥
                            </span>
                        ))}
                    </div>
                )}
            </div>
            {/* Splash where the paw meets the beam */}
            <span className="battle-drop" style={{ "--dx": "-14px", "--dy": "-22px" }} />
            <span className="battle-drop" style={{ "--dx": "6px", "--dy": "-30px" }} />
            <span className="battle-drop" style={{ "--dx": "18px", "--dy": "-18px" }} />
        </div>
    );
}
