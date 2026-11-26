"use client";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowRight, FiX } from "react-icons/fi";
import { useLang } from "./LanguageProvider";

const LUMA_PROFILE_URL = "https://luma.com/user/max289";

// Event attendance proof from Luma, opened from the badge strip
export default function LumaModal({ open, onClose }) {
  const { t } = useLang();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-primary/50 p-4 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="luma-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-primary"
              aria-label={t("hero.close")}
            >
              <FiX className="h-4 w-4" />
            </button>
            <div className="p-5 pt-6 sm:p-6">
              <div className="overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/icon/luma-events.gif" alt="Luma event attendance proof" className="h-auto w-full object-contain" />
              </div>
              <div className="mt-4 space-y-1 text-center">
                <p id="luma-modal-title" className="text-base font-semibold text-primary">{t("hero.lumaPreview")}</p>
                <p className="text-sm text-gray-500">{t("hero.lumaProof")}</p>
              </div>
              <a
                href={LUMA_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
              >
                {t("hero.lumaView")} <FiArrowRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
