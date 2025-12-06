"use client";

import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Avatar from "@/components/ui/Avatar";
import NotificationBell from "@/components/notifications/NotificationBell";

export interface NavbarProps {
  title?: string;
}

export default function Navbar({ title }: NavbarProps) {
  const { appUser } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return (
    <header className="sticky top-0 z-30 hidden border-b border-gray-200 bg-white/95 backdrop-blur-sm lg:block shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-[#1A1A1A]">
            {title || "Dashboard"}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <NotificationBell />

          {/* User menu */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
              <Avatar name={appUser?.name || appUser?.email || "User"} size="sm" />
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium text-[#1A1A1A]">
                  {appUser?.name || appUser?.email}
                </span>
                <span className="text-xs text-[#FF4D28]">{appUser?.role}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
              title="Sign out"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
