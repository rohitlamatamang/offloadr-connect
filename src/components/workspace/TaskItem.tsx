// src/components/workspace/TaskItem.tsx
"use client";

import type { Task } from "@/types/task";

interface TaskItemProps {
  task: Task;
  canEdit: boolean;
  onToggle: (taskId: string, completed: boolean) => void;
}

export default function TaskItem({ task, canEdit, onToggle }: TaskItemProps) {
  return (
    <label className="flex cursor-pointer items-start gap-2 rounded-xl px-2 py-1.5 text-xs text-slate-200 hover:bg-slate-800/70">
      <input
        type="checkbox"
        className="mt-0.5 h-3.5 w-3.5 rounded border-slate-500 bg-slate-900 text-indigo-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
        checked={task.completed}
        disabled={!canEdit}
        onChange={(e) => onToggle(task.id, e.target.checked)}
      />
      <span
        className={task.completed ? "line-through text-slate-500" : ""}
      >
        {task.label}
      </span>
    </label>
  );
}
