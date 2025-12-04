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
    <aside className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-200 lg:mt-0">
      <h2 className="text-sm font-semibold text-slate-50">
        Progress
      </h2>

      {/* Progress bar + value */}
      <div className="mt-2">
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
          <span>
            Overall completion:{" "}
            <span className="font-semibold text-slate-100">
              {progress}%
            </span>
          </span>

          {canEdit && (
            <input
              type="number"
              min={0}
              max={100}
              value={workspace.progress}
              className="w-16 rounded-lg border border-slate-700 bg-slate-950/80 px-2 py-1 text-right text-[11px] text-slate-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
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
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-300">
            Task list
          </h3>
          {!canEdit && (
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
              Read-only for clients
            </span>
          )}
        </div>

        <TaskList
          tasks={tasks}
          canEdit={canEdit}
          onToggle={onToggleTask}
        />

        {canEdit && (
          <div className="mt-3 flex items-center gap-2">
            <input
              className="flex-1 rounded-lg border border-slate-700 bg-slate-950/80 px-2 py-1 text-xs text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
              placeholder="Add a task (e.g. Design homepage)"
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
              className="rounded-lg bg-indigo-500 px-3 py-1 text-[11px] font-medium text-slate-50 transition hover:bg-indigo-400 disabled:opacity-50"
              onClick={handleAddTask}
              disabled={!newTask.trim()}
            >
              Add
            </button>
          </div>
        )}
      </div>

      <p className="mt-3 text-[11px] text-slate-500">
        Clients see this progress and task list. Only your team can modify it.
      </p>
    </aside>
  );
}
