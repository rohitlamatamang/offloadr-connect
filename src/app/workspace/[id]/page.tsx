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
import AppShell from "@/components/layout/AppShell";
import Button from "@/components/ui/Button";
import { addDoc, collection, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useMemo, useState } from "react";

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

    await addDoc(collection(db, "messages"), {
      workspaceId,
      senderId: appUser.id,
      senderName: appUser.name || appUser.email,
      type: msgType,
      text,
      createdAt: serverTimestamp(),
    });
  };

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    if (!workspaceId || !appUser) return;
    if (appUser.role === "client") return; // clients can't edit

    const ref = doc(db, "tasks", taskId);
    await updateDoc(ref, { completed });
  };

  const handleAddTask = async (label: string) => {
    if (!workspaceId || !appUser) return;
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
    if (!workspaceId || !appUser) return;
    if (appUser.role === "client") return;

    const ref = doc(db, "workspaces", workspaceId);
    await updateDoc(ref, { progress: value });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-300">
        Loading workspace…
      </div>
    );
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
      <div className="mx-auto flex max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard")}
          className="mb-4 w-fit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          <span>Back to Dashboard</span>
        </Button>

        <WorkspaceHeader workspace={workspace} />

        <div className="mt-4 flex flex-col gap-4 lg:flex-row">
          {/* Chat area */}
          <section className="flex min-h-[60vh] flex-1 flex-col rounded-2xl border border-slate-800 bg-slate-900/70">
            <div className="flex items-center justify-between border-b border-slate-800 px-3 py-2">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-indigo-300">
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
              <div className="px-3 py-2 text-xs text-rose-400">
                {msgError}
              </div>
            )}

            <MessageList messages={filteredMessages} />
            <ChatInput
              onSend={handleSendMessage}
              disabled={!workspaceId}
            />
          </section>

          {/* Progress + tasks */}
          <div className="w-full lg:w-80">
            {tasksError && (
              <p className="mb-2 text-xs text-rose-400">
                {tasksError}
              </p>
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
    </AppShell>
  );
}
