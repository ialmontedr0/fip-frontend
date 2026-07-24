# Fase 2: Dashboard & Layout Global - Guia de Implementacion

Version: 1.0
Proyecto: Financial Intelligence Platform (FIP) - Frontend

---

## Indice

1. [Resumen de la Fase](#1-resumen-de-la-fase)
2. [Endpoints del Backend](#2-endpoints-del-backend)
3. [Tipos de TypeScript](#3-tipos-de-typescript)
4. [API Client para Analytics](#4-api-client-para-analytics)
5. [Hooks de TanStack Query](#5-hooks-de-tanstack-query)
6. [Chart Components Base](#6-chart-components-base)
7. [KPI Card Component](#7-kpi-card-component)
8. [DateRangePicker Global](#8-daterangepicker-global)
9. [Widgets del Dashboard](#9-widgets-del-dashboard)
10. [DashboardPage Completa](#10-dashboardpage-completa)
11. [Header: Busqueda Global y Notificaciones](#11-header-busqueda-global-y-notificaciones)
12. [Loading Skeletons por Widget](#12-loading-skeletons-por-widget)
13. [Error Boundaries por Seccion](#13-error-boundaries-por-seccion)
14. [Sidebar: Navegacion Completa](#14-sidebar-navegacion-completa)
15. [Verificacion Final](#15-verificacion-final)

---

## 1. Resumen de la Fase

**Estado actual:** Fase 1 completada (autenticacion funcional con login, register, MFA, password reset, verify email).

**Objetivos de Fase 2:**

| Area | Que hay que hacer |
|------|-------------------|
| Sidebar | Ya existe con navegacion completa y collapse. Agregar indicador de seccion activa, badges de notificaciones |
| Header | Tiene theme toggle, avatar dropdown. Agregar busqueda global, indiador de notificaciones con badge |
| Dashboard | Placeholder con spinner. Reemplazar con KPIs reales, charts, widgets |
| Charts | Crear wrappers de Recharts: AreaChart, BarChart, PieChart, LineChart |
| KPI Cards | Componente reutilizable con icono, valor, label, cambio %, color |
| DateRangePicker | Selector de rango de fechas global para filtrar dashboard |
| Skeletons | Loading states para cada widget del dashboard |
| Error Boundaries | Catch de errores por seccion del dashboard |
| Responsive | Sidebar como drawer en mobile (ya implementado), grid responsivo |

---

## 2. Endpoints del Backend

Todos los endpoints de analytics estan en `/api/v1/analytics/` y requieren autenticacion (Bearer token).

### 2.1 Dashboard Consolidado

```
GET /api/v1/analytics/dashboard
```

**Respuesta** (del repositorio `analytics_repository.py:851-948`):

```typescript
{
  kpis: {
    period: { year: number, month: number, start: string, end: string },
    total_income: number,
    total_expenses: number,
    net_flow: number,
    savings_rate: number,
    transaction_count: number,
    average_transaction: number,
    comparison: {
      prev_income: number,
      prev_expenses: number,
      income_change_pct: number,
      expense_change_pct: number,
    },
  },
  net_worth: {
    net_worth: number,
    total_assets: number,
    total_liabilities: number,
    credit_card_debt: number,
    assets_by_type: Record<string, { total: number, accounts: Array<{ name: string, balance: number, currency: string }> }>,
    liabilities_by_type: Record<string, { total: number, loans: Array<{ name: string, balance: number, monthly_payment: number }> }>,
  },
  portfolio: {
    net_worth: number,
    total_assets: number,
    total_liabilities: number,
    debt_to_income: number,
    total_monthly_debt_payments: number,
    avg_monthly_income: number,
    active_budgets: number,
    active_goals: number,
    active_loans: number,
  },
  cash_flow: {
    start: string,
    end: string,
    data: Array<{ month: string, income: number, expenses: number, net_flow: number, is_positive: boolean }>,
    summary: { total_income: number, total_expenses: number, net_flow: number, months: number, positive_months: number, negative_months: number },
  },
  top_categories: {
    transaction_type: string,
    start: string,
    end: string,
    top_categories: Array<{ category: string, icon: string | null, color: string | null, total: number, count: number, percentage: number }>,
  },
  spending_trend: {
    period: string,
    start: string,
    end: string,
    data: Array<{ period: string, total: number, count: number }>,
    summary: { total_spent: number, average: number, max: number, min: number, periods: number },
  },
  upcoming_payments: Array<{ name: string, payment: number, due_date: string | null }>,
  goals: Array<{ name: string, target: number, current: number, progress_pct: number, target_date: string | null }>,
}
```

> **IMPORTANTE:** La respuesta del backend **NO** esta envuelta en `{ success: true, data: ... }`. Es el objeto directo.

### 2.2 KPIs Mensuales

```
GET /api/v1/analytics/kpis/monthly?year=2026&month=7
```

### 2.3 Cash Flow

```
GET /api/v1/analytics/cash-flow?start_date=2026-01-01&end_date=2026-07-23
```

### 2.4 Net Worth

```
GET /api/v1/analytics/net-worth
```

### 2.5 Category Breakdown

```
GET /api/v1/analytics/categories/breakdown?start_date=...&end_date=...&transaction_type=expense
```

### 2.6 Spending Trend

```
GET /api/v1/analytics/trends/spending?start_date=...&end_date=...&period=monthly
```

### 2.7 Income Trend

```
GET /api/v1/analytics/trends/income?start_date=...&end_date=...&period=monthly
```

### 2.8 Top Categories

```
GET /api/v1/analytics/categories/top?start_date=...&end_date=...&limit=5&transaction_type=expense
```

### 2.9 Portfolio KPIs

```
GET /api/v1/analytics/kpis/portfolio
```

---

## 3. Tipos de TypeScript

Crear `src/types/analytics.ts`:

```typescript
// ============================================================
// Dashboard response types (mirando backend analytics_repository)
// ============================================================

export interface DashboardResponse {
  kpis: MonthlyKPIs
  net_worth: NetWorthResponse
  portfolio: PortfolioKPIs
  cash_flow: CashFlowResponse
  top_categories: TopCategoriesResponse
  spending_trend: TrendResponse
  upcoming_payments: UpcomingPayment[]
  goals: GoalProgress[]
}

export interface MonthlyKPIs {
  period: { year: number; month: number; start: string; end: string }
  total_income: number
  total_expenses: number
  net_flow: number
  savings_rate: number
  transaction_count: number
  average_transaction: number
  comparison: {
    prev_income: number
    prev_expenses: number
    income_change_pct: number
    expense_change_pct: number
  }
}

export interface NetWorthResponse {
  net_worth: number
  total_assets: number
  total_liabilities: number
  credit_card_debt: number
  assets_by_type: Record<string, { total: number; accounts: Array<{ name: string; balance: number; currency: string }> }>
  liabilities_by_type: Record<string, { total: number; loans: Array<{ name: string; balance: number; monthly_payment: number }> }>
}

export interface PortfolioKPIs {
  net_worth: number
  total_assets: number
  total_liabilities: number
  debt_to_income: number
  total_monthly_debt_payments: number
  avg_monthly_income: number
  active_budgets: number
  active_goals: number
  active_loans: number
}

export interface CashFlowResponse {
  start: string
  end: string
  data: CashFlowItem[]
  summary: { total_income: number; total_expenses: number; net_flow: number; months: number; positive_months: number; negative_months: number }
}

export interface CashFlowItem {
  month: string
  income: number
  expenses: number
  net_flow: number
  is_positive: boolean
}

export interface TopCategoriesResponse {
  transaction_type: string
  start: string
  end: string
  top_categories: CategoryBreakdownItem[]
}

export interface CategoryBreakdownItem {
  category: string
  icon: string | null
  color: string | null
  total: number
  count: number
  percentage: number
}

export interface TrendResponse {
  period: string
  start: string
  end: string
  data: TrendItem[]
  summary: { total_spent?: number; total_income?: number; average: number; max?: number; min?: number; periods: number }
}

export interface TrendItem {
  period: string
  total: number
  count: number
}

export interface UpcomingPayment {
  name: string
  payment: number
  due_date: string | null
}

export interface GoalProgress {
  name: string
  target: number
  current: number
  progress_pct: number
  target_date: string | null
}

// ============================================================
// Query params
// ============================================================

export interface DateRangeParams {
  start_date?: string
  end_date?: string
}
```

---

## 4. API Client para Analytics

Crear `src/features/analytics/api/analytics.ts`:

```typescript
import api from '@/lib/api'
import type { DashboardResponse, DateRangeParams } from '@/types/analytics'

export function getDashboard() {
  return api.get<DashboardResponse>('/analytics/dashboard')
}

export function getMonthlyKPIs(year?: number, month?: number) {
  return api.get<DashboardResponse['kpis']>('/analytics/kpis/monthly', {
    params: { year, month },
  })
}

export function getCashFlow(params?: DateRangeParams) {
  return api.get<DashboardResponse['cash_flow']>('/analytics/cash-flow', { params })
}

export function getNetWorth() {
  return api.get<DashboardResponse['net_worth']>('/analytics/net-worth')
}

export function getCategoryBreakdown(params?: DateRangeParams & { transaction_type?: string }) {
  return api.get<DashboardResponse['top_categories']>('/analytics/categories/breakdown', { params })
}

export function getSpendingTrend(params?: DateRangeParams & { period?: string }) {
  return api.get<DashboardResponse['spending_trend']>('/analytics/trends/spending', { params })
}

export function getIncomeTrend(params?: DateRangeParams & { period?: string }) {
  return api.get<DashboardResponse['spending_trend']>('/analytics/trends/income', { params })
}

export function getTopCategories(params?: DateRangeParams & { limit?: number; transaction_type?: string }) {
  return api.get<DashboardResponse['top_categories']>('/analytics/categories/top', { params })
}

export function getPortfolioKPIs() {
  return api.get<DashboardResponse['portfolio']>('/analytics/kpis/portfolio')
}
```

---

## 5. Hooks de TanStack Query

Crear `src/features/analytics/hooks/useAnalytics.ts`:

```typescript
import { useQuery } from '@tanstack/react-query'
import {
  getDashboard, getMonthlyKPIs, getCashFlow,
  getNetWorth, getSpendingTrend, getIncomeTrend,
  getTopCategories, getPortfolioKPIs,
} from '../api/analytics'
import type { DateRangeParams } from '@/types/analytics'

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => getDashboard().then((r) => r.data),
    staleTime: 1000 * 60 * 2, // 2 minutos
  })
}

export function useMonthlyKPIs(year?: number, month?: number) {
  return useQuery({
    queryKey: ['kpis', 'monthly', year, month],
    queryFn: () => getMonthlyKPIs(year, month).then((r) => r.data),
  })
}

export function useCashFlow(params?: DateRangeParams) {
  return useQuery({
    queryKey: ['cash-flow', params],
    queryFn: () => getCashFlow(params).then((r) => r.data),
  })
}

export function useNetWorth() {
  return useQuery({
    queryKey: ['net-worth'],
    queryFn: () => getNetWorth().then((r) => r.data),
  })
}

export function useSpendingTrend(params?: DateRangeParams & { period?: string }) {
  return useQuery({
    queryKey: ['spending-trend', params],
    queryFn: () => getSpendingTrend(params).then((r) => r.data),
  })
}

export function useIncomeTrend(params?: DateRangeParams & { period?: string }) {
  return useQuery({
    queryKey: ['income-trend', params],
    queryFn: () => getIncomeTrend(params).then((r) => r.data),
  })
}

export function useTopCategories(params?: DateRangeParams & { limit?: number; transaction_type?: string }) {
  return useQuery({
    queryKey: ['top-categories', params],
    queryFn: () => getTopCategories(params).then((r) => r.data),
  })
}

export function usePortfolioKPIs() {
  return useQuery({
    queryKey: ['portfolio-kpis'],
    queryFn: () => getPortfolioKPIs().then((r) => r.data),
  })
}
```

---

## 6. Chart Components Base

Crear `src/components/charts/` con wrappers de Recharts.

Cada chart debe:
- Aceptar `data` como prop (array de objetos)
- Aceptar `xKey` y `yKey` opcionales (strings para acceder a las keys)
- Soportar dark mode via CSS variables
- Ser responsive (width="100%", aspect ratio)
- Tener tooltips personalizados (formato de moneda)
- Incluir aria-label para accesibilidad

### 6.1 AreaChart

```typescript
// src/components/charts/AreaChart.tsx
import { AreaChart as RechartsArea, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/utils'

// Props:
// - data: Array<Record<string, unknown>>
// - xKey?: string (default: 'month')
// - yKey?: string (default: 'total')
// - height?: number (default: 300)
// - color?: string (default: primary-500)
// - gradient?: boolean (default: true)
// - className?: string
// - showGrid?: boolean (default: true)
// - showAxis?: boolean (default: true)
// - CustomTooltip?: React.ComponentType
// - children?: Area[] adicionales para multiples series

// Implementacion:
// - Usar <ResponsiveContainer width="100%" height={height}>
// - Si gradient=true, definir <defs><linearGradient> con el color
// - Tooltip personalizado que formatea con formatCurrency
// - Eje Y con tickFormatter={formatCurrency}
// - Eje X con dataKey={xKey}
```

### 6.2 BarChart

```typescript
// src/components/charts/BarChart.tsx
import { BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Props: mismas que AreaChart + barSize?: number (default: 32)
// - Soporta children para apilar barras (Bar, Bar, Bar)
// - Tooltip con formato de moneda
// - Eje Y con formatCurrency
```

### 6.3 PieChart

```typescript
// src/components/charts/PieChart.tsx
import { PieChart as RechartsPie, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

// Props:
// - data: Array<{ name: string, value: number, color?: string }>
// - height?: number (default: 300)
// - innerRadius?: number (default: 0, >0 para doughnut)
// - outerRadius?: number (default: 80)
// - showLegend?: boolean (default: true)
// - colors?: string[] (paleta por defecto de 12 colores)
// - CustomTooltip?: React.ComponentType

// Paleta por defecto (12 colores):
const DEFAULT_COLORS = [
  '#3b82f6', '#ef4444', '#22c55e', '#f59e0b',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316',
  '#06b6d4', '#84cc16', '#a855f7', '#e11d48',
]
// Usar data[i].color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]
```

### 6.4 LineChart

```typescript
// src/components/charts/LineChart.tsx
import { LineChart as RechartsLine, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Props: mismas que AreaChart pero sin gradient
// - Soporta children para multiples Line (multi-series)
// - Puntos visibles con dot
// - Tooltip con formato de moneda
```

### 6.5 Chart Tooltip Generico

```typescript
// src/components/charts/ChartTooltip.tsx
// Componente de tooltip reutilizable para todos los charts
// Props: active?: boolean, payload?: Array<{ name, value }>, label?: string
// Render: div con bg-white dark:bg-gray-800, border, shadow, padding
// Formatear values con formatCurrency
```

---

## 7. KPI Card Component

Crear `src/components/charts/KPICard.tsx`:

```typescript
// Props:
interface KPICardProps {
  title: string           // "Ingresos del Mes"
  value: number           // 125000
  previousValue?: number  // 110000 (para calcular cambio %)
  format?: 'currency' | 'percentage' | 'number'
  icon?: React.ReactNode  // Lucide icon component
  trend?: 'up' | 'down' | 'neutral' (auto-calculado si previousValue presente)
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  loading?: boolean
  className?: string
}

// Layout:
// - Card con hover:shadow-md
// - Icono en circulo con bg de color segun prop
// - Label en text-sm text-gray-500
// - Value en text-2xl font-bold
// - Badge de cambio % con flecha (verde si up, rojo si down)
// - Si loading=true, mostrar Skeleton en lugar de valores
// - Si previousValue no existe, no mostrar cambio %
```

---

## 8. DateRangePicker Global

Crear `src/components/charts/DateRangePicker.tsx`:

```typescript
// Props:
interface DateRangePickerProps {
  startDate: string   // ISO date string
  endDate: string
  onChange: (start: string, end: string) => void
  presets?: DateRangePreset[]
}

interface DateRangePreset {
  label: string       // "Este Mes", "Ultimos 30 Dias", "Este Ano"
  getValue: () => { start: string, end: string }
}

// Presets por defecto:
const DEFAULT_PRESETS = [
  { label: 'Este Mes', getValue: () => {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    return { start: start.toISOString().slice(0, 10), end: now.toISOString().slice(0, 10) }
  }},
  { label: 'Mes Pasado', getValue: () => {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const end = new Date(now.getFullYear(), now.getMonth(), 0)
    return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) }
  }},
  { label: 'Ultimos 30 Dias', getValue: () => {
    const end = new Date()
    const start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000)
    return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) }
  }},
  { label: 'Ultimos 90 Dias', getValue: () => {
    const end = new Date()
    const start = new Date(end.getTime() - 90 * 24 * 60 * 60 * 1000)
    return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) }
  }},
  { label: 'Este Ano', getValue: () => {
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 1)
    return { start: start.toISOString().slice(0, 10), end: now.toISOString().slice(0, 10) }
  }},
]

// Layout:
// - Boton que muestra "startDate - endDate" o "Este Mes" (segun preset activo)
// - Dropdown con presets
// - Inputs date nativos para fechas custom (type="date")
// - Al seleccionar preset, llamar onChange
// - Al cambiar fechas manualmente, llamar onChange
```

---

## 9. Widgets del Dashboard

Cada widget debe ser un componente independiente que:
1. Recibe los datos ya cargados (por el hook padre) como props
2. Muestra skeleton si `loading={true}`
3. Muestra error si `error={true}`
4. Se renderiza con un estilo de card consistente

### 9.1 KPI Widgets Grid

```typescript
// src/features/analytics/components/KPIWidgets.tsx
// Props: kpis: MonthlyKPIs | undefined, loading: boolean, error: boolean

// 4 KPICards en grid 2x2 (lg:grid-cols-4):
// 1. "Ingresos"    - kpis.total_income, kpis.comparison.income_change_pct, icon: TrendingUp, color: success
// 2. "Gastos"      - kpis.total_expenses, kpis.comparison.expense_change_pct, icon: TrendingDown, color: danger
// 3. "Flujo Neto"  - kpis.net_flow, null, icon: ArrowRightLeft, color: primary
// 4. "Ahorro"      - kpis.savings_rate, null, format: percentage, icon: PiggyBank, color: info
```

### 9.2 Cash Flow Chart

```typescript
// src/features/analytics/components/CashFlowChart.tsx
// Props: cashFlow: CashFlowResponse | undefined, loading: boolean, error: boolean

// AreaChart con 2 areas:
// - income (verde, #22c55e)
// - expenses (rojo, #ef4444)
// xKey: 'month'
// Tooltip mostrando income, expenses, net_flow
// Summary debajo del chart: total income, total expenses, net flow
```

### 9.3 Net Worth Card

```typescript
// src/features/analytics/components/NetWorthWidget.tsx
// Props: netWorth: NetWorthResponse | undefined, loading: boolean, error: boolean

// KPICard con formato currency mostrando net_worth
// Breakdown: Assets / Liabilities con porcentajes
// Mini barra de progreso mostrando proporcion assets:liabilities
```

### 9.4 Top Categories

```typescript
// src/features/analytics/components/TopCategoriesWidget.tsx
// Props: topCategories: TopCategoriesResponse | undefined, loading: boolean, error: boolean

// PieChart (doughnut) con los top 5 categorias
// Color de cada slice: data[i].color ?? DEFAULT_COLORS[i]
// Leyenda con nombre, porcentaje, monto
// Si no hay datos, EmptyState
```

### 9.5 Spending Trend Chart

```typescript
// src/features/analytics/components/SpendingTrendChart.tsx
// Props: spendingTrend: TrendResponse | undefined, loading: boolean, error: boolean

// BarChart con barras por periodo
// xKey: 'period'
// yKey: 'total'
// Summary: total spent, average per period
```

### 9.6 Upcoming Payments

```typescript
// src/features/analytics/components/UpcomingPaymentsWidget.tsx
// Props: payments: UpcomingPayment[] | undefined, loading: boolean, error: boolean

// Lista de pagos proximos (prestamos)
// Cada item: nombre, monto, fecha de vencimiento
// Badge rojo si vence en menos de 7 dias
// Si no hay pagos, EmptyState
```

### 9.7 Goals Progress

```typescript
// src/features/analytics/components/GoalsProgressWidget.tsx
// Props: goals: GoalProgress[] | undefined, loading: boolean, error: boolean

// Lista de metas activas
// Cada item: nombre, target, current, progress bar
// Barra de progreso coloreada (green si >75%, yellow si >50%, red si <50%)
// Si no hay metas, EmptyState
```

---

## 10. DashboardPage Completa

Reemplazar `src/features/analytics/pages/DashboardPage.tsx`:

```typescript
import { useState } from 'react'
import { useDashboard } from '../hooks/useAnalytics'
import KPIWidgets from '../components/KPIWidgets'
import CashFlowChart from '../components/CashFlowChart'
import NetWorthWidget from '../components/NetWorthWidget'
import TopCategoriesWidget from '../components/TopCategoriesWidget'
import SpendingTrendChart from '../components/SpendingTrendChart'
import UpcomingPaymentsWidget from '../components/UpcomingPaymentsWidget'
import GoalsProgressWidget from '../components/GoalsProgressWidget'
import DateRangePicker from '@/components/charts/DateRangePicker'
import ErrorBoundary from '@/components/layout/ErrorBoundary'

function DashboardPage() {
  const { data, isLoading, isError, error, refetch } = useDashboard()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Resumen financiero del mes actual
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <ErrorBoundary>
        <KPIWidgets kpis={data?.kpis} loading={isLoading} error={isError} />
      </ErrorBoundary>

      {/* Charts Grid: 2 columns on lg+ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ErrorBoundary>
          <CashFlowChart cashFlow={data?.cash_flow} loading={isLoading} error={isError} />
        </ErrorBoundary>
        <ErrorBoundary>
          <NetWorthWidget netWorth={data?.net_worth} loading={isLoading} error={isError} />
        </ErrorBoundary>
        <ErrorBoundary>
          <TopCategoriesWidget topCategories={data?.top_categories} loading={isLoading} error={isError} />
        </ErrorBoundary>
        <ErrorBoundary>
          <SpendingTrendChart spendingTrend={data?.spending_trend} loading={isLoading} error={isError} />
        </ErrorBoundary>
      </div>

      {/* Bottom widgets: 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ErrorBoundary>
          <UpcomingPaymentsWidget payments={data?.upcoming_payments} loading={isLoading} error={isError} />
        </ErrorBoundary>
        <ErrorBoundary>
          <GoalsProgressWidget goals={data?.goals} loading={isLoading} error={isError} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default DashboardPage
```

---

## 11. Header: Busqueda Global y Notificaciones

Actualizar `src/components/layout/Header.tsx` agregando:

### 11.1 Global Search

```typescript
// Estado local:
const [searchOpen, setSearchOpen] = useState(false)
const [searchQuery, setSearchQuery] = useState('')
const searchInputRef = useRef<HTMLInputElement>(null)

// Atajo de teclado: Ctrl+K / Cmd+K para abrir busqueda
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      setSearchOpen(true)
    }
    if (e.key === 'Escape') {
      setSearchOpen(false)
    }
  }
  document.addEventListener('keydown', handleKeyDown)
  return () => document.removeEventListener('keydown', handleKeyDown)
}, [])

// UI:
// - Boton con lupa + "Ctrl+K" text en header
// - Modal/Drawer de busqueda con input y resultados
// - Resultados: cuentas, transacciones, categorias (busqueda global)
// - Navegacion por flechas + Enter

// Alternativa simplificada:
// - Input de busqueda que aparece al hacer clic en la lupa
// - Redirige a /search?q=... o a pagina correspondiente
// - Por ahora, solo la UI del boton + shortcut
```

### 11.2 Notifications Badge

```typescript
// El boton de notificaciones ya existe. Mejorar:
// - Llamar a GET /api/v1/notifications/stats para el badge count
// - Si hay notificaciones no leidas, badge rojo con el numero
// - Al hacer clic, redirigir a /notifications

// Hook para badge:
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

function useUnreadCount() {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => api.get('/notifications/stats').then(r => r.data.unread_count ?? 0),
    refetchInterval: 30000, // cada 30 segundos
  })
}
```

---

## 12. Loading Skeletons por Widget

Crear skeletons especificos para cada widget del dashboard.

### 12.1 KPI Cards Skeleton

```typescript
// src/components/charts/SkeletonKPICard.tsx
// Misma altura que KPICard pero con Skeleton components
// - Circulo skeleton para icono
// - Rectangulo skeleton para label
// - Rectangulo skeleton para valor
// - Rectangulo skeleton para badge de cambio
```

### 12.2 Chart Skeleton

```typescript
// src/components/charts/SkeletonChart.tsx
// Props: height?: number (default: 300)
// - Rectangulo skeleton del alto especificado
// - Con bordes redondeados
```

### 12.3 List Skeleton

```typescript
// src/components/charts/SkeletonList.tsx
// Props: rows?: number (default: 5)
// - Filas de skeleton con avatar circular + 2 rectangulos de texto
```

---

## 13. Error Boundaries por Seccion

Crear `src/components/layout/ErrorBoundary.tsx`:

```typescript
import { Component, ErrorInfo, ReactNode } from 'react'
import ErrorMessage from '@/components/ui/ErrorMessage'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }
      return (
        <ErrorMessage
          title="Error en seccion"
          message={this.state.error?.message || 'Algo salio mal en esta seccion.'}
          onRetry={this.handleRetry}
        />
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
```

---

## 14. Sidebar: Navegacion Completa

El Sidebar ya esta implementado en Phase 0 con:
- Secciones: Principal, Finanzas, Ingresos y Gastos, Planificacion, Inteligencia, Sistema
- Iconos de Lucide por cada ruta
- Colapso/expansion con animacion
- Active state con NavLink
- Mobile drawer con overlay

**Mejoras opcionales para Phase 2:**

1. **Tooltips en modo colapsado**: Cuando sidebarOpen=false, mostrar tooltip al hover de cada icono
2. **Badge en "Notificaciones"**: Mostrar contador de no leidos
3. **Sub-secciones expandibles**: Para rutas con hijos (ej: Admin con dropdown)
4. **User info compacto**: Avatar + nombre al pie del sidebar en modo expandido

---

## 15. Verificacion Final

```bash
# 1. TypeScript check
pnpm tsc --noEmit

# 2. Lint
pnpm lint

# 3. Build
pnpm build

# Checklist:
# [ ] DashboardPage muestra KPIs reales del API
# [ ] CashFlowChart con datos del mes actual
# [ ] NetWorthWidget con assets/liabilities
# [ ] TopCategoriesWidget con doughnut chart
# [ ] SpendingTrendChart con ultimos 6 meses
# [ ] UpcomingPaymentsWidget con prestamos proximos
# [ ] GoalsProgressWidget con metas activas
# [ ] Loading skeletons en cada widget mientras carga
# [ ] ErrorBoundary atrapa errores por seccion
# [ ] DateRangePicker filtra dashboard
# [ ] Header con busqueda (Ctrl+K) y badge de notificaciones
# [ ] Sidebar responsivo funciona en mobile
# [ ] Sin errores de TypeScript
# [ ] pnpm lint sin errores
# [ ] pnpm build exitoso
```
