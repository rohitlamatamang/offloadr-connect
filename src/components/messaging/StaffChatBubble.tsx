// src/components/messaging/StaffChatBubble.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import StaffChatModal from "./StaffChatModal";

export default function StaffChatBubble() {
  const { appUser } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Don't show inside workspace pages
  const isWorkspacePage = pathname?.startsWith("/workspace/");

  // Only show for staff and admin, and not on workspace pages
  if (!appUser || (appUser.role !== "staff" && appUser.role !== "admin") || isWorkspacePage) {
    return null;
  }

  return (
    <>
      {/* Floating Chat Bubble Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        aria-label="Open Staff Chat"
      >
        <svg 
          className="w-5 h-5 sm:w-6 sm:h-6 text-white" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
        </svg>
        
        {/* Pulse animation */}
        <span className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-30"></span>
      </button>

      {/* Chat Modal */}
      <StaffChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
