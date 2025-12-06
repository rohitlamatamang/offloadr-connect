// src/hooks/useNotifications.ts
"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Notification } from "@/types/notification";
import type { AppUser } from "@/types/user";

interface UseNotificationsResult {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

export function useNotifications(appUser: AppUser | null): UseNotificationsResult {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!appUser) {
      setLoading(false);
      return;
    }

    const colRef = collection(db, "notifications");
    const q = query(
      colRef,
      where("userId", "==", appUser.id),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: Notification[] = snapshot.docs.map((doc) => {
          const data = doc.data() as DocumentData;
          return {
            id: doc.id,
            userId: data.userId ?? "",
            type: data.type ?? "message",
            title: data.title ?? "",
            message: data.message ?? "",
            workspaceId: data.workspaceId,
            taskId: data.taskId,
            read: data.read ?? false,
            createdAt: data.createdAt?.toDate?.() ?? null,
          };
        });

        setNotifications(items);
        setLoading(false);
      },
      (err) => {
        console.error("Error loading notifications:", err);
        setError("Failed to load notifications.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [appUser]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, unreadCount, loading, error };
}
