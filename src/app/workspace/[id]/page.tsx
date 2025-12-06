// src/app/workspace/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useMessages } from "@/hooks/useMessages";
import { useTasks } from "@/hooks/useTasks";
import AppShell from "@/components/layout/AppShell";
import LoadingScreen from "@/components/ui/LoadingScreen";
import DesktopWorkspaceLayout from "@/components/workspace/DesktopWorkspaceLayout";
import MobileWorkspaceLayout from "@/components/workspace/MobileWorkspaceLayout";
import TaskPanelPopup from "@/components/workspace/TaskPanelPopup";
import { SectionErrorBoundary } from "@/components/error";
import { addDoc, collection, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useMemo, useState } from "react";
import { notifyProgressUpdate, notifyWorkspaceCompleted } from "@/lib/notifications";
import { ChatTab } from "@/components/messaging/ChatTabs";

export default function WorkspacePage() {
  const params = useParams();
  const idParam = params?.id;
  const workspaceId =
    typeof idParam === "string" ? idParam : Array.isArray(idParam) ? idParam[0] : null;

  const { appUser, loading: authLoading } = useAuth();
  const { workspace, loading: wsLoading, error: wsError } = useWorkspace(workspaceId);
  const { messages, loading: msgLoading, error: msgError } = useMessages(workspaceId, appUser ?? null);
  const { tasks, loading: tasksLoading, error: tasksError } = useTasks(workspaceId);

  const [activeTab, setActiveTab] = useState<ChatTab>("client");
  const [showTaskPanel, setShowTaskPanel] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<{ id: string | null; name: string } | null>(null);
  
  const loading = authLoading || wsLoading || msgLoading || tasksLoading;

  const filteredMessages = useMemo(() => {
    if (!messages) return [];
    if (!appUser) return messages;

    // Clients see only type "client"
    if (appUser.role === "client") {
      return messages.filter((m) => m.type === "client");
    }

    // Staff/admin: filter by active tab
    if (activeTab === "team") {
      return messages.filter((m) => m.type === "staff");
    }
    return messages.filter((m) => m.type === "client");
  }, [messages, appUser, activeTab]);

  const handleSendMessage = async (text: string) => {
    if (!appUser || !workspaceId) return;

    let msgType: "staff" | "client" = "client";

    if (appUser.role === "client") {
      msgType = "client";
    } else {
      msgType = activeTab === "team" ? "staff" : "client";
    }

    const messageData: Record<string, unknown> = {
      workspaceId,
      senderId: appUser.id,
      senderName: appUser.name || appUser.email,
      senderRole: appUser.staffRoleLabel || null, // Add staff role for display
      type: msgType,
      text,
      createdAt: serverTimestamp(),
    };

    // Add recipient info for staff direct messages
    if (msgType === "staff" && selectedRecipient) {
      messageData.recipientId = selectedRecipient.id;
      messageData.recipientName = selectedRecipient.name;
    }

    await addDoc(collection(db, "messages"), messageData);
  };

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    if (!workspaceId || !appUser || !workspace) return;
    if (appUser.role === "client") return; // clients can't edit

    const ref = doc(db, "tasks", taskId);
    await updateDoc(ref, { completed });
  };

  const handleAddTask = async (label: string) => {
    if (!workspaceId || !appUser || !workspace) return;
    if (appUser.role === "client") return;

    await addDoc(collection(db, "tasks"), {
      workspaceId,
      label,
      completed: false,
      createdBy: appUser.id,
      createdAt: serverTimestamp(),
    });
  };

  const handleProgressChange = async (value: number) => {
    if (!workspaceId || !appUser || !workspace) return;
    if (appUser.role === "client") return;

    const ref = doc(db, "workspaces", workspaceId);
    await updateDoc(ref, { progress: value });

    // Send notification for milestone progress (25%, 50%, 75%, 100%)
    if (appUser.role === "admin" || appUser.role === "staff") {
      const milestones = [25, 50, 75, 100];
      if (milestones.includes(value)) {
        try {
          if (value === 100) {
            await notifyWorkspaceCompleted(workspace.clientId, workspace.name, workspaceId);
          } else {
            await notifyProgressUpdate(workspace.clientId, value, workspace.name, workspaceId);
          }
        } catch (error) {
          console.error("Failed to send progress notification:", error);
        }
      }
    }
  };

  if (loading) return <LoadingScreen message="Loading workspace" />;

  if (!appUser) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-300">
        You are not signed in.
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-300">
        {wsError || "Workspace not found."}
      </div>
    );
  }

  return (
    <AppShell title={workspace.name}>
      <SectionErrorBoundary sectionName="Desktop Workspace">
        <DesktopWorkspaceLayout
          workspace={workspace}
          appUser={appUser}
          tasks={tasks}
          messages={filteredMessages}
          activeTab={activeTab}
          msgError={msgError}
          tasksError={tasksError}
          workspaceId={workspaceId}
          selectedRecipient={selectedRecipient}
          onTabChange={setActiveTab}
          onSendMessage={handleSendMessage}
          onSelectRecipient={setSelectedRecipient}
          onToggleTask={handleToggleTask}
          onAddTask={handleAddTask}
          onProgressChange={handleProgressChange}
        />
      </SectionErrorBoundary>

      <SectionErrorBoundary sectionName="Mobile Workspace">
        <MobileWorkspaceLayout
          workspace={workspace}
          appUser={appUser}
          messages={filteredMessages}
          activeTab={activeTab}
          msgError={msgError}
          workspaceId={workspaceId}
          selectedRecipient={selectedRecipient}
          onTabChange={setActiveTab}
          onSendMessage={handleSendMessage}
          onSelectRecipient={setSelectedRecipient}
          onToggleTaskPanel={() => setShowTaskPanel(!showTaskPanel)}
        />
      </SectionErrorBoundary>

      <SectionErrorBoundary sectionName="Task Panel">
        <TaskPanelPopup
          isOpen={showTaskPanel}
          onClose={() => setShowTaskPanel(false)}
          workspace={workspace}
          tasks={tasks}
          canEdit={appUser.role !== "client"}
          tasksError={tasksError}
          onToggleTask={handleToggleTask}
          onAddTask={handleAddTask}
          onProgressChange={handleProgressChange}
        />
      </SectionErrorBoundary>
    </AppShell>
  );
}