// src/components/messaging/StaffMessageSelector.tsx
"use client";

import { useState } from "react";
import { useStaffMembers } from "@/hooks/useStaffMembers";
import type { AppUser } from "@/types/user";

interface StaffMessageSelectorProps {
  workspaceStaffIds: string[];
  selectedRecipient: { id: string | null; name: string } | null;
  onSelectRecipient: (recipient: { id: string | null; name: string } | null) => void;
  currentUserId: string;
}

export default function StaffMessageSelector({
  workspaceStaffIds,
  selectedRecipient,
  onSelectRecipient,
  currentUserId,
}: StaffMessageSelectorProps) {
  const { staffMembers } = useStaffMembers();
  const [isOpen, setIsOpen] = useState(false);

  // Filter to only show staff assigned to this workspace (excluding current user)
  const availableStaff = staffMembers.filter(
    (staff) => 
      workspaceStaffIds && 
      workspaceStaffIds.includes(staff.id) && 
      staff.id !== currentUserId
  );

  const handleSelect = (staff: AppUser | null) => {
    if (staff) {
      onSelectRecipient({ id: staff.id, name: staff.name });
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
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        <svg className="w-3.5 h-3.5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
        <span className="text-gray-700">
          {selectedRecipient ? `To: ${selectedRecipient.name}` : "To: All Team"}
        </span>
        <svg className={`w-3 h-3 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          <div className="absolute bottom-full mb-2 left-0 z-20 w-64 bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* All Staff Option */}
            <button
              type="button"
              onClick={() => handleSelect(null)}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                !selectedRecipient ? "bg-orange-50 border-l-4 border-[#FF4D28]" : ""
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF4D28] to-[#FF6B47] flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-gray-900">All Team Members</p>
                <p className="text-xs text-gray-500">Group message</p>
              </div>
              {!selectedRecipient && (
                <svg className="w-5 h-5 text-[#FF4D28]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            {/* Individual Staff */}
            {availableStaff.length > 0 && (
              <div className="border-t border-gray-200">
                <p className="px-4 py-2 text-[10px] uppercase tracking-wider font-bold text-gray-500 bg-gray-50">
                  Direct Message
                </p>
                {availableStaff.map((staff) => (
                  <button
                    key={staff.id}
                    type="button"
                    onClick={() => handleSelect(staff)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors ${
                      selectedRecipient?.id === staff.id ? "bg-orange-50 border-l-4 border-[#FF4D28]" : ""
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                      {staff.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{staff.name}</p>
                      <p className="text-xs text-gray-500 truncate">{staff.email}</p>
                    </div>
                    {selectedRecipient?.id === staff.id && (
                      <svg className="w-5 h-5 text-[#FF4D28]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
