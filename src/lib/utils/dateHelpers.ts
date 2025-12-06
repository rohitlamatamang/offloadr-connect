// src/lib/utils/dateHelpers.ts

/**
 * Formats a date to a localized time string
 * @param date - Date object or null
 * @returns Formatted time string (e.g., "2:30 PM")
 */
export function formatTime(date: Date | null): string {
  if (!date) return "";
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Formats a date to a localized date string
 * @param date - Date object or null
 * @returns Formatted date string (e.g., "12/6/2025")
 */
export function formatDate(date: Date | null): string {
  if (!date) return "";
  return date.toLocaleDateString();
}

/**
 * Formats a date to a localized date and time string
 * @param date - Date object or null
 * @returns Formatted date and time string
 */
export function formatDateTime(date: Date | null): string {
  if (!date) return "";
  return date.toLocaleString();
}

/**
 * Formats a date to a short date string (e.g., "Dec 6, 2025")
 * @param date - Date object or null
 * @returns Formatted short date string
 */
export function formatShortDate(date: Date | null): string {
  if (!date) return "";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Formats a date to relative time (e.g., "2 hours ago", "just now")
 * @param date - Date object or null
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date | null): string {
  if (!date) return "";
  
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return formatDate(date);
}

/**
 * Gets current timestamp as Date object
 * @returns Current Date
 */
export function getCurrentTimestamp(): Date {
  return new Date();
}

/**
 * Checks if a date is today
 * @param date - Date object or null
 * @returns True if date is today
 */
export function isToday(date: Date | null): boolean {
  if (!date) return false;
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

/**
 * Formats a date for display with "Today" if applicable
 * @param date - Date object or null
 * @returns "Today" or formatted date
 */
export function formatDateWithToday(date: Date | null): string {
  if (!date) return "";
  return isToday(date) ? "Today" : formatDate(date);
}
