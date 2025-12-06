// src/hooks/useClientInfo.ts
"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { AppUser } from "@/types/user";

interface UseClientInfoResult {
  clientInfo: AppUser | null;
  loading: boolean;
  error: string | null;
}

export function useClientInfo(clientId: string | null): UseClientInfoResult {
  const [clientInfo, setClientInfo] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clientId) {
      setLoading(false);
      return;
    }

    const fetchClientInfo = async () => {
      try {
        const docRef = doc(db, "users", clientId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setClientInfo({
            id: docSnap.id,
            email: data.email || "",
            name: data.name || "",
            role: data.role || "client",
            clientType: data.clientType,
            companyName: data.companyName,
            phone: data.phone,
            timeZone: data.timeZone,
            preferredContactMethod: data.preferredContactMethod,
            communicationFrequency: data.communicationFrequency,
          });
        } else {
          setError("Client not found");
        }
      } catch (err) {
        console.error("Error fetching client info:", err);
        setError("Failed to load client information");
      } finally {
        setLoading(false);
      }
    };

    fetchClientInfo();
  }, [clientId]);

  return { clientInfo, loading, error };
}
