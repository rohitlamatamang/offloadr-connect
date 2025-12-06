// src/hooks/useGlobalMessages.ts
"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Message } from "@/types/message";
import type { AppUser } from "@/types/user";

interface UseGlobalMessagesResult {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

export function useGlobalMessages(
  appUser: AppUser | null
): UseGlobalMessagesResult {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!appUser) {
      return;
    }

    // Only staff and admin can access global messages
    if (appUser.role === "client") {
      setMessages([]);
      setLoading(false);
      return;
    }

    const colRef = collection(db, "messages");

    // Query for global messages (workspaceId is null or empty)
    // We'll use a special workspaceId value "GLOBAL_STAFF_CHAT" to identify global messages
    const q = query(
      colRef,
      where("workspaceId", "==", "GLOBAL_STAFF_CHAT"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        let items: Message[] = snapshot.docs.map((doc) => {
          const data = doc.data() as DocumentData;
          return {
            id: doc.id,
            workspaceId: data.workspaceId ?? "",
            senderId: data.senderId ?? "",
            senderName: data.senderName ?? "Unknown",
            senderRole: data.senderRole,
            type: (data.type as Message["type"]) ?? "staff",
            text: data.text ?? "",
            recipientId: data.recipientId,
            recipientName: data.recipientName,
            createdAt: data.createdAt?.toDate?.() ?? null,
          };
        });

        // Filter direct messages for staff (admin sees all)
        if (appUser.role === "staff") {
          items = items.filter((msg) => {
            // Show group messages (no recipient)
            if (!msg.recipientId) return true;
            
            // Show DMs where user is sender or recipient
            return msg.senderId === appUser.id || msg.recipientId === appUser.id;
          });
        }

        setMessages(items);
        setLoading(false);
      },
      (err) => {
        console.error("Error loading global messages:", err);
        setError("Failed to load messages.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [appUser]);

  return { messages, loading, error };
}
