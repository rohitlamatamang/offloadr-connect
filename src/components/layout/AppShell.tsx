"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobileHeader from "./MobileHeader";
import Footer from "./Footer";
import StaffChatBubble from "@/components/messaging/StaffChatBubble";

export interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  showFooter?: boolean;
}

export default function AppShell({
  children,
  title,
  showFooter = false,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAFAFA]">
      {/* Sidebar - Desktop */}
      <Sidebar variant="desktop" />

      {/* Sidebar - Mobile */}
      <Sidebar
        variant="mobile"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Navbar - Desktop */}
        <Navbar title={title} />

        {/* Mobile Header */}
        <MobileHeader
          title={title || "Dashboard"}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

        {/* Footer */}
        {showFooter && <Footer />}
      </div>

      {/* Floating Staff Chat Bubble */}
      <StaffChatBubble />
    </div>
  );
}
