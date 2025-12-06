// src/components/admin/WorkspaceManagementSection.tsx
"use client";

import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Card from "@/components/ui/Card";
import type { Workspace } from "@/types/workspace";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface WorkspaceManagementSectionProps {
  workspaces: Workspace[];
  users: User[];
  loading: boolean;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export default function WorkspaceManagementSection({
  workspaces,
  users,
  loading,
  onSuccess,
  onError,
}: WorkspaceManagementSectionProps) {
  const handleDeleteWorkspace = async (workspaceId: string, workspaceName: string) => {
    if (!confirm(`Are you sure you want to delete "${workspaceName}"? This cannot be undone.`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, "workspaces", workspaceId));
      onSuccess("Workspace deleted successfully!");
    } catch (err) {
      console.error("Error deleting workspace:", err);
      onError("Failed to delete workspace");
    }
  };

  const handleUpdateProgress = async (workspaceId: string, newProgress: number) => {
    try {
      await updateDoc(doc(db, "workspaces", workspaceId), {
        progress: newProgress,
      });
    } catch (err) {
      console.error("Error updating progress:", err);
      onError("Failed to update progress");
    }
  };

  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold text-[#1A1A1A]">
        All Workspaces
      </h2>
      <div className="space-y-3">
        {loading ? (
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
                    {workspace.description && (
                      <p className="mt-1 text-xs text-gray-600">
                        {workspace.description}
                      </p>
                    )}
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
                    <label className="text-gray-600">
                      Progress: <span className="font-semibold text-[#FF4D28]">{workspace.progress}%</span>
                    </label>
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
  );
}
