"use client";

import { useState } from "react";
import Logo from "@/components/layout/Logo";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";

export default function Page() {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <Logo size="lg" />
          </div>
          <h1 className="text-3xl font-bold text-slate-100">Welcome to Offloadr</h1>
          <p className="mt-2 text-sm text-slate-400">
            Connect with your team and clients
          </p>
        </div>

        {isSignup ? <SignupForm /> : <LoginForm />}

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-400">
            {isSignup ? "Already have an account? " : "Don&apos;t have an account? "}
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="font-medium text-indigo-400 hover:text-indigo-300 transition"
            >
              {isSignup ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
