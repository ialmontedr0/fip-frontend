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
  employer_tax_id: string | null
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
  icon: string | null
  color: string | null
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
