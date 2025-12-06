// src/components/admin/UserManagementSection.tsx
"use client";

import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Card from "@/components/ui/Card";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface UserManagementSectionProps {
  users: User[];
  currentUserId?: string;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  onUsersChange: (users: User[]) => void;
}

export default function UserManagementSection({
  users,
  currentUserId,
  onSuccess,
  onError,
  onUsersChange,
}: UserManagementSectionProps) {
  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      // Prevent admins from changing their own role
      if (userId === currentUserId) {
        onError("You cannot change your own role");
        return;
      }

      await updateDoc(doc(db, "users", userId), {
        role: newRole,
      });

      // Update local state
      onUsersChange(
        users.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );

      onSuccess("Role updated successfully");
    } catch (err) {
      console.error("Error updating role:", err);
      onError("Failed to update role");
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    try {
      // Prevent admins from deleting themselves
      if (userId === currentUserId) {
        onError("You cannot delete your own account");
        return;
      }

      // Confirm deletion
      const confirmed = window.confirm(
        `Are you sure you want to delete user "${userName}"? This action cannot be undone.`
      );

      if (!confirmed) return;

      await deleteDoc(doc(db, "users", userId));

      // Update local state
      onUsersChange(users.filter((user) => user.id !== userId));

      onSuccess("User deleted successfully");
    } catch (err) {
      console.error("Error deleting user:", err);
      onError("Failed to delete user");
    }
  };

  return (
    <Card>
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
                  disabled={user.id === currentUserId}
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
                  disabled={user.id === currentUserId}
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
  );
}
