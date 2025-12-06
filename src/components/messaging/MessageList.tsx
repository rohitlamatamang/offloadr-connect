// src/components/messaging/MessageList.tsx
"use client";

import type { Message } from "@/types/message";
import ChatMessage from "./ChatMessage";
import { useEffect, useRef, memo } from "react";

interface MessageListProps {
  messages: Message[];
}

function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="px-4 py-4">
      {messages.length === 0 ? (
        <div className="mt-6 text-center">
          <div className="inline-block rounded-full bg-gray-100 p-4 mb-3">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-sm text-gray-600 font-medium">No messages yet</p>
          <p className="text-xs text-gray-500 mt-1">Start the conversation below</p>
        </div>
      ) : (
        messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
      )}
      <div ref={bottomRef} />
    </div>
  );
}

export default memo(MessageList);
