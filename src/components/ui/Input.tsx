import { InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-semibold text-[#1A1A1A] mb-2"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-[#1A1A1A] placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-offset-0 ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
              : "border-gray-200 focus:border-[#FF4D28] focus:ring-[#FF4D28]/20"
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
