// src/types/task.ts
export interface Task {
  id: string;
  workspaceId: string;
  label: string;
  completed: boolean;
  createdAt: Date | null;
  createdBy: string;
}
