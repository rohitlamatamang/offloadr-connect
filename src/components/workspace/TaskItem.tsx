// src/components/workspace/TaskItem.tsx
"use client";

import { memo } from "react";
import type { Task } from "@/types/task";

interface TaskItemProps {
  task: Task;
  canEdit: boolean;
  onToggle: (taskId: string, completed: boolean) => void;
}

function TaskItem({ task, canEdit, onToggle }: TaskItemProps) {
  return (
    <label className="group flex cursor-pointer items-start gap-3 rounded-xl px-4 py-3 text-xs text-[#1A1A1A] hover:bg-gradient-to-r hover:from-gray-50 hover:to-white border-2 border-transparent hover:border-gray-200 transition-all duration-200 hover:shadow-sm">
      <input
        type="checkbox"
        className="mt-0.5 h-4 w-4 rounded-md border-2 border-gray-300 text-[#FF4D28] focus:ring-2 focus:ring-[#FF4D28]/40 focus:ring-offset-0 disabled:opacity-50 cursor-pointer transition-all duration-200 checked:scale-110"
        checked={task.completed}
        disabled={!canEdit}
        onChange={(e) => onToggle(task.id, e.target.checked)}
      />
      <span
        className={task.completed ? "line-through text-gray-400 font-medium" : "text-gray-700 font-medium group-hover:text-[#1A1A1A]"}
      >
        {task.label}
      </span>
    </label>
  );
}

export default memo(TaskItem);
