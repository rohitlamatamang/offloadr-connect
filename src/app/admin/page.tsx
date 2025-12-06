// src/app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import LoadingScreen from "@/components/ui/LoadingScreen";
import StaffSelector from "@/components/workspace/StaffSelector";
import { collection, addDoc, serverTimestamp, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
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
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceDesc, setWorkspaceDesc] = useState("");
  const [selectedClientId, setSelectedClientId] = useState("");
  const [assignedStaffIds, setAssignedStaffIds] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      setError(null);
      setSuccess(null);

      // Prevent admins from changing their own role
      if (userId === appUser?.id) {
        setError("You cannot change your own role");
        setTimeout(() => setError(null), 3000);
        return;
      }

      await updateDoc(doc(db, "users", userId), {
        role: newRole,
      });

      // Update local state
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );

      setSuccess("Role updated successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error updating role:", err);
      setError("Failed to update role");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    try {
      setError(null);
      setSuccess(null);

      // Prevent admins from deleting themselves
      if (userId === appUser?.id) {
        setError("You cannot delete your own account");
        setTimeout(() => setError(null), 3000);
        return;
      }

      // Confirm deletion
      const confirmed = window.confirm(
        `Are you sure you want to delete user "${userName}"? This action cannot be undone.`
      );

      if (!confirmed) return;

      await deleteDoc(doc(db, "users", userId));

      // Update local state
      setUsers((prev) => prev.filter((user) => user.id !== userId));

      setSuccess("User deleted successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      if (!appUser) throw new Error("Not authenticated");
      if (!selectedClientId) throw new Error("Please select a client");

      const docRef = await addDoc(collection(db, "workspaces"), {
        name: workspaceName,
        description: workspaceDesc,
        progress: progress,
        clientId: selectedClientId,
        assignedStaffIds: assignedStaffIds,
        createdBy: appUser.id,
        createdAt: serverTimestamp(),
      });

      // Send notifications
      const { notifyWorkspaceAssigned, notifyMultipleUsers } = await import("@/lib/notifications");
      
      // Notify client about new workspace
      await notifyWorkspaceAssigned(selectedClientId, workspaceName, docRef.id);
      
      // Notify assigned staff members
      if (assignedStaffIds.length > 0) {
        await notifyMultipleUsers(
          assignedStaffIds,
          "workspace_assigned",
          "New Workspace Assigned",
          `You've been assigned to "${workspaceName}"`,
          docRef.id
        );
      }

      setSuccess("Workspace created successfully!");
      setWorkspaceName("");
      setWorkspaceDesc("");
      setSelectedClientId("");
      setAssignedStaffIds([]);
      setProgress(0);
    } catch (err: unknown) {
      console.error("Error creating workspace:", err);
      const error = err as { message?: string };
      setError(error?.message ?? "Failed to create workspace");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteWorkspace = async (workspaceId: string, workspaceName: string) => {
    if (!confirm(`Are you sure you want to delete "${workspaceName}"? This cannot be undone.`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, "workspaces", workspaceId));
      setSuccess("Workspace deleted successfully!");
    } catch (err) {
      console.error("Error deleting workspace:", err);
      setError("Failed to delete workspace");
    }
  };

  const handleUpdateProgress = async (workspaceId: string, newProgress: number) => {
    try {
      await updateDoc(doc(db, "workspaces", workspaceId), {
        progress: newProgress,
      });
    } catch (err) {
      console.error("Error updating progress:", err);
      setError("Failed to update progress");
    }
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

        <Card>
          <h2 className="mb-4 text-lg font-semibold text-[#1A1A1A]">
            Create New Workspace
          </h2>

          <form onSubmit={handleCreateWorkspace} className="space-y-4">
            <Input
              label="Workspace Name"
              type="text"
              placeholder="Website Redesign Project"
              required
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
            />

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1A1A1A]">
                Description
              </label>
              <textarea
                placeholder="Complete overhaul of company website..."
                required
                value={workspaceDesc}
                onChange={(e) => setWorkspaceDesc(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-[#1A1A1A] placeholder-gray-400 focus:border-[#FF4D28] focus:outline-none focus:ring-2 focus:ring-[#FF4D28]/20"
                rows={3}
              />
            </div>

            <div>
              <label htmlFor="client" className="mb-1.5 block text-sm font-medium text-[#1A1A1A]">
                Assign to Client
              </label>
              <select
                id="client"
                required
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-[#1A1A1A] focus:border-[#FF4D28] focus:outline-none focus:ring-2 focus:ring-[#FF4D28]/20"
              >
                <option value="">Select a client...</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} ({client.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <StaffSelector
                selectedStaffIds={assignedStaffIds}
                onSelectionChange={setAssignedStaffIds}
              />
            </div>

            <div className="p-3 bg-blue-50 border-2 border-blue-200 rounded-xl">
              <p className="text-xs text-blue-700">
                <strong>Note:</strong> As an admin, you automatically have access to all workspaces. Only assign staff members who need to work on this project.
              </p>
              {clients.length === 0 && (
                <p className="mt-1 text-xs text-amber-400">
                  No clients available. Ask users to sign up with the &quot;Client&quot; role.
                </p>
              )}
            </div>

            <div>
              <label htmlFor="progress" className="mb-1.5 block text-sm font-medium text-[#1A1A1A]">
                Initial Progress: <span className="text-[#FF4D28]">{progress}%</span>
              </label>
              <input
                type="range"
                id="progress"
                min="0"
                max="100"
                step="5"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="rounded-lg bg-green-50 border border-green-200 p-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Creating..." : "Create Workspace"}
            </Button>
          </form>
        </Card>

        <Card className="mt-6">
          <h2 className="mb-4 text-lg font-semibold text-[#1A1A1A]">
            All Workspaces
          </h2>
          <div className="space-y-3">
            {workspacesLoading ? (
              <p className="text-sm text-gray-600">Loading workspaces...</p>
            ) : workspaces.length === 0 ? (
              <p className="text-sm text-gray-600">No workspaces found</p>
            ) : (
              workspaces.map((workspace) => {
                const client = users.find((u) => u.id === workspace.clientId);
                return (
                  <div
                    key={workspace.id}
                    className="rounded-lg border border-gray-200 bg-white p-4 hover:border-[#FF4D28]/30 transition-colors"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-[#1A1A1A]">
                          {workspace.name}
                        </h3>
                        <p className="mt-1 text-xs text-gray-600">
                          {workspace.description}
                        </p>
                        <p className="mt-2 text-xs text-gray-500">
                          Client: {client?.name || "Unknown"} ({client?.email || "N/A"})
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteWorkspace(workspace.id, workspace.name)}
                        className="ml-3 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                    <div>
                      <div className="mb-2 flex items-center justify-between text-xs">
                        <label className="text-gray-600">Progress: <span className="font-semibold text-[#FF4D28]">{workspace.progress}%</span></label>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={workspace.progress}
                        onChange={(e) => handleUpdateProgress(workspace.id, Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        <Card className="mt-6">
          <h2 className="mb-4 text-lg font-semibold text-[#1A1A1A]">
            All Users
          </h2>
          <div className="space-y-2">
            {users.length === 0 ? (
              <p className="text-sm text-gray-600">No users found</p>
            ) : (
              users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 hover:border-[#FF4D28]/30 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#1A1A1A]">{user.name}</p>
                    <p className="text-xs text-gray-600">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      disabled={user.id === appUser?.id}
                      className="rounded-md border border-gray-300 bg-white px-3 py-1 text-xs text-[#1A1A1A] disabled:cursor-not-allowed disabled:opacity-50 focus:border-[#FF4D28] focus:outline-none"
                    >
                      <option value="client">Client</option>
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-purple-500/20 text-purple-300"
                          : user.role === "staff"
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-green-500/20 text-green-300"
                      }`}
                    >
                      {user.role}
                    </span>
                    <button
                      onClick={() => handleDeleteUser(user.id, user.name)}
                      disabled={user.id === appUser?.id}
                      className="rounded-md bg-red-500/20 px-3 py-1 text-xs font-medium text-red-300 transition-colors hover:bg-red-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                      title="Delete user"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
