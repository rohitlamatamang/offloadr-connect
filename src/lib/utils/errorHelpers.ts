// src/lib/utils/errorHelpers.ts

/**
 * Standard error messages for common scenarios
 */
export const ERROR_MESSAGES = {
  // Auth errors
  INVALID_CREDENTIALS: "Invalid email or password. Please check your credentials and try again.",
  USER_NOT_FOUND: "No account found with this email. Please sign up first.",
  TOO_MANY_ATTEMPTS: "Too many failed login attempts. Please try again later or reset your password.",
  INVALID_EMAIL: "Please enter a valid email address.",
  EMAIL_ALREADY_EXISTS: "This email is already registered. Please sign in instead.",
  WEAK_PASSWORD: "Password should be at least 6 characters.",
  GOOGLE_SIGNIN_FAILED: "Google sign-in failed. Please try again.",
  
  // Profile errors
  PROFILE_UPDATE_FAILED: "Failed to update profile. Please try again.",
  CANNOT_CHANGE_OWN_ROLE: "You cannot change your own role",
  CANNOT_DELETE_OWN_ACCOUNT: "You cannot delete your own account",
  
  // Workspace errors
  WORKSPACE_NOT_FOUND: "Workspace not found.",
  WORKSPACE_LOAD_FAILED: "Failed to load workspace.",
  WORKSPACES_LOAD_FAILED: "Failed to load workspaces.",
  WORKSPACE_CREATE_FAILED: "Failed to create workspace",
  WORKSPACE_DELETE_FAILED: "Failed to delete workspace",
  PROGRESS_UPDATE_FAILED: "Failed to update progress",
  
  // Message errors
  MESSAGE_SEND_FAILED: "Failed to send message.",
  MESSAGES_LOAD_FAILED: "Failed to load messages.",
  
  // Task errors
  TASKS_LOAD_FAILED: "Failed to load tasks.",
  
  // User/Staff errors
  USERS_LOAD_FAILED: "Failed to load users",
  ROLE_UPDATE_FAILED: "Failed to update role",
  USER_DELETE_FAILED: "Failed to delete user",
  STAFF_INFO_LOAD_FAILED: "Failed to load staff information",
  STAFF_MEMBERS_LOAD_FAILED: "Failed to load staff members",
  CLIENT_NOT_FOUND: "Client not found",
  CLIENT_INFO_LOAD_FAILED: "Failed to load client information",
  
  // Notification errors
  NOTIFICATION_SEND_FAILED: "Failed to send notification. Please try again.",
  NOTIFICATIONS_LOAD_FAILED: "Failed to load notifications.",
  
  // Generic errors
  GENERIC_ERROR: "Something went wrong. Please try again.",
  NETWORK_ERROR: "Network error. Please check your connection.",
} as const;

/**
 * Success messages for common scenarios
 */
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: "Profile updated successfully!",
  ACCOUNT_CREATED: "Account created successfully! Please check your email to verify your account before signing in.",
  ACCOUNT_CREATED_GOOGLE: "Account created successfully! You can now sign in to your account.",
  ROLE_UPDATED: "Role updated successfully",
  USER_DELETED: "User deleted successfully",
  WORKSPACE_CREATED: "Workspace created successfully!",
  WORKSPACE_DELETED: "Workspace deleted successfully!",
  NOTIFICATION_SENT: "Notification sent successfully!",
} as const;

/**
 * Maps Firebase auth error codes to user-friendly messages
 */
export function getAuthErrorMessage(code: string): string {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
      return ERROR_MESSAGES.INVALID_CREDENTIALS;
    case "auth/user-not-found":
      return ERROR_MESSAGES.USER_NOT_FOUND;
    case "auth/too-many-requests":
      return ERROR_MESSAGES.TOO_MANY_ATTEMPTS;
    case "auth/invalid-email":
      return ERROR_MESSAGES.INVALID_EMAIL;
    case "auth/email-already-in-use":
      return ERROR_MESSAGES.EMAIL_ALREADY_EXISTS;
    case "auth/weak-password":
      return ERROR_MESSAGES.WEAK_PASSWORD;
    default:
      return ERROR_MESSAGES.GENERIC_ERROR;
  }
}

/**
 * Logs error to console with context
 */
export function logError(context: string, error: unknown): void {
  console.error(`${context}:`, error);
}

/**
 * Handles error and returns user-friendly message
 */
export function handleError(error: unknown, fallbackMessage: string = ERROR_MESSAGES.GENERIC_ERROR): string {
  if (error instanceof Error) {
    return error.message || fallbackMessage;
  }
  return fallbackMessage;
}

/**
 * Creates a temporary error/success message with auto-clear
 */
export function createTempMessage(
  setter: (message: string | null) => void,
  message: string,
  duration: number = 3000
): void {
  setter(message);
  setTimeout(() => setter(null), duration);
}

/**
 * Clears all error and success messages
 */
export function clearMessages(
  setError: (message: string | null) => void,
  setSuccess: (message: string | null) => void
): void {
  setError(null);
  setSuccess(null);
}
