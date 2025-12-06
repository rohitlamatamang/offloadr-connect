// src/components/admin/WorkspaceCreationForm.tsx
"use client";

import { useState, FormEvent } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FormInput, FormTextarea, FormSelect } from "@/components/forms";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import StaffSelector from "@/components/workspace/StaffSelector";

interface WorkspaceCreationFormProps {
  appUserId: string;
  clients: Array<{ id: string; email: string; name: string }>;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export default function WorkspaceCreationForm({
  appUserId,
  clients,
  onSuccess,
  onError,
}: WorkspaceCreationFormProps) {
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceDesc, setWorkspaceDesc] = useState("");
  const [selectedClientId, setSelectedClientId] = useState("");
  const [assignedStaffIds, setAssignedStaffIds] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateWorkspace = async (e: FormEvent) => {
    e.preventDefault();
    onError("");
    setIsSubmitting(true);

    try {
      if (!selectedClientId) throw new Error("Please select a client");

      const docRef = await addDoc(collection(db, "workspaces"), {
        name: workspaceName,
        description: workspaceDesc,
        progress: progress,
        clientId: selectedClientId,
        assignedStaffIds: assignedStaffIds,
        createdBy: appUserId,
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

      onSuccess("Workspace created successfully!");
      
      // Reset form
      setWorkspaceName("");
      setWorkspaceDesc("");
      setSelectedClientId("");
      setAssignedStaffIds([]);
      setProgress(0);
    } catch (err: unknown) {
      console.error("Error creating workspace:", err);
      const error = err as { message?: string };
      onError(error?.message ?? "Failed to create workspace");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold text-[#1A1A1A]">
        Create New Workspace
      </h2>

      <form onSubmit={handleCreateWorkspace} className="space-y-4">
        <FormInput
          label="Workspace Name"
          type="text"
          placeholder="Website Redesign Project"
          required
          value={workspaceName}
          onChange={(e) => setWorkspaceName(e.target.value)}
        />

        <FormTextarea
          label="Description"
          placeholder="Complete overhaul of company website..."
          required
          value={workspaceDesc}
          onChange={(e) => setWorkspaceDesc(e.target.value)}
          rows={3}
        />

        <FormSelect
          label="Assign to Client"
          id="client"
          required
          value={selectedClientId}
          onChange={(e) => setSelectedClientId(e.target.value)}
        >
          <option value="">Select a client...</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name} ({client.email})
            </option>
          ))}
        </FormSelect>

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

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Creating..." : "Create Workspace"}
        </Button>
      </form>
    </Card>
  );
}
