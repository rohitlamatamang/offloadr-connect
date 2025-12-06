// src/components/forms/FormSelect.tsx
"use client";

import { SelectHTMLAttributes, forwardRef } from "react";

export interface FormSelectOption {
  value: string;
  label: string;
}

export interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: "default" | "rounded";
  options?: FormSelectOption[];
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, helperText, variant = "default", options, className = "", children, ...props }, ref) => {
    const baseClasses = "w-full bg-white px-4 text-sm text-[#1A1A1A] transition-all focus:outline-none focus:ring-2 focus:ring-offset-0 cursor-pointer";
    
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
        <select
          ref={ref}
          className={`${baseClasses} ${variantClasses} ${stateClasses} ${className}`}
          {...props}
        >
          {options ? (
            options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))
          ) : (
            children
          )}
        </select>
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

FormSelect.displayName = "FormSelect";

export default FormSelect;
