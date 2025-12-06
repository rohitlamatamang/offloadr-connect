// src/components/error/SectionErrorBoundary.tsx
"use client";

import { Component, ReactNode } from "react";
import { logError } from "@/lib/utils/errorHelpers";

interface SectionErrorBoundaryProps {
  children: ReactNode;
  sectionName?: string;
  fallbackMessage?: string;
}

interface SectionErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Lightweight error boundary for smaller UI sections
 * Shows inline error without breaking the entire page
 */
export default class SectionErrorBoundary extends Component<
  SectionErrorBoundaryProps,
  SectionErrorBoundaryState
> {
  constructor(props: SectionErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): SectionErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const section = this.props.sectionName || "Unknown Section";
    logError(`SectionErrorBoundary: ${section}`, error);
    console.error("Error Info:", errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <svg 
              className="h-5 w-5 flex-shrink-0 text-red-500" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                clipRule="evenodd" 
              />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800">
                {this.props.sectionName ? `${this.props.sectionName} Error` : "Error"}
              </h3>
              <p className="mt-1 text-xs text-red-700">
                {this.props.fallbackMessage || 
                  this.state.error?.message || 
                  "Failed to load this section"}
              </p>
              <button
                onClick={this.handleRetry}
                className="mt-2 text-xs font-medium text-red-600 underline hover:text-red-800"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
