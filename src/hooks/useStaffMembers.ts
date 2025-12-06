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
          staff.push({
            uid: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || null,
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
