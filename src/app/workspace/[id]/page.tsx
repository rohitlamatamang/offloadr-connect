// src/app/workspace/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useMessages } from "@/hooks/useMessages";
import { useTasks } from "@/hooks/useTasks";
import WorkspaceHeader from "@/components/workspace/WorkspaceHeader";
import ProgressPanel from "@/components/workspace/ProgressPanel";
import MessageList from "@/components/messaging/MessageList";
import ChatInput from "@/components/messaging/ChatInput";
import ChatTabs, { ChatTab } from "@/components/messaging/ChatTabs";
import StaffMessageSelector from "@/components/messaging/StaffMessageSelector";
import AppShell from "@/components/layout/AppShell";
import Button from "@/components/ui/Button";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { addDoc, collection, serverTimestamp, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useMemo, useState } from "react";
import { notifyTaskCompleted, notifyTaskAssigned, notifyProgressUpdate, notifyWorkspaceCompleted } from "@/lib/notifications";

export default function WorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const idParam = params?.id;
  const workspaceId =
    typeof idParam === "string" ? idParam : Array.isArray(idParam) ? idParam[0] : null;

  const { appUser, loading: authLoading } = useAuth();
  const { workspace, loading: wsLoading, error: wsError } = useWorkspace(workspaceId);
  const {
    messages,
    loading: msgLoading,
    error: msgError,
  } = useMessages(workspaceId, appUser ?? null);
  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
  } = useTasks(workspaceId);

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

  if (loading) {
    return <LoadingScreen message="Loading workspace" />;
  }

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
  const isClient = appUser.role === "client";

  return (
    <AppShell title={workspace.name}>
      {/* Desktop Layout */}
      <div className="hidden lg:block mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex-shrink-0">
          <WorkspaceHeader workspace={workspace} currentUser={appUser} />
        </div>

        <div className="mt-4 flex flex-row gap-4">
          {/* Chat area */}
          <section className="flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm flex-1" style={{ height: '70vh' }}>
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 bg-[#FAFAFA] flex-shrink-0">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#FF4D28] font-semibold">
                  Conversation
                </p>
              </div>
              <ChatTabs
                activeTab={isClient ? "client" : activeTab}
                onChange={(tab) => !isClient && setActiveTab(tab)}
                appUser={appUser}
              />
            </div>

            {msgError && (
              <div className="px-4 py-3 bg-red-50 border-b border-red-200 flex-shrink-0">
                <p className="text-xs text-red-700">{msgError}</p>
              </div>
            )}

            <div className="flex-1 overflow-y-auto min-h-0">
              <MessageList messages={filteredMessages} />
            </div>
            <div className="flex-shrink-0 border-t border-gray-200">
              {/* Staff Message Selector - Only show in Team tab */}
              {activeTab === "team" && !isClient && workspace && (
                <div className="px-4 pt-3 pb-2 border-b border-gray-200 bg-gray-50">
                  <StaffMessageSelector
                    workspaceStaffIds={workspace.assignedStaffIds}
                    selectedRecipient={selectedRecipient}
                    onSelectRecipient={setSelectedRecipient}
                    currentUserId={appUser?.id || ""}
                  />
                </div>
              )}
              <ChatInput
                onSend={handleSendMessage}
                disabled={!workspaceId}
              />
            </div>
          </section>

          {/* Progress + tasks */}
          <div className="w-80 flex-shrink-0">
            {tasksError && (
              <div className="mb-2 rounded-lg bg-red-50 border border-red-200 p-2">
                <p className="text-xs text-red-700">{tasksError}</p>
              </div>
            )}
            <ProgressPanel
              workspace={workspace}
              tasks={tasks}
              canEdit={!isClient}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              onProgressChange={handleProgressChange}
            />
          </div>
        </div>
      </div>

      {/* Mobile Layout - Full Screen Chat */}
      <div className="lg:hidden flex flex-col h-screen">
        {/* Mobile Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between bg-gradient-to-r from-white to-gray-50 border-b-2 border-gray-200 px-4 py-4 shadow-sm">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-5 w-5 text-gray-700">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Button>
          <div className="flex-1 text-center">
            <p className="text-base font-extrabold text-[#1A1A1A] tracking-tight">{workspace.name}</p>
          </div>
          <button
            onClick={() => setShowTaskPanel(!showTaskPanel)}
            className="p-2.5 rounded-xl bg-gradient-to-br from-[#FF4D28] to-[#FF6B47] text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
          </button>
        </div>

        {/* Chat Section */}
        <section className="flex flex-col flex-1 bg-gradient-to-b from-white to-gray-50 min-h-0">
          <div className="sticky top-[72px] z-10 flex items-center justify-center border-b-2 border-gray-200 px-4 py-3 bg-white shadow-sm">
            <ChatTabs
              activeTab={isClient ? "client" : activeTab}
              onChange={(tab) => !isClient && setActiveTab(tab)}
              appUser={appUser}
            />
          </div>

          {msgError && (
            <div className="px-4 py-3 bg-red-50 border-b-2 border-red-200 flex-shrink-0 shadow-sm">
              <p className="text-xs text-red-700 font-semibold">{msgError}</p>
            </div>
          )}

          <div className="flex-1 overflow-y-auto min-h-0">
            <MessageList messages={filteredMessages} />
          </div>
          <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-white">
            {/* Staff Message Selector - Only show in Team tab */}
            {activeTab === "team" && !isClient && workspace && (
              <div className="px-4 pt-3 pb-2 border-b border-gray-200 bg-gray-50">
                <StaffMessageSelector
                  workspaceStaffIds={workspace.assignedStaffIds}
                  selectedRecipient={selectedRecipient}
                  onSelectRecipient={setSelectedRecipient}
                  currentUserId={appUser?.id || ""}
                />
              </div>
            )}
            <ChatInput
              onSend={handleSendMessage}
              disabled={!workspaceId}
            />
          </div>
        </section>

        {/* Task Panel Popup */}
        {showTaskPanel && (
          <>
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowTaskPanel(false)}
            />
            
            {/* Popup Panel */}
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 max-h-[85vh] overflow-hidden animate-in slide-in-from-bottom duration-300">
              <div className="flex items-center justify-between px-5 py-4 border-b-2 border-gray-200 bg-gradient-to-r from-white to-gray-50">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-[#FF4D28] to-[#FF6B47] rounded-full"></div>
                  <h3 className="text-lg font-extrabold text-[#1A1A1A]">Tasks & Progress</h3>
                </div>
                <button
                  onClick={() => setShowTaskPanel(false)}
                  className="p-2 rounded-xl hover:bg-gray-200 transition-all duration-200 active:scale-95"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-5 w-5 text-gray-700">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="overflow-y-auto p-5 bg-[#FAFAFA]" style={{ maxHeight: 'calc(85vh - 70px)' }}>
                {tasksError && (
                  <div className="mb-2 rounded-lg bg-red-50 border border-red-200 p-2">
                    <p className="text-xs text-red-700">{tasksError}</p>
                  </div>
                )}
                <ProgressPanel
                  workspace={workspace}
                  tasks={tasks}
                  canEdit={!isClient}
                  onToggleTask={handleToggleTask}
                  onAddTask={handleAddTask}
                  onProgressChange={handleProgressChange}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
