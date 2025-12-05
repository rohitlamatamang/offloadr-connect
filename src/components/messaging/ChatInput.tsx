// src/components/messaging/ChatInput.tsx
"use client";

import { FormEvent, useState, useRef } from "react";
import Button from "@/components/ui/Button";

interface ChatInputProps {
  onSend: (text: string) => Promise<void> | void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;

    const current = text.trim();
    setText("");
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      await onSend(current);
    } catch (err) {
      console.error("Failed to send message:", err);
      // Optionally restore text on error
      setText(current);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-3 bg-[#FAFAFA] px-4 py-3"
    >
      <textarea
        ref={textareaRef}
        rows={1}
        className="max-h-20 min-h-[2.5rem] flex-1 resize-none rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-[#1A1A1A] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF4D28]/30 focus:border-[#FF4D28] overflow-y-auto"
        placeholder="Type a message…"
        value={text}
        disabled={disabled}
        onChange={(e) => {
          setText(e.target.value);
          // Auto-resize textarea
          e.target.style.height = 'auto';
          e.target.style.height = Math.min(e.target.scrollHeight, 80) + 'px';
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />
      <Button
        type="submit"
        className="shrink-0"
        disabled={disabled || !text.trim()}
      >
        Send
      </Button>
    </form>
  );
}
