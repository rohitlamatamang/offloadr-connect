// User types
export type UserRole = "admin" | "staff" | "client";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  color?: string;
}

// Workspace types
export interface Workspace {
  id: string;
  name: string;
  description: string;
  progress: number; // 0-100
  members: User[];
  createdAt: Date;
  updatedAt: Date;
}

// Message types
export type MessageType = "staff" | "client";

export interface Message {
  id: string;
  author: User;
  text: string;
  timestamp: Date;
  type: MessageType;
}

// Task types
export interface Task {
  id: string;
  label: string;
  completed: boolean;
  assignee?: User;
}
