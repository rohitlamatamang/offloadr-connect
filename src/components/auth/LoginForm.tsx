// src/components/auth/LoginForm.tsx
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

async function ensureUserProfile(user: User) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    // Check if there's pending signup data from localStorage
    const pendingData = localStorage.getItem(`pending_user_${user.uid}`);
    let userData: { name: string; role: string } = {
      name: user.displayName ?? user.email ?? "",
      role: "client",
    };
    
    if (pendingData) {
      try {
        userData = JSON.parse(pendingData);
        // Clean up after using
        localStorage.removeItem(`pending_user_${user.uid}`);
      } catch (e) {
        console.error("Failed to parse pending user data", e);
      }
    }
    
    // Create profile on first verified login
    await setDoc(ref, {
      email: user.email ?? "",
      name: userData.name,
      role: userData.role,
      createdAt: new Date(),
    });
  }
}

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if user profile exists first (for legacy accounts)
      const userRef = doc(db, "users", cred.user.uid);
      const userSnap = await getDoc(userRef);
      const isLegacyAccount = userSnap.exists();
      
      // Check if email is verified (skip for legacy admin accounts)
      if (!cred.user.emailVerified && !isLegacyAccount) {
        // Sign out IMMEDIATELY to prevent any Firestore access attempts
        const tempError = "Please verify your email before signing in. Check your inbox for the verification link.";
        await auth.signOut();
        setError(tempError);
        setIsSubmitting(false);
        return;
      }
      
      // Only access Firestore after verification check
      await ensureUserProfile(cred.user);
      // Successful login - redirect to dashboard
      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as { message?: string; code?: string };
      
      // Handle specific error codes with user-friendly messages
      if (error?.code === "auth/invalid-credential" || error?.code === "auth/wrong-password") {
        setError("Invalid email or password. Please check your credentials and try again.");
      } else if (error?.code === "auth/user-not-found") {
        setError("No account found with this email. Please sign up first.");
      } else if (error?.code === "auth/too-many-requests") {
        setError("Too many failed login attempts. Please try again later or reset your password.");
      } else if (error?.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Unable to sign in. Please check your email and password.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if user account exists
      const userRef = doc(db, "users", result.user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        // No account found - sign them out and show error
        await auth.signOut();
        setError("No account found. Please sign up first.");
        return;
      }
      
      // Wait for auth state to propagate
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Google accounts are pre-verified by Google, so we allow them
      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      
      // Ignore cancelled popup errors (user closed popup or clicked button multiple times)
      if (error?.code === "auth/cancelled-popup-request" || error?.code === "auth/popup-closed-by-user") {
        return;
      }
      
      console.error("Google sign-in error", err);
      setError("Google sign-in failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-slate-950/70 backdrop-blur-md sm:p-7">
      <div className="mb-6 space-y-2 text-center">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Sign in to Offloadr
        </h2>
        <p className="text-xs text-slate-400 sm:text-sm">
          Use your workspace account email or sign in with Google.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Work email"
          type="email"
          name="email"
          placeholder="you@company.com"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-xs text-red-400 sm:text-sm">
            {error}
          </p>
        )}

        <Button type="submit" className="mt-1 w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing you in…" : "Continue"}
        </Button>
      </form>

      {/* Divider */}
      <div className="my-4 flex items-center gap-2 text-[11px] text-slate-500">
        <div className="h-px flex-1 bg-slate-800" />
        <span>or</span>
        <div className="h-px flex-1 bg-slate-800" />
      </div>

      {/* Google sign-in */}
      <Button
        type="button"
        variant="secondary"
        className="w-full"
        disabled={googleLoading}
        onClick={handleGoogleSignIn}
      >
        {googleLoading ? "Connecting with Google…" : "Continue with Google"}
      </Button>
    </div>
  );
}
