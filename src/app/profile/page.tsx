// src/app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import AppShell from "@/components/layout/AppShell";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import LoadingScreen from "@/components/ui/LoadingScreen";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ClientProfileForm from "@/components/profile/ClientProfileForm";
import StaffProfileForm from "@/components/profile/StaffProfileForm";
import PasswordChangeForm from "@/components/profile/PasswordChangeForm";
import type { ClientType, ContactMethod, CommunicationFrequency, StaffRole } from "@/types/user";
import { STAFF_ROLES } from "@/lib/staffRoles";

export default function ProfilePage() {
  const { appUser, loading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize state
  const [name, setName] = useState("");
  const [staffRole, setStaffRole] = useState<StaffRole>("other");
  const [clientType, setClientType] = useState<ClientType>("individual");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const [preferredContactMethod, setPreferredContactMethod] = useState<ContactMethod>("email");
  const [communicationFrequency, setCommunicationFrequency] = useState<CommunicationFrequency>("as-needed");

  // Check if user signed in with password provider
  const hasPasswordProvider = auth.currentUser?.providerData.some(
    (provider) => provider.providerId === "password"
  ) ?? false;

  const isClient = appUser?.role === "client";
  const isStaff = appUser?.role === "staff" || appUser?.role === "admin";

  // Update state when appUser changes
  useEffect(() => {
    if (appUser) {
      setName(appUser.name || "");
      setStaffRole(appUser.staffRole || "other");
      setClientType(appUser.clientType || "individual");
      setCompanyName(appUser.companyName || "");
      setPhone(appUser.phone || "");
      setTimeZone(appUser.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone);
      setPreferredContactMethod(appUser.preferredContactMethod || "email");
      setCommunicationFrequency(appUser.communicationFrequency || "as-needed");
    }
  }, [appUser]);

  if (authLoading) {
    return <LoadingScreen message="Loading profile" />;
  }

  if (!appUser) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-600">
        Please sign in to view your profile.
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const userRef = doc(db, "users", appUser.id);
      const updateData: Record<string, string> = {
        name: name.trim(),
      };

      // Add staff-specific fields if user is staff/admin
      if (isStaff) {
        updateData.staffRole = staffRole;
        updateData.staffRoleLabel = STAFF_ROLES[staffRole];
      }

      // Add client-specific fields if user is a client
      if (isClient) {
        updateData.clientType = clientType;
        updateData.companyName = clientType === "company" ? companyName.trim() : "";
        updateData.phone = phone.trim();
        updateData.timeZone = timeZone;
        updateData.preferredContactMethod = preferredContactMethod;
        updateData.communicationFrequency = communicationFrequency;
      }

      await updateDoc(userRef, updateData);

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      
      // Reload the page to refresh user data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: unknown) {
      console.error("Profile update error:", err);
      setError(err instanceof Error ? err.message : "Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setName(appUser?.name || "");
    setStaffRole(appUser?.staffRole || "other");
    setClientType(appUser?.clientType || "individual");
    setCompanyName(appUser?.companyName || "");
    setPhone(appUser?.phone || "");
    setTimeZone(appUser?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone);
    setPreferredContactMethod(appUser?.preferredContactMethod || "email");
    setCommunicationFrequency(appUser?.communicationFrequency || "as-needed");
    setError(null);
    setSuccess(null);
  };

  return (
    <AppShell title="Profile & Settings">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-8 bg-gradient-to-b from-[#FF4D28] to-[#FF6B47] rounded-full"></div>
            <h1 className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">Profile & Settings</h1>
          </div>
          <p className="text-sm text-gray-600 ml-4">Manage your account information and preferences</p>
        </div>

        {success && (
          <div className="mb-6 rounded-xl bg-green-50 border-2 border-green-200 p-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-sm font-semibold text-green-800">{success}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border-2 border-red-200 p-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm font-semibold text-red-800">{error}</p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Profile Information Card */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-[#1A1A1A]">Profile Information</h2>
                {!isEditing && (
                  <Button
                    variant="secondary"
                    onClick={() => setIsEditing(true)}
                    className="text-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                    Edit Profile
                  </Button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#FF4D28]/30 focus:border-[#FF4D28] transition-all duration-200"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={appUser.email}
                      disabled
                      className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500 cursor-not-allowed"
                    />
                    <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Email cannot be changed for security reasons
                    </p>
                  </div>

                  {/* Staff-specific fields */}
                  {isStaff && (
                    <StaffProfileForm
                      staffRole={staffRole}
                      onStaffRoleChange={setStaffRole}
                    />
                  )}

                  {/* Client-specific fields */}
                  {isClient && (
                    <ClientProfileForm
                      clientType={clientType}
                      companyName={companyName}
                      phone={phone}
                      timeZone={timeZone}
                      preferredContactMethod={preferredContactMethod}
                      communicationFrequency={communicationFrequency}
                      isEditing={true}
                      onClientTypeChange={setClientType}
                      onCompanyNameChange={setCompanyName}
                      onPhoneChange={setPhone}
                      onTimeZoneChange={setTimeZone}
                      onContactMethodChange={setPreferredContactMethod}
                      onFrequencyChange={setCommunicationFrequency}
                    />
                  )}

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting || !name.trim()}
                      className="flex-1"
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleCancelEdit}
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  <ProfileHeader
                    name={appUser.name}
                    email={appUser.email}
                    role={appUser.role}
                  />
                  
                  {isClient && appUser && (
                    <ClientProfileForm
                      clientType={appUser.clientType || "individual"}
                      companyName={appUser.companyName || ""}
                      phone={appUser.phone || ""}
                      timeZone={appUser.timeZone || ""}
                      preferredContactMethod={appUser.preferredContactMethod || "email"}
                      communicationFrequency={appUser.communicationFrequency || "as-needed"}
                      isEditing={false}
                      onClientTypeChange={() => {}}
                      onCompanyNameChange={() => {}}
                      onPhoneChange={() => {}}
                      onTimeZoneChange={() => {}}
                      onContactMethodChange={() => {}}
                      onFrequencyChange={() => {}}
                    />
                  )}
                </>
              )}
            </div>
          </Card>

          {/* Security Settings Card */}
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-bold text-[#1A1A1A] mb-6">Security Settings</h2>
              <PasswordChangeForm
                onSuccess={(msg) => setSuccess(msg)}
                onError={(msg) => setError(msg)}
                hasPasswordProvider={hasPasswordProvider}
              />
            </div>
          </Card>

          {/* Account Info Card */}
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-bold text-[#1A1A1A] mb-4">Account Information</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5 text-[#FF4D28]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Email Verified</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5 text-[#FF4D28]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Member since {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
