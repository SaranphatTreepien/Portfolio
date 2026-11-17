import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const TECH_HEADING = /tech|tool|stack|เทคโนโลยี|เครื่องมือ/i;

// Turns the comma-separated line under a "Technologies & Tools" style heading into inline code, rendered as chips.
const chipifyTechLines = (source) => {
    const lines = source.split("\n");
    let inTechSection = false;
    return lines
        .map((line) => {
            const heading = line.match(/^#{1,6}\s+(.*)$/);
            if (heading) {
                inTechSection = TECH_HEADING.test(heading[1]);
                return line;
            }
            if (!inTechSection || !line.trim() || /^\s*([-*+]|\d+\.)\s/.test(line) || line.includes("`")) return line;
            const parts = line
                .split(/,|\s+และ\s+|\s+and\s+/i)
                .map((part) => part.trim())
                .filter(Boolean);
            return parts.length > 1 ? parts.map((part) => `\`${part}\``).join(" ") : line;
        })
        .join("\n");
};

const themes = {
    light: {
        h2: "text-xl md:text-2xl font-bold text-gray-900",
        h3: "text-[#2f9c93]",
        p: "text-gray-600",
        strong: "text-gray-900",
        li: "bg-gray-50/80 border-gray-100 text-gray-600",
        dot: "bg-[#7edad2]",
        chip: "bg-[#7edad2]/15 text-[#1f7f77] border-[#7edad2]/30",
        a: "text-[#2f9c93] hover:text-[#1f7f77]",
    },
    dark: {
        h2: "text-xl md:text-2xl font-bold text-white",
        h3: "text-[#7edad2]",
        p: "text-gray-300",
        strong: "text-white",
        li: "bg-white/5 border-white/10 text-gray-300",
        dot: "bg-[#7edad2]",
        chip: "bg-[#7edad2]/15 text-[#a6ebe4] border-[#7edad2]/30",
        a: "text-[#7edad2] hover:text-[#a6ebe4]",
    },
};

export default function Markdown({ children, tone = "light" }) {
    const t = themes[tone];
    const heading = ({ children }) => <h2 className={`${t.h2} mt-8 first:mt-0 mb-3 leading-snug`}>{children}</h2>;

    return (
        <div className="break-words">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: heading,
                    h2: heading,
                    h3: ({ children }) => (
                        <h3 className={`${t.h3} mt-8 first:mt-0 mb-3 flex items-center gap-2 text-base md:text-lg font-bold`}>
                            <span className={`h-4 w-1 rounded-full ${t.dot}`} />
                            {children}
                        </h3>
                    ),
                    h4: ({ children }) => <h4 className={`${t.strong} mt-6 mb-2 font-semibold`}>{children}</h4>,
                    p: ({ children }) => <p className={`${t.p} mb-4 last:mb-0 text-sm md:text-base leading-7`}>{children}</p>,
                    strong: ({ children }) => <strong className={`${t.strong} font-semibold`}>{children}</strong>,
                    ul: ({ children }) => <ul className="mb-4 last:mb-0 grid gap-2 md:grid-cols-2">{children}</ul>,
                    ol: ({ children }) => <ol className="mb-4 last:mb-0 grid gap-2 md:grid-cols-2 [counter-reset:md]">{children}</ol>,
                    li: ({ children }) => (
                        <li className={`${t.li} flex gap-3 rounded-xl border px-4 py-3 text-sm leading-6 [counter-increment:md]`}>
                            <span className={`mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full ${t.dot} [ol>li>&]:hidden`} />
                            <span className={`${t.h3} hidden shrink-0 font-bold before:content-[counter(md)] [ol>li>&]:inline`} />
                            <span className="min-w-0">{children}</span>
                        </li>
                    ),
                    code: ({ children }) => (
                        <code className={`${t.chip} mr-2 mb-2 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold font-secondary [pre>&]:m-0 [pre>&]:block [pre>&]:whitespace-pre [pre>&]:rounded-none [pre>&]:border-0 [pre>&]:bg-transparent [pre>&]:p-0 [pre>&]:[font-family:ui-monospace,monospace] [pre>&]:font-normal [pre>&]:text-gray-100`}>
                            {children}
                        </code>
                    ),
                    pre: ({ children }) => <pre className="mb-4 overflow-x-auto rounded-xl bg-gray-900 p-4 text-xs leading-6">{children}</pre>,
                    a: ({ href, children }) => (
                        <a href={href} target="_blank" rel="noopener noreferrer" className={`${t.a} font-semibold underline underline-offset-4`}>
                            {children}
                        </a>
                    ),
                    hr: () => <hr className="my-6 border-gray-200/60" />,
                }}
            >
                {chipifyTechLines(String(children || ""))}
            </ReactMarkdown>
        </div>
    );
}
