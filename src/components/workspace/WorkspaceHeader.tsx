// src/components/workspace/WorkspaceHeader.tsx
"use client";

import type { Workspace } from "@/types/workspace";

interface WorkspaceHeaderProps {
  workspace: Workspace;
}

export default function WorkspaceHeader({ workspace }: WorkspaceHeaderProps) {
  return (
    <header className="mb-4 border-b border-slate-800 pb-3">
      <p className="text-[11px] uppercase tracking-[0.18em] text-indigo-300">
        Workspace
      </p>
      <h1 className="mt-1 text-xl font-semibold text-slate-50 sm:text-2xl">
        {workspace.name}
      </h1>
      {workspace.description && (
        <p className="mt-1 text-sm text-slate-400">
          {workspace.description}
        </p>
      )}
    </header>
  );
}
