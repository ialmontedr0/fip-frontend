# AGENTS.md

# Financial Intelligence Platform (FIP) - Frontend

Version: 1.0

---

## Project Overview

This is the frontend for the Financial Intelligence Platform (FIP), a comprehensive personal financial management application. The backend is a Python FastAPI application exposing a REST API at /api/v1. This frontend consumes that API.

The frontend must handle:
- Personal finance management (accounts, transactions, categories)
- Financial analytics and dashboards
- Budget optimization and tracking
- Goal tracking with predictions
- AI-powered recommendations and insights
- Intelligent automation rules
- Financial reporting (imports/exports)
- Multi-currency support with exchange rates
- Role-based admin panel

---

## Technology Stack

| Category | Choice | Justification |
|----------|--------|---------------|
| Framework | React 18+ with TypeScript | Industry standard, strong typing, ecosystem |
| Build Tool | Vite 5+ | Fast HMR, native ESM, excellent DX |
| Styling | TailwindCSS v3+ | Utility-first, rapid UI, consistent design |
| Routing | React Router v6 | Declarative routing, loaders, actions |
| Server State | TanStack Query v5 | Caching, refetching, optimistic updates |
| Client State | Zustand | Minimal boilerplate, TypeScript-first |
| HTTP Client | Axios | Interceptors, cancellation, base URLs |
| Forms | React Hook Form + Zod | Performant forms, schema validation |
| Charts | Recharts | React-native charting, composable |
| Icons | Lucide React | Clean, consistent icon set |
| Dates | date-fns | Tree-shakeable, immutable |
| Tables | TanStack Table v8 | Headless, virtualized, sortable |
| Testing | Vitest + Testing Library | Fast, Vite-native, component testing |
| Linting | ESLint + Prettier | Consistent code style |
| Drag and Drop | @hello-pangea/dnd | Accessible, maintained dnd library |
| Notifications | react-hot-toast | Lightweight, customizable toasts |

---

## Architecture

### Project Structure

```
frontend/
  src/
    components/          # Shared/reusable UI components
      ui/               # Base UI primitives (Button, Input, Modal, etc.)
      layout/           # Layout components (Sidebar, Header, MainLayout)
      charts/           # Chart components (reusable wrappers)
    features/           # Feature-based modules (domain-driven)
      auth/             # Login, Register, MFA, Password Reset
      accounts/         # Account CRUD, summary
      wallets/          # Wallet CRUD, balance, liquidity
      transactions/     # Transaction list, create, edit, transfer
      categories/       # Category CRUD, categorization
      incomes/          # Income CRUD, sources, schedules
      expenses/         # Expense CRUD, templates, services, subscriptions
      goals/            # Goal CRUD, simulation
      budgets/          # Budget CRUD, alerts
      cards/            # Credit card CRUD, bills, limits
      loans/            # Loan CRUD, amortization, payments
      analytics/        # KPIs, charts, dashboards
      ai/               # AI features (classify, predict, recommend)
      automations/      # Automation rules, execution logs
      notifications/    # In-app notifications, preferences
      imports/          # Import wizard
      exports/          # Export downloads
      admin/            # User/role/permission management
      settings/         # Profile, preferences, security
    hooks/              # Shared custom hooks
    lib/                # Utility functions, API client, constants
    stores/             # Zustand stores
    types/              # TypeScript types (matching backend schemas)
    routes/             # Route definitions
    App.tsx             # Root component
    main.tsx            # Entry point
    index.css           # Tailwind imports
    vite.config.ts
```

### Architectural Rules

- Domain-driven structure: Group by feature, not by technical role.
- No business logic in components: Extract to hooks, services, or stores.
- API layer abstraction: All API calls go through lib/api.ts.
- Type safety: Every API response/request must have a TypeScript interface.
- Server state: Use TanStack Query for all server data. Never store API data in Zustand.
- Client state: Use Zustand for UI state only (sidebar, filters, etc.).
- Forms: Use React Hook Form for all forms. Use Zod schemas for validation.

---

## Coding Conventions

### Naming
- Components: PascalCase (AccountList.tsx, TransactionForm.tsx)
- Files: PascalCase for components, camelCase for utilities (api.ts, formatCurrency.ts)
- Functions: camelCase, verbs for handlers (handleSubmit, onChange)
- Variables: camelCase
- Types/Interfaces: PascalCase with I prefix (IAccount, ITransaction)
- Enums: PascalCase (AccountType, TransactionStatus)

### TypeScript
- Strict mode enabled
- Prefer interface over type for object shapes
- Use type for unions, intersections, and primitives
- Avoid any - use unknown and type guards
- Import types with import type syntax

### Component Design
- One component per file (except tiny helpers)
- Default export for main component, named exports for sub-components
- Props interfaces defined in the same file
- Destructure props in function signature

### State Management Rules
- Server state (API data) -> TanStack Query (useQuery, useMutation)
- URL state (filters, page, search) -> React Router search params
- Client state (UI toggles, form state) -> Zustand or component state
- Form state -> React Hook Form
- Never store API data in client state

---

## API Integration Pattern

```typescript
// lib/api.ts
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshed = await refreshToken()
      if (refreshed) return api.request(error.config)
      logout()
    }
    return Promise.reject(error)
  }
)
```

```typescript
// features/accounts/hooks/useAccounts.ts
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

export function useAccounts() {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: () => api.get('/accounts').then((r) => r.data),
  })
}
```

---

## Form Handling Pattern

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import api from '@/lib/api'

const schema = z.object({
  name: z.string().min(1).max(100),
  amount: z.string().refine((v) => !isNaN(Number(v)), 'Must be a number'),
})

type FormData = z.infer<typeof schema>

function AccountForm() {
  const form = useForm<FormData>({ resolver: zodResolver(schema) })
  const mutation = useMutation({
    mutationFn: (data: FormData) => api.post('/accounts', data),
  })
  const onSubmit = (data: FormData) => mutation.mutateAsync(data)
  // ...
}
```

---

## Routing Structure

```
/                        -> Redirect to /dashboard
/login                   -> LoginPage
/register                -> RegisterPage
/mfa                     -> MFAChallengePage
/reset-password          -> RequestResetPage
/reset-password/:token   -> ResetPasswordPage
/verify-email/:token     -> VerifyEmailPage
/dashboard               -> DashboardPage (protected)
/accounts                -> AccountListPage
/accounts/new            -> AccountCreatePage
/accounts/:id            -> AccountDetailPage
/wallets                 -> WalletListPage
/wallets/new             -> WalletCreatePage
/wallets/:id             -> WalletDetailPage
/transactions            -> TransactionListPage
/transactions/new        -> TransactionCreatePage
/transactions/:id        -> TransactionDetailPage
/transactions/transfer   -> TransferPage
/categories              -> CategoryListPage
/categories/:id          -> CategoryDetailPage
/incomes                 -> IncomeListPage
/incomes/new             -> IncomeCreatePage
/incomes/sources         -> IncomeSourcesPage
/incomes/schedules       -> IncomeSchedulesPage
/expenses                -> ExpenseListPage
/expenses/new            -> ExpenseCreatePage
/expenses/templates      -> ExpenseTemplatesPage
/expenses/services       -> ServicesPage
/expenses/subscriptions  -> SubscriptionsPage
/expenses/credit-cards   -> CreditCardsPage
/goals                   -> GoalListPage
/goals/new               -> GoalCreatePage
/goals/:id               -> GoalDetailPage
/budgets                 -> BudgetListPage
/budgets/new             -> BudgetCreatePage
/budgets/:id             -> BudgetDetailPage
/cards                   -> CardListPage
/cards/:id               -> CardDetailPage
/loans                   -> LoanListPage
/loans/new               -> LoanCreatePage
/loans/:id               -> LoanDetailPage
/analytics               -> AnalyticsDashboardPage
/ai                      -> AIPage (tabs for each AI feature)
/automations             -> AutomationListPage
/automations/new         -> AutomationCreatePage
/automations/:id         -> AutomationDetailPage
/notifications           -> NotificationsPage
/notifications/preferences -> NotificationPreferencesPage
/imports                 -> ImportPage (wizard)
/imports/history         -> ImportHistoryPage
/exports                 -> ExportPage
/admin/users             -> AdminUsersPage
/admin/roles             -> AdminRolesPage
/admin/permissions       -> AdminPermissionsPage
/admin/audit-logs        -> AuditLogsPage
/admin/stats             -> AdminStatsPage
/settings                -> SettingsPage
/settings/profile        -> ProfilePage
/settings/security       -> SecurityPage (MFA, sessions)
/settings/preferences    -> PreferencesPage
```

---

## Security Rules

- Store tokens in memory (Zustand) + httpOnly cookie for refresh if possible
- Never store tokens in localStorage (XSS vulnerability)
- Clear tokens on logout
- Auto-refresh on 401 (Axios interceptor)
- Protected route wrapper that checks auth state
- Role-based route guards for admin pages
- Sanitize all user input before display
- Use HTTPS in production

---

## Performance Rules

- Lazy load routes with React.lazy + Suspense
- Paginate all lists (server-side)
- Debounce search inputs
- Memoize expensive computations (useMemo, useCallback)
- Use React.memo for frequently re-rendered components
- Virtualized lists for large datasets
- Image optimization (lazy loading, responsive sizes)
- Bundle analysis with vite-bundle-analyzer

---

## Testing Strategy

- Unit tests: Vitest for pure functions, hooks, utils
- Component tests: Testing Library for component behavior
- Integration tests: MSW for API mocking, test full flows
- E2E tests: Playwright (future phase)
- Test file co-located with source file: Button.test.tsx next to Button.tsx
- Minimum 80% coverage on business logic

---

## Git Rules

- Conventional commits: feat:, fix:, refactor:, docs:, test:, chore:
- Branch naming: feat/feature-name, fix/bug-name, chore/task-name
- PRs require: lint passes, tests pass, coverage maintained

---

## Development Setup

```bash
# Prerequisites
node >= 18
pnpm >= 8

# Install
pnpm install

# Dev server
pnpm dev

# Type check
pnpm typecheck

# Lint
pnpm lint

# Test
pnpm test

# Build
pnpm build
```
