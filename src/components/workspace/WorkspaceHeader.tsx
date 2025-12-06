// src/components/workspace/WorkspaceHeader.tsx
"use client";

import type { Workspace } from "@/types/workspace";
import type { AppUser } from "@/types/user";
import { useClientInfo } from "@/hooks/useClientInfo";
import { useStaffInfo } from "@/hooks/useStaffInfo";
import SendNotificationButton from "@/components/notifications/SendNotificationButton";

interface WorkspaceHeaderProps {
  workspace: Workspace;
  currentUser?: AppUser | null;
}

export default function WorkspaceHeader({ workspace, currentUser }: WorkspaceHeaderProps) {
  const { clientInfo } = useClientInfo(workspace.clientId);
  const { staffMembers } = useStaffInfo(workspace.assignedStaffIds);
  const showClientInfo = currentUser && (currentUser.role === "admin" || currentUser.role === "staff");

  return (
    <header className="mb-6 pb-6 border-b-2 border-gray-200 bg-gradient-to-r from-white to-gray-50 rounded-xl p-5 -mx-1">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-5 bg-gradient-to-b from-[#FF4D28] to-[#FF6B47] rounded-full"></div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#FF4D28] font-extrabold">
              Workspace
            </p>
          </div>
          <h1 className="mt-3 text-2xl font-extrabold text-[#1A1A1A] sm:text-3xl tracking-tight">
            {workspace.name}
          </h1>
          {workspace.description && (
            <p className="mt-3 text-sm text-gray-600 leading-relaxed max-w-2xl">
              {workspace.description}
            </p>
          )}
        </div>
        {/* Send Notification Button - Only visible to admin/staff */}
        {showClientInfo && (
          <div className="ml-4">
            <SendNotificationButton 
              clientId={workspace.clientId}
              workspaceId={workspace.id}
              workspaceName={workspace.name}
            />
          </div>
        )}
      </div>

      {/* Client Info Badge - Only visible to admin/staff */}
      {showClientInfo && clientInfo && (
        <div className="mt-4 bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-2">Client Information</p>
          <div className="flex items-center gap-3 mb-3">
            {clientInfo.clientType === "company" ? (
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                </svg>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#1A1A1A]">{clientInfo.name}</p>
              <p className="text-xs text-gray-500">
                {clientInfo.clientType === "company" ? "🏢 Company" : "👤 Individual"}
              </p>
            </div>
          </div>
          {clientInfo.clientType === "company" && clientInfo.companyName && (
            <div className="mb-2 pb-2 border-b border-gray-100">
              <p className="text-xs text-gray-500">Company</p>
              <p className="text-sm font-semibold text-gray-700">{clientInfo.companyName}</p>
            </div>
          )}
          {clientInfo.phone && (
            <p className="text-xs text-gray-600 mb-1">📱 {clientInfo.phone}</p>
          )}
          {clientInfo.preferredContactMethod && (
            <p className="text-xs text-gray-600 mb-1 capitalize">
              💬 Contact via {clientInfo.preferredContactMethod}
            </p>
          )}
          {clientInfo.communicationFrequency && (
            <p className="text-xs text-gray-600 capitalize">
              📅 {clientInfo.communicationFrequency === "as-needed" ? "Updates as needed" : clientInfo.communicationFrequency + " updates"}
            </p>
          )}
        </div>
      )}

      {/* Assigned Staff Section - Only visible to admin/staff/client */}
      {staffMembers.length > 0 && (
        <div className="mt-4 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-4 shadow-sm">
          <p className="text-[10px] uppercase tracking-wider text-orange-600 font-bold mb-3">
            {currentUser?.role === "client" ? "Your Project Team" : "Assigned Staff"}
          </p>
          <div className="flex flex-wrap gap-3">
            {staffMembers.map((staff) => (
              <div
                key={staff.id}
                className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-orange-200 shadow-sm"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF4D28] to-[#FF6B47] flex items-center justify-center text-white font-bold text-xs shrink-0">
                  {staff.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {staff.name}
                  </p>
                  <p className="text-[10px] text-gray-500 truncate">{staff.email}</p>
                </div>
              </div>
            ))}
          </div>
          {currentUser?.role === "client" && (
            <p className="text-xs text-orange-600 mt-3">
              💬 Feel free to message your team members anytime!
            </p>
          )}
        </div>
      )}
    </header>
  );
}
