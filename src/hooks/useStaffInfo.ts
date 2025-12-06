// src/hooks/useStaffInfo.ts
"use client";

import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { AppUser } from "@/types/user";

export function useStaffInfo(staffIds: string[]) {
  const [staffMembers, setStaffMembers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStaffMembers() {
      if (!staffIds || staffIds.length === 0) {
        setStaffMembers([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const staffPromises = staffIds.map(async (staffId) => {
          const staffDoc = await getDoc(doc(db, "users", staffId));
          if (staffDoc.exists()) {
            const data = staffDoc.data();
            return {
              id: staffDoc.id,
              email: data.email || "",
              name: data.name || "",
              role: data.role || "staff",
              staffRole: data.staffRole,
              staffRoleLabel: data.staffRoleLabel,
              clientType: data.clientType,
              companyName: data.companyName,
              phone: data.phone,
              timeZone: data.timeZone,
              preferredContactMethod: data.preferredContactMethod,
              communicationFrequency: data.communicationFrequency,
              createdAt: data.createdAt?.toDate() || null,
            } as AppUser;
          }
          return null;
        });

        const results = await Promise.all(staffPromises);
        const validStaff = results.filter((staff): staff is AppUser => staff !== null);
        
        setStaffMembers(validStaff);
        setError(null);
      } catch (err) {
        console.error("Error fetching staff info:", err);
        setError("Failed to load staff information");
      } finally {
        setLoading(false);
      }
    }

    fetchStaffMembers();
  }, [staffIds?.join(",") || ""]); // Safe join with fallback

  return { staffMembers, loading, error };
}
