// src/components/forms/FormInput.tsx
"use client";

import { InputHTMLAttributes, forwardRef } from "react";

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: "default" | "rounded";
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, helperText, variant = "default", className = "", ...props }, ref) => {
    const baseClasses = "w-full bg-white px-4 text-sm text-[#1A1A1A] placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-offset-0";
    
    const variantClasses = variant === "rounded" 
      ? "rounded-xl border-2 py-3 focus:ring-[#FF4D28]/30" 
      : "rounded-lg border py-2.5 focus:ring-[#FF4D28]/20";
    
    const stateClasses = error
      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
      : "border-gray-200 focus:border-[#FF4D28]";

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={props.id}
            className={variant === "rounded" 
              ? "block text-sm font-semibold text-gray-700 mb-2"
              : "block text-sm font-semibold text-[#1A1A1A] mb-2"
            }
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`${baseClasses} ${variantClasses} ${stateClasses} ${className}`}
          {...props}
        />
        {helperText && !error && (
          <p className="mt-1.5 text-xs text-gray-500">{helperText}</p>
        )}
        {error && (
          <p className="mt-1.5 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
