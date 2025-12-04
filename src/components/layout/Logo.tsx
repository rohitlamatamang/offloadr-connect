import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900/80 shadow-lg shadow-indigo-500/20 ring-1 ring-slate-700/70">
        <span className="text-xs font-semibold tracking-[0.12em] text-indigo-300">
          CT
        </span>
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-semibold text-slate-50">
          CollabType
        </span>
        <span className="text-[11px] text-slate-400">
          Real-time typing workspace
        </span>
      </div>
    </Link>
  );
}
