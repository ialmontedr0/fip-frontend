# Fase 8: Budgets - Guía Completa de Implementación

## 1. INVENTARIO DE ARCHIVOS A CREAR

### Types & API Layer
```
src/types/budgets.ts                   # Interfaces y tipos
src/features/budgets/api/budgets.ts     # API calls
src/features/budgets/api/alerts.ts      # Alert API calls
```

### Hooks
```
src/features/budgets/hooks/useBudgets.ts        # CRUD + summary + refresh + auto-adjust
src/features/budgets/hooks/useBudgetAlerts.ts   # Alert CRUD
```

### Constants
```
src/features/budgets/constants.ts  # Config maps, labels, colores
```

### Components
```
src/features/budgets/components/
  BudgetNav.tsx                  # Navigation tabs (responsive)
  BudgetCard.tsx                 # Card con progress bar (status color)
  BudgetProgressBar.tsx          # Barra reutilizable con color status
  BudgetFilters.tsx              # Filtros (tipo, periodo, activo)
  BudgetForm.tsx                 # Formulario crear/editar
  BudgetEmptyState.tsx           # Empty state
  BudgetSummaryCards.tsx         # KPIs del summary
  BudgetAlertCard.tsx            # Alerta individual
  BudgetAlertList.tsx            # Lista de alertas
  BudgetRefreshButton.tsx        # Botón refresh con loading
  BudgetAutoAdjustModal.tsx      # Modal auto-adjust
  BudgetStrategySelector.tsx     # Selector de estrategia
  BudgetTypeSelector.tsx         # Selector de tipo (total/category/account)
  PeriodSelector.tsx             # Selector de periodo
  AlertTimerSlider.tsx           # Slider umbral de alerta
  RolloverToggle.tsx             # Toggle de rollover
  BurnRateIndicator.tsx          # Daily burn rate + projected
```

### Pages
```
src/features/budgets/pages/
  BudgetListPage.tsx             # Lista principal con barras de progreso
  BudgetCreatePage.tsx           # Formulario de creación
  BudgetEditPage.tsx             # Formulario de edición
  BudgetDetailPage.tsx           # Detalle con analytics + alerts
  BudgetSummaryPage.tsx          # Dashboard resumen general
  BudgetAlertsPage.tsx           # Gestión de alertas
```

### Route & Lazy Loading
- `src/routes/lazy.ts` → agregar lazy imports
- `src/routes/index.tsx` → reemplazar PlaceholderPage con las pages reales

## 2. BACKEND API COMPLETE REFERENCE

Base URL: `/api/v1/budgets`
Frontend base (Axios): `VITE_API_URL` = `http://localhost:8080/api/v1`

### ENDPOINTS

#### 2.1 POST /budgets (201) — Crear presupuesto
```typescript
// Request
{
  name: string,              // required, 1-200 chars
  amount: string,            // required, "1500.00"
  budget_type?: string,      // "total" | "category" | "account", default "total"
  period?: string,           // "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly", default "monthly"
  start_date?: string | null,// "2024-01-01" (auto si null)
  end_date?: string | null,  // "2024-01-31" (auto si null)
  category_id?: string | null,
  account_id?: string | null,
  alert_threshold?: number,  // 1-100, default 80
  alert_enabled?: boolean,   // default true
  auto_adjust?: boolean,     // default false
  rollover?: boolean,        // default false
  strategy?: string | null,  // "zero_based" | "50_30_20" | "envelope" | "custom"
  description?: string | null,
  icon?: string | null,      // nombre lucide icon
  color?: string | null,     // hex #RRGGBB
}

// Response (201)
interface BudgetResponse { ... } // ver sección 3
```

**Validaciones backend:**
- `name`: requerido, no vacío
- `amount`: > 0
- `budget_type`: debe ser `total`, `category`, o `account`
- `period`: debe ser `weekly`, `biweekly`, `monthly`, `quarterly`, `yearly`
- `alert_threshold`: 1-100
- `strategy`: `zero_based`, `50_30_20`, `envelope`, `custom`, o null
- `budget_type=category` → requiere `category_id`
- `budget_type=account` → requiere `account_id`
- `start_date` se auto-asigna al día 1 del mes actual si no se envía
- `end_date` se calcula según `period` si no se envía

#### 2.2 GET /budgets (200) — Listar presupuestos
```
Params:
  budget_type?: "total" | "category" | "account"
  is_active?: boolean
  period?: "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly"

Response: { budgets: BudgetResponse[], total: number }
```

#### 2.3 GET /budgets/summary (200) — Resumen agregado
```typescript
Response: {
  total_budgets: number,
  total_budget_amount: string,  // "5000.00"
  total_spent: string,
  total_remaining: string,
  utilization_pct: string,      // "42.5"
  over_budget_count: number,
  near_limit_count: number,
  unread_alerts: number,
  new_alerts_triggered: number,
}
```

#### 2.4 GET /budgets/{budget_id} (200) — Detalle presupuesto
```
Path: {budget_id} → uuid

Response: BudgetResponse (con todos los campos + adjustment_history)
```

#### 2.5 PATCH /budgets/{budget_id} (200) — Actualizar presupuesto
```typescript
// Request (partial)
{
  name?: string,
  description?: string | null,
  amount?: string | number,
  alert_threshold?: number,
  alert_enabled?: boolean,
  auto_adjust?: boolean,
  rollover?: boolean,
  strategy?: string | null,
  is_active?: boolean,
  icon?: string | null,
  color?: string | null,
}

Response: BudgetResponse
```

#### 2.6 DELETE /budgets/{budget_id} (200) — Soft-delete
```typescript
Response: { message: string }
```

#### 2.7 POST /budgets/{budget_id}/refresh (200) — Recalcular spent
```typescript
Response: {
  id: string,
  name: string,
  amount: string,
  spent: string,
  remaining: string,
  pct_used: number,
  status: "ok" | "warning" | "exceeded",
  new_alerts: number,
}
```

#### 2.8 POST /budgets/{budget_id}/auto-adjust (200) — Auto-ajuste
```typescript
// Request
{
  buffer_pct?: number,  // 0-100, default 10
  apply?: boolean,      // default false
}

// Response (dry-run)
{
  message?: string,
  current_amount: string,
  average_spending: string,
  suggested_amount: string,
  buffer_pct: number,
  periods_analyzed: number,
  applied: false,
}

// Response (con apply=true)
// mismo + applied: true + new_amount: string
```

**IMPORTANTE:** El auto-adjust solo funciona si `budget.auto_adjust === true`. Si no está habilitado, el backend devuelve 422.

#### 2.9 GET /budgets/alerts/all (200) — Listar alertas
```
Params:
  budget_id?: string (uuid)
  is_read?: boolean
  alert_type?: string
  severity?: string

Response: { alerts: AlertResponse[], total: number }
```

#### 2.10 POST /budgets/alerts/read (200) — Marcar alerta(s) como leída
```typescript
// Request (one or the other)
{ alert_id: string }        // mark single
{ mark_all: true }           // mark all

Response: { message: string, count?: number }
```

#### 2.11 POST /budgets/alerts/{alert_id}/dismiss (200) — Descartar alerta
```typescript
Response: { message: string }
```

## 3. TYPESCRIPT TYPES (`src/types/budgets.ts`)

```typescript
// ─── Enums / Literals ────────────────────────────────────────────────
export type BudgetType = 'total' | 'category' | 'account'
export type BudgetPeriod = 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly'
export type BudgetStrategy = 'zero_based' | '50_30_20' | 'envelope' | 'custom'  | null
export type BudgetStatus = 'ok' | 'warning' | 'exceeded'

// ─── Request Interfaces ──────────────────────────────────────────────
export interface CreateBudgetRequest {
  name: string
  amount: string
  budget_type?: BudgetType
  period?: BudgetPeriod
  start_date?: string | null
  end_date?: string | null
  category_id?: string | null
  account_id?: string | null
  alert_threshold?: number
  alert_enabled?: boolean
  auto_adjust?: boolean
  rollover?: boolean
  strategy?: BudgetStrategy
  description?: string | null
  icon?: string | null
  color?: string | null
}

export interface UpdateBudgetRequest {
  name?: string
  description?: string | null
  amount?: string | number
  alert_threshold?: number
  alert_enabled?: boolean
  auto_adjust?: boolean
  rollover?: boolean
  strategy?: BudgetStrategy
  is_active?: boolean
  icon?: string | null
  color?: string | null
}

export interface AutoAdjustRequest {
  buffer_pct?: number
  apply?: boolean
}

export interface MarkAlertReadRequest {
  alert_id?: string
  mark_all?: boolean
}

// ─── Response Interfaces ─────────────────────────────────────────────
export interface BudgetResponse {
  id: string
  name: string
  description: string | null
  budget_type: string
  amount: string
  spent: string
  remaining: string
  period: string
  start_date: string
  end_date: string
  category_id: string | null
  account_id: string | null
  alert_threshold: number
  alert_enabled: boolean
  auto_adjust: boolean
  rollover: boolean
  strategy: string | null
  is_active: boolean
  pct_used: number
  status: string
  icon: string | null
  color: string | null
  created_at: string | null
  // Solo en detail:
  adjustment_history?: Record<string, unknown> | null
  unread_alerts?: number
}

export interface ListBudgetsResponse {
  budgets: BudgetResponse[]
  total: number
}

export interface BudgetSummaryResponse {
  total_budgets: number
  total_budget_amount: string
  total_spent: string
  total_remaining: string
  utilization_pct: string
  over_budget_count: number
  near_limit_count: number
  unread_alerts: number
  new_alerts_triggered: number
}

export interface BudgetRefreshResponse {
  id: string
  name: string
  amount: string
  spent: string
  remaining: string
  pct_used: number
  status: string
  new_alerts: number
}

export interface AutoAdjustResponse {
  message?: string
  current_amount: string
  average_spending?: string
  suggested_amount: string
  buffer_pct: number
  periods_analyzed?: number
  applied: boolean
  new_amount?: string
}

export interface AlertResponse {
  id: string
  budget_id: string
  alert_type: string
  severity: string
  title: string
  message: string
  threshold_percentage: number | null
  current_amount: string | null
  budget_amount: string | null
  is_read: boolean
  is_dismissed: boolean
  triggered_at: string | null
}

export interface ListAlertsResponse {
  alerts: AlertResponse[]
  total: number
}

// ─── Filter Interface ────────────────────────────────────────────────
export interface BudgetFilters {
  budget_type?: BudgetType
  is_active?: boolean
  period?: BudgetPeriod
}
```

## 4. CONSTANTS (`src/features/budgets/constants.ts`)

```typescript
import { PiggyBank, TrendingUp, Wallet, CalendarDays, Zap, Target, Lightbulb, Filter, BarChart3 } from 'lucide-react'
import type { BudgetType, BudgetPeriod, BudgetStrategy, BudgetStatus } from '@/types/budgets'

export const BUDGET_TYPE_CONFIG: Record<BudgetType, { label: string; icon: React.ComponentType<{ className?: string }>; description: string }> = {
  total: { label: 'Total', icon: PiggyBank, description: 'Limite general de gastos' },
  category: { label: 'Por Categoria', icon: Filter, description: 'Limite por categoria de gasto' },
  account: { label: 'Por Cuenta', icon: Wallet, description: 'Limite por cuenta bancaria' },
}

export const BUDGET_TYPE_OPTIONS = [
  { value: 'total', label: 'Total', description: 'Limite general de gastos' },
  { value: 'category', label: 'Categoria', description: 'Limite por categoria' },
  { value: 'account', label: 'Cuenta', description: 'Limite por cuenta' },
]

export const PERIOD_CONFIG: Record<BudgetPeriod, { label: string; icon: React.ComponentType<{ className?: string }>; monthsSpan: number }> = {
  weekly: { label: 'Semanal', icon: CalendarDays, monthsSpan: 0.25 },
  biweekly: { label: 'Quincenal', icon: CalendarDays, monthsSpan: 0.5 },
  monthly: { label: 'Mensual', icon: CalendarDays, monthsSpan: 1 },
  quarterly: { label: 'Trimestral', icon: BarChart3, monthsSpan: 3 },
  yearly: { label: 'Anual', icon: TrendingUp, monthsSpan: 12 },
}

export const PERIOD_OPTIONS = [
  { value: 'weekly', label: 'Semanal' },
  { value: 'biweekly', label: 'Quincenal' },
  { value: 'monthly', label: 'Mensual' },
  { value: 'quarterly', label: 'Trimestral' },
  { value: 'yearly', label: 'Anual' },
]

export const STRATEGY_CONFIG: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; description: string }> = {
  zero_based: { label: 'Zero-Based', icon: Target, description: 'Cada periodo comienza desde cero, sin arrastrar saldos' },
  '50_30_20': { label: '50/30/20', icon: PieChart, description: '50% necesidades, 30% deseos, 20% ahorro' },
  envelope: { label: 'Sobre', icon: Wallet, description: 'Asignacion fisica por categoria, no se puede exceder' },
  custom: { label: 'Personalizado', icon: Lightbulb, description: 'Configuracion manual sin reglas predefinidas' },
}

export const STRATEGY_OPTIONS = [
  { value: '', label: 'Ninguna' },
  { value: 'zero_based', label: 'Zero-Based' },
  { value: '50_30_20', label: '50/30/20' },
  { value: 'envelope', label: 'Sobre' },
  { value: 'custom', label: 'Personalizado' },
]

export const STATUS_CONFIG: Record<BudgetStatus, { label: string; color: string; bgColor: string; barColor: string }> = {
  ok: { label: 'Dentro del presupuesto', color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-50 dark:bg-emerald-500/10', barColor: 'bg-emerald-500' },
  warning: { label: 'Cerca del limite', color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-50 dark:bg-amber-500/10', barColor: 'bg-amber-500' },
  exceeded: { label: 'Presupuesto excedido', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-50 dark:bg-red-500/10', barColor: 'bg-red-500' },
}

export const ALERT_TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  threshold_reached: { label: 'Umbral Alcanzado', color: '#f59e0b' },
  budget_exceeded: { label: 'Limite Excedido', color: '#ef4444' },
  near_limit: { label: 'Cerca del Limite', color: '#f59e0b' },
  spending_spike: { label: 'Pico de Gasto', color: '#ef4444' },
  period_ending: { label: 'Fin de Periodo', color: '#3b82f6' },
  auto_adjust: { label: 'Ajuste Automatico', color: '#8b5cf6' },
}

export const ALERT_SEVERITY_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  info: { label: 'Informativo', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  warning: { label: 'Advertencia', color: 'text-amber-600', bgColor: 'bg-amber-100' },
  critical: { label: 'Critico', color: 'text-red-600', bgColor: 'bg-red-100' },
}

// Necesitamos PieChart de lucide-react para 50_30_20:
import { PieChart } from 'lucide-react'
```

## 5. API LAYER

### 5.1 `src/features/budgets/api/budgets.ts`

```typescript
import api from '@/lib/api'
import type {
  CreateBudgetRequest, UpdateBudgetRequest, AutoAdjustRequest,
  BudgetResponse, ListBudgetsResponse, BudgetSummaryResponse,
  BudgetRefreshResponse, AutoAdjustResponse, BudgetFilters,
} from '@/types/budgets'

export function createBudget(data: CreateBudgetRequest) {
  return api.post<BudgetResponse>('/budgets', data)
}

export function listBudgets(params?: BudgetFilters) {
  return api.get<ListBudgetsResponse>('/budgets', { params })
}

export function getBudgetSummary() {
  return api.get<BudgetSummaryResponse>('/budgets/summary')
}

export function getBudget(id: string) {
  return api.get<BudgetResponse>(`/budgets/${id}`)
}

export function updateBudget(id: string, data: UpdateBudgetRequest) {
  return api.patch<BudgetResponse>(`/budgets/${id}`, data)
}

export function deleteBudget(id: string) {
  return api.delete<{ message: string }>(`/budgets/${id}`)
}

export function refreshBudget(id: string) {
  return api.post<BudgetRefreshResponse>(`/budgets/${id}/refresh`)
}

export function autoAdjustBudget(id: string, data: AutoAdjustRequest = {}) {
  return api.post<AutoAdjustResponse>(`/budgets/${id}/auto-adjust`, data)
}
```

### 5.2 `src/features/budgets/api/alerts.ts`

```typescript
import api from '@/lib/api'
import type { AlertResponse, ListAlertsResponse, MarkAlertReadRequest } from '@/types/budgets'

export function listAlerts(params?: {
  budget_id?: string
  is_read?: boolean
  alert_type?: string
  severity?: string
}) {
  return api.get<ListAlertsResponse>('/budgets/alerts/all', { params })
}

export function markAlertRead(data: MarkAlertReadRequest) {
  return api.post<{ message: string; count?: number }>('/budgets/alerts/read', data)
}

export function dismissAlert(alertId: string) {
  return api.post<{ message: string }>(`/budgets/alerts/${alertId}/dismiss`)
}
```

## 6. HOOKS

### 6.1 `src/features/budgets/hooks/useBudgets.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as budgetsApi from '../api/budgets'
import type { CreateBudgetRequest, UpdateBudgetRequest, AutoAdjustRequest, BudgetFilters } from '@/types/budgets'

export const budgetKeys = {
  all: ['budgets'] as const,
  lists: () => [...budgetKeys.all, 'list'] as const,
  list: (filters?: BudgetFilters) => [...budgetKeys.lists(), filters] as const,
  details: () => [...budgetKeys.all, 'detail'] as const,
  detail: (id: string) => [...budgetKeys.details(), id] as const,
  summary: () => [...budgetKeys.all, 'summary'] as const,
}

export function useBudgets(filters?: BudgetFilters) {
  return useQuery({
    queryKey: budgetKeys.list(filters),
    queryFn: () => budgetsApi.listBudgets(filters).then((r) => r.data),
    staleTime: 1000 * 60 * 2,
  })
}

export function useBudget(id: string | undefined) {
  return useQuery({
    queryKey: budgetKeys.detail(id!),
    queryFn: () => budgetsApi.getBudget(id!).then((r) => r.data),
    enabled: !!id,
  })
}

export function useBudgetSummary() {
  return useQuery({
    queryKey: budgetKeys.summary(),
    queryFn: () => budgetsApi.getBudgetSummary().then((r) => r.data),
    staleTime: 1000 * 60 * 2,
  })
}

export function useCreateBudget() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateBudgetRequest) => budgetsApi.createBudget(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.lists() })
      queryClient.invalidateQueries({ queryKey: budgetKeys.summary() })
      toast.success('Presupuesto creado exitosamente')
    },
    onError: () => toast.error('Error al crear el presupuesto'),
  })
}

export function useUpdateBudget() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBudgetRequest }) =>
      budgetsApi.updateBudget(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: budgetKeys.lists() })
      queryClient.invalidateQueries({ queryKey: budgetKeys.summary() })
      toast.success('Presupuesto actualizado')
    },
    onError: () => toast.error('Error al actualizar el presupuesto'),
  })
}

export function useDeleteBudget() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => budgetsApi.deleteBudget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.lists() })
      queryClient.invalidateQueries({ queryKey: budgetKeys.summary() })
      toast.success('Presupuesto eliminado')
    },
    onError: () => toast.error('Error al eliminar el presupuesto'),
  })
}

export function useRefreshBudget() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => budgetsApi.refreshBudget(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: budgetKeys.lists() })
      queryClient.invalidateQueries({ queryKey: budgetKeys.summary() })
      toast.success('Presupuesto actualizado con los gastos reales')
    },
    onError: () => toast.error('Error al refrescar el presupuesto'),
  })
}

export function useAutoAdjustBudget() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: AutoAdjustRequest }) =>
      budgetsApi.autoAdjustBudget(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: budgetKeys.lists() })
      toast.success('Ajuste automatico completado')
    },
    onError: () => toast.error('Error al ajustar el presupuesto'),
  })
}
```

### 6.2 `src/features/budgets/hooks/useBudgetAlerts.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as alertsApi from '../api/alerts'
import type { MarkAlertReadRequest } from '@/types/budgets'

export const alertKeys = {
  all: ['budget-alerts'] as const,
  lists: () => [...alertKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...alertKeys.lists(), filters] as const,
}

export function useBudgetAlerts(filters?: {
  budget_id?: string
  is_read?: boolean
  alert_type?: string
  severity?: string
}) {
  return useQuery({
    queryKey: alertKeys.list(filters),
    queryFn: () => alertsApi.listAlerts(filters).then((r) => r.data),
    staleTime: 1000 * 60,
  })
}

export function useMarkAlertRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: MarkAlertReadRequest) => alertsApi.markAlertRead(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: alertKeys.all })
      queryClient.invalidateQueries({ queryKey: ['budgets', 'summary'] })
      toast.success('Alertas actualizadas')
    },
    onError: () => toast.error('Error al marcar alerta'),
  })
}

export function useDismissAlert() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (alertId: string) => alertsApi.dismissAlert(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: alertKeys.all })
      toast.success('Alerta descartada')
    },
    onError: () => toast.error('Error al descartar alerta'),
  })
}
```

## 7. COMPONENTES

### 7.1 BudgetProgressBar
Componente atómico reutilizable. Props:
```typescript
interface BudgetProgressBarProps {
  pctUsed: number         // 0-100
  amount: string          // "1500.00"
  spent: string           // "1200.00"
  remaining: string       // "300.00"
  status: BudgetStatus    // "ok" | "warning" | "exceeded"
  showLabels?: boolean    // default true
  size?: 'sm' | 'md' | 'lg'  // default 'md'
  className?: string
}
```

**Lógica de colores:**
```typescript
// Obtener de STATUS_CONFIG según status
const config = STATUS_CONFIG[status] || STATUS_CONFIG.ok
```

**Comportamiento:**
- Barra de progreso con ancho = min(pctUsed, 100)%
- Si `pctUsed > 100`, la barra se muestra al 100% con color red
- Muestra "85%" como texto dentro/sobre la barra
- Muestra "$1,200 / $1,500" y "Restante: $300" si `showLabels`

### 7.2 BudgetCard
Card para la lista. Props:
```typescript
interface BudgetCardProps {
  budget: BudgetResponse
  onRefresh?: (id: string) => void
  onDelete?: (id: string) => void
  onToggleActive?: (id: string, isActive: boolean) => void
}
```

**Estructura visual:**
```
┌─────────────────────────────────────────────┐
│ [icon] Nombre                    [status tag]│
│ Tipo: Categoria | Periodo: Mensual          │
│ ┌─────────────────────────────────────┐     │
│ │ ████████████████████░░░░ 85%       │     │
│ └─────────────────────────────────────┘     │
│ Gastado: $1,275  /  $1,500                  │
│ Restante: $225  ·  Estrategia: Ninguna      │
│ Alerta: 80%  Auto-ajuste: ✓  Rollover: ✗   │
│ [Refresh] [Editar] [Eliminar]               │
└─────────────────────────────────────────────┘
```

- Icono de lucide según `budget.icon` (o default PiggyBank)
- Color del borde/accento según `budget.color`
- Status tag: badge pequeño con colores de STATUS_CONFIG

### 7.3 BudgetNav
Navegación interna de presupuestos (mismo patrón responsive que ExpenseNav / IncomeNav):

```typescript
const TABS = [
  { path: '/budgets', label: 'Presupuestos', icon: PiggyBank },
  { path: '/budgets/summary', label: 'Resumen', icon: BarChart3 },
  { path: '/budgets/new', label: 'Nuevo', icon: Plus },
  { path: '/budgets/alerts', label: 'Alertas', icon: Bell },
]
```

**Responsive:**
- Desktop (>= lg): pill navigation horizontal con indicador deslizante animado
- Mobile (< lg): dropdown select con navegación

### 7.4 BudgetFilters

```typescript
interface BudgetFiltersProps {
  filters: BudgetFilters
  onChange: (filters: BudgetFilters) => void
}
```

**Filtros:**
- Tipo: `select` con opciones `total`, `category`, `account` + "Todos"
- Período: `select` con todos los períodos + "Todos"
- Estado: `select` con "Activos", "Inactivos", "Todos"
- Botón "Limpiar filtros"

### 7.5 BudgetEmptyState
```typescript
interface BudgetEmptyStateProps {
  hasFilters?: boolean
  onClearFilters?: () => void
}
```
Muestra icono PiggyBank grande, mensaje "No tienes presupuestos aún", CTA "Crear primer presupuesto" → `/budgets/new`. Si `hasFilters`, mostrar "No hay presupuestos con estos filtros" + botón "Limpiar filtros".

### 7.6 BudgetForm

```typescript
interface BudgetFormProps {
  defaultValues?: Partial<CreateBudgetRequest>
  mode: 'create' | 'edit'
  onSubmit: (data: CreateBudgetRequest) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}
```

**Campos del formulario (React Hook Form + Zod):**

```typescript
const budgetSchema = z.object({
  name: z.string().min(1, 'Nombre requerido').max(200),
  amount: z.string().refine((v) => !isNaN(Number(v)) && Number(v) > 0, 'Monto debe ser mayor a 0'),
  budget_type: z.enum(['total', 'category', 'account']),
  period: z.enum(['weekly', 'biweekly', 'monthly', 'quarterly', 'yearly']),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  category_id: z.string().nullable().optional(),
  account_id: z.string().nullable().optional(),
  alert_threshold: z.coerce.number().min(1).max(100).default(80),
  alert_enabled: z.boolean().default(true),
  auto_adjust: z.boolean().default(false),
  rollover: z.boolean().default(false),
  strategy: z.enum(['zero_based', '50_30_20', 'envelope', 'custom']).nullable().optional(),
  description: z.string().max(500).nullable().optional(),
  icon: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
})
```

**Layout del formulario (2 columnas en desktop):**

```
Columna izquierda:
  [name] input
  [budget_type] BudgetTypeSelector
  [period] PeriodSelector
  [start_date] date input
  [end_date] date input
  Conditional: [category_id] CategoryPicker (si budget_type=category)
  Conditional: [account_id] AccountSelector (si budget_type=account)

Columna derecha:
  [amount] input numérico con formato moneda
  [description] textarea
  [alert_threshold] Slider (1-100) con label "Umbral de alerta: 80%"
  [alert_enabled] Toggle
  [auto_adjust] Toggle
  [rollover] Toggle
  [strategy] BudgetStrategySelector
  [icon] IconPicker
  [color] ColorPicker
```

**Comportamiento:**
- `budget_type` cambia dinámicamente: si "category" muestra CategoryPicker, si "account" muestra AccountSelector, si "total" no muestra nada extra
- `strategy` es opcional (nullable)

### 7.7 BudgetTypeSelector

```typescript
interface BudgetTypeSelectorProps {
  value: BudgetType
  onChange: (value: BudgetType) => void
}
```

3 tarjetas seleccionables con icono + label + descripción breve:
```
┌──────────┐  ┌──────────────┐  ┌──────────┐
│  🐷      │  │   🔍        │  │  👛      │
│  Total   │  │  Categoria   │  │  Cuenta  │
│ General  │  │  Por cat.    │  │  Por cta │
└──────────┘  └──────────────┘  └──────────┘
```

### 7.8 PeriodSelector

```typescript
interface PeriodSelectorProps {
  value: BudgetPeriod
  onChange: (value: BudgetPeriod) => void
}
```

5 opciones en fila: Semanal | Quincenal | Mensual | Trimestral | Anual
Estilo: pills seleccionables (mismo patrón que ExpenseNav DesktopNav)

### 7.9 BudgetStrategySelector

```typescript
interface BudgetStrategySelectorProps {
  value: string | null | undefined
  onChange: (value: string | null) => void
}
```

Dropdown select con opciones: Ninguna, Zero-Based, 50/30/20, Sobre, Personalizado
Con tooltip/descripción al hover.

### 7.10 BudgetAlertCard

```typescript
interface BudgetAlertCardProps {
  alert: AlertResponse
  onMarkRead: (id: string) => void
  onDismiss: (id: string) => void
}
```

**Estructura visual:**
```
┌──────────────────────────────────────────────────┐
│ [severity_icon] Titulo          [fecha] [.][x]   │
│ Mensaje descriptivo del problema                 │
│ Presupuesto: $1,500 · Actual: $1,275 (85%)       │
└──────────────────────────────────────────────────┘
```

- Colores según `ALERT_SEVERITY_CONFIG[alert.severity]`
- Botón "..." con acciones: "Marcar leída" (si no leída), "Descartar"
- Si `is_dismissed`, mostrar opaca o con badge "Descartada"

### 7.11 BudgetAlertList
```typescript
interface BudgetAlertListProps {
  alerts: AlertResponse[]
  budgetId?: string    // para filtrar en el hook
}
```
Lista de `BudgetAlertCard` con filtros: tipo, severidad, leído/no leído.
Botón "Marcar todas como leídas" (si hay no leídas).

### 7.12 BudgetSummaryCards
```typescript
interface BudgetSummaryCardsProps {
  summary: BudgetSummaryResponse | undefined
  isLoading: boolean
}
```

4 KPIs en grid 2x2 (responsivo):
```
┌──────────────┬──────────────┐
│ Presupuestos  │ Utilizacion   │
│ 12 activos    │ 42.5%        │
├──────────────┼──────────────┤
│ Sobre límite  │ Cerca límite  │
│ 3             │ 5             │
└──────────────┴──────────────┘
```

### 7.13 BudgetRefreshButton
```typescript
interface BudgetRefreshButtonProps {
  budgetId: string
  onRefresh?: (id: string) => void
  size?: 'sm' | 'md'
}
```
Botón con icono de refresh. Muestra spinner mientras muta. Al completar, toast con cuántas alertas nuevas se generaron.

### 7.14 BudgetAutoAdjustModal
```typescript
interface BudgetAutoAdjustModalProps {
  budgetId: string
  budgetName: string
  isOpen: boolean
  onClose: () => void
}
```

Modal con:
- Texto explicativo: "Basado en gastos de los últimos 3 meses..."
- Slider `buffer_pct`: 0-50%, default 10%, con label numérico
- Botón "Vista previa" → ejecuta auto-adjust con `apply: false`
- Muestra resultado: `current_amount → suggested_amount`, `average_spending`, `periods_analyzed`
- Botón "Aplicar ajuste" (disabled hasta vista previa) → ejecuta con `apply: true`
- Si `auto_adjust` es false en el presupuesto, mostrar mensaje "Auto-ajuste no habilitado para este presupuesto" + sugerencia de activarlo

### 7.15 RolloverToggle
```typescript
interface RolloverToggleProps {
  value: boolean
  onChange: (value: boolean) => void
  disabled?: boolean
}
```
Toggle switch + label "Arrastrar saldo no gastado al próximo período" + tooltip explicativo.

### 7.16 AlertThresholdSlider
```typescript
interface AlertThresholdSliderProps {
  value: number
  onChange: (value: number) => void
}
```
Slider range 1-100 con visualización numérica. Muestra marca en el valor actual.

### 7.17 BurnRateIndicator
```typescript
interface BurnRateIndicatorProps {
  budget: BudgetResponse
}
```

```typescript
// Cálculos:
const daysInPeriod = differenceInDays(endDate, startDate) + 1
const daysElapsed = differenceInDays(today, startDate)
const dailyBudget = Number(budget.amount) / daysInPeriod
const dailyBurnRate = daysElapsed > 0 ? Number(budget.spent) / daysElapsed : 0
const daysRemaining = differenceInDays(endDate, today)
const projectedSpend = dailyBurnRate * daysInPeriod
const projectedOverspend = projectedSpend - Number(budget.amount)
```

**Visualización:**
```
┌─────────────────────────────────────────────┐
│ Budget Burn Rate Analysis                    │
│                                              │
│ Daily Budget: $50.00                         │
│ Daily Burn Rate: $45.83                      │
│                                              │
│ [====================================----]   │
│  Day 15/31 · 48% of period elapsed           │
│                                              │
│ Projected: $1,420.83 of $1,500.00            │
│ Overspend: $0.00 (-$79.17 under)             │
│                            ✓ On track         │
└─────────────────────────────────────────────┘
```

**Colors:**
- Proyectado < presupuesto → verde
- Proyectado 80-100% → amarillo
- Proyectado > 100% → rojo

## 8. PAGES

### 8.1 BudgetListPage `/budgets`
```typescript
function BudgetListPage() {
  const [filters, setFilters] = useState<BudgetFilters>({})
  const { data, isLoading, isError, error, refetch } = useBudgets(filters)
  const deleteMutation = useDeleteBudget()

  // Lógica de filtros vía URL search params
  // ...
}
```

**Estados:**
- **Loading:** Skeleton grid de 6 BudgetCards
- **Empty:** BudgetEmptyState
- **Error:** mensaje error + retry
- **Data:** grid de BudgetCards + BudgetFilters

**Layout:**
```
[BudgetNav]
[BudgetFilters] [Crear nuevo]
┌──────┬──────┬──────┐
│ Card │ Card │ Card │  (3 columnas lg, 2 md, 1 sm)
├──────┼──────┼──────┤
│ Card │ Card │ Card │
└──────┴──────┴──────┘
```

### 8.2 BudgetCreatePage `/budgets/new`

```typescript
function BudgetCreatePage() {
  const navigate = useNavigate()
  const createMutation = useCreateBudget()

  const handleSubmit = async (data: CreateBudgetRequest) => {
    await createMutation.mutateAsync(data)
    navigate('/budgets')
  }

  return (
    <>
      <BudgetNav />
      <BudgetForm mode="create" onSubmit={handleSubmit} isLoading={createMutation.isPending} />
    </>
  )
}
```

### 8.3 BudgetEditPage `/budgets/:id/edit`

```typescript
function BudgetEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: budget, isLoading } = useBudget(id)
  const updateMutation = useUpdateBudget()

  const handleSubmit = async (data: CreateBudgetRequest) => {
    await updateMutation.mutateAsync({ id: id!, data })
    navigate(`/budgets/${id}`)
  }

  if (isLoading) return <Skeleton />
  if (!budget) return <NotFound />

  return (
    <>
      <BudgetNav />
      <BudgetForm
        mode="edit"
        defaultValues={budget}
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending}
        onCancel={() => navigate(`/budgets/${id}`)}
      />
    </>
  )
}
```

### 8.4 BudgetDetailPage `/budgets/:id`

```typescript
function BudgetDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: budget, isLoading, isError, refetch } = useBudget(id)
  const { data: alerts } = useBudgetAlerts({ budget_id: id })
  const refreshMutation = useRefreshBudget()
  const updateMutation = useUpdateBudget()
  const [autoAdjustOpen, setAutoAdjustOpen] = useState(false)
}
```

**Layout:**
```
[BudgetNav]
┌─────────────────────────────────────────┐
│ Budget Header                           │
│ [icon] Nombre     [status] [edit][...]   │
│ Tipo: Categoria · Periodo: Mensual      │
│ $1,000 / $1,500 · 67% usado            │
│ [Refresh] [Auto-adjust]                 │
└─────────────────────────────────────────┘

┌─────────────┬───────────────────────────┐
│ BudgetCard   │ BurnRateIndicator         │
│ (grande)     │                           │
│              │ Daily burn rate analytics  │
│              │ Projected overspend        │
└─────────────┴───────────────────────────┘

┌─────────────────────────────────────────┐
│ Configuracion                           │
│ [AlertThresholdSlider] (80%)            │
│ [AlertEnabledToggle]                    │
│ [AutoAdjustToggle]                      │
│ [RolloverToggle]                        │
│ [StrategySelector]                      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Alertas (3 sin leer)                    │
│ [BudgetAlertCard]                       │
│ [BudgetAlertCard]                       │
└─────────────────────────────────────────┘
```

### 8.5 BudgetSummaryPage `/budgets/summary`

```typescript
function BudgetSummaryPage() {
  const { data: summary, isLoading } = useBudgetSummary()
  const { data: budgets } = useBudgets()
}
```

**Layout:**
```
[BudgetNav]
[BudgetSummaryCards]  (4 KPIs)
┌───────────────────────────────────────────────┐
│ Grafico: Distribucion de presupuestos         │
│ [DoughnutChart: total/category/account]        │
│ [BarChart: each budget pct_used]              │
└───────────────────────────────────────────────┘
┌───────────────────────────────────────────────┐
│ Budgets con estado color-coded                │
│ [Grid de BudgetCards compactos]               │
└───────────────────────────────────────────────┘
```

### 8.6 BudgetAlertsPage `/budgets/alerts`

```typescript
function BudgetAlertsPage() {
  const [filters, setFilters] = useState<{
    is_read?: boolean
    severity?: string
    alert_type?: string
  }>({})
  const { data, isLoading } = useBudgetAlerts(filters)
  const markReadMutation = useMarkAlertRead()
  const dismissMutation = useDismissAlert()
}
```

**Layout:**
```
[BudgetNav]
┌─────────────────────────────────────────┐
│ Filtros: [Severidad] [Tipo] [Leido/no] │
│ [Marcar todas leidas]                   │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ [BudgetAlertCard]                       │
│ [BudgetAlertCard]                       │
│ [BudgetAlertCard]                       │
└─────────────────────────────────────────┘
```

## 9. ROUTES — Archivos a modificar

### 9.1 `src/routes/lazy.ts`
Agregar al final:
```typescript
// Budgets
export const BudgetListPage = lazy(() => import('@/features/budgets/pages/BudgetListPage'))
export const BudgetCreatePage = lazy(() => import('@/features/budgets/pages/BudgetCreatePage'))
export const BudgetEditPage = lazy(() => import('@/features/budgets/pages/BudgetEditPage'))
export const BudgetDetailPage = lazy(() => import('@/features/budgets/pages/BudgetDetailPage'))
export const BudgetSummaryPage = lazy(() => import('@/features/budgets/pages/BudgetSummaryPage'))
export const BudgetAlertsPage = lazy(() => import('@/features/budgets/pages/BudgetAlertsPage'))
```

### 9.2 `src/routes/index.tsx`
Importar los nuevos lazy:
```typescript
import {
  // ... existing imports ...
  BudgetListPage, BudgetCreatePage, BudgetEditPage, BudgetDetailPage,
  BudgetSummaryPage, BudgetAlertsPage,
} from './lazy'
```

Reemplazar los PlaceholderPage de budgets:
```typescript
// Budgets
{
  path: '/budgets',
  element: (<SuspenseWrapper><BudgetListPage /></SuspenseWrapper>),
},
{
  path: '/budgets/new',
  element: (<SuspenseWrapper><BudgetCreatePage /></SuspenseWrapper>),
},
{
  path: '/budgets/:id',
  element: (<SuspenseWrapper><BudgetDetailPage /></SuspenseWrapper>),
},
{
  path: '/budgets/:id/edit',
  element: (<SuspenseWrapper><BudgetEditPage /></SuspenseWrapper>),
},
{
  path: '/budgets/summary',
  element: (<SuspenseWrapper><BudgetSummaryPage /></SuspenseWrapper>),
},
{
  path: '/budgets/alerts',
  element: (<SuspenseWrapper><BudgetAlertsPage /></SuspenseWrapper>),
},
```

## 10. SIDEBAR — Verificar

Ya existe la entrada en `Sidebar.tsx:53`:
```typescript
{ name: 'Presupuestos', href: '/budgets', icon: PiggyBank },
```

Esto ya enlaza a `/budgets` que ahora apuntará a `BudgetListPage`. No requiere cambios.

## 11. ESTRATEGIAS DE DISEÑO Y UX

### 11.1 Estados de carga
- **Lists (BudgetListPage, BudgetAlertsPage):** 6 skeleton cards con shimmer animation
- **Details (BudgetDetailPage):** Skeleton con forma de la página completa
- **Forms (BudgetCreatePage, BudgetEditPage):** No skeleton (form vacío), solo spinner en submit
- **Summary (BudgetSummaryPage):** Skeleton de KPIs + charts

### 11.2 Manejo de errores
- **Error en listados:** `ErrorMessage` componente con mensaje + botón `refetch`
- **Error en detalle:** Si 404, mostrar "Presupuesto no encontrado" + link a `/budgets`
- **Error en mutations:** toast de error con mensaje descriptivo
- **Error en auto-adjust:** Si 422 (auto_adjust disabled), toast específico "Habilita auto-ajuste primero"

### 11.3 Optimizaciones de rendimiento
- **BudgetCard**: usar `React.memo` (recibe props simples)
- **BudgetListPage**: `useMemo` para budgets filtrados
- **BurnRateIndicator**: `useMemo` para cálculos (daily burn, projected, etc.)
- **Charts**: `React.memo` con comparación custom
- **Infinite scroll**: No necesario (los budgets son típicamente < 50)

### 11.4 Responsive
- **Desktop (lg+):** BudgetCards en grid 3 columnas
- **Tablet (md):** BudgetCards en grid 2 columnas
- **Mobile (<md):** BudgetCards 1 columna, BudgetNav como dropdown
- **Forms:** 2 columnas en desktop, 1 columna en mobile

### 11.5 Dark Mode
- Todos los componentes con variantes `dark:` en Tailwind
- Charts con tema oscuro (Recharts `theme.dark`)
- BudgetCards con fondo `bg-white dark:bg-gray-800`
- Status colors consistentes en ambos modos

### 11.6 Animaciones (opcional, framer-motion)
- Budget cards: fade in con stagger (listado)
- Progress bar: animación de ancho en mount
- Budget type selector: transición suave entre tipos
- Budget summary cards: contar números animados

### 11.7 Accesibilidad
- Progress bars: `role="progressbar"` con `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Budget type selector: `role="radiogroup"` con `role="radio"`
- Toggles: `role="switch"` con `aria-checked`
- Sliders: `role="slider"` con `aria-valuenow`
- Color: nunca solo color para indicar estado (usar icono + label + color)

## 12. ORDEN DE IMPLEMENTACIÓN RECOMENDADO

1. `src/types/budgets.ts` — tipos
2. `src/features/budgets/constants.ts` — constantes
3. `src/features/budgets/api/budgets.ts` + `api/alerts.ts` — API layer
4. `src/features/budgets/hooks/useBudgets.ts` + `hooks/useBudgetAlerts.ts` — hooks
5. `src/features/budgets/components/BudgetProgressBar.tsx` — componente base
6. `src/features/budgets/components/BudgetTypeSelector.tsx`
7. `src/features/budgets/components/PeriodSelector.tsx`
8. `src/features/budgets/components/BudgetStrategySelector.tsx`
9. `src/features/budgets/components/AlertThresholdSlider.tsx`
10. `src/features/budgets/components/RolloverToggle.tsx`
11. `src/features/budgets/components/BudgetEmptyState.tsx`
12. `src/features/budgets/components/BudgetForm.tsx`
13. `src/features/budgets/pages/BudgetCreatePage.tsx`
14. `src/features/budgets/pages/BudgetEditPage.tsx`
15. `src/features/budgets/components/BudgetCard.tsx`
16. `src/features/budgets/components/BudgetFilters.tsx`
17. `src/features/budgets/pages/BudgetListPage.tsx`
18. `src/features/budgets/components/BudgetNav.tsx`
19. `src/features/budgets/components/BurnRateIndicator.tsx`
20. `src/features/budgets/components/BudgetRefreshButton.tsx`
21. `src/features/budgets/components/BudgetAutoAdjustModal.tsx`
22. `src/features/budgets/pages/BudgetDetailPage.tsx`
23. `src/features/budgets/components/BudgetSummaryCards.tsx`
24. `src/features/budgets/pages/BudgetSummaryPage.tsx`
25. `src/features/budgets/components/BudgetAlertCard.tsx`
26. `src/features/budgets/components/BudgetAlertList.tsx`
27. `src/features/budgets/pages/BudgetAlertsPage.tsx`
28. `src/routes/lazy.ts` — agregar lazy imports
29. `src/routes/index.tsx` — reemplazar PlaceholderPage con pages reales

## 13. VERIFICACIÓN FINAL

```bash
# 1. TypeScript compilation check
pnpm tsc --noEmit

# 2. Lint
pnpm lint

# 3. Test each route in browser:
#    - /budgets              → BudgetListPage (vacío → empty state)
#    - /budgets/new          → BudgetCreatePage (formulario)
#    - /budgets/:id          → BudgetDetailPage (después de crear uno)
#    - /budgets/:id/edit     → BudgetEditPage (pre-poblado)
#    - /budgets/summary      → BudgetSummaryPage (KPIs)
#    - /budgets/alerts       → BudgetAlertsPage (lista alertas)

# 4. Verify dark mode en todas las pages
# 5. Verify responsive (mobile, tablet, desktop)
# 6. Verify auto-adjust modal (dry-run + apply)
# 7. Verify refresh button recalcula spent
# 8. Verify progress bar colors: <80% green, 80-100% yellow, >100% red
# 9. Verify filter persistence via URL params
```
