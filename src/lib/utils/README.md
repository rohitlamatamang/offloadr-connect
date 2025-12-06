# Utility Helpers

This directory contains reusable utility functions to eliminate code duplication across the application.

## Files

### `dateHelpers.ts`
Date formatting and manipulation utilities.

**Functions:**
- `formatTime(date)` - Formats to "2:30 PM"
- `formatDate(date)` - Formats to "12/6/2025"
- `formatDateTime(date)` - Full date and time
- `formatShortDate(date)` - Formats to "Dec 6, 2025"
- `formatRelativeTime(date)` - Formats to "2 hours ago"
- `formatDateWithToday(date)` - Shows "Today" or date
- `getCurrentTimestamp()` - Returns current Date
- `isToday(date)` - Checks if date is today

**Example:**
```typescript
import { formatTime, formatRelativeTime } from '@/lib/utils';

const time = formatTime(message.createdAt); // "2:30 PM"
const relative = formatRelativeTime(notification.createdAt); // "5 minutes ago"
```

### `errorHelpers.ts`
Standardized error and success message handling.

**Constants:**
- `ERROR_MESSAGES` - Predefined error messages for all scenarios
- `SUCCESS_MESSAGES` - Predefined success messages

**Functions:**
- `getAuthErrorMessage(code)` - Maps Firebase auth codes to messages
- `logError(context, error)` - Logs errors with context
- `handleError(error, fallback)` - Returns user-friendly error message
- `createTempMessage(setter, message, duration)` - Auto-clearing messages
- `clearMessages(setError, setSuccess)` - Clears both error and success

**Example:**
```typescript
import { ERROR_MESSAGES, createTempMessage, getAuthErrorMessage } from '@/lib/utils';

// Use predefined messages
setError(ERROR_MESSAGES.WORKSPACE_NOT_FOUND);

// Handle Firebase auth errors
const message = getAuthErrorMessage(error.code);

// Create auto-clearing message
createTempMessage(setSuccess, SUCCESS_MESSAGES.PROFILE_UPDATED, 3000);
```

### `formHelpers.ts`
Form validation and utility functions.

**Validation Functions:**
- `isValidEmail(email)` - Email format validation
- `isValidPassword(password)` - Min 6 characters
- `isValidString(value, min, max)` - String length validation
- `isValidProgress(value)` - 0-100 range validation
- `isValidPhone(phone)` - Phone number validation
- `isValidUrl(url)` - URL format validation
- `passwordsMatch(pass1, pass2)` - Password comparison
- `isEmpty(value)` - Empty string check

**Utility Functions:**
- `trimValue(value)` - Trim whitespace
- `sanitizeString(value)` - Safe display
- `formatPhoneNumber(phone)` - Format as (123) 456-7890
- `createFormData(fields)` - Create trimmed form object
- `generateId()` - Random ID generation
- `debounce(func, wait)` - Function debouncing

**File Functions:**
- `isValidFileSize(file, maxMB)` - File size validation
- `isValidFileType(file, types)` - File type validation

**Example:**
```typescript
import { isValidEmail, trimValue, createTempMessage } from '@/lib/utils';

if (!isValidEmail(email)) {
  setError(ERROR_MESSAGES.INVALID_EMAIL);
  return;
}

const cleanData = {
  name: trimValue(name),
  email: trimValue(email),
};
```

## Usage

Import utilities using the index file:

```typescript
// Import individual functions
import { formatDate, ERROR_MESSAGES, isValidEmail } from '@/lib/utils';

// Or import specific file
import { formatTime, formatRelativeTime } from '@/lib/utils/dateHelpers';
```

## Benefits

- **Consistency**: Same formatting and error messages across the app
- **Maintainability**: Update in one place, reflected everywhere
- **Type Safety**: Full TypeScript support
- **DRY**: Eliminates 50+ duplicate code patterns
- **Testability**: Isolated functions easy to unit test
