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
        "mb-2 flex text-sm",
        isOwn ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={clsx(
          "max-w-[80%] rounded-2xl px-3 py-2",
          isOwn
            ? "bg-indigo-500 text-slate-50"
            : "bg-slate-800 text-slate-100"
        )}
      >
        <div className="mb-0.5 text-[11px] font-medium text-slate-200/80">
          {message.senderName}
        </div>
        <div>{message.text}</div>
        {message.createdAt && (
          <div className="mt-1 text-[10px] text-slate-300/80">
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
