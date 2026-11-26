"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { THEME_EVENT } from "./ThemeToggle";
import { THEME_KEY, autoMode, skyAt } from "./theme";
import { todayKey } from "./accent";
import SeaBattle from "./SeaBattle";

// The scene behind every page: a night sea. Plain dark sky with a few stars and a soft moon low over the water,
// its light rippling on the sea, a small island with two palms, a container ship on the horizon,
// a sailboat drifting past and a white yacht close in.
// Everything is fixed and only moves with transform / opacity, so scrolling never repaints it.
// The light theme is the same sea at sunrise: the sun comes up over the horizon and its light ripples where the moon's did.
// Reading pages get a lower sea ("calm").

const PERIOD = 1440;
const WIDTH = PERIOD * 2;
const HEIGHT = 200;

// Two sine harmonics with whole-number cycles per period read as a natural swell and still loop cleanly
const wavePath = ({ base, a1, k1, p1, a2, k2, p2 }) => {
    let d = "";
    for (let x = 0; x <= WIDTH; x += 16) {
        const t = (x / PERIOD) * Math.PI * 2;
        const y = base + a1 * Math.sin(k1 * t + p1) + a2 * Math.sin(k2 * t + p2);
        d += `${x === 0 ? "M" : "L"}${x} ${y.toFixed(1)}`;
    }
    return `${d}V${HEIGHT}H0Z`;
};

// Far to near; the far swell is gentlest
const [FAR, MID, NEAR] = [
    { base: 62, a1: 6, k1: 2, p1: 0.0, a2: 3, k2: 5, p2: 1.2 },
    { base: 100, a1: 10, k1: 3, p1: 1.9, a2: 4, k2: 7, p2: 0.4 },
    { base: 136, a1: 9, k1: 2, p1: 3.6, a2: 4, k2: 6, p2: 2.2 },
].map(wavePath);

const Wave = ({ d, n }) => (
    <svg className={`wave wave-${n}`} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none">
        <path d={d} />
    </svg>
);

// [left %, top %, size px, twinkles]
const STARS = [
    [6, 9, 2, 0], [14, 22, 1.5, 1], [23, 6, 1.5, 0], [31, 15, 2, 0], [38, 28, 1.5, 1], [47, 8, 1.5, 0],
    [55, 19, 2, 0], [61, 4, 1.5, 1], [68, 26, 1.5, 0], [74, 11, 2, 0], [83, 20, 1.5, 0], [91, 7, 2, 1],
    [96, 30, 1.5, 0], [18, 36, 1.5, 0], [52, 34, 1.5, 0], [88, 38, 1.5, 1],
];

const FROND = [
    "M92 32 C 78 22 62 24 48 36 C 64 28 78 30 92 35 Z",
    "M92 32 C 80 14 66 10 54 13 C 70 16 82 22 92 35 Z",
    "M92 32 C 104 16 120 14 134 22 C 118 22 104 26 92 35 Z",
    "M92 32 C 108 26 124 32 134 46 C 118 34 104 32 92 35 Z",
    "M92 32 C 91 18 97 7 106 2 C 99 12 96 22 94 35 Z",
];

const Island = () => (
    <svg className="island" viewBox="0 0 220 110" aria-hidden="true">
        <path className="island-land" d="M0 110 C 36 92 70 84 110 84 C 150 84 182 92 220 110 Z" />
        <path className="island-trunk" d="M104 88 C 102 68 97 50 92 33" strokeWidth="4.5" />
        <path className="island-trunk" d="M140 90 C 141 78 145 66 150 55" strokeWidth="3.5" />
        <g className="island-leaf">
            {FROND.map((d) => <path key={d} d={d} />)}
            <g transform="translate(150 55) scale(0.68) translate(-92 -32)">
                {FROND.map((d) => <path key={d} d={d} />)}
            </g>
        </g>
    </svg>
);

const Boat = () => (
    <div className="boat-track">
        <div className="boat-bob">
            <svg className="boat" viewBox="0 0 80 60" aria-hidden="true">
                <path className="boat-sail" d="M40 6 L40 41 L67 41 Z" />
                <path className="boat-sail" d="M36 12 L36 41 L17 41 Z" />
                <path className="boat-hull" d="M37 4 V44" strokeWidth="1.6" />
                <path className="boat-hull" d="M6 43 L74 43 L65 53 L15 53 Z" />
                <circle className="boat-lamp" cx="70" cy="40" r="1.8" />
            </svg>
        </div>
    </div>
);

// Muted container colours; the night theme dims the whole stack (--cargo-box-alpha)
const BOX_COLORS = ["#d1495b", "#edae49", "#00798c", "#30638e", "#66a182", "#e07a5f"];
const BOXES = [
    ...Array.from({ length: 9 }, (_, i) => ({ x: 24 + i * 15, y: 31, c: BOX_COLORS[(i * 2) % 6] })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: 39 + i * 15, y: 22, c: BOX_COLORS[(i * 2 + 3) % 6] })),
];

// Container ship far out on the horizon, heading left
const CargoShip = () => (
    <div className="cargo-track">
        <svg className="cargo" viewBox="0 0 200 60" aria-hidden="true">
            <path className="ship-dark" d="M13 22 V40" strokeWidth="1.4" />
            <circle className="ship-lamp" cx="13" cy="21" r="1.6" />
            <rect className="ship-dark" x="22" y="21" width="136" height="20" />
            <g className="cargo-boxes">
                {BOXES.map(({ x, y, c }) => (
                    <rect key={`${x}-${y}`} x={x} y={y} width="14" height="9" rx="0.6" fill={c} />
                ))}
            </g>
            <rect className="ship-dark" x="160" y="16" width="22" height="24" />
            <rect className="ship-dark" x="157" y="11" width="29" height="6" rx="1" />
            <rect x="170" y="3" width="7" height="9" rx="1" fill="#c2413b" />
            <rect className="ship-window" x="159" y="12.5" width="25" height="2.4" />
            <rect className="ship-window" x="163" y="22" width="16" height="2" />
            <path className="ship-dark" d="M3 40 L197 40 L185 56 L17 56 Z" />
            <rect className="ship-stripe" x="6" y="40" width="189" height="2.5" />
        </svg>
    </div>
);

// White motor yacht close in, cutting a small wake
const Yacht = () => (
    <div className="yacht-track">
        <div className="boat-bob yacht-bob">
            <svg className="yacht" viewBox="0 0 160 46" aria-hidden="true">
                <g className="yacht-wake">
                    <path d="M44 38 C 30 37 16 39 2 37" />
                    <path d="M46 41 C 34 41 22 43 10 42" />
                    <path d="M42 34 C 32 33 24 34 16 33" />
                </g>
                <path className="yacht-body" d="M44 30 C 70 30 120 30 156 26 L 148 38 C 120 41 70 41 52 39 Z" />
                <path d="M50 35 C 80 36 120 35 152 30" fill="none" stroke="rgb(var(--b500))" strokeWidth="1.4" />
                <path className="yacht-body" d="M66 30 L 74 21 L 132 21 L 140 30 Z" />
                <path className="yacht-body" d="M82 21 L 90 14 L 120 14 L 124 21 Z" />
                <path className="yacht-window" d="M76 24 L 130 24 L 133 27 L 74 27 Z" />
                <path className="yacht-window" d="M92 16 L 118 16 L 120 19 L 90 19 Z" />
                <path className="yacht-body" d="M106 14 V7" stroke="currentColor" strokeWidth="1.2" />
                <circle className="ship-lamp" cx="106" cy="6.5" r="1.5" />
            </svg>
        </div>
    </div>
);

// Keeps day / night and the dawn-dusk sky in step with the clock while the page stays open
function useSkyClock() {
    useEffect(() => {
        const update = () => {
            const root = document.documentElement;
            const sky = skyAt();
            if (sky) root.dataset.sky = sky;
            else delete root.dataset.sky;
            let manual = false;
            try {
                const saved = JSON.parse(localStorage.getItem(THEME_KEY) || "null");
                manual = saved?.day === todayKey();
            } catch {}
            if (manual) return;
            const dark = autoMode() === "dark";
            if (root.classList.contains("dark") !== dark) {
                root.classList.toggle("dark", dark);
                window.dispatchEvent(new Event(THEME_EVENT));
            }
        };
        const timer = setInterval(update, 5 * 60 * 1000);
        return () => clearInterval(timer);
    }, []);
}

// [left %, top %, length px, delay s, duration s]
const SHOOTING = [
    [72, 6, 130, 2, 13],
    [42, 16, 100, 8.5, 17],
];

// Day only: small gulls gliding across, [top %, width px, duration s, delay s]
const GULLS = [
    [14, 26, 70, -10],
    [19, 20, 88, -40],
    [25, 15, 64, -25],
];

export default function OceanBackground() {
    const pathname = usePathname();
    const calm = pathname !== "/";
    useSkyClock();

    return (
        <div aria-hidden="true" className={`ocean ${calm ? "ocean--calm" : ""}`}>
            <div className="sky-stars">
                {STARS.map(([x, y, size, twinkle], i) => (
                    <span
                        key={i}
                        className={twinkle ? "star star--twinkle" : "star"}
                        style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, animationDelay: `${(i % 5) * 1.3}s` }}
                    />
                ))}
                {/* Now and then a shooting star */}
                {SHOOTING.map(([x, y, len, delay, dur]) => (
                    <span
                        key={x}
                        className="shooting-star"
                        style={{ left: `${x}%`, top: `${y}%`, width: len, animationDelay: `${delay}s`, animationDuration: `${dur}s` }}
                    />
                ))}
            </div>
            <div className="gulls">
                {GULLS.map(([top, width, dur, delay]) => (
                    <div key={top} className="gull-track" style={{ top: `${top}%`, animationDuration: `${dur}s`, animationDelay: `${delay}s` }}>
                        <svg className="gull" viewBox="0 0 24 8" style={{ width }} aria-hidden="true">
                            <path d="M1 6 Q 6.5 0 12 6 Q 17.5 0 23 6" />
                        </svg>
                    </div>
                ))}
            </div>
            <div className="sky-haze" />
            <div className="moon" />

            <div className="ocean-sea">
                {/* Light theme only; drawn before the far swell so the water covers its lower edge */}
                <div className="sun" />
                <Wave d={FAR} n={1} />
                {/* Moon- or sunlight on the water, between the far swell and the nearer ones */}
                <div className="moon-path">
                    {/* Slight sideways offsets so the streaks read as broken light, not a ladder */}
                    {[0, -6, 8, -10, 6, -4, 12].map((x, i) => (
                        <span key={i} style={{ "--i": i, "--x": x }} />
                    ))}
                </div>
                <Island />
                <CargoShip />
                {/* Behind the middle swell, so the water covers their bellies */}
                <SeaBattle />
                <Wave d={MID} n={2} />
                <Boat />
                <Wave d={NEAR} n={3} />
                <Yacht />
            </div>
        </div>
    );
}
