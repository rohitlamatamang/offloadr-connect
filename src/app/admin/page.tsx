// src/app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { WorkspaceCreationForm, WorkspaceManagementSection, UserManagementSection } from "@/components/admin";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useWorkspaces } from "@/hooks/useWorkspaces";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function AdminPage() {
  const { appUser, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { workspaces, loading: workspacesLoading } = useWorkspaces(appUser);

  useEffect(() => {
    if (!loading && (!appUser || appUser.role !== "admin")) {
      router.push("/dashboard");
    }
  }, [appUser, loading, router]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as User[];
        setUsers(usersData);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    if (appUser?.role === "admin") {
      fetchUsers();
    }
  }, [appUser]);

  const handleSuccess = (message: string) => {
    setError(null);
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleError = (message: string) => {
    setSuccess(null);
    setError(message);
    setTimeout(() => setError(null), 3000);
  };

  if (loading) {
    return <LoadingScreen message="Loading admin panel" />;
  }

  if (!appUser || appUser.role !== "admin") {
    return null;
  }

  const clients = users.filter((u) => u.role === "client");

  return (
    <AppShell title="Admin Panel">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#FF4D28]">Admin Panel</h1>
          <p className="mt-2 text-sm text-gray-600">
            Create workspaces and assign clients
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-3">
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        <WorkspaceCreationForm
          appUserId={appUser?.id || ""}
          clients={clients}
          onSuccess={handleSuccess}
          onError={handleError}
        />

        <div className="mt-6">
          <WorkspaceManagementSection
            workspaces={workspaces}
            users={users}
            loading={workspacesLoading}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </div>

        <div className="mt-6">
          <UserManagementSection
            users={users}
            currentUserId={appUser?.id}
            onSuccess={handleSuccess}
            onError={handleError}
            onUsersChange={setUsers}
          />
        </div>
      </div>
    </AppShell>
  );
}
