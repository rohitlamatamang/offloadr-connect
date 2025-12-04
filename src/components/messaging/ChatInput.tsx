// src/components/messaging/ChatInput.tsx
"use client";

import { FormEvent, useState } from "react";
import Button from "@/components/ui/Button";

interface ChatInputProps {
  onSend: (text: string) => Promise<void> | void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;

    const current = text.trim();
    setText("");

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
      className="flex items-end gap-2 border-t border-slate-800 bg-slate-900/80 px-3 py-2"
    >
      <textarea
        className="max-h-32 min-h-10 flex-1 resize-none rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        placeholder="Type a message…"
        value={text}
        disabled={disabled}
        onChange={(e) => setText(e.target.value)}
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
