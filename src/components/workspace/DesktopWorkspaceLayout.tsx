// src/components/workspace/DesktopWorkspaceLayout.tsx
"use client";

import WorkspaceHeader from "./WorkspaceHeader";
import ProgressPanel from "./ProgressPanel";
import ChatSection from "./ChatSection";
import { Workspace } from "@/types/workspace";
import { Task } from "@/types/task";
import { Message } from "@/types/message";
import { AppUser } from "@/types/user";
import { ChatTab } from "@/components/messaging/ChatTabs";

interface DesktopWorkspaceLayoutProps {
  workspace: Workspace;
  appUser: AppUser;
  tasks: Task[];
  messages: Message[];
  activeTab: ChatTab;
  msgError: string | null;
  tasksError: string | null;
  workspaceId: string | null;
  selectedRecipient: { id: string | null; name: string } | null;
  onTabChange: (tab: ChatTab) => void;
  onSendMessage: (text: string) => Promise<void>;
  onSelectRecipient: (recipient: { id: string | null; name: string } | null) => void;
  onToggleTask: (taskId: string, completed: boolean) => Promise<void>;
  onAddTask: (label: string) => Promise<void>;
  onProgressChange: (value: number) => Promise<void>;
}

export default function DesktopWorkspaceLayout({
  workspace,
  appUser,
  tasks,
  messages,
  activeTab,
  msgError,
  tasksError,
  workspaceId,
  selectedRecipient,
  onTabChange,
  onSendMessage,
  onSelectRecipient,
  onToggleTask,
  onAddTask,
  onProgressChange,
}: DesktopWorkspaceLayoutProps) {
  const isClient = appUser.role === "client";

  return (
    <div className="hidden lg:block mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex-shrink-0">
        <WorkspaceHeader workspace={workspace} currentUser={appUser} />
      </div>

      <div className="mt-4 flex flex-row gap-4">
        <ChatSection
          messages={messages}
          activeTab={activeTab}
          isClient={isClient}
          msgError={msgError}
          workspace={workspace}
          workspaceId={workspaceId}
          appUser={appUser}
          selectedRecipient={selectedRecipient}
          onTabChange={onTabChange}
          onSendMessage={onSendMessage}
          onSelectRecipient={onSelectRecipient}
        />

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
            onToggleTask={onToggleTask}
            onAddTask={onAddTask}
            onProgressChange={onProgressChange}
          />
        </div>
      </div>
    </div>
  );
}
