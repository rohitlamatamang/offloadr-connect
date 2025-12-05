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
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl shadow-gray-900/10 sm:p-8">
      <div className="mb-6 space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-[#1A1A1A] sm:text-3xl">
          Sign in to Offloadr
        </h2>
        <p className="text-sm text-gray-600">
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
          <div className="rounded-lg bg-red-50 border border-red-200 p-3">
            <p className="text-sm text-red-700">
              {error}
            </p>
          </div>
        )}

        <Button type="submit" className="mt-1 w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing you in…" : "Continue"}
        </Button>
      </form>

      {/* Divider */}
      <div className="my-5 flex items-center gap-3 text-sm text-gray-400">
        <div className="h-px flex-1 bg-gray-200" />
        <span>or</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      {/* Google sign-in */}
      <button
        type="button"
        disabled={googleLoading}
        onClick={handleGoogleSignIn}
        className="w-full relative rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 bg-white transition-all duration-300 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          border: '2px solid transparent',
          backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #4285F4, #EA4335, #FBBC04, #34A853)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        }}
      >
        <span className="flex items-center justify-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC04" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {googleLoading ? "Connecting with Google…" : "Continue with Google"}
        </span>
      </button>
    </div>
  );
}
