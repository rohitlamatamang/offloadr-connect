// src/app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import AppShell from "@/components/layout/AppShell";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import LoadingScreen from "@/components/ui/LoadingScreen";
import type { ClientType, ContactMethod, CommunicationFrequency, StaffRole } from "@/types/user";
import { STAFF_ROLES } from "@/lib/staffRoles";

export default function ProfilePage() {
  const { appUser, loading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

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
  );

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

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsSubmitting(true);

    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        throw new Error("No authenticated user found");
      }

      // Reauthenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      setSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordChange(false);
    } catch (err: unknown) {
      console.error("Password change error:", err);
      const errorCode = err && typeof err === 'object' && 'code' in err ? (err as { code: string }).code : '';
      if (errorCode === "auth/wrong-password") {
        setError("Current password is incorrect.");
      } else if (errorCode === "auth/weak-password") {
        setError("Password is too weak. Please use a stronger password.");
      } else {
        setError("Failed to change password. Please try again.");
      }
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
                    <div className="pt-4 border-t-2 border-gray-100">
                      <h3 className="text-sm font-bold text-gray-700 mb-4">Staff Information</h3>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Your Role/Specialty
                        </label>
                        <select
                          value={staffRole}
                          onChange={(e) => setStaffRole(e.target.value as StaffRole)}
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
                  )}

                  {/* Client-specific fields */}
                  {isClient && (
                    <>
                      <div className="pt-4 border-t-2 border-gray-100">
                        <h3 className="text-sm font-bold text-gray-700 mb-4">Client Information</h3>
                        
                        {/* Client Type */}
                        <div className="mb-4">
                          <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Client Type
                          </label>
                          <div className="flex gap-4">
                            <label className="flex-1 cursor-pointer">
                              <input
                                type="radio"
                                name="clientType"
                                value="individual"
                                checked={clientType === "individual"}
                                onChange={(e) => setClientType(e.target.value as ClientType)}
                                className="sr-only peer"
                              />
                              <div className="flex items-center gap-3 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 transition-all duration-200 peer-checked:border-[#FF4D28] peer-checked:bg-[#FF4D28]/5">
                                <svg className="w-5 h-5 text-gray-400 peer-checked:text-[#FF4D28]" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm font-semibold text-gray-700">Individual</span>
                              </div>
                            </label>
                            <label className="flex-1 cursor-pointer">
                              <input
                                type="radio"
                                name="clientType"
                                value="company"
                                checked={clientType === "company"}
                                onChange={(e) => setClientType(e.target.value as ClientType)}
                                className="sr-only peer"
                              />
                              <div className="flex items-center gap-3 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 transition-all duration-200 peer-checked:border-[#FF4D28] peer-checked:bg-[#FF4D28]/5">
                                <svg className="w-5 h-5 text-gray-400 peer-checked:text-[#FF4D28]" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm font-semibold text-gray-700">Company</span>
                              </div>
                            </label>
                          </div>
                        </div>

                        {/* Company Name - only show if company selected */}
                        {clientType === "company" && (
                          <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Company Name
                            </label>
                            <input
                              type="text"
                              value={companyName}
                              onChange={(e) => setCompanyName(e.target.value)}
                              className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#FF4D28]/30 focus:border-[#FF4D28] transition-all duration-200"
                              placeholder="Enter company name"
                              required={clientType === "company"}
                            />
                          </div>
                        )}

                        {/* Phone */}
                        <div className="mb-4">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#FF4D28]/30 focus:border-[#FF4D28] transition-all duration-200"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>

                        {/* Time Zone */}
                        <div className="mb-4">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Time Zone
                          </label>
                          <select
                            value={timeZone}
                            onChange={(e) => setTimeZone(e.target.value)}
                            className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#FF4D28]/30 focus:border-[#FF4D28] transition-all duration-200"
                          >
                            <option value="America/New_York">Eastern Time (ET)</option>
                            <option value="America/Chicago">Central Time (CT)</option>
                            <option value="America/Denver">Mountain Time (MT)</option>
                            <option value="America/Los_Angeles">Pacific Time (PT)</option>
                            <option value="America/Anchorage">Alaska Time (AKT)</option>
                            <option value="Pacific/Honolulu">Hawaii Time (HT)</option>
                            <option value="Europe/London">London (GMT)</option>
                            <option value="Europe/Paris">Paris (CET)</option>
                            <option value="Asia/Tokyo">Tokyo (JST)</option>
                            <option value="Asia/Shanghai">Shanghai (CST)</option>
                            <option value="Asia/Kolkata">India (IST)</option>
                            <option value="Australia/Sydney">Sydney (AEST)</option>
                          </select>
                        </div>

                        {/* Preferred Contact Method */}
                        <div className="mb-4">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Preferred Contact Method
                          </label>
                          <select
                            value={preferredContactMethod}
                            onChange={(e) => setPreferredContactMethod(e.target.value as ContactMethod)}
                            className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#FF4D28]/30 focus:border-[#FF4D28] transition-all duration-200"
                          >
                            <option value="email">Email</option>
                            <option value="phone">Phone Call</option>
                            <option value="whatsapp">WhatsApp</option>
                          </select>
                        </div>

                        {/* Communication Frequency */}
                        <div className="mb-4">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Communication Frequency
                          </label>
                          <select
                            value={communicationFrequency}
                            onChange={(e) => setCommunicationFrequency(e.target.value as CommunicationFrequency)}
                            className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#FF4D28]/30 focus:border-[#FF4D28] transition-all duration-200"
                          >
                            <option value="daily">Daily Updates</option>
                            <option value="weekly">Weekly Updates</option>
                            <option value="as-needed">As Needed</option>
                          </select>
                        </div>
                      </div>
                    </>
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
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF4D28] to-[#FF6B47] flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      {appUser.name?.charAt(0).toUpperCase() || appUser.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-wider text-[#FF4D28] font-bold mb-1">Full Name</p>
                      <p className="text-base font-bold text-[#1A1A1A]">{appUser.name || "Not set"}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200">
                    <p className="text-xs uppercase tracking-wider text-[#FF4D28] font-bold mb-1">Email Address</p>
                    <p className="text-sm font-semibold text-gray-700">{appUser.email}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200">
                    <p className="text-xs uppercase tracking-wider text-[#FF4D28] font-bold mb-1">Account Role</p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-[#FF4D28] to-[#FF6B47] text-white shadow-sm">
                      {appUser.role.toUpperCase()}
                    </span>
                  </div>

                  {/* Client-specific info display */}
                  {isClient && (
                    <>
                      <div className="mt-4 pt-4 border-t-2 border-gray-100">
                        <h3 className="text-sm font-bold text-gray-700 mb-3">Client Information</h3>
                        
                        <div className="space-y-3">
                          {/* Client Type */}
                          <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200">
                            <p className="text-xs uppercase tracking-wider text-[#FF4D28] font-bold mb-1">Client Type</p>
                            <div className="flex items-center gap-2">
                              {appUser.clientType === "company" ? (
                                <>
                                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                                  </svg>
                                  <span className="text-sm font-semibold text-gray-700">🏢 Company</span>
                                </>
                              ) : (
                                <>
                                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                  </svg>
                                  <span className="text-sm font-semibold text-gray-700">👤 Individual</span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Company Name - only show if company */}
                          {appUser.clientType === "company" && appUser.companyName && (
                            <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200">
                              <p className="text-xs uppercase tracking-wider text-[#FF4D28] font-bold mb-1">Company Name</p>
                              <p className="text-sm font-semibold text-gray-700">{appUser.companyName}</p>
                            </div>
                          )}

                          {/* Phone */}
                          {appUser.phone && (
                            <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200">
                              <p className="text-xs uppercase tracking-wider text-[#FF4D28] font-bold mb-1">Phone Number</p>
                              <p className="text-sm font-semibold text-gray-700">{appUser.phone}</p>
                            </div>
                          )}

                          {/* Time Zone */}
                          {appUser.timeZone && (
                            <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200">
                              <p className="text-xs uppercase tracking-wider text-[#FF4D28] font-bold mb-1">Time Zone</p>
                              <p className="text-sm font-semibold text-gray-700">{appUser.timeZone}</p>
                            </div>
                          )}

                          {/* Preferred Contact Method */}
                          {appUser.preferredContactMethod && (
                            <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200">
                              <p className="text-xs uppercase tracking-wider text-[#FF4D28] font-bold mb-1">Preferred Contact</p>
                              <p className="text-sm font-semibold text-gray-700 capitalize">{appUser.preferredContactMethod}</p>
                            </div>
                          )}

                          {/* Communication Frequency */}
                          {appUser.communicationFrequency && (
                            <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200">
                              <p className="text-xs uppercase tracking-wider text-[#FF4D28] font-bold mb-1">Communication</p>
                              <p className="text-sm font-semibold text-gray-700 capitalize">
                                {appUser.communicationFrequency === "as-needed" ? "As Needed" : appUser.communicationFrequency + " Updates"}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Security Settings Card */}
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-bold text-[#1A1A1A] mb-6">Security Settings</h2>

              {!hasPasswordProvider ? (
                <div className="rounded-xl bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 p-5">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-bold text-blue-900 mb-2">Google Account Sign-In</h3>
                      <p className="text-sm text-blue-800 leading-relaxed">
                        You signed in using Google authentication. Password management is handled directly through your Google account settings. 
                        To change your password, please visit your <a href="https://myaccount.google.com/security" target="_blank" rel="noopener noreferrer" className="font-bold underline hover:text-blue-900">Google Account Security page</a>.
                      </p>
                    </div>
                  </div>
                </div>
              ) : !showPasswordChange ? (
                <Button
                  variant="secondary"
                  onClick={() => setShowPasswordChange(true)}
                  className="w-full sm:w-auto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  Change Password
                </Button>
              ) : (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#FF4D28]/30 focus:border-[#FF4D28] transition-all duration-200"
                      placeholder="Enter current password"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#FF4D28]/30 focus:border-[#FF4D28] transition-all duration-200"
                      placeholder="Enter new password"
                      required
                      minLength={6}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#FF4D28]/30 focus:border-[#FF4D28] transition-all duration-200"
                      placeholder="Confirm new password"
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? "Changing..." : "Update Password"}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setShowPasswordChange(false);
                        setCurrentPassword("");
                        setNewPassword("");
                        setConfirmPassword("");
                        setError(null);
                      }}
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
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
