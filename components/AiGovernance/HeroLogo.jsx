"use client";

import { useEffect, useRef } from "react";

// Animated AI Governance Gateway logo, ported from the project's own new-chat screen
// (ai-governance/frontend/components/HeroLogo.tsx). The original artwork stays untouched; motion is layered on top:
// a sheen across the orb, glints running along the rim and the tilted ring, a planet riding the ring and a twinkling star.
// Fills its parent box; styles live in globals.css (.agw-*). Animations stop for prefers-reduced-motion.

const LOGO = "/assets/projects/ai-governance/logo-hero.png";
const RING = "M 24 168 a 160 31 0 1 0 320 0 a 160 31 0 1 0 -320 0"; // tilted ring, centre (184, 168), rotated -17deg
const STAR = "M0 -16 Q2.4 -2.6 15 0 Q2.4 2.6 0 16 Q-2.4 2.6 -15 0 Q-2.4 -2.6 0 -16 Z";

export default function HeroLogo({ className = "" }) {
    const ref = useRef(null);
    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const apply = () => (mq.matches ? ref.current?.pauseAnimations() : ref.current?.unpauseAnimations());
        apply();
        mq.addEventListener("change", apply);
        return () => mq.removeEventListener("change", apply);
    }, []);

    return (
        <span className={`agw-logo ${className}`} aria-hidden>
            <span className="agw-halo" />
            <span className="agw-art">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="agw-base" src={LOGO} alt="" width={360} height={360} />
                <span className="agw-sheen" />
                <svg ref={ref} className="agw-fx" viewBox="0 0 360 360">
                    <defs>
                        <filter id="agw-glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3" result="b" />
                            <feMerge>
                                <feMergeNode in="b" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        <radialGradient id="agw-dot">
                            <stop offset="0" stopColor="#ffffff" />
                            <stop offset=".45" stopColor="#bfeaff" />
                            <stop offset="1" stopColor="#7d6bff" stopOpacity="0" />
                        </radialGradient>
                        <path id="agw-ring" d={RING} />
                    </defs>

                    {/* glint running around the rim of the orb */}
                    <circle cx="180" cy="176" r="135" fill="none" stroke="#ffffff" strokeOpacity=".8" strokeWidth="3"
                        strokeLinecap="round" pathLength={100} strokeDasharray="5 95" filter="url(#agw-glow)">
                        <animate attributeName="stroke-dashoffset" from="0" to="-100" dur="5s" repeatCount="indefinite" />
                    </circle>

                    {/* tilted ring: a glint and a planet travel along it */}
                    <g transform="rotate(-17 184 168)">
                        <use href="#agw-ring" fill="none" stroke="#ffffff" strokeOpacity=".9" strokeWidth="3.4" strokeLinecap="round"
                            pathLength={100} strokeDasharray="9 91" filter="url(#agw-glow)">
                            <animate attributeName="stroke-dashoffset" from="0" to="100" dur="3.6s" repeatCount="indefinite" />
                        </use>
                        <circle r="9" fill="url(#agw-dot)">
                            <animateMotion dur="7s" repeatCount="indefinite"><mpath href="#agw-ring" /></animateMotion>
                            <animate attributeName="r" values="7;10;7" dur="1.6s" repeatCount="indefinite" />
                        </circle>
                    </g>

                    {/* the star twinkles in place */}
                    <g transform="translate(179 143)">
                        <circle r="16" fill="url(#agw-dot)" opacity=".5">
                            <animate attributeName="r" values="12;22;12" dur="3s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values=".25;.6;.25" dur="3s" repeatCount="indefinite" />
                        </circle>
                        <path d={STAR} fill="#ffffff" filter="url(#agw-glow)">
                            <animateTransform attributeName="transform" type="scale" values=".7;1.15;.7" dur="3s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values=".35;1;.35" dur="3s" repeatCount="indefinite" />
                        </path>
                    </g>
                </svg>
            </span>
        </span>
    );
}
