// src/app/notifications/page.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import LoadingScreen from "@/components/ui/LoadingScreen";
import Button from "@/components/ui/Button";
import type { Notification } from "@/types/notification";

export default function NotificationsPage() {
  const { appUser, loading: authLoading } = useAuth();
  const { notifications, unreadCount, loading } = useNotifications(appUser);
  const router = useRouter();

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const notifRef = doc(db, "notifications", notificationId);
      await updateDoc(notifRef, { read: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter((n) => !n.read);
    const promises = unreadNotifications.map((n) => handleMarkAsRead(n.id));
    await Promise.all(promises);
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await handleMarkAsRead(notification.id);
    }
    
    if (notification.workspaceId) {
      router.push(`/workspace/${notification.workspaceId}`);
    }
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "task_completed":
        return "✅";
      case "task_assigned":
        return "📝";
      case "message":
        return "💬";
      case "progress_update":
        return "📊";
      case "deadline_reminder":
        return "📅";
      case "workspace_completed":
        return "🎉";
      case "workspace_assigned":
        return "📂";
      default:
        return "🔔";
    }
  };

  const getTimeAgo = (date: Date | null) => {
    if (!date) return "Just now";
    
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  if (authLoading || loading) {
    return <LoadingScreen message="Loading notifications" />;
  }

  if (!appUser) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-600">
        Please sign in to view notifications.
      </div>
    );
  }

  return (
    <AppShell title="Notifications">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-8 bg-gradient-to-b from-[#FF4D28] to-[#FF6B47] rounded-full"></div>
              <h1 className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">Notifications</h1>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="secondary"
                onClick={handleMarkAllAsRead}
                className="text-sm"
              >
                Mark all as read
              </Button>
            )}
          </div>
          <p className="text-sm text-gray-600 ml-4">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>

        {notifications.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center shadow-sm">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            <h2 className="text-lg font-bold text-gray-700 mb-2">No notifications yet</h2>
            <p className="text-sm text-gray-500">We'll notify you when something important happens</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`w-full text-left bg-white rounded-xl border-2 transition-all duration-200 hover:shadow-lg hover:border-[#FF4D28]/30 ${
                  !notification.read 
                    ? "border-[#FF4D28]/20 bg-[#FF4D28]/5 shadow-md" 
                    : "border-gray-200 shadow-sm"
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                      !notification.read ? "bg-[#FF4D28]/10" : "bg-gray-100"
                    }`}>
                      <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className={`text-base font-bold ${
                          !notification.read ? "text-[#1A1A1A]" : "text-gray-700"
                        }`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className="w-2.5 h-2.5 bg-[#FF4D28] rounded-full shrink-0 mt-1.5"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 font-medium">
                        {getTimeAgo(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
