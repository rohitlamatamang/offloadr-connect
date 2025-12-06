// src/lib/staffRoles.ts
import type { StaffRole } from "@/types/user";

export const STAFF_ROLES: Record<StaffRole, string> = {
  "graphic-designer": "Graphic Designer",
  "web-developer": "Web Developer",
  "content-writer": "Content Writer",
  "social-media-manager": "Social Media Manager",
  "video-editor": "Video Editor",
  "seo-specialist": "SEO Specialist",
  "project-manager": "Project Manager",
  "copywriter": "Copywriter",
  "ui-ux-designer": "UI/UX Designer",
  "other": "Other",
};

export function getStaffRoleLabel(staffRole?: StaffRole): string {
  if (!staffRole) return "";
  return STAFF_ROLES[staffRole] || "Staff";
}

export function getStaffRoleIcon(staffRole?: StaffRole): string {
  switch (staffRole) {
    case "graphic-designer":
      return "🎨";
    case "web-developer":
      return "💻";
    case "content-writer":
      return "✍️";
    case "social-media-manager":
      return "📱";
    case "video-editor":
      return "🎬";
    case "seo-specialist":
      return "🔍";
    case "project-manager":
      return "📊";
    case "copywriter":
      return "📝";
    case "ui-ux-designer":
      return "🎯";
    case "other":
      return "👤";
    default:
      return "👤";
  }
}
