// src/hooks/useMessages.ts
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

interface UseMessagesResult {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

export function useMessages(
  workspaceId: string | null,
  appUser: AppUser | null
): UseMessagesResult {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!workspaceId || !appUser) {
      return;
    }

    const colRef = collection(db, "messages");

    // Clients only read type "client"
    // Staff/admin read both, but we filter UI by tab
    let q;

    if (appUser.role === "client") {
      q = query(
        colRef,
        where("workspaceId", "==", workspaceId),
        where("type", "==", "client"),
        orderBy("createdAt", "asc")
      );
    } else {
      q = query(
        colRef,
        where("workspaceId", "==", workspaceId),
        orderBy("createdAt", "asc")
      );
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: Message[] = snapshot.docs.map((doc) => {
          const data = doc.data() as DocumentData;
          return {
            id: doc.id,
            workspaceId: data.workspaceId ?? "",
            senderId: data.senderId ?? "",
            senderName: data.senderName ?? "Unknown",
            type: (data.type as Message["type"]) ?? "general",
            text: data.text ?? "",
            createdAt: data.createdAt?.toDate?.() ?? null,
          };
        });

        setMessages(items);
        setLoading(false);
      },
      (err) => {
        console.error("Error loading messages:", err);
        setError("Failed to load messages.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [workspaceId, appUser]);

  return { messages, loading, error };
}
