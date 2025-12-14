"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Logo from "./Logo";

export interface SidebarProps {
  variant?: "desktop" | "mobile";
  open?: boolean;
  onClose?: () => void;
}

const getNavItems = (userRole?: string) => {
  const items = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      ),
    },
  ];

  if (userRole === "admin") {
    items.push({
      href: "/admin",
      label: "Admin Panel",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    });
  }

  return items;
};

export default function Sidebar({
  variant = "desktop",
  open = true,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();
  const { appUser } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const navItems = getNavItems(appUser?.role);

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo section */}
      <div className="border-b border-gray-200 bg-white p-6">
        <Logo size="lg" href="/dashboard" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => {
              if (variant === "mobile" && onClose) {
                onClose();
              }
            }}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
              isActive(item.href)
                ? "bg-gradient-to-r from-[#FF4D28] to-[#FF6B47] text-white shadow-md"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* User info */}
      <div className="border-t border-gray-200 p-4">
        <Link 
          href="/profile"
          onClick={() => {
            if (variant === "mobile" && onClose) {
              onClose();
            }
          }}
          className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 p-3 transition-all hover:bg-gray-100 hover:border-[#FF4D28]/30 hover:shadow-md group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#FF4D28] to-[#FF6B47] text-white font-bold text-sm">
            {(appUser?.name || appUser?.email || "U").charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="truncate text-sm font-semibold text-[#1A1A1A]">
              {appUser?.name || appUser?.email}
            </div>
            <div className="text-xs font-medium text-gray-500">
              <span className="capitalize">{appUser?.role}</span>
              {appUser?.staffRoleLabel && (
                <span className="text-[#FF4D28]"> • {appUser.staffRoleLabel}</span>
              )}
            </div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5 text-gray-400 group-hover:text-[#FF4D28] transition-colors">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </Link>
      </div>
    </div>
  );

  if (variant === "mobile") {
    return (
      <>
        {/* Overlay */}
        {open && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
        )}

        {/* Mobile sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out lg:hidden ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {sidebarContent}
        </aside>
      </>
    );
  }

  // Desktop sidebar
  return (
    <aside className="hidden w-72 border-r border-gray-200 bg-white lg:block">
      {sidebarContent}
    </aside>
  );
}
