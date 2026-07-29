export interface ClassifyResponse {
  predicted_category: string | null
  confidence: number
  model_version: string
  reason: string
  features_used: Record<string, unknown>
}

export interface BatchClassifyResponse {
  classified: number
  total_checked: number
  model_version: string
  results: BatchClassifyResult[]
  reason?: string
}
export interface BatchClassifyResult {
  transaction_id: string
  description: string
  predicted_category: string
  confidence: number
}

export interface TrainClassifierResponse {
  success: boolean
  model_id: string | null
  model_version: string
  accuracy: number
  samples: number
  categories: number
  duration_seconds: number
  report: Record<string, unknown>
  error: string | null
}

export interface ClassifierStatus {
  is_trained: boolean
  model_version: string
}

export interface PredictResponse {
  predicted_amount: number
  confidence: number
  model_version: string
  reason: string
  features_used: Record<string, unknown>
}

export interface TrainPredictorResponse {
  success: boolean
  model_id: string | null
  model_version: string
  target_type: string
  model_type?: string
  r2: number
  mse: number
  mae: number
  samples: number
  months_used: number
  duration_seconds: number
  error: string | null
}

export interface AnomalyItem {
  transaction_id: string
  description?: string
  amount?: number
  transaction_type?: string
  effective_date?: string
  anomaly_score?: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  reason: string
}
export interface AnomalyDetectResponse {
  anomalies: AnomalyItem[]
  total_anomalies: number
  model_version: string
  reason: string
}
export interface AnomalyHistoryItem {
  id: string
  predicted_value: string
  confidence: number | null
  reason: string
  created_at: string
}
export interface AnomalyHistoryResponse {
  anomalies: AnomalyHistoryItem[]
  total: number
}

export interface RecommendationItem {
  type: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  estimated_savings: number
  confidence: number
  features_used?: Record<string, unknown>
}
export interface RecommendationsResponse {
  recommendations: RecommendationItem[]
  total: number
  high_priority: number
  estimated_total_savings: number
}
export interface RecommendationHistoryItem {
  id: string
  predicted_value: string
  reason: string
  confidence: number | null
  created_at: string
}
export interface RecommendationHistoryResponse {
  recommendations: RecommendationHistoryItem[]
  total: number
}

export interface ModelItem {
  id: string
  model_type: string
  version: string
  status: 'pending' | 'training' | 'completed' | 'failed' | 'deprecated'
  is_production: boolean
  accuracy: number | null
  training_samples: number | null
  created_at: string
}
export interface ModelListResponse {
  models: ModelItem[]
}
export interface ModelDetail {
  id: string
  model_type: string
  version: string
  status: string
  is_production: boolean
  accuracy: number | null
  precision_score: number | null
  recall_score: number | null
  f1_score: number | null
  mse: number | null
  mae: number | null
  training_samples: number | null
  hyperparameters: Record<string, unknown> | null
  feature_names: Record<string, unknown> | null
  error_message: string | null
  created_at: string
}

export interface HabitFrequency {
  transactions_per_week: number
  unique_days: number
  total_transactions: number
  frequency_score: number
  frequency_label: string
}
export interface SpendingPatterns {
  weekday_transactions: number
  weekend_transactions: number
  avg_weekday_amount: number
  avg_weekend_amount: number
  weekend_transaction_share: number
  weekend_amount_share: number
  high_weekend_spending: boolean
}
export interface HabitStability {
  cv: number
  label: string
  months_of_data: number
}
export interface CategoryDominance {
  total: number
  share: number
  rank: number
  is_dominant: boolean
}
export interface DetectedRecurring {
  category_id: string
  approximate_amount: number
  occurrences: number
  avg_days_between: number
  confidence: number
}
export interface HabitRecommendation {
  type: string
  title: string
  description: string
  priority: string
  estimated_savings: number
  confidence: number
  category?: string
  features_used?: Record<string, unknown>
}
export interface HabitAnalysis {
  spending_frequency: Record<string, HabitFrequency>
  spending_patterns: SpendingPatterns
  habit_stability: Record<string, HabitStability>
  category_dominance: Record<string, CategoryDominance>
  detected_recurring: DetectedRecurring[]
  overall_habit_score: number
  recommendations: HabitRecommendation[]
}
export interface HabitAnalysisResponse {
  habits: HabitAnalysis
  overall_habit_score: number
  total_recommendations: number
}
export interface CategoryTrend {
  monthly_data: Record<string, number>
  total: number
  average: number
  trend: 'increasing' | 'decreasing' | 'stable' | 'insufficient_data'
  change_percentage: number
}
export interface HabitTrendsResponse {
  trends: Record<string, CategoryTrend>
  months_analyzed: number
}

export interface RiskFactor {
  factor: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  metric: number
}
export interface RiskMetrics {
  income_volatility: { cv: number; label: string; avg_monthly: number; months: number }
  expense_volatility: { cv: number; label: string; avg_monthly: number; months: number }
  debt_to_income: { ratio: number; label: string; monthly_payment: number; avg_monthly_income: number; active_loans: number }
  emergency_fund: { months_covered: number; label: string; balance: number; avg_monthly_expense: number; target_months: number }
  budget_risk: { overrun_count: number; total_budgets: number; risk_ratio: number; label: string }
  subscription_creep: { total_monthly: number; annual_cost: number; subscription_count: number; recent_count: number; growth_percentage: number; label: string }
}
export interface RiskRecommendation {
  type: string
  title: string
  description: string
  priority: string
  estimated_savings: number
  confidence: number
  risk_factor: string
}
export interface RiskAssessmentResponse {
  financial_health_score: number
  risk_factors: RiskFactor[]
  metrics: RiskMetrics
  recommendations: RiskRecommendation[]
}
export interface HealthScoreResponse {
  financial_health_score: number
  risk_count: number
  top_risk: RiskFactor | null
}

export interface Allocation50_30_20 {
  total_income: number
  total_expenses: number
  actual_savings: number
  actual: { needs_pct: number; wants_pct: number; savings_pct: number }
  recommended: { needs_pct: number; wants_pct: number; savings_pct: number }
  deviation: { needs_diff: number; wants_diff: number; savings_diff: number }
}
export interface GoalAllocationGoal {
  goal_id: string
  goal_name: string
  goal_type: string
  target_amount: number
  current_amount: number
  remaining: number
  progress_pct: number
  priority: number
  priority_weight: number
  recommended_monthly: number
  target_date: string | null
}
export interface GoalAllocation {
  goals: GoalAllocationGoal[]
  total_recommended_monthly: number
  strategy: string
}
export interface DebtStrategyLoan {
  loan_id: string
  name: string
  balance: number
  interest_rate: number
  monthly_payment: number
}
export interface DebtStrategy {
  strategy: string
  snowball_order: string[]
  avalanche_order: string[]
  estimated_savings_avalanche_vs_snowball: number
  loans: DebtStrategyLoan[]
}
export interface SeasonalMonth {
  total: number
  vs_average: number
  vs_average_pct: number
  is_cheaper: boolean
}
export interface SeasonalOpportunities {
  months: Record<number, SeasonalMonth>
  best_months: number[]
  worst_months: number[]
  average_monthly: number
}
export interface SavingsRecommendation {
  type: string
  title: string
  description: string
  priority: string
  estimated_savings: number
  confidence: number
  category: string
  details?: GoalAllocationGoal[]
}
export interface SavingsOptimizeResponse {
  allocation_50_30_20: Allocation50_30_20
  goal_allocation: GoalAllocation
  debt_strategy: DebtStrategy
  seasonal_opportunities: SeasonalOpportunities
  estimated_total_savings: number
  recommendations: SavingsRecommendation[]
}

export interface ProjectionMonth {
  month: number
  contribution: number
  interest: number
  balance: number
}
export interface SavingsSimulateResponse {
  monthly_amount: number
  months: number
  annual_return_pct: number
  final_balance: number
  total_contributed: number
  total_interest: number
  projections: ProjectionMonth[]
}

export interface ExplanationResponse {
  headline: string
  why: string
  how: string
  impact: string
  action: string
  tone: 'urgent' | 'concerned' | 'encouraging' | 'informative'
  personalized: boolean
  rec_type: string
  priority: string
  estimated_savings: number
  confidence: number
}

export interface AIDashboardHabits {
  score: number
  patterns: SpendingPatterns
  stability: Record<string, HabitStability>
  recommendations_count: number
}
export interface AIDashboardRisks {
  health_score: number
  risk_factors: RiskFactor[]
  metrics: RiskMetrics
  recommendations_count: number
}
export interface AIDashboardSavings {
  allocation: Allocation50_30_20
  goal_allocation: GoalAllocation
  debt_strategy: DebtStrategy
  estimated_total_savings: number
  recommendations_count: number
}
export interface AIDashboardRecommendations {
  total: number
  high_priority: number
  estimated_total_savings: number
}
export interface AIDashboardResponse {
  habits: AIDashboardHabits
  risks: AIDashboardRisks
  savings: AIDashboardSavings
  recommendations: AIDashboardRecommendations
}

export interface ExplainParams {
  rec_type: string
  title?: string
  description?: string
  priority?: string
  estimated_savings?: number
  confidence?: number
}

export interface SavingsSimulateParams {
  monthly_amount?: number
  months?: number
  annual_return_pct?: number
}

export interface LatestRecommendationsResponse {
  recommendations: RecommendationItem[]
  total: number
  high_priority: number
  estimated_total_savings: number
  last_generated_at: string | null
  has_new_transactions: boolean
  has_batch: boolean
}

export interface TrainingStatus {
  status: 'idle' | 'pending' | 'training' | 'completed' | 'failed'
  error?: string
}
