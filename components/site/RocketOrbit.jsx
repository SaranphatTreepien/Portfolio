"use client";

import { useEffect, useState } from "react";

// A little rocket circling the hero photo on a dashed orbit, flame flickering red / yellow / white.
// `laps` goes up when the photo is tapped or a charge is released (components/site/HeroPhoto): the rocket throws in
// extra fast laps with a bigger flame.
// Pure transform / opacity animation on a small layer, so it costs next to nothing.

const R = 152; // orbit radius in px: photo circle (260) / 2 + 22 gap
const PUFFS = [
    { deg: -11, size: 7, alpha: 0.5 },
    { deg: -19, size: 5.5, alpha: 0.32 },
    { deg: -27, size: 4, alpha: 0.18 },
];

const Rocket = () => (
    <svg className="rocket" viewBox="0 0 40 84" aria-hidden="true">
        <defs>
            <radialGradient id="rocket-glow" cx="50%" cy="30%" r="60%">
                <stop offset="0%" stopColor="#fde68a" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
            </radialGradient>
        </defs>
        {/* Flame: red outside, yellow, white-hot core */}
        <ellipse cx="20" cy="64" rx="13" ry="16" fill="url(#rocket-glow)" />
        <g className="rocket-flame">
            <path d="M12 54 C 12 64 16 72 20 82 C 24 72 28 64 28 54 Z" fill="#ef4444" />
            <path d="M14.5 54 C 14.5 62 17 68 20 75 C 23 68 25.5 62 25.5 54 Z" fill="#facc15" />
        </g>
        <path className="rocket-core" d="M17 54 C 17 59 18.5 63 20 67 C 21.5 63 23 59 23 54 Z" fill="#fffbeb" />
        {/* Body */}
        <path d="M8 38 L1 55 L8 51 Z" fill="#ef4444" />
        <path d="M32 38 L39 55 L32 51 Z" fill="#ef4444" />
        <path d="M20 3 C 30 13 32 30 32 49 L 8 49 C 8 30 10 13 20 3 Z" fill="#f8fafc" />
        <path d="M20 3 C 26 9 29.5 15 31 22 L 9 22 C 10.5 15 14 9 20 3 Z" fill="#ef4444" />
        <rect x="8" y="46" width="24" height="4" rx="1" fill="#cbd5e1" />
        <rect x="13" y="50" width="14" height="4.5" rx="1" fill="#64748b" />
        <circle cx="20" cy="32" r="5.2" fill="rgb(var(--b400))" stroke="#e2e8f0" strokeWidth="2" />
        <circle cx="18.4" cy="30.4" r="1.6" fill="#ffffff" opacity="0.8" />
    </svg>
);

// power "super" (a full charge): the laps take longer and the flame is huge. `charging`: the rocket shakes on the spot.
export default function RocketOrbit({ laps = 0, power = "normal", charging = false }) {
    const [boosting, setBoosting] = useState(false);
    const isSuper = power === "super";

    useEffect(() => {
        if (!laps) return;
        setBoosting(true);
        const timer = setTimeout(() => setBoosting(false), isSuper ? 2100 : 1300);
        return () => clearTimeout(timer);
    }, [laps, isSuper]);

    return (
        <div aria-hidden="true" className="rocket-orbit">
            {/* Outer ring turns forever; the inner one adds a whole extra lap per click */}
            <div
                className={`rocket-spin ${boosting ? (isSuper ? "is-boosting is-super" : "is-boosting") : ""} ${charging ? "is-charging" : ""}`}
                style={{ transform: `rotate(${laps * 360}deg)`, transitionDuration: isSuper ? "2s" : undefined }}
            >
                {PUFFS.map(({ deg, size, alpha }) => {
                    const a = (deg * Math.PI) / 180;
                    return (
                        <span
                            key={deg}
                            className="rocket-puff"
                            style={{ left: R + R * Math.sin(a), top: R - R * Math.cos(a), width: size, height: size, opacity: alpha }}
                        />
                    );
                })}
                <Rocket />
            </div>
        </div>
    );
}
