// src/components/profile/ProfileHeader.tsx
"use client";

interface ProfileHeaderProps {
  name: string;
  email: string;
  role: string;
}

export default function ProfileHeader({ name, email, role }: ProfileHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF4D28] to-[#FF6B47] flex items-center justify-center text-white text-2xl font-bold shadow-lg">
          {name?.charAt(0).toUpperCase() || email.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wider text-[#FF4D28] font-bold mb-1">Full Name</p>
          <p className="text-base font-bold text-[#1A1A1A]">{name || "Not set"}</p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200">
        <p className="text-xs uppercase tracking-wider text-[#FF4D28] font-bold mb-1">Email Address</p>
        <p className="text-sm font-semibold text-gray-700">{email}</p>
      </div>

      <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200">
        <p className="text-xs uppercase tracking-wider text-[#FF4D28] font-bold mb-1">Account Role</p>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-[#FF4D28] to-[#FF6B47] text-white shadow-sm">
          {role.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
