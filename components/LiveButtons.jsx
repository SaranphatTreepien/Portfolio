"use client";

import Link from "next/link";
import { FiArrowLeft, FiExternalLink } from "react-icons/fi";
import { useLang } from "./LanguageProvider";

const floatingButton =
    "fixed bottom-4 z-10 flex items-center gap-2 rounded-full border border-white/15 px-3 py-3 text-sm font-semibold text-white shadow-lg transition-colors sm:px-4 sm:py-2.5";

// Bottom-corner buttons on the full-screen /live/[slug] page (the embedded site already uses its top corners).
export default function LiveButtons({ url }) {
    const { t } = useLang();
    return (
        <>
            <Link href="/#Experience" className={`${floatingButton} left-4 bg-black/75 hover:bg-black`} aria-label={t("live.back")}>
                <FiArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Portfolio</span>
            </Link>
            <a href={url} className={`${floatingButton} right-4 bg-brand-600 hover:bg-brand-700`} aria-label={t("live.visit")}>
                <FiExternalLink className="h-4 w-4" />
                <span className="hidden sm:inline">{t("live.visit")}</span>
            </a>
        </>
    );
}
