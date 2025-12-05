// src/components/ui/LoadingScreen.tsx
"use client";

import Logo from "@/components/layout/Logo";

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA]">
      <div className="text-center space-y-6">
        {/* Animated Logo */}
        <div className="animate-pulse">
          <Logo size="lg" />
        </div>
        
        {/* Loading Spinner */}
        <div className="flex justify-center">
          <div className="relative w-16 h-16">
            {/* Outer spinning ring */}
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div 
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#FF4D28] animate-spin"
              style={{ animationDuration: '1s' }}
            ></div>
            {/* Inner spinning ring */}
            <div 
              className="absolute inset-2 rounded-full border-4 border-transparent border-t-[#1A1A1A] animate-spin"
              style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}
            ></div>
          </div>
        </div>
        
        {/* Loading Message */}
        <div className="space-y-2">
          <p className="text-lg font-semibold text-[#1A1A1A]">
            {message}
          </p>
          <p className="text-sm text-gray-500">
            Please wait a moment
          </p>
        </div>
        
        {/* Animated dots */}
        <div className="flex justify-center gap-2">
          <span 
            className="w-2 h-2 bg-[#FF4D28] rounded-full animate-bounce"
            style={{ animationDelay: '0ms', animationDuration: '1s' }}
          ></span>
          <span 
            className="w-2 h-2 bg-[#FF4D28] rounded-full animate-bounce"
            style={{ animationDelay: '150ms', animationDuration: '1s' }}
          ></span>
          <span 
            className="w-2 h-2 bg-[#FF4D28] rounded-full animate-bounce"
            style={{ animationDelay: '300ms', animationDuration: '1s' }}
          ></span>
        </div>
      </div>
    </div>
  );
}
