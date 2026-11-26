"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle, FiCheck, FiX } from "react-icons/fi";
import Reveal from "./ui/Reveal";
import { useLang } from "./LanguageProvider";

const EMAIL = "saranphat.tre289@gmail.com";
const PHONE = "+66 61 446 1930";
const EMPTY = { name: "", email: "", countryCode: "+66", phone: "", message: "" };

// Plain underlined fields: no boxes, no glow
const fieldClass =
    "w-full rounded-none border-0 border-b border-gray-300 bg-transparent px-0 py-2.5 text-[16px] text-primary outline-none transition-colors placeholder:text-gray-400 hover:border-gray-400 focus:border-brand-600 focus:ring-0";

const Field = ({ id, label, note, children }) => (
    <div>
        <label htmlFor={id} className="flex items-baseline justify-between text-[13px] text-gray-500">
            {label}
            {note && <span className="text-[12px] text-gray-400">{note}</span>}
        </label>
        {children}
    </div>
);

const Row = ({ label, children }) => (
    <div className="grid grid-cols-[96px_1fr] items-baseline gap-4 border-b border-gray-200 py-4">
        <dt className="text-[13px] text-gray-500">{label}</dt>
        <dd className="text-[15px] text-primary">{children}</dd>
    </div>
);

const textLink = "underline decoration-gray-300 underline-offset-4 transition-colors hover:text-brand-700 hover:decoration-brand-600";

const TOAST_MS = 5000;

// Pop-up at the top of the screen after sending: green tick when it went through, red when it did not
function SendToast({ toast, onClose }) {
    const { t, tx } = useLang();

    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(onClose, TOAST_MS);
        return () => clearTimeout(timer);
    }, [toast, onClose]);

    const ok = toast?.type === "sent";

    return (
        <div className="pointer-events-none fixed inset-x-0 top-5 z-[200] flex justify-center px-4" aria-live="polite">
            <AnimatePresence>
                {toast && (
                    <motion.div
                        key={toast.id}
                        role={ok ? "status" : "alert"}
                        initial={{ opacity: 0, y: -16, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="pointer-events-auto relative w-full max-w-[420px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-[0_18px_40px_-20px_rgba(16,21,31,0.35)]"
                    >
                        <div className="flex items-start gap-3 p-4 pr-3">
                            <motion.span
                                initial={{ scale: 0.4, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 420, damping: 18, delay: 0.1 }}
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white ${ok ? "bg-brand-600" : "bg-red-500"}`}
                            >
                                {ok ? <FiCheck className="h-4 w-4" /> : <FiAlertCircle className="h-4 w-4" />}
                            </motion.span>
                            <div className="min-w-0 flex-1 pt-0.5">
                                <p className="text-[15px] font-semibold text-primary">
                                    {ok ? tx({ th: "ส่งข้อความแล้ว", en: "Message sent" }) : t("contact.failed")}
                                </p>
                                <p className="mt-0.5 text-[13.5px] leading-snug text-gray-600">
                                    {ok
                                        ? tx({
                                              th: `ขอบคุณครับ${toast.name ? ` คุณ${toast.name}` : ""} ผมจะตอบกลับไปที่ ${toast.email}`,
                                              en: `Thank you${toast.name ? `, ${toast.name}` : ""}. I'll reply to ${toast.email}.`,
                                          })
                                        : `${toast.message} ${tx({ th: "ลองอีกครั้ง หรืออีเมลหาผมตรงๆ ได้เลย", en: "Please try again, or email me directly." })}`}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label={tx({ th: "ปิด", en: "Close" })}
                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-primary"
                            >
                                <FiX className="h-4 w-4" />
                            </button>
                        </div>
                        {/* Time left before it closes */}
                        <motion.span
                            initial={{ scaleX: 1 }}
                            animate={{ scaleX: 0 }}
                            transition={{ duration: TOAST_MS / 1000, ease: "linear" }}
                            className={`absolute bottom-0 left-0 h-[3px] w-full origin-left ${ok ? "bg-brand-500" : "bg-red-400"}`}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function Contact() {
    const { t } = useLang();
    const [form, setForm] = useState(EMPTY);
    const [status, setStatus] = useState("idle"); // idle | sending | sent | error
    const [errorMessage, setErrorMessage] = useState("");
    const [copied, setCopied] = useState(false);
    const [toast, setToast] = useState(null);
    const closeToast = useCallback(() => setToast(null), []);

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText(EMAIL);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
        } catch {
            /* clipboard blocked: the mailto link still works */
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setStatus("sending");
        setErrorMessage("");
        try {
            const response = await fetch("/api/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "contact",
                    fullName: form.name.trim(),
                    emailSender: form.email,
                    phone: form.phone.trim() ? `${form.countryCode} ${form.phone.trim()}` : "",
                    bodyText: form.message,
                }),
            });
            const result = await response.json();
            if (!response.ok || !result.success) throw new Error(result.error || "Unable to send message");
            setStatus("sent");
            setToast({ id: Date.now(), type: "sent", name: form.name.trim().split(/\s+/)[0], email: form.email });
            setForm(EMPTY);
            setTimeout(() => setStatus("idle"), 4000);
        } catch (error) {
            console.error("Contact form error:", error);
            setErrorMessage(error.message || "Unable to send message");
            setStatus("error");
            setToast({ id: Date.now(), type: "error", message: error.message || "Unable to send message" });
        }
    };

    return (
        <section id="Contact" className="border-t border-gray-900/[0.07] py-20 lg:py-24">
            <div className="container mx-auto grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
                {/* Left: say hello directly */}
                <Reveal>
                    <p className="eyebrow">{t("nav.Contact")}</p>
                    <h2 className="section-title mt-3">{t("contact.title")}</h2>
                    <p className="mt-4 max-w-md text-[16px] leading-relaxed text-gray-600">{t("contact.lead")}</p>

                    <div className="mt-10">
                        <a href={`mailto:${EMAIL}`} className="break-all text-[22px] font-semibold tracking-[-0.015em] text-primary underline decoration-brand-300 decoration-2 underline-offset-[7px] transition-colors hover:decoration-brand-600 sm:text-[26px]">
                            {EMAIL}
                        </a>
                        <button type="button" onClick={copyEmail} className="mt-3 block text-[13px] text-gray-500 transition-colors hover:text-brand-700">
                            {copied ? t("contact.copied") : t("about.copy")}
                        </button>
                    </div>

                    <dl className="mt-10 border-t border-gray-200">
                        <Row label={t("contact.phone")}>
                            <a href={`tel:${PHONE.replace(/\s/g, "")}`} className={textLink}>
                                {PHONE}
                            </a>
                        </Row>
                        <Row label={t("about.field.location")}>{t("menu.locationValue")}</Row>
                        <Row label={t("contact.elsewhere")}>
                            <span className="flex flex-wrap gap-x-5 gap-y-1">
                                <a href="https://github.com/SaranphatTreepien" target="_blank" rel="noopener noreferrer" className={textLink}>
                                    GitHub
                                </a>
                                <a href="https://www.linkedin.com/in/saranphat-treepien-4284402b2" target="_blank" rel="noopener noreferrer" className={textLink}>
                                    LinkedIn
                                </a>
                            </span>
                        </Row>
                    </dl>
                </Reveal>

                {/* Right: the form, on the page itself */}
                <Reveal delay={0.08}>
                    <h3 className="text-[18px] font-semibold text-primary">{t("contact.formTitle")}</h3>
                    <p className="mt-1 text-[14px] text-gray-500">{t("contact.formLead")}</p>

                    <form onSubmit={onSubmit} className="mt-8 grid gap-x-8 gap-y-7 sm:grid-cols-2">
                        <Field id="contact-name" label={t("contact.name")}>
                            <input id="contact-name" name="name" value={form.name} onChange={onChange} required autoComplete="name" placeholder={t("contact.phName")} className={fieldClass} />
                        </Field>
                        <Field id="contact-email" label={t("contact.email")}>
                            <input id="contact-email" name="email" type="email" value={form.email} onChange={onChange} required autoComplete="email" placeholder="you@company.com" className={fieldClass} />
                        </Field>
                        <div className="sm:col-span-2">
                            <Field id="contact-phone" label={t("contact.phone")} note={t("contact.optional")}>
                                <div className="flex gap-4">
                                    <select name="countryCode" value={form.countryCode} onChange={onChange} aria-label="Country code" className={`${fieldClass} w-[88px] shrink-0 cursor-pointer`}>
                                        <option value="+66">+66</option>
                                        <option value="+1">+1</option>
                                        <option value="+44">+44</option>
                                        <option value="+81">+81</option>
                                        <option value="+65">+65</option>
                                    </select>
                                    <input id="contact-phone" name="phone" type="tel" value={form.phone} onChange={onChange} autoComplete="tel-national" placeholder="81 234 5678" className={`${fieldClass} flex-1`} />
                                </div>
                            </Field>
                        </div>
                        <div className="sm:col-span-2">
                            <Field id="contact-message" label={t("contact.message")}>
                                <textarea id="contact-message" name="message" value={form.message} onChange={onChange} required rows={4} placeholder={t("contact.phMessage")} className={`${fieldClass} resize-none`} />
                            </Field>
                        </div>

                        <div className="flex flex-col-reverse gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.p
                                    key={status}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    role={status === "error" ? "alert" : "status"}
                                    className={`text-[13.5px] ${status === "error" ? "text-red-600" : status === "sent" ? "text-brand-700" : "text-gray-400"}`}
                                >
                                    {status === "error" ? `${t("contact.failed")}: ${errorMessage}` : status === "sent" ? t("contact.successText") : t("contact.hint")}
                                </motion.p>
                            </AnimatePresence>

                            <button
                                type="submit"
                                disabled={status === "sending"}
                                className="inline-flex h-12 shrink-0 items-center justify-center rounded-lg bg-brand-600 px-7 text-[15px] font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-wait disabled:opacity-80"
                            >
                                {status === "sending" ? (
                                    t("contact.sending")
                                ) : status === "sent" ? (
                                    <span className="inline-flex items-center gap-1.5">
                                        <FiCheck /> {t("contact.sent")}
                                    </span>
                                ) : (
                                    t("contact.send")
                                )}
                            </button>
                        </div>
                    </form>
                </Reveal>
            </div>
            <SendToast toast={toast} onClose={closeToast} />
        </section>
    );
}
