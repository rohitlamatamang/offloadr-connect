// src/hooks/useStaffMembers.ts
"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { AppUser } from "@/types/user";

export function useStaffMembers() {
  const [staffMembers, setStaffMembers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStaffMembers() {
      try {
        setLoading(true);
        const usersRef = collection(db, "users");
        const staffQuery = query(usersRef, where("role", "==", "staff"));
        const snapshot = await getDocs(staffQuery);

        const staff: AppUser[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          staff.push({
            id: doc.id,
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
          } as AppUser);
        });

        setStaffMembers(staff);
        setError(null);
      } catch (err) {
        console.error("Error fetching staff members:", err);
        setError("Failed to load staff members");
      } finally {
        setLoading(false);
      }
    }

    fetchStaffMembers();
  }, []);

  return { staffMembers, loading, error };
}
