// src/types/user.ts
export type UserRole = "admin" | "staff" | "client";
export type ClientType = "individual" | "company";
export type ContactMethod = "email" | "phone" | "whatsapp";
export type CommunicationFrequency = "daily" | "weekly" | "as-needed";
export type StaffRole = 
  | "graphic-designer" 
  | "web-developer" 
  | "content-writer" 
  | "social-media-manager"
  | "video-editor"
  | "seo-specialist"
  | "project-manager"
  | "copywriter"
  | "ui-ux-designer"
  | "other";

export interface AppUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  
  // Staff profile fields
  staffRole?: StaffRole;
  staffRoleLabel?: string; // Display name for the role
  
  // Client profile fields
  clientType?: ClientType;
  companyName?: string;
  phone?: string;
  timeZone?: string;
  preferredContactMethod?: ContactMethod;
  communicationFrequency?: CommunicationFrequency;
}
