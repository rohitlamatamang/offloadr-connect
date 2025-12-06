// src/types/workspace.ts
export interface Workspace {
  id: string;
  name: string;
  description?: string;
  progress: number;
  clientId: string;
  assignedStaffIds: string[]; // Staff members assigned to this workspace (admin always has access)
  createdBy: string;
  createdAt: Date | null;
}
