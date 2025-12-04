// src/app/dashboard/page.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import WorkspaceCard from "@/components/workspace/WorkspaceCard";
import AppShell from "@/components/layout/AppShell";

export default function DashboardPage() {
  const { appUser, loading: authLoading } = useAuth();
  const { workspaces, loading: wsLoading, error } = useWorkspaces(appUser ?? null);

  if (authLoading || wsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-300">
        Loading your workspaces…
      </div>
    );
  }

  if (!appUser) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-300">
        You are not signed in.
      </div>
    );
  }

  return (
    <AppShell title="Dashboard">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-2 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-indigo-300">
              Dashboard
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-50 sm:text-3xl">
              Welcome, {appUser.name || appUser.email}
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              {appUser.role === "client"
                ? "Here's the workspace your team is working on for you."
                : "Here are the workspaces you're collaborating on."}
            </p>
          </div>

          {/* Later: add "Create workspace" button for admin/staff only */}
        </header>

        {error && (
          <p className="mb-4 text-sm text-rose-400">
            {error}
          </p>
        )}

        {workspaces.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-6 text-center text-sm text-slate-400">
            {appUser.role === "client" ? (
              <>
                There are no workspaces assigned to you yet. Once your team sets
                up a project, it will appear here.
              </>
            ) : (
              <>
                No workspaces found. Create a workspace to start collaborating
                with your team and clients.
              </>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {workspaces.map((ws) => (
              <WorkspaceCard key={ws.id} workspace={ws} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
