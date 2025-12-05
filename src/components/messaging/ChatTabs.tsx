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
    <div className="inline-flex items-center gap-1 rounded-full bg-white border border-gray-200 p-1 text-[11px] shadow-sm">
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
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 transition",
              isActive
                ? "bg-gradient-to-r from-[#FF4D28] to-[#FF6B47] text-white shadow-sm"
                : "bg-transparent text-gray-600 hover:bg-gray-50"
            )}
          >
            <span className="font-semibold">{label}</span>
            <span className={clsx("text-[10px]", isActive ? "text-white/90" : "text-gray-500")}>
              {subLabel}
            </span>
          </button>
        );
      })}
    </div>
  );
}
