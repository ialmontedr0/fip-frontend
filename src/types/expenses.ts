export type Priority = 'low' | 'normal' | 'high' | 'critical'
export type ServiceType = 'electricity' | 'water' | 'gas' | 'internet' | 'phone' | 'cable' | 'other'
export type BillingFrequency = 'monthly' | 'quarterly' | 'bimonthly' | 'yearly'
export type CardNetwork = 'visa' | 'mastercard' | 'amex' | 'discover' | 'other'
export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'overdue' | 'waived'
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled' | 'trial' | 'expired'
export type UtilizationStatus = 'healthy' | 'warning' | 'danger'
export type LimitType = 'daily' | 'weekly' | 'monthly' | 'category'

export interface CreateExpenseRequest {
  account_id: string
  amount: string
  currency_code?: string
  description: string
  effective_date: string
  category_id?: string | null
  subcategory_id?: string | null
  status?: string
  notes?: string | null
  source?: string
  tags?: string[] | null
  priority?: Priority
  template_id?: string | null
  service_id?: string | null
  subscription_id?: string | null
  credit_card_id?: string | null
  debit_card_id?: string | null
}

export interface ExpenseResponse {
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
  source: string
  tags: string[]
  priority: Priority
  service_id: string | null
  subscription_id: string | null
  credit_card_id: string | null
  created_at: string | null
}

export interface ListExpensesResponse {
  expenses: ExpenseResponse[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface ExpenseFilters {
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
  priority?: Priority
  sort_by?: string
  sort_order?: string
  page?: number
  page_size?: number
}

export interface SplitItem {
  amount: string
  description: string
  account_id?: string | null
}

export interface CreateSplitExpenseRequest {
  account_id: string
  total_amount: string
  currency_code?: string
  description: string
  effective_date: string
  notes?: string | null
  tags?: string[] | null
  splits: SplitItem[]
}

export interface ExpenseDashboardResponse {
  period_start: string
  period_end: string
  total_expenses: string
  total_count: number
  daily_average: string
  monthly_subscriptions: string
  by_category: Array<{ category: string; total: string; count: number; percentage: string }>
  daily_trend: Array<{ date: string; total: string; count: number }>
}

export interface SpendingPatternsResponse {
  top_categories: Array<{ category: string; total: string; count: number; percentage: string }>
  monthly_data: Array<{ month: string; total: string; count: number }>
  average_monthly_expense: string
  period: string
}

export interface DuplicatesResponse {
  duplicates: Array<{ id: string; description: string; amount: string; effective_date: string; count: number }>
  total: number
}

export interface RecurringCandidatesResponse {
  candidates: Array<{ id: string; description: string; amount: string; occurrences: number; avg_frequency_days: number; is_monthly_like: boolean }>
  total: number
}

export interface CreateTemplateRequest {
  name: string
  description: string
  default_amount?: number | null
  default_currency?: string
  default_account_id?: string | null
  default_category_id?: string | null
  default_subcategory_id?: string | null
  default_notes?: string | null
  default_frequency?: string | null
  icon?: string | null
  color?: string | null
  sort_order?: number
}

export interface TemplateResponse {
  id: string
  name: string
  description: string
  default_amount: string | null
  default_currency: string
  default_account_id: string | null
  default_category_id: string | null
  default_subcategory_id: string | null
  default_notes: string | null
  default_frequency: string | null
  usage_count: number
  last_used_at: string | null
  icon: string | null
  color: string | null
  created_at: string | null
}

export interface CreateFromTemplateRequest {
  account_id?: string | null
  amount?: string | null
  effective_date: string
  notes?: string | null
  tags?: string[] | null
}

export interface CreateServiceRequest {
  name: string
  provider?: string | null
  service_type: ServiceType
  frequency?: string
  estimated_amount?: string | null
  account_number?: string | null
  billing_day?: number | null
  due_day?: number | null
  category_id?: string | null
  auto_create_expense?: boolean
  icon?: string | null
  color?: string | null
  notes?: string | null
}

export interface ServiceResponse {
  id: string
  name: string
  provider: string | null
  service_type: ServiceType
  frequency: string
  estimated_amount: string | null
  account_number: string | null
  billing_day: number | null
  due_day: number | null
  category_id: string | null
  last_paid_at: string | null
  last_paid_amount: string | null
  payment_status: string
  is_active: boolean
  auto_create_expense: boolean
  icon: string | null
  color: string | null
  notes: string | null
  created_at: string | null
}

export interface MarkServicePaidRequest {
  amount?: string | null
  paid_date?: string | null
  notes?: string | null
}

export interface CreateSubscriptionRequest {
  name: string
  description?: string | null
  provider?: string | null
  amount: string
  currency_code?: string
  billing_frequency: BillingFrequency
  account_id?: string | null
  category_id?: string | null
  start_date: string
  end_date?: string | null
  next_billing_date?: string | null
  website_url?: string | null
  logo_url?: string | null
  icon?: string | null
  color?: string | null
}

export interface SubscriptionResponse {
  id: string
  name: string
  description: string | null
  provider: string | null
  amount: string
  currency_code: string
  billing_frequency: BillingFrequency
  status: SubscriptionStatus
  start_date: string
  end_date: string | null
  next_billing_date: string | null
  cancelled_date: string | null
  cancellation_reason: string | null
  annual_cost: string | null
  auto_detected: boolean
  website_url: string | null
  logo_url: string | null
  created_at: string | null
}

export interface SubscriptionSummaryResponse {
  active_count: number
  monthly_total: string
  annual_total: string
  cost_per_day: string
  subscriptions: SubscriptionResponse[]
  recommendations: string[]
}

export interface CreateCreditCardRequest {
  name: string
  account_id: string
  last_four_digits?: string | null
  card_network?: CardNetwork | null
  credit_limit?: string | null
  available_credit?: string | null
  statement_day?: number | null
  payment_due_day?: number | null
  interest_rate?: string | null
  color?: string | null
  icon?: string | null
}

export interface CreditCardResponse {
  id: string
  name: string
  account_id: string
  last_four_digits: string | null
  card_network: string | null
  credit_limit: string | null
  available_credit: string | null
  statement_day: number | null
  payment_due_day: number | null
  interest_rate: string | null
  is_active: boolean
  color: string | null
  created_at: string | null
}

export interface CardUtilizationResponse {
  credit_limit: string
  available_credit: string
  used_credit: string
  utilization_percentage: string
  status: UtilizationStatus
}

export interface UpdateCardRequest {
  name?: string
  last_four_digits?: string | null
  card_network?: string | null
  credit_limit?: string | null
  available_credit?: string | null
  statement_day?: number | null
  payment_due_day?: number | null
  interest_rate?: string | null
  is_active?: boolean
  include_in_totals?: boolean
  color?: string | null
  icon?: string | null
}

export interface CreateCardBillRequest {
  credit_card_id: string
  statement_date: string
  due_date: string
  total_amount: string
  minimum_payment?: string | null
  interest_charged?: string | null
  payment_due_day?: number | null
  notes?: string | null
}

export interface CardBillResponse {
  id: string
  credit_card_id: string
  statement_date: string
  due_date: string
  total_amount: string
  minimum_payment: string | null
  interest_charged: string | null
  payment_status: PaymentStatus
  amount_paid: string
  paid_at: string | null
  transaction_count: number
  notes: string | null
  created_at: string | null
}

export interface PayBillRequest {
  amount: number
  payment_method?: string
}

export interface UpdateBillRequest {
  total_amount?: string
  minimum_payment?: string | null
  interest_charged?: string | null
  payment_status?: PaymentStatus
  notes?: string | null
}

export interface CardsSummaryResponse {
  total_cards: number
  total_credit_limit: string
  total_available: string
  total_used: string
  overall_utilization: string
}
