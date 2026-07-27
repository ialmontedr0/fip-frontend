# Fase 15: Imports & Exports — Guia de Implementacion

## Arquitectura General

### Resumen
Sistema completo de importación (CSV/Excel vía wizard multi-paso) y exportación (CSV/Excel/PDF/.ics con filtros) de datos financieros. El frontend se comunica con 4 endpoints de importación y 7 de exportación del backend.

### Flujo de datos
```
IMPORT WIZARD
  Step 1: DropZone — upload CSV/Excel file
    ↳ POST /imports/transactions (multipart) → ImportPreviewResponse
    ↳ Muestra: preview_rows (10), validation_errors[], columns_found[], duplicates_found
  Step 2: PreviewStep — tabla de preview con errores resaltados
    ↳ Si hay errores de columna → auto-redirect a ColumnMappingStep
    ↳ Muestra validación por fila + duplicados encontrados
  Step 3: ColumnMappingStep (opcional) — arrastrar columnas para mapear
    ↳ Sólo si mapping automático falla o usuario quiere cambiar
  Step 4: ConfirmStep — resumen + botón confirmar
    ↳ POST /imports/confirm { job_id } → ImportConfirmResponse
    ↳ Muestra: total, válidas, errores

IMPORT HISTORY
  ↳ GET /imports/jobs?skip=0&limit=20 → { jobs[], total }
  ↳ GET /imports/jobs/{job_id} → ImportJobResponse (detalle + errores)

EXPORT
  ↳ GET /exports/transactions/csv|excel|pdf?filtros → StreamingResponse (download)
  ↳ GET /exports/budgets/pdf?month=&year= → StreamingResponse
  ↳ GET /exports/goals/pdf?status= → StreamingResponse
  ↳ GET /exports/calendar/recurring → StreamingResponse (.ics)
  ↳ GET /exports/calendar/goals → StreamingResponse (.ics)
```

### Endpoints Backend (11 total)

#### Imports (4 endpoints)

| Método | Ruta | Descripción | Request | Response |
|--------|------|-------------|---------|----------|
| `POST` | `/imports/transactions` | Upload CSV/Excel | `multipart: file` (max 10MB, .csv/.xlsx/.xls) | `ImportPreviewResponse` |
| `POST` | `/imports/confirm` | Confirmar importación | `{ job_id: UUID }` | `ImportConfirmResponse` |
| `GET` | `/imports/jobs?skip=&limit=` | Listar jobs | Query params | `ImportJobListResponse` |
| `GET` | `/imports/jobs/{job_id}` | Detalle de job | Path param | `ImportJobResponse` |

#### Exports (7 endpoints)

| Método | Ruta | Descripción | Query Params | Content-Type |
|--------|------|-------------|-------------|-------------|
| `GET` | `/exports/transactions/csv` | Export CSV | `date_from`, `date_to`, `category`, `transaction_type`, `account_id` | `text/csv` |
| `GET` | `/exports/transactions/excel` | Export Excel | mismos | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` |
| `GET` | `/exports/transactions/pdf` | Export PDF | mismos | `application/pdf` |
| `GET` | `/exports/budgets/pdf` | Budgets PDF | `month`, `year` | `application/pdf` |
| `GET` | `/exports/goals/pdf` | Goals PDF | `status` | `application/pdf` |
| `GET` | `/exports/calendar/recurring` | Recurring .ics | — | `text/calendar` |
| `GET` | `/exports/calendar/goals` | Goals .ics | — | `text/calendar` |

### Schemas Backend Completos

#### ImportPreviewResponse
```typescript
interface ImportPreviewResponse {
  job_id: string
  file_name: string
  file_type: string        // 'csv' | 'xlsx'
  total_rows: number
  columns_found: string[]
  preview_rows: Record<string, unknown>[]   // primeras 10 filas
  validation_errors: Array<{
    row: number
    field: string
    message: string
  }>
  duplicates_found: number
}
```

#### ImportConfirmRequest / ImportConfirmResponse
```typescript
interface ImportConfirmRequest {
  job_id: string
}

interface ImportConfirmResponse {
  success: boolean
  job_id: string
  total_rows: number
  valid_rows: number
  error_rows: number
  errors: Array<Record<string, unknown>> | null
}
```

#### ImportJobResponse / ImportJobListResponse
```typescript
interface ImportJobResponse {
  id: string
  file_name: string
  file_type: string
  import_type: string      // 'transactions'
  status: string           // 'pending' | 'processing' | 'completed' | 'failed'
  total_rows: number
  processed_rows: number
  valid_rows: number
  error_rows: number
  created_at: string
  completed_at: string | null
}

interface ImportJobListResponse {
  jobs: ImportJobResponse[]
  total: number
}
```

---

## 1. Tipos TypeScript

### `src/types/imports.ts`

```typescript
// ============================================================
// IMPORT TYPES
// ============================================================

export type ImportJobStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface ImportPreviewResponse {
  job_id: string
  file_name: string
  file_type: string
  total_rows: number
  columns_found: string[]
  preview_rows: Record<string, unknown>[]
  validation_errors: ImportValidationError[]
  duplicates_found: number
}

export interface ImportValidationError {
  row: number
  field: string
  message: string
}

export interface ImportConfirmRequest {
  job_id: string
}

export interface ImportConfirmResponse {
  success: boolean
  job_id: string
  total_rows: number
  valid_rows: number
  error_rows: number
  errors: Record<string, unknown>[] | null
}

export interface ImportJobResponse {
  id: string
  file_name: string
  file_type: string
  import_type: string
  status: ImportJobStatus
  total_rows: number
  processed_rows: number
  valid_rows: number
  error_rows: number
  created_at: string
  completed_at: string | null
}

export interface ImportJobListResponse {
  jobs: ImportJobResponse[]
  total: number
}

// ============================================================
// COLUMN MAPPING TYPES
// ============================================================

export interface ColumnMapping {
  sourceColumn: string    // nombre en el archivo
  targetField: string     // nombre del campo en el sistema
}

export const EXPECTED_FIELDS = [
  { value: 'date', label: 'Fecha', required: true },
  { value: 'description', label: 'Descripción', required: true },
  { value: 'amount', label: 'Monto', required: true },
  { value: 'type', label: 'Tipo (income/expense)', required: false },
  { value: 'category', label: 'Categoría', required: false },
  { value: 'account', label: 'Cuenta', required: false },
  { value: 'currency', label: 'Moneda', required: false },
  { value: 'notes', label: 'Notas', required: false },
] as const
```

### `src/types/exports.ts`

```typescript
// ============================================================
// EXPORT TYPES
// ============================================================

export type ExportFormat = 'csv' | 'xlsx' | 'pdf'
export type ExportEntity = 'transactions' | 'budgets' | 'goals'
export type CalendarExportType = 'recurring' | 'goals'

export interface ExportTransactionsFilters {
  date_from?: string
  date_to?: string
  category?: string
  transaction_type?: string
  account_id?: string
}

export interface ExportBudgetFilters {
  month?: number
  year?: number
}

export interface ExportGoalsFilters {
  status?: string
}

export interface ExportFormatOption {
  value: ExportFormat
  label: string
  icon: string       // Lucide icon name
  description: string
  mimeType: string
  extension: string
}

export const EXPORT_FORMAT_OPTIONS: ExportFormatOption[] = [
  {
    value: 'csv', label: 'CSV', icon: 'FileSpreadsheet',
    description: 'Formato compatible con Excel, Google Sheets y la mayoría de herramientas',
    mimeType: 'text/csv', extension: '.csv',
  },
  {
    value: 'xlsx', label: 'Excel', icon: 'FileSpreadsheet',
    description: 'Formato nativo de Excel con estilo profesional',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    extension: '.xlsx',
  },
  {
    value: 'pdf', label: 'PDF', icon: 'FileText',
    description: 'Informe profesional listo para imprimir o compartir',
    mimeType: 'application/pdf', extension: '.pdf',
  },
]

export const EXPORT_FILE_NAMES: Record<string, string> = {
  'transactions_csv': 'transacciones',
  'transactions_xlsx': 'transacciones',
  'transactions_pdf': 'reporte_transacciones',
  'budgets_pdf': 'reporte_presupuestos',
  'goals_pdf': 'reporte_metas',
  'calendar_recurring': 'transacciones_recurrentes',
  'calendar_goals': 'metas_financieras',
}
```

---

## 2. Constantes de Diseño

### `src/features/imports/constants.ts`

```typescript
import type { LucideIcon } from 'lucide-react'
import {
  Upload, FileSpreadsheet, FileText, AlertTriangle, CheckCircle2,
  Clock, XCircle, Loader2, ArrowRight, Columns,
} from 'lucide-react'
import type { ImportJobStatus } from '@/types/imports'

// ============================================================
// FILE UPLOAD
// ============================================================

export const ACCEPTED_FILE_TYPES = {
  'text/csv': ['.csv'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-excel': ['.xls'],
}

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const MAX_FILE_SIZE_LABEL = '10MB'

// ============================================================
// JOB STATUS CONFIG
// ============================================================

export interface JobStatusConfig {
  icon: LucideIcon
  label: string
  color: string
  bgColor: string
}

export const JOB_STATUS_CONFIG: Record<ImportJobStatus, JobStatusConfig> = {
  pending: {
    icon: Clock, label: 'Pendiente', color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-500/10',
  },
  processing: {
    icon: Loader2, label: 'Procesando', color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-500/10',
  },
  completed: {
    icon: CheckCircle2, label: 'Completado', color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-500/10',
  },
  failed: {
    icon: XCircle, label: 'Fallido', color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-500/10',
  },
}

// ============================================================
// WIZARD STEPS
// ============================================================

export const IMPORT_WIZARD_STEPS = [
  { id: 'upload', label: 'Subir archivo', icon: Upload },
  { id: 'preview', label: 'Vista previa', icon: FileSpreadsheet },
  { id: 'mapping', label: 'Mapeo de columnas', icon: Columns, optional: true },
  { id: 'confirm', label: 'Confirmar', icon: CheckCircle2 },
] as const

export type ImportWizardStep = typeof IMPORT_WIZARD_STEPS[number]['id']
```

### `src/features/exports/constants.ts`

```typescript
import type { LucideIcon } from 'lucide-react'
import {
  Download, FileSpreadsheet, FileText, Calendar, Filter, Loader2,
} from 'lucide-react'
import type { ExportFormat, CalendarExportType } from '@/types/exports'

export interface ExportTypeConfig {
  id: string
  label: string
  description: string
  icon: LucideIcon
  formats: ExportFormat[]
  hasCalendar: boolean
  endpoint: string
}

export const EXPORT_TYPES: ExportTypeConfig[] = [
  {
    id: 'transactions', label: 'Transacciones',
    description: 'Exporta tus transacciones en el formato que prefieras',
    icon: FileSpreadsheet, formats: ['csv', 'xlsx', 'pdf'],
    hasCalendar: false, endpoint: '/exports/transactions',
  },
  {
    id: 'budgets', label: 'Presupuestos',
    description: 'Informe de presupuestos en PDF',
    icon: FileText, formats: ['pdf'],
    hasCalendar: false, endpoint: '/exports/budgets',
  },
  {
    id: 'goals', label: 'Metas',
    description: 'Informe de progreso de metas en PDF',
    icon: FileText, formats: ['pdf'],
    hasCalendar: false, endpoint: '/exports/goals',
  },
  {
    id: 'calendar_recurring', label: 'Calendario Recurrentes',
    description: 'Exporta transacciones recurrentes como archivo .ics',
    icon: Calendar, formats: [],
    hasCalendar: true, endpoint: '/exports/calendar/recurring',
  },
  {
    id: 'calendar_goals', label: 'Calendario Metas',
    description: 'Exporta fechas límite de metas como archivo .ics',
    icon: Calendar, formats: [],
    hasCalendar: true, endpoint: '/exports/calendar/goals',
  },
]

export interface ExportProgressState {
  inProgress: boolean
  percentage: number
  fileName: string
}
```

---

## 3. API Layer

### `src/features/imports/api/imports.ts`

```typescript
import api from '@/lib/api'
import type {
  ImportPreviewResponse, ImportConfirmRequest,
  ImportConfirmResponse, ImportJobResponse, ImportJobListResponse,
} from '@/types/imports'

export function uploadImportFile(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return api.post<ImportPreviewResponse>('/imports/transactions', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000,
  })
}

export function confirmImport(data: ImportConfirmRequest) {
  return api.post<ImportConfirmResponse>('/imports/confirm', data)
}

export function listImportJobs(skip = 0, limit = 20) {
  return api.get<ImportJobListResponse>('/imports/jobs', {
    params: { skip, limit },
  })
}

export function getImportJob(jobId: string) {
  return api.get<ImportJobResponse>(`/imports/jobs/${jobId}`)
}
```

### `src/features/exports/api/exports.ts`

```typescript
import api from '@/lib/api'
import type { ExportTransactionsFilters } from '@/types/exports'

function buildExportUrl(
  entity: string,
  format: string,
  filters?: Record<string, unknown>,
): string {
  const params = new URLSearchParams()
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, String(value))
      }
    })
  }
  const qs = params.toString()
  return `/exports/${entity}/${format}${qs ? `?${qs}` : ''}`
}

function triggerDownload(url: string, filename: string) {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function getExportUrl(
  entity: string,
  format: string,
  filters?: Record<string, unknown>,
): string {
  return buildExportUrl(entity, format, filters)
}

export async function downloadExport(
  entity: string,
  format: string,
  filters?: ExportTransactionsFilters,
  onProgress?: (pct: number) => void,
): Promise<void> {
  const url = buildExportUrl(entity, format, filters as Record<string, unknown>)
  onProgress?.(25)
  const response = await api.get(url, { responseType: 'blob' })
  onProgress?.(75)
  const disposition = response.headers['content-disposition']
  let filename = `${entity}.${format}`
  if (disposition) {
    const match = disposition.match(/filename="?(.+?)"?\s*(?:;|$)/)
    if (match) filename = match[1]
  }
  const blobUrl = window.URL.createObjectURL(response.data as Blob)
  triggerDownload(blobUrl, filename)
  onProgress?.(100)
  setTimeout(() => window.URL.revokeObjectURL(blobUrl), 5000)
}
```

---

## 4. TanStack Query Hooks

### `src/features/imports/hooks/useImports.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as importsApi from '../api/imports'
import type { ImportConfirmRequest } from '@/types/imports'

export const importKeys = {
  all: ['imports'] as const,
  jobs: () => [...importKeys.all, 'jobs'] as const,
  jobList: (skip?: number, limit?: number) => [...importKeys.jobs(), { skip, limit }] as const,
  job: (id: string) => [...importKeys.jobs(), id] as const,
}

export function useImportJobs(skip = 0, limit = 20) {
  return useQuery({
    queryKey: importKeys.jobList(skip, limit),
    queryFn: () => importsApi.listImportJobs(skip, limit).then((r) => r.data),
    staleTime: 1000 * 30,
  })
}

export function useImportJob(jobId: string | undefined) {
  return useQuery({
    queryKey: importKeys.job(jobId!),
    queryFn: () => importsApi.getImportJob(jobId!).then((r) => r.data),
    enabled: !!jobId,
  })
}

export function useUploadImportFile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => importsApi.uploadImportFile(file).then((r) => r.data),
    onError: (err: Error) => toast.error(err.message || 'Error al subir archivo'),
  })
}

export function useConfirmImport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ImportConfirmRequest) => importsApi.confirmImport(data).then((r) => r.data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: importKeys.jobs() })
      if (res.success) {
        toast.success(`Importación completada: ${res.valid_rows} registros válidos`)
      } else {
        toast.error(`Importación completada con ${res.error_rows} errores`)
      }
    },
    onError: () => toast.error('Error al confirmar importación'),
  })
}
```

### `src/features/exports/hooks/useExports.ts`

```typescript
import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { downloadExport } from '../api/exports'
import type { ExportTransactionsFilters, ExportFormat } from '@/types/exports'

interface ProgressState {
  inProgress: boolean
  percentage: number
  fileName: string
}

export function useExportDownload() {
  const [progress, setProgress] = useState<ProgressState>({
    inProgress: false, percentage: 0, fileName: '',
  })

  const exportData = useCallback(async (
    entity: string,
    format: ExportFormat | string,
    filters?: ExportTransactionsFilters,
    customFileName?: string,
  ) => {
    const fileName = customFileName || `${entity}_${new Date().toISOString().slice(0, 10)}.${format}`
    setProgress({ inProgress: true, percentage: 0, fileName })

    try {
      await downloadExport(entity, format, filters, (pct) => {
        setProgress((prev) => ({ ...prev, percentage: pct }))
      })
      toast.success(`Exportación completada: ${fileName}`)
    } catch {
      toast.error('Error al exportar. Intenta de nuevo.')
    } finally {
      setTimeout(() => setProgress({ inProgress: false, percentage: 0, fileName: '' }), 2000)
    }
  }, [])

  const resetProgress = useCallback(() => {
    setProgress({ inProgress: false, percentage: 0, fileName: '' })
  }, [])

  return { progress, exportData, resetProgress }
}
```

---

## 5. Componentes

### 5.1 Estructura de archivos a crear

```
src/
  types/
    imports.ts
    exports.ts
  features/
    imports/
      api/
        imports.ts
      hooks/
        useImports.ts
      components/
        ImportWizard.tsx
        DropZone.tsx
        PreviewTable.tsx
        ColumnMappingStep.tsx
        ConfirmStep.tsx
        ImportJobHistory.tsx
        ImportJobCard.tsx
        ImportJobDetail.tsx
        ImportStatusBadge.tsx
        DuplicateWarning.tsx
      pages/
        ImportPage.tsx
        ImportHistoryPage.tsx
        ImportJobDetailPage.tsx
      constants.ts
    exports/
      api/
        exports.ts
      hooks/
        useExports.ts
      components/
        ExportPanel.tsx
        ExportFormatSelector.tsx
        ExportFilterPanel.tsx
        ExportProgressBar.tsx
        ExportCalendarSection.tsx
        ExportTypeCard.tsx
      pages/
        ExportPage.tsx
      constants.ts
```

### 5.2 DropZone (Drag & Drop Upload)

Componente drag & drop para subir archivos CSV/Excel:

```typescript
import { useState, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Upload, File, X, AlertCircle } from 'lucide-react'
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE, MAX_FILE_SIZE_LABEL } from '../constants'

interface DropZoneProps {
  onFileSelect: (file: File) => void
  isLoading?: boolean
}

export default function DropZone({ onFileSelect, isLoading }: DropZoneProps) {
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const validateFile = useCallback((file: File): boolean => {
    setError(null)
    if (file.size > MAX_FILE_SIZE) {
      setError(`El archivo excede el límite de ${MAX_FILE_SIZE_LABEL}`)
      return false
    }
    const ext = '.' + file.name.split('.').pop()?.toLowerCase()
    const validExts = Object.values(ACCEPTED_FILE_TYPES).flat()
    if (!validExts.includes(ext)) {
      setError('Formato no soportado. Usa CSV o Excel (.xlsx, .xls)')
      return false
    }
    return true
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && validateFile(file)) onFileSelect(file)
  }, [onFileSelect, validateFile])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && validateFile(file)) onFileSelect(file)
  }, [onFileSelect, validateFile])

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={cn(
        'relative cursor-pointer rounded-2xl border-2 border-dashed p-12 transition-all duration-300 text-center',
        dragOver
          ? 'border-purple-400 bg-purple-50/50 dark:bg-purple-500/5 scale-[1.02]'
          : 'border-gray-300 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30',
        isLoading && 'pointer-events-none opacity-60',
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        className="hidden"
        onChange={handleChange}
      />

      <div className="flex flex-col items-center gap-3">
        <div className={cn(
          'flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300',
          dragOver
            ? 'bg-gradient-to-br from-purple-500 to-indigo-500 scale-110 shadow-xl shadow-purple-500/30'
            : 'bg-gradient-to-br from-purple-500/10 to-indigo-500/10',
        )}>
          {isLoading ? (
            <svg className="animate-spin h-8 w-8 text-purple-600" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <Upload className={cn('h-8 w-8', dragOver ? 'text-white' : 'text-purple-600 dark:text-purple-400')} />
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {dragOver ? 'Suelta el archivo aquí' : 'Arrastra tu archivo aquí o haz clic para seleccionar'}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            CSV o Excel (.xlsx) — Máximo {MAX_FILE_SIZE_LABEL}
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-xl px-4 py-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
    </div>
  )
}
```

### 5.3 PreviewTable

Tabla de vista previa con errores de validación resaltados:

```typescript
import { cn } from '@/lib/utils'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import type { ImportValidationError } from '@/types/imports'

interface PreviewTableProps {
  columns: string[]
  rows: Record<string, unknown>[]
  errors: ImportValidationError[]
  duplicatesCount: number
}

export default function PreviewTable({ columns, rows, errors, duplicatesCount }: PreviewTableProps) {
  const errorRows = new Set(errors.map((e) => e.row))

  return (
    <div className="space-y-3">
      {/* Summary bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          {rows.length} filas
        </span>
        {errors.length > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400">
            <AlertTriangle className="h-3.5 w-3.5" />
            {errors.length} error(es) de validación
          </span>
        )}
        {duplicatesCount > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-400">
            <AlertTriangle className="h-3.5 w-3.5" />
            {duplicatesCount} posible(s) duplicado(s)
          </span>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <th className="px-3 py-2.5 text-left font-semibold text-gray-500 dark:text-gray-400 w-12">#</th>
              {columns.map((col) => (
                <th key={col} className="px-3 py-2.5 text-left font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const rowNum = idx + 2
              const hasErrors = errorRows.has(rowNum) || errorRows.has(0)
              const rowErrors = errors.filter((e) => e.row === rowNum || e.row === 0)
              return (
                <tr
                  key={idx}
                  className={cn(
                    'border-b border-gray-50 dark:border-gray-800 last:border-0 transition-colors',
                    hasErrors ? 'bg-red-50/50 dark:bg-red-500/5' : 'hover:bg-gray-50/50 dark:hover:bg-gray-800/50',
                  )}
                >
                  <td className={cn(
                    'px-3 py-2.5 font-mono text-gray-400',
                    hasErrors && 'text-red-500 font-bold',
                  )}>
                    {rowNum - 1}
                  </td>
                  {columns.map((col) => {
                    const fieldErrors = rowErrors.filter((e) => e.field === col || e.field === 'columns')
                    const hasFieldError = fieldErrors.length > 0
                    return (
                      <td key={col} className="px-3 py-2.5 max-w-[200px]">
                        <div className="relative">
                          <span className={cn(
                            'block truncate',
                            hasFieldError ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-700 dark:text-gray-300',
                          )}>
                            {String(row[col] ?? '') || <span className="text-gray-300 dark:text-gray-600 italic">vacío</span>}
                          </span>
                          {hasFieldError && (
                            <div className="absolute top-full left-0 z-10 mt-1 w-48 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 p-2 text-[10px] text-red-700 dark:text-red-400 shadow-lg">
                              {fieldErrors.map((fe, i) => <p key={i}>{fe.message}</p>)}
                            </div>
                          )}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {rows.length === 0 && (
        <p className="text-center text-sm text-gray-400 py-8">No hay datos para previsualizar</p>
      )}
    </div>
  )
}
```

### 5.4 ColumnMappingStep

Interfaz drag-select para mapear columnas del archivo a campos del sistema:

```typescript
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ArrowRight, AlertCircle } from 'lucide-react'
import { EXPECTED_FIELDS } from '@/types/imports'
import type { ColumnMapping } from '@/types/imports'

interface ColumnMappingStepProps {
  sourceColumns: string[]
  initialMappings?: ColumnMapping[]
  onConfirm: (mappings: ColumnMapping[]) => void
}

export default function ColumnMappingStep({
  sourceColumns, initialMappings, onConfirm,
}: ColumnMappingStepProps) {
  const [mappings, setMappings] = useState<ColumnMapping[]>(
    initialMappings ?? sourceColumns.map((col) => ({ sourceColumn: col, targetField: '' })),
  )

  const autoDetected = mappings.filter((m) => m.targetField).length
  const missing = EXPECTED_FIELDS.filter(
    (f) => f.required && !mappings.some((m) => m.targetField === f.value),
  )

  const updateMapping = (sourceColumn: string, targetField: string) => {
    setMappings((prev) => prev.map((m) =>
      m.sourceColumn === sourceColumn ? { ...m, targetField } : m,
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-gradient-to-r from-purple-500/30 to-transparent" />
        <p className="text-xs font-medium text-gray-400 dark:text-gray-500">
          {autoDetected} de {mappings.length} columnas mapeadas automáticamente
        </p>
        <div className="flex-1 h-px bg-gradient-to-l from-purple-500/30 to-transparent" />
      </div>

      {missing.length > 0 && (
        <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 p-3.5">
          <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
              Campos requeridos sin mapear
            </p>
            <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">
              {missing.map((f) => f.label).join(', ')} — Asigna estos campos para continuar
            </p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {mappings.map((mapping) => {
          const matchedField = EXPECTED_FIELDS.find((f) => f.value === mapping.targetField)
          return (
            <div
              key={mapping.sourceColumn}
              className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 p-3 transition-all hover:shadow-sm"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">
                  {mapping.sourceColumn}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-300 dark:text-gray-600 shrink-0" />
              <div className="flex-1">
                <select
                  value={mapping.targetField}
                  onChange={(e) => updateMapping(mapping.sourceColumn, e.target.value)}
                  className={cn(
                    'w-full rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all',
                    'focus:outline-none focus:ring-2 focus:ring-purple-500/30',
                    mapping.targetField
                      ? 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                      : 'border-red-200 dark:border-red-500/30 bg-red-50/50 dark:bg-red-500/5 text-gray-400',
                  )}
                >
                  <option value="">— Seleccionar campo —</option>
                  {EXPECTED_FIELDS.map((field) => (
                    <option key={field.value} value={field.value}>
                      {field.label}{field.required ? ' *' : ''}
                    </option>
                  ))}
                  <option value="__ignore__">Ignorar columna</option>
                </select>
              </div>
              {matchedField && (
                <span className={cn(
                  'text-[10px] font-semibold px-2 py-0.5 rounded-md',
                  matchedField.required
                    ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
                )}>
                  {matchedField.required ? 'Requerido' : 'Opcional'}
                </span>
              )}
            </div>
          )
        })}
      </div>

      <button
        onClick={() => onConfirm(mappings)}
        disabled={missing.length > 0}
        className="w-full rounded-xl py-3 text-sm font-bold bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.97] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        Confirmar mapeo
      </button>
    </div>
  )
}
```

### 5.5 ConfirmStep

Resumen final antes de importar:

```typescript
import { cn } from '@/lib/utils'
import { CheckCircle2, AlertTriangle, FileText } from 'lucide-react'
import type { ImportPreviewResponse } from '@/types/imports'

interface ConfirmStepProps {
  preview: ImportPreviewResponse
  onConfirm: () => void
  isLoading?: boolean
  errorRows: number
}

export default function ConfirmStep({ preview, onConfirm, isLoading, errorRows }: ConfirmStepProps) {
  const validRows = preview.total_rows - errorRows

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20">
            <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">{preview.file_name}</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {preview.file_type.toUpperCase()} — {preview.total_rows} filas
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 p-4 text-center">
            <p className="text-2xl font-black text-gray-900 dark:text-white">{preview.total_rows}</p>
            <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">Total filas</p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 p-4 text-center">
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{validRows}</p>
            <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">Válidas</p>
          </div>
          <div className={cn(
            'rounded-xl p-4 text-center',
            errorRows > 0
              ? 'bg-gradient-to-br from-red-500/10 to-orange-500/10'
              : 'bg-gradient-to-br from-emerald-500/10 to-green-500/10',
          )}>
            <p className={cn(
              'text-2xl font-black',
              errorRows > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400',
            )}>
              {errorRows}
            </p>
            <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">Errores</p>
          </div>
        </div>

        {errorRows > 0 && (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 p-3">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 dark:text-amber-300">
              {errorRows} fila(s) con errores serán omitidas durante la importación.
              Puedes corregir el archivo original y subirlo de nuevo.
            </p>
          </div>
        )}

        {preview.duplicates_found > 0 && (
          <div className="mt-2 flex items-start gap-2.5 rounded-xl bg-amber-50/50 dark:bg-amber-500/5 border border-amber-200/50 dark:border-amber-500/20 p-3">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              Se detectaron {preview.duplicates_found} posible(s) transacción(es) duplicada(s).
            </p>
          </div>
        )}
      </div>

      <button
        onClick={onConfirm}
        disabled={isLoading || validRows === 0}
        className="w-full rounded-xl py-3.5 text-sm font-bold bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.97] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Importando {validRows} transacciones...
          </span>
        ) : (
          `Importar ${validRows} transacción(es)`
        )}
      </button>
    </div>
  )
}
```

### 5.6 ImportWizard (Orquestador)

```typescript
import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Check, Upload, FileSpreadsheet, Columns, CheckCircle2 } from 'lucide-react'
import { useUploadImportFile, useConfirmImport } from '../hooks/useImports'
import DropZone from './DropZone'
import PreviewTable from './PreviewTable'
import ColumnMappingStep from './ColumnMappingStep'
import ConfirmStep from './ConfirmStep'
import { IMPORT_WIZARD_STEPS } from '../constants'
import type { ImportWizardStep } from '../constants'
import type { ImportPreviewResponse, ColumnMapping } from '@/types/imports'

const STEP_ICONS: Record<ImportWizardStep, typeof Upload> = {
  upload: Upload, preview: FileSpreadsheet, mapping: Columns, confirm: CheckCircle2,
}

export default function ImportWizard() {
  const [currentStep, setCurrentStep] = useState<ImportWizardStep>('upload')
  const [preview, setPreview] = useState<ImportPreviewResponse | null>(null)
  const [mappings, setMappings] = useState<ColumnMapping[]>([])

  const uploadMutation = useUploadImportFile()
  const confirmMutation = useConfirmImport()

  const handleFileSelect = useCallback(async (file: File) => {
    const result = await uploadMutation.mutateAsync(file)
    setPreview(result)
    // Auto-detect column mapping
    const autoMappings = result.columns_found.map((col) => ({
      sourceColumn: col,
      targetField: '',  // backend already normalized; could match here
    }))
    setMappings(autoMappings)
    if (result.validation_errors.some((e) => e.field === 'columns')) {
      setCurrentStep('mapping')
    } else {
      setCurrentStep('preview')
    }
  }, [uploadMutation])

  const handleMappingConfirm = useCallback((newMappings: ColumnMapping[]) => {
    setMappings(newMappings)
    setCurrentStep('confirm')
  }, [])

  const handleConfirm = useCallback(async () => {
    if (!preview) return
    const result = await confirmMutation.mutateAsync({ job_id: preview.job_id })
    if (result.success) {
      setTimeout(() => {
        setPreview(null)
        setCurrentStep('upload')
      }, 2000)
    }
  }, [preview, confirmMutation])

  const currentStepIndex = IMPORT_WIZARD_STEPS.findIndex((s) => s.id === currentStep)
  const isLastStep = currentStep === 'confirm'
  const isValid = preview && preview.validation_errors.length === 0

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center justify-between px-1">
        {IMPORT_WIZARD_STEPS.map((step, idx) => {
          const StepIcon = step.icon
          const isActive = idx <= currentStepIndex
          const isCurrent = step.id === currentStep
          return (
            <div key={step.id} className="flex items-center gap-2 flex-1 last:flex-none">
              <div className={cn(
                'relative flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300',
                isCurrent
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/25 scale-110'
                  : isActive
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400',
              )}>
                {isActive && idx < currentStepIndex ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <StepIcon className="h-4 w-4" />
                )}
              </div>
              <span className={cn(
                'text-xs font-semibold hidden sm:block',
                isCurrent ? 'text-gray-900 dark:text-white' : isActive ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500',
              )}>
                {step.label}
              </span>
              {idx < IMPORT_WIZARD_STEPS.length - 1 && (
                <div className={cn(
                  'flex-1 h-px mx-2',
                  isActive ? 'bg-gradient-to-r from-purple-500/50 to-indigo-500/50' : 'bg-gray-200 dark:bg-gray-700',
                )} />
              )}
            </div>
          )
        })}
      </div>

      {/* Step content */}
      <div className="animate-fade-in-up">
        {currentStep === 'upload' && (
          <DropZone
            onFileSelect={handleFileSelect}
            isLoading={uploadMutation.isPending}
          />
        )}

        {currentStep === 'preview' && preview && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                Vista previa — {preview.file_name}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentStep('mapping')}
                  className="rounded-lg px-3 py-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-all"
                >
                  Ajustar mapeo
                </button>
                <button
                  onClick={() => setCurrentStep('confirm')}
                  disabled={!isValid}
                  className="rounded-lg px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-purple-500 to-indigo-500 text-white disabled:opacity-50 hover:shadow-md transition-all"
                >
                  Continuar
                </button>
              </div>
            </div>
            <PreviewTable
              columns={preview.columns_found}
              rows={preview.preview_rows}
              errors={preview.validation_errors}
              duplicatesCount={preview.duplicates_found}
            />
          </div>
        )}

        {currentStep === 'mapping' && preview && (
          <ColumnMappingStep
            sourceColumns={preview.columns_found}
            initialMappings={mappings}
            onConfirm={handleMappingConfirm}
          />
        )}

        {currentStep === 'confirm' && preview && (
          <ConfirmStep
            preview={preview}
            onConfirm={handleConfirm}
            isLoading={confirmMutation.isPending}
            errorRows={preview.validation_errors.length}
          />
        )}
      </div>

      {/* Success state */}
      {confirmMutation.isSuccess && confirmMutation.data?.success && (
        <div className="flex flex-col items-center justify-center py-12 animate-fade-in-up">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-xl shadow-emerald-500/30 mb-4">
            <CheckCircle2 className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            ¡Importación completada!
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {confirmMutation.data.valid_rows} transacciones importadas exitosamente
          </p>
        </div>
      )}
    </div>
  )
}
```

### 5.7 ImportJobHistory

Lista de importaciones pasadas con estados:

```typescript
import { useImportJobs } from '../hooks/useImports'
import ImportJobCard from './ImportJobCard'
import { Loader2, Inbox } from 'lucide-react'

export default function ImportJobHistory() {
  const { data, isLoading } = useImportJobs()
  const jobs = data?.jobs ?? []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 mb-4">
          <Inbox className="h-7 w-7 text-purple-400" />
        </div>
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">No hay importaciones previas</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Las importaciones que realices aparecerán aquí</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {jobs.map((job) => (
        <ImportJobCard key={job.id} job={job} />
      ))}
    </div>
  )
}
```

### 5.8 ImportJobCard

```typescript
import { useNavigate } from 'react-router-dom'
import { cn, formatRelativeTime } from '@/lib/utils'
import { FileText, ChevronRight } from 'lucide-react'
import ImportStatusBadge from './ImportStatusBadge'
import type { ImportJobResponse } from '@/types/imports'

interface ImportJobCardProps {
  job: ImportJobResponse
}

export default function ImportJobCard({ job }: ImportJobCardProps) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/imports/jobs/${job.id}`)}
      className="group relative rounded-2xl border border-gray-100/80 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-purple-200/50 dark:hover:border-purple-500/30"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20">
          <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {job.file_name}
            </p>
            <ImportStatusBadge status={job.status} />
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {formatRelativeTime(job.created_at)} · {job.total_rows} filas · {job.valid_rows} válidas
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {job.processed_rows}/{job.total_rows}
            </p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500">
              {job.file_type.toUpperCase()}
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-300 dark:text-gray-600 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </div>
  )
}
```

### 5.9 ImportStatusBadge

```typescript
import { cn } from '@/lib/utils'
import { JOB_STATUS_CONFIG } from '../constants'
import type { ImportJobStatus } from '@/types/imports'

interface ImportStatusBadgeProps {
  status: ImportJobStatus
  size?: 'sm' | 'md'
}

export default function ImportStatusBadge({ status, size = 'sm' }: ImportStatusBadgeProps) {
  const config = JOB_STATUS_CONFIG[status]
  const Icon = config.icon

  return (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-lg font-semibold',
      size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
      config.color, config.bgColor,
      status === 'processing' && 'animate-pulse',
    )}>
      <Icon className={cn(size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5')} />
      {config.label}
    </span>
  )
}
```

### 5.10 ExportPanel (Componente Principal de Exportación)

```typescript
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Download, ChevronDown, Calendar } from 'lucide-react'
import { useExportDownload } from '../hooks/useExports'
import ExportFormatSelector from './ExportFormatSelector'
import ExportFilterPanel from './ExportFilterPanel'
import ExportProgressBar from './ExportProgressBar'
import ExportCalendarSection from './ExportCalendarSection'
import ExportTypeCard from './ExportTypeCard'
import { EXPORT_TYPES } from '../constants'
import type { ExportFormat, ExportTransactionsFilters } from '@/types/exports'

export default function ExportPanel() {
  const [selectedType, setSelectedType] = useState(EXPORT_TYPES[0])
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<ExportTransactionsFilters>({})
  const { progress, exportData } = useExportDownload()

  const handleExport = async (format: ExportFormat) => {
    const endpointMap: Record<string, string> = {
      transactions: 'transactions',
      budgets: 'budgets/pdf',
      goals: 'goals/pdf',
    }
    const entity = endpointMap[selectedType.id]
    if (!entity) return
    await exportData(entity, format, selectedType.id === 'transactions' ? filters : undefined)
  }

  const handleCalendarExport = async (endpoint: string) => {
    await exportData(endpoint, '', undefined)
  }

  return (
    <div className="space-y-6">
      {/* Type selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {EXPORT_TYPES.map((type) => (
          <ExportTypeCard
            key={type.id}
            type={type}
            selected={selectedType.id === type.id}
            onClick={() => { setSelectedType(type); setShowFilters(false) }}
          />
        ))}
      </div>

      {/* Selected type panel */}
      {selectedType && (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 p-6 shadow-sm animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">{selectedType.label}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{selectedType.description}</p>
            </div>
            {selectedType.id === 'transactions' && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all',
                  showFilters
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-750',
                )}
              >
                Filtros
                <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', showFilters && 'rotate-180')} />
              </button>
            )}
          </div>

          {showFilters && selectedType.id === 'transactions' && (
            <ExportFilterPanel filters={filters} onChange={setFilters} />
          )}

          {selectedType.formats.length > 0 && (
            <ExportFormatSelector
              formats={selectedType.formats}
              onSelect={handleExport}
              disabled={progress.inProgress}
            />
          )}

          {selectedType.hasCalendar && (
            <ExportCalendarSection
              type={selectedType.id as 'calendar_recurring' | 'calendar_goals'}
              onExport={handleCalendarExport}
              disabled={progress.inProgress}
            />
          )}
        </div>
      )}

      <ExportProgressBar progress={progress} />
    </div>
  )
}
```

### 5.11 ExportFilterPanel

```typescript
import { CalendarDays, Filter, X } from 'lucide-react'
import type { ExportTransactionsFilters } from '@/types/exports'

interface ExportFilterPanelProps {
  filters: ExportTransactionsFilters
  onChange: (filters: ExportTransactionsFilters) => void
}

export default function ExportFilterPanel({ filters, onChange }: ExportFilterPanelProps) {
  const update = (key: keyof ExportTransactionsFilters, value: string) => {
    onChange({ ...filters, [key]: value || undefined })
  }

  const hasFilters = Object.values(filters).some((v) => v !== undefined && v !== '')

  return (
    <div className="mb-6 p-4 rounded-xl bg-gray-50/80 dark:bg-gray-800/50 border border-gray-100/80 dark:border-gray-700/50 animate-fade-in space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          <Filter className="h-3.5 w-3.5" />
          Filtros de exportación
        </div>
        {hasFilters && (
          <button
            onClick={() => onChange({})}
            className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-500 hover:text-red-600 transition-all"
          >
            <X className="h-3 w-3" />
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
            Fecha desde
          </label>
          <div className="relative">
            <CalendarDays className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            <input
              type="date"
              value={filters.date_from || ''}
              onChange={(e) => update('date_from', e.target.value)}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 pl-8 pr-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            />
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
            Fecha hasta
          </label>
          <div className="relative">
            <CalendarDays className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            <input
              type="date"
              value={filters.date_to || ''}
              onChange={(e) => update('date_to', e.target.value)}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 pl-8 pr-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            />
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
            Tipo
          </label>
          <select
            value={filters.transaction_type || ''}
            onChange={(e) => update('transaction_type', e.target.value)}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
          >
            <option value="">Todos</option>
            <option value="income">Ingresos</option>
            <option value="expense">Gastos</option>
            <option value="transfer">Transferencias</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
            Categoría
          </label>
          <input
            type="text"
            value={filters.category || ''}
            onChange={(e) => update('category', e.target.value)}
            placeholder="Nombre de categoría"
            className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30 placeholder:text-gray-400"
          />
        </div>
      </div>
    </div>
  )
}
```

### 5.12 ExportFormatSelector

```typescript
import { cn } from '@/lib/utils'
import { FileSpreadsheet, FileText, Download } from 'lucide-react'
import { EXPORT_FORMAT_OPTIONS } from '@/types/exports'
import type { ExportFormat } from '@/types/exports'

interface ExportFormatSelectorProps {
  formats: ExportFormat[]
  onSelect: (format: ExportFormat) => void
  disabled?: boolean
}

const FORMAT_ICONS: Record<string, typeof FileSpreadsheet> = {
  csv: FileSpreadsheet, xlsx: FileSpreadsheet, pdf: FileText,
}

export default function ExportFormatSelector({ formats, onSelect, disabled }: ExportFormatSelectorProps) {
  const availableOptions = EXPORT_FORMAT_OPTIONS.filter((opt) => formats.includes(opt.value))

  return (
    <div className="space-y-3">
      <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        Seleccionar formato
      </p>
      <div className="grid grid-cols-3 gap-3">
        {availableOptions.map((option) => {
          const Icon = FORMAT_ICONS[option.value] || FileText
          return (
            <button
              key={option.value}
              onClick={() => onSelect(option.value)}
              disabled={disabled}
              className={cn(
                'group relative flex flex-col items-center gap-2 rounded-xl border p-5 transition-all duration-200',
                'hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.97]',
                'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
                'hover:border-purple-300/50 dark:hover:border-purple-500/30',
                disabled && 'opacity-50 cursor-not-allowed hover:translate-y-0 hover:shadow-none',
              )}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 group-hover:from-purple-500/20 group-hover:to-indigo-500/20 transition-all">
                <Icon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-gray-900 dark:text-white">{option.label}</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 leading-tight">
                  {option.description}
                </p>
              </div>
              <Download className="h-4 w-4 text-gray-300 dark:text-gray-600 group-hover:text-purple-400 transition-colors" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
```

### 5.13 ExportProgressBar

```typescript
import { cn } from '@/lib/utils'
import { Download, Loader2, CheckCircle2 } from 'lucide-react'
import type { ExportProgressState } from '../constants'

interface ExportProgressBarProps {
  progress: ExportProgressState
}

export default function ExportProgressBar({ progress }: ExportProgressBarProps) {
  if (!progress.inProgress && progress.percentage === 0) return null

  const isComplete = progress.percentage === 100

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 p-4 shadow-sm animate-fade-in-up">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          {isComplete ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          ) : (
            <Loader2 className="h-5 w-5 text-purple-500 animate-spin" />
          )}
          <div>
            <p className="text-xs font-semibold text-gray-900 dark:text-white">
              {isComplete ? 'Descarga lista' : 'Preparando exportación...'}
            </p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500">{progress.fileName}</p>
          </div>
        </div>
        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 tabular-nums">
          {progress.percentage}%
        </span>
      </div>

      <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            isComplete
              ? 'bg-gradient-to-r from-emerald-500 to-green-500'
              : 'bg-gradient-to-r from-purple-500 to-indigo-500',
          )}
          style={{ width: `${progress.percentage}%` }}
        />
      </div>
    </div>
  )
}
```

### 5.14 ExportCalendarSection

```typescript
import { Calendar, Download } from 'lucide-react'
import type { CalendarExportType } from '@/types/exports'

interface ExportCalendarSectionProps {
  type: CalendarExportType
  onExport: (endpoint: string) => void
  disabled?: boolean
}

export default function ExportCalendarSection({ type, onExport, disabled }: ExportCalendarSectionProps) {
  const label = type === 'recurring' ? 'Transacciones Recurrentes' : 'Fechas Límite de Metas'
  const description = type === 'recurring'
    ? 'Exporta tus transacciones recurrentes como archivo .ics para agregar a tu calendario'
    : 'Exporta las fechas límite de tus metas como archivo .ics'

  return (
    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
            <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">Calendario (.ics)</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{description}</p>
          </div>
        </div>
        <button
          onClick={() => onExport(type)}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-50"
        >
          <Download className="h-3.5 w-3.5" />
          Exportar
        </button>
      </div>
    </div>
  )
}
```

### 5.15 ExportTypeCard

```typescript
import { cn } from '@/lib/utils'
import { FileSpreadsheet, FileText, Calendar } from 'lucide-react'
import type { ExportTypeConfig } from '../constants'

interface ExportTypeCardProps {
  type: ExportTypeConfig
  selected: boolean
  onClick: () => void
}

const TYPE_ICONS: Record<string, typeof FileSpreadsheet> = {
  transactions: FileSpreadsheet,
  budgets: FileText,
  goals: FileText,
  calendar_recurring: Calendar,
  calendar_goals: Calendar,
}

export default function ExportTypeCard({ type, selected, onClick }: ExportTypeCardProps) {
  const Icon = TYPE_ICONS[type.id] || FileSpreadsheet

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex items-center gap-3 rounded-2xl border p-4 text-left transition-all duration-200',
        'hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]',
        selected
          ? 'border-purple-300 dark:border-purple-500/40 bg-white dark:bg-gray-900 shadow-md'
          : 'border-gray-100/80 dark:border-gray-700/60 bg-white/60 dark:bg-gray-900/60 hover:border-purple-200/50 dark:hover:border-purple-500/20',
      )}
    >
      <div className={cn(
        'flex h-10 w-10 items-center justify-center rounded-xl transition-all',
        selected
          ? 'bg-gradient-to-br from-purple-500/20 to-indigo-500/20'
          : 'bg-gray-100 dark:bg-gray-800',
      )}>
        <Icon className={cn('h-5 w-5', selected ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400')} />
      </div>
      <div>
        <p className={cn(
          'text-sm font-semibold',
          selected ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400',
        )}>
          {type.label}
        </p>
        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{type.description}</p>
      </div>
    </button>
  )
}
```

### 5.16 DuplicateWarning

```typescript
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

interface DuplicateWarningProps {
  count: number
  details?: Record<string, unknown>[]
}

export default function DuplicateWarning({ count, details }: DuplicateWarningProps) {
  const [expanded, setExpanded] = useState(false)

  if (count === 0) return null

  return (
    <div className="rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between p-3.5 text-left"
      >
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
            {count} posible(s) duplicado(s) detectado(s)
          </span>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 text-amber-500" /> : <ChevronDown className="h-4 w-4 text-amber-500" />}
      </button>
      {expanded && details && (
        <div className="px-3.5 pb-3.5 space-y-1">
          {details.map((d, i) => (
            <div key={i} className="text-[10px] text-amber-700 dark:text-amber-400 font-mono bg-amber-100/50 dark:bg-amber-500/5 rounded-lg px-2 py-1">
              {JSON.stringify(d)}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

---

## 6. Páginas

### 6.1 ImportPage (`src/features/imports/pages/ImportPage.tsx`)

Página del wizard de importación:

```typescript
import { cn } from '@/lib/utils'
import { Upload, Clock, History } from 'lucide-react'
import ImportWizard from '../components/ImportWizard'
import ImportJobHistory from '../components/ImportJobHistory'

export default function ImportPage() {
  return (
    <div className="relative mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Decorative orbs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -right-40 top-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="absolute -top-4 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-xl shadow-purple-500/30">
            <Upload className="h-7 w-7 text-white drop-shadow-sm" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Importar Transacciones</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Sube archivos CSV o Excel para importar tus transacciones
            </p>
          </div>
        </div>
      </div>

      {/* Wizard */}
      <div className="rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-6 sm:p-8 shadow-sm">
        <ImportWizard />
      </div>

      {/* History */}
      <div className="mt-10">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-indigo-500/20">
            <History className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Historial de Importaciones</h2>
        </div>
        <ImportJobHistory />
      </div>
    </div>
  )
}
```

### 6.2 ExportPage (`src/features/exports/pages/ExportPage.tsx`)

```typescript
import { Download } from 'lucide-react'
import ExportPanel from '../components/ExportPanel'

export default function ExportPage() {
  return (
    <div className="relative mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Decorative orbs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -right-40 top-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="absolute -top-4 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-xl shadow-purple-500/30">
            <Download className="h-7 w-7 text-white drop-shadow-sm" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Exportar Datos</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Descarga tus datos financieros en múltiples formatos
            </p>
          </div>
        </div>
      </div>

      <ExportPanel />
    </div>
  )
}
```

---

## 7. Rutas y Navegación

### `src/routes/lazy.ts` — Añadir:

```typescript
export const ImportPage = lazy(() => import('@/features/imports/pages/ImportPage'))
export const ExportPage = lazy(() => import('@/features/exports/pages/ExportPage'))
```

### `src/routes/index.tsx` — Añadir rutas:

```typescript
// Imports
{
  path: '/imports',
  element: (<SuspenseWrapper><ImportPage /></SuspenseWrapper>),
},

// Exports
{
  path: '/exports',
  element: (<SuspenseWrapper><ExportPage /></SuspenseWrapper>),
},
```

---

## 8. Integración con Sidebar

En el componente de Sidebar, añadir enlaces a `/imports` y `/exports` con sus iconos:

```typescript
// Ejemplo de entry en la navegación del sidebar
{
  group: 'Datos',
  items: [
    { label: 'Importar', icon: Upload, path: '/imports' },
    { label: 'Exportar', icon: Download, path: '/exports' },
  ],
}
```

---

## 9. Checklist de Implementación

### Types
- [ ] Crear `src/types/imports.ts` con todas las interfaces + `EXPECTED_FIELDS`
- [ ] Crear `src/types/exports.ts` con interfaces + `EXPORT_FORMAT_OPTIONS` + `EXPORT_FILE_NAMES`

### Constants
- [ ] Crear `src/features/imports/constants.ts` con `ACCEPTED_FILE_TYPES`, `MAX_FILE_SIZE`, `JOB_STATUS_CONFIG`, `IMPORT_WIZARD_STEPS`
- [ ] Crear `src/features/exports/constants.ts` con `EXPORT_TYPES`, `ExportProgressState`

### API Layer
- [ ] Crear `src/features/imports/api/imports.ts` (4 funciones: upload, confirm, list, get)
- [ ] Crear `src/features/exports/api/exports.ts` (buildExportUrl + downloadExport + getExportUrl)

### TanStack Query Hooks
- [ ] Crear `src/features/imports/hooks/useImports.ts` (importKeys, 2 queries, 2 mutations)
- [ ] Crear `src/features/exports/hooks/useExports.ts` (useExportDownload con progress state)

### Import Components
- [ ] `DropZone.tsx` — drag & drop con validación
- [ ] `PreviewTable.tsx` — tabla con errores resaltados
- [ ] `ColumnMappingStep.tsx` — mapeo columna-a-campo
- [ ] `ConfirmStep.tsx` — resumen final + confirmar
- [ ] `ImportWizard.tsx` — orquestador del wizard
- [ ] `ImportJobHistory.tsx` — lista de jobs pasados
- [ ] `ImportJobCard.tsx` — card de job individual
- [ ] `ImportStatusBadge.tsx` — badge de estado
- [ ] `DuplicateWarning.tsx` — alerta de duplicados

### Export Components
- [ ] `ExportPanel.tsx` — panel principal de exportación
- [ ] `ExportTypeCard.tsx` — selector de tipo
- [ ] `ExportFormatSelector.tsx` — selector de formato
- [ ] `ExportFilterPanel.tsx` — filtros pre-exportación
- [ ] `ExportProgressBar.tsx` — barra de progreso dinámica
- [ ] `ExportCalendarSection.tsx` — exportación de calendario .ics

### Pages
- [ ] `ImportPage.tsx` — wizard + historial
- [ ] `ExportPage.tsx` — panel de exportación

### Routes
- [ ] `lazy.ts` — añadir lazy imports
- [ ] `index.tsx` — añadir rutas `/imports` y `/exports`
- [ ] Sidebar — añadir enlaces a Importar/Exportar

### Verification
- [ ] `pnpm typecheck` — sin errores
- [ ] `pnpm lint` — sin errores
- [ ] Probar flujo completo: subir CSV → preview → mapear si necesario → confirmar
- [ ] Probar exportación: seleccionar tipo → filtros → formato → descargar
- [ ] Verificar historial de importaciones después de importar
- [ ] Verificar que los archivos .ics se descargan correctamente

---

## 10. Estrategias y Buenas Prácticas

### Estrategia de Diseño
- Usar el mismo patrón de glassmorphism + gradientes purple/indigo que el resto del app (`backdrop-blur-xl bg-white/80`, `from-purple-500 to-indigo-600`)
- Iconos en cajas con gradient (`bg-gradient-to-br from-purple-500/20 to-indigo-500/20`)
- Hover lift (`hover:-translate-y-0.5 hover:shadow-lg`)
- Active scale (`active:scale-[0.97]`)
- Staggered entrances con `animate-fade-in-up` y `animation-delay`
- Decorar con orbs flotantes (mismo patrón de otras fases)

### Estrategia de Manejo de Archivos
- Validar tipo y tamaño en el frontend ANTES de enviar al backend
- Usar `FormData` con `Content-Type: multipart/form-data`
- Timeout de 60s para upload (archivos grandes)
- Para exports, usar `responseType: 'blob'` y trigger de descarga via `<a>` tag

### Estrategia de Column Mapping
- El backend ya normaliza columnas automáticamente (mapea español/inglés)
- Mostrar ColumnMappingStep SÓLO si el usuario lo solicita o si hay errores de columna
- Las columnas no mapeadas pueden ignorarse (opción "Ignorar columna")

### Estrategia de Progreso de Exportación
- Simular progreso con 4 pasos: iniciando (0%) → consultando API (25%) → descargando blob (75%) → completado (100%)
- Mostrar barra de progreso animada
- Ocultar automáticamente después de 2s de completado
- El nombre del archivo se extrae del header `Content-Disposition`

### Manejo de Errores
- Upload: mostrar error de validación (tamaño, tipo) en el DropZone
- Preview: resaltar celdas con error + tooltip con mensaje
- Confirm: mostrar resumen con filas válidas vs errores
- Export: toast error si falla la descarga
- Historial: mostrar estado "failed" con badge rojo

### Consideraciones de Performance
- Upload limitado a 10MB (backend lo valida también)
- Preview muestra solo primeras 10 filas (backend limita)
- Historial paginado (server-side con skip/limit)
- Export es streaming — no bloquea el servidor
- Lazy loading de todas las páginas via React.lazy
