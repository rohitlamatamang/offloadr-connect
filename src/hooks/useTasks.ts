// src/hooks/useTasks.ts
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
import type { Task } from "@/types/task";

interface UseTasksResult {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

export function useTasks(workspaceId: string | null): UseTasksResult {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!workspaceId) {
      return;
    }

    const colRef = collection(db, "tasks");
    const q = query(
      colRef,
      where("workspaceId", "==", workspaceId),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: Task[] = snapshot.docs.map((doc) => {
          const data = doc.data() as DocumentData;
          return {
            id: doc.id,
            workspaceId: data.workspaceId ?? "",
            label: data.label ?? "",
            completed: !!data.completed,
            createdBy: data.createdBy ?? "",
            createdAt: data.createdAt?.toDate?.() ?? null,
          };
        });

        setTasks(items);
        setLoading(false);
      },
      (err) => {
        console.error("Error loading tasks:", err);
        setError("Failed to load tasks.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [workspaceId]);

  return { tasks, loading, error };
}
