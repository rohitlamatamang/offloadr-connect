// src/hooks/useWorkspace.ts
"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Workspace } from "@/types/workspace";

interface UseWorkspaceResult {
  workspace: Workspace | null;
  loading: boolean;
  error: string | null;
}

export function useWorkspace(id: string | null): UseWorkspaceResult {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setWorkspace(null);
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const ref = doc(db, "workspaces", id);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setWorkspace(null);
          setError("Workspace not found.");
        } else {
          const data = snap.data();
          setWorkspace({
            id: snap.id,
            name: data.name ?? "",
            description: data.description ?? "",
            progress: typeof data.progress === "number" ? data.progress : 0,
            clientId: data.clientId ?? "",
            assignedStaffIds: Array.isArray(data.assignedStaffIds) ? data.assignedStaffIds : [],
            createdBy: data.createdBy ?? "",
            createdAt: data.createdAt?.toDate?.() ?? null,
          });
        }
      } catch (err) {
        console.error("Error loading workspace:", err);
        setError("Failed to load workspace.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  return { workspace, loading, error };
}
