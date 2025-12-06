// src/components/messaging/ChatMessage.tsx
"use client";

import type { Message } from "@/types/message";
import { useAuth } from "@/context/AuthContext";
import { memo } from "react";
import clsx from "clsx";

interface ChatMessageProps {
  message: Message;
}

function ChatMessage({ message }: ChatMessageProps) {
  const { appUser } = useAuth();
  const isOwn = appUser && appUser.id === message.senderId;
  const isClientMessage = message.type === "client";
  const isDirectMessage = message.type === "staff" && message.recipientId;

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
        <div className="flex items-center gap-2 mb-1.5">
          {/* Direct Message Icon */}
          {isDirectMessage && (
            <svg className={clsx("w-3.5 h-3.5", isOwn ? "text-white/90" : "text-purple-600")} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
            </svg>
          )}
          
          <div className={clsx(
            "text-[11px] font-bold tracking-wide",
            isOwn 
              ? "text-white/95" 
              : isClientMessage 
                ? "text-blue-600" 
                : "text-[#FF4D28]"
          )}>
            {message.senderName}
            {message.senderRole && !isDirectMessage && (
              <span className={clsx(
                "ml-1.5 font-normal text-[10px]",
                isOwn ? "text-white/75" : "text-gray-500"
              )}>
                • {message.senderRole}
              </span>
            )}
          </div>
          
          {/* Direct Message Badge */}
          {isDirectMessage && message.recipientName && (
            <span className={clsx(
              "text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider",
              isOwn 
                ? "bg-white/20 text-white/90" 
                : "bg-purple-100 text-purple-700"
            )}>
              → {message.recipientName}
            </span>
          )}
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

export default memo(ChatMessage);
