// src/lib/utils/formHelpers.ts

/**
 * Email validation regex pattern
 */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

/**
 * Validates password strength (minimum 6 characters)
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

/**
 * Validates required string field
 */
export function isValidString(value: string, minLength: number = 1, maxLength?: number): boolean {
  if (!value || value.trim().length < minLength) return false;
  if (maxLength && value.trim().length > maxLength) return false;
  return true;
}

/**
 * Validates progress value (0-100)
 */
export function isValidProgress(value: number): boolean {
  return typeof value === "number" && value >= 0 && value <= 100;
}

/**
 * Trims whitespace from string
 */
export function trimValue(value: string): string {
  return value.trim();
}

/**
 * Validates phone number format (basic)
 */
export function isValidPhone(phone: string): boolean {
  // Basic validation: at least 10 digits
  const digitsOnly = phone.replace(/\D/g, "");
  return digitsOnly.length >= 10;
}

/**
 * Validates URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks if string is empty or only whitespace
 */
export function isEmpty(value: string | null | undefined): boolean {
  return !value || value.trim().length === 0;
}

/**
 * Sanitizes string for safe display
 */
export function sanitizeString(value: string): string {
  return value.trim().replace(/[<>]/g, "");
}

/**
 * Validates that two password fields match
 */
export function passwordsMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword;
}

/**
 * Creates form data object from key-value pairs
 */
export function createFormData(fields: Record<string, unknown>): Record<string, unknown> {
  const formData: Record<string, unknown> = {};
  
  Object.entries(fields).forEach(([key, value]) => {
    if (typeof value === "string") {
      formData[key] = trimValue(value);
    } else {
      formData[key] = value;
    }
  });
  
  return formData;
}

/**
 * Validates file size (in MB)
 */
export function isValidFileSize(file: File, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

/**
 * Validates file type
 */
export function isValidFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * Formats phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, "");
  
  if (digitsOnly.length === 10) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
  }
  
  return phone;
}

/**
 * Generates a random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Debounces a function call
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
