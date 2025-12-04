// src/app/setup-guide/page.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function SetupGuidePage() {
  const { appUser } = useAuth();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-50">
            🚀 Offloadr Connect Setup Guide
          </h1>
          <p className="mt-2 text-slate-400">
            Follow these steps to set up your test environment with users and workspaces
          </p>
        </div>

        {appUser && (
          <div className="rounded-lg bg-indigo-500/10 border border-indigo-500/30 p-4">
            <h3 className="font-semibold text-indigo-300">✅ You are logged in</h3>
            <div className="mt-2 space-y-1 text-sm text-slate-300">
              <p><strong>Name:</strong> {appUser.name || "Not set"}</p>
              <p><strong>Email:</strong> {appUser.email}</p>
              <p><strong>Role:</strong> {appUser.role}</p>
              <p className="flex items-center gap-2">
                <strong>Your UID:</strong> 
                <code className="rounded bg-slate-800 px-2 py-1 text-xs">{appUser.id}</code>
                <button
                  onClick={() => copyToClipboard(appUser.id)}
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  {copied ? "✓ Copied!" : "Copy"}
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Step 1 */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 font-bold text-white">
              1
            </div>
            <h2 className="text-xl font-semibold text-slate-50">
              Create Test Users in Firebase Authentication
            </h2>
          </div>

          <div className="ml-13 space-y-4 text-slate-300">
            <p>Go to <strong>Firebase Console</strong> → <strong>Authentication</strong> → <strong>Users</strong></p>
            
            <div className="space-y-3">
              <div className="rounded-lg bg-slate-800/50 p-4">
                <h4 className="font-semibold text-slate-200">👨‍💼 Admin User</h4>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• Email: <code className="text-indigo-300">admin@offloadr.com</code></li>
                  <li>• Password: <code className="text-indigo-300">admin123</code></li>
                </ul>
              </div>

              <div className="rounded-lg bg-slate-800/50 p-4">
                <h4 className="font-semibold text-slate-200">👷 Staff User</h4>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• Email: <code className="text-indigo-300">staff@offloadr.com</code></li>
                  <li>• Password: <code className="text-indigo-300">staff123</code></li>
                </ul>
              </div>

              <div className="rounded-lg bg-slate-800/50 p-4">
                <h4 className="font-semibold text-slate-200">👤 Client User</h4>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• Email: <code className="text-indigo-300">client@offloadr.com</code></li>
                  <li>• Password: <code className="text-indigo-300">client123</code></li>
                </ul>
              </div>
            </div>

            <p className="text-sm italic text-slate-500">
              After creating each user, copy their UID (you&apos;ll need it for the next steps)
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 font-bold text-white">
              2
            </div>
            <h2 className="text-xl font-semibold text-slate-50">
              Create User Profiles in Firestore
            </h2>
          </div>

          <div className="ml-13 space-y-4 text-slate-300">
            <p>Go to <strong>Firestore Database</strong> → Collection: <code className="text-indigo-300">users</code></p>
            
            <div className="rounded-lg bg-slate-800/50 p-4">
              <h4 className="font-semibold text-slate-200 mb-3">For each user, create a document:</h4>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-slate-300">Document ID: <span className="text-amber-400">[User&apos;s UID from Authentication]</span></p>
                </div>
                <div className="space-y-1">
                  <p><strong>Admin profile fields:</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• <code>email</code> (string): <code className="text-indigo-300">&quot;admin@offloadr.com&quot;</code></li>
                    <li>• <code>name</code> (string): <code className="text-indigo-300">&quot;Admin User&quot;</code></li>
                    <li>• <code>role</code> (string): <code className="text-indigo-300">&quot;admin&quot;</code></li>
                  </ul>
                </div>
                <div className="space-y-1">
                  <p><strong>Staff profile fields:</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• <code>email</code> (string): <code className="text-indigo-300">&quot;staff@offloadr.com&quot;</code></li>
                    <li>• <code>name</code> (string): <code className="text-indigo-300">&quot;Staff Member&quot;</code></li>
                    <li>• <code>role</code> (string): <code className="text-indigo-300">&quot;staff&quot;</code></li>
                  </ul>
                </div>
                <div className="space-y-1">
                  <p><strong>Client profile fields:</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• <code>email</code> (string): <code className="text-indigo-300">&quot;client@offloadr.com&quot;</code></li>
                    <li>• <code>name</code> (string): <code className="text-indigo-300">&quot;Client User&quot;</code></li>
                    <li>• <code>role</code> (string): <code className="text-indigo-300">&quot;client&quot;</code></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 font-bold text-white">
              3
            </div>
            <h2 className="text-xl font-semibold text-slate-50">
              Create Sample Workspaces in Firestore
            </h2>
          </div>

          <div className="ml-13 space-y-4 text-slate-300">
            <p>Go to <strong>Firestore Database</strong> → Create Collection: <code className="text-indigo-300">workspaces</code></p>
            
            <div className="space-y-3">
              <div className="rounded-lg bg-slate-800/50 p-4">
                <h4 className="font-semibold text-slate-200 mb-2">📦 Workspace 1 - For Client</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Document ID:</strong> Auto-generate</p>
                  <p><strong>Fields:</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• <code>name</code> (string): <code className="text-indigo-300">&quot;Website Redesign&quot;</code></li>
                    <li>• <code>description</code> (string): <code className="text-indigo-300">&quot;Complete website overhaul&quot;</code></li>
                    <li>• <code>progress</code> (number): <code className="text-indigo-300">45</code></li>
                    <li>• <code>clientId</code> (string): <span className="text-amber-400">[Client User&apos;s UID]</span> ⚠️ Important!</li>
                    <li>• <code>createdBy</code> (string): <span className="text-slate-400">[Admin User&apos;s UID]</span></li>
                    <li>• <code>createdAt</code> (timestamp): Server timestamp</li>
                  </ul>
                </div>
              </div>

              <div className="rounded-lg bg-slate-800/50 p-4">
                <h4 className="font-semibold text-slate-200 mb-2">📦 Workspace 2 - Internal Project</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Document ID:</strong> Auto-generate</p>
                  <p><strong>Fields:</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• <code>name</code> (string): <code className="text-indigo-300">&quot;Internal Tools&quot;</code></li>
                    <li>• <code>description</code> (string): <code className="text-indigo-300">&quot;Team productivity tools&quot;</code></li>
                    <li>• <code>progress</code> (number): <code className="text-indigo-300">70</code></li>
                    <li>• <code>clientId</code> (string): <code className="text-indigo-300">&quot;&quot;</code> (empty - internal project)</li>
                    <li>• <code>createdBy</code> (string): <span className="text-slate-400">[Admin User&apos;s UID]</span></li>
                    <li>• <code>createdAt</code> (timestamp): Server timestamp</li>
                  </ul>
                </div>
              </div>

              <div className="rounded-lg bg-slate-800/50 p-4">
                <h4 className="font-semibold text-slate-200 mb-2">📦 Workspace 3 - Another Client Project</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Document ID:</strong> Auto-generate</p>
                  <p><strong>Fields:</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• <code>name</code> (string): <code className="text-indigo-300">&quot;Mobile App Development&quot;</code></li>
                    <li>• <code>description</code> (string): <code className="text-indigo-300">&quot;iOS and Android app&quot;</code></li>
                    <li>• <code>progress</code> (number): <code className="text-indigo-300">30</code></li>
                    <li>• <code>clientId</code> (string): <span className="text-amber-400">[Client User&apos;s UID]</span> ⚠️ Same as Workspace 1</li>
                    <li>• <code>createdBy</code> (string): <span className="text-slate-400">[Staff User&apos;s UID]</span></li>
                    <li>• <code>createdAt</code> (timestamp): Server timestamp</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-4">
              <p className="text-sm text-amber-300">
                <strong>⚠️ Key Point:</strong> The <code>clientId</code> field determines which client can see the workspace. 
                Make sure to use the exact UID of your client user from Firebase Authentication!
              </p>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 font-bold text-white">
              4
            </div>
            <h2 className="text-xl font-semibold text-slate-50">
              Test the Setup
            </h2>
          </div>

          <div className="ml-13 space-y-4 text-slate-300">
            <div className="space-y-3">
              <div className="rounded-lg bg-slate-800/50 p-4">
                <h4 className="font-semibold text-slate-200">✅ Login as Admin</h4>
                <p className="mt-2 text-sm">Should see: <strong className="text-green-400">All 3 workspaces</strong></p>
              </div>

              <div className="rounded-lg bg-slate-800/50 p-4">
                <h4 className="font-semibold text-slate-200">✅ Login as Staff</h4>
                <p className="mt-2 text-sm">Should see: <strong className="text-green-400">All 3 workspaces</strong></p>
              </div>

              <div className="rounded-lg bg-slate-800/50 p-4">
                <h4 className="font-semibold text-slate-200">✅ Login as Client</h4>
                <p className="mt-2 text-sm">Should see: <strong className="text-green-400">Only 2 workspaces</strong> (Website Redesign & Mobile App)</p>
                <p className="mt-1 text-xs text-slate-500">Should NOT see &quot;Internal Tools&quot; because it has empty clientId</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-6">
          <h3 className="mb-3 font-semibold text-slate-200">🔗 Quick Links</h3>
          <div className="space-y-2 text-sm">
            <a 
              href="https://console.firebase.google.com/project/offloadr-connect/authentication/users"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-indigo-400 hover:text-indigo-300"
            >
              → Firebase Authentication
            </a>
            <a 
              href="https://console.firebase.google.com/project/offloadr-connect/firestore/databases/-default-/data"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-indigo-400 hover:text-indigo-300"
            >
              → Firestore Database
            </a>
            <a 
              href="/dashboard"
              className="block text-indigo-400 hover:text-indigo-300"
            >
              → Go to Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
