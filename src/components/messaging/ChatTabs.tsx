// src/components/messaging/ChatTabs.tsx
"use client";

import clsx from "clsx";
import type { AppUser } from "@/types/user";

type ChatTab = "team" | "client";

interface ChatTabsProps {
  activeTab: ChatTab;
  onChange: (tab: ChatTab) => void;
  appUser: AppUser;
}

export type { ChatTab };

export default function ChatTabs({ activeTab, onChange, appUser }: ChatTabsProps) {
  const isClient = appUser.role === "client";

  // Clients only see Client tab, staff/admin see both
  const tabs: ChatTab[] = isClient ? ["client"] : ["team", "client"];

  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 p-1 text-[11px] text-slate-300">
      {tabs.map((tab) => {
        const label = tab === "team" ? "Team" : "Client";
        const subLabel =
          tab === "team"
            ? "Staff only"
            : isClient
            ? "You & your team"
            : "With client";

        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={clsx(
              "flex items-center gap-1 rounded-full px-3 py-1 transition",
              isActive
                ? "bg-indigo-500 text-slate-50"
                : "bg-transparent text-slate-300 hover:bg-slate-800/80"
            )}
          >
            <span className="font-medium">{label}</span>
            <span className="text-[10px] text-slate-200/80">
              {subLabel}
            </span>
          </button>
        );
      })}
    </div>
  );
}
