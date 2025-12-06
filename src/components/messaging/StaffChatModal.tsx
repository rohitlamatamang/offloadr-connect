// src/components/messaging/StaffChatModal.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useGlobalMessages } from "@/hooks/useGlobalMessages";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import GlobalStaffSelector from "./GlobalStaffSelector";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { AppUser } from "@/types/user";

interface StaffChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StaffChatModal({ isOpen, onClose }: StaffChatModalProps) {
  const { appUser } = useAuth();
  const { messages, loading: msgLoading, error: msgError } = useGlobalMessages(appUser);
  const [selectedRecipient, setSelectedRecipient] = useState<{ id: string | null; name: string } | null>(null);
  const [dmConversation, setDmConversation] = useState<AppUser | null>(null);

  if (!isOpen || !appUser) return null;

  const handleSendMessage = async (text: string) => {
    if (!appUser) return;

    try {
      await addDoc(collection(db, "messages"), {
        workspaceId: "GLOBAL_STAFF_CHAT",
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

  const handleOpenDM = (recipient: { id: string | null; name: string } | null) => {
    setSelectedRecipient(recipient);
    if (recipient?.id) {
      // Open DM conversation view
      setDmConversation({ 
        uid: recipient.id, 
        name: recipient.name,
        email: "",
        role: "staff",
        id: recipient.id
      } as AppUser);
    } else {
      // Back to group chat
      setDmConversation(null);
    }
  };

  // Filter messages based on current view
  const displayMessages = dmConversation
    ? messages.filter(msg => 
        (msg.senderId === appUser.id && msg.recipientId === dmConversation.uid) ||
        (msg.recipientId === appUser.id && msg.senderId === dmConversation.uid)
      )
    : messages.filter(msg => !msg.recipientId); // Only group messages

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal - Responsive sizing */}
      <div className="fixed inset-x-0 bottom-0 sm:inset-x-auto sm:bottom-4 sm:right-4 z-50 w-full sm:w-[450px] h-[90vh] sm:h-[650px] max-h-[90vh] sm:max-h-[650px] bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl border-2 border-purple-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-3 sm:px-5 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            {dmConversation ? (
              <>
                <button
                  onClick={() => {
                    setDmConversation(null);
                    setSelectedRecipient(null);
                  }}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-base sm:text-lg font-bold text-white">
                    {dmConversation.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-base sm:text-lg font-bold text-white truncate">{dmConversation.name}</h2>
                  <p className="text-[10px] sm:text-xs text-purple-100">Direct Message</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-base sm:text-lg font-bold text-white">Staff Chat</h2>
                  <p className="text-[10px] sm:text-xs text-purple-100">Connect with your team</p>
                </div>
              </>
            )}
          </div>
          
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors flex-shrink-0 ml-2"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
          {msgError && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-3 py-2 rounded-lg mb-3 text-xs sm:text-sm">
              {msgError}
            </div>
          )}
          
          {displayMessages.length === 0 ? (
            <div className="h-full flex items-center justify-center px-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium text-sm">No messages yet</p>
                <p className="text-xs text-gray-400 mt-1">
                  {dmConversation ? "Start a conversation!" : "Send a message to the team!"}
                </p>
              </div>
            </div>
          ) : (
            <MessageList 
              messages={displayMessages} 
              currentUserId={appUser.id}
              currentUserRole={appUser.role}
            />
          )}
        </div>

        {/* Input Area */}
        <div className="border-t-2 border-purple-100 bg-white p-2 sm:p-3 pb-safe">
          {!dmConversation && (
            <div className="mb-2">
              <GlobalStaffSelector
                selectedRecipient={selectedRecipient}
                onSelectRecipient={handleOpenDM}
                currentUserId={appUser.id}
              />
            </div>
          )}
          
          <ChatInput onSend={handleSendMessage} />
        </div>
      </div>
    </>
  );
}
