import Link from "next/link";

interface LogoProps {
  size?: "sm" | "lg";
}

export default function Logo({ size = "sm" }: LogoProps) {
  const isLarge = size === "lg";
  
  return (
    <Link href="/" className="inline-flex items-center gap-2">
      <div className={`flex items-center justify-center rounded-2xl bg-slate-900/80 shadow-lg shadow-indigo-500/20 ring-1 ring-slate-700/70 ${isLarge ? "h-12 w-12" : "h-9 w-9"}`}>
        <span className={`font-semibold tracking-[0.12em] text-indigo-300 ${isLarge ? "text-sm" : "text-xs"}`}>
          CT
        </span>
      </div>
      <div className="flex flex-col leading-tight">
        <span className={`font-semibold text-slate-50 ${isLarge ? "text-base" : "text-sm"}`}>
          CollabType
        </span>
        <span className="text-[11px] text-slate-400">
          Real-time typing workspace
        </span>
      </div>
    </Link>
  );
}
