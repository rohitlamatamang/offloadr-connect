// src/components/workspace/WorkspaceCard.tsx
"use client";

import Link from "next/link";
import type { Workspace } from "@/types/workspace";

interface WorkspaceCardProps {
  workspace: Workspace;
}

export default function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const progress = Math.min(100, Math.max(0, workspace.progress ?? 0));

  return (
    <Link
      href={`/workspace/${workspace.id}`}
      className="group flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-md shadow-slate-950/70 transition hover:-translate-y-1 hover:border-indigo-500/70 hover:shadow-lg hover:shadow-indigo-900/50"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-50 sm:text-base">
            {workspace.name || "Untitled workspace"}
          </h3>
          {workspace.description && (
            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
              {workspace.description}
            </p>
          )}
        </div>
        <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-300">
          {progress}% done
        </span>
      </div>

      <div className="mt-4">
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all duration-300 group-hover:bg-indigo-400"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-[11px] text-slate-500">
          Click to open workspace and view messages and progress.
        </p>
      </div>
    </Link>
  );
}
