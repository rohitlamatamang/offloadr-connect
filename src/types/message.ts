// src/types/message.ts
export type MessageType = "staff" | "client" | "general";

export interface Message {
  id: string;
  workspaceId: string;
  senderId: string;
  senderName: string;
  type: MessageType;
  text: string;
  createdAt: Date | null;
}
