// src/components/workspace/ChatSection.tsx
"use client";

import MessageList from "@/components/messaging/MessageList";
import ChatInput from "@/components/messaging/ChatInput";
import ChatTabs, { ChatTab } from "@/components/messaging/ChatTabs";
import StaffMessageSelector from "@/components/messaging/StaffMessageSelector";
import { Message } from "@/types/message";
import { AppUser } from "@/types/user";
import { Workspace } from "@/types/workspace";

interface ChatSectionProps {
  messages: Message[];
  activeTab: ChatTab;
  isClient: boolean;
  msgError: string | null;
  workspace: Workspace | null;
  workspaceId: string | null;
  appUser: AppUser | null;
  selectedRecipient: { id: string | null; name: string } | null;
  onTabChange: (tab: ChatTab) => void;
  onSendMessage: (text: string) => Promise<void>;
  onSelectRecipient: (recipient: { id: string | null; name: string } | null) => void;
}

export default function ChatSection({
  messages,
  activeTab,
  isClient,
  msgError,
  workspace,
  workspaceId,
  appUser,
  selectedRecipient,
  onTabChange,
  onSendMessage,
  onSelectRecipient,
}: ChatSectionProps) {
  return (
    <section className="flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm flex-1" style={{ height: '70vh' }}>
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 bg-[#FAFAFA] flex-shrink-0">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#FF4D28] font-semibold">
            Conversation
          </p>
        </div>
        <ChatTabs
          activeTab={isClient ? "client" : activeTab}
          onChange={(tab) => !isClient && onTabChange(tab)}
          appUser={appUser}
        />
      </div>

      {msgError && (
        <div className="px-4 py-3 bg-red-50 border-b border-red-200 flex-shrink-0">
          <p className="text-xs text-red-700">{msgError}</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto min-h-0">
        <MessageList messages={messages} />
      </div>
      <div className="flex-shrink-0 border-t border-gray-200">
        {/* Staff Message Selector - Only show in Team tab */}
        {activeTab === "team" && !isClient && workspace && (
          <div className="px-4 pt-3 pb-2 border-b border-gray-200 bg-gray-50">
            <StaffMessageSelector
              workspaceStaffIds={workspace.assignedStaffIds}
              selectedRecipient={selectedRecipient}
              onSelectRecipient={onSelectRecipient}
              currentUserId={appUser?.id || ""}
            />
          </div>
        )}
        <ChatInput
          onSend={onSendMessage}
          disabled={!workspaceId}
        />
      </div>
    </section>
  );
}
