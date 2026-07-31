export const CARD_NETWORKS = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'American Express',
} as const

export type CardNetwork = keyof typeof CARD_NETWORKS

export const CARD_LIMIT_TYPES = {
  daily: 'Diario',
  weekly: 'Semanal',
  monthly: 'Mensual',
  category: 'Categoria',
} as const

export type CardLimitType = keyof typeof CARD_LIMIT_TYPES

export const UTILIZATION_STATUS = {
  healthy: 'Saludable',
  warning: 'Precaucion',
  danger: 'Critico',
} as const

export type UtilizationStatus = keyof typeof UTILIZATION_STATUS

export const BILL_PAYMENT_STATUS = {
  pending: 'Pendiente',
  partial: 'Parcial',
  paid: 'Pagado',
  overdue: 'Vencido',
  waived: 'Condolido',
} as const

export type BillPaymentStatus = keyof typeof BILL_PAYMENT_STATUS

export const CARD_PAYMENT_METHODS = {
  manual: 'Manual',
  auto: 'Automatico',
  transfer: 'Transferencia',
  cash: 'Efectivo',
} as const

export type CardPaymentMethod = keyof typeof CARD_PAYMENT_METHODS

export const ALERT_TYPES = {
  high_utilization: 'Alta Utilizacion',
  limit_approaching: 'Limite Proximo',
  due_date_approaching: 'Vencimiento Proximo',
  payment_overdue: 'Pago Vencido',
} as const

export type AlertType = keyof typeof ALERT_TYPES

export const ALERT_SEVERITY = {
  warning: 'Advertencia',
  critical: 'Critico',
} as const

export type AlertSeverity = keyof typeof ALERT_SEVERITY

export const SPEND_LIMIT_STATUS = {
  ok: 'Ok',
  warning: 'Precaucion',
  exceeded: 'Excedido',
} as const

export type SpendLimitStatus = keyof typeof SPEND_LIMIT_STATUS

export interface CreateCardRequest {
  name: string
  account_id?: string | null
  last_four_digits?: string | null
  card_network?: CardNetwork | null
  currency_code?: string
  is_multicurrency?: boolean
  secondary_currency_code?: string | null
  secondary_credit_limit?: string | null
  secondary_available_credit?: string | null
  credit_limit?: string | null
  available_credit?: string | null
  statement_day?: number | null
  payment_due_day?: number | null
  interest_rate?: string | null
  color?: string | null
  icon?: string | null
}

export interface UpdateCardRequest {
  name?: string
  last_four_digits?: string | null
  card_network?: CardNetwork | null
  currency_code?: string
  is_multicurrency?: boolean
  secondary_currency_code?: string | null
  secondary_credit_limit?: string | null
  secondary_available_credit?: string | null
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

export interface CardUtilization {
  credit_limit: string
  available_credit: string
  used_credit: string
  used_in_cycle: string
  utilization_percentage: string
  status: UtilizationStatus
  period_start: string
  period_end: string
}

export interface CardResponse {
  id: string
  name: string
  account_id: string | null
  last_four_digits: string | null
  card_network: string | null
  currency_code: string
  is_multicurrency: boolean
  secondary_currency_code: string | null
  secondary_credit_limit: string | null
  secondary_available_credit: string | null
  credit_limit: string | null
  available_credit: string | null
  statement_day: number | null
  payment_due_day: number | null
  interest_rate: string | null
  is_active: boolean
  include_in_totals: boolean
  color: string | null
  icon: string | null
  utilization?: CardUtilization
  unread_alerts?: number
  created_at: string | null
  updated_at: string | null
}

export interface CardListItem {
  id: string
  name: string
  account_id: string | null
  last_four_digits: string | null
  card_network: string | null
  currency_code: string
  is_multicurrency: boolean
  secondary_currency_code: string | null
  secondary_credit_limit: string | null
  secondary_available_credit: string | null
  credit_limit: string | null
  available_credit: string | null
  statement_day: number | null
  payment_due_day: number | null
  interest_rate: string | null
  is_active: boolean
  color: string | null
  created_at: string | null
}

export interface CardSummaryResponse {
  total_cards: number
  total_credit_limit: string
  total_used_credit: string
  total_available_credit: string
  average_utilization_pct: string
  unpaid_bills: number
  total_minimum_payment: string
  unread_alerts: number
  cards: Array<{
    id: string
    name: string
    last_four_digits: string | null
    card_network: string | null
    currency_code: string
    credit_limit: string | null
    is_active: boolean
    color: string | null
  }>
}

export interface ListCardsResponse {
  cards: CardListItem[]
  total: number
}

export interface UtilizationHistoryEntry {
  month: string
  spent: string
  credit_limit: string
  utilization_pct: string
  status: UtilizationStatus
}

export interface UtilizationHistoryResponse {
  credit_card_id: string
  current: CardUtilization
  history: UtilizationHistoryEntry[]
  months: number
}

export interface SpendingCategoryEntry {
  category_id: string | null
  category_name: string | null
  total: string
  transaction_count: number
}

export interface SpendingByCategoryResponse {
  credit_card_id: string
  period_start: string | null
  period_end: string | null
  total_spent: string
  categories: SpendingCategoryEntry[]
}

export interface CreateBillRequest {
  statement_date: string
  due_date: string
  total_amount: string
  minimum_payment?: string | null
  interest_charged?: string | null
  notes?: string | null
}

export interface UpdateBillRequest {
  total_amount?: string
  minimum_payment?: string | null
  interest_charged?: string | null
  payment_status?: BillPaymentStatus
  notes?: string | null
}

export interface PayBillRequest {
  amount: number
  payment_method?: CardPaymentMethod
}

export interface BillResponse {
  id: string
  credit_card_id: string
  statement_date: string
  due_date: string
  total_amount: string
  minimum_payment: string | null
  interest_charged: string | null
  payment_status: BillPaymentStatus
  amount_paid: string
  paid_at: string | null
  transaction_count: number
  notes: string | null
  created_at: string | null
  updated_at?: string | null
}

export interface PayBillResponse {
  id: string
  credit_card_id: string
  statement_date: string
  due_date: string
  total_amount: string
  amount_paid: string
  payment_status: BillPaymentStatus
  paid_at: string | null
  payment_amount: string
  payment_method: CardPaymentMethod
}

export interface ListBillsResponse {
  bills: BillResponse[]
  total: number
  credit_card_id: string
}

export interface CreateSpendingLimitRequest {
  limit_type: CardLimitType
  limit_amount: string
  category_id?: string | null
  alert_threshold?: number
  alert_enabled?: boolean
  description?: string | null
}

export interface UpdateSpendingLimitRequest {
  limit_amount?: string
  alert_threshold?: number
  alert_enabled?: boolean
  description?: string | null
  is_active?: boolean
}

export interface SpendingLimitResponse {
  id: string
  credit_card_id: string
  limit_type: CardLimitType
  limit_amount: string
  spent_amount: string
  remaining?: string
  pct_used?: number
  status?: SpendLimitStatus
  category_id: string | null
  alert_threshold: number
  alert_enabled: boolean
  description: string | null
  is_active: boolean
  period_start?: string | null
  period_end?: string | null
  created_at: string | null
  updated_at?: string | null
}

export interface ListSpendingLimitsResponse {
  limits: SpendingLimitResponse[]
  total: number
}

export interface CardAlertResponse {
  id: string
  credit_card_id: string
  credit_card_bill_id: string | null
  alert_type: AlertType
  severity: AlertSeverity
  title: string
  message: string
  threshold_percentage: number | null
  current_amount: string | null
  limit_amount: string | null
  is_read: boolean
  is_dismissed: boolean
  triggered_at: string | null
}

export interface ListCardAlertsResponse {
  alerts: CardAlertResponse[]
  total: number
}

export interface MarkAlertReadRequest {
  alert_id?: string
  mark_all?: boolean
}

export interface CheckAlertsResponse {
  new_alerts: number
  unread_alerts: number
  alerts_created: Array<{
    id: string
    alert_type: string
    severity: string
    title: string
  }>
}

export interface CardAlertsFilters {
  credit_card_id?: string
  is_read?: boolean
  alert_type?: AlertType
  severity?: AlertSeverity
}

export interface GenerateStatementResponse {
  id: string
  credit_card_id: string
  statement_date: string
  due_date: string
  total_amount: string
  minimum_payment: string | null
  interest_charged: string | null
  transaction_count: number
  payment_status: 'pending'
}

export interface QuickCardPaymentRequest {
  card_id: string
  payment_account_id: string
  payment_type?: 'full' | 'partial'
  days_before_due?: number
  name?: string | null
}
