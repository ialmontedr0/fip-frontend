export interface LentLoanScheduleEntry {
  entry_number: number
  due_date: string
  amount: number
  principal_portion: number
  interest_portion: number
  balance_after: number
}

export interface LentLoanPayment {
  id: string
  amount: number
  principal_portion: number
  interest_portion: number
  received_date: string | null
  payment_method: string
  reference_number: string | null
  notes: string | null
  created_at: string | null
}

export interface LentLoan {
  id: string
  borrower_name: string
  notes: string | null
  principal_amount: number
  annual_interest_rate: number
  term_months: number
  payment_frequency: string
  single_payment_date?: string | null
  currency_code: string
  monthly_payment: number
  current_balance: number
  total_received: number
  total_interest_expected: number
  total_interest_received: number
  is_collateralized: boolean
  start_date: string | null
  first_payment_date: string | null
  next_payment_date: string | null
  final_payment_date: string | null
  paid_off_date: string | null
  status: 'active' | 'paid_off' | 'defaulted' | 'cancelled'
  progress_pct: number
  account_id: string | null
  created_at: string | null
  updated_at: string | null
  payments?: LentLoanPayment[]
  schedule?: LentLoanScheduleEntry[]
}

export interface LentLoanDetail extends LentLoan {
  payments: LentLoanPayment[]
  schedule: LentLoanScheduleEntry[]
}

export interface ListLentLoansResponse {
  items: LentLoan[]
  total: number
}

export interface LentLoanSummary {
  asset_class: string
  count: number
  total_outstanding: number
  total_principal: number
  total_received: number
  total_interest_expected: number
}

export interface LentLoanReceivablesSummary {
  count: number
  count_overdue: number
  total_outstanding: number
  total_overdue: number
  total_principal: number
  total_received: number
  total_interest_expected: number
}

export interface LentLoanReceivablesResponse {
  items: LentLoan[]
  total: number
  summary: LentLoanReceivablesSummary
}

export interface SimulateLentLoanRequest {
  principal_amount: number
  annual_interest_rate: number
  term_months?: number | null
  payment_frequency?: string
  single_payment_date?: string | null
  start_date?: string | null
}

export interface SimulateLentLoanResponse {
  principal_amount: number
  annual_interest_rate: number
  term_months: number
  payment_frequency?: string
  single_payment_date?: string | null
  monthly_payment: number
  total_to_receive: number
  total_interest: number
  total_profit: number
  interest_to_principal_ratio: number
  start_date: string
  schedule_preview: LentLoanScheduleEntry[]
}

export interface CreateLentLoanRequest {
  borrower_name: string
  principal_amount: number
  annual_interest_rate: number
  term_months?: number | null
  payment_frequency?: string
  single_payment_date?: string | null
  currency_code?: string
  account_id?: string | null
  start_date?: string | null
  is_collateralized?: boolean
  notes?: string | null
}

export interface RecordLentLoanPaymentRequest {
  amount: number
  received_date?: string | null
  payment_method?: string
  reference_number?: string | null
  notes?: string | null
}
