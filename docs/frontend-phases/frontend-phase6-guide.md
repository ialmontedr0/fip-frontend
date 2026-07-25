# Fase 6: Incomes — Guia de Implementacion

Version: 1.0
Proyecto: Financial Intelligence Platform (FIP) - Frontend

---

## Indice

1. [Resumen de la Fase](#1-resumen-de-la-fase)
2. [Backend API Reference](#2-backend-api-reference)
   - 2.1 [Income CRUD](#21-income-crud)
   - 2.2 [Income Sources CRUD](#22-income-sources-crud)
   - 2.3 [Income Schedule CRUD](#23-income-schedule-crud)
   - 2.4 [Analytics Endpoints](#24-analytics-endpoints)
   - 2.5 [Recurring & Detection](#25-recurring--detection)
   - 2.6 [Batch Operations](#26-batch-operations)
3. [Estructura de Archivos](#3-estructura-de-archivos)
4. [Tipos de TypeScript](#4-tipos-de-typescript)
5. [API Client](#5-api-client)
6. [Hooks de TanStack Query](#6-hooks-de-tanstack-query)
7. [Constantes y Configuracion](#7-constantes-y-configuracion)
8. [Componentes Compartidos](#8-componentes-compartidos)
9. [Pages (Layouts y Comportamiento)](#9-pages-layouts-y-comportamiento)
10. [Actualizacion de Routing](#10-actualizacion-de-routing)
11. [Actualizacion de Sidebar](#11-actualizacion-de-sidebar)
12. [Estrategias y Mejores Practicas](#12-estrategias-y-mejores-practicas)
13. [Verificacion Final](#13-verificacion-final)

---

## 1. Resumen de la Fase

**Estado actual:** Fase 5 completada (Transactions CRUD, Transfer, Recurring, Tags, Attachments, Audit Log).

**Objetivos de Fase 6:**

| Area | Descripcion |
|------|-------------|
| **Income CRUD** | Crear, listar (con filtros), detalle, editar, eliminar ingresos con campos especificos (income_type, stability, tax fields) |
| **Income Sources CRUD** | Gestion de fuentes de ingresos (employers, clients, freelances) con default_amount, frequency, pay_day |
| **Income Schedule** | Programacion de ingresos esperados, proyeccion, marcar como recibido |
| **Income Summary Dashboard** | Total, promedio, por tipo, por estabilidad, por fuente |
| **Income Trends Chart** | Linea mensual de ingresos (12 meses default, configurable) |
| **Income Forecast** | Proyeccion 6 meses basada en datos historicos y schedule |
| **Income by Source/Category** | Desglose por fuente y por categoria |
| **Monthly Breakdown** | Desglose mensual detallado |
| **Recurring Income Detection** | Deteccion automatica de ingresos recurrentes |
| **Irregular Income Identification** | Identificacion de ingresos irregulares/atipicos |
| **Batch Status Updates** | Actualizacion masiva de estados |
| **Stability Badges** | Badges color-coded (fixed=green, variable=amber, irregular=red) |

### Convenciones a Seguir

- **Patron existente**: Seguir exactamente la misma estructura que Fase 3-5
- **API Client**: Todos los llamados van por `lib/api.ts`
- **Server State**: TanStack Query para todos los datos del API
- **Forms**: React Hook Form + Zod para validacion
- **Toasts**: `react-hot-toast` para feedback
- **Estilo**: TailwindCSS con glass morphism `bg-white/80 backdrop-blur-xl`
- **Animaciones**: `animate-fade-in` con `animationDelay` escalonado
- **Componentes UI**: Usar los existentes en `components/ui/` (Card, Button, Input, Badge, Skeleton, Modal, etc.)
- **Iconos**: Lucide React
- **Balance**: Usar `formatCurrency(parseFloat(amount), currency_code)` de `lib/utils.ts`
- **Reutilizar**: `CategoryPicker` de categories, `AccountPicker` de accounts (o crear `IncomeSourcePicker`)
- **Charts**: Usar componentes de charts existentes en `features/analytics/components/`
- **Tabla responsive**: Card layout en mobile, tabla en desktop

---

## 2. Backend API Reference

Base path: `/api/v1/incomes`

### 2.1 Income CRUD

#### `POST /incomes` — Crear ingreso

**Request Body:**
```typescript
{
  account_id: string                    // UUID requerido
  amount: string                        // "50000.00"
  currency_code?: string                // default "DOP"
  description: string                   // min 1, max 500
  effective_date: string                // "YYYY-MM-DD"
  category_id?: string | null           // UUID
  subcategory_id?: string | null        // UUID
  status?: string                       // default "pending"
  notes?: string | null
  source?: string | null                // default "manual"
  tags?: string[] | null
  income_type: string                   // "salary" | "freelance" | "business" | "investment" | "rental" | "pension" | "government" | "gift" | "other"
  income_status: string                 // "received" | "pending" | "expected" | "overdue" | "cancelled"
  stability: string                     // "fixed" | "variable" | "irregular" | "seasonal"
  income_source_id?: string | null      // UUID
  employer_name?: string | null
  employer_tax_id?: string | null       // RNC/Cedula
  gross_amount?: string | null
  tax_withheld?: string | null
  net_amount?: string | null
  frequency?: string | null             // "daily" | "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly"
}
```

**Response (201):**
```typescript
{
  id: string                            // UUID
  transaction_id: string                // UUID de la transaccion asociada
  user_id: string
  account_id: string
  amount: string
  currency_code: string
  description: string
  effective_date: string
  category_id: string | null
  subcategory_id: string | null
  status: string
  notes: string | null
  source: string | null
  tags: string[]
  income_type: string
  income_status: string
  stability: string
  income_source_id: string | null
  income_source_name: string | null
  employer_name: string | null
  gross_amount: string | null
  tax_withheld: string | null
  net_amount: string | null
  frequency: string | null
  created_at: string | null
  updated_at: string | null
}
```

#### `GET /incomes` — Listar ingresos

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| income_type | string? | Filtrar por tipo |
| income_status | string? | Filtrar por estado |
| stability | string? | Filtrar por estabilidad |
| income_source_id | string? | Filtrar por fuente |
| category_id | string? | Filtrar por categoria |
| account_id | string? | Filtrar por cuenta |
| min_amount | float? | Monto minimo |
| max_amount | float? | Monto maximo |
| date_from | string? | Fecha inicio "YYYY-MM-DD" |
| date_to | string? | Fecha fin |
| search | string? | Busqueda en descripcion |
| sort_by | string | Default "effective_date" |
| sort_order | string | Default "desc" |
| page | int | Default 1 |
| page_size | int | Default 20, max 100 |

**Response:**
```typescript
{
  incomes: IncomeResponse[]
  total: int
  page: int
  page_size: int
  total_pages: int
}
```

#### `GET /incomes/{income_id}` — Obtener detalle

Returns: `IncomeResponse` (el mismo schema que create response, con mas datos)

#### `PATCH /incomes/{income_id}` — Actualizar ingreso

**Request Body:** Partial de cualquier campo de create request.

**Response:** `IncomeResponse` actualizado.

#### `DELETE /incomes/{income_id}` — Eliminar ingreso

**Response:** `{ message: string, income_id: string }`

---

### 2.2 Income Sources CRUD

#### `GET /incomes/sources` — Listar fuentes

**Query Params:** `is_active?` (bool), `income_type?` (string)

**Response:**
```typescript
{
  sources: [{
    id: string
    name: string
    income_type: string
    stability: string
    description: string | null
    tax_id: string | null
    default_amount: string | null
    default_account_id: string | null
    default_category_id: string | null
    frequency: string | null
    pay_day: int | null                      // Dia de pago (1-31)
    total_received: string                   // Suma historica recibida
    income_count: int                        // Cantidad de ingresos registrados
    last_received_at: string | null
    is_active: bool
    created_at: string | null
  }]
  total: int
}
```

#### `POST /incomes/sources` — Crear fuente

**Request Body:**
```typescript
{
  name: string                              // min 1, max 200
  income_type?: string                      // default "salary"
  stability?: string                        // default "fixed"
  description?: string | null
  tax_id?: string | null
  default_amount?: string | null
  default_account_id?: string | null
  default_category_id?: string | null
  frequency?: string | null
  pay_day?: int | null                      // 1-31
  icon?: string | null
  color?: string | null
}
```

#### `PATCH /incomes/sources/{source_id}` — Actualizar fuente

Partial update de cualquier campo.

#### `DELETE /incomes/sources/{source_id}` — Eliminar fuente

#### `GET /incomes/sources/{source_id}/create-income` — Crear ingreso desde fuente

**Request Body:**
```typescript
{
  received_date?: string    // "YYYY-MM-DD", default today
  amount?: string           // Si no se envia, usa default_amount
  notes?: string | null
}
```

**Response:** IncomeResponse

---

### 2.3 Income Schedule CRUD

#### `POST /incomes/schedule` — Crear schedule

**Request Body:**
```typescript
{
  description: string                       // min 1, max 500
  amount: string
  account_id: string
  expected_date: string                     // "YYYY-MM-DD"
  income_source_id?: string | null
  currency_code?: string                    // default "DOP"
  frequency?: string | null
  projection_method?: string | null         // "average", "last_value", "manual", "trend"
  confidence_score?: float | null
  notes?: string | null
}
```

#### `GET /incomes/schedule` — Listar schedules

**Query Params:** `status?`, `date_from?`, `date_to?`

**Response:**
```typescript
{
  schedules: [{
    id: string
    description: string
    amount: string
    currency_code: string
    account_id: string
    income_source_id: string | null
    expected_date: string
    status: string              // "pending" | "received" | "skipped" | "overdue"
    frequency: string | null
    projection_method: string | null
    confidence_score: string | null
    received_at: string | null
    created_at: string | null
  }]
  total: int
}
```

#### `PATCH /incomes/schedule/{schedule_id}` — Actualizar schedule

#### `DELETE /incomes/schedule/{schedule_id}` — Eliminar schedule

#### `POST /incomes/schedule/{schedule_id}/receive` — Marcar como recibido

**Request Body:**
```typescript
{
  received_date?: string     // default today
  amount?: string            // Si no se envia, usa el amount del schedule
  notes?: string | null
  tags?: string[] | null
}
```

**Response:** IncomeResponse (crea automaticamente un income)

#### `GET /incomes/schedule/projected?months=6` — Proyeccion

**Response:**
```typescript
{
  total_projected: string
  months: int
  monthly_breakdown: { [month_key]: string }   // ej: "2026-07": "150000.00"
  schedule_count: int
}
```

---

### 2.4 Analytics Endpoints

#### `GET /incomes/summary?date_from=...&date_to=...` — Resumen

**Response:**
```typescript
{
  period_start: string
  period_end: string
  total_income: string
  total_count: int
  average_monthly_income: string
  gross_income: string
  total_tax_withheld: string
  net_income: string
  by_type: [{ income_type: string, total: string, count: int, percentage: float }]
  by_stability: [{ stability: string, total: string, count: int }]
  by_source: [{ source_id: string, source_name: string, total: string, count: int }]
}
```

#### `GET /incomes/trends?months=12` — Tendencias

**Response:**
```typescript
{
  monthly_data: [{ month: string, total: string, count: int, average: string }]
  trend: string                                   // "up", "down", "stable"
  average_monthly: string
  period_months: int
}
```

#### `GET /incomes/forecast` — Proyeccion IA

**Response:**
```typescript
{
  average_monthly_3m: string
  average_monthly_6m: string
  average_monthly_12m: string
  trend: string
  projected_next_6m: string
  projected_monthly: string
}
```

#### `GET /incomes/by-source?date_from=...&date_to=...` — Por fuente

**Response:**
```typescript
{
  by_source: [{ source_id, source_name, total, count, percentage }]
  period_start: string
  period_end: string
}
```

#### `GET /incomes/by-category?date_from=...&date_to=...` — Por categoria

**Response:**
```typescript
{
  by_category: [{ category_id, category_name, total, count, percentage }]
  period_start: string
  period_end: string
}
```

#### `GET /incomes/monthly/{year}/{month}` — Breakdown mensual

**Response:**
```typescript
{
  year: int
  month: int
  total: string
  count: int
  incomes: [IncomeResponse]
}
```

---

### 2.5 Recurring & Detection

#### `GET /incomes/recurring-candidates` — Candidatos recurrentes

**Response:**
```typescript
{
  total_candidates: int
  monthly_like_count: int
  estimated_monthly_recurring: string
  candidates: [{
    id: string
    description: string
    amount: string
    frequency: string
    occurrences: int
    confidence: float
    last_occurrence: string
    suggestion: string            // "create_recurring" | "schedule" | "ignore"
  }]
}
```

#### `GET /incomes/irregular?months=6` — Ingresos irregulares

**Response:**
```typescript
{
  irregularity_count: int
  irregularities: [{
    id: string
    description: string
    amount: string
    effective_date: string
    deviation: float              // desviacion del promedio
    reason: string                // por que es irregular
  }]
  period_months: int
}
```

#### `GET /incomes/recurring` — Listar recurrentes

**Response:** Lista de ingresos recurrentes detectados automaticamente.

#### `POST /incomes/recurring/process` — Procesar recurrentes

Procesa y crea ingresos para los patrones recurrentes vencidos.

---

### 2.6 Batch Operations

#### `POST /incomes/batch-status` — Actualizacion masiva

**Request Body:**
```typescript
{
  income_ids: string[]        // Array de UUIDs de incomes
  status: string             // "received" | "pending" | "cancelled"
}
```

**Response:**
```typescript
{
  updated: int
  errors: int
  error_details: [{}]
}
```

---

## 3. Estructura de Archivos

Crear dentro de `src/features/incomes/`:

```
src/features/incomes/
  api/
    incomes.ts              # API client (create, list, get, update, delete)
    sources.ts              # API client for income sources
    schedules.ts            # API client for income schedules
  hooks/
    useIncomes.ts           # TanStack Query hooks for incomes
    useSources.ts           # TanStack Query hooks for sources
    useSchedules.ts         # TanStack Query hooks for schedules
    useIncomeAnalytics.ts   # Hooks for analytics (summary, trends, forecast, etc.)
  components/
    IncomeCard.tsx          # Card para lista de incomes (mobile)
    IncomeTable.tsx         # Tabla para lista de incomes (desktop)
    IncomeFilters.tsx       # Filtros (tipo, estado, estabilidad, fuente, fecha)
    IncomeForm.tsx          # Formulario de crear/editar ingreso
    IncomeSourcePicker.tsx  # Selector de fuentes de ingresos (reutilizable)
    IncomeSourceForm.tsx    # Formulario de crear/editar fuente
    IncomeSourceCard.tsx    # Card para lista de fuentes
    IncomeScheduleCard.tsx  # Card para schedule item
    IncomeScheduleForm.tsx  # Formulario de crear schedule
    StabilityBadge.tsx      # Badge de estabilidad color-coded
    IncomeTypeBadge.tsx     # Badge de tipo de ingreso
    IncomeStatusBadge.tsx   # Badge de estado de ingreso
    BatchStatusModal.tsx    # Modal para actualizacion masiva
    ReceiveScheduleModal.tsx# Modal para marcar schedule como recibido
    SummaryCards.tsx        # KPI cards del dashboard
    TrendsChart.tsx         # Chart de linea mensual
    ForecastCard.tsx        # Card de proyeccion
    BySourceChart.tsx       # Chart de distribucion por fuente
    ByCategoryChart.tsx     # Chart de distribucion por categoria
    RecurringCandidatesList.tsx  # Lista de candidatos recurrentes
    IrregularIncomeList.tsx # Lista de ingresos irregulares
    EmptyIncomeState.tsx    # Empty state
  pages/
    IncomeListPage.tsx      # Lista de ingresos con filtros
    IncomeCreatePage.tsx    # Crear ingreso
    IncomeDetailPage.tsx    # Detalle de ingreso
    IncomeEditPage.tsx      # Editar ingreso
    IncomeSummaryPage.tsx   # Dashboard de analytics de ingresos
    SourceListPage.tsx      # Lista de fuentes de ingresos
    SourceCreatePage.tsx    # Crear fuente
    SourceEditPage.tsx      # Editar fuente
    ScheduleListPage.tsx    # Lista de schedules
    ScheduleCreatePage.tsx  # Crear schedule
    RecurringDetectionPage.tsx # Pagina de deteccion de recurrentes
    IrregularDetectionPage.tsx # Pagina de ingresos irregulares
  constants.ts              # Configuracion de tipos, estabilidad, colores
```

---

## 4. Tipos de TypeScript

Crear `src/types/incomes.ts`:

```typescript
// ================================================================
// Income Enums
// ================================================================

export const INCOME_TYPES = {
  salary: 'Salario',
  freelance: 'Freelance',
  business: 'Negocio',
  investment: 'Inversion',
  rental: 'Alquiler',
  pension: 'Pension',
  government: 'Gobierno',
  gift: 'Regalo',
  other: 'Otro',
} as const

export type IncomeType = keyof typeof INCOME_TYPES

export const INCOME_STATUSES = {
  received: 'Recibido',
  pending: 'Pendiente',
  expected: 'Esperado',
  overdue: 'Vencido',
  cancelled: 'Cancelado',
} as const

export type IncomeStatus = keyof typeof INCOME_STATUSES

export const STABILITY_TYPES = {
  fixed: 'Fijo',
  variable: 'Variable',
  irregular: 'Irregular',
  seasonal: 'Estacional',
} as const

export type StabilityType = keyof typeof STABILITY_TYPES

export const PROJECTION_METHODS = {
  average: 'Promedio',
  last_value: 'Ultimo Valor',
  manual: 'Manual',
  trend: 'Tendencia',
} as const

export type ProjectionMethod = keyof typeof PROJECTION_METHODS

export const SCHEDULE_STATUSES = {
  pending: 'Pendiente',
  received: 'Recibido',
  skipped: 'Saltado',
  overdue: 'Vencido',
} as const

export type ScheduleStatus = keyof typeof SCHEDULE_STATUSES

// ================================================================
// Income
// ================================================================

export interface CreateIncomeRequest {
  account_id: string
  amount: number
  currency_code?: string
  description: string
  effective_date: string
  category_id?: string | null
  subcategory_id?: string | null
  status?: string
  notes?: string | null
  source?: string | null
  tags?: string[] | null
  income_type: string
  income_status: string
  stability: string
  income_source_id?: string | null
  employer_name?: string | null
  employer_tax_id?: string | null
  gross_amount?: number | null
  tax_withheld?: number | null
  net_amount?: number | null
  frequency?: string | null
}

export interface UpdateIncomeRequest {
  account_id?: string
  amount?: number
  currency_code?: string
  description?: string
  effective_date?: string
  category_id?: string | null
  subcategory_id?: string | null
  status?: string
  notes?: string | null
  income_type?: string
  income_status?: string
  stability?: string
  income_source_id?: string | null
  employer_name?: string | null
  employer_tax_id?: string | null
  gross_amount?: number | null
  tax_withheld?: number | null
  net_amount?: number | null
  frequency?: string | null
}

export interface IncomeResponse {
  id: string
  transaction_id: string
  user_id: string
  account_id: string
  amount: string
  currency_code: string
  description: string
  effective_date: string
  category_id: string | null
  subcategory_id: string | null
  status: string
  notes: string | null
  source: string | null
  tags: string[]
  income_type: string
  income_status: string
  stability: string
  income_source_id: string | null
  income_source_name: string | null
  employer_name: string | null
  gross_amount: string | null
  tax_withheld: string | null
  net_amount: string | null
  frequency: string | null
  created_at: string | null
  updated_at: string | null
}

export interface ListIncomesResponse {
  incomes: IncomeResponse[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface IncomesFilters {
  income_type?: string
  income_status?: string
  stability?: string
  income_source_id?: string
  category_id?: string
  account_id?: string
  min_amount?: number
  max_amount?: number
  date_from?: string
  date_to?: string
  search?: string
  sort_by?: string
  sort_order?: string
  page?: number
  page_size?: number
}

// ================================================================
// Income Sources
// ================================================================

export interface CreateSourceRequest {
  name: string
  income_type?: string
  stability?: string
  description?: string | null
  tax_id?: string | null
  default_amount?: string | null
  default_account_id?: string | null
  default_category_id?: string | null
  frequency?: string | null
  pay_day?: number | null
  icon?: string | null
  color?: string | null
}

export interface UpdateSourceRequest {
  name?: string
  income_type?: string
  stability?: string
  description?: string | null
  tax_id?: string | null
  default_amount?: string | null
  default_account_id?: string | null
  default_category_id?: string | null
  frequency?: string | null
  pay_day?: number | null
  icon?: string | null
  color?: string | null
  is_active?: boolean
}

export interface SourceResponse {
  id: string
  name: string
  income_type: string
  stability: string
  description: string | null
  tax_id: string | null
  default_amount: string | null
  default_account_id: string | null
  default_category_id: string | null
  frequency: string | null
  pay_day: number | null
  total_received: string
  income_count: number
  last_received_at: string | null
  is_active: boolean
  created_at: string | null
}

export interface ListSourcesResponse {
  sources: SourceResponse[]
  total: number
}

// ================================================================
// Income Schedule
// ================================================================

export interface CreateScheduleRequest {
  description: string
  amount: string
  account_id: string
  expected_date: string
  income_source_id?: string | null
  currency_code?: string
  frequency?: string | null
  projection_method?: string | null
  confidence_score?: number | null
  notes?: string | null
}

export interface UpdateScheduleRequest {
  description?: string
  amount?: string
  account_id?: string
  expected_date?: string
  income_source_id?: string | null
  currency_code?: string
  frequency?: string | null
  projection_method?: string | null
  confidence_score?: number | null
  notes?: string | null
}

export interface ScheduleResponse {
  id: string
  description: string
  amount: string
  currency_code: string
  account_id: string
  income_source_id: string | null
  expected_date: string
  status: string
  frequency: string | null
  projection_method: string | null
  confidence_score: string | null
  received_at: string | null
  created_at: string | null
}

export interface ListScheduleResponse {
  schedules: ScheduleResponse[]
  total: number
}

export interface ReceiveScheduleRequest {
  received_date?: string
  amount?: string
  notes?: string | null
  tags?: string[] | null
}

export interface CreateFromSourceRequest {
  received_date?: string
  amount?: string | null
  notes?: string | null
}

// ================================================================
// Analytics
// ================================================================

export interface IncomeSummaryResponse {
  period_start: string
  period_end: string
  total_income: string
  total_count: number
  average_monthly_income: string
  gross_income: string
  total_tax_withheld: string
  net_income: string
  by_type: Array<{ income_type: string; total: string; count: number; percentage: number }>
  by_stability: Array<{ stability: string; total: string; count: number }>
  by_source: Array<{ source_id: string; source_name: string; total: string; count: number }>
}

export interface IncomeTrendsResponse {
  monthly_data: Array<{ month: string; total: string; count: number; average: string }>
  trend: string
  average_monthly: string
  period_months: number
}

export interface IncomeForecastResponse {
  average_monthly_3m: string
  average_monthly_6m: string
  average_monthly_12m: string
  trend: string
  projected_next_6m: string
  projected_monthly: string
}

export interface IncomeBySourceResponse {
  by_source: Array<{ source_id: string; source_name: string; total: string; count: number; percentage: number }>
  period_start: string
  period_end: string
}

export interface IncomeByCategoryResponse {
  by_category: Array<{ category_id: string; category_name: string; total: string; count: number; percentage: number }>
  period_start: string
  period_end: string
}

export interface MonthlyBreakdownResponse {
  year: number
  month: number
  total: string
  count: number
  incomes: IncomeResponse[]
}

export interface RecurringCandidatesResponse {
  total_candidates: number
  monthly_like_count: number
  estimated_monthly_recurring: string
  candidates: Array<{
    id: string
    description: string
    amount: string
    frequency: string
    occurrences: number
    confidence: number
    last_occurrence: string
    suggestion: string
  }>
}

export interface IrregularIncomeResponse {
  irregularity_count: number
  irregularities: Array<{
    id: string
    description: string
    amount: string
    effective_date: string
    deviation: number
    reason: string
  }>
  period_months: number
}

export interface ProjectedIncomeResponse {
  total_projected: string
  months: number
  monthly_breakdown: Record<string, string>
  schedule_count: number
}

export interface BatchUpdateStatusRequest {
  income_ids: string[]
  status: string
}

export interface BatchUpdateStatusResponse {
  updated: number
  errors: number
  error_details: Array<Record<string, unknown>>
}
```

---

## 5. API Client

Crear `src/features/incomes/api/incomes.ts`:

```typescript
import api from '@/lib/api'
import type {
  CreateIncomeRequest,
  UpdateIncomeRequest,
  IncomeResponse,
  ListIncomesResponse,
  IncomesFilters,
  BatchUpdateStatusRequest,
  BatchUpdateStatusResponse,
  RecurringCandidatesResponse,
  IrregularIncomeResponse,
} from '@/types/incomes'

export function createIncome(data: CreateIncomeRequest) {
  return api.post<IncomeResponse>('/incomes', data)
}

export function listIncomes(params?: IncomesFilters) {
  const clean = Object.fromEntries(
    Object.entries(params || {}).filter(([, v]) => v !== undefined && v !== '' && v !== null)
  )
  return api.get<ListIncomesResponse>('/incomes', { params: clean })
}

export function getIncome(id: string) {
  return api.get<IncomeResponse>(`/incomes/${id}`)
}

export function updateIncome(id: string, data: UpdateIncomeRequest) {
  return api.patch<IncomeResponse>(`/incomes/${id}`, data)
}

export function deleteIncome(id: string) {
  return api.delete<{ message: string; income_id: string }>(`/incomes/${id}`)
}

export function batchUpdateStatus(data: BatchUpdateStatusRequest) {
  return api.post<BatchUpdateStatusResponse>('/incomes/batch-status', data)
}

// Recurring detection
export function getRecurringCandidates() {
  return api.get<RecurringCandidatesResponse>('/incomes/recurring-candidates')
}

export function getIrregularIncomes(months = 6) {
  return api.get<IrregularIncomeResponse>('/incomes/irregular', { params: { months } })
}
```

Crear `src/features/incomes/api/sources.ts`:

```typescript
import api from '@/lib/api'
import type {
  CreateSourceRequest,
  UpdateSourceRequest,
  SourceResponse,
  ListSourcesResponse,
} from '@/types/incomes'
import type { IncomeResponse } from '@/types/incomes'

export function createSource(data: CreateSourceRequest) {
  return api.post<SourceResponse>('/incomes/sources', data)
}

export function listSources(params?: { is_active?: boolean; income_type?: string }) {
  return api.get<ListSourcesResponse>('/incomes/sources', { params })
}

export function getSource(id: string) {
  return api.get<SourceResponse>(`/incomes/sources/${id}`)
}

export function updateSource(id: string, data: UpdateSourceRequest) {
  return api.patch<SourceResponse>(`/incomes/sources/${id}`, data)
}

export function deleteSource(id: string) {
  return api.delete<{ message: string }>(`/incomes/sources/${id}`)
}

export function createIncomeFromSource(sourceId: string, data: { received_date?: string; amount?: string | null; notes?: string | null }) {
  return api.post<IncomeResponse>(`/incomes/sources/${sourceId}/create-income`, data)
}
```

Crear `src/features/incomes/api/schedules.ts`:

```typescript
import api from '@/lib/api'
import type {
  CreateScheduleRequest,
  UpdateScheduleRequest,
  ScheduleResponse,
  ListScheduleResponse,
  ReceiveScheduleRequest,
  ProjectedIncomeResponse,
} from '@/types/incomes'
import type { IncomeResponse } from '@/types/incomes'

export function createSchedule(data: CreateScheduleRequest) {
  return api.post<ScheduleResponse>('/incomes/schedule', data)
}

export function listSchedules(params?: { status?: string; date_from?: string; date_to?: string }) {
  return api.get<ListScheduleResponse>('/incomes/schedule', { params })
}

export function getProjectedIncome(months = 6) {
  return api.get<ProjectedIncomeResponse>('/incomes/schedule/projected', { params: { months } })
}

export function receiveScheduled(scheduleId: string, data: ReceiveScheduleRequest) {
  return api.post<IncomeResponse>(`/incomes/schedule/${scheduleId}/receive`, data)
}

export function updateSchedule(id: string, data: UpdateScheduleRequest) {
  return api.patch<ScheduleResponse>(`/incomes/schedule/${id}`, data)
}

export function deleteSchedule(id: string) {
  return api.delete<{ message: string }>(`/incomes/schedule/${id}`)
}
```

Crear `src/features/incomes/api/analytics.ts`:

```typescript
import api from '@/lib/api'
import type {
  IncomeSummaryResponse,
  IncomeTrendsResponse,
  IncomeForecastResponse,
  IncomeBySourceResponse,
  IncomeByCategoryResponse,
  MonthlyBreakdownResponse,
} from '@/types/incomes'

export function getIncomeSummary(dateFrom: string, dateTo: string) {
  return api.get<IncomeSummaryResponse>('/incomes/summary', { params: { date_from: dateFrom, date_to: dateTo } })
}

export function getIncomeTrends(months = 12) {
  return api.get<IncomeTrendsResponse>('/incomes/trends', { params: { months } })
}

export function getIncomeForecast() {
  return api.get<IncomeForecastResponse>('/incomes/forecast')
}

export function getIncomeBySource(dateFrom: string, dateTo: string) {
  return api.get<IncomeBySourceResponse>('/incomes/by-source', { params: { date_from: dateFrom, date_to: dateTo } })
}

export function getIncomeByCategory(dateFrom: string, dateTo: string) {
  return api.get<IncomeByCategoryResponse>('/incomes/by-category', { params: { date_from: dateFrom, date_to: dateTo } })
}

export function getMonthlyBreakdown(year: number, month: number) {
  return api.get<MonthlyBreakdownResponse>(`/incomes/monthly/${year}/${month}`)
}
```

---

## 6. Hooks de TanStack Query

Crear `src/features/incomes/hooks/useIncomes.ts`:

```typescript
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as incomesApi from '../api/incomes'
import * as analyticsApi from '../api/analytics'
import type {
  CreateIncomeRequest, UpdateIncomeRequest, IncomesFilters, ListIncomesResponse,
} from '@/types/incomes'

export const incomeKeys = {
  all: ['incomes'] as const,
  lists: () => [...incomeKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...incomeKeys.lists(), filters] as const,
  infinite: (filters?: Record<string, unknown>) => [...incomeKeys.all, 'infinite', filters] as const,
  details: () => [...incomeKeys.all, 'detail'] as const,
  detail: (id: string) => [...incomeKeys.details(), id] as const,
  summary: (params?: Record<string, unknown>) => [...incomeKeys.all, 'summary', params] as const,
  trends: (months?: number) => [...incomeKeys.all, 'trends', months] as const,
  forecast: () => [...incomeKeys.all, 'forecast'] as const,
  bySource: (params?: Record<string, unknown>) => [...incomeKeys.all, 'by-source', params] as const,
  byCategory: (params?: Record<string, unknown>) => [...incomeKeys.all, 'by-category', params] as const,
  monthly: (year: number, month: number) => [...incomeKeys.all, 'monthly', year, month] as const,
  recurringCandidates: () => [...incomeKeys.all, 'recurring-candidates'] as const,
  irregular: (months?: number) => [...incomeKeys.all, 'irregular', months] as const,
}

function cleanParams(params?: Record<string, unknown>) {
  if (!params) return undefined
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null),
  )
}

// === List / Infinite ===

export function useIncomes(params?: IncomesFilters) {
  return useQuery({
    queryKey: incomeKeys.list(cleanParams(params as Record<string, unknown>)),
    queryFn: () => incomesApi.listIncomes(params).then((r) => r.data),
    staleTime: 1000 * 60,
  })
}

export function useIncomeInfinite(filters?: Omit<IncomesFilters, 'page'>) {
  return useInfiniteQuery({
    queryKey: incomeKeys.infinite(cleanParams(filters as Record<string, unknown>)),
    queryFn: ({ pageParam = 1 }) =>
      incomesApi.listIncomes({ ...filters, page: pageParam, page_size: 20 } as IncomesFilters).then((r) => r.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage: ListIncomesResponse) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    staleTime: 1000 * 60,
  })
}

// === Detail ===

export function useIncome(id: string | undefined) {
  return useQuery({
    queryKey: incomeKeys.detail(id!),
    queryFn: () => incomesApi.getIncome(id!).then((r) => r.data),
    enabled: !!id,
  })
}

// === Mutations ===

export function useCreateIncome() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateIncomeRequest) => incomesApi.createIncome(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: incomeKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Ingreso creado exitosamente')
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
      toast.error(message || 'Error al crear el ingreso')
    },
  })
}

export function useUpdateIncome() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateIncomeRequest }) =>
      incomesApi.updateIncome(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: incomeKeys.lists() })
      queryClient.invalidateQueries({ queryKey: incomeKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Ingreso actualizado exitosamente')
    },
    onError: () => toast.error('Error al actualizar el ingreso'),
  })
}

export function useDeleteIncome() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => incomesApi.deleteIncome(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: incomeKeys.lists() })
      queryClient.invalidateQueries({ queryKey: incomeKeys.summary() })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Ingreso eliminado exitosamente')
    },
    onError: () => toast.error('Error al eliminar el ingreso'),
  })
}

export function useBatchUpdateStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { income_ids: string[]; status: string }) =>
      incomesApi.batchUpdateStatus(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: incomeKeys.lists() })
      toast.success(`${res.data.updated} ingresos actualizados`)
    },
    onError: () => toast.error('Error en la actualizacion masiva'),
  })
}

// === Analytics ===

export function useIncomeSummary(dateFrom: string, dateTo: string) {
  return useQuery({
    queryKey: incomeKeys.summary({ date_from: dateFrom, date_to: dateTo }),
    queryFn: () => analyticsApi.getIncomeSummary(dateFrom, dateTo).then((r) => r.data),
    enabled: !!dateFrom && !!dateTo,
    staleTime: 1000 * 60 * 2,
  })
}

export function useIncomeTrends(months = 12) {
  return useQuery({
    queryKey: incomeKeys.trends(months),
    queryFn: () => analyticsApi.getIncomeTrends(months).then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  })
}

export function useIncomeForecast() {
  return useQuery({
    queryKey: incomeKeys.forecast(),
    queryFn: () => analyticsApi.getIncomeForecast().then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  })
}

export function useIncomeBySource(dateFrom: string, dateTo: string) {
  return useQuery({
    queryKey: incomeKeys.bySource({ date_from: dateFrom, date_to: dateTo }),
    queryFn: () => analyticsApi.getIncomeBySource(dateFrom, dateTo).then((r) => r.data),
    enabled: !!dateFrom && !!dateTo,
  })
}

export function useIncomeByCategory(dateFrom: string, dateTo: string) {
  return useQuery({
    queryKey: incomeKeys.byCategory({ date_from: dateFrom, date_to: dateTo }),
    queryFn: () => analyticsApi.getIncomeByCategory(dateFrom, dateTo).then((r) => r.data),
    enabled: !!dateFrom && !!dateTo,
  })
}

export function useMonthlyBreakdown(year: number, month: number) {
  return useQuery({
    queryKey: incomeKeys.monthly(year, month),
    queryFn: () => analyticsApi.getMonthlyBreakdown(year, month).then((r) => r.data),
    enabled: !!year && !!month,
  })
}

// === Detection ===

export function useRecurringCandidates() {
  return useQuery({
    queryKey: incomeKeys.recurringCandidates(),
    queryFn: () => incomesApi.getRecurringCandidates().then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  })
}

export function useIrregularIncomes(months = 6) {
  return useQuery({
    queryKey: incomeKeys.irregular(months),
    queryFn: () => incomesApi.getIrregularIncomes(months).then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  })
}
```

Crear `src/features/incomes/hooks/useSources.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as sourcesApi from '../api/sources'
import type { CreateSourceRequest, UpdateSourceRequest } from '@/types/incomes'

export const sourceKeys = {
  all: ['income-sources'] as const,
  lists: () => [...sourceKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...sourceKeys.lists(), filters] as const,
  details: () => [...sourceKeys.all, 'detail'] as const,
  detail: (id: string) => [...sourceKeys.details(), id] as const,
}

export function useSources(params?: { is_active?: boolean; income_type?: string }) {
  return useQuery({
    queryKey: sourceKeys.list(params as Record<string, unknown>),
    queryFn: () => sourcesApi.listSources(params).then((r) => r.data),
    staleTime: 1000 * 60 * 2,
  })
}

export function useSource(id: string | undefined) {
  return useQuery({
    queryKey: sourceKeys.detail(id!),
    queryFn: () => sourcesApi.getSource(id!).then((r) => r.data),
    enabled: !!id,
  })
}

export function useCreateSource() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateSourceRequest) => sourcesApi.createSource(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sourceKeys.lists() })
      toast.success('Fuente de ingreso creada exitosamente')
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
      toast.error(message || 'Error al crear la fuente')
    },
  })
}

export function useUpdateSource() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSourceRequest }) =>
      sourcesApi.updateSource(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: sourceKeys.lists() })
      queryClient.invalidateQueries({ queryKey: sourceKeys.detail(variables.id) })
      toast.success('Fuente actualizada exitosamente')
    },
    onError: () => toast.error('Error al actualizar la fuente'),
  })
}

export function useDeleteSource() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => sourcesApi.deleteSource(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sourceKeys.lists() })
      toast.success('Fuente eliminada exitosamente')
    },
    onError: () => toast.error('Error al eliminar la fuente'),
  })
}

export function useCreateIncomeFromSource() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ sourceId, data }: { sourceId: string; data: { received_date?: string; amount?: string | null; notes?: string | null } }) =>
      sourcesApi.createIncomeFromSource(sourceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: incomeKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Ingreso creado desde fuente')
    },
    onError: () => toast.error('Error al crear ingreso desde fuente'),
  })
}
```

Crear `src/features/incomes/hooks/useSchedules.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as schedulesApi from '../api/schedules'
import type { CreateScheduleRequest, UpdateScheduleRequest, ReceiveScheduleRequest } from '@/types/incomes'

export const scheduleKeys = {
  all: ['income-schedules'] as const,
  lists: () => [...scheduleKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...scheduleKeys.lists(), filters] as const,
  projected: () => [...scheduleKeys.all, 'projected'] as const,
}

export function useSchedules(params?: { status?: string; date_from?: string; date_to?: string }) {
  return useQuery({
    queryKey: scheduleKeys.list(params as Record<string, unknown>),
    queryFn: () => schedulesApi.listSchedules(params).then((r) => r.data),
    staleTime: 1000 * 60,
  })
}

export function useProjectedIncome(months = 6) {
  return useQuery({
    queryKey: scheduleKeys.projected(),
    queryFn: () => schedulesApi.getProjectedIncome(months).then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateSchedule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateScheduleRequest) => schedulesApi.createSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() })
      toast.success('Programacion creada exitosamente')
    },
    onError: () => toast.error('Error al crear la programacion'),
  })
}

export function useReceiveScheduled() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ scheduleId, data }: { scheduleId: string; data: ReceiveScheduleRequest }) =>
      schedulesApi.receiveScheduled(scheduleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['incomes'] })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Ingreso recibido exitosamente')
    },
    onError: () => toast.error('Error al marcar como recibido'),
  })
}

export function useUpdateSchedule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateScheduleRequest }) =>
      schedulesApi.updateSchedule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() })
      toast.success('Programacion actualizada')
    },
    onError: () => toast.error('Error al actualizar'),
  })
}

export function useDeleteSchedule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => schedulesApi.deleteSchedule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() })
      toast.success('Programacion eliminada')
    },
    onError: () => toast.error('Error al eliminar'),
  })
}
```

---

## 7. Constantes y Configuracion

Crear `src/features/incomes/constants.ts`:

```typescript
import {
  Briefcase, Code, Store, TrendingUp, Home, Heart,
  Building2, Gift, HelpCircle,
  CalendarCheck, CalendarX, CalendarClock, Calendar,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { IncomeType, StabilityType, IncomeStatus } from '@/types/incomes'

export const INCOME_TYPE_CONFIG: Record<IncomeType, {
  label: string
  icon: LucideIcon
  color: string
  bgColor: string
  gradient: string
}> = {
  salary:     { label: 'Salario',     icon: Briefcase,   color: 'text-blue-600 dark:text-blue-400',     bgColor: 'bg-blue-100 dark:bg-blue-500/10',     gradient: 'from-blue-400 to-blue-600' },
  freelance:  { label: 'Freelance',   icon: Code,         color: 'text-purple-600 dark:text-purple-400',  bgColor: 'bg-purple-100 dark:bg-purple-500/10',  gradient: 'from-purple-400 to-purple-600' },
  business:   { label: 'Negocio',     icon: Store,        color: 'text-amber-600 dark:text-amber-400',   bgColor: 'bg-amber-100 dark:bg-amber-500/10',   gradient: 'from-amber-400 to-amber-600' },
  investment: { label: 'Inversion',   icon: TrendingUp,   color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-100 dark:bg-emerald-500/10', gradient: 'from-emerald-400 to-emerald-600' },
  rental:     { label: 'Alquiler',    icon: Home,         color: 'text-cyan-600 dark:text-cyan-400',     bgColor: 'bg-cyan-100 dark:bg-cyan-500/10',     gradient: 'from-cyan-400 to-cyan-600' },
  pension:    { label: 'Pension',     icon: Heart,        color: 'text-rose-600 dark:text-rose-400',     bgColor: 'bg-rose-100 dark:bg-rose-500/10',     gradient: 'from-rose-400 to-rose-600' },
  government: { label: 'Gobierno',    icon: Building2,    color: 'text-slate-600 dark:text-slate-400',   bgColor: 'bg-slate-100 dark:bg-slate-500/10',   gradient: 'from-slate-400 to-slate-600' },
  gift:       { label: 'Regalo',      icon: Gift,         color: 'text-pink-600 dark:text-pink-400',     bgColor: 'bg-pink-100 dark:bg-pink-500/10',     gradient: 'from-pink-400 to-pink-600' },
  other:      { label: 'Otro',        icon: HelpCircle,   color: 'text-gray-600 dark:text-gray-400',     bgColor: 'bg-gray-100 dark:bg-gray-500/10',     gradient: 'from-gray-400 to-gray-600' },
}

export const INCOME_STATUS_CONFIG: Record<IncomeStatus, {
  label: string
  variant: 'success' | 'warning' | 'danger' | 'default' | 'info'
  icon: LucideIcon
  color: string
  bgColor: string
}> = {
  received: { label: 'Recibido',  variant: 'success', icon: CalendarCheck, color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-100 dark:bg-emerald-500/10' },
  pending:  { label: 'Pendiente', variant: 'warning', icon: CalendarClock, color: 'text-amber-600 dark:text-amber-400',   bgColor: 'bg-amber-100 dark:bg-amber-500/10' },
  expected: { label: 'Esperado',  variant: 'info',    icon: Calendar,      color: 'text-blue-600 dark:text-blue-400',     bgColor: 'bg-blue-100 dark:bg-blue-500/10' },
  overdue:  { label: 'Vencido',   variant: 'danger',  icon: CalendarX,     color: 'text-red-600 dark:text-red-400',       bgColor: 'bg-red-100 dark:bg-red-500/10' },
  cancelled:{ label: 'Cancelado', variant: 'default', icon: CalendarX,     color: 'text-gray-600 dark:text-gray-400',    bgColor: 'bg-gray-100 dark:bg-gray-500/10' },
}

export const STABILITY_CONFIG: Record<StabilityType, {
  label: string
  color: string
  bgColor: string
  dotColor: string
  description: string
}> = {
  fixed:     { label: 'Fijo',      color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-100 dark:bg-emerald-500/10', dotColor: 'bg-emerald-500', description: 'Monto fijo predecible' },
  variable:  { label: 'Variable',  color: 'text-amber-600 dark:text-amber-400',     bgColor: 'bg-amber-100 dark:bg-amber-500/10',   dotColor: 'bg-amber-500', description: 'Monto variable pero recurrente' },
  irregular: { label: 'Irregular', color: 'text-red-600 dark:text-red-400',         bgColor: 'bg-red-100 dark:bg-red-500/10',       dotColor: 'bg-red-500',   description: 'Sin patron predecible' },
  seasonal:  { label: 'Estacional',color: 'text-purple-600 dark:text-purple-400',   bgColor: 'bg-purple-100 dark:bg-purple-500/10', dotColor: 'bg-purple-500', description: 'Ocurre en temporadas especificas' },
}
```

---

## 8. Componentes Compartidos

### 8.1 StabilityBadge

Crea un badge que muestra la estabilidad con un dot colorido. Usar `STABILITY_CONFIG` para colores.

```tsx
// src/features/incomes/components/StabilityBadge.tsx
// Props: stability: string, size?: 'sm' | 'md'
// Render: dot color + label
// fixed = green dot, variable = amber, irregular = red, seasonal = purple
```

### 8.2 IncomeTypeBadge

Badge de tipo de ingreso con icono y color del `INCOME_TYPE_CONFIG`.

```tsx
// Props: type: string, size?: 'sm' | 'md'
// Usar INCOME_TYPE_CONFIG para icono y colores
```

### 8.3 IncomeStatusBadge

Badge de estado con icono y color del `INCOME_STATUS_CONFIG`.

```tsx
// Props: status: string, size?: 'sm' | 'md'
```

### 8.4 IncomeSourcePicker

Selector de fuentes de ingresos, similar a `CategoryPicker` pero para fuentes.

```tsx
// Props: value: string, onChange: (sourceId: string) => void, filterType?: string
// Mostrar: nombre, tipo, estabilidad, total_received
// Dropdown con search
// Usar useSources hook
```

### 8.5 IncomeCard

Card para la lista de incomes en mobile. Mostrar:
- Descripcion + fecha
- IncomeTypeBadge
- Monto con formato
- StabilityBadge
- IncomeStatusBadge

### 8.6 IncomeTable

Tabla completa para incomes en desktop. Columnas:
- Descripcion
- Fecha
- Tipo (badge)
- Estabilidad (badge)
- Estado (badge)
- Cuenta
- Monto
- Acciones (ver, editar, eliminar)

### 8.7 IncomeForm

Formulario completo de creacion/edicion de ingreso. Campos:
- Tipo de transaccion (solo income, fijo) — oculto
- Tipo de ingreso (selector de 9 tipos con iconos) — tipo IncomeType
- Cuenta (AccountPicker)
- Monto
- Moneda
- Fecha efectiva
- Descripcion
- Categoria (CategoryPicker filtrado por income)
- Estabilidad (selector con badges: fixed/variable/irregular/seasonal)
- Estado del ingreso (selector: received/pending/expected)
- Fuente de ingreso (IncomeSourcePicker)
- Campos de impuestos (collapsible section):
  - Gross amount
  - Tax withheld
  - Net amount (auto-calculado: gross - tax)
- Empleador / RNC
- Frecuencia (selector: monthly/biweekly/weekly/etc.)
- Notas
- Tags

**Estructura del formulario (secciones):**
```
INFORMACION BASICA
  Tipo de Ingreso [grid de 9 opciones con iconos]
  Cuenta * [AccountPicker]
  Monto * [input]  |  Moneda [select]
  Fecha Efectiva * [date]
  Descripcion * [input]

CLASIFICACION
  Categoria [CategoryPicker]
  Estabilidad [4 badges selectables]
  Estado [select]
  Fuente de Ingreso [IncomeSourcePicker]

INFORMACION FISCAL (collapsible)
  Gross Amount [input]
  Tax Withheld [input]
  Net Amount [input]  (auto-calculado o manual)
  Empleador [input]
  RNC/Cedula [input]

CONFIGURACION ADICIONAL
  Frecuencia [select]
  Notas [textarea]
  Tags [TagInput]
```

### 8.8 IncomeSourceForm

Formulario para crear/editar fuente de ingreso:
- Nombre *
- Tipo de ingreso (select con tipos)
- Estabilidad (select)
- Descripcion
- RNC/ Tax ID
- Default amount
- Default account (AccountPicker)
- Default category (CategoryPicker)
- Frecuencia
- Dia de pago (number input 1-31)
- Icono (IconPicker)
- Color (ColorPicker)

### 8.9 IncomeScheduleForm

Formulario para crear schedule:
- Descripcion *
- Monto *
- Cuenta * (AccountPicker)
- Fecha esperada * (date)
- Fuente de ingreso (IncomeSourcePicker)
- Moneda
- Frecuencia
- Metodo de proyeccion (select: average/last_value/manual/trend)
- Notas

### 8.10 SummaryCards

KPIs del dashboard de ingresos:
- Total Income
- Promedio Mensual
- Net Income (despues de impuestos)
- Total Count
- Gross Income
- Total Tax Withheld

Cada KPI es un card con glass morphism, icono, color, formato de moneda.

### 8.11 TrendsChart

Chart de linea mensual usando recharts:
```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
// Data: monthly_data del endpoint trends
// Linea con gradient fill
// Tooltip con formato moneda
```

### 8.12 ForecastCard

Card que muestra la proyeccion a 6 meses con indicadores:
- Proximos 6 meses: monto proyectado
- Promedio 3m, 6m, 12m
- Tendencia (up/down/stable) con icono y color
- Chart de barras simple con proyeccion mensual

### 8.13 BatchStatusModal

Modal para actualizacion masiva de estados:
- Selector de estado (received/pending/cancelled)
- Lista de ingresos seleccionados
- Boton de confirmar
- Loading state

### 8.14 ReceiveScheduleModal

Modal para marcar schedule como recibido:
- Fecha de recepcion (default today)
- Monto (pre-cargado del schedule, editable)
- Notas
- Tags
- Boton Confirmar

---

## 9. Pages (Layouts y Comportamiento)

### 9.1 IncomeListPage

Ruta: `/incomes`
Layout: Lista completa con filtros, vista tablet/mobile responsive.

**Componentes:**
- Header con titulo + boton "Nuevo Ingreso"
- IncomeFilters: income_type, income_status, stability, account_id, date range, search
- IncomeSummaryWidget (pequeno resumen arriba, opcional)
- IncomeTable (desktop) / IncomeCard (mobile) con infinite scroll
- BatchStatusModal
- EmptyState

**URL State:** Usar `useSearchParams` para persistir filtros.
**Infinite Scroll:** Usar `useIncomeInfinite` hook.
**Seleccion multiple:** Checkbox en cada fila para batch operations.

### 9.2 IncomeCreatePage

Ruta: `/incomes/new`
Layout: Similar a TransactionCreatePage, con glass card + accent bar.

**Componentes:**
- Header con back button + titulo
- IncomeForm en modo create
- On success: navigate a `/incomes/{id}`

### 9.3 IncomeDetailPage

Ruta: `/incomes/:id`
Layout: Detalle completo del ingreso.

**Secciones:**
- Header con back button, titulo, acciones (editar, eliminar)
- Balance/Amount card con tipo y estabilidad
- Informacion detallada en grid (cuenta, categoria, fecha, etc.)
- Informacion fiscal (si tiene gross/tax/net)
- Tags
- Boton para ir a la transaccion asociada

### 9.4 IncomeEditPage

Ruta: `/incomes/:id/edit`
Layout: Edicion inline en glass card.

**Componentes:**
- Header con back button + titulo "Editar Ingreso"
- IncomeForm con defaultValues precargados
- mode="edit"

### 9.5 IncomeSummaryPage

Ruta: `/incomes/summary`
Layout: Dashboard de analytics de ingresos.

**Secciones:**
- DateRangePicker global (date_from / date_to)
- SummaryCards (total, promedio, neto, etc.)
- TrendsChart (linea mensual 12m)
- ForecastCard (proyeccion 6m)
- BySourceChart (bar chart horizontal por fuente)
- ByCategoryChart (doughnut chart por categoria)
- MonthlyBreakdownTable (detalle mes a mes)

### 9.6 SourceListPage

Ruta: `/incomes/sources`
Layout: Lista de fuentes de ingresos.

**Componentes:**
- Header con titulo + boton "Nueva Fuente"
- Grid de SourceCards
- Cada card: nombre, tipo, estabilidad, total_received, income_count, status
- Acciones: editar, eliminar, "Crear Ingreso Desde Fuente"

### 9.7 SourceCreatePage

Ruta: `/incomes/sources/new`
Formulario de creacion usando IncomeSourceForm.

### 9.8 SourceEditPage

Ruta: `/incomes/sources/:id/edit`
Formulario de edicion con datos precargados.

### 9.9 ScheduleListPage

Ruta: `/incomes/schedule`
Layout: Lista de schedules de ingresos.

**Componentes:**
- Header con titulo + boton "Nueva Programacion"
- Filtros: status, date range
- Lista de ScheduleCards
- Cada card: descripcion, monto, fecha esperada, estado, source, frecuencia
- Accion "Marcar como Recibido" en los pending
- ProjectedIncomeCard resumen

### 9.10 ScheduleCreatePage

Ruta: `/incomes/schedule/new`
Formulario de creacion usando IncomeScheduleForm.

### 9.11 RecurringDetectionPage

Ruta: `/incomes/recurring`
Layout: Resultados de deteccion de ingresos recurrentes.

**Componentes:**
- Header con titulo + boton "Procesar Recurrentes"
- Summary: total candidates, monthly recurring estimate
- Lista de candidatos con:
  - Descripcion, monto, frecuencia detectada
  - Ocurrencias, confianza (progress bar)
  - Sugerencia (create_recurring / schedule / ignore)
  - Accion para crear schedule desde candidato

### 9.12 IrregularDetectionPage

Ruta: `/incomes/irregular`
Layout: Identificacion de ingresos irregulares.

**Componentes:**
- Header con titulo + selector de meses (default 6)
- Summary: total irregularities, period
- Lista de irregularidades con:
  - Descripcion, monto, fecha
  - Desviacion del promedio (porcentaje + color)
  - Razon de irregularidad

---

## 10. Actualizacion de Routing

En `src/routes/lazy.ts`, agregar:

```typescript
// Incomes
export const IncomeListPage = lazy(() => import('@/features/incomes/pages/IncomeListPage'))
export const IncomeCreatePage = lazy(() => import('@/features/incomes/pages/IncomeCreatePage'))
export const IncomeDetailPage = lazy(() => import('@/features/incomes/pages/IncomeDetailPage'))
export const IncomeEditPage = lazy(() => import('@/features/incomes/pages/IncomeEditPage'))
export const IncomeSummaryPage = lazy(() => import('@/features/incomes/pages/IncomeSummaryPage'))
export const SourceListPage = lazy(() => import('@/features/incomes/pages/SourceListPage'))
export const SourceCreatePage = lazy(() => import('@/features/incomes/pages/SourceCreatePage'))
export const SourceEditPage = lazy(() => import('@/features/incomes/pages/SourceEditPage'))
export const ScheduleListPage = lazy(() => import('@/features/incomes/pages/ScheduleListPage'))
export const ScheduleCreatePage = lazy(() => import('@/features/incomes/pages/ScheduleCreatePage'))
export const RecurringDetectionPage = lazy(() => import('@/features/incomes/pages/RecurringDetectionPage'))
export const IrregularDetectionPage = lazy(() => import('@/features/incomes/pages/IrregularDetectionPage'))
```

En `src/routes/index.tsx`, reemplazar los placeholders de `/incomes`:

```tsx
// Incomes (reemplazar los PlaceholderPage actuales)
{
  path: '/incomes',
  element: (<SuspenseWrapper><IncomeListPage /></SuspenseWrapper>),
},
{
  path: '/incomes/new',
  element: (<SuspenseWrapper><IncomeCreatePage /></SuspenseWrapper>),
},
{
  path: '/incomes/:id',
  element: (<SuspenseWrapper><IncomeDetailPage /></SuspenseWrapper>),
},
{
  path: '/incomes/:id/edit',
  element: (<SuspenseWrapper><IncomeEditPage /></SuspenseWrapper>),
},
{
  path: '/incomes/summary',
  element: (<SuspenseWrapper><IncomeSummaryPage /></SuspenseWrapper>),
},
{
  path: '/incomes/sources',
  element: (<SuspenseWrapper><SourceListPage /></SuspenseWrapper>),
},
{
  path: '/incomes/sources/new',
  element: (<SuspenseWrapper><SourceCreatePage /></SuspenseWrapper>),
},
{
  path: '/incomes/sources/:id/edit',
  element: (<SuspenseWrapper><SourceEditPage /></SuspenseWrapper>),
},
{
  path: '/incomes/schedule',
  element: (<SuspenseWrapper><ScheduleListPage /></SuspenseWrapper>),
},
{
  path: '/incomes/schedule/new',
  element: (<SuspenseWrapper><ScheduleCreatePage /></SuspenseWrapper>),
},
{
  path: '/incomes/recurring',
  element: (<SuspenseWrapper><RecurringDetectionPage /></SuspenseWrapper>),
},
{
  path: '/incomes/irregular',
  element: (<SuspenseWrapper><IrregularDetectionPage /></SuspenseWrapper>),
},
```

---

## 11. Actualizacion de Sidebar

En `src/components/layout/Sidebar.tsx`, actualizar la seccion "Ingresos y Gastos":

```tsx
{
  section: 'Ingresos y Gastos',
  items: [
    {
      name: 'Ingresos',
      href: '/incomes',
      icon: TrendingUp,
      // Agregar subitems como parte del nombre o rutas separadas
    },
    { name: 'Gastos', href: '/expenses', icon: TrendingDown },
  ],
},
```

**Opcion recomendada:** En lugar de submenu en sidebar (complejo de implementar), crear una pagina `/incomes` que funcione como hub con cards de navegacion a las subsecciones:
- Lista de Ingresos
- Dashboard / Summary
- Fuentes de Ingresos
- Programacion
- Deteccion Recurrente
- Ingresos Irregulares

O alternativamente, usar tabs dentro de la pagina de incomes para navegar entre subsecciones.

---

## 12. Estrategias y Mejores Practicas

### 12.1 IncomeForm — Manejo de Tax Fields

Los campos de impuestos (gross, tax_withheld, net_amount) deben actualizarse automaticamente:
- Si el usuario ingresa gross y tax, net se calcula solo
- Si el usuario ingresa gross y net, tax se calcula solo
- Si el usuario ingresa solo gross, mostrar advertencia
- Si el usuario ingresa net manualmente (y gross esta vacio), permitir

```tsx
// Estrategia con useEffect + watch
const grossAmount = watch('gross_amount')
const taxWithheld = watch('tax_withheld')
const netAmount = watch('net_amount')

// Auto-calculo: si gross y tax existen, net = gross - tax
useEffect(() => {
  if (grossAmount && taxWithheld) {
    const gross = parseFloat(grossAmount)
    const tax = parseFloat(taxWithheld)
    if (!isNaN(gross) && !isNaN(tax)) {
      setValue('net_amount', (gross - tax).toFixed(2))
    }
  }
}, [grossAmount, taxWithheld, setValue])
```

### 12.2 IncomeForm — Stability Selector Visual

En lugar de un dropdown, usar 4 cards/badges selectables:

```tsx
<div className="grid grid-cols-2 gap-2">
  {Object.entries(STABILITY_CONFIG).map(([key, config]) => (
    <button
      key={key}
      onClick={() => setValue('stability', key)}
      className={cn(
        'flex items-center gap-3 rounded-xl border-2 p-3 transition-all',
        stability === key ? 'border-current' + config.color : 'border-gray-200'
      )}
    >
      <div className={cn('h-3 w-3 rounded-full', config.dotColor)} />
      <div className="text-left">
        <p className="text-sm font-medium">{config.label}</p>
        <p className="text-xs text-gray-400">{config.description}</p>
      </div>
    </button>
  ))}
</div>
```

### 12.3 IncomeSourcePicker — Dropdown Mejorado

Crear un picker de fuentes de ingreso similar a CategoryPicker:
- Dropdown con search
- Cada item muestra: nombre, tipo badge, estabilidad dot, total_received
- Si no hay fuentes, mostrar boton "Crear Fuente" que navega a `/incomes/sources/new`

### 12.4 Summary Dashboard — Period Selector

Usar los mismos periodos predefinidos que en transactions:
```typescript
const PERIOD_OPTIONS = [
  { value: 'this_month', label: 'Este Mes' },
  { value: 'last_month', label: 'Mes Pasado' },
  { value: 'this_quarter', label: 'Este Trimestre' },
  { value: 'this_year', label: 'Este Ano' },
  { value: 'last_year', label: 'Ano Pasado' },
  { value: 'custom', label: 'Personalizado' },
]
```

### 12.5 Charts — Colores Consistentes

Para los charts de trends y distribucion, usar colores consistentes con el theme:
```typescript
const CHART_COLORS = {
  income: '#10b981',     // emerald-500
  expense: '#ef4444',    // red-500
  primary: '#3b82f6',    // blue-500
  // Para by-type charts, usar colores de INCOME_TYPE_CONFIG
}
```

### 12.6 Batch Status Updates — UX

- Permitir seleccion multiple con checkboxes en IncomeTable
- Mostrar contador "X seleccionados"
- Boton "Actualizar Estado" que abre BatchStatusModal
- En el modal, selector de estado y confirmacion
- Mostrar progreso con toast success/failure por cada item

### 12.7 Receive Schedule — Flujo

- Desde ScheduleListPage, boton "Recibir" en cada schedule pendiente
- Abre ReceiveScheduleModal con datos precargados
- Al confirmar, llama a `receiveScheduled` que crea el income y marca el schedule como received
- Invalidar queries de incomes, schedules, y accounts

### 12.8 Recurring Candidates — Acciones

Para cada candidato, ofrecer:
- "Crear Schedule": navega a `/incomes/schedule/new` con datos precargados
- "Ignorar": descarta el candidato (no hay endpoint, solo dismiss local)
- "Crear Recurring": crea un patron recurrente

### 12.9 Empty States

Para cada pagina, crear EmptyState especifico:
- IncomeListPage: "No hay ingresos registrados. Crea tu primer ingreso."
- SourceListPage: "No hay fuentes de ingreso. Agrega tu empleador o cliente."
- ScheduleListPage: "No hay ingresos programados. Programa tu proximo ingreso."
- RecurringDetectionPage: "No se detectaron patrones recurrentes."
- IrregularDetectionPage: "No se identificaron ingresos irregulares."

---

## 13. Verificacion Final

Antes de dar por completada la fase, verificar:

- [ ] `pnpm tsc --noEmit` pasa sin errores
- [ ] `pnpm lint` pasa sin errores
- [ ] `pnpm build` produce build exitoso
- [ ] Todas las rutas de incomes funcionan correctamente
- [ ] Income CRUD completo (crear, listar, detalle, editar, eliminar)
- [ ] Income Sources CRUD completo
- [ ] Income Schedule CRUD + recibir
- [ ] Income Summary Dashboard con datos reales
- [ ] Trends chart renderiza datos
- [ ] Forecast card muestra proyeccion
- [ ] Recurring candidates se cargan
- [ ] Irregular incomes se cargan
- [ ] Batch status update funciona
- [ ] Stability badges se muestran correctamente
- [ ] Filtros funcionan y persisten en URL
- [ ] Responsive: cards en mobile, tabla en desktop
- [ ] Loading skeletons en todas las paginas
- [ ] Empty states cuando no hay datos
- [ ] Error states con retry button
- [ ] Toasts en todas las mutaciones
- [ ] Dark mode funciona en todos los componentes nuevos
- [ ] Tax fields auto-calculo funciona
- [ ] IncomeSourcePicker funciona correctamente
