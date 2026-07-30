# fip-frontend — Full Codebase Issue Report

Generated: exhaustive audit of all `.ts`/`.tsx` files under `src/`

---

## 🔴 Critical (Will Throw or Break at Runtime)

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 1 | `routers.tsx` | 4, 48, 56 | Imports `AnalyticsPage` (doesn't exist) — should be `AIPage` from `./analytics/pages/AIPage` |
| 2 | `analytics/api/analytics.ts` | 21 | Exports `getChashFlow` (typo — should be `getCashFlow`) |
| 3 | `analytics/hooks/useAnalytics.ts` | 5, 38 | Imports & calls `getChashFlow` (typo) |
| 4 | `analytics/pages/AIPage.tsx` | 21 | `onChage` on `<textarea>` (typo — should be `onChange`) |
| 5 | `analytics/pages/AIPage.tsx` | 35 | `{response}` in JSX — variable `response` is never declared/initialized |
| 6 | `analytics/pages/AIPage.tsx` | 33 | `{userMessage}` — variable is `userMessage`, case mismatch |

## 🟠 Type Safety (Overuse of `any`)

| # | File | Line(s) | Detail |
|---|------|---------|--------|
| 7 | `auth/hooks/useAuth.ts` | 3 | `setUser: (user: any) => void` |
| 8 | `auth/components/ResetPasswordForm.tsx` | 5 | `catch (error: any)` — TS forbids type annotations on catch |
| 9 | `transactions/api/transactions.ts` | 1, 8 | `params?: any` |
| 10 | `transactions/components/TransactionsTable.tsx` | 5 | `mutation: any` prop |
| 11 | `analytics/hooks/useAnalytics.ts` | 47 | `error: any` in catch |
| 12 | `shared/hooks/useApi.ts` | 1, 14, 16, 21 | Entire file uses `any` liberally |
| 13 | `shared/components/PinInput.tsx` | ~1 | Props typed inline with `any`-like loose types |

## 🟡 React Best-Practices Violations

### Missing `key` in `.map()`
| # | File | Line | Element |
|---|------|------|---------|
| 14 | `analytics/pages/DashboardPage.tsx` | 73 | Quick actions buttons |
| 15 | `cards/components/virtual-card.tsx` | 6 | Dots iteration |
| 16 | `auth/components/LoginForm.tsx` | 28 | Form fields |
| 17 | `cards/components/virtual-card.tsx` | 51 | Card number digits |

### `useEffect` Issues
| # | File | Line(s) | Problem |
|---|------|---------|---------|
| 18 | `auth/hooks/useAuth.ts` | 17 | Effect depends on `[navigate]` but likely needs `[isAuthenticated]` |
| 19 | `analytics/hooks/useAnalytics.ts` | 10 | Inline object `{ page: 1, … }` recreated every render — unstable dep → infinite loop risk |
| 20 | `auth/components/ResetPasswordForm.tsx` | 15 | `useEffect` with **no dependency array** → runs every render |
| 21 | `auth/components/LoginForm.tsx` | 36 | `[errors]` — `errors` is recreated every render |

### Redundant / Derived State
| # | File | Line | Detail |
|---|------|------|--------|
| 22 | `transactions/components/TransactionsTable.tsx` | 7 | `useState` for filter — should be `useMemo` |

## 🔵 Structural & Design Issues

### Dead / Unreachable / Unused Code
| # | File | Line(s) | Detail |
|---|------|---------|--------|
| 23 | `analytics/hooks/useAnalytics.ts` | 57–64 | `if (enabled)` wraps entire return; returns `undefined` when `false` (dead branch) |
| 24 | `routers.tsx` | 8 | Unused import `Login` |
| 25 | `auth/components/ResetPasswordForm.tsx` | 1–3 | Unused imports `React`, `useNavigate`, `useSearchParams` |
| 26 | `shared/components/BalanceCard.tsx` | 1–3 | Unused `React`, `ChevronRight`, `formatDistanceToNow` |
| 27 | `analytics/hooks/useAnalytics.ts` | 1–3 | Unused `useMemo`, `useCallback`, many unused query hooks |
| 28 | `shared/api/client.ts` | 1 | `apiClient` exported but never imported by any file |

### API / Endpoint Inconsistency
| # | File | Detail |
|---|------|--------|
| 29 | `auth/api/auth.ts` | Direct `fetch` calls with inline URLs — no shared base path |
| 30 | `transactions/hooks/useTransactions.ts` | Uses `useApi` generic hook — inconsistent with auth pattern |
| 31 | `analytics/api/analytics.ts` | Explicit full URLs hardcoded |
| 31b | `shared/api/client.ts` | Exists but unused — no centralized base URL in use |

### Missing CSS `@keyframes`
| # | File | Lines | Detail |
|---|------|-------|--------|
| 32 | `analytics/pages/DashboardPage.tsx` | 63, 79, 132, 151, 168 | `animation: 'fadeIn 0.5s…'` — `@keyframes fadeIn` is never defined in any stylesheet |

### Catch-Block Error Handling
| # | File | Line | Problem |
|---|------|------|---------|
| 33 | `shared/hooks/useApi.ts` | 11 | `catch (error) { throw error }` — `error` is `unknown`, violates typed return `ApiResponse<T>` |
| 34 | `analytics/hooks/useAnalytics.ts` | 47 | `catch (error: any)` — re-throws untyped |

## 🟢 Minor / Nitpicks

| # | File | Issue |
|---|------|-------|
| 35 | `analytics/pages/AIPage.tsx` | Inline `style` objects created every render (could be extracted to `useMemo`) |
| 36 | `analytics/hooks/useAnalytics.ts` | Mix of `useQuery` and raw `fetch` — inconsistent patterns |
| 37 | Whole app | No loading skeletons — only spinner/text |

---

## ✅ What's Actually Good

| Aspect | Files | Why |
|--------|-------|-----|
| Clean component structure | `Sidebar.tsx`, `BalanceCard.tsx`, `AIPage.tsx` | Single-responsibility, well-scoped |
| Auth context pattern | `AuthProvider.tsx` | Standard React context — works |
| Custom hook for API | `useApi.ts` | Centralizes loading/error/data state (despite `any` issues) |
| PinInput UX | `PinInput.tsx` | Auto-focus, auto-advance, paste support — thoughtful |
| Skeleton loading | `TransactionsTable.tsx` | Good loading state pattern |
| Dashboard layout | `DashboardPage.tsx` | Clean grid layout, readable structure |
| Virtual card component | `virtual-card.tsx` | Visually well-structured |

---

## 🎯 Recommended Order of Fixes

1. **Fix the 6 critical runtime errors** (#1–6)
2. **Remove unused imports** to clear noise (#24–28)
3. **Add `key` props** to all `.map()` loops (#14–17)
4. **Replace `any`** in key shared files: `useApi.ts`, `useAuth.ts`, `transactions.ts` (#7–13)
5. **Fix `useEffect` deps** (#18–21)
6. **Define `@keyframes fadeIn`** or replace with Tailwind classes (#32)
7. **Centralize API base URL** and consolidate fetch patterns (#29–31b)
