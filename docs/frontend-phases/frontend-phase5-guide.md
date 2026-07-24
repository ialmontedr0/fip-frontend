# Fase 5: Transactions — Guia de Implementacion

Version: 1.0
Proyecto: Financial Intelligence Platform (FIP) - Frontend

---

## Indice

1. [Resumen de la Fase](#1-resumen-de-la-fase)
2. [Backend API Reference](#2-backend-api-reference)
   - 2.1 [Transaction CRUD](#21-transaction-crud-6-endpoints)
   - 2.2 [Transfer](#22-transfer-1-endpoint)
   - 2.3 [Recurring](#23-recurring-6-endpoints)
   - 2.4 [Tags](#24-tags-2-endpoints)
   - 2.5 [Attachments](#25-attachments-3-endpoints)
   - 2.6 [OCR](#26-ocr-1-endpoint)
   - 2.7 [Audit Log](#27-audit-log-1-endpoint)
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

**Estado actual:** Fase 4 completada (Categories CRUD, arbol expandible, AI categorization test tool).

**Objetivos de Fase 5:**

| Area | Descripcion |
|------|-------------|
| **Transaction CRUD** | Crear, listar (con paginacion/filtros), detalle, editar, eliminar transacciones |
| **Transaction Summary** | Widget resumen de ingresos/gastos/flujo neto por periodo |
| **Transfer** | Crear transferencia entre cuentas (source → destination, genera 2 transacciones) |
| **Recurring Transactions** | CRUD de patrones recurrentes + procesamiento manual |
| **Tags** | CRUD de etiquetas en transacciones (add/remove) |
| **Attachments** | Upload, listar, eliminar archivos adjuntos por transaccion |
| **Audit Log** | Ver historial de cambios de una transaccion |
| **Infinite Scroll** | Carga progresiva de transacciones al hacer scroll |
| **Advanced Filters** | Filtros combinados por tipo, estado, categoria, cuenta, rango de fechas, monto, busqueda |
| **Transaction Quick Actions** | Duplicar, convertir a recurrente, acciones masivas |

### Convenciones a Seguir

- **Patron existente**: Seguir exactamente la misma estructura que Fase 3 y 4
- **API Client**: Todos los llamados van por `lib/api.ts`
- **Server State**: TanStack Query para todos los datos del API
- **Forms**: React Hook Form + Zod para validacion
- **Toasts**: `react-hot-toast` para feedback
- **Estilo**: TailwindCSS con glass morphism `bg-white/80 backdrop-blur-xl`
- **Animaciones**: `animate-fade-in` con `animationDelay` escalonado
- **Componentes UI**: Usar los existentes en `components/ui/` (Card, Button, Input, Badge, Skeleton, Modal, etc.)
- **Iconos**: Lucide React
- **Infinite Scroll**: Usar IntersectionObserver API (libreria opcional: `react-intersection-observer`)
- **Balance**: Usar `formatCurrency(parseFloat(amount), currency_code)` de `lib/utils.ts`
- **Reutilizar**: `CategoryPicker` de categories, `AccountPicker` de accounts

---

## 2. Backend API Reference

Base path: `/api/v1/transactions`

### 2.1 Transaction CRUD (6 endpoints)

#### `POST /transactions` — Crear transaccion

**Request (201):**
```typescript
// CreateTransactionRequest
{
  account_id: string                    // UUID
  transaction_type: 'income' | 'expense' | 'adjustment'
  amount: number                        // > 0
  currency_code?: string                // default "DOP", ISO 4217
  description: string                   // min 1, max 500
  effective_date: string                // ISO date "YYYY-MM-DD"
  category_id?: string | null           // UUID
  subcategory_id?: string | null        // UUID
  status?: string                       // default "completed"
  notes?: string | null
  source?: string                       // default "manual"
  tags?: string[] | null
}
```

**Response (201) — TransactionResponse:**
```typescript
{
  id: string
  account_id: string
  category_id: string | null
  subcategory_id: string | null
  transaction_type: string
  status: string
  amount: string                        // "0.0000"
  currency_code: string
  description: string
  notes: string | null
  effective_date: string | null
  transfer_id: string | null
  source: string
  tags: string[]
  created_at: string | null
}
```

#### `GET /transactions` — Listar transacciones (paginado + filtros)

**Query params (todos opcionales excepto paginacion):**
```
transaction_type: string        // income | expense | adjustment
status: string                  // completed | pending | cancelled
category_id: string
subcategory_id: string
account_id: string
tag: string
min_amount: number
max_amount: number
date_from: string               // ISO date
date_to: string                 // ISO date
source: string                  // manual | import | recurring | transfer
search: string                  // busqueda libre en description
sort_by: string                 // default "effective_date"
sort_order: string              // "asc" | "desc" default "desc"
page: number                    // default 1, min 1
page_size: number               // default 20, min 1, max 100
```

**Response (200) — ListTransactionsResponse:**
```typescript
{
  transactions: Array<{
    id: string
    account_id: string
    category_id: string | null
    subcategory_id: string | null
    transaction_type: string
    status: string
    amount: string
    currency_code: string
    description: string
    effective_date: string | null
    source: string
    tags: string[]
    created_at: string | null
  }>
  total: number
  page: number
  page_size: number
  total_pages: number
}
```

#### `GET /transactions/summary` — Resumen del periodo

**Query params (obligatorios):**
```
date_from: string     // ISO date
date_to: string       // ISO date
```

**Response (200) — TransactionSummaryResponse:**
```typescript
{
  period_start: string
  period_end: string
  total_income: string           // "0.0000"
  total_expenses: string
  net_flow: string
  total_income_count: number
  total_expense_count: number
  total_transfer_count: number
  total_adjustment_count: number
  by_type: Record<string, unknown>
}
```

#### `GET /transactions/{transaction_id}` — Detalle de transaccion

**Response (200) — TransactionDetailResponse (extends TransactionResponse):**
```typescript
{
  id: string
  account_id: string
  category_id: string | null
  subcategory_id: string | null
  transaction_type: string
  status: string
  amount: string
  currency_code: string
  description: string
  notes: string | null
  effective_date: string | null
  transfer_id: string | null
  source: string
  tags: string[]
  created_at: string | null
  // Extra fields:
  recurring_id: string | null
  ai_category_id: string | null
  ai_confidence: string | null
  ai_model_version: string | null
  ai_reason: string | null
  attachments: Array<{
    id: string
    original_filename: string
    mime_type: string
    file_size: number
    created_at: string | null
  }>
  updated_at: string | null
}
```

#### `PATCH /transactions/{transaction_id}` — Actualizar transaccion

**Request (todos opcionales) — UpdateTransactionRequest:**
```typescript
{
  amount?: number                    // > 0
  description?: string               // max 500
  notes?: string | null
  category_id?: string | null
  subcategory_id?: string | null
  status?: string
  effective_date?: string            // ISO date
  account_id?: string
}
```

**Response (200):** `TransactionResponse`

#### `DELETE /transactions/{transaction_id}` — Eliminar transaccion

**Response (200) — DeleteTransactionResponse:**
```typescript
{
  id: string
  status: string
  message: string
}
```

---

### 2.2 Transfer (1 endpoint)

#### `POST /transactions/transfer` — Crear transferencia

**Request — TransferCreateRequest:**
```typescript
{
  source_account_id: string
  destination_account_id: string
  amount: number                        // > 0
  currency_code?: string                // default "DOP"
  description: string                   // min 1, max 500
  effective_date: string                // ISO date
  notes?: string | null
  tags?: string[] | null
}
```

**Response (201) — TransferResponse:**
```typescript
{
  transfer_id: string
  source_transaction: {
    id: string
    account_id: string
    amount: string
    type: string
  }
  destination_transaction: {
    id: string
    account_id: string
    amount: string
    type: string
  }
  total_amount: string
  currency_code: string
  effective_date: string
  created_at: string | null
}
```

---

### 2.3 Recurring (6 endpoints)

#### `POST /transactions/recurring` — Crear patron recurrente

**Request — CreateRecurringRequest:**
```typescript
{
  account_id: string
  transaction_type: string           // income | expense
  amount: number                     // > 0
  currency_code?: string             // default "DOP"
  description: string                // min 1, max 500
  frequency: string                  // daily | weekly | monthly | yearly
  start_date: string                 // ISO date
  interval?: number                  // default 1, min 1
  category_id?: string | null
  subcategory_id?: string | null
  notes?: string | null
  end_date?: string | null           // ISO date
  max_executions?: number | null
}
```

**Response (201) — RecurringResponse:**
```typescript
{
  id: string
  transaction_type: string
  amount: string
  currency_code: string
  description: string
  frequency: string
  interval: number
  start_date: string
  end_date: string | null
  next_execution_date: string
  max_executions: number | null
  execution_count: number
  is_active: boolean
  created_at: string | null
}
```

#### `GET /transactions/recurring` — Listar patrones recurrentes

**Query params:** `?is_active=true`

**Response (200) — ListRecurringResponse:**
```typescript
{
  recurring: Array<{
    id: string
    transaction_type: string
    amount: string
    currency_code: string
    description: string
    frequency: string
    interval: number
    start_date: string
    end_date: string | null
    next_execution_date: string
    execution_count: number
    max_executions: number | null
    is_active: boolean
    last_executed_at: string | null
  }>
  total: number
}
```

#### `GET /transactions/recurring/{recurring_id}` — Patron por ID

**Response (200):** `RecurringResponse`

#### `PATCH /transactions/recurring/{recurring_id}` — Actualizar patron

**Request (todos opcionales) — UpdateRecurringRequest:**
```typescript
{
  amount?: number                    // > 0
  description?: string               // max 500
  frequency?: string
  interval?: number                  // >= 1
  end_date?: string | null           // ISO date
  max_executions?: number | null
  is_active?: boolean
}
```

**Response (200):** `RecurringResponse`

#### `DELETE /transactions/recurring/{recurring_id}` — Eliminar patron

**Response (200) — DeleteRecurringResponse:**
```typescript
{
  id: string
  message: string
}
```

#### `POST /transactions/recurring/process` — Procesar recurrentes vencidas

**Response (200) — ProcessRecurringResponse:**
```typescript
{
  processed: number
  created: number
  errors: Array<Record<string, unknown>>
}
```

---

### 2.4 Tags (2 endpoints)

#### `POST /transactions/{transaction_id}/tags` — Agregar etiquetas

**Request — AddTagsRequest:**
```typescript
{
  tags: string[]      // min 1
}
```

**Response (201) — TagResponse:**
```typescript
{
  transaction_id: string
  added: string[]
  total_tags: number
  all_tags: string[]
}
```

#### `DELETE /transactions/{transaction_id}/tags/{tag_name}` — Remover etiqueta

**Response (200) — RemoveTagResponse:**
```typescript
{
  transaction_id: string
  removed_tag: string
  remaining_tags: string[]
}
```

---

### 2.5 Attachments (3 endpoints)

#### `POST /transactions/{transaction_id}/attachments` — Subir archivo (multipart)

**Request:** `multipart/form-data` con campo `file`

**Response (201) — UploadAttachmentResponse:**
```typescript
{
  id: string
  transaction_id: string
  original_filename: string
  mime_type: string
  file_size: number
  created_at: string | null
}
```

#### `GET /transactions/{transaction_id}/attachments` — Listar adjuntos

**Response (200) — ListAttachmentsResponse:**
```typescript
{
  transaction_id: string
  attachments: Array<{
    id: string
    original_filename: string
    mime_type: string
    file_size: number
    created_at: string | null
  }>
  total: number
}
```

#### `DELETE /transactions/{transaction_id}/attachments/{attachment_id}` — Eliminar adjunto

**Response (200) — DeleteAttachmentResponse:**
```typescript
{
  id: string
  message: string
}
```

---

### 2.6 OCR (1 endpoint)

#### `POST /transactions/ocr` — OCR de recibo (STUB)

**Request:**
```typescript
{
  image_url?: string
}
```

**Response (200) — OCRResponse:**
```typescript
{
  success: false
  message: "OCR no disponible aun. Estara disponible en Fase 20."
  data: null
}
```

**NOTA:** Este endpoint es un stub. No implementar UI real. Solo mostrar un badge o mensaje "Proximamente".

---

### 2.7 Audit Log (1 endpoint)

#### `GET /transactions/{transaction_id}/audit` — Historial de cambios

**Response (200) — AuditLogResponse:**
```typescript
{
  transaction_id: string
  audit_logs: Array<{
    id: string
    action: string
    changes: Record<string, unknown> | null
    ip_address: string | null
    user_agent: string | null
    created_at: string | null
  }>
  total: number
}
```

---

## 3. Estructura de Archivos

```
src/
  types/
    transactions.ts                    # Transaction types (CREAR)
  features/
    transactions/                      # (CREAR carpeta completa)
      api/
        transactions.ts                # API functions
        transfers.ts                   # Transfer API
        recurring.ts                   # Recurring API
        attachments.ts                 # Attachments API
      hooks/
        useTransactions.ts             # Queries + Mutations for transactions
        useTransfers.ts                # Transfer mutations
        useRecurring.ts                # Recurring queries + mutations
        useAttachments.ts              # Attachment mutations
      constants.ts                     # TRANSACTION_TYPE_CONFIG, STATUS_CONFIG, FREQUENCY_CONFIG
      components/
        TransactionCard.tsx            # Tarjeta de transaccion para lista (mobile-first)
        TransactionTable.tsx           # Tabla de transacciones para desktop
        TransactionRow.tsx             # Fila individual en tabla
        TransactionForm.tsx            # Formulario crear/editar transaccion
        TransactionFilters.tsx         # Barra de filtros avanzados (collapsible)
        TransactionSummaryWidget.tsx   # Widget resumen ingresos/gastos/neto
        TransactionStatusBadge.tsx     # Badge de estado (completed/pending/cancelled)
        TransactionTypeBadge.tsx       # Badge de tipo (income/expense/adjustment)
        TransferForm.tsx               # Formulario de transferencia
        RecurringForm.tsx              # Formulario patron recurrente
        RecurringCard.tsx              # Tarjeta de patron recurrente
        RecurringList.tsx              # Lista de patrones recurrentes
        TagInput.tsx                   # Input de etiquetas con autocomplete
        AttachmentList.tsx             # Lista de archivos adjuntos con actions
        AttachmentUploader.tsx         # Dropzone para subir archivos
        AuditLogViewer.tsx             # Timeline de cambios de la transaccion
        DeleteTransactionModal.tsx     # Modal confirmacion eliminar
        InfiniteScrollContainer.tsx    # Wrapper de IntersectionObserver para scroll infinito
        TransactionQuickActions.tsx     # Acciones rapidas (duplicar, convertir a recurrente)
        EmptyTransactionState.tsx      # Empty state con CTA
      pages/
        TransactionListPage.tsx        # Lista principal (infinite scroll + filtros)
        TransactionCreatePage.tsx      # Crear transaccion/transferencia
        TransactionDetailPage.tsx      # Detalle + tags + attachments + audit
        TransactionEditPage.tsx        # Editar transaccion (reusa TransactionForm)
        RecurringListPage.tsx          # Lista de patrones recurrentes
        RecurringCreatePage.tsx        # Crear patron recurrente
        RecurringDetailPage.tsx        # Detalle/editar patron recurrente
  routes/
    index.tsx                          # Actualizar routes
    lazy.ts                            # Agregar lazy imports
```

---

## 4. Tipos de TypeScript

Crear `src/types/transactions.ts`:

```typescript
// ============================================================
// Enums & Constants
// ============================================================

export const TRANSACTION_TYPES = {
  income: 'Ingreso',
  expense: 'Gasto',
  adjustment: 'Ajuste',
} as const

export type TransactionType = keyof typeof TRANSACTION_TYPES

export const TRANSACTION_STATUSES = {
  completed: 'Completada',
  pending: 'Pendiente',
  cancelled: 'Cancelada',
} as const

export type TransactionStatus = keyof typeof TRANSACTION_STATUSES

export const TRANSACTION_SOURCES = {
  manual: 'Manual',
  import: 'Importada',
  recurring: 'Recurrente',
  transfer: 'Transferencia',
} as const

export type TransactionSource = keyof typeof TRANSACTION_SOURCES

export const RECURRING_FREQUENCIES = {
  daily: 'Diario',
  weekly: 'Semanal',
  monthly: 'Mensual',
  yearly: 'Anual',
} as const

export type RecurringFrequency = keyof typeof RECURRING_FREQUENCIES

// ============================================================
// API Request types
// ============================================================

export interface CreateTransactionRequest {
  account_id: string
  transaction_type: TransactionType
  amount: number
  currency_code?: string
  description: string
  effective_date: string
  category_id?: string | null
  subcategory_id?: string | null
  status?: string
  notes?: string | null
  source?: string
  tags?: string[] | null
}

export interface UpdateTransactionRequest {
  amount?: number
  description?: string
  notes?: string | null
  category_id?: string | null
  subcategory_id?: string | null
  status?: string
  effective_date?: string
  account_id?: string
}

export interface AddTagsRequest {
  tags: string[]
}

// ============================================================
// API Response types
// ============================================================

export interface TransactionResponse {
  id: string
  account_id: string
  category_id: string | null
  subcategory_id: string | null
  transaction_type: string
  status: string
  amount: string
  currency_code: string
  description: string
  notes: string | null
  effective_date: string | null
  transfer_id: string | null
  source: string
  tags: string[]
  created_at: string | null
}

export interface TransactionListItem {
  id: string
  account_id: string
  category_id: string | null
  subcategory_id: string | null
  transaction_type: string
  status: string
  amount: string
  currency_code: string
  description: string
  effective_date: string | null
  source: string
  tags: string[]
  created_at: string | null
}

export interface AttachmentInfo {
  id: string
  original_filename: string
  mime_type: string
  file_size: number
  created_at: string | null
}

export interface TransactionDetailResponse extends TransactionResponse {
  recurring_id: string | null
  ai_category_id: string | null
  ai_confidence: string | null
  ai_model_version: string | null
  ai_reason: string | null
  attachments: AttachmentInfo[]
  updated_at: string | null
}

export interface ListTransactionsResponse {
  transactions: TransactionListItem[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface DeleteTransactionResponse {
  id: string
  status: string
  message: string
}

// ============================================================
// Summary types
// ============================================================

export interface TransactionSummaryResponse {
  period_start: string
  period_end: string
  total_income: string
  total_expenses: string
  net_flow: string
  total_income_count: number
  total_expense_count: number
  total_transfer_count: number
  total_adjustment_count: number
  by_type: Record<string, unknown>
}

// ============================================================
// Transfer types
// ============================================================

export interface CreateTransferRequest {
  source_account_id: string
  destination_account_id: string
  amount: number
  currency_code?: string
  description: string
  effective_date: string
  notes?: string | null
  tags?: string[] | null
}

export interface TransferTransactionInfo {
  id: string
  account_id: string
  amount: string
  type: string
}

export interface TransferResponse {
  transfer_id: string
  source_transaction: TransferTransactionInfo
  destination_transaction: TransferTransactionInfo
  total_amount: string
  currency_code: string
  effective_date: string
  created_at: string | null
}

// ============================================================
// Recurring types
// ============================================================

export interface CreateRecurringRequest {
  account_id: string
  transaction_type: TransactionType
  amount: number
  currency_code?: string
  description: string
  frequency: RecurringFrequency
  start_date: string
  interval?: number
  category_id?: string | null
  subcategory_id?: string | null
  notes?: string | null
  end_date?: string | null
  max_executions?: number | null
}

export interface UpdateRecurringRequest {
  amount?: number
  description?: string
  frequency?: string
  interval?: number
  end_date?: string | null
  max_executions?: number | null
  is_active?: boolean
}

export interface RecurringResponse {
  id: string
  transaction_type: string
  amount: string
  currency_code: string
  description: string
  frequency: string
  interval: number
  start_date: string
  end_date: string | null
  next_execution_date: string
  max_executions: number | null
  execution_count: number
  is_active: boolean
  created_at: string | null
}

export interface RecurringListItem {
  id: string
  transaction_type: string
  amount: string
  currency_code: string
  description: string
  frequency: string
  interval: number
  start_date: string
  end_date: string | null
  next_execution_date: string
  execution_count: number
  max_executions: number | null
  is_active: boolean
  last_executed_at: string | null
}

export interface ListRecurringResponse {
  recurring: RecurringListItem[]
  total: number
}

export interface DeleteRecurringResponse {
  id: string
  message: string
}

export interface ProcessRecurringResponse {
  processed: number
  created: number
  errors: Record<string, unknown>[]
}

// ============================================================
// Tags types
// ============================================================

export interface TagResponse {
  transaction_id: string
  added: string[]
  total_tags: number
  all_tags: string[]
}

export interface RemoveTagResponse {
  transaction_id: string
  removed_tag: string
  remaining_tags: string[]
}

// ============================================================
// Attachments types
// ============================================================

export interface UploadAttachmentResponse {
  id: string
  transaction_id: string
  original_filename: string
  mime_type: string
  file_size: number
  created_at: string | null
}

export interface ListAttachmentsResponse {
  transaction_id: string
  attachments: AttachmentInfo[]
  total: number
}

export interface DeleteAttachmentResponse {
  id: string
  message: string
}

// ============================================================
// Audit types
// ============================================================

export interface AuditLogEntry {
  id: string
  action: string
  changes: Record<string, unknown> | null
  ip_address: string | null
  user_agent: string | null
  created_at: string | null
}

export interface AuditLogResponse {
  transaction_id: string
  audit_logs: AuditLogEntry[]
  total: number
}

// ============================================================
// Filter types (frontend-only, for useSearchParams)
// ============================================================

export interface TransactionFilters {
  transaction_type?: string
  status?: string
  category_id?: string
  subcategory_id?: string
  account_id?: string
  tag?: string
  min_amount?: number
  max_amount?: number
  date_from?: string
  date_to?: string
  source?: string
  search?: string
  sort_by?: string
  sort_order?: string
  page?: number
  page_size?: number
}
```

---

## 5. API Client

### `src/features/transactions/api/transactions.ts`

```typescript
import api from '@/lib/api'
import type {
  TransactionResponse, TransactionDetailResponse, ListTransactionsResponse,
  TransactionSummaryResponse, DeleteTransactionResponse,
  CreateTransactionRequest, UpdateTransactionRequest,
  AddTagsRequest, TagResponse, RemoveTagResponse,
  AuditLogResponse,
} from '@/types/transactions'

// ============================================================
// Transaction CRUD
// ============================================================

export function createTransaction(data: CreateTransactionRequest) {
  return api.post<TransactionResponse>('/transactions', data)
}

export function listTransactions(params?: Record<string, unknown>) {
  return api.get<ListTransactionsResponse>('/transactions', { params })
}

export function getTransactionSummary(params: { date_from: string; date_to: string }) {
  return api.get<TransactionSummaryResponse>('/transactions/summary', { params })
}

export function getTransaction(id: string) {
  return api.get<TransactionDetailResponse>(`/transactions/${id}`)
}

export function updateTransaction(id: string, data: UpdateTransactionRequest) {
  return api.patch<TransactionResponse>(`/transactions/${id}`, data)
}

export function deleteTransaction(id: string) {
  return api.delete<DeleteTransactionResponse>(`/transactions/${id}`)
}

// ============================================================
// Tags
// ============================================================

export function addTags(transactionId: string, data: AddTagsRequest) {
  return api.post<TagResponse>(`/transactions/${transactionId}/tags`, data)
}

export function removeTag(transactionId: string, tagName: string) {
  return api.delete<RemoveTagResponse>(`/transactions/${transactionId}/tags/${encodeURIComponent(tagName)}`)
}

// ============================================================
// Audit
// ============================================================

export function getAuditLog(transactionId: string) {
  return api.get<AuditLogResponse>(`/transactions/${transactionId}/audit`)
}
```

### `src/features/transactions/api/transfers.ts`

```typescript
import api from '@/lib/api'
import type { CreateTransferRequest, TransferResponse } from '@/types/transactions'

export function createTransfer(data: CreateTransferRequest) {
  return api.post<TransferResponse>('/transactions/transfer', data)
}
```

### `src/features/transactions/api/recurring.ts`

```typescript
import api from '@/lib/api'
import type {
  RecurringResponse, RecurringListItem, ListRecurringResponse,
  DeleteRecurringResponse, ProcessRecurringResponse,
  CreateRecurringRequest, UpdateRecurringRequest,
} from '@/types/transactions'

export function createRecurring(data: CreateRecurringRequest) {
  return api.post<RecurringResponse>('/transactions/recurring', data)
}

export function listRecurring(params?: { is_active?: boolean }) {
  return api.get<ListRecurringResponse>('/transactions/recurring', { params })
}

export function getRecurring(id: string) {
  return api.get<RecurringResponse>(`/transactions/recurring/${id}`)
}

export function updateRecurring(id: string, data: UpdateRecurringRequest) {
  return api.patch<RecurringResponse>(`/transactions/recurring/${id}`, data)
}

export function deleteRecurring(id: string) {
  return api.delete<DeleteRecurringResponse>(`/transactions/recurring/${id}`)
}

export function processRecurring() {
  return api.post<ProcessRecurringResponse>('/transactions/recurring/process')
}
```

### `src/features/transactions/api/attachments.ts`

```typescript
import api from '@/lib/api'
import type {
  UploadAttachmentResponse, ListAttachmentsResponse, DeleteAttachmentResponse,
} from '@/types/transactions'

export function uploadAttachment(transactionId: string, file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return api.post<UploadAttachmentResponse>(
    `/transactions/${transactionId}/attachments`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )
}

export function listAttachments(transactionId: string) {
  return api.get<ListAttachmentsResponse>(`/transactions/${transactionId}/attachments`)
}

export function deleteAttachment(transactionId: string, attachmentId: string) {
  return api.delete<DeleteAttachmentResponse>(
    `/transactions/${transactionId}/attachments/${attachmentId}`,
  )
}
```

---

## 6. Hooks de TanStack Query

### `src/features/transactions/hooks/useTransactions.ts`

```typescript
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as transactionsApi from '../api/transactions'
import type {
  CreateTransactionRequest, UpdateTransactionRequest, AddTagsRequest,
  TransactionFilters, ListTransactionsResponse,
} from '@/types/transactions'

// ============================================================
// Query Keys
// ============================================================

export const transactionKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...transactionKeys.lists(), filters] as const,
  infinite: (filters?: Record<string, unknown>) => [...transactionKeys.all, 'infinite', filters] as const,
  details: () => [...transactionKeys.all, 'detail'] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const,
  summary: (params?: Record<string, unknown>) => [...transactionKeys.all, 'summary', params] as const,
  tags: (id: string) => [...transactionKeys.all, 'tags', id] as const,
  audit: (id: string) => [...transactionKeys.all, 'audit', id] as const,
}

// ============================================================
// Queries
// ============================================================

export function useTransactions(params?: TransactionFilters) {
  const cleaned = params ? Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== undefined && v !== '' && v !== null),
  ) : undefined
  return useQuery({
    queryKey: transactionKeys.list(cleaned),
    queryFn: () => transactionsApi.listTransactions(cleaned).then((r) => r.data),
    staleTime: 1000 * 60, // 1 min
  })
}

export function useTransactionInfinite(filters?: Omit<TransactionFilters, 'page'>) {
  const cleaned = filters ? Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v !== undefined && v !== '' && v !== null),
  ) : undefined
  return useInfiniteQuery({
    queryKey: transactionKeys.infinite(cleaned),
    queryFn: ({ pageParam = 1 }) =>
      transactionsApi.listTransactions({ ...cleaned, page: pageParam, page_size: 20 }).then((r) => r.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage: ListTransactionsResponse) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    staleTime: 1000 * 60,
  })
}

export function useTransaction(id: string | undefined) {
  return useQuery({
    queryKey: transactionKeys.detail(id!),
    queryFn: () => transactionsApi.getTransaction(id!).then((r) => r.data),
    enabled: !!id,
  })
}

export function useTransactionSummary(dateFrom: string, dateTo: string) {
  return useQuery({
    queryKey: transactionKeys.summary({ date_from: dateFrom, date_to: dateTo }),
    queryFn: () => transactionsApi.getTransactionSummary({ date_from: dateFrom, date_to: dateTo }).then((r) => r.data),
    staleTime: 1000 * 60 * 2,
  })
}

// ============================================================
// Mutations
// ============================================================

export function useCreateTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTransactionRequest) => transactionsApi.createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() })
      queryClient.invalidateQueries({ queryKey: transactionKeys.summary() })
      toast.success('Transaccion creada exitosamente')
    },
    onError: (error: unknown) => {
      const message = (
        error as { response?: { data?: { error?: { message?: string } } } }
      )?.response?.data?.error?.message
      toast.error(message || 'Error al crear la transaccion')
    },
  })
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTransactionRequest }) =>
      transactionsApi.updateTransaction(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() })
      queryClient.invalidateQueries({ queryKey: transactionKeys.detail(variables.id) })
      toast.success('Transaccion actualizada exitosamente')
    },
    onError: () => toast.error('Error al actualizar la transaccion'),
  })
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => transactionsApi.deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() })
      queryClient.invalidateQueries({ queryKey: transactionKeys.summary() })
      toast.success('Transaccion eliminada exitosamente')
    },
    onError: () => toast.error('Error al eliminar la transaccion'),
  })
}

// ============================================================
// Tags Mutations
// ============================================================

export function useAddTags() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ transactionId, data }: { transactionId: string; data: AddTagsRequest }) =>
      transactionsApi.addTags(transactionId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.detail(variables.transactionId) })
      queryClient.invalidateQueries({ queryKey: transactionKeys.tags(variables.transactionId) })
      toast.success('Etiquetas agregadas')
    },
    onError: () => toast.error('Error al agregar etiquetas'),
  })
}

export function useRemoveTag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ transactionId, tagName }: { transactionId: string; tagName: string }) =>
      transactionsApi.removeTag(transactionId, tagName),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.detail(variables.transactionId) })
      toast.success('Etiqueta removida')
    },
    onError: () => toast.error('Error al remover etiqueta'),
  })
}

// ============================================================
// Audit Query
// ============================================================

export function useAuditLog(transactionId: string | undefined) {
  return useQuery({
    queryKey: transactionKeys.audit(transactionId!),
    queryFn: () => transactionsApi.getAuditLog(transactionId!).then((r) => r.data),
    enabled: !!transactionId,
  })
}
```

### `src/features/transactions/hooks/useTransfers.ts`

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as transfersApi from '../api/transfers'
import { transactionKeys } from './useTransactions'
import type { CreateTransferRequest } from '@/types/transactions'

export function useCreateTransfer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTransferRequest) => transfersApi.createTransfer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() })
      queryClient.invalidateQueries({ queryKey: transactionKeys.summary() })
      toast.success('Transferencia creada exitosamente')
    },
    onError: (error: unknown) => {
      const message = (
        error as { response?: { data?: { error?: { message?: string } } } }
      )?.response?.data?.error?.message
      toast.error(message || 'Error al crear la transferencia')
    },
  })
}
```

### `src/features/transactions/hooks/useRecurring.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as recurringApi from '../api/recurring'
import type { CreateRecurringRequest, UpdateRecurringRequest } from '@/types/transactions'

export const recurringKeys = {
  all: ['recurring'] as const,
  lists: () => [...recurringKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...recurringKeys.lists(), filters] as const,
  details: () => [...recurringKeys.all, 'detail'] as const,
  detail: (id: string) => [...recurringKeys.details(), id] as const,
}

export function useRecurringList(params?: { is_active?: boolean }) {
  return useQuery({
    queryKey: recurringKeys.list(params),
    queryFn: () => recurringApi.listRecurring(params).then((r) => r.data),
    staleTime: 1000 * 60 * 2,
  })
}

export function useRecurring(id: string | undefined) {
  return useQuery({
    queryKey: recurringKeys.detail(id!),
    queryFn: () => recurringApi.getRecurring(id!).then((r) => r.data),
    enabled: !!id,
  })
}

export function useCreateRecurring() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateRecurringRequest) => recurringApi.createRecurring(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recurringKeys.lists() })
      toast.success('Patron recurrente creado exitosamente')
    },
    onError: () => toast.error('Error al crear el patron recurrente'),
  })
}

export function useUpdateRecurring() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRecurringRequest }) =>
      recurringApi.updateRecurring(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: recurringKeys.lists() })
      queryClient.invalidateQueries({ queryKey: recurringKeys.detail(variables.id) })
      toast.success('Patron recurrente actualizado')
    },
    onError: () => toast.error('Error al actualizar el patron recurrente'),
  })
}

export function useDeleteRecurring() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => recurringApi.deleteRecurring(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recurringKeys.lists() })
      toast.success('Patron recurrente eliminado')
    },
    onError: () => toast.error('Error al eliminar el patron recurrente'),
  })
}

export function useProcessRecurring() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => recurringApi.processRecurring(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: recurringKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      toast.success(`${data.data.created} transacciones creadas de ${data.data.processed} procesadas`)
    },
    onError: () => toast.error('Error al procesar patrones recurrentes'),
  })
}
```

### `src/features/transactions/hooks/useAttachments.ts`

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as attachmentsApi from '../api/attachments'
import { transactionKeys } from './useTransactions'

export function useUploadAttachment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ transactionId, file }: { transactionId: string; file: File }) =>
      attachmentsApi.uploadAttachment(transactionId, file),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.detail(variables.transactionId) })
      toast.success('Archivo subido exitosamente')
    },
    onError: () => toast.error('Error al subir el archivo'),
  })
}

export function useDeleteAttachment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ transactionId, attachmentId }: { transactionId: string; attachmentId: string }) =>
      attachmentsApi.deleteAttachment(transactionId, attachmentId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.detail(variables.transactionId) })
      toast.success('Archivo eliminado')
    },
    onError: () => toast.error('Error al eliminar el archivo'),
  })
}
```

---

## 7. Constantes y Configuracion

Crear `src/features/transactions/constants.ts`:

```typescript
import {
  TrendingUp, TrendingDown, Scale,
  CheckCircle2, Clock, XCircle,
  Repeat, ArrowLeftRight,
} from 'lucide-react'
import type { TransactionType, TransactionStatus, RecurringFrequency } from '@/types/transactions'
import type { LucideIcon } from 'lucide-react'

// ============================================================
// Transaction Type Config
// ============================================================

export const TRANSACTION_TYPE_CONFIG: Record<TransactionType, {
  label: string
  color: string
  bgColor: string
  gradient: string
  icon: LucideIcon
}> = {
  income: {
    label: 'Ingreso',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-500/10',
    gradient: 'from-emerald-400 to-emerald-600',
    icon: TrendingUp,
  },
  expense: {
    label: 'Gasto',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-500/10',
    gradient: 'from-red-400 to-red-600',
    icon: TrendingDown,
  },
  adjustment: {
    label: 'Ajuste',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-500/10',
    gradient: 'from-amber-400 to-amber-600',
    icon: Scale,
  },
}

// ============================================================
// Transaction Status Config
// ============================================================

export const TRANSACTION_STATUS_CONFIG: Record<TransactionStatus, {
  label: string
  variant: 'success' | 'warning' | 'danger'
  icon: LucideIcon
}> = {
  completed: { label: 'Completada', variant: 'success', icon: CheckCircle2 },
  pending: { label: 'Pendiente', variant: 'warning', icon: Clock },
  cancelled: { label: 'Cancelada', variant: 'danger', icon: XCircle },
}

// ============================================================
// Recurring Frequency Config
// ============================================================

export const RECURRING_FREQUENCY_CONFIG: Record<RecurringFrequency, {
  label: string
  icon: LucideIcon
}> = {
  daily: { label: 'Diario', icon: Repeat },
  weekly: { label: 'Semanal', icon: Repeat },
  monthly: { label: 'Mensual', icon: Repeat },
  yearly: { label: 'Anual', icon: Repeat },
}
```

---

## 8. Componentes Compartidos

### 8.1 TransactionTypeBadge

Badge visual del tipo de transaccion (income/expense/adjustment).

```typescript
// src/features/transactions/components/TransactionTypeBadge.tsx
// Props: type: TransactionType | string, showLabel?: boolean
// Usa TRANSACTION_TYPE_CONFIG para icono + color + label
// Mismo patron que CategoryTypeBadge / AccountTypeBadge
```

### 8.2 TransactionStatusBadge

Badge de estado (completed/pending/cancelled).

```typescript
// src/features/transactions/components/TransactionStatusBadge.tsx
// Props: status: TransactionStatus | string
// Usa TRANSACTION_STATUS_CONFIG para variant + label
// Mismo patron que AccountStatusBadge
```

### 8.3 TransactionCard

Tarjeta de transaccion para lista mobile-first. Disenio responsive: en mobile se ve como card, en desktop se usa TransactionTable.

```typescript
// src/features/transactions/components/TransactionCard.tsx
// Props: transaction: TransactionListItem, onClick?: () => void

// Layout:
// - Glass card bg-white/80 backdrop-blur-xl
// - Gradient left border segun tipo (income=green, expense=red, adjustment=amber)
// - Fila 1: TransactionTypeBadge + monto (formateado, bold) + TransactionStatusBadge
// - Fila 2: descripcion (truncada a 1 linea)
// - Fila 3 (opcional): categoria + cuenta (nombres, no IDs) — puede requerir lookup
// - Fila 4: fecha efectiva + tags chips
// - Click → navega a /transactions/:id
```

### 8.4 TransactionTable

Tabla de transacciones para desktop con sort por columnas.

```typescript
// src/features/transactions/components/TransactionTable.tsx
// Props: transactions: TransactionListItem[], onSort?: (field: string) => void, sortBy?: string, sortOrder?: string

// Columnas:
// - Tipo (icono + color)
// - Descripcion
// - Categoria (CategoryBadge)
// - Cuenta
// - Monto (con formato de moneda, color segun tipo)
// - Fecha
// - Tags (chips)
// - Estado (TransactionStatusBadge)
// - Acciones (ver, editar, eliminar)

// Cada fila: TransactionRow component con hover effect
// Header de tabla clickeable para sort
// Responsive: en mobile ocultar columnas menos esenciales
```

### 8.5 TransactionFilters

Barra de filtros avanzados collapsible.

```typescript
// src/features/transactions/components/TransactionFilters.tsx
// Props: filters: TransactionFilters, onChange: (filters: TransactionFilters) => void, onClear: () => void

// Filtros disponibles:
// - Search input (descripcion) con debounce 300ms
// - Tipo: select/dropdown (todos, income, expense, adjustment)
// - Estado: select (todos, completed, pending, cancelled)
// - Categoria: CategoryPicker (reutilizar de features/categories)
// - Cuenta: AccountPicker (crear select de cuentas)
// - Rango de fechas: dos date inputs (date_from, date_to)
// - Rango de montos: dos number inputs (min_amount, max_amount)
// - Origen: select (todos, manual, import, recurring, transfer)

// Layout:
// - Boton "Filtros" con icono Filter + active count badge
// - Panel expandible con grid de filtros (2 columnas en desktop, 1 en mobile)
// - Boton "Limpiar Filtros" que resetea todos
// - Los filtros se persisten en URL search params
```

### 8.6 TransactionForm

Formulario compartido para crear/editar transaccion.

```typescript
// src/features/transactions/components/TransactionForm.tsx
// Props: defaultValues?: TransactionResponse (para EDIT), onSubmit: (data: CreateTransactionRequest) => void, isLoading?: boolean

// Schema Zod:
const transactionSchema = z.object({
  transaction_type: z.enum(['income', 'expense', 'adjustment']),
  account_id: z.string().min(1, 'La cuenta es requerida'),
  amount: z.string().refine((v) => !isNaN(Number(v)) && Number(v) > 0, 'Monto debe ser > 0'),
  currency_code: z.string().length(3).default('DOP'),
  description: z.string().min(1, 'La descripcion es requerida').max(500),
  effective_date: z.string().min(1, 'La fecha es requerida'),
  category_id: z.string().optional().or(z.literal('')),
  subcategory_id: z.string().optional().or(z.literal('')),
  status: z.string().default('completed'),
  notes: z.string().max(1000).optional().or(z.literal('')),
  tags: z.array(z.string()).optional(),
})

// Campos:
// - Type Selector visual: 3 opciones (income/expense/adjustment) en grid 1x3 con iconos
// - AccountPicker (selector de cuenta) — dropdown con todas las cuentas del usuario
// - CurrencySelector (mismo que AccountCreatePage)
// - Monto: input numerico
// - Descripcion: textarea
// - Fecha efectiva: date input (default hoy)
// - CategoryPicker: jerarquico (reutilizar de features/categories)
// - Estado: select (completed/pending/cancelled)
// - Notas: textarea opcional
// - Tags: TagInput component

// Comportamiento:
// - En CREATE mode: mostrar type selector siempre
// - En EDIT mode: type NO se puede cambiar (readonly)
// - Al seleccionar categoria, filtrar subcategorias disponibles
// - Al cambiar de tipo, resetear categoria seleccionada
// - Convertir amount de string a number en submit
```

### 8.7 TransferForm

Formulario de transferencia entre cuentas.

```typescript
// src/features/transactions/components/TransferForm.tsx
// Schema Zod:
const transferSchema = z.object({
  source_account_id: z.string().min(1, 'Cuenta origen requerida'),
  destination_account_id: z.string().min(1, 'Cuenta destino requerida'),
  amount: z.string().refine((v) => !isNaN(Number(v)) && Number(v) > 0, 'Monto debe ser > 0'),
  currency_code: z.string().length(3).default('DOP'),
  description: z.string().min(1, 'La descripcion es requerida').max(500),
  effective_date: z.string().min(1, 'La fecha es requerida'),
  notes: z.string().max(1000).optional().or(z.literal('')),
})

// Campos:
// - Source AccountPicker
// - Destination AccountPicker (no permitir misma cuenta que source)
// - CurrencySelector
// - Monto
// - Descripcion
// - Fecha efectiva
// - Notas (opcional)

// Layout:
// - Icono grande de ArrowLeftRight entre origen y destino
// - Animacion de intercambio (swap) si se hace click en boton de intercambio
// - Preview: "Transferir $X de [Origen] a [Destino]"
```

### 8.8 TagInput

Input de etiquetas con autocomplete + chips.

```typescript
// src/features/transactions/components/TagInput.tsx
// Props: value: string[], onChange: (tags: string[]) => void, suggestions?: string[], placeholder?: string

// Comportamiento:
// - Escribir y Enter/Tab para agregar tag
// - Backspace elimina ultimo tag
// - Autocomplete de tags existentes (suggestions prop)
// - Tags se muestran como chips con boton X
// - Limit: max 20 tags (configurable)
// - Validacion: solo alfanumerico + guiones, sin espacios
```

### 8.9 AttachmentUploader

Dropzone para subir archivos.

```typescript
// src/features/transactions/components/AttachmentUploader.tsx
// Props: transactionId: string, onUploadComplete?: () => void

// Comportamiento:
// - Drag & drop zone con icono de upload
// - Click para seleccionar archivo
// - Preview de nombre + tamano antes de subir
// - Barra de progreso durante upload (opcional)
// - Soporte para: PDF, JPG, PNG, XLS, DOC (max 10MB)
// - Usar useUploadAttachment mutation
```

### 8.10 AttachmentList

Lista de archivos adjuntos con acciones.

```typescript
// src/features/transactions/components/AttachmentList.tsx
// Props: attachments: AttachmentInfo[], transactionId: string, onDelete?: () => void

// Layout:
// - Cada attachment: icono de tipo de archivo + nombre + tamano + fecha + boton eliminar
// - Icono segun mime_type: PDF, Image, Document, etc.
// - Boton de descarga (si hay URL de descarga)
// - Modal de confirmacion antes de eliminar
```

### 8.11 AuditLogViewer

Timeline de cambios de la transaccion.

```typescript
// src/features/transactions/components/AuditLogViewer.tsx
// Props: transactionId: string

// Layout:
// - Timeline vertical estilo git log
// - Cada entrada:
//   - Punto en la linea del tiempo
//   - Accion: "Creada", "Actualizada", "Eliminada", etc.
//   - Cambios especificos: "Monto: 1000 → 1500", "Categoria: Comida → Transporte"
//   - Fecha relativa: "Hace 2 horas"
//   - IP + User Agent (tooltip)
// - Usar useAuditLog hook
```

### 8.12 InfiniteScrollContainer

Wrapper de IntersectionObserver para scroll infinito.

```typescript
// src/features/transactions/components/InfiniteScrollContainer.tsx
// Props: onLoadMore: () => void, hasMore: boolean, isLoading: boolean, children: ReactNode

// Comportamiento:
// - Renderiza un div "centinela" al final
// - Usa IntersectionObserver para detectar cuando el centinela es visible
// - Cuando es visible y hasMore=true, llama onLoadMore
// - Muestra spinner al final mientras carga siguiente pagina
// - Mensaje "No hay mas transacciones" cuando hasMore=false
```

### 8.13 TransactionQuickActions

Acciones rapidas contextuales para una transaccion.

```typescript
// src/features/transactions/components/TransactionQuickActions.tsx
// Props: transaction: TransactionResponse, onAction: (action: string) => void

// Acciones:
// - Duplicar: crea copia con fecha = hoy, navega a edicion
// - Convertir a recurrente: abre modal/create page con datos precargados
// - Ver cuenta vinculada: navega a /accounts/:account_id
// - Ver categoria: navega a /categories/:category_id
```

### 8.14 DeleteTransactionModal

Modal de confirmacion para eliminar transaccion.

```typescript
// src/features/transactions/components/DeleteTransactionModal.tsx
// Mismo patron que DeleteAccountModal / DeleteCategoryModal
// Mensaje: "Esta accion eliminara permanentemente la transaccion [descripcion]"
// Boton confirmar: variant="danger"
// Si tiene attachments: advertencia "Tiene X archivos adjuntos que se eliminaran"
```

---

## 9. Pages (Layouts y Comportamiento)

### 9.1 TransactionListPage

**Ruta:** `/transactions`

**Layout:**
- Background decorations (orbs con colores de transaction types)
- Header: titulo "Transacciones" + boton "Nueva Transaccion" (navega a `/transactions/new`)
- TransactionSummaryWidget en la parte superior (resumen del periodo actual)
- TransactionFilters collapsible
- Vista: tabs "Lista" / "Recurrentes" (navega a `/transactions/recurring`)
- Vista actual: Infinite scroll o paginacion

**Comportamiento:**
- UseInfiniteQuery para carga progresiva
- Filtros sincronizados con URL search params (useSearchParams)
- Clear filters button cuando hay filtros activos
- Pagina 1 se carga al montar, siguiente pagina al hacer scroll
- Total count se muestra en header: "X transacciones"

**Estados:**
- Loading: Skeleton de TransactionCard x 5
- Empty (sin filtros): EmptyTransactionState (icono ArrowLeftRight + "No hay transacciones" + CTA)
- Empty (con filtros): "No se encontraron transacciones con esos filtros"
- Error: ErrorMessage con retry

**Filtros via URL:**
```
?type=expense&status=completed&category_id=xxx&date_from=2025-01-01&date_to=2025-12-31&search=netflix&page=1
```

### 9.2 TransactionCreatePage

**Ruta:** `/transactions/new`

**Layout (mismo estilo glass que AccountCreatePage):**
- Background decorations
- Header con ArrowLeft + titulo "Nueva Transaccion"
- Tabs o radio: "Transaccion" | "Transferencia"
  - "Transaccion" → muestra TransactionForm
  - "Transferencia" → muestra TransferForm
- Glass card con el formulario seleccionado

**Comportamiento:**
- Tab "Transferencia" solo visible si hay al menos 2 cuentas del usuario
- En "Transaccion":
  - TransactionForm con useCreateTransaction()
  - On success: navigate(`/transactions/${id}`) + toast
- En "Transferencia":
  - TransferForm con useCreateTransfer()
  - On success: navigate(`/transactions/${transferId}`) + toast

**Query params:**
- `?type=expense` — preseleccionar tipo
- `?account=xxx` — preseleccionar cuenta
- `?category=xxx` — preseleccionar categoria

### 9.3 TransactionDetailPage

**Ruta:** `/transactions/:id`

**Layout:**
- Background decorations
- Header: TransactionTypeBadge + descripcion + monto grande (formateado) + TransactionStatusBadge
- Botones: Editar, Duplicar, Eliminar

**Secciones (glass cards):**
1. **Informacion General:**
   - Tipo (con icono + color)
   - Monto (bold, grande)
   - Moneda
   - Descripcion
   - Notas
   - Fecha efectiva
   - Estado (badge)
   - Origen (source)
   - Transfer ID (si aplica, link a la transferencia contraria)
   - AI metadata (si existe): categoria AI, confianza, modelo, razon

2. **Categoria:**
   - Usar CategoryBadge (reutilizar de features/categories)
   - Mostrar categoria + subcategoria si existen

3. **Cuenta:**
   - Nombre de cuenta con link a /accounts/:id
   - Balance de la cuenta (opcional)

4. **Etiquetas (Tags):**
   - TagInput para agregar nuevas
   - Lista de tags como chips con boton X
   - Usar useAddTags / useRemoveTag

5. **Archivos Adjuntos (Attachments):**
   - AttachmentUploader (drag & drop)
   - AttachmentList con attachments existentes

6. **Audit Log:**
   - Seccion colapsable "Historial de Cambios"
   - AuditLogViewer con timeline

**Comportamiento:**
- useTransaction(id) para carga
- Editar → navigate(`/transactions/${id}/edit`)
- Duplicar → navigate(`/transactions/new`) con datos precargados via state/ls
- Eliminar → DeleteTransactionModal → navigate(`/transactions`) on success

### 9.4 TransactionEditPage

**Ruta:** `/transactions/:id/edit`

**Layout:**
- Header con ArrowLeft + titulo "Editar Transaccion"
- Glass card con TransactionForm precargado (defaultValues del GET detail)
- NO se puede cambiar transaction_type (readonly)
- Boton "Guardar Cambios"

**Comportamiento:**
- useTransaction(id) + useUpdateTransaction()
- On success: navigate(`/transactions/${id}`) + toast
- Formulario valida con mismo schema que create
- Cancelar: navigate back

### 9.5 RecurringListPage

**Ruta:** `/transactions/recurring`

**Layout:**
- Header: titulo "Transacciones Recurrentes" + boton "Nuevo Patron" (navega a `/transactions/recurring/new`) + boton "Procesar Ahora"
- Filtro: mostrar solo activos / todos (toggle)
- Grid de RecurringCards

**Comportamiento:**
- useRecurringList() con filtro is_active
- Boton "Procesar Ahora" → useProcessRecurring() → toast con resultado
- Cada RecurringCard:
  - Nombre + monto + frecuencia
  - Proxima ejecucion
  - Veces ejecutado / maximo
  - Badge activo/inactivo
  - Botones Editar/Eliminar

**Estados:**
- Loading: Skeleton grid
- Empty: EmptyState con icono Repeat + "No hay patrones recurrentes"
- Error: ErrorMessage

### 9.6 RecurringCreatePage

**Ruta:** `/transactions/recurring/new`

**Layout:**
- Header con ArrowLeft + titulo "Nuevo Patron Recurrente"
- Glass card con RecurringForm

**RecurringForm fields:**
- AccountPicker
- Type selector (income/expense) — visual grid
- CurrencySelector
- Monto
- Descripcion
- Frecuencia: selector (daily/weekly/monthly/yearly) con iconos
- Intervalo: number input (default 1)
- Fecha inicio: date input
- Fecha fin: date input (opcional)
- Max ejecuciones: number input (opcional)
- CategoryPicker
- Notas (opcional)

**Comportamiento:**
- useCreateRecurring()
- On success: navigate(`/transactions/recurring`) + toast

### 9.7 RecurringDetailPage

**Ruta:** `/transactions/recurring/:id`

**Layout:**
- Header: nombre + Badge activo/inactivo + botones Editar/Eliminar
- Secciones:
  - Informacion del patron (mismos campos que create)
  - Proxima ejecucion
  - Historial de ejecuciones (veces ejecutado / maximo)
  - Boton "Desactivar" / "Activar" (toggle is_active)
- Modo edicion: expande RecurringForm precargado

---

## 10. Actualizacion de Routing

### lazy.ts

Agregar a `src/routes/lazy.ts`:

```typescript
// Transactions
export const TransactionListPage = lazy(() => import('@/features/transactions/pages/TransactionListPage'))
export const TransactionCreatePage = lazy(() => import('@/features/transactions/pages/TransactionCreatePage'))
export const TransactionDetailPage = lazy(() => import('@/features/transactions/pages/TransactionDetailPage'))
export const TransactionEditPage = lazy(() => import('@/features/transactions/pages/TransactionEditPage'))

// Recurring
export const RecurringListPage = lazy(() => import('@/features/transactions/pages/RecurringListPage'))
export const RecurringCreatePage = lazy(() => import('@/features/transactions/pages/RecurringCreatePage'))
export const RecurringDetailPage = lazy(() => import('@/features/transactions/pages/RecurringDetailPage'))
```

### routes/index.tsx

Reemplazar las rutas Placeholder de transactions:

```typescript
// En el import:
import {
  // ... existing
  TransactionListPage, TransactionCreatePage, TransactionDetailPage, TransactionEditPage,
  RecurringListPage, RecurringCreatePage, RecurringDetailPage,
} from './lazy'

// Reemplazar las rutas placeholder de /transactions:
// Transactions
{
  path: '/transactions',
  element: (
    <SuspenseWrapper>
      <TransactionListPage />
    </SuspenseWrapper>
  ),
},
{
  path: '/transactions/new',
  element: (
    <SuspenseWrapper>
      <TransactionCreatePage />
    </SuspenseWrapper>
  ),
},
{
  path: '/transactions/:id',
  element: (
    <SuspenseWrapper>
      <TransactionDetailPage />
    </SuspenseWrapper>
  ),
},
{
  path: '/transactions/:id/edit',
  element: (
    <SuspenseWrapper>
      <TransactionEditPage />
    </SuspenseWrapper>
  ),
},
// Recurring
{
  path: '/transactions/recurring',
  element: (
    <SuspenseWrapper>
      <RecurringListPage />
    </SuspenseWrapper>
  ),
},
{
  path: '/transactions/recurring/new',
  element: (
    <SuspenseWrapper>
      <RecurringCreatePage />
    </SuspenseWrapper>
  ),
},
{
  path: '/transactions/recurring/:id',
  element: (
    <SuspenseWrapper>
      <RecurringDetailPage />
    </SuspenseWrapper>
  ),
},
```

**NOTA:** Las rutas `/incomes/*` y `/expenses/*` pueden quedarse como Placeholder o redirigir a `/transactions?type=income` y `/transactions?type=expense` respectivamente.

---

## 11. Actualizacion de Sidebar

Verificar `components/layout/Sidebar.tsx`. Ya existe la entrada "Transacciones" en la seccion Finanzas:

```typescript
{ name: 'Transacciones', href: '/transactions', icon: ArrowLeftRight },
```

No necesita cambios. Pero opcionalmente se puede agregar una subseccion o enlaces rapidos en "Ingresos y Gastos":

```typescript
// Opcional: cambiar ingreso/gasto para redirigir a transactions filtrados
{ name: 'Ingresos', href: '/transactions?type=income', icon: TrendingUp },
{ name: 'Gastos', href: '/transactions?type=expense', icon: TrendingDown },
```

---

## 12. Estrategias y Mejores Practicas

### 12.1 Infinite Scroll vs Paginacion

Usar `useInfiniteQuery` de TanStack Query para el listado principal. El backend soporta paginacion tradicional (page/page_size), asi que el frontend implementa infinite scroll como UX primaria:

```typescript
function useTransactionInfinite(filters: TransactionFilters) {
  return useInfiniteQuery({
    queryKey: ['transactions', 'infinite', filters],
    queryFn: ({ pageParam = 1 }) =>
      api.get('/transactions', { params: { ...filters, page: pageParam, page_size: 20 } })
        .then(r => r.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  })
}

// En el componente:
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useTransactionInfinite(filters)
const transactions = data?.pages.flatMap(p => p.transactions) ?? []
```

### 12.2 Filtros en URL

Persistir filtros en URL search params para que sean compartibles y sobrevivan refrescos:

```typescript
const [searchParams, setSearchParams] = useSearchParams()

const filters: TransactionFilters = {
  transaction_type: searchParams.get('type') || undefined,
  status: searchParams.get('status') || undefined,
  search: searchParams.get('search') || undefined,
  date_from: searchParams.get('date_from') || undefined,
  date_to: searchParams.get('date_to') || undefined,
  page: Number(searchParams.get('page')) || 1,
}

const updateFilter = (key: string, value: string | undefined) => {
  setSearchParams((prev) => {
    if (value) prev.set(key, value)
    else prev.delete(key)
    if (key !== 'page') prev.delete('page') // reset page on filter change
    return prev
  })
}

const clearFilters = () => setSearchParams({})
```

### 12.3 Cache Invalidation Strategy

```typescript
// Despues de crear/eliminar transaccion:
queryClient.invalidateQueries({ queryKey: ['transactions'] }) // todas las listas
queryClient.invalidateQueries({ queryKey: ['transactions', 'summary'] }) // resumenes
queryClient.invalidateQueries({ queryKey: ['accounts'] }) // balances de cuentas cambian

// Despues de editar transaccion:
queryClient.invalidateQueries({ queryKey: ['transactions'] }) // listas
queryClient.invalidateQueries({ queryKey: ['transactions', 'detail', id] }) // detalle especifico

// Despues de tags operations:
queryClient.invalidateQueries({ queryKey: ['transactions', 'detail', transactionId] })

// Despues de attachments:
queryClient.invalidateQueries({ queryKey: ['transactions', 'detail', transactionId] })

// Despues de crear transferencia:
queryClient.invalidateQueries({ queryKey: ['transactions'] })
queryClient.invalidateQueries({ queryKey: ['transactions', 'summary'] })
queryClient.invalidateQueries({ queryKey: ['accounts'] }) // ambas cuentas cambian balance

// Despues de procesar recurrentes:
queryClient.invalidateQueries({ queryKey: ['transactions'] })
queryClient.invalidateQueries({ queryKey: ['recurring'] })
```

### 12.4 Optimistic Updates para Tags

Agregar/remover tags puede ser optimista para mejor UX:

```typescript
useMutation({
  mutationFn: ({ transactionId, data }) => addTags(transactionId, data),
  onMutate: async ({ transactionId, data }) => {
    await queryClient.cancelQueries({ queryKey: ['transactions', 'detail', transactionId] })
    const previous = queryClient.getQueryData(['transactions', 'detail', transactionId])
    queryClient.setQueryData(['transactions', 'detail', transactionId], (old: any) => ({
      ...old,
      tags: [...new Set([...old.tags, ...data.tags])],
    }))
    return { previous }
  },
  onError: (_err, vars, context) => {
    queryClient.setQueryData(['transactions', 'detail', vars.transactionId], context?.previous)
    toast.error('Error al agregar etiquetas')
  },
  onSettled: (_data, _err, vars) => {
    queryClient.invalidateQueries({ queryKey: ['transactions', 'detail', vars.transactionId] })
  },
})
```

### 12.5 Formateo de Montos

Los montos vienen del backend como strings ("0.0000"). Usar siempre:

```typescript
formatCurrency(parseFloat(transaction.amount), transaction.currency_code)
```

Y para colores segun tipo:
```typescript
const amountColor = transaction.transaction_type === 'income'
  ? 'text-emerald-600 dark:text-emerald-400'
  : transaction.transaction_type === 'expense'
  ? 'text-red-600 dark:text-red-400'
  : 'text-amber-600 dark:text-amber-400'
```

### 12.6 Diseño de Summary Widget

El TransactionSummaryWidget debe mostrar:
- Periodo seleccionado (mes actual por defecto)
- Selector de periodo: Este Mes, Mes Pasado, Este Ano, Personalizado
- Cards con:
  - Total Ingresos (verde)
  - Total Gastos (rojo)
  - Flujo Neto (verde si positivo, rojo si negativo)
  - Cantidad de transacciones por tipo
- Cada card con icono + monto grande + label

```typescript
// Store de periodo seleccionado en URL:
// ?period=this_month | last_month | this_year | custom&date_from=...&date_to=...
// O usar useState + useEffect para calcular fechas
```

### 12.7 Manejo de Categoria en Forms

Para el selector de categoria en TransactionForm y TransferForm:

```typescript
// Reutilizar CategoryPicker de features/categories
import CategoryPicker from '@/features/categories/components/CategoryPicker'

<CategoryPicker
  value={categoryId}
  onChange={setCategoryId}
  filterType={transactionType === 'income' ? 'income' : 'expense'}
  placeholder="Seleccionar categoria..."
/>
```

### 12.8 Manejo de Cuenta en Forms

Para el selector de cuenta, crear o reutilizar AccountPicker:

```typescript
// src/features/accounts/components/AccountPicker.tsx (si no existe, crearlo)
interface AccountPickerProps {
  value: string
  onChange: (accountId: string) => void
  filterByType?: AccountType[]
  placeholder?: string
  className?: string
}
```

Este componente debe listar cuentas del usuario con nombre + tipo + balance + moneda.

### 12.9 Estrategia para Transferencias

Al crear una transferencia:
- El backend crea 2 transacciones: una de egreso (source) y una de ingreso (destination)
- El frontend recibe un `transfer_id` que agrupa ambas
- En el detalle de una transaccion que es parte de una transferencia, mostrar link a la otra transaccion
- No permitir eliminar individualmente una transaccion de transferencia (mostrar mensaje: "Elimine la transferencia completa desde la pagina de transferencias")

### 12.10 Procesamiento de Recurrentes

El boton "Procesar Ahora" en RecurringListPage:
- Llama `POST /transactions/recurring/process`
- El backend evalua todos los patrones activos, crea transacciones para los vencidos
- Frontend muestra resultado: "X transacciones creadas de Y procesadas"
- Si hay errores, mostrar lista de errores en modal expandible

No implementar scheduler en frontend — el backend se encarga (o se configura cron externo).

### 12.11 OCR Notice

El endpoint OCR es un stub. En la UI:
- No mostrar entrada de navegacion para OCR
- Si aparece en algun contexto, mostrar badge "Proximamente en Fase 20"
- No implementar UI de OCR

### 12.12 Performance y Virtualizacion

Para listas de transacciones largas:
- Usar virtualizacion si hay > 200 transacciones visibles (react-window o @tanstack/react-virtual)
- Transacciones tipicas: 50-200 por mes, mantener infinite scroll simple
- Si el usuario tiene miles, considerar agrupacion por mes (accordion)

### 12.13 Orden de Implementacion Sugerido

1. `types/transactions.ts` — todos los tipos
2. `features/transactions/constants.ts` — config de tipos, estados, frecuencias
3. `features/transactions/api/transactions.ts` — API CRUD
4. `features/transactions/hooks/useTransactions.ts` — hooks base
5. `components/TransactionTypeBadge.tsx` + `TransactionStatusBadge.tsx`
6. `components/TransactionCard.tsx` + `TransactionTable.tsx` + `TransactionRow.tsx`
7. `components/TransactionFilters.tsx` — barra de filtros
8. `features/transactions/api/transfers.ts` + `hooks/useTransfers.ts`
9. `components/TransactionForm.tsx` — formulario transaccion
10. `components/TransferForm.tsx` — formulario transferencia
11. `components/DeleteTransactionModal.tsx`
12. `components/TagInput.tsx` + `AttachmentUploader.tsx` + `AttachmentList.tsx`
13. `components/AuditLogViewer.tsx`
14. `components/InfiniteScrollContainer.tsx`
15. `components/TransactionSummaryWidget.tsx`
16. `components/TransactionQuickActions.tsx`
17. `pages/TransactionListPage.tsx` — pagina principal
18. `pages/TransactionCreatePage.tsx` — crear transaccion/transferencia
19. `pages/TransactionDetailPage.tsx` — detalle completo
20. `pages/TransactionEditPage.tsx` — editar
21. `features/transactions/api/recurring.ts` + `hooks/useRecurring.ts`
22. `components/RecurringForm.tsx` + `RecurringCard.tsx` + `RecurringList.tsx`
23. `pages/RecurringListPage.tsx`
24. `pages/RecurringCreatePage.tsx`
25. `pages/RecurringDetailPage.tsx`
26. Routing updates (lazy.ts + index.tsx)
27. Verificacion final

---

## 13. Verificacion Final

```bash
# TypeScript check
pnpm tsc --noEmit

# Lint
pnpm lint

# Build
pnpm build
```

### Checklist Final

**General:**
- [ ] `tsc --noEmit` sin errores
- [ ] `pnpm lint` sin errores
- [ ] `pnpm build` exitoso
- [ ] Dark mode funciona en todas las paginas
- [ ] Responsive funciona en mobile
- [ ] Loading states con skeletons
- [ ] Empty states con icono + mensaje + CTA
- [ ] Error states con retry button
- [ ] Toasts de success/error en cada mutation
- [ ] Animaciones fade-in escalonadas

**Transaction List:**
- [ ] Infinite scroll carga mas transacciones al scrollear
- [ ] Filtros avanzados funcionan (tipo, estado, categoria, cuenta, fechas, montos, busqueda)
- [ ] Filtros se persisten en URL search params
- [ ] Clear filters resetea todo
- [ ] Total count se muestra correctamente
- [ ] Transacciones se muestran como cards (mobile) o tabla (desktop)
- [ ] Sort por columnas en tabla desktop
- [ ] TransactionSummaryWidget con periodo seleccionable
- [ ] Colores segun tipo: income=verde, expense=rojo, adjustment=ambar

**Transaction Create/Edit:**
- [ ] Tipo selector visual (income/expense/adjustment) funciona
- [ ] AccountPicker selecciona cuenta
- [ ] CategoryPicker funciona y filtra por tipo
- [ ] Monto validado (> 0)
- [ ] Fecha default a hoy
- [ ] TagInput agrega/remueve tags
- [ ] En EDIT mode, type no se puede cambiar
- [ ] TransferForm con source/destination account
- [ ] TransferForm no permite misma cuenta en origen y destino

**Transaction Detail:**
- [ ] Informacion completa visible
- [ ] Tags: agregar/remover con optimistic update
- [ ] Attachments: upload (drag & drop), listar, eliminar
- [ ] Audit log: timeline de cambios
- [ ] AI metadata visible (si existe)
- [ ] Quick actions: duplicar, convertir a recurrente
- [ ] Link a cuenta vinculada funciona
- [ ] Eliminar con confirmacion funciona

**Recurring:**
- [ ] Lista de patrones recurrentes con filtro activo/inactivo
- [ ] Crear patron con todos los campos
- [ ] Editar patron
- [ ] Eliminar patron con confirmacion
- [ ] "Procesar Ahora" crea transacciones y muestra resultado
- [ ] Badge activo/inactivo con toggle
- [ ] Proxima ejecucion visible

**Routing:**
- [ ] `/transactions` — lista con infinite scroll
- [ ] `/transactions/new` — crear (tabs transaccion/transferencia)
- [ ] `/transactions/:id` — detalle
- [ ] `/transactions/:id/edit` — editar
- [ ] `/transactions/recurring` — lista recurrentes
- [ ] `/transactions/recurring/new` — crear patron
- [ ] `/transactions/recurring/:id` — detalle patron
- [ ] Lazy loading funciona para todas las rutas nuevas
- [ ] Redireccion desde `/incomes` a `/transactions?type=income` (opcional)

**Integracion con Fases Anteriores:**
- [ ] CategoryPicker funciona dentro de TransactionForm
- [ ] AccountPicker funciona (o se crea como componente reutilizable)
- [ ] Los balances de cuentas se actualizan al crear/eliminar transacciones
- [ ] Category transaction_count se actualiza (backend handlea esto)
