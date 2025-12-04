// src/hooks/useWorkspaces.ts
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
import type { Workspace } from "@/types/workspace";
import type { AppUser } from "@/types/user";

interface UseWorkspacesResult {
  workspaces: Workspace[];
  loading: boolean;
  error: string | null;
}

export function useWorkspaces(appUser: AppUser | null): UseWorkspacesResult {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(Boolean(appUser));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!appUser) {
      return;
    }

    const colRef = collection(db, "workspaces");

    // For now:
    // - if client: filter by clientId (without orderBy to avoid index requirement)
    // - if staff/admin: show all workspaces ordered by creation date
    let q;

    if (appUser.role === "client") {
      // Simple query without orderBy - avoids composite index requirement
      q = query(
        colRef,
        where("clientId", "==", appUser.id)
      );
    } else {
      q = query(colRef, orderBy("createdAt", "desc"));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: Workspace[] = snapshot.docs.map((doc) => {
          const data = doc.data() as DocumentData;
          return {
            id: doc.id,
            name: data.name ?? "",
            description: data.description ?? "",
            progress: typeof data.progress === "number" ? data.progress : 0,
            clientId: data.clientId ?? "",
            createdBy: data.createdBy ?? "",
            createdAt: data.createdAt?.toDate?.() ?? null,
          };
        });

        // Debug logging
        if (appUser.role === "client") {
          console.log("Client user ID:", appUser.id);
          console.log("Workspaces returned:", items.length);
          items.forEach(ws => {
            console.log(`- ${ws.name}: clientId = "${ws.clientId}"`);
          });
        }

        setWorkspaces(items);
        setLoading(false);
      },
      (err) => {
        console.error("Error loading workspaces:", err);
        setError("Failed to load workspaces.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [appUser]);

  return { workspaces, loading, error };
}
