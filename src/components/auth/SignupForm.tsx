// src/components/auth/SignupForm.tsx
"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  // Redirect to login page after showing success message
  useEffect(() => {
    if (success) {
      console.log("Success message set, starting redirect timer...");
      const timer = setTimeout(() => {
        console.log("Redirecting now...");
        window.location.href = "/";
      }, 3000);
      
      return () => {
        console.log("Cleaning up timer");
        clearTimeout(timer);
      };
    }
  }, [success]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Basic email validation - check for common typos
      const emailLower = email.toLowerCase().trim();
      const invalidDomains = ['offloar.com', 'offloadr.co', 'offlodr.com']; // common typos
      const domain = emailLower.split('@')[1];
      
      if (invalidDomains.includes(domain)) {
        setError(`Did you mean @offloadr.com? Please check your email address.`);
        setIsSubmitting(false);
        return;
      }
      
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create Firestore profile immediately (even before verification)
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: name.trim() || user.email,
        role: "client",
        createdAt: new Date(),
      });

      // Send verification email
      await sendEmailVerification(user);
      
      // Show success message and redirect
      alert("Account created! Please check your email to verify your account before signing in.");
      await auth.signOut(); // Sign them out until they verify
      router.push("/");
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      
      // Handle specific Firebase errors
      if (error?.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please sign in instead.");
      } else if (error?.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else if (error?.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError(error?.message ?? "Unable to create account. Please try again.");
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
      
      // Check if user already exists
      const userRef = doc(db, "users", result.user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        // New user - create profile
        await setDoc(userRef, {
          email: result.user.email ?? "",
          name: result.user.displayName ?? "",
          role: "client",
          createdAt: new Date(),
        });
        
        // Sign out and show success message
        await auth.signOut();
        setSuccess("Account created successfully! You can now sign in to your account.");
        setGoogleLoading(false);
        return;
      }
      
      // Existing user - sign them out and show message
      await auth.signOut();
      setError("This account already exists. Please sign in instead.");
      setGoogleLoading(false);
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

  // Show success message
  if (success) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl shadow-gray-900/10 sm:p-8">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-[#FF4D28] to-[#FF6B47] rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">
              Signup Complete!
            </h2>
            <p className="text-gray-600 text-base">
              {success}
            </p>
          </div>
          <div className="pt-4">
            <p className="text-sm text-gray-500">
              Redirecting to sign in page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl shadow-gray-900/10 sm:p-8">
      <div className="mb-6 space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-[#1A1A1A] sm:text-3xl">
          Create your account
        </h2>
        <p className="text-sm text-gray-600">
          Get started with Offloadr Connect — email or Google
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full name"
          type="text"
          name="name"
          placeholder="John Doe"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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
          placeholder="At least 6 characters"
          autoComplete="new-password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="rounded-lg bg-[#FFF5F2] border border-[#FF4D28]/20 px-4 py-3 text-sm text-gray-700">
          <span className="font-semibold text-[#FF4D28]">ℹ️ Note:</span> All new accounts start as <strong className="text-[#1A1A1A]">Client</strong>. Contact your administrator to upgrade your role.
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-800 mb-1">
                {error}
              </p>
              {error.includes("already exists") && (
                <p className="text-xs text-red-600">
                  Already have an account? <button type="button" onClick={() => window.location.href = "/"} className="font-semibold underline hover:text-red-700">Sign in here</button>
                </p>
              )}
            </div>
          </div>
        )}

        <Button type="submit" className="mt-1 w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account…" : "Create account"}
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
          {googleLoading ? "Connecting with Google…" : "Sign up with Google"}
        </span>
      </button>
    </div>
  );
}
