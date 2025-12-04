// src/components/auth/SignupForm.tsx
"use client";

import { FormEvent, useState } from "react";
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
      console.error("Signup error", err);
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
        
        // Sign out and redirect to login page for new signups
        await auth.signOut();
        alert("Account created successfully! Please sign in to continue.");
        router.push("/");
        return;
      }
      
      // Existing user - redirect to dashboard
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
          Create your account
        </h2>
        <p className="text-xs text-slate-400 sm:text-sm">
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

        <div className="rounded-lg bg-slate-800/30 px-3 py-2 text-xs text-slate-400">
          ℹ️ All new accounts start as <strong className="text-slate-200">Client</strong>. Contact your administrator to upgrade your role.
        </div>

        {error && (
          <p className="text-xs text-red-400 sm:text-sm">
            {error}
          </p>
        )}

        <Button type="submit" className="mt-1 w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account…" : "Create account"}
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
        {googleLoading ? "Connecting with Google…" : "Sign up with Google"}
      </Button>
    </div>
  );
}
