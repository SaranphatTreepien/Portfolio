"use client";

import { useEffect } from "react";
import Image from "next/image";
import { THEME_EVENT } from "./ThemeToggle";

// The chibi avatar on a tile in today's accent colour (bg-brand-500 follows data-accent on <html>).
export const AVATAR_SRC = "/assets/avatar/max-chibi-128.png";

export default function DayAvatar({ className = "h-8 w-8 rounded-lg" }) {
    return (
        <span className={`relative block shrink-0 overflow-hidden bg-brand-500 ${className}`} style={{ transitionProperty: "transform, background-color" }}>
            <Image src={AVATAR_SRC} alt="" fill sizes="32px" className="object-cover" priority />
        </span>
    );
}

// Browser-tab icon: the same avatar on the same accent tile, redrawn whenever the colour changes.
// app/icon.png (the original purple tile) is what shows before this runs.
export function DayFavicon() {
    useEffect(() => {
        const img = new window.Image();
        img.src = AVATAR_SRC;
        let cancelled = false;

        const paint = () => {
            if (cancelled || !img.complete || !img.naturalWidth) return;
            const size = 64;
            const canvas = document.createElement("canvas");
            canvas.width = canvas.height = size;
            const ctx = canvas.getContext("2d");
            const rgb = getComputedStyle(document.documentElement).getPropertyValue("--b500").trim() || "38 169 158";
            ctx.fillStyle = `rgb(${rgb})`;
            ctx.beginPath();
            ctx.roundRect(0, 0, size, size, 14);
            ctx.fill();
            ctx.drawImage(img, 0, 0, size, size);
            const href = canvas.toDataURL("image/png");
            let links = document.querySelectorAll("link[rel~='icon']");
            if (!links.length) {
                const link = document.createElement("link");
                link.rel = "icon";
                document.head.appendChild(link);
                links = [link];
            }
            links.forEach((link) => {
                link.type = "image/png";
                link.href = href;
            });
        };

        img.onload = paint;
        paint();
        window.addEventListener(THEME_EVENT, paint);
        return () => {
            cancelled = true;
            window.removeEventListener(THEME_EVENT, paint);
        };
    }, []);
    return null;
}
