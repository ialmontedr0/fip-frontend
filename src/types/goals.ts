export const GOAL_TYPES = {
  savings: 'Ahorro',
  debt_payoff: 'Pago Deuda',
  investment: 'Inversion',
  emergency_fund: 'Emergencia',
  education: 'Educacion',
  retirement: 'Jubilacion',
  custom: 'Personalizado',
} as const

export type GoalType = keyof typeof GOAL_TYPES

export const GOAL_STATUSES = {
  active: 'Activa',
  completed: 'Completada',
  paused: 'Pausada',
  cancelled: 'Cancelada',
} as const

export type GoalStatus = keyof typeof GOAL_STATUSES

export const COMPOUND_FREQUENCIES = {
  daily: 'Diario',
  weekly: 'Semanal',
  biweekly: 'Quincenal',
  monthly: 'Mensual',
  quarterly: 'Trimestral',
  yearly: 'Anual',
} as const

export type CompoundFrequency = keyof typeof COMPOUND_FREQUENCIES

export interface CreateGoalRequest {
  name: string
  description?: string | null
  target_amount: string
  start_from_zero?: boolean
  goal_type?: GoalType
  start_date?: string | null
  target_date?: string | null
  monthly_contribution?: string | null
  interest_rate?: string | null
  compound_frequency?: CompoundFrequency | null
  account_id?: string | null
  category_id?: string | null
  priority?: number
  auto_contribute?: boolean
  icon?: string | null
  color?: string | null
  image_url?: string | null
}

export interface UpdateGoalRequest {
  name?: string
  description?: string | null
  target_amount?: string
  goal_type?: GoalType
  start_date?: string | null
  target_date?: string | null
  monthly_contribution?: string | null
  interest_rate?: string | null
  compound_frequency?: CompoundFrequency | null
  account_id?: string | null
  category_id?: string | null
  priority?: number
  auto_contribute?: boolean
  icon?: string | null
  color?: string | null
  image_url?: string | null
  status?: GoalStatus
}

export interface GoalProgress {
  goal_id: string
  name: string
  target_amount: string
  current_amount: string
  remaining: string
  pct_complete: number
  target_date: string
  days_left: number
  months_left: number
  monthly_needed: string
  time_pct: number
  behind_schedule: boolean
  status: string
  milestone_reached_pct: number
}

export interface GoalPrediction {
  predicted_completion_date: string | null
  predicted_probability: number | null
  recommended_monthly: string | null
  prediction_updated_at: string | null
}

export interface GoalMilestone {
  id: string
  event_type: string
  amount_at_event: string
  pct_complete: string
  contribution_amount: string | null
  notes: string | null
  created_at: string | null
}

export interface GoalResponse {
  id: string
  name: string
  description: string | null
  goal_type: string
  target_amount: string
  current_amount: string
  start_date: string
  target_date: string
  completed_date: string | null
  status: string
  priority: number
  monthly_contribution: string | null
  auto_contribute: boolean
  interest_rate: string | null
  compound_frequency: string | null
  account_id: string | null
  category_id: string | null
  icon: string | null
  color: string | null
  image_url: string | null
  milestone_reached_pct: number
  progress?: GoalProgress
  milestones?: GoalMilestone[]
  prediction?: GoalPrediction
  created_at: string | null
  updated_at: string | null
}

export interface GoalListItem {
  id: string
  name: string
  description: string | null
  goal_type: string
  target_amount: string
  current_amount: string
  pct_complete: number
  start_date: string
  target_date: string
  status: string
  priority: number
  monthly_contribution: string | null
  auto_contribute: boolean
  interest_rate: string | null
  predicted_completion_date: string | null
  predicted_probability: number | null
  recommended_monthly: string | null
  icon: string | null
  color: string | null
  image_url: string | null
  milestone_reached_pct: number
  created_at: string | null
}

export interface ListGoalsResponse {
  goals: GoalListItem[]
  total: number
}

export interface GoalSummaryResponse {
  total_goals: number
  active_goals: number
  completed_goals: number
  total_target_amount: string
  total_current_amount: string
  overall_progress_pct: number
  behind_schedule_count: number
  on_track_count: number
}

export interface GoalFilters {
  goal_type?: GoalType
  status?: GoalStatus
  priority?: number
}

export interface SimulationIncomeSource {
  name: string
  amount: number
  frequency: 'monthly' | 'quarterly' | 'quadrimestral' | 'yearly' | 'one_time'
  start_month?: number
  end_month?: number
  growth_rate?: number
}

export interface SimulationExpenseProjection {
  name: string
  amount: number
  frequency: 'monthly' | 'quarterly' | 'quadrimestral' | 'yearly' | 'one_time'
  start_month?: number
  end_month?: number
  growth_rate?: number
}

export interface CreateSimulationRequest {
  name: string
  monthly_contribution: string
  lump_sum?: string | null
  lump_sum_date?: string | null
  interest_rate?: string | null
  increase_pct?: string | null
  inflation_rate?: string | null
  income_sources?: SimulationIncomeSource[]
  expenses?: SimulationExpenseProjection[]
  enable_monte_carlo?: boolean
  notes?: string | null
  preview?: boolean
}

export interface SimulationProjection {
  month: number
  contribution: number
  interest: number
  cumulative: number
  income_contribution?: number
  inflation_adjusted_target?: number
  date: string
}

export interface MonteCarloPoint {
  month: number
  p5: number
  p25: number
  p50: number
  p75: number
  p95: number
}

export interface RecommendationPoint {
  contribution: number
  probability: number
  months: number
}

export interface SimulationResponse {
  id: string | null
  saved?: boolean
  name: string
  goal_id: string
  goal_name: string
  starting_amount?: string
  monthly_contribution: string
  lump_sum: string | null
  lump_sum_date: string | null
  interest_rate: string | null
  increase_pct: string | null
  inflation_rate: string | null
  income_sources?: SimulationIncomeSource[]
  expenses?: SimulationExpenseProjection[]
  predicted_completion_date: string | null
  predicted_probability: number | null
  total_contributions: string
  total_interest: string
  total_income_used?: string
  months_to_complete: number
  projection: SimulationProjection[]
  monte_carlo?: MonteCarloPoint[]
  recommendations?: RecommendationPoint[]
  notes: string | null
  created_at: string | null
}

export interface SimulationListItem {
  id: string
  name: string
  monthly_contribution: string
  lump_sum: string | null
  interest_rate: string | null
  increase_pct: string | null
  inflation_rate?: string | null
  predicted_completion_date: string | null
  predicted_probability: number | null
  total_contributions: string | null
  months_to_complete: number | null
  notes: string | null
  created_at: string | null
}

export interface ListSimulationsResponse {
  goal_id: string
  goal_name: string
  simulations: SimulationListItem[]
  total: number
}

export interface RefreshGoalResponse {
  id: string
  name: string
  target_amount: string
  current_amount: string
  status: string
  progress: GoalProgress
  prediction: GoalPrediction
}

export interface RefreshPredictionResponse {
  goal_id: string
  name: string
  prediction: GoalPrediction
}
