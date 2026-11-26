"use client";
import { useEffect, useState } from "react";

// One fetch of /api/credentials shared by the hero numbers and the badge strip
let cache = null;
let pending = null;

export function useCredentials() {
    const [data, setData] = useState(cache);
    useEffect(() => {
        if (cache) return;
        pending ??= fetch("/api/credentials")
            .then((res) => (res.ok ? res.json() : []))
            .catch(() => []);
        let alive = true;
        pending.then((result) => {
            cache = result;
            if (alive) setData(result);
        });
        return () => {
            alive = false;
        };
    }, []);
    return data;
}
