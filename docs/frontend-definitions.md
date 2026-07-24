# FRONTEND-DEFINITIONS.md

Version: 1.0

Project: Financial Intelligence Platform (FIP) - Frontend

Status: Living Document

---

## Purpose

This document defines every important UI, component, pattern, and UX concept used by the frontend.

The objective is to establish a single source of truth for frontend development.

Every developer, designer, AI agent, and stakeholder must follow these definitions.

If a term is not defined here, it should not be considered part of the frontend architecture.

---

# SECTION 1

# Component Architecture

---

## UI Component

A self-contained, reusable visual element.

Rules:
- Accepts props (no internal API calls)
- Handles its own styling via TailwindCSS
- Supports dark mode via dark: variants
- Supports responsive behavior
- Includes ARIA attributes for accessibility
- Exported as default export

Examples: Button, Input, Modal, Card, Badge, Skeleton

---

## Feature Component

A component tied to a specific domain feature.

Rules:
- Uses TanStack Query for data fetching
- Uses React Hook Form for forms
- Contains domain-specific logic
- Composed of UI components
- Located in features/{domain}/

Examples: AccountList, TransactionForm, BudgetCard

---

## Page Component

Top-level route component.

Rules:
- Loaded via React.lazy for code splitting
- Wrapped in Suspense with fallback
- Orchestrates feature components
- Handles route params and search params
- One page per route

Examples: LoginPage, TransactionListPage, DashboardPage

---

## Layout Component

Wrapper component providing structure.

Rules:
- Renders children in a structured layout
- Handles sidebar, header, footer
- Responsive: mobile collapses sidebar to drawer
- Persists across route changes

Examples: MainLayout, AuthLayout, AdminLayout

---

# SECTION 2

# State Management

---

## Server State

Data that originates from the backend API.

Rules:
- Managed exclusively by TanStack Query
- Never stored in Zustand or React state
- Cached with automatic refetching
- Updated via mutations with optimistic updates
- Keyed by query key arrays

Examples: list of accounts, transaction detail, user profile

---

## Client State

UI-only state that never persists to the server.

Rules:
- Managed by Zustand for global state
- Managed by useState/useReducer for local state
- Includes UI toggles, selected filters, sidebar state
- Lost on page refresh (unless persisted)

Examples: sidebar open/closed, active filter tab, modal visibility

---

## URL State

State stored in the URL via search params.

Rules:
- Managed by React Router useSearchParams
- Includes filters, page numbers, search queries
- Shareable via URL
- Survives page refresh

Examples: ?page=2&category=food&search=netflix

---

## Form State

Temporary state for form inputs.

Rules:
- Managed by React Hook Form
- Validated with Zod schemas
- Reset on successful submission
- Never stored externally during editing

---

# SECTION 3

# Data Flow Patterns

---

## API Client (lib/api.ts)

Centralized Axios instance.

Responsibilities:
- Base URL configuration
- Auth token injection via interceptor
- Token refresh on 401
- Error transformation to standardized format
- Request cancellation support

---

## Query Hook (use{Resource})

Custom hook wrapping TanStack Query.

Pattern:
```
function useAccounts(filters?: AccountFilters) {
  return useQuery({
    queryKey: ['accounts', filters],
    queryFn: () => api.get('/accounts', { params: filters }).then(r => r.data),
  })
}
```

Returns: { data, isLoading, isError, error, refetch }

---

## Mutation Hook (use{Action}{Resource})

Custom hook wrapping TanStack Query mutation.

Pattern:
```
function useCreateAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateAccountData) => api.post('/accounts', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts'] }),
  })
}
```

Returns: { mutate, mutateAsync, isLoading, isError, error }

---

## Form Submit Pattern

1. Define Zod schema mirroring backend validation
2. Initialize useForm with zodResolver
3. Call mutation.mutateAsync on submit
4. Show success toast on resolve
5. Show error toast with field-level messages on reject
6. Reset form on success

---

# SECTION 4

# Routing & Navigation

---

## Public Route

Accessible without authentication.

Examples: /login, /register, /reset-password

---

## Protected Route

Requires valid authentication.

Behavior:
- Check auth store for token
- Redirect to /login if unauthenticated
- Redirect to intended URL after login

---

## Admin Route

Requires admin role.

Behavior:
- Check auth store for user.role === 'admin'
- Redirect to /dashboard if unauthorized
- Show 403 page if accessed directly

---

## Route Layout Hierarchy

```
<BrowserRouter>
  <Routes>
    <Route element={<AuthLayout />}>     # Public routes
      <Route path="/login" element={<LoginPage />} />
    </Route>
    <Route element={<RequireAuth />}>     # Protected routes
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route element={<RequireAdmin />}>  # Admin routes
          <Route path="/admin/users" element={<AdminUsersPage />} />
        </Route>
      </Route>
    </Route>
  </Routes>
</BrowserRouter>
```

---

# SECTION 5

# UI Patterns

---

## Loading State

Visual feedback while data is loading.

Rules:
- Always show skeleton components for lists/cards
- Show spinner for buttons during mutation
- Never show raw "Loading..." text
- Skeleton matches the final layout dimensions

Components: Skeleton, Spinner, ProgressBar

---

## Empty State

Displayed when no data exists.

Rules:
- Show illustration or icon
- Provide descriptive message
- Include CTA button to create first item
- Never show empty table rows

---

## Error State

Displayed when an operation fails.

Rules:
- Show error message (user-friendly, not technical)
- Provide retry button (refetch query or retry mutation)
- Log error to console/Sentry for debugging
- Error boundary catches unhandled errors per section

Components: ErrorMessage, ErrorBoundary, RetryButton

---

## Toast Notification

Temporary feedback message.

Rules:
- Success: green, check icon
- Error: red, x icon
- Info: blue, info icon
- Auto-dismiss after 4 seconds (except errors)
- Stack multiple toasts
- Undo action for destructive operations (soft-delete)

Library: react-hot-toast

---

## Confirmation Dialog

Modal asking user to confirm an action.

Rules:
- Used for destructive actions (delete, archive)
- Title: concise question
- Description: explain consequences
- Confirm button: red for destructive
- Cancel button: secondary

---

## Search & Filter

Pattern for list filtering.

Rules:
- Debounce search input (300ms)
- Filters as URL search params (shareable)
- Clear all filters button
- Active filter count badge
- Preserve filters on navigation back

---

## Pagination

Server-side pagination pattern.

Rules:
- Page and page_size as URL params
- Show total count
- Previous/Next buttons
- Page size selector (10, 25, 50, 100)
- Preserve page on filter change (reset to page 1)

---

# SECTION 6

# Form Patterns

---

## Form Field

Individual input with label and validation.

Structure:
```
<FormField>
  <Label>{field.label}</Label>
  <Input {...register('fieldName')} />
  <ErrorMessage>{errors.fieldName?.message}</ErrorMessage>
</FormField>
```

---

## Selector

Dropdown for choosing from options.

Types:
- AccountSelector: pick from user accounts
- CategoryPicker: hierarchical category + subcategory
- CurrencySelector: ISO 4217 currency codes
- TypeSelector: enum-based selection (expense/income/transfer)
- PeriodSelector: weekly/monthly/quarterly/yearly

---

## Date Picker

Date input component.

Rules:
- Uses date-fns for formatting
- Effective date defaults to today
- Supports date ranges for filters
- Timezone-aware display

---

## Tag Input

Multi-value text input.

Behavior:
- Type and Enter to add tag
- Backspace to remove last tag
- Display as chips/badges
- Autocomplete from existing tags

---

## Color Picker

Color selection for categories, accounts, etc.

Options:
- Predefined palette of 12 colors
- Custom hex input (#RRGGBB)
- Live preview on target element

---

## Icon Picker

Icon selection for categories, accounts, etc.

Options:
- Lucide React icons grid
- Searchable
- Categories: finance, shopping, food, transport, etc.

---

# SECTION 7

# Chart Patterns

---

## Area Chart

Used for cash flow visualization.

X-axis: time (date)
Y-axis: amount
Series: income, expenses (stacked or overlaid)
Features: gradient fill, interactive tooltip, zoom

---

## Bar Chart

Used for category breakdown, monthly comparisons.

X-axis: category or month
Y-axis: amount
Features: horizontal option, stacked bars, value labels

---

## Line Chart

Used for trends, net worth over time.

X-axis: time
Y-axis: amount
Multiple series: income trend, expense trend, net worth
Features: smooth curves, interactive legend, data points

---

## Pie/Doughnut Chart

Used for category distribution.

Slices: categories with percentage
Center: total amount (doughnut)
Features: interactive legend, hover highlight, value tooltip

---

## Heatmap

Used for spending patterns.

Grid: day-of-week (rows) x week-of-month (columns)
Color intensity: spending amount
Features: hover tooltip with exact value, color legend

---

## Gauge Chart

Used for utilization, health scores.

Semi-circular gauge.
Range: 0-100 or 0-100%
Color zones: green (0-60%), yellow (60-80%), red (80-100%)
Needle or fill indicator

---

## Progress Bar

Used for goals and budgets.

Features:
- Percentage fill
- Target amount label
- Current amount label
- Status color (on track=green, behind=yellow, critical=red)

---

# SECTION 8

# Responsive Design

---

## Breakpoints

| Breakpoint | Width | Target |
|------------|-------|--------|
| sm | 640px | Mobile landscape |
| md | 768px | Tablet |
| lg | 1024px | Desktop |
| xl | 1280px | Wide desktop |
| 2xl | 1536px | Ultra-wide |

---

## Layout Behavior

- Mobile ( < md ): Sidebar as bottom tab bar or drawer
- Tablet (md-lg): Collapsed sidebar with icons only
- Desktop (lg+): Full sidebar with labels

---

## Data Table Responsive

- Mobile: Card layout (stacked fields)
- Desktop: Table layout (columns)

---

# SECTION 9

# Accessibility

---

## Keyboard Navigation

- All interactive elements focusable
- Tab order follows visual order
- Enter/Space activates buttons
- Escape closes modals, dropdowns
- Arrow keys for selectors, date pickers
- Focus visible indicator on all elements

---

## ARIA Attributes

- role="dialog" on modals
- aria-label on icon-only buttons
- aria-expanded on dropdowns
- aria-current="page" on active nav links
- aria-live="polite" on dynamic content regions
- aria-describedby on error messages

---

## Color & Contrast

- All text meets WCAG AA contrast ratio (4.5:1)
- Color not sole indicator of status (use icons + text)
- Dark mode maintains contrast requirements
- Error states use icon + color + text

---

# SECTION 10

# Performance

---

## Code Splitting

- Every page component loaded via React.lazy
- Feature modules chunked separately
- Vendor chunk for node_modules
- Route-based splitting (one chunk per route)

---

## Image Optimization

- Use WebP format where supported
- Lazy loading with loading="lazy"
- Responsive sizes with srcSet
- Placeholder blur while loading

---

## List Virtualization

- TanStack Table with virtual rows
- Only render visible rows
- Fixed row height for performance
- Used for: transactions, expenses, incomes (large lists)

---

## Memoization

- useMemo for expensive computations (totals, averages, chart data)
- useCallback for event handlers passed to children
- React.memo for list items and chart components
- Avoid premature optimization

---

# SECTION 11

# Theming

---

## Theme Variables

Defined in TailwindCSS config.

Light mode: default
Dark mode: via dark: prefix

CSS custom properties:
- --color-primary
- --color-background
- --color-surface
- --color-text
- --color-border
- --color-success
- --color-warning
- --color-danger
- --color-info

---

## Dark Mode

- Toggle stored in Zustand (persisted)
- Applied via class strategy on <html>
- Tailwind dark: variant for all components
- Charts use dark theme colors
- All colors defined as CSS variables

---

# SECTION 12

# Error Handling

---

## API Error

Standardized error from backend.

Shape:
```typescript
interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: Array<{ field: string; message: string }>
  }
}
```

Handling:
- Network error: "Unable to connect to server. Check your connection."
- 401: Auto-refresh token or redirect to login
- 403: Show "You don't have permission" with contact admin message
- 422: Map field errors to form fields
- 429: Show "Too many requests. Please wait."
- 500: Show "Something went wrong. Please try again."

---

## React Error Boundary

Class component wrapping feature sections.

Behavior:
- Catches render errors
- Logs to console/Sentry
- Shows fallback UI with retry button
- Does not crash the entire app

---

# SECTION 13

# Testing

---

## Unit Test

Tests a single function, hook, or utility.

Framework: Vitest
File: co-located as *.test.ts or *.test.tsx
Coverage: 100% of utils, services, hooks logic

---

## Component Test

Tests a single component in isolation.

Framework: Vitest + Testing Library
File: co-located as *.test.tsx
Coverage: All UI components, all form interactions
Pattern: render -> query -> assert

---

## Integration Test

Tests a complete user flow.

Framework: Vitest + Testing Library + MSW
File: __tests__/*.test.tsx
Coverage: All critical paths (login, create transaction, etc.)
MSW handles all API mocking

---

# SECTION 14

# Build & Deploy

---

## Development Build

Command: pnpm dev
Port: 5173 (Vite default)
Features: HMR, source maps, debug logging

---

## Production Build

Command: pnpm build
Output: dist/
Features: minified, code-split, tree-shaken, hashed filenames

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| VITE_API_URL | Backend API base URL | http://localhost:8000/api/v1 |
| VITE_APP_NAME | Application name | FIP |
| VITE_SENTRY_DSN | Sentry error tracking | https://... |
| VITE_ENABLE_MOCK | Enable MSW in dev | true |

---
