export const LOAN_TYPES = {
  personal: 'Prestamo Personal',
  mortgage: 'Hipotecario',
  auto: 'Auto',
  student: 'Estudiantil',
  business: 'Empresarial',
  personal_line: 'Linea de Credito',
  payday: 'Prestamo de Nomina',
  microloan: 'Microcredito',
  consolidation: 'Consolidacion de Deuda',
} as const

export type LoanType = keyof typeof LOAN_TYPES

export const INTEREST_TYPES = {
  fixed: 'Fijo',
  variable: 'Variable',
  mixed: 'Mixto',
} as const

export type InterestType = keyof typeof INTEREST_TYPES

export const PAYMENT_FREQUENCIES = {
  monthly: 'Mensual',
  bi_weekly: 'Quincenal',
  weekly: 'Semanal',
} as const

export type PaymentFrequency = keyof typeof PAYMENT_FREQUENCIES

export const LOAN_STATUSES = {
  pending: 'Pendiente',
  active: 'Activo',
  paid_off: 'Pagado',
  defaulted: 'Incumplimiento',
  refinanced: 'Refinanciado',
  suspended: 'Suspendido',
  cancelled: 'Cancelado',
} as const

export type LoanStatus = keyof typeof LOAN_STATUSES

export const LOAN_PAYMENT_METHODS = {
  bank_transfer: 'Transferencia Bancaria',
  cash: 'Efectivo',
  auto_debit: 'Debito Automatico',
  check: 'Cheque',
  online: 'En Linea',
  mobile: 'Movil',
} as const

export type LoanPaymentMethod = keyof typeof LOAN_PAYMENT_METHODS

export const LOAN_PAYMENT_STATUSES = {
  pending: 'Pendiente',
  completed: 'Completado',
  failed: 'Fallido',
  reversed: 'Revertido',
} as const

export type LoanPaymentStatus = keyof typeof LOAN_PAYMENT_STATUSES

export interface CreateLoanRequest {
  name: string
  principal_amount: number
  annual_interest_rate: number
  term_months: number
  loan_type?: LoanType
  interest_type?: InterestType
  payment_frequency?: PaymentFrequency
  account_id?: string | null
  lender_name?: string | null
  account_number?: string | null
  disbursement_date?: string | null
  grace_period_days?: number
  early_payoff_allowed?: boolean
  early_payoff_penalty_pct?: number | null
  penalty_rate_monthly?: number | null
  notes?: string | null
}

export interface UpdateLoanRequest {
  name?: string
  description?: string | null
  lender_name?: string | null
  account_number?: string | null
  notes?: string | null
  grace_period_days?: number
  early_payoff_allowed?: boolean
  early_payoff_penalty_pct?: number | null
  penalty_rate_monthly?: number | null
}

export interface UpdateLoanStatusRequest {
  status: LoanStatus
}

export interface LoanListItem {
  id: string
  name: string
  loan_type: LoanType
  principal_amount: number
  current_balance: number
  annual_interest_rate: number
  monthly_payment: number
  total_paid: number
  status: LoanStatus
  next_payment_date: string | null
  progress_pct: number
  created_at: string | null
}

export interface LoanDetailResponse {
  id: string
  name: string
  description: string | null
  loan_type: LoanType
  lender_name: string | null
  account_number: string | null
  principal_amount: number
  current_balance: number
  annual_interest_rate: number
  interest_type: InterestType
  term_months: number
  payment_frequency: PaymentFrequency
  monthly_payment: number
  total_paid: number
  total_interest_paid: number
  total_interest_expected: number
  disbursement_date: string | null
  first_payment_date: string | null
  next_payment_date: string | null
  final_payment_date: string | null
  paid_off_date: string | null
  status: LoanStatus
  grace_period_days: number
  early_payoff_allowed: boolean
  early_payoff_penalty_pct: number | null
  penalty_rate_monthly: number | null
  progress_pct: number
  payments_summary: {
    total_paid: number
    total_interest: number
    total_principal: number
    total_penalties: number
    payment_count: number
  }
  upcoming_payment: {
    next_payment_date: string
    monthly_payment: number
    days_until_payment: number
  } | null
  notes: string | null
  created_at: string | null
}

export interface ListLoansResponse {
  loans: LoanListItem[]
  total: number
}

export interface LoanSummaryResponse {
  total_balance: number
  total_monthly_payment: number
  total_paid: number
  total_interest_paid: number
  total_loans: number
  by_status: Record<string, number>
  upcoming_payments_30d: Array<{
    loan_id: string
    loan_name: string
    next_payment_date: string | null
    monthly_payment: number
    current_balance: number
  }>
  upcoming_count: number
}

export interface AmortizationEntry {
  entry_number: number
  due_date: string
  payment_amount: number
  principal_portion: number
  interest_portion: number
  balance_after: number
  total_interest_to_date: number
  total_principal_to_date: number
  is_paid: boolean
}

export interface AmortizationResponse {
  loan_id: string
  loan_name: string
  total_entries: number
  entries: AmortizationEntry[]
}

export interface AmortizationSummaryResponse {
  loan_id: string
  total_entries: number
  entries_paid: number
  entries_remaining: number
  progress_pct: number
  total_interest_scheduled: number
  total_principal_scheduled: number
  monthly_payment: number
  current_balance: number
}

export interface MakePaymentRequest {
  amount: number
  payment_date?: string | null
  payment_method?: LoanPaymentMethod
  reference_number?: string | null
  is_extra_payment?: boolean
  notes?: string | null
}

export interface PaymentResponse {
  id: string
  amount: number
  principal_portion: number
  interest_portion: number
  penalty_portion: number
  payment_date: string
  payment_method: string
  reference_number: string | null
  status: LoanPaymentStatus
  balance_after: number
  is_extra_payment: boolean
  notes: string | null
  created_at: string | null
}

export interface MakePaymentResponse {
  payment_id: string
  loan_id: string
  amount: number
  principal_portion: number
  interest_portion: number
  penalty_portion: number
  payment_date: string
  payment_method: string
  balance_after: number
  is_extra_payment: boolean
  loan_status: LoanStatus
  current_balance: number
  total_paid: number
  total_interest_paid: number
}

export interface ListPaymentsResponse {
  loan_id: string
  payments: PaymentResponse[]
  total: number
  summary: {
    total_paid: number
    total_interest: number
    total_principal: number
    total_penalties: number
    payment_count: number
  }
}

export interface EarlyPayoffResponse {
  loan_id: string
  loan_name: string
  current_balance: number
  payoff_date: string
  remaining_months_scheduled: number
  outstanding_principal: number
  pro_rata_interest: number
  early_payoff_penalty: number
  total_payoff_amount: number
  interest_saved: number
  monthly_payment_current: number
  total_paid_so_far: number
}

export interface SimulateLoanRequest {
  principal_amount: number
  annual_interest_rate: number
  term_months: number
  start_date?: string | null
  extra_monthly_payment?: number
}

export interface SimulateLoanPreviewEntry {
  entry_number: number
  due_date: string
  payment_amount: number
  principal_portion: number
  interest_portion: number
  balance_after: number
}

export interface SimulateLoanResponse {
  principal_amount: number
  annual_interest_rate: number
  term_months: number
  monthly_payment: number
  extra_monthly_payment: number
  total_paid: number
  total_interest: number
  total_cost: number
  interest_to_principal_ratio: number
  actual_months: number
  early_payoff_months: number
  interest_saved_with_extra: number
  schedule_preview: SimulateLoanPreviewEntry[]
}
