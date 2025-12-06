// src/components/workspace/StaffSelector.tsx
"use client";

import { useState, useEffect } from "react";
import { useStaffMembers } from "@/hooks/useStaffMembers";
import { getStaffRoleLabel, getStaffRoleIcon } from "@/lib/staffRoles";
import type { AppUser } from "@/types/user";

interface StaffSelectorProps {
  selectedStaffIds: string[];
  onSelectionChange: (staffIds: string[]) => void;
}

export default function StaffSelector({
  selectedStaffIds,
  onSelectionChange,
}: StaffSelectorProps) {
  const { staffMembers, loading, error } = useStaffMembers();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStaff = staffMembers.filter((staff) =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleStaff = (staffId: string) => {
    if (selectedStaffIds.includes(staffId)) {
      onSelectionChange(selectedStaffIds.filter((id) => id !== staffId));
    } else {
      onSelectionChange([...selectedStaffIds, staffId]);
    }
  };

  const selectAll = () => {
    onSelectionChange(filteredStaff.map((s) => s.id));
  };

  const clearAll = () => {
    onSelectionChange([]);
  };

  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="inline-block w-6 h-6 border-2 border-[#FF4D28] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-2 text-sm text-gray-500">Loading staff members...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (staffMembers.length === 0) {
    return (
      <div className="p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl text-center">
        <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p className="text-sm font-semibold text-gray-700">No Staff Members Found</p>
        <p className="text-xs text-gray-500 mt-1">Add staff members from admin settings first</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header with count */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-700">
            Assign Staff Members
          </p>
          <p className="text-xs text-gray-500">
            {selectedStaffIds.length} of {staffMembers.length} selected
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={selectAll}
            className="text-xs font-semibold text-[#FF4D28] hover:text-[#FF6B47] transition-colors"
          >
            Select All
          </button>
          {selectedStaffIds.length > 0 && (
            <>
              <span className="text-gray-300">|</span>
              <button
                type="button"
                onClick={clearAll}
                className="text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors"
              >
                Clear All
              </button>
            </>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search staff by name or email..."
          className="w-full pl-10 pr-4 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF4D28]/30 focus:border-[#FF4D28] transition-all"
        />
      </div>

      {/* Staff list */}
      <div className="max-h-64 overflow-y-auto border-2 border-gray-200 rounded-xl divide-y divide-gray-200">
        {filteredStaff.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">
            No staff members match your search
          </div>
        ) : (
          filteredStaff.map((staff) => (
            <label
              key={staff.id}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedStaffIds.includes(staff.id)}
                onChange={() => toggleStaff(staff.id)}
                className="w-4 h-4 text-[#FF4D28] border-gray-300 rounded focus:ring-[#FF4D28] focus:ring-2 cursor-pointer"
              />
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF4D28] to-[#FF6B47] flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {staff.staffRole ? (
                    <span className="text-base">{getStaffRoleIcon(staff.staffRole)}</span>
                  ) : (
                    staff.name.charAt(0).toUpperCase()
                  )}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {staff.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {staff.staffRoleLabel || getStaffRoleLabel(staff.staffRole) || staff.email}
                  </p>
                </div>
                {/* Badge */}
                {selectedStaffIds.includes(staff.id) && (
                  <div className="shrink-0">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </label>
          ))
        )}
      </div>

      {/* Selected count badge */}
      {selectedStaffIds.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border-2 border-green-200 rounded-xl">
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
          <p className="text-sm font-semibold text-green-700">
            {selectedStaffIds.length} staff member{selectedStaffIds.length !== 1 ? "s" : ""} assigned
          </p>
        </div>
      )}
    </div>
  );
}
