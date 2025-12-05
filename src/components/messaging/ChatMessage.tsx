// src/components/messaging/ChatMessage.tsx
"use client";

import type { Message } from "@/types/message";
import { useAuth } from "@/context/AuthContext";
import clsx from "clsx";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const { appUser } = useAuth();
  const isOwn = appUser && appUser.id === message.senderId;

  return (
    <div
      className={clsx(
        "mb-4 flex text-sm animate-in fade-in slide-in-from-bottom-2 duration-300",
        isOwn ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={clsx(
          "max-w-[80%] sm:max-w-[75%] rounded-2xl px-4 py-3 transition-all duration-200",
          isOwn
            ? "bg-gradient-to-br from-[#FF4D28] to-[#FF6B47] text-white shadow-lg shadow-[#FF4D28]/20"
            : "bg-white text-[#1A1A1A] border border-gray-200 shadow-md hover:shadow-lg"
        )}
      >
        <div className={clsx("mb-1.5 text-[11px] font-bold uppercase tracking-wider", isOwn ? "text-white/95" : "text-[#FF4D28]")}>
          {message.senderName}
        </div>
        <div className="leading-relaxed whitespace-pre-wrap break-words">{message.text}</div>
        {message.createdAt && (
          <div className={clsx("mt-2 text-[10px] font-medium", isOwn ? "text-white/85" : "text-gray-500")}>
            {message.createdAt.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        )}
      </div>
    </div>
  );
}
