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

export interface ColumnMapping {
  sourceColumn: string
  targetField: string
}

export const EXPECTED_FIELDS = [
  { value: 'date', label: 'Fecha', required: true },
  { value: 'description', label: 'Descripci\u00f3n', required: true },
  { value: 'amount', label: 'Monto', required: true },
  { value: 'type', label: 'Tipo (income/expense)', required: false },
  { value: 'category', label: 'Categor\u00eda', required: false },
  { value: 'account', label: 'Cuenta', required: false },
  { value: 'currency', label: 'Moneda', required: false },
  { value: 'notes', label: 'Notas', required: false },
] as const
