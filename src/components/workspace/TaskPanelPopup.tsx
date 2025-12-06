// src/components/workspace/TaskPanelPopup.tsx
"use client";

import ProgressPanel from "./ProgressPanel";
import { Workspace } from "@/types/workspace";
import { Task } from "@/types/task";

interface TaskPanelPopupProps {
  isOpen: boolean;
  onClose: () => void;
  workspace: Workspace;
  tasks: Task[];
  canEdit: boolean;
  tasksError: string | null;
  onToggleTask: (taskId: string, completed: boolean) => Promise<void>;
  onAddTask: (label: string) => Promise<void>;
  onProgressChange: (value: number) => Promise<void>;
}

export default function TaskPanelPopup({
  isOpen,
  onClose,
  workspace,
  tasks,
  canEdit,
  tasksError,
  onToggleTask,
  onAddTask,
  onProgressChange,
}: TaskPanelPopupProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Popup Panel */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 max-h-[85vh] overflow-hidden animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between px-5 py-4 border-b-2 border-gray-200 bg-gradient-to-r from-white to-gray-50">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-[#FF4D28] to-[#FF6B47] rounded-full"></div>
            <h3 className="text-lg font-extrabold text-[#1A1A1A]">Tasks & Progress</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-200 transition-all duration-200 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-5 w-5 text-gray-700">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto p-5 bg-[#FAFAFA]" style={{ maxHeight: 'calc(85vh - 70px)' }}>
          {tasksError && (
            <div className="mb-2 rounded-lg bg-red-50 border border-red-200 p-2">
              <p className="text-xs text-red-700">{tasksError}</p>
            </div>
          )}
          <ProgressPanel
            workspace={workspace}
            tasks={tasks}
            canEdit={canEdit}
            onToggleTask={onToggleTask}
            onAddTask={onAddTask}
            onProgressChange={onProgressChange}
          />
        </div>
      </div>
    </>
  );
}
