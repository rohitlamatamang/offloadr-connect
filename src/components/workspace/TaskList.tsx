// src/components/workspace/TaskList.tsx
"use client";

import type { Task } from "@/types/task";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  canEdit: boolean;
  onToggle: (taskId: string, completed: boolean) => void;
}

export default function TaskList({ tasks, canEdit, onToggle }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <p className="text-[11px] text-slate-500">
        {canEdit
          ? "No tasks yet. Add a few key steps for this workspace."
          : "Your team hasn&apos;t published a task list yet."}
      </p>
    );
  }

  return (
    <div className="mt-2 space-y-1.5">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          canEdit={canEdit}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
