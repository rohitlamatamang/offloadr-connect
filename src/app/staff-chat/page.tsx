// src/app/staff-chat/page.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useGlobalMessages } from "@/hooks/useGlobalMessages";
import AppShell from "@/components/layout/AppShell";
import MessageList from "@/components/messaging/MessageList";
import ChatInput from "@/components/messaging/ChatInput";
import GlobalStaffSelector from "@/components/messaging/GlobalStaffSelector";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function StaffChatPage() {
  const router = useRouter();
  const { appUser, loading: authLoading } = useAuth();
  const { messages, loading: msgLoading, error: msgError } = useGlobalMessages(appUser);
  const [selectedRecipient, setSelectedRecipient] = useState<{ id: string | null; name: string } | null>(null);

  const loading = authLoading || msgLoading;

  // Redirect if not staff or admin
  if (!authLoading && appUser && appUser.role === "client") {
    router.push("/dashboard");
    return null;
  }

  const handleSendMessage = async (text: string) => {
    if (!appUser) return;

    try {
      await addDoc(collection(db, "messages"), {
        workspaceId: "GLOBAL_STAFF_CHAT", // Special ID for global staff messages
        senderId: appUser.id,
        senderName: appUser.name,
        senderRole: appUser.staffRoleLabel || null, // Add staff role for display
        type: "staff",
        text,
        recipientId: selectedRecipient?.id || null,
        recipientName: selectedRecipient?.name || null,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message.");
    }
  };

  if (loading) {
    return (
      <AppShell>
        <LoadingScreen />
      </AppShell>
    );
  }

  if (!appUser) {
    return (
      <AppShell>
        <div className="p-6">Please log in to access staff chat.</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="h-screen flex flex-col bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        {/* Header */}
        <div className="bg-white border-b-2 border-purple-200 shadow-md">
          <div className="max-w-5xl mx-auto px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Global Staff Chat</h1>
                  <p className="text-sm text-gray-600">Connect with staff members across all workspaces</p>
                </div>
              </div>
              
              <button
                onClick={() => router.push("/dashboard")}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 max-w-5xl w-full mx-auto px-6 py-6 flex flex-col overflow-hidden">
          <div className="bg-white rounded-2xl shadow-xl border-2 border-purple-200 flex flex-col h-full overflow-hidden">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6">
              {msgError && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {msgError}
                </div>
              )}
              
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-500 font-medium">No messages yet</p>
                    <p className="text-sm text-gray-400 mt-1">Start a conversation with your team!</p>
                  </div>
                </div>
              ) : (
                <MessageList 
                  messages={messages} 
                  currentUserId={appUser.id}
                  currentUserRole={appUser.role}
                />
              )}
            </div>

            {/* Chat Input Area */}
            <div className="border-t-2 border-purple-100 bg-purple-50 p-4">
              <div className="flex items-center gap-3 mb-3">
                <GlobalStaffSelector
                  selectedRecipient={selectedRecipient}
                  onSelectRecipient={setSelectedRecipient}
                  currentUserId={appUser.id}
                />
                
                {selectedRecipient && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-lg text-xs text-gray-600 border border-purple-200">
                    <svg className="w-3 h-3 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Private message
                  </div>
                )}
              </div>
              
              <ChatInput onSend={handleSendMessage} />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
