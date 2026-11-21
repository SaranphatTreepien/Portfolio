"use client";

import Image from "next/image";
import { FiMaximize2 } from "react-icons/fi";
import { useLang } from "../LanguageProvider";

// Product-design pages, one per row, large. Click an image to open the full-resolution JPG in a new tab.
export default function DesignGallery({ pages }) {
    const { t, tx } = useLang();
    return (
        <ol className="flex flex-col gap-14">
            {pages.map((item) => (
                <li key={item.page} id={`page-${item.page}`} className="scroll-mt-24">
                    <figure className="flex flex-col gap-4">
                        <figcaption className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
                            <span className="flex shrink-0 items-center gap-2">
                                <span className="rounded-md bg-primary px-2 py-0.5 font-mono text-xs font-bold text-white">
                                    {String(item.page).padStart(2, "0")}
                                </span>
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#1f7f77]">{tx(item.group)}</span>
                            </span>
                            <span className="flex flex-col">
                                <span className="text-base font-bold text-primary sm:text-lg">{tx(item.title)}</span>
                                <span className="text-sm leading-6 text-gray-500">{tx(item.caption)}</span>
                            </span>
                        </figcaption>
                        <a
                            href={item.src}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={t("detail.openImage", item.page)}
                            className="group relative block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_18px_50px_-24px_rgba(16,21,31,0.35)]"
                        >
                            <Image
                                src={item.src}
                                alt={`${t("detail.page", item.page)}: ${tx(item.title)}`}
                                width={2244}
                                height={1586}
                                sizes="(max-width: 1200px) 100vw, 1170px"
                                className="block h-auto w-full"
                            />
                            <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                                <FiMaximize2 className="h-4 w-4" />
                            </span>
                        </a>
                    </figure>
                </li>
            ))}
        </ol>
    );
}
