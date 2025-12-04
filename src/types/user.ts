// src/types/user.ts
export type UserRole = "admin" | "staff" | "client";

export interface AppUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}
