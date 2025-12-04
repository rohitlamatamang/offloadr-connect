// src/types/workspace.ts
export interface Workspace {
  id: string;
  name: string;
  description?: string;
  progress: number;
  clientId: string;
  createdBy: string;
  createdAt: Date | null;
}
