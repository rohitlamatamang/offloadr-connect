# Form Components

Reusable, consistent form components to eliminate duplication and maintain design consistency across the application.

## Components

### FormInput
Text input component with label, error handling, and two style variants.

**Props:**
- `label?: string` - Input label text
- `error?: string` - Error message to display
- `helperText?: string` - Helper text below input
- `variant?: "default" | "rounded"` - Style variant (default: "default")
- All standard HTML input attributes

**Example:**
```tsx
import { FormInput } from "@/components/forms";

<FormInput
  label="Email Address"
  type="email"
  placeholder="you@company.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={emailError}
  required
/>

<FormInput
  label="Phone Number"
  type="tel"
  variant="rounded"
  placeholder="+1 (555) 123-4567"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
/>
```

### FormSelect
Select dropdown with label, error handling, and support for option arrays or children.

**Props:**
- `label?: string` - Select label text
- `error?: string` - Error message to display
- `helperText?: string` - Helper text below select
- `variant?: "default" | "rounded"` - Style variant (default: "default")
- `options?: FormSelectOption[]` - Array of {value, label} objects
- All standard HTML select attributes

**Example:**
```tsx
import { FormSelect, FormSelectOption } from "@/components/forms";

const timeZones: FormSelectOption[] = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
];

<FormSelect
  label="Time Zone"
  variant="rounded"
  value={timeZone}
  onChange={(e) => setTimeZone(e.target.value)}
  options={timeZones}
/>

// Or with children:
<FormSelect
  label="Contact Method"
  value={method}
  onChange={(e) => setMethod(e.target.value)}
>
  <option value="email">Email</option>
  <option value="phone">Phone</option>
  <option value="whatsapp">WhatsApp</option>
</FormSelect>
```

### FormTextarea
Textarea component with label, error handling, and optional character counter.

**Props:**
- `label?: string` - Textarea label text
- `error?: string` - Error message to display
- `helperText?: string` - Helper text below textarea
- `variant?: "default" | "rounded"` - Style variant (default: "default")
- `showCharCount?: boolean` - Show character counter (requires maxLength)
- All standard HTML textarea attributes

**Example:**
```tsx
import { FormTextarea } from "@/components/forms";

<FormTextarea
  label="Description"
  placeholder="Enter project description..."
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  rows={4}
  required
/>

<FormTextarea
  label="Message"
  variant="rounded"
  placeholder="Write your message here..."
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  rows={4}
  maxLength={500}
  showCharCount
/>
```

### FormSection
Container component for grouping related form fields with optional title and description.

**Props:**
- `title?: string` - Section title
- `description?: string` - Section description
- `children: ReactNode` - Form fields to display
- `variant?: "default" | "bordered"` - Style variant (default: "default")
- `className?: string` - Additional CSS classes

**Example:**
```tsx
import { FormSection, FormInput, FormSelect } from "@/components/forms";

<FormSection
  title="Personal Information"
  description="Your basic contact details"
>
  <FormInput
    label="Full Name"
    type="text"
    value={name}
    onChange={(e) => setName(e.target.value)}
  />
  <FormInput
    label="Email"
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
</FormSection>

<FormSection
  title="Client Information"
  variant="bordered"
>
  <FormSelect label="Client Type" {...props}>
    <option value="individual">Individual</option>
    <option value="company">Company</option>
  </FormSelect>
</FormSection>
```

## Design System

### Variants
- **default**: Standard rounded-lg with border and smaller padding (used in login/signup)
- **rounded**: Rounded-xl with border-2 and larger padding (used in profile/admin forms)

### Color Scheme
- **Primary**: `#FF4D28` (focus states, active borders)
- **Text**: `#1A1A1A` (main text)
- **Gray**: Various shades for borders, labels, helper text
- **Error**: Red tones for validation errors

### Focus States
- Default variant: `focus:ring-[#FF4D28]/20`
- Rounded variant: `focus:ring-[#FF4D28]/30`
- Error state: `focus:ring-red-500/20`

## Migration Guide

### Before (duplicated code):
```tsx
<div>
  <label className="block text-sm font-semibold text-gray-700 mb-2">
    Phone Number
  </label>
  <input
    type="tel"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#FF4D28]/30 focus:border-[#FF4D28] transition-all duration-200"
    placeholder="+1 (555) 123-4567"
  />
</div>
```

### After (using FormInput):
```tsx
<FormInput
  label="Phone Number"
  type="tel"
  variant="rounded"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  placeholder="+1 (555) 123-4567"
/>
```

## Benefits

1. **Consistency**: Unified styling across all forms
2. **Maintainability**: Change styles in one place
3. **Accessibility**: Built-in label associations and ARIA support
4. **Error Handling**: Standardized error display
5. **Type Safety**: Full TypeScript support with proper prop types
6. **Reduced Code**: 70-80% less code in form components
7. **Variants**: Easy switching between design systems (default/rounded)
