"use client";

import Avatar from "@/components/ui/Avatar";

export interface MobileHeaderProps {
  title: string;
  onMenuClick: () => void;
}

export default function MobileHeader({
  title,
  onMenuClick,
}: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur-sm lg:hidden shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-gray-100"
          aria-label="Open menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>

        <h1 className="flex-1 truncate text-base font-semibold text-[#1A1A1A]">
          {title}
        </h1>

        <Avatar name="Current User" size="sm" />
      </div>
    </header>
  );
}
