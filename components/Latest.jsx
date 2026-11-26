"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "./LanguageProvider";
import { topicsOf } from "./Work/topics";

// "Latest", like the list on Tania's home page: the five newest entries from the experience log,
// each with an icon, its date and its tags. Same data as the Experience section (/api/projects).

const COUNT = 5;
const ICON = { Cloud: "☁️", Network: "🌐", DevSecOps: "🛡️", Certificate: "📜", Event: "🎤" };

const formatDate = (date, lang) =>
    date ? new Date(date).toLocaleDateString(lang === "th" ? "th-TH" : "en-US", { day: "numeric", month: "long", year: "numeric" }) : "";

function Row({ item }) {
    const { lang } = useLang();
    const topics = topicsOf(item);
    return (
        <li>
            <Link href={`/work/${item.slug}`} className="group -mx-3 flex items-start gap-4 rounded-lg px-3 py-3 transition-colors hover:bg-gray-100/60">
                <span aria-hidden="true" className="mt-0.5 w-6 shrink-0 text-center text-[20px] leading-none transition-transform duration-200 group-hover:-rotate-6">
                    {item.isBest ? "⭐" : ICON[topics[0]] ?? "📝"}
                </span>
                <span className="min-w-0 flex-1">
                    <span className="block text-[17px] font-semibold leading-snug text-primary group-hover:text-brand-700">{item.title}</span>
                    <span className="mt-1 block font-mono text-[13px] text-gray-500">{formatDate(item.createdAt, lang)}</span>
                </span>
                {topics.length > 0 && (
                    <span className="hidden max-w-[45%] flex-wrap justify-end gap-1.5 sm:flex">
                        {topics.map((topic) => (
                            <span key={topic} className="rounded-md border border-gray-200 bg-white/60 px-1.5 py-0.5 font-mono text-[12px] font-semibold text-brand-700">
                                #{topic.toLowerCase()}
                            </span>
                        ))}
                    </span>
                )}
            </Link>
        </li>
    );
}

export default function Latest() {
    const { tx } = useLang();
    const [items, setItems] = useState(null);

    useEffect(() => {
        let alive = true;
        fetch("/api/projects")
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => {
                if (!alive) return;
                const list = (Array.isArray(data) ? data : []).filter((item) => item?.slug && item?.title);
                list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
                setItems(list.slice(0, COUNT));
            })
            .catch(() => alive && setItems([]));
        return () => {
            alive = false;
        };
    }, []);

    if (items && items.length === 0) return null;

    return (
        <section id="Latest" className="container mx-auto pb-16">
            <div className="border-t border-gray-200 pt-12">
                <div className="flex items-center gap-4">
                    <h2 className="text-[30px] font-semibold tracking-[-0.025em] text-primary">{tx({ th: "ล่าสุด", en: "Latest" })}</h2>
                    <Link
                        href="/#Experience"
                        className="rounded-md border border-gray-200 bg-white/60 px-2.5 py-1 text-[13px] font-semibold text-primary transition-colors hover:border-gray-400"
                    >
                        {tx({ th: "ดูทั้งหมด", en: "All entries" })}
                    </Link>
                </div>
                <ul className="mt-6 flex flex-col">
                    {items
                        ? items.map((item) => <Row key={item.slug} item={item} />)
                        : Array.from({ length: 4 }, (_, i) => (
                              <li key={i} className="flex gap-4 py-3">
                                  <span className="h-6 w-6 animate-pulse rounded bg-gray-100" />
                                  <span className="flex-1 space-y-2">
                                      <span className="block h-4 w-2/3 animate-pulse rounded bg-gray-100" />
                                      <span className="block h-3 w-28 animate-pulse rounded bg-gray-100" />
                                  </span>
                              </li>
                          ))}
                </ul>
            </div>
        </section>
    );
}
