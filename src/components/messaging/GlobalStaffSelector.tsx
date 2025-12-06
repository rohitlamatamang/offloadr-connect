// src/components/messaging/GlobalStaffSelector.tsx
"use client";

import { useState } from "react";
import { useStaffMembers } from "@/hooks/useStaffMembers";
import { getStaffRoleLabel, getStaffRoleIcon } from "@/lib/staffRoles";
import type { AppUser } from "@/types/user";

interface GlobalStaffSelectorProps {
  selectedRecipient: { id: string | null; name: string } | null;
  onSelectRecipient: (recipient: { id: string | null; name: string } | null) => void;
  currentUserId: string;
}

export default function GlobalStaffSelector({
  selectedRecipient,
  onSelectRecipient,
  currentUserId,
}: GlobalStaffSelectorProps) {
  const { staffMembers } = useStaffMembers();
  const [isOpen, setIsOpen] = useState(false);

  // Show all staff members except current user
  const availableStaff = staffMembers.filter(
    (staff) => staff.uid !== currentUserId
  );

  const handleSelect = (staff: AppUser | null) => {
    if (staff) {
      onSelectRecipient({ id: staff.uid, name: staff.name });
    } else {
      onSelectRecipient(null); // All staff
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 rounded-lg transition-all shadow-sm"
      >
        <svg className="w-3.5 h-3.5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
        <span className="text-purple-700 font-semibold">
          {selectedRecipient ? `To: ${selectedRecipient.name}` : "To: All Staff"}
        </span>
        <svg className={`w-3 h-3 text-purple-600 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute bottom-full mb-2 left-0 z-20 w-64 bg-white rounded-xl shadow-lg border-2 border-purple-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* All Staff Option */}
            <button
              type="button"
              onClick={() => handleSelect(null)}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-purple-50 transition-colors ${
                !selectedRecipient ? "bg-purple-50 border-l-4 border-purple-500" : ""
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-gray-900">All Staff Members</p>
                <p className="text-xs text-gray-500">Global group message</p>
              </div>
              {!selectedRecipient && (
                <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            {/* Individual Staff */}
            {availableStaff.length > 0 && (
              <div className="border-t border-purple-200">
                <p className="px-4 py-2 text-[10px] uppercase tracking-wider font-bold text-purple-600 bg-purple-50">
                  Direct Message
                </p>
                {availableStaff.map((staff) => (
                  <button
                    key={staff.uid}
                    type="button"
                    onClick={() => handleSelect(staff)}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-purple-50 transition-colors ${
                      selectedRecipient?.id === staff.uid ? "bg-purple-50 border-l-4 border-purple-500" : ""
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center shrink-0 text-sm">
                      {staff.staffRole ? getStaffRoleIcon(staff.staffRole) : staff.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{staff.name}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {staff.staffRoleLabel || getStaffRoleLabel(staff.staffRole) || staff.email}
                      </p>
                    </div>
                    {selectedRecipient?.id === staff.uid && (
                      <svg className="w-5 h-5 text-purple-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}

            {availableStaff.length === 0 && (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                No other staff members available
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
