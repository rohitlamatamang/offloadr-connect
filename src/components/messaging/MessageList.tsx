// src/components/messaging/MessageList.tsx
"use client";

import type { Message } from "@/types/message";
import ChatMessage from "./ChatMessage";
import { useEffect, useRef } from "react";

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="flex-1 overflow-y-auto px-3 py-2">
      {messages.length === 0 ? (
        <div className="mt-6 text-center text-xs text-slate-500">
          No messages yet. Start the conversation.
        </div>
      ) : (
        messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
      )}
      <div ref={bottomRef} />
    </div>
  );
}
