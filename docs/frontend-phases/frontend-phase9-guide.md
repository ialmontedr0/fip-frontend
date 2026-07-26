# Fase 9: Goals — Guia de Implementacion

Version: 1.0
Proyecto: Financial Intelligence Platform (FIP) - Frontend

---

## Indice

1. [Resumen de la Fase](#1-resumen-de-la-fase)
2. [Backend API Reference](#2-backend-api-reference)
   - 2.1 [Goal CRUD](#21-goal-crud)
   - 2.2 [Goal Actions (Refresh, Predict)](#22-goal-actions-refresh-predict)
   - 2.3 [Goal Simulations CRUD](#23-goal-simulations-crud)
   - 2.4 [Goal Statuses & Types](#24-goal-statuses--types)
3. [Estructura de Archivos](#3-estructura-de-archivos)
4. [Tipos de TypeScript](#4-tipos-de-typescript)
5. [API Client](#5-api-client)
6. [Hooks de TanStack Query](#6-hooks-de-tanstack-query)
7. [Constantes y Configuracion](#7-constantes-y-configuracion)
8. [Componentes Compartidos](#8-componentes-compartidos)
   - 8.1 [ProgressRing](#81-progressring)
   - 8.2 [GoalTypeBadge](#82-goaltypebadge)
   - 8.3 [GoalStatusBadge](#83-goalstatusbadge)
   - 8.4 [PrioritySelector](#84-priorityselector)
   - 8.5 [GoalCard](#85-goalcard)
   - 8.6 [GoalTable](#86-goaltable)
   - 8.7 [GoalFilters](#87-goalfilters)
   - 8.8 [GoalForm](#88-goalform)
   - 8.9 [GoalCreateWizard](#89-goalcreatewizard)
   - 8.10 [ProgressBar](#810-progressbar)
   - 8.11 [SimulationForm](#811-simulationform)
   - 8.12 [ProjectionChart](#812-projectionchart)
   - 8.13 [SummaryCards](#813-summarycards)
   - 8.14 [AutoContributeToggle](#814-autocontributetoggle)
   - 8.15 [EmptyGoalState](#815-emptygoalstate)
9. [Pages (Layouts y Comportamiento)](#9-pages-layouts-y-comportamiento)
   - 9.1 [GoalListPage](#91-goallistpage)
   - 9.2 [GoalCreatePage (Wizard)](#92-goalcreatepage-wizard)
   - 9.3 [GoalDetailPage](#93-goaldetailpage)
   - 9.4 [GoalEditPage](#94-goaleditpage)
   - 9.5 [GoalSummaryPage (Dashboard)](#95-goalsummarypage-dashboard)
   - 9.6 [GoalSimulationPage](#96-goalsimulationpage)
   - 9.7 [GoalSimulationListPage](#97-goalsimulationlistpage)
10. [Actualizacion de Routing](#10-actualizacion-de-routing)
11. [Actualizacion de Sidebar](#11-actualizacion-de-sidebar)
12. [Estrategias y Mejores Practicas](#12-estrategias-y-mejores-practicas)
13. [Verificacion Final](#13-verificacion-final)

---

## 1. Resumen de la Fase

**Estado actual:** Fase 8 completada (Budgets CRUD, Alerts, Auto-adjust, Rollover, Dashboard widget).

**Objetivos de Fase 9:**

| Area | Descripcion |
|------|-------------|
| **Goal CRUD** | Crear, listar (con filtros), detalle, editar, eliminar metas con tipos (7 tipos), prioridad 1-5, auto-contribute |
| **Goal Create Wizard** | Flujo multi-paso: tipo -> detalles -> target economico -> tracking setup |
| **Goal Detail** | Progreso %, fecha estimada de completion, AI recommendations, milestones |
| **Goal Summary Dashboard** | Total goals, on track vs behind count, overall progress |
| **Goal Simulation** | What-if scenarios con proyeccion mensual, grafico cumulative |
| **ProgressRing** | Componente circular de progreso reutilizable |
| **Priority Selector** | Selector visual de prioridad 1-5 |
| **Auto-Contribute Toggle** | Toggle para contribucion automatica |
| **Goal Type Icons** | Iconos especificos para cada tipo de meta |

### Convenciones a Seguir

- **Patron existente**: Seguir exactamente la misma estructura que Fases 6-8
- **API Client**: Todos los llamados van por `lib/api.ts`
- **Server State**: TanStack Query para todos los datos del API
- **Forms**: React Hook Form + Zod para validacion
- **Toasts**: `react-hot-toast` para feedback
- **Estilo**: TailwindCSS con glass morphism `bg-white/80 backdrop-blur-xl`
- **Animaciones**: `animate-fade-in` con `animationDelay` escalonado
- **Componentes UI**: Usar los existentes en `components/ui/` (Card, Button, Input, Badge, Skeleton, Modal, etc.)
- **Iconos**: Lucide React
- **Balance**: Usar `formatCurrency(parseFloat(amount), currency_code)` de `lib/utils.ts`
- **Charts**: Usar Recharts directamente para el projection chart
- **Tabla responsive**: Card layout en mobile, tabla en desktop
- **Misma estructura que budgets**: Carpeta `api/`, `hooks/`, `components/`, `pages/`

---

## 2. Backend API Reference

Base path: `/api/v1/goals`

### 2.1 Goal CRUD

#### `POST /goals` — Crear meta (201)

**Request Body:**
```typescript
{
  name: string                          // requerido, 1-200 chars
  description?: string | null
  target_amount: string                 // "100000.00"
  goal_type?: string                    // default "savings"
  start_date?: string | null            // "YYYY-MM-DD"
  target_date?: string | null           // "YYYY-MM-DD"
  monthly_contribution?: string | null
  interest_rate?: string | null
  compound_frequency?: string | null    // daily | weekly | biweekly | monthly | quarterly | yearly
  account_id?: string | null            // UUID
  category_id?: string | null           // UUID
  priority?: int                        // 1-5, default 1
  auto_contribute?: boolean             // default false
  icon?: string | null
  color?: string | null
  image_url?: string | null
}
```

**Response (201):**
```typescript
{
  id: string                            // UUID
  name: string
  description: string | null
  goal_type: string
  target_amount: string
  current_amount: string               // empieza en 0
  start_date: string                   // "YYYY-MM-DD"
  target_date: string
  completed_date: string | null
  status: string                       // "active"
  priority: int
  monthly_contribution: string | null
  auto_contribute: boolean
  interest_rate: string | null
  compound_frequency: string | null
  account_id: string | null
  category_id: string | null
  icon: string | null
  color: string | null
  image_url: string | null
  milestone_reached_pct: int
  progress: {
    goal_id, name, target_amount, current_amount,
    remaining, pct_complete, target_date,
    days_left, months_left, monthly_needed,
    time_pct, behind_schedule, status, milestone_reached_pct
  }
  milestones: Array<{
    id: string, event_type: string,
    amount_at_event: string, pct_complete: string,
    contribution_amount: string | null, notes: string | null, created_at: string
  }>
  prediction: {
    predicted_completion_date: string | null,
    predicted_probability: number | null,
    recommended_monthly: string | null,
    prediction_updated_at: string | null
  }
  created_at: string | null
  updated_at: string | null
}
```

#### `GET /goals` — Listar metas (200)

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| goal_type | string? | Filtrar por tipo |
| status | string? | Filtrar por estado |
| priority | int? | Filtrar por prioridad |

**Response:**
```typescript
{
  goals: Array<{
    id: string, name: string, description: string | null,
    goal_type: string,
    target_amount: string, current_amount: string, pct_complete: number,
    start_date: string, target_date: string,
    status: string, priority: int,
    monthly_contribution: string | null,
    interest_rate: string | null,
    predicted_completion_date: string | null,
    predicted_probability: number | null,
    recommended_monthly: string | null,
    icon: string | null, color: string | null, image_url: string | null,
    milestone_reached_pct: int,
    created_at: string | null,
  }>
  total: int
}
```

#### `GET /goals/summary` — Resumen dashboard (200)

**Response:**
```typescript
{
  total_goals: int
  active_goals: int
  completed_goals: int
  total_target_amount: string
  total_current_amount: string
  overall_progress_pct: number
  behind_schedule_count: int
  on_track_count: int
}
```

#### `GET /goals/{goal_id}` — Obtener detalle completo (200)

Returns full goal detail con progress, milestones, prediction (mismo shape que create response).

#### `PATCH /goals/{goal_id}` — Actualizar meta (200)

**Request Body:** Partial de cualquier campo de create request.

**Response:** Goal actualizado (mismo shape).

#### `DELETE /goals/{goal_id}` — Eliminar meta (200)

**Response:** `{ message: string }`

---

### 2.2 Goal Actions (Refresh, Predict)

#### `POST /goals/{goal_id}/refresh` — Recalcular progreso + prediccion (200)

Recalcula current_amount basado en transacciones de income, actualiza milestones, y regenera prediccion AI.

**Response:**
```typescript
{
  id: string, name: string,
  target_amount: string, current_amount: string, status: string,
  progress: { /* full progress object */ },
  prediction: { /* full prediction object */ }
}
```

#### `POST /goals/{goal_id}/predict` — Refrescar prediccion AI (200)

Solo regenera la prediccion sin recalcular el progreso.

**Response:**
```typescript
{
  goal_id: string, name: string,
  prediction: {
    predicted_completion_date: string | null,
    predicted_probability: number | null,
    recommended_monthly: string | null,
    prediction_updated_at: string | null
  }
}
```

---

### 2.3 Goal Simulations CRUD

#### `GET /goals/{goal_id}/simulations` — Listar simulaciones (200)

**Response:**
```typescript
{
  goal_id: string,
  goal_name: string,
  simulations: Array<{
    id: string, name: string,
    monthly_contribution: string,
    lump_sum: string | null,
    interest_rate: string | null,
    increase_pct: string | null,
    predicted_completion_date: string | null,
    predicted_probability: number | null,
    total_contributions: string | null,
    months_to_complete: int | null,
    notes: string | null,
    created_at: string | null
  }>
  total: int
}
```

#### `POST /goals/{goal_id}/simulations` — Crear simulacion what-if (201)

**Request Body:**
```typescript
{
  name: string                          // requerido
  monthly_contribution: string          // requerido, monto mensual a simular
  lump_sum?: string | null              // deposito unico opcional
  lump_sum_date?: string | null         // fecha del deposito unico
  interest_rate?: string | null         // tasa de interes anual %
  increase_pct?: string | null          // incremento anual de contribucion %
  notes?: string | null
}
```

**Response:**
```typescript
{
  id: string, name: string,
  goal_id: string, goal_name: string,
  monthly_contribution: string,
  lump_sum: string | null,
  lump_sum_date: string | null,
  interest_rate: string | null,
  increase_pct: string | null,
  predicted_completion_date: string | null,
  predicted_probability: number | null,
  total_contributions: string,
  total_interest: string,
  months_to_complete: int,
  projection: Array<{
    month: int,                           // mes 1, 2, 3...
    contribution: number,                  // contribucion del mes
    interest: number,                      // interes generado en el mes
    cumulative: number,                    // balance acumulado
    date: string                           // fecha del mes
  }>,
  notes: string | null,
  created_at: string | null
}
```

#### `DELETE /goals/{goal_id}/simulations/{simulation_id}` — Eliminar simulacion (200)

**Response:** `{ message: string }`

---

### 2.4 Goal Statuses & Types

**Goal Types:**
| Type | Descripcion | Icono Sugerido |
|------|-------------|----------------|
| savings | Ahorro general | PiggyBank |
| debt_payoff | Pago de deuda | CreditCard |
| investment | Inversion | TrendingUp |
| emergency | Fondo de emergencia | Shield |
| education | Educacion | GraduationCap |
| retirement | Jubilacion | Heart |
| custom | Personalizado | Flag |

**Goal Statuses:** `active`, `completed`, `paused`, `cancelled`

**Priorities:** 1 (mas baja) - 5 (mas alta)

**Compound Frequencies:** `daily`, `weekly`, `biweekly`, `monthly`, `quarterly`, `yearly`

---

## 3. Estructura de Archivos

Crear dentro de `src/features/goals/`:

```
src/features/goals/
  api/
    goals.ts               # API client CRUD + actions
    simulations.ts          # API client simulations
  hooks/
    useGoals.ts            # TanStack Query hooks for goals
    useSimulations.ts      # TanStack Query hooks for simulations
  components/
    ProgressRing.tsx        # Componente circular de progreso reutilizable
    GoalTypeBadge.tsx       # Badge de tipo con icono y color
    GoalStatusBadge.tsx     # Badge de estado (active/completed/paused/cancelled)
    PrioritySelector.tsx    # Selector visual de prioridad 1-5
    GoalCard.tsx            # Card para lista mobile
    GoalTable.tsx           # Tabla para lista desktop
    GoalFilters.tsx         # Filtros (tipo, estado, prioridad)
    GoalForm.tsx            # Formulario completo de crear/editar
    GoalCreateWizard.tsx    # Wizard multi-paso
    ProgressBar.tsx         # Barra de progreso horizontal con labels
    SimulationForm.tsx      # Formulario de simulacion what-if
    ProjectionChart.tsx     # Chart de proyeccion (Recharts area)
    SummaryCards.tsx        # KPIs del dashboard de metas
    AutoContributeToggle.tsx # Toggle de contribucion automatica
    EmptyGoalState.tsx      # Empty state
  pages/
    GoalListPage.tsx        # Lista de metas con filtros
    GoalCreatePage.tsx      # Wizard de creacion
    GoalDetailPage.tsx      # Detalle completo de meta
    GoalEditPage.tsx        # Editar meta
    GoalSummaryPage.tsx     # Dashboard de progreso de metas
    GoalSimulationPage.tsx  # Simulacion what-if (crear y ver resultado)
    GoalSimulationListPage.tsx # Lista de simulaciones guardadas
  constants.ts              # Configuracion de tipos, estados, colores
```

---

## 4. Tipos de TypeScript

Crear `src/types/goals.ts`:

```typescript
// ================================================================
// Goal Enums
// ================================================================

export const GOAL_TYPES = {
  savings: 'Ahorro',
  debt_payoff: 'Pago Deuda',
  investment: 'Inversion',
  emergency: 'Emergencia',
  education: 'Educacion',
  retirement: 'Jubilacion',
  custom: 'Personalizado',
} as const

export type GoalType = keyof typeof GOAL_TYPES

export const GOAL_STATUSES = {
  active: 'Activa',
  completed: 'Completada',
  paused: 'Pausada',
  cancelled: 'Cancelada',
} as const

export type GoalStatus = keyof typeof GOAL_STATUSES

export const COMPOUND_FREQUENCIES = {
  daily: 'Diario',
  weekly: 'Semanal',
  biweekly: 'Quincenal',
  monthly: 'Mensual',
  quarterly: 'Trimestral',
  yearly: 'Anual',
} as const

export type CompoundFrequency = keyof typeof COMPOUND_FREQUENCIES

// ================================================================
// Goal
// ================================================================

export interface CreateGoalRequest {
  name: string
  description?: string | null
  target_amount: string
  goal_type?: GoalType
  start_date?: string | null
  target_date?: string | null
  monthly_contribution?: string | null
  interest_rate?: string | null
  compound_frequency?: CompoundFrequency | null
  account_id?: string | null
  category_id?: string | null
  priority?: number
  auto_contribute?: boolean
  icon?: string | null
  color?: string | null
  image_url?: string | null
}

export interface UpdateGoalRequest {
  name?: string
  description?: string | null
  target_amount?: string
  goal_type?: GoalType
  start_date?: string | null
  target_date?: string | null
  monthly_contribution?: string | null
  interest_rate?: string | null
  compound_frequency?: CompoundFrequency | null
  account_id?: string | null
  category_id?: string | null
  priority?: number
  auto_contribute?: boolean
  icon?: string | null
  color?: string | null
  image_url?: string | null
  status?: GoalStatus
}

export interface GoalProgress {
  goal_id: string
  name: string
  target_amount: string
  current_amount: string
  remaining: string
  pct_complete: number
  target_date: string
  days_left: number
  months_left: number
  monthly_needed: string
  time_pct: number
  behind_schedule: boolean
  status: string
  milestone_reached_pct: number
}

export interface GoalPrediction {
  predicted_completion_date: string | null
  predicted_probability: number | null
  recommended_monthly: string | null
  prediction_updated_at: string | null
}

export interface GoalMilestone {
  id: string
  event_type: string
  amount_at_event: string
  pct_complete: string
  contribution_amount: string | null
  notes: string | null
  created_at: string | null
}

export interface GoalResponse {
  id: string
  name: string
  description: string | null
  goal_type: string
  target_amount: string
  current_amount: string
  start_date: string
  target_date: string
  completed_date: string | null
  status: string
  priority: number
  monthly_contribution: string | null
  auto_contribute: boolean
  interest_rate: string | null
  compound_frequency: string | null
  account_id: string | null
  category_id: string | null
  icon: string | null
  color: string | null
  image_url: string | null
  milestone_reached_pct: number
  progress?: GoalProgress
  milestones?: GoalMilestone[]
  prediction?: GoalPrediction
  created_at: string | null
  updated_at: string | null
}

export interface GoalListItem {
  id: string
  name: string
  description: string | null
  goal_type: string
  target_amount: string
  current_amount: string
  pct_complete: number
  start_date: string
  target_date: string
  status: string
  priority: number
  monthly_contribution: string | null
  interest_rate: string | null
  predicted_completion_date: string | null
  predicted_probability: number | null
  recommended_monthly: string | null
  icon: string | null
  color: string | null
  image_url: string | null
  milestone_reached_pct: number
  created_at: string | null
}

export interface ListGoalsResponse {
  goals: GoalListItem[]
  total: number
}

export interface GoalSummaryResponse {
  total_goals: number
  active_goals: number
  completed_goals: number
  total_target_amount: string
  total_current_amount: string
  overall_progress_pct: number
  behind_schedule_count: number
  on_track_count: number
}

export interface GoalFilters {
  goal_type?: GoalType
  status?: GoalStatus
  priority?: number
}

// ================================================================
// Goal Simulation
// ================================================================

export interface CreateSimulationRequest {
  name: string
  monthly_contribution: string
  lump_sum?: string | null
  lump_sum_date?: string | null
  interest_rate?: string | null
  increase_pct?: string | null
  notes?: string | null
}

export interface SimulationProjection {
  month: number
  contribution: number
  interest: number
  cumulative: number
  date: string
}

export interface SimulationResponse {
  id: string
  name: string
  goal_id: string
  goal_name: string
  monthly_contribution: string
  lump_sum: string | null
  lump_sum_date: string | null
  interest_rate: string | null
  increase_pct: string | null
  predicted_completion_date: string | null
  predicted_probability: number | null
  total_contributions: string
  total_interest: string
  months_to_complete: number
  projection: SimulationProjection[]
  notes: string | null
  created_at: string | null
}

export interface SimulationListItem {
  id: string
  name: string
  monthly_contribution: string
  lump_sum: string | null
  interest_rate: string | null
  increase_pct: string | null
  predicted_completion_date: string | null
  predicted_probability: number | null
  total_contributions: string | null
  months_to_complete: number | null
  notes: string | null
  created_at: string | null
}

export interface ListSimulationsResponse {
  goal_id: string
  goal_name: string
  simulations: SimulationListItem[]
  total: number
}

// ================================================================
// Goal Actions
// ================================================================

export interface RefreshGoalResponse {
  id: string
  name: string
  target_amount: string
  current_amount: string
  status: string
  progress: GoalProgress
  prediction: GoalPrediction
}

export interface RefreshPredictionResponse {
  goal_id: string
  name: string
  prediction: GoalPrediction
}
```

---

## 5. API Client

Crear `src/features/goals/api/goals.ts`:

```typescript
import api from '@/lib/api'
import type {
  CreateGoalRequest, UpdateGoalRequest,
  GoalResponse, ListGoalsResponse, GoalSummaryResponse,
  GoalFilters, RefreshGoalResponse, RefreshPredictionResponse,
} from '@/types/goals'

export function createGoal(data: CreateGoalRequest) {
  return api.post<GoalResponse>('/goals', data)
}

export function listGoals(params?: GoalFilters) {
  return api.get<ListGoalsResponse>('/goals', { params })
}

export function getGoalSummary() {
  return api.get<GoalSummaryResponse>('/goals/summary')
}

export function getGoal(id: string) {
  return api.get<GoalResponse>(`/goals/${id}`)
}

export function updateGoal(id: string, data: UpdateGoalRequest) {
  return api.patch<GoalResponse>(`/goals/${id}`, data)
}

export function deleteGoal(id: string) {
  return api.delete<{ message: string }>(`/goals/${id}`)
}

export function refreshGoal(id: string) {
  return api.post<RefreshGoalResponse>(`/goals/${id}/refresh`)
}

export function refreshGoalPrediction(id: string) {
  return api.post<RefreshPredictionResponse>(`/goals/${id}/predict`)
}
```

Crear `src/features/goals/api/simulations.ts`:

```typescript
import api from '@/lib/api'
import type {
  CreateSimulationRequest, SimulationResponse,
  ListSimulationsResponse,
} from '@/types/goals'

export function createSimulation(goalId: string, data: CreateSimulationRequest) {
  return api.post<SimulationResponse>(`/goals/${goalId}/simulations`, data)
}

export function listSimulations(goalId: string) {
  return api.get<ListSimulationsResponse>(`/goals/${goalId}/simulations`)
}

export function deleteSimulation(goalId: string, simulationId: string) {
  return api.delete<{ message: string }>(`/goals/${goalId}/simulations/${simulationId}`)
}
```

---

## 6. Hooks de TanStack Query

Crear `src/features/goals/hooks/useGoals.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as goalsApi from '../api/goals'
import type {
  CreateGoalRequest, UpdateGoalRequest, GoalFilters,
} from '@/types/goals'

export const goalKeys = {
  all: ['goals'] as const,
  lists: () => [...goalKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...goalKeys.lists(), filters] as const,
  details: () => [...goalKeys.all, 'detail'] as const,
  detail: (id: string) => [...goalKeys.details(), id] as const,
  summary: () => [...goalKeys.all, 'summary'] as const,
}

function cleanParams(params?: Record<string, unknown>) {
  if (!params) return undefined
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null),
  )
}

// === List ===

export function useGoals(params?: GoalFilters) {
  return useQuery({
    queryKey: goalKeys.list(cleanParams(params as Record<string, unknown>)),
    queryFn: () => goalsApi.listGoals(params).then((r) => r.data),
    staleTime: 1000 * 60,
  })
}

// === Summary ===

export function useGoalSummary() {
  return useQuery({
    queryKey: goalKeys.summary(),
    queryFn: () => goalsApi.getGoalSummary().then((r) => r.data),
    staleTime: 1000 * 60 * 2,
  })
}

// === Detail ===

export function useGoal(id: string | undefined) {
  return useQuery({
    queryKey: goalKeys.detail(id!),
    queryFn: () => goalsApi.getGoal(id!).then((r) => r.data),
    enabled: !!id,
    staleTime: 1000 * 60,
  })
}

// === Mutations ===

export function useCreateGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateGoalRequest) => goalsApi.createGoal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.lists() })
      queryClient.invalidateQueries({ queryKey: goalKeys.summary() })
      toast.success('Meta creada exitosamente')
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
      toast.error(message || 'Error al crear la meta')
    },
  })
}

export function useUpdateGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGoalRequest }) =>
      goalsApi.updateGoal(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: goalKeys.lists() })
      queryClient.invalidateQueries({ queryKey: goalKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: goalKeys.summary() })
      toast.success('Meta actualizada exitosamente')
    },
    onError: () => toast.error('Error al actualizar la meta'),
  })
}

export function useDeleteGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => goalsApi.deleteGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.lists() })
      queryClient.invalidateQueries({ queryKey: goalKeys.summary() })
      toast.success('Meta eliminada exitosamente')
    },
    onError: () => toast.error('Error al eliminar la meta'),
  })
}

export function useRefreshGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => goalsApi.refreshGoal(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: goalKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: goalKeys.lists() })
      queryClient.invalidateQueries({ queryKey: goalKeys.summary() })
      toast.success('Progreso recalculado exitosamente')
    },
    onError: () => toast.error('Error al recalcular progreso'),
  })
}

export function useRefreshPrediction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => goalsApi.refreshGoalPrediction(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: goalKeys.detail(id) })
      toast.success('Prediccion actualizada exitosamente')
    },
    onError: () => toast.error('Error al actualizar prediccion'),
  })
}
```

Crear `src/features/goals/hooks/useSimulations.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as simulationsApi from '../api/simulations'
import type { CreateSimulationRequest } from '@/types/goals'

export const simulationKeys = {
  all: (goalId: string) => ['goal-simulations', goalId] as const,
  list: (goalId: string) => [...simulationKeys.all(goalId), 'list'] as const,
}

export function useSimulations(goalId: string | undefined) {
  return useQuery({
    queryKey: simulationKeys.list(goalId!),
    queryFn: () => simulationsApi.listSimulations(goalId!).then((r) => r.data),
    enabled: !!goalId,
    staleTime: 1000 * 60,
  })
}

export function useCreateSimulation(goalId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateSimulationRequest) =>
      simulationsApi.createSimulation(goalId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: simulationKeys.list(goalId) })
      toast.success('Simulacion creada exitosamente')
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
      toast.error(message || 'Error al crear la simulacion')
    },
  })
}

export function useDeleteSimulation(goalId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (simulationId: string) =>
      simulationsApi.deleteSimulation(goalId, simulationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: simulationKeys.list(goalId) })
      toast.success('Simulacion eliminada')
    },
    onError: () => toast.error('Error al eliminar la simulacion'),
  })
}
```

---

## 7. Constantes y Configuracion

Crear `src/features/goals/constants.ts`:

```typescript
import {
  PiggyBank, CreditCard, TrendingUp, Shield,
  GraduationCap, Heart, Flag,
  CheckCircle2, PauseCircle, XCircle, Circle,
  Star, StarHalf,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { GoalType, GoalStatus } from '@/types/goals'

export const GOAL_TYPE_CONFIG: Record<GoalType, {
  label: string
  icon: LucideIcon
  color: string
  bgColor: string
  gradient: string
  description: string
}> = {
  savings: {
    label: 'Ahorro', icon: PiggyBank,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-500/10',
    gradient: 'from-blue-400 to-blue-600',
    description: 'Ahorro general para cualquier proposito',
  },
  debt_payoff: {
    label: 'Pago Deuda', icon: CreditCard,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-500/10',
    gradient: 'from-red-400 to-red-600',
    description: 'Pagar una deuda existente',
  },
  investment: {
    label: 'Inversion', icon: TrendingUp,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-500/10',
    gradient: 'from-emerald-400 to-emerald-600',
    description: 'Invertir para crecimiento financiero',
  },
  emergency: {
    label: 'Emergencia', icon: Shield,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-500/10',
    gradient: 'from-amber-400 to-amber-600',
    description: 'Fondo de emergencia (3-6 meses)',
  },
  education: {
    label: 'Educacion', icon: GraduationCap,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-500/10',
    gradient: 'from-purple-400 to-purple-600',
    description: 'Estudios, cursos o capacitacion',
  },
  retirement: {
    label: 'Jubilacion', icon: Heart,
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-100 dark:bg-rose-500/10',
    gradient: 'from-rose-400 to-rose-600',
    description: 'Ahorro para el retiro',
  },
  custom: {
    label: 'Personalizado', icon: Flag,
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-500/10',
    gradient: 'from-gray-400 to-gray-600',
    description: 'Meta personalizada',
  },
}

export const GOAL_STATUS_CONFIG: Record<GoalStatus, {
  label: string
  icon: LucideIcon
  color: string
  bgColor: string
  dotColor: string
}> = {
  active: { label: 'Activa', icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-100 dark:bg-emerald-500/10', dotColor: 'bg-emerald-500' },
  completed: { label: 'Completada', icon: CheckCircle2, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-500/10', dotColor: 'bg-blue-500' },
  paused: { label: 'Pausada', icon: PauseCircle, color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-500/10', dotColor: 'bg-amber-500' },
  cancelled: { label: 'Cancelada', icon: XCircle, color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-500/10', dotColor: 'bg-red-500' },
}

export const PRIORITY_CONFIG: Record<number, {
  label: string
  color: string
  bgColor: string
  icon: LucideIcon
}> = {
  1: { label: 'Muy Baja', color: 'text-gray-400', bgColor: 'bg-gray-100 dark:bg-gray-500/10', icon: StarHalf },
  2: { label: 'Baja', color: 'text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-500/10', icon: StarHalf },
  3: { label: 'Normal', color: 'text-emerald-500', bgColor: 'bg-emerald-100 dark:bg-emerald-500/10', icon: Star },
  4: { label: 'Alta', color: 'text-amber-500', bgColor: 'bg-amber-100 dark:bg-amber-500/10', icon: Star },
  5: { label: 'Critica', color: 'text-red-500', bgColor: 'bg-red-100 dark:bg-red-500/10', icon: Star },
}

export const GOAL_TYPE_OPTIONS = Object.entries(GOAL_TYPE_CONFIG).map(([value, config]) => ({
  value: value as GoalType,
  label: config.label,
  icon: config.icon,
  gradient: config.gradient,
  description: config.description,
}))

export const PRIORITY_OPTIONS = [
  { value: 1, label: 'Muy Baja', description: 'Sin prisa, objetivo a largo plazo' },
  { value: 2, label: 'Baja', description: 'Poca urgencia' },
  { value: 3, label: 'Normal', description: 'Prioridad media' },
  { value: 4, label: 'Alta', description: 'Importante, atencion regular' },
  { value: 5, label: 'Critica', description: 'Urgente, maxima prioridad' },
]

export const COMPOUND_OPTIONS = [
  { value: 'daily', label: 'Diario' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'biweekly', label: 'Quincenal' },
  { value: 'monthly', label: 'Mensual' },
  { value: 'quarterly', label: 'Trimestral' },
  { value: 'yearly', label: 'Anual' },
]

export const GOAL_TABS = [
  { path: '/goals', label: 'Metas', icon: PiggyBank },
  { path: '/goals/summary', label: 'Progreso', icon: TrendingUp },
] as const
```

---

## 8. Componentes Compartidos

### 8.1 ProgressRing

Componente SVG circular de progreso reutilizable.

```tsx
// Props:
//   progress: number       // 0-100
//   size?: number          // default 120
//   strokeWidth?: number   // default 8
//   color?: string         // default segun progreso
//   bgColor?: string       // default gray-200
//   children?: ReactNode   // contenido central (label, %, etc.)

// Colores auto:
//   progress >= 100 -> emerald
//   progress >= 75 -> blue
//   progress >= 50 -> amber
//   progress < 50 -> red/gray

// Estructura:
//   <svg viewBox="0 0 120 120">
//     <circle className="text-gray-200 dark:text-gray-700" ... /> (background)
//     <circle className={color} ... strokeDasharray={circumference} strokeDashoffset={offset} /> (progress)
//     {children centrado en el medio}
//   </svg>

// Usar transform rotate -90 para empezar desde arriba
// Transicion con transition-all duration-1000 ease-out
```

### 8.2 GoalTypeBadge

Badge de tipo de meta con icono y color del `GOAL_TYPE_CONFIG`.

```tsx
// Props: type: string, size?: 'sm' | 'md' | 'lg'
// Icono + label con bgColor segun config
```

### 8.3 GoalStatusBadge

Badge de estado con icono y color del `GOAL_STATUS_CONFIG`.

```tsx
// Props: status: string, size?: 'sm' | 'md'
// Dot color + label
```

### 8.4 PrioritySelector

Selector visual de prioridad 1-5.

```tsx
// Props:
//   value: number
//   onChange: (priority: number) => void
//   readonly?: boolean

// Render: 5 botones/cards, cada uno con nivel de prioridad
//   1: "Muy Baja" - gray, 2: "Baja" - blue,
//   3: "Normal" - emerald, 4: "Alta" - amber, 5: "Critica" - red
//   Boton seleccionado tiene borde + bg del color correspondiente

// Alternativa visual: 5 estrellas clickeables (como rating)
```

### 8.5 GoalCard

Card para la lista de metas en mobile. Mostrar:

```tsx
// - Icono de tipo (GOAL_TYPE_CONFIG[goal_type].icon) con bgColor
// - Nombre de la meta
// - ProgressRing pequeno (size=48) con % dentro
// - GoalStatusBadge
// - PrioritySelector readonly con estrellas
// - Target amount vs Current amount
// - Fecha target
// - Si behind_schedule: warning indicator
// - Auto-Contribute icon si activo
```

### 8.6 GoalTable

Tabla completa para metas en desktop. Columnas:

```tsx
// - Nombre + icono de tipo
// - Progreso (ProgressBar compacto: barra + %)
// - GoalStatusBadge
// - Prioridad (estrellas)
// - Target amount
// - Current amount
// - Fecha target
// - Predicted completion
// - Probabilidad (si disponible)
// - Acciones (ver, editar, eliminar, refresh)
```

### 8.7 GoalFilters

Filtros para la lista de metas:

```tsx
// - goal_type: dropdown con tipos + iconos
// - status: dropdown con estados
// - priority: dropdown con prioridades
// - Clear all button
// - Active filter count badge
```

### 8.8 GoalForm

Formulario completo de creacion/edicion de meta. Campos:

```tsx
// ESTRUCTURA DEL FORMULARIO (secciones tipo wizard):
//
// PASO 1: TIPO DE META
//   Goal Type [grid de 7 opciones con iconos, colores, descripciones]
//   Nombre * [input]
//   Descripcion [textarea]
//
// PASO 2: DETALLES FINANCIEROS
//   Target Amount * [input con formato moneda]
//   Monthly Contribution [input con formato moneda]
//   Interest Rate % [input numerico]
//   Compound Frequency [select: daily/weekly/biweekly/monthly/quarterly/yearly]
//
// PASO 3: TIEMPO
//   Start Date * [date, default hoy]
//   Target Date * [date]
//
// PASO 4: CONFIGURACION
//   Priority [PrioritySelector: 5 niveles clickeables]
//   Auto-Contribute [AutoContributeToggle]
//   Linked Account [AccountPicker] - opcional
//   Linked Category [CategoryPicker] - opcional
//   Icono [IconPicker]
//   Color [ColorPicker]

// IMPORTANTE: Para GoalEditPage, mostrar los 4 pasos en una sola pagina
//   con secciones colapsables en lugar de wizard.
//   El wizard es SOLO para GoalCreatePage.
```

### 8.9 GoalCreateWizard

Wizard multi-paso para crear metas. Implementar con estado local (paso actual) y un solo formulario RHF que acumula datos en todos los pasos.

```tsx
// Estructura:
//   Paso 1: Goal Type Selection (GOAL_TYPE_OPTIONS grid)
//   Paso 2: Basic Details (nombre, descripcion)
//   Paso 3: Financial Target (target_amount, monthly_contribution, interest_rate)
//   Paso 4: Timeline + Config (fechas, prioridad, auto_contribute, account, category, icon, color)

// Componentes:
//   - Progress indicator en顶部 (4 pasos con circulos + lineas)
//   - Botones "Anterior" / "Siguiente"
//   - Boton "Crear Meta" en el ultimo paso
//   - Resumen de datos antes de confirmar (paso de review)
//   - On success: navigate a /goals/{id}

// Persistir datos en el estado del wizard (no en API hasta el final)
```

### 8.10 ProgressBar

Barra de progreso horizontal con labels. Reutilizar el mismo patron que BudgetProgressBar.

```tsx
// Props:
//   current: number
//   target: number
//   pct: number (0-100)
//   showLabels?: boolean
//   size?: 'sm' | 'md' | 'lg'
//   behindSchedule?: boolean

// Render:
//   Label: "MXN 50,000 / MXN 100,000"
//   Barra filled con pct%
//   Color: emerald si on track, amber si cerca, red si behind
//   Si behind_schedule: warning indicator
```

### 8.11 SimulationForm

Formulario para crear simulacion what-if.

```tsx
// Props:
//   goalId: string
//   goalName: string
//   onSuccess: (simulation: SimulationResponse) => void

// Campos:
//   Nombre de simulacion * [input]
//   Monthly Contribution * [input, pre-cargado con monthly_contribution de la meta]
//   Lump Sum Amount [input] + Lump Sum Date [date]
//   Interest Rate % [input, pre-cargado con interest_rate de la meta]
//   Annual Increase % [input] (aumento anual de la contribucion)
//   Notes [textarea]

// Boton "Simular" llama a createSimulation
// On success: llama onSuccess con la simulacion creada que incluye projection[]
```

### 8.12 ProjectionChart

Chart de proyeccion usando Recharts AreaChart.

```tsx
// Props:
//   projection: SimulationProjection[]
//   targetAmount: number
//   goalName?: string

// Data: projection array [{ month, contribution, interest, cumulative, date }]
// Series:
//   - Area: cumulative (gradient fill azul/verde)
//   - Line: target amount (linea punteada roja horizontal)
//   - Stacked bar opcional: contribution vs interest por mes

// Features:
//   - XAxis: mes (1, 2, 3... o fecha)
//   - YAxis: monto con formato
//   - Tooltip con desglose: contribucion, interes, acumulado
//   - ReferenceLine para target amount
//   - ResponsiveContainer
//   - Si no hay data: empty state
```

### 8.13 SummaryCards

KPIs del dashboard de progreso de metas.

```tsx
// Props: summary: GoalSummaryResponse

// Cards:
//   1. Total Goals: numero total
//   2. Active Goals: numero de metas activas
//   3. Completed Goals: numero completadas
//   4. Overall Progress: progress ring con % global
//   5. On Track: conteo verde
//   6. Behind Schedule: conteo rojo/amber

// Cada card: glass morphism, icono, color
// Progress card: ProgressRing grande con % centrado
```

### 8.14 AutoContributeToggle

Toggle switch para contribucion automatica.

```tsx
// Props:
//   value: boolean
//   onChange: (value: boolean) => void
//   disabled?: boolean

// Render: Toggle switch con label "Auto-Contribuir"
//   On: badge verde "Activado"
//   Off: badge gris "Desactivado"
//   Descripcion: "Contribuir automaticamente desde ingresos"
```

### 8.15 EmptyGoalState

Empty state para cuando no hay metas.

```tsx
// Props: onCreateClick?: () => void

// Render:
//   - Icono grande (Target / Flag)
//   - Mensaje: "No tienes metas financieras"
//   - Subtitulo: "Define tu primera meta para empezar a seguir tu progreso"
//   - Boton CTA: "Crear Primera Meta"
```

---

## 9. Pages (Layouts y Comportamiento)

### 9.1 GoalListPage

Ruta: `/goals`
Layout: Lista completa con filtros, vista tablet/mobile responsive.

**Componentes:**
- Header con titulo + boton "Nueva Meta" (navega a `/goals/new`)
- GoalFilters: goal_type, status, priority
- GoalTable (desktop) / GoalCard (mobile) con lista de metas
- Cada goal card/row:
  - Click: navega a `/goals/{id}`
  - Accion directa: refresh (recalcular progreso)
  - Eliminar con confirm dialog
- EmptyGoalState cuando no hay metas
- Resumen rapido opcional arriba (SummaryCards mini)

**URL State:** Usar `useSearchParams` para persistir filtros.

### 9.2 GoalCreatePage (Wizard)

Ruta: `/goals/new`
Layout: Wizard multi-paso en glass card con progress indicator.

**Componentes:**
- Header con back button + titulo "Nueva Meta"
- GoalCreateWizard completo (4 pasos):
  1. Tipo de Meta (grid de 7 opciones)
  2. Informacion Basica (nombre, descripcion)
  3. Objetivo Financiero (target amount, contribucion mensual, interes)
  4. Configuracion (fechas, prioridad, auto-contribute, cuenta, categoria, icono, color)
- Resumen final y confirmacion
- On success: navigate a `/goals/{id}`

### 9.3 GoalDetailPage

Ruta: `/goals/:id`
Layout: Detalle completo de la meta.

**Secciones:**
- **Header:**
  - Back button + nombre de meta
  - GoalTypeBadge + GoalStatusBadge
  - Acciones: Editar, Refresh, Eliminar, Predict
- **Progress Hero Card:**
  - ProgressRing grande (size=180) con % centrado
  - Target amount vs Current amount
  - "Falta MXN X para completar"
  - Estado: On track / Behind schedule con badge
- **Prediction Card (si prediction existe):**
  - Fecha estimada de completion
  - Probabilidad (%)
  - Recommended monthly contribution
  - Boton "Actualizar Prediccion" (refreshPrediction)
- **Timeline Section:**
  - Start date -> Target date
  - Dias restantes / Meses restantes
  - Monthly needed para cumplir en fecha
  - ProgressBar con time_pct vs pct_complete
- **Milestones Timeline:**
  - Lista vertical de milestones con iconos
  - goal_created, milestone_25, milestone_50, milestone_75, milestone_90, goal_completed
  - Cada milestone: fecha, evento, pct en ese momento
- **Acciones Rápidas:**
  - Boton "Simular" -> navega a `/goals/{id}/simulate`
  - AutoContributeToggle (si aplica)
  - Boton "Recalcular Progreso"
- **Meta Info Card:**
  - Monthly contribution
  - Interest rate + compound frequency
  - Cuenta vinculada (si existe)
  - Categoria vinculada (si existe)

### 9.4 GoalEditPage

Ruta: `/goals/:id/edit`
Layout: Edicion en glass card con secciones colapsables.

**Componentes:**
- Header con back button + titulo "Editar Meta"
- GoalForm con defaultValues precargados del goal detail
- Todos los campos en una sola pagina con secciones:
  - Informacion Basica
  - Objetivo Financiero
  - Timeline
  - Configuracion Adicional
- Boton "Guardar Cambios"
- On success: navigate back a `/goals/{id}`

### 9.5 GoalSummaryPage (Dashboard)

Ruta: `/goals/summary`
Layout: Dashboard de progreso de metas.

**Secciones:**
- SummaryCards (total, activas, completadas, overall progress, on track, behind)
- Overall Progress Ring grande (central)
- "On Track vs Behind" visual (barra dividida o dos KPIs lado a lado)
- Lista compacta de metas activas ordenadas por prioridad
  - Cada una: nombre, ProgressBar, GoalStatusBadge, dias restantes
  - Marcar las que estan behind schedule con warning
- Goal distribution por tipo (mini chart de barras o grid)
- Boton "Ver Todas las Metas" -> navega a `/goals`

### 9.6 GoalSimulationPage

Ruta: `/goals/:id/simulate`
Layout: Crear simulacion y ver resultado.

**Componentes:**
- Header con back button + titulo "Simular: {goal.name}"
- Resumen de la meta: target, current, remaining
- SimulationForm (lado izquierdo o arriba)
- ProjectionChart (lado derecho o abajo) - se muestra DESPUES de simular
- Result Cards (despues de simular):
  - Fecha estimada de completion
  - Meses para completar
  - Probabilidad
  - Total contributions
  - Total interest earned
  - Cumulative amount
- Boton "Guardar Simulacion" (ya se guarda al crear)
- Boton "Nueva Simulacion" para resetear
- Si hay simulaciones previas, mostrar lista de acceso rapido

### 9.7 GoalSimulationListPage

Ruta: `/goals/:id/simulations`
Layout: Lista de simulaciones guardadas.

**Componentes:**
- Header con back button + titulo "Simulaciones: {goal.name}"
- Boton "Nueva Simulacion" -> `/goals/{id}/simulate`
- Lista de simulaciones guardadas:
  - Nombre, monthly contribution, lump sum
  - Predicted completion date
  - Probability (%)
  - Months to complete
  - Actions: Ver detalle (expandir), Eliminar
- Al expandir: mostrar ProjectionChart + result cards
- Empty state: "No hay simulaciones guardadas"

---

## 10. Actualizacion de Routing

En `src/routes/lazy.ts`, agregar:

```typescript
// Goals
export const GoalListPage = lazy(() => import('@/features/goals/pages/GoalListPage'))
export const GoalCreatePage = lazy(() => import('@/features/goals/pages/GoalCreatePage'))
export const GoalDetailPage = lazy(() => import('@/features/goals/pages/GoalDetailPage'))
export const GoalEditPage = lazy(() => import('@/features/goals/pages/GoalEditPage'))
export const GoalSummaryPage = lazy(() => import('@/features/goals/pages/GoalSummaryPage'))
export const GoalSimulationPage = lazy(() => import('@/features/goals/pages/GoalSimulationPage'))
export const GoalSimulationListPage = lazy(() => import('@/features/goals/pages/GoalSimulationListPage'))
```

En `src/routes/index.tsx`, reemplazar los placeholders de `/goals`:

```tsx
// Import lazy goals
import {
  GoalListPage, GoalCreatePage, GoalDetailPage,
  GoalEditPage, GoalSummaryPage, GoalSimulationPage, GoalSimulationListPage,
} from './lazy'

// En las rutas protegidas, reemplazar Goals placeholder:
{
  path: '/goals',
  element: (<SuspenseWrapper><GoalListPage /></SuspenseWrapper>),
},
{
  path: '/goals/new',
  element: (<SuspenseWrapper><GoalCreatePage /></SuspenseWrapper>),
},
{
  path: '/goals/summary',
  element: (<SuspenseWrapper><GoalSummaryPage /></SuspenseWrapper>),
},
{
  path: '/goals/:id',
  element: (<SuspenseWrapper><GoalDetailPage /></SuspenseWrapper>),
},
{
  path: '/goals/:id/edit',
  element: (<SuspenseWrapper><GoalEditPage /></SuspenseWrapper>),
},
{
  path: '/goals/:id/simulate',
  element: (<SuspenseWrapper><GoalSimulationPage /></SuspenseWrapper>),
},
{
  path: '/goals/:id/simulations',
  element: (<SuspenseWrapper><GoalSimulationListPage /></SuspenseWrapper>),
},
```

**IMPORTANTE:** Mover las rutas de goals DESPUES de `/goals/summary` y `/goals/new` pero ANTES de las rutas con `/:id` para evitar conflictos. El orden correcto:
1. `/goals` (lista)
2. `/goals/new` (crear)
3. `/goals/summary` (dashboard)
4. `/goals/:id` (detalle)
5. `/goals/:id/edit` (editar)
6. `/goals/:id/simulate` (simular)
7. `/goals/:id/simulations` (lista de simulaciones)

---

## 11. Actualizacion de Sidebar

La seccion "Planificacion" en `src/components/layout/Sidebar.tsx` ya incluye `{ name: 'Metas', href: '/goals', icon: Target }`. No requiere cambios.

Sin embargo, considera agregar un sub-indicador visual de progreso en el sidebar (opcional, futuro).

---

## 12. Estrategias y Mejores Practicas

### 12.1 Progress Ring — Colores Dinamicos

El color del ProgressRing debe cambiar segun el progreso y si esta behind schedule:

```typescript
function getProgressColor(pct: number, behind: boolean): string {
  if (pct >= 100) return 'text-emerald-500'
  if (behind) return 'text-red-500'
  if (pct >= 75) return 'text-blue-500'
  if (pct >= 50) return 'text-amber-500'
  return 'text-gray-400'
}
```

### 12.2 Wizard — Persistencia de Datos

El GoalCreateWizard debe:
- Usar un solo `useForm` de RHF que persiste entre pasos
- No hacer fetch al API hasta el paso final
- Validar cada paso antes de avanzar (Zod schema parcial)
- En el paso final, mostrar resumen de todos los datos
- Manejar navegacion hacia atras sin perder datos

```typescript
// Estrategia de validacion por paso:
const stepSchemas = [
  z.object({ goal_type: z.string().min(1) }),
  z.object({ name: z.string().min(1).max(200) }),
  z.object({ target_amount: z.string().min(1) }),
  z.object({ target_date: z.string().min(1), priority: z.number().min(1).max(5) }),
]
```

### 12.3 GoalForm — Calculo Automatico

En el GoalForm/GoalCreateWizard, implementar calculos en vivo:
- Mostrar "Faltan X meses para completar" mientras el usuario escribe monthly_contribution
- Mostrar "Con esta contribucion, completarias en YYYY-MM-DD"
- Usar `watch` de RHF para reaccionar a cambios

```typescript
const monthlyContribution = watch('monthly_contribution')
const targetAmount = watch('target_amount')
const currentAmount = watch('current_amount') || 0
const interestRate = watch('interest_rate')

const estimatedMonths = useMemo(() => {
  // Simulacion simple en frontend para preview
  // Solo para dar feedback visual, no reemplaza la simulacion real del backend
  if (!monthlyContribution || !targetAmount) return null
  const remaining = Number(targetAmount) - Number(currentAmount)
  const monthly = Number(monthlyContribution)
  if (monthly <= 0) return null
  const rate = (Number(interestRate) || 0) / 100 / 12
  // Formula simplificada
  let balance = 0, months = 0
  while (balance < remaining && months < 600) {
    balance += monthly + balance * rate
    months++
  }
  return months
}, [monthlyContribution, targetAmount, currentAmount, interestRate])
```

### 12.4 Prediction Cards — AI Recommendations

Cuando haya prediccion disponible, mostrar:
- **Predicted Completion Date** con icono de calendario
- **Probability** con ProgressRing mini (probabilidad como %)
- **Recommended Monthly** comparado con actual monthly_contribution
  - Si recommended > actual: warning "Considera aumentar tu contribucion a MXN X"
  - Si recommended <= actual: success "Vas por buen camino"
- Boton "Refresh Prediction" que llama a `refreshGoalPrediction`
- Timestamp de cuando se actualizo la prediccion

### 12.5 Simulation — Proyeccion Visual

El ProjectionChart es el componente mas importante de la simulacion:
- Area chart con fill gradient (azul/verde)
- Reference line para target amount (roja punteada)
- Tooltip con breakdown: contribucion del mes, interes, acumulado
- Si la proyeccion excede el target, la linea cruza la reference line
- Mostrar target amount como goal line horizontal
- Eje Y con formato de moneda
- Datos: `projection[]` del response de createSimulation

### 12.6 GoalDetail — Behind Schedule Indicator

Si `progress.behind_schedule` es true:
- Mostrar badge rojo "Atrasado" en el header
- La barra de progreso se vuelve roja/amber
- Mostrar mensaje: "Estas detras del cronograma. Necesitas ahorrar MXN X/mes para cumplir en fecha."
- El monthly_needed del progress es el monto que deberias estar ahorrando

### 12.7 Milestones Timeline

Mostrar milestones en una linea de tiempo vertical:
```
[ ] [200px linea vertical] [contenido]
```
- Circulos verdes para milestones alcanzados
- Circulos grises para proximos
- goal_created: "Meta creada" + monto inicial
- milestone_25: "25% completado"
- milestone_50: "Mitad del camino"
- milestone_75: "75% completado"
- milestone_90: "90% completado"
- goal_completed: "Meta completada!" con icono de trofeo

### 12.8 Empty States

Para cada pagina, crear EmptyState especifico:
- GoalListPage: "No tienes metas financieras. Define tu primera meta."
- GoalSummaryPage: "Crea metas para ver tu progreso aqui."
- GoalSimulationListPage: "No hay simulaciones. Crea una simulacion para proyectar tu meta."

### 12.9 Dashboard Widget (ya implementado)

El BudgetStatusWidget del Dashboard ya fue implementado en el paso anterior. Si quieres agregar un GoalStatusWidget similar al Dashboard, puedes hacerlo siguiendo el mismo patron:
- Usar `useGoalSummary()` hook
- Mostrar ProgressRing con overall progress
- Mostrar contadores on track / behind
- Top 3 metas por prioridad con mini progress bars
- Link rapido a `/goals/summary`

---

## 13. Verificacion Final

Antes de dar por completada la fase, verificar:

- [ ] `pnpm tsc --noEmit` pasa sin errores
- [ ] `pnpm lint` pasa sin errores
- [ ] `pnpm build` produce build exitoso
- [ ] Todas las rutas de goals funcionan correctamente:
  - `/goals` -> lista
  - `/goals/new` -> wizard
  - `/goals/summary` -> dashboard
  - `/goals/:id` -> detalle
  - `/goals/:id/edit` -> editar
  - `/goals/:id/simulate` -> simulacion
  - `/goals/:id/simulations` -> lista simulaciones
- [ ] Goal CRUD completo (crear, listar, detalle, editar, eliminar)
- [ ] Goal Create Wizard 4 pasos funciona correctamente
- [ ] Goal Detail muestra: progress ring, progress bar, prediction, milestones
- [ ] Goal Summary Dashboard carga con datos reales del API
- [ ] Goal Simulation crea y muestra proyeccion chart
- [ ] Simulation list muestra simulaciones guardadas
- [ ] ProgressRing renderiza correctamente en todos los tamanos
- [ ] PrioritySelector funciona en modo edicion y readonly
- [ ] AutoContributeToggle cambia estado correctamente
- [ ] GoalTypeBadge y GoalStatusBadge se muestran con iconos correctos
- [ ] Refresh goal recalculate progress
- [ ] Refresh prediction actualiza AI prediction
- [ ] Behind schedule se indica visualmente
- [ ] Filtros funcionan y persisten en URL
- [ ] Responsive: cards en mobile, tabla en desktop
- [ ] Loading skeletons en todas las paginas
- [ ] Empty states cuando no hay datos
- [ ] Error states con retry button
- [ ] Toasts en todas las mutaciones
- [ ] Dark mode funciona en todos los componentes nuevos
- [ ] Wizard mantiene datos al navegar entre pasos
- [ ] Simulacion proyecta correctamente con monthly contribution + interest
