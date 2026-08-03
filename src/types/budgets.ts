export type BudgetType = 'total' | 'category' | 'account'
export type BudgetPeriod = 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly'
export type BudgetStrategy = 'zero_based' | '50_30_20' | 'envelope' | 'custom'
export type BudgetStatus = 'ok' | 'warning' | 'exceeded'
export type AlertSeverity = 'info' | 'warning' | 'critical'

export interface CreateBudgetRequest {
  name: string
  amount: string
  budget_type?: BudgetType
  period?: BudgetPeriod
  start_date?: string | null
  end_date?: string | null
  category_id?: string | null
  account_id?: string | null
  alert_threshold?: number
  alert_enabled?: boolean
  auto_adjust?: boolean
  rollover?: boolean
  strategy?: BudgetStrategy | null
  description?: string | null
  icon?: string | null
  color?: string | null
}

export interface UpdateBudgetRequest {
  name?: string
  description?: string | null
  amount?: string | number
  start_date?: string | null
  end_date?: string | null
  alert_threshold?: number
  alert_enabled?: boolean
  auto_adjust?: boolean
  rollover?: boolean
  strategy?: BudgetStrategy | null
  is_active?: boolean
  icon?: string | null
  color?: string | null
}

export interface AutoAdjustRequest {
  buffer_pct?: number
  apply?: boolean
}

export interface MarkAlertReadRequest {
  alert_id?: string
  mark_all?: boolean
}

export interface BudgetResponse {
  id: string
  name: string
  description: string | null
  budget_type: string
  amount: string
  spent: string
  remaining: string
  period: string
  start_date: string
  end_date: string
  category_id: string | null
  account_id: string | null
  alert_threshold: number
  alert_enabled: boolean
  auto_adjust: boolean
  rollover: boolean
  strategy: string | null
  is_active: boolean
  pct_used: number
  status: string
  icon: string | null
  color: string | null
  created_at: string | null
  adjustment_history?: Record<string, unknown> | null
  unread_alerts?: number
}

export interface ListBudgetsResponse {
  budgets: BudgetResponse[]
  total: number
}

export interface BudgetSummaryResponse {
  total_budgets: number
  total_budget_amount: string
  total_spent: string
  total_remaining: string
  utilization_pct: string
  over_budget_count: number
  near_limit_count: number
  unread_alerts: number
  new_alerts_triggered: number
}

export interface BudgetRefreshResponse {
  id: string
  name: string
  amount: string
  spent: string
  remaining: string
  pct_used: number
  status: string
  new_alerts: number
}

export interface AutoAdjustResponse {
  message?: string
  current_amount: string
  average_spending?: string
  suggested_amount: string
  buffer_pct: number
  periods_analyzed?: number
  applied: boolean
  new_amount?: string
}

export interface AlertResponse {
  id: string
  budget_id: string
  alert_type: string
  severity: string
  title: string
  message: string
  threshold_percentage: number | null
  current_amount: string | null
  budget_amount: string | null
  is_read: boolean
  is_dismissed: boolean
  triggered_at: string | null
}

export interface ListAlertsResponse {
  alerts: AlertResponse[]
  total: number
}

export interface BudgetFilters {
  budget_type?: BudgetType
  is_active?: boolean
  period?: BudgetPeriod
}
