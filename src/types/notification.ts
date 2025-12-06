// src/types/notification.ts
export type NotificationType = 
  | "task_completed"
  | "task_assigned"
  | "message"
  | "progress_update"
  | "deadline_reminder"
  | "workspace_completed"
  | "workspace_assigned";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  workspaceId?: string;
  taskId?: string;
  read: boolean;
  createdAt: Date | null;
}
