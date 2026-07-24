// ================================================================================
// Dashboard response types
// ================================================================================

export interface DashboardResponse {
  kpis: MonthlyKPIs
  net_worth: NetWorthResponse
  portfolio: PortfolioKPIs
  cash_flow: CashFlowResponse
  top_categories: TopCategoriesResponse
  spending_trend: TrendResponse
  upcoming_payments: UpcomingPayment[]
  goals: GoalProgress[]
}

export interface MonthlyKPIs {
  period: { year: number; month: number; start: string; end: string }
  total_income: number
  total_expenses: number
  net_flow: number
  savings_rate: number
  transaction_count: number
  average_transaction: number
  comparison: {
    prev_income: number
    prev_expenses: number
    income_change_pct: number
    expense_change_pct: number
  }
}

export interface NetWorthResponse {
  net_worth: number
  total_assets: number
  total_liabilities: number
  credit_card_debt: number
  assets_by_type: Record<
    string,
    { total: number; accounts: Array<{ name: string; balance: number; currency: string }> }
  >
  liabilities_by_type: Record<
    string,
    { total: number; loans: Array<{ name: string; balance: number; monthly_payment: number }> }
  >
}

export interface PortfolioKPIs {
  net_worth: number
  total_assets: number
  total_liabilities: number
  debt_to_income: number
  total_month_debt_payments: number
  avg_monthly_income: number
  active_budgets: number
  active_goals: number
  active_loans: number
}

export interface CashFlowResponse {
  start: string
  end: string
  data: CashFlowItem[]
  summary: {
    total_income: number
    total_expenses: number
    net_flow: number
    months: number
    positive_months: number
    negative_months: number
  }
}

export interface CashFlowItem {
  month: string
  income: number
  expenses: number
  net_flow: number
  is_positive: boolean
}

export interface TopCategoriesResponse {
  transaction_type: string
  start: string
  end: string
  top_categories: CategoryBreakdownItem[]
}

export interface CategoryBreakdownItem {
  category: string
  icon: string | null
  color: string | null
  total: number
  count: number
  percentage: number
}

export interface TrendResponse {
  period: string
  start: string
  end: string
  data: TrendItem[]
  summary: {
    total_spent?: number
    total_income?: number
    average: number
    max?: number
    min?: number
    periods: number
  }
}

export interface TrendItem {
  period: string
  total: number
  count: number
}

export interface UpcomingPayment {
  name: string
  payment: number
  due_date: string | null
}

export interface GoalProgress {
  name: string
  target: number
  current: number
  progress_pct: number
  target_date: string | null
}

// ================================================================================
// Query params
// ================================================================================

export interface DateRangeParams {
  start_date?: string
  end_date?: string
}
