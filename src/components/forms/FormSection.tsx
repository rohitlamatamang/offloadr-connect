// src/components/forms/FormSection.tsx
"use client";

import { ReactNode } from "react";

export interface FormSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  variant?: "default" | "bordered";
  className?: string;
}

export default function FormSection({
  title,
  description,
  children,
  variant = "default",
  className = "",
}: FormSectionProps) {
  const containerClasses = variant === "bordered"
    ? "pt-4 border-t-2 border-gray-100"
    : "space-y-4";

  return (
    <div className={`${containerClasses} ${className}`}>
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-sm font-bold text-gray-700 mb-1">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-xs text-gray-600">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}
