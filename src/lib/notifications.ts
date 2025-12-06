// src/lib/notifications.ts
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import type { NotificationType } from "@/types/notification";

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  workspaceId?: string;
  taskId?: string;
}

export async function createNotification(params: CreateNotificationParams): Promise<void> {
  try {
    const notificationData: Record<string, unknown> = {
      userId: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      read: false,
      createdAt: serverTimestamp(),
    };

    // Only add optional fields if they exist
    if (params.workspaceId) {
      notificationData.workspaceId = params.workspaceId;
    }
    if (params.taskId) {
      notificationData.taskId = params.taskId;
    }

    await addDoc(collection(db, "notifications"), notificationData);
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
}

// Helper functions for common notifications
export async function notifyTaskCompleted(
  userId: string,
  taskLabel: string,
  workspaceId: string,
  taskId: string
): Promise<void> {
  await createNotification({
    userId,
    type: "task_completed",
    title: "Task Completed",
    message: `"${taskLabel}" has been marked as complete`,
    workspaceId,
    taskId,
  });
}

export async function notifyTaskAssigned(
  userId: string,
  taskLabel: string,
  workspaceId: string,
  taskId: string
): Promise<void> {
  await createNotification({
    userId,
    type: "task_assigned",
    title: "New Task Assigned",
    message: `"${taskLabel}" has been added to your workspace`,
    workspaceId,
    taskId,
  });
}

export async function notifyProgressUpdate(
  userId: string,
  progress: number,
  workspaceName: string,
  workspaceId: string
): Promise<void> {
  await createNotification({
    userId,
    type: "progress_update",
    title: "Progress Update",
    message: `"${workspaceName}" is now ${progress}% complete`,
    workspaceId,
  });
}

export async function notifyWorkspaceCompleted(
  userId: string,
  workspaceName: string,
  workspaceId: string
): Promise<void> {
  await createNotification({
    userId,
    type: "workspace_completed",
    title: "🎉 Project Completed!",
    message: `"${workspaceName}" has been completed`,
    workspaceId,
  });
}

export async function notifyWorkspaceAssigned(
  userId: string,
  workspaceName: string,
  workspaceId: string
): Promise<void> {
  await createNotification({
    userId,
    type: "workspace_assigned",
    title: "New Workspace Assigned",
    message: `You've been added to "${workspaceName}"`,
    workspaceId,
  });
}

export async function notifyNewMessage(
  userId: string,
  senderName: string,
  workspaceName: string,
  workspaceId: string
): Promise<void> {
  await createNotification({
    userId,
    type: "message",
    title: "New Message",
    message: `${senderName} sent a message in "${workspaceName}"`,
    workspaceId,
  });
}

// Notify multiple users (used for staff assignments)
export async function notifyMultipleUsers(
  userIds: string[],
  type: NotificationType,
  title: string,
  message: string,
  workspaceId?: string
): Promise<void> {
  const promises = userIds.map((userId) =>
    createNotification({
      userId,
      type,
      title,
      message,
      workspaceId,
    })
  );
  
  await Promise.all(promises);
}
