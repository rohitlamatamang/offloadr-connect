// src/components/profile/StaffProfileForm.tsx
"use client";

import type { StaffRole } from "@/types/user";
import { STAFF_ROLES } from "@/lib/staffRoles";

interface StaffProfileFormProps {
  staffRole: StaffRole;
  onStaffRoleChange: (role: StaffRole) => void;
}

export default function StaffProfileForm({ staffRole, onStaffRoleChange }: StaffProfileFormProps) {
  return (
    <div className="pt-4 border-t-2 border-gray-100">
      <h3 className="text-sm font-bold text-gray-700 mb-4">Staff Information</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Your Role/Specialty
        </label>
        <select
          value={staffRole}
          onChange={(e) => onStaffRoleChange(e.target.value as StaffRole)}
          className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#FF4D28]/30 focus:border-[#FF4D28] transition-all duration-200"
        >
          {Object.entries(STAFF_ROLES).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <p className="mt-2 text-xs text-gray-500">
          This helps clients and team members understand your expertise
        </p>
      </div>
    </div>
  );
}
