# Phase 11 — Financial Analytics & Interactive Charts

## Objective
Build a full analytics dashboard page (route `/analytics`) that shows cash flow, category breakdowns (by account and aggregate), net worth trends, spending heatmap, and period-over-period comparisons — all with interactive date range filtering and drill-down to underlying transactions.

---

## Architecture Decisions

### Routing
| Route | Page Component | Status |
|---|---|---|
| `/analytics` | `AnalyticsPage` | ✅ Created |
| `/analytics/export` | _future_ — CSV/PDF export | ❌ Not yet |

### Data Flow
```
DateRangePicker (lifted to page level)
  → useCashFlow   (hooks/useCashFlow.ts)
  → useCategoryBreakdown (hooks/useCategoryBreakdown.ts)
  → useNetWorth (hooks/useNetWorth.ts)
  → useSpendingHeatmap (hooks/useSpendingHeatmap.ts) [todo]

Each hook passes { start, end } query params
  → Backend /api/v1/analytics/* endpoints
  → Data returned typed via types/analytics.ts
```

### Component Tree (AnalyticsPage)
```
AnalyticsPage
├── DateRangePicker (header)
├── CashFlowChart (area chart)
├── CategoryBreakdownChart (pie/donut)
│   └── Account filter dropdown (all / specific account)
├── CashFlowByAccountChart (stacked bar or grouped cards) [todo]
├── NetWorthLineChart [todo]
├── SpendingHeatmap (calendar grid) [todo]
└── TopCategoriesWidget (reuse from dashboard — already imported)
```

---

## Current State of the Codebase

### ✅ Completed

#### Backend (all working)
- `GET /api/v1/analytics/cash-flow?start=&end=` → returns income/expense by month + summary
- `GET /api/v1/analytics/category-breakdown?start=&end=&account_id=` → returns category totals with percentage
- `GET /api/v1/analytics/cash-flow-by-account?start=&end=` → returns per-account cash flow
- `GET /api/v1/analytics/net-worth?start=&end=` → returns asset/liability lines + net worth over time
- All endpoints accept `start`, `end` (ISO date strings) and optional `account_id`

#### Frontend Types (`types/analytics.ts`)
- `CashFlowResponse`, `CashFlowDataPoint`, `CashFlowSummary`
- `CategoryBreakdownResponse`, `CategoryDataPoint`
- `CashFlowByAccountResponse`, `AccountCashFlow`, `AccountCashFlowDataPoint`
- `NetWorthResponse`, `NetWorthDataPoint`, `NetWorthSummary`
- All arrays use `data` wrapper consistently

#### Frontend API Hooks
| Hook | File | Status |
|---|---|---|
| `useCashFlow(start, end)` | `hooks/useCashFlow.ts` | ✅ Uses `fetchAnalytics` |
| `useCategoryBreakdown(start, end, accountId?)` | `hooks/useCategoryBreakdown.ts` | ✅ |
| `useCashFlowByAccount(start, end)` | `hooks/useCashFlowByAccount.ts` | ✅ |
| `useNetWorth(start, end)` | `hooks/useNetWorth.ts` | ✅ |

#### Frontend Charts & Components

| Component | File | Status |
|---|---|---|
| **AreaChart** (`FIPAreaChart`) | `components/charts/AreaChart.tsx` | ✅ Reusable, gradient fills, tooltip, responsive |
| **PieChart** (`FIPPieChart`) | `components/charts/PieChart.tsx` | ✅ Donut holes, sorted, custom label, responsive |
| **ChartTooltip** | `components/charts/ChartTooltip.tsx` | ✅ Shared, `formatCurrency`, colored dots |
| **DateRangePicker** | `components/charts/DateRangePicker.tsx` | ✅ Presets + custom range, click outside, Z-50 dropdown |
| **Skeleton** | `components/ui/Skeleton.tsx` | ✅ `variant="rectangular"` for charts |

**Page-level analytics components:**

| Component | File | Status |
|---|---|---|
| `CashFlowChart` | `features/analytics/components/CashFlowChart.tsx` | ✅ Area chart, dual-income/expenses, net flow badge, summary grid |
| `TopCategoriesWidget` | `features/analytics/components/TopCategoriesWidget.tsx` | ✅ Pie/donut, top-N + "Otros", loading/empty/error states |
| `CategoryBreakdownChart` | `features/analytics/components/CategoryBreakdownChart.tsx` | ✅ Donut chart with account filter, legend, per-item detail |
| `AnalyticsPage` | `features/analytics/pages/AnalyticsPage.tsx` | ✅ Route registered in router, layout with DateRangePicker, 3 widgets |

#### Analytics Page Layout
- Sticky header with page title + `DateRangePicker`
- 2-column grid (left main, right sidebar)
- CashFlowChart (full width or main)
- CategoryBreakdownChart with account filter
- TopCategoriesWidget
- Loading/empty/error states for every widget

#### Shared Base Chart Components
- `FIPAreaChart` — gradient defs, grid, axis, tooltip, responsive, empty state
- `FIPPieChart` — donut with inner label, active shape, custom label renderer, sort descending
- `ChartTooltip` — shared across all charts, dark mode support
- `DateRangePicker` — 5 presets (Este Mes, Mes Pasado, Ultimos 30/90 Dias, Este Ano) + custom range

#### Reexports (`components/charts/index.ts`)
- `FIPAreaChart`, `FIPPieChart`, `ChartTooltip`, `DateRangePicker`

#### `lib/utils.ts`
- `formatCurrency` (with Intl.NumberFormat), `cn` (clsx + tailwind-merge)

---

### ❌ Not Yet Built (Next Steps)

#### 1. Heatmap Component (`SpendingHeatmap`)
- Calendar heatmap showing daily spending amount
- Input: `{ date: string; amount: number }[]`
- Color scale: low (green) → medium (yellow) → high (red)
- Tooltip on hover: date + formatted amount
- Month labels on left, day-of-week on top
- Empty state: "Sin datos de gastos"
- File: `src/features/analytics/components/SpendingHeatmap.tsx`
- Bonus: Add `useSpendingHeatmap(start, end)` hook that calls a future `GET /api/v1/analytics/spending-heatmap` endpoint (stub locally for now, or use cash-flow data transformed to daily)

#### 2. CashFlowByAccountChart
- Per-account cash flow (income vs expenses grouped by account)
- Stacked bar chart or grouped bars
- Uses existing `useCashFlowByAccount` hook and `CashFlowByAccountResponse` type
- File: `src/features/analytics/components/CashFlowByAccountChart.tsx`
- Integrate into AnalyticsPage right sidebar or as a 3rd row

#### 3. NetWorthLineChart
- Assets, liabilities, and net worth over time
- Input: `NetWorthDataPoint[]` from `useNetWorth`
- Multi-line area chart with gradient fills
- File: `src/features/analytics/components/NetWorthChart.tsx`

#### 4. Period Comparison (vs Previous Period)
- "vs mes anterior" delta display (already partially in KPICard)
- Extend to show % change badges on cash flow totals

#### 5. Chart Export / Download
- Button in header to export chart as PNG (using `html-to-image` or canvas)
- File: `src/features/analytics/components/ExportButton.tsx`

---

## Patterns & Conventions

### Every Chart Component Follows This Template
```tsx
interface Props {
  data: SomeType | undefined
  loading: boolean
  error: boolean
}

// Skeleton variant — same as CashFlowChart
function ChartSkeleton() { ... }

export default function MyChart({ data, loading, error }: Props) {
  if (loading) return <ChartSkeleton />
  if (error) return <ErrorMessage message="..." />
  if (!data || data.data.length === 0) return <EmptyState message="..." />
  return <>{/* chart */}</>
}
```

### Dark Mode
Every chart container uses this class pattern:
```tsx
className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm"
```

### Loading States
`Skeleton component` with `variant="rectangular"` and explicit height matching the chart.

### Empty States
Flexbox centered container matching the chart height, gray muted text.

### Date Handling
All dates are ISO strings (`YYYY-MM-DD`). The `DateRangePicker` manages start/end state via `onChange(start, end)`.

---

## File Inventory

### Created / Modified in This Phase

| Path | Purpose |
|---|---|
| `src/types/analytics.ts` | All analytics response types |
| `src/hooks/useCashFlow.ts` | Cash flow data hook |
| `src/hooks/useCategoryBreakdown.ts` | Category breakdown hook |
| `src/hooks/useCashFlowByAccount.ts` | Per-account cash flow hook |
| `src/hooks/useNetWorth.ts` | Net worth hook |
| `src/components/charts/ChartTooltip.tsx` | Shared chart tooltip |
| `src/components/charts/AreaChart.tsx` | Reusable area chart |
| `src/components/charts/PieChart.tsx` | Reusable pie/donut chart |
| `src/components/charts/DateRangePicker.tsx` | Date range dropdown |
| `src/components/charts/index.ts` | Re-exports |
| `src/features/analytics/components/CashFlowChart.tsx` | Cash flow area chart |
| `src/features/analytics/components/TopCategoriesWidget.tsx` | Top categories pie |
| `src/features/analytics/components/CategoryBreakdownChart.tsx` | Category breakdown |
| `src/features/analytics/pages/AnalyticsPage.tsx` | Main analytics page |
| `src/router.tsx` | Route `/analytics` registered |

### Referenced But Not Modified

| Path | Purpose |
|---|---|
| `src/components/ui/Skeleton.tsx` | Loading skeleton with `rectangular` variant |
| `src/components/ui/ErrorMessage.tsx` | Error display component |
| `src/lib/utils.ts` | `formatCurrency`, `cn` |
| `src/types/cards.ts` | Card types (for net worth) |
| `src/types/accounts.ts` | Account types (for cash flow by account) |
| `src/features/analytics/components/KPICard.tsx` | KPI card with vs-period |
| `src/features/analytics/components/SpendingTrendChart.tsx` | Trend chart |
| `src/features/analytics/pages/DashboardPage.tsx` | Dashboard page |
| `src/hooks/useAnalytics.ts` | Shared fetch helper (`fetchAnalytics`) |

---

## Commands

```bash
# Run frontend
cd fip-frontend && npm run dev

# TypeScript check
cd fip-frontend && npx tsc --noEmit

# Check for unused exports / lint
cd fip-frontend && npm run lint
```
