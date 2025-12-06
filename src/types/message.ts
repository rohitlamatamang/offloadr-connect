// src/types/message.ts
export type MessageType = "staff" | "client" | "general";

export interface Message {
  id: string;
  workspaceId: string;
  senderId: string;
  senderName: string;
  senderRole?: string; // Staff role label for display (e.g., "Graphic Designer")
  type: MessageType;
  text: string;
  recipientId?: string; // For direct messages between staff (null = group message to all staff)
  recipientName?: string; // Name of recipient for display
  createdAt: Date | null;
}
