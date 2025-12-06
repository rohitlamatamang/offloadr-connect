// src/components/profile/PasswordChangeForm.tsx
"use client";

import { useState } from "react";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Button from "@/components/ui/Button";

interface PasswordChangeFormProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  hasPasswordProvider: boolean;
}

export default function PasswordChangeForm({ onSuccess, onError, hasPasswordProvider }: PasswordChangeFormProps) {
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    onError("");
    onSuccess("");

    if (newPassword !== confirmPassword) {
      onError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      onError("Password must be at least 6 characters long.");
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

      onSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordChange(false);
    } catch (err: unknown) {
      console.error("Password change error:", err);
      const errorCode = err && typeof err === 'object' && 'code' in err ? (err as { code: string }).code : '';
      if (errorCode === "auth/wrong-password") {
        onError("Current password is incorrect.");
      } else if (errorCode === "auth/weak-password") {
        onError("Password is too weak. Please use a stronger password.");
      } else {
        onError("Failed to change password. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!hasPasswordProvider) {
    return (
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
    );
  }

  if (!showPasswordChange) {
    return (
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
    );
  }

  return (
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
            onError("");
          }}
          disabled={isSubmitting}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
