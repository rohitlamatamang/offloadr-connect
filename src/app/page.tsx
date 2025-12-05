"use client";

import { useState } from "react";
import Logo from "@/components/layout/Logo";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";

export default function Page() {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#FAFAFA] p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-[#FF4D28] to-[#FF6B47] opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] opacity-5 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="mb-6 flex justify-center">
            <Logo size="lg" />
          </div>
          <h1 className="text-4xl font-bold text-[#1A1A1A] tracking-tight">
            Welcome to <span className="text-[#FF4D28]">Offloadr Connect</span>
          </h1>
          <p className="mt-3 text-base text-gray-600">
            Streamline communication with your clients and team
          </p>
        </div>

        {isSignup ? <SignupForm /> : <LoginForm />}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isSignup ? "Already have an account? " : "Don&apos;t have an account? "}
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="font-semibold text-[#FF4D28] hover:text-[#e04320] transition-colors"
            >
              {isSignup ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-xs text-gray-400">
            Secure • Reliable • Professional
          </p>
        </div>
      </div>
    </div>
  );
}
