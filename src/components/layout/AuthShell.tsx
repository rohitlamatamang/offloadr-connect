"use client";

import Logo from "./Logo";

interface AuthShellProps {
  children: React.ReactNode;
}

export default function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="relative flex flex-1 items-center justify-center px-6 py-8 lg:px-12">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-500/20 via-slate-900 to-slate-950" />
        <div className="absolute inset-x-12 top-10 -z-10 h-64 rounded-3xl bg-indigo-500/10 blur-3xl" />

        <div className="mx-auto flex w-full max-w-md flex-col gap-8">
          <Logo />

          <div className="space-y-4">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Real-time collaboration,
              <span className="block text-indigo-300">without the noise.</span>
            </h1>
            <p className="text-sm text-slate-300">
              CollabType lets teams type together in the same workspace with
              character-level updates and presence indicators.
            </p>
          </div>

          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              See every keystroke live for 20 collaborators.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-sky-400" />
              Minimal, fast, and distraction-free.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-indigo-400" />
              Built for mobile and desktop.
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-slate-950/80 px-6 py-8 lg:px-10">
        <div className="w-full max-w-md">
          {children}
          <footer className="mt-8 text-center text-xs text-slate-500">
            By continuing, you agree to the Terms and Privacy Policy.
          </footer>
        </div>
      </div>
    </div>
  );
}
