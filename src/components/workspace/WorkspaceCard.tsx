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
      className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-[#FF4D28] hover:shadow-lg hover:shadow-[#FF4D28]/10"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-[#1A1A1A] sm:text-base">
            {workspace.name || "Untitled workspace"}
          </h3>
          {workspace.description && (
            <p className="mt-1 text-xs text-gray-600 sm:text-sm">
              {workspace.description}
            </p>
          )}
        </div>
        <span className="rounded-full bg-[#FF4D28]/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#FF4D28]">
          {progress}% done
        </span>
      </div>

      <div className="mt-4">
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#FF4D28] to-[#FF6B47] transition-all duration-300"
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
