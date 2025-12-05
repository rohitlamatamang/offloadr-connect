// src/components/workspace/ProgressPanel.tsx
"use client";

import type { Workspace } from "@/types/workspace";
import type { Task } from "@/types/task";
import TaskList from "./TaskList";
import { useMemo, useState } from "react";

interface ProgressPanelProps {
  workspace: Workspace;
  tasks: Task[];
  canEdit: boolean;
  onToggleTask: (taskId: string, completed: boolean) => void;
  onAddTask: (label: string) => void;
  onProgressChange: (value: number) => void;
}

export default function ProgressPanel({
  workspace,
  tasks,
  canEdit,
  onToggleTask,
  onAddTask,
  onProgressChange,
}: ProgressPanelProps) {
  const [newTask, setNewTask] = useState("");

  const computedProgress = useMemo(() => {
    if (!tasks.length) return workspace.progress ?? 0;
    const done = tasks.filter((t) => t.completed).length;
    return Math.round((done / tasks.length) * 100);
  }, [tasks, workspace.progress]);

  const progress = Math.min(100, Math.max(0, computedProgress));

  const handleAddTask = () => {
    const trimmed = newTask.trim();
    if (!trimmed) return;
    onAddTask(trimmed);
    setNewTask("");
  };

  return (
    <aside className="mt-4 rounded-2xl border border-gray-200 bg-white p-6 text-sm shadow-lg hover:shadow-xl transition-shadow duration-300 lg:mt-0">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-6 bg-gradient-to-b from-[#FF4D28] to-[#FF6B47] rounded-full"></div>
        <h2 className="text-base font-bold text-[#1A1A1A]">
          Progress
        </h2>
      </div>

      {/* Progress bar + value */}
      <div className="mt-4 bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100">
        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#FF4D28] to-[#FF6B47] transition-all duration-500 ease-out shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
          <span className="font-medium">
            Overall completion:{" "}
            <span className="font-extrabold text-[#FF4D28] text-sm">
              {progress}%
            </span>
          </span>

          {canEdit && (
            <input
              type="number"
              min={0}
              max={100}
              value={workspace.progress}
              className="w-16 rounded-lg border border-gray-300 bg-white px-2 py-1 text-right text-[11px] text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#FF4D28]/30 focus:border-[#FF4D28]"
              onChange={(e) => {
                const val = Number(e.target.value);
                if (!Number.isNaN(val)) {
                  onProgressChange(Math.min(100, Math.max(0, val)));
                }
              }}
            />
          )}
        </div>
      </div>

      {/* Tasks */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">
            Task list
          </h3>
          {!canEdit && (
            <span className="rounded-full bg-gradient-to-r from-gray-100 to-gray-50 px-3 py-1 text-[10px] text-gray-600 font-semibold border border-gray-200">
              Read-only
            </span>
          )}
        </div>

        <TaskList
          tasks={tasks}
          canEdit={canEdit}
          onToggle={onToggleTask}
        />

        {canEdit && (
          <div className="mt-4 flex items-center gap-2">
            <input
              className="flex-1 rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-xs text-[#1A1A1A] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF4D28]/30 focus:border-[#FF4D28] transition-all duration-200 shadow-sm hover:border-gray-300"
              placeholder="Add a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTask();
                }
              }}
            />
            <button
              type="button"
              className="rounded-xl bg-gradient-to-r from-[#FF4D28] to-[#FF6B47] px-4 py-2.5 text-xs font-bold text-white transition-all duration-200 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none shadow-md"
              onClick={handleAddTask}
              disabled={!newTask.trim()}
            >
              Add
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-start gap-2 text-[11px] text-gray-500 bg-gradient-to-br from-gray-50 to-white rounded-xl p-3 border border-gray-100">
        <svg className="w-4 h-4 text-[#FF4D28] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <p className="leading-relaxed">
          Clients can view this progress and task list. Only your team can modify it.
        </p>
      </div>
    </aside>
  );
}
