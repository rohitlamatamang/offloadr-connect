// src/components/workspace/MobileWorkspaceLayout.tsx
"use client";

import { useRouter } from "next/navigation";
import MessageList from "@/components/messaging/MessageList";
import ChatInput from "@/components/messaging/ChatInput";
import ChatTabs, { ChatTab } from "@/components/messaging/ChatTabs";
import StaffMessageSelector from "@/components/messaging/StaffMessageSelector";
import Button from "@/components/ui/Button";
import { Workspace } from "@/types/workspace";
import { Message } from "@/types/message";
import { AppUser } from "@/types/user";

interface MobileWorkspaceLayoutProps {
  workspace: Workspace;
  appUser: AppUser;
  messages: Message[];
  activeTab: ChatTab;
  msgError: string | null;
  workspaceId: string | null;
  selectedRecipient: { id: string | null; name: string } | null;
  onTabChange: (tab: ChatTab) => void;
  onSendMessage: (text: string) => Promise<void>;
  onSelectRecipient: (recipient: { id: string | null; name: string } | null) => void;
  onToggleTaskPanel: () => void;
}

export default function MobileWorkspaceLayout({
  workspace,
  appUser,
  messages,
  activeTab,
  msgError,
  workspaceId,
  selectedRecipient,
  onTabChange,
  onSendMessage,
  onSelectRecipient,
  onToggleTaskPanel,
}: MobileWorkspaceLayoutProps) {
  const router = useRouter();
  const isClient = appUser.role === "client";

  return (
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
          onClick={onToggleTaskPanel}
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
            onChange={(tab) => !isClient && onTabChange(tab)}
            appUser={appUser}
          />
        </div>

        {msgError && (
          <div className="px-4 py-3 bg-red-50 border-b-2 border-red-200 flex-shrink-0 shadow-sm">
            <p className="text-xs text-red-700 font-semibold">{msgError}</p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto min-h-0">
          <MessageList messages={messages} />
        </div>
        <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-white">
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
    </div>
  );
}
