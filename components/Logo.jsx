import Link from "next/link";

const Logo = ({ light = false, subtitle }) => {
  // determine the logo image based on light prop
  const colorClass = light ? "text-white" : "text-primary"; //default to black
  return (
    <Link href="/" className="flex flex-col items-center lg:items-start">
      <span className={`font-primary text-2xl tracking-[4px] ${colorClass}`}>Saranphat Treepien</span>
      {subtitle && (
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white lg:text-[#2f9c93]">
          {subtitle}
        </span>
      )}
    </Link>
  );
};
export default Logo;
