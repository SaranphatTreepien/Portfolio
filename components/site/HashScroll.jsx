"use client";

import { useEffect } from "react";

// Arriving on the home page with a #section (e.g. /#Contact from the CV page), the browser scrolls once,
// before the experience list has loaded. When it loads, everything above grows and the visitor ends up
// sections too high. This keeps the target section in place while the page settles, and lets go as soon
// as the visitor scrolls on their own or the page has been still for a moment.

const SETTLE_MS = 4000;

function alignTo(id) {
    const el = id && document.getElementById(decodeURIComponent(id));
    if (!el) return;
    // scroll-margin-top keeps the heading clear of the phone's sticky top bar
    const top = el.getBoundingClientRect().top + window.scrollY - (parseFloat(getComputedStyle(el).scrollMarginTop) || 0);
    if (Math.abs(window.scrollY - top) > 2) window.scrollTo({ top, behavior: "instant" });
}

export default function HashScroll() {
    useEffect(() => {
        let stop = () => {};

        const follow = () => {
            stop();
            const id = window.location.hash.slice(1);
            if (!id) return;

            let done = false;
            const observer = new ResizeObserver(() => !done && alignTo(id));
            const release = () => {
                if (done) return;
                done = true;
                observer.disconnect();
                clearTimeout(timer);
                USER_EVENTS.forEach((type) => window.removeEventListener(type, release));
            };
            const USER_EVENTS = ["wheel", "touchstart", "keydown", "pointerdown"];
            USER_EVENTS.forEach((type) => window.addEventListener(type, release, { passive: true }));
            const timer = setTimeout(release, SETTLE_MS);

            observer.observe(document.body);
            requestAnimationFrame(() => !done && alignTo(id));
            stop = release;
        };

        follow();
        window.addEventListener("hashchange", follow);
        return () => {
            stop();
            window.removeEventListener("hashchange", follow);
        };
    }, []);

    return null;
}
