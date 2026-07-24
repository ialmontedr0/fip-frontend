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
