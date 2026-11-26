import Link from "next/link";

// Monogram: a plain teal tile with "ST"
export const LogoMark = ({ className = "h-9 w-9 text-[13px]" }) => (
  <span
    aria-hidden="true"
    className={`flex shrink-0 items-center justify-center rounded-lg bg-brand-600 font-bold tracking-[-0.03em] text-white ${className}`}
  >
    ST
  </span>
);

const Logo = ({ light = false, subtitle }) => (
  <Link href="/" className="group flex items-center gap-3" aria-label="Saranphat Treepian, home">
    <span className="transition-transform duration-300 group-hover:-translate-y-0.5">
      <LogoMark />
    </span>
    <span className="flex flex-col leading-tight">
      <span className={`whitespace-nowrap text-[15px] font-semibold tracking-tight ${light ? "text-white" : "text-primary"}`}>
        Saranphat Treepian
      </span>
      {subtitle && (
        <span className={`hidden whitespace-nowrap text-[12px] sm:block ${light ? "text-white/60" : "text-gray-500"}`}>{subtitle}</span>
      )}
    </span>
  </Link>
);
export default Logo;
