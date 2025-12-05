// src/components/workspace/WorkspaceHeader.tsx
"use client";

import type { Workspace } from "@/types/workspace";

interface WorkspaceHeaderProps {
  workspace: Workspace;
}

export default function WorkspaceHeader({ workspace }: WorkspaceHeaderProps) {
  return (
    <header className="mb-6 pb-6 border-b-2 border-gray-200 bg-gradient-to-r from-white to-gray-50 rounded-xl p-5 -mx-1">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-5 bg-gradient-to-b from-[#FF4D28] to-[#FF6B47] rounded-full"></div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#FF4D28] font-extrabold">
          Workspace
        </p>
      </div>
      <h1 className="mt-3 text-2xl font-extrabold text-[#1A1A1A] sm:text-3xl tracking-tight">
        {workspace.name}
      </h1>
      {workspace.description && (
        <p className="mt-3 text-sm text-gray-600 leading-relaxed max-w-2xl">
          {workspace.description}
        </p>
      )}
    </header>
  );
}
