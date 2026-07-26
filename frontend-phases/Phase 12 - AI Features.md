# Phase 12 — AI Features (Inteligencia Artificial)

## Objective
Build a complete AI subsystem in the frontend that consumes the 23 backend AI endpoints to provide intelligent financial insights: transaction classification, expense/income prediction, anomaly detection, personalized recommendations, habit analysis, risk assessment, savings optimization, savings simulation, and explainable recommendations.

---

## Architecture & Routing

### Pages
| Route | Page Component | Purpose |
|---|---|---|
| `/ai` | `AIPage` or redirect to `/ai/dashboard` | AI root |
| `/ai/dashboard` | `AIDashboardPage` | Aggregated AI overview (habits score, risks, savings summary, recs count) |
| `/ai/classify` | `AIClassifyPage` | Single + batch classification, train classifier |
| `/ai/predict` | `AIPredictPage` | Expense/income prediction + train predictor |
| `/ai/anomalies` | `AIAnomaliesPage` | Anomaly detection results + history |
| `/ai/recommendations` | `AIRecommendationsPage` | Full recommendations feed with explanations |
| `/ai/habits` | `AIHabitsPage` | Spending habits dashboard (score gauge, radar, breakdown) |
| `/ai/risks` | `AIRisksPage` | Risk assessment (health gauge, factors, recs) |
| `/ai/savings` | `AISavingsPage` | Savings optimizer (50/30/20 viz, debt strategy) |
| `/ai/savings/simulate` | `AISavingsSimulatorPage` | Savings simulator with projection chart |
| `/ai/models` | `AIModelsPage` | Model registry (list, promote, view metrics) |

### Nav Structure (under `/ai`)
```
AI
├── Dashboard (/)          → aggregated overview
├── Classify               → classify transactions
├── Predict                → predict income/expenses
├── Anomalies              → anomaly detection
├── Recommendations        → AI recommendations feed
├── Habits                 → spending habits
├── Risks                  → risk assessment
├── Savings                → savings optimizer + simulator
└── Models                 → model registry
```

### Data Flow
```
Pages call custom hooks (useAIClassify, useAIAnomalies, useAIHabits, etc.)
  → Hooks use TanStack Query (useQuery / useMutation)
    → API functions in features/ai/api/ai.ts
      → Axios client (lib/api.ts)
        → Backend /api/v1/ai/* endpoints
```

### Component Tree (AIDashboardPage)
```
AIDashboardPage
├── PageHeader (title + nav tabs)
├── ScoreGrid
│   ├── HabitScoreCard (circular gauge, 0-100)
│   ├── HealthScoreCard (circular gauge, 0-100)
│   ├── SavingsSummaryCard
│   └── RecommendationsSummaryCard
├── QuickActions (classify, predict, detect anomalies, train)
└── RecentInsights (mini feed of latest recommendations/anomalies)
```

---

## Backend API Reference — All 23 Endpoints

### 1. Classification
| Method | Path | Query/Body | Response |
|---|---|---|---|
| `POST` | `/api/v1/ai/classify` | `transaction_id: UUID`, `description: str`, `category_id: UUID?` | `{predicted_category: str\|None, confidence: float, model_version: str, reason: str, features_used: object}` |
| `POST` | `/api/v1/ai/classify/batch` | _none_ | `{classified: int, total_checked: int, model_version: str, results: [{transaction_id, description, predicted_category, confidence}]}` |
| `POST` | `/api/v1/ai/train/classifier` | _none_ | `{success: bool, model_id: str\|None, model_version: str, accuracy: float, samples: int, categories: int, duration_seconds: float, report: object, error: str\|None}` |
| `GET` | `/api/v1/ai/classifier/status` | _none_ | `{is_trained: bool, model_version: str}` |

### 2. Prediction
| Method | Path | Query/Body | Response |
|---|---|---|---|
| `POST` | `/api/v1/ai/predict/expenses` | _none_ | `{predicted_amount: float, confidence: float, model_version: str, reason: str, features_used: object}` |
| `POST` | `/api/v1/ai/predict/income` | _none_ | Same shape as expenses |
| `POST` | `/api/v1/ai/train/predictor` | `target_type: str = "expense"` | `{success: bool, model_id: str\|None, model_version: str, target_type: str, r2: float, mse: float, mae: float, samples: int, months_used: int, duration_seconds: float, error: str\|None}` |

### 3. Anomaly Detection
| Method | Path | Query/Body | Response |
|---|---|---|---|
| `POST` | `/api/v1/ai/anomalies/detect` | _none_ | `{anomalies: [{transaction_id, description, amount, transaction_type, effective_date, anomaly_score, severity, reason}], total_anomalies: int, model_version: str, reason: str}` |
| `GET` | `/api/v1/ai/anomalies/history` | `limit: int = 20` | `{anomalies: [{id, predicted_value, confidence, reason, created_at}], total: int}` |

### 4. Recommendations
| Method | Path | Query/Body | Response |
|---|---|---|---|
| `POST` | `/api/v1/ai/recommendations` | _none_ | `{recommendations: [{type, title, description, priority, estimated_savings, confidence, features_used}], total: int, high_priority: int, estimated_total_savings: float}` |
| `GET` | `/api/v1/ai/recommendations/history` | `limit: int = 20` | `{recommendations: [{id, predicted_value, reason, confidence, created_at}], total: int}` |

### 5. Models
| Method | Path | Query/Body | Response |
|---|---|---|---|
| `GET` | `/api/v1/ai/models` | `model_type: str?` | `{models: [{id, model_type, version, status, is_production, accuracy, training_samples, created_at}]}` |
| `GET` | `/api/v1/ai/models/{id}` | _none_ | Full model detail (accuracy, precision, recall, f1, mse, mae, hyperparameters, feature_names, error_message) |
| `POST` | `/api/v1/ai/models/{id}/promote` | _none_ | `{id, model_type, version, is_production, message}` |
| `DELETE` | `/api/v1/ai/predictions/{id}` | _none_ | `{message: "Prediction deleted"}` |

### 6. Habits
| Method | Path | Query/Body | Response |
|---|---|---|---|
| `GET` | `/api/v1/ai/habits/analysis` | `months: int = 6` | `{habits: {spending_frequency, spending_patterns, habit_stability, category_dominance, detected_recurring, overall_habit_score, recommendations}, overall_habit_score: int, total_recommendations: int}` |
| `GET` | `/api/v1/ai/habits/trends` | `months: int = 6` | `{trends: {[category]: {monthly_data, total, average, trend, change_percentage}}, months_analyzed: int}` |

### 7. Risks
| Method | Path | Query/Body | Response |
|---|---|---|---|
| `GET` | `/api/v1/ai/risks/assessment` | _none_ | `{financial_health_score: int, risk_factors: [{factor, severity, title, description, metric}], metrics: {income_volatility, expense_volatility, debt_to_income, emergency_fund, budget_risk, subscription_creep}, recommendations: [{type, title, description, priority, estimated_savings, confidence, risk_factor}]}` |
| `GET` | `/api/v1/ai/risks/health-score` | _none_ | `{financial_health_score: int, risk_count: int, top_risk: {factor, severity, title, description, metric}\|None}` |

### 8. Savings
| Method | Path | Query/Body | Response |
|---|---|---|---|
| `POST` | `/api/v1/ai/savings/optimize` | _none_ | `{allocation_50_30_20: {total_income, total_expenses, actual_savings, actual: {needs_pct, wants_pct, savings_pct}, recommended: {needs_pct:50, wants_pct:30, savings_pct:20}, deviation: {needs_diff, wants_diff, savings_diff}}, goal_allocation: {goals: [{goal_id, goal_name, goal_type, target_amount, current_amount, remaining, progress_pct, priority, priority_weight, recommended_monthly, target_date}], total_recommended_monthly, strategy}, debt_strategy: {strategy, snowball_order, avalanche_order, estimated_savings_avalanche_vs_snowball, loans}, seasonal_opportunities: {months: {[m]: {total, vs_average, vs_average_pct, is_cheaper}}, best_months, worst_months, average_monthly}, estimated_total_savings: float, recommendations: [{type, title, description, priority, estimated_savings, confidence, category}]}` |
| `POST` | `/api/v1/ai/savings/simulate` | `monthly_amount: float=5000, months: int=12, annual_return_pct: float=0.0` | `{monthly_amount, months, annual_return_pct, final_balance, total_contributed, total_interest, projections: [{month, contribution, interest, balance}]}` |

### 9. Explanations
| Method | Path | Query/Body | Response |
|---|---|---|---|
| `POST` | `/api/v1/ai/explain` | `rec_type: str, title: str, description: str, priority: str, estimated_savings: float, confidence: float` | `{headline, why, how, impact, action, tone, personalized, rec_type, priority, estimated_savings, confidence}` |

### 10. Dashboard
| Method | Path | Query/Body | Response |
|---|---|---|---|
| `GET` | `/api/v1/ai/dashboard` | _none_ | `{habits: {score, patterns, stability, recommendations_count}, risks: {health_score, risk_factors, metrics, recommendations_count}, savings: {allocation, goal_allocation, debt_strategy, estimated_total_savings, recommendations_count}, recommendations: {total, high_priority, estimated_total_savings}}` |

---

## Implementation Plan — File Inventory

### Types (`src/types/ai.ts`)
Create a new file **`src/types/ai.ts`** with ALL TypeScript interfaces matching the backend response shapes.

```typescript
// src/types/ai.ts

// ── Classification ──────────────────────────────
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

// ── Prediction ───────────────────────────────────
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
  r2: number
  mse: number
  mae: number
  samples: number
  months_used: number
  duration_seconds: number
  error: string | null
}

// ── Anomalies ────────────────────────────────────
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

// ── Recommendations ──────────────────────────────
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

// ── Models ────────────────────────────────────────
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

// ── Habits ────────────────────────────────────────
export interface HabitFrequency {
  transactions_per_week: number
  unique_days: number
  total_transactions: number
  frequency_score: number
  frequency_label: string // diario | frecuente | regular | ocasional | sin actividad
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
  label: string // muy_estable | estable | variable | muy_variable
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

// ── Risks ─────────────────────────────────────────
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

// ── Savings ───────────────────────────────────────
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

// ── Explanations ──────────────────────────────────
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

// ── AI Dashboard ──────────────────────────────────
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

// ── Params ────────────────────────────────────────
export interface ExplainParams {
  rec_type: string
  title?: string
  description?: string
  priority?: string
  estimated_savings?: number
  confidence?: number
}

export interface SavingsSimulateParams {
  monthly_amount?: number   // default 5000
  months?: number           // default 12
  annual_return_pct?: number // default 0.0
}

export interface TrainingStatus {
  status: 'idle' | 'pending' | 'training' | 'completed' | 'failed'
  error?: string
}
```

### API Layer (`src/features/ai/api/ai.ts`)

```typescript
import api from '@/lib/api'
import type {
  ClassifyResponse, BatchClassifyResponse,
  TrainClassifierResponse, ClassifierStatus,
  PredictResponse, TrainPredictorResponse,
  AnomalyDetectResponse, AnomalyHistoryResponse,
  RecommendationsResponse, RecommendationHistoryResponse,
  ModelListResponse, ModelDetail,
  HabitAnalysisResponse, HabitTrendsResponse,
  RiskAssessmentResponse, HealthScoreResponse,
  SavingsOptimizeResponse, SavingsSimulateResponse,
  ExplanationResponse,
  AIDashboardResponse,
  ExplainParams, SavingsSimulateParams,
} from '@/types/ai'

export function classifyTransaction(transaction_id: string, description: string, category_id?: string) {
  return api.post<ClassifyResponse>('/ai/classify', null, {
    params: { transaction_id, description, category_id },
  })
}

export function classifyBatch() {
  return api.post<BatchClassifyResponse>('/ai/classify/batch')
}

export function trainClassifier() {
  return api.post<TrainClassifierResponse>('/ai/train/classifier')
}

export function getClassifierStatus() {
  return api.get<ClassifierStatus>('/ai/classifier/status')
}

export function predictExpenses() {
  return api.post<PredictResponse>('/ai/predict/expenses')
}

export function predictIncome() {
  return api.post<PredictResponse>('/ai/predict/income')
}

export function trainPredictor(target_type: string = 'expense') {
  return api.post<TrainPredictorResponse>('/ai/train/predictor', null, {
    params: { target_type },
  })
}

export function detectAnomalies() {
  return api.post<AnomalyDetectResponse>('/ai/anomalies/detect')
}

export function getAnomalyHistory(limit: number = 20) {
  return api.get<AnomalyHistoryResponse>('/ai/anomalies/history', {
    params: { limit },
  })
}

export function getRecommendations() {
  return api.post<RecommendationsResponse>('/ai/recommendations')
}

export function getRecommendationHistory(limit: number = 20) {
  return api.get<RecommendationHistoryResponse>('/ai/recommendations/history', {
    params: { limit },
  })
}

export function listModels(model_type?: string) {
  return api.get<ModelListResponse>('/ai/models', {
    params: model_type ? { model_type } : undefined,
  })
}

export function getModelDetail(model_id: string) {
  return api.get<ModelDetail>(`/ai/models/${model_id}`)
}

export function promoteModel(model_id: string) {
  return api.post<{ id: string; model_type: string; version: string; is_production: boolean; message: string }>(
    `/ai/models/${model_id}/promote`,
  )
}

export function deletePrediction(prediction_id: string) {
  return api.delete<{ message: string }>(`/ai/predictions/${prediction_id}`)
}

export function getHabitAnalysis(months: number = 6) {
  return api.get<HabitAnalysisResponse>('/ai/habits/analysis', {
    params: { months },
  })
}

export function getHabitTrends(months: number = 6) {
  return api.get<HabitTrendsResponse>('/ai/habits/trends', {
    params: { months },
  })
}

export function getRiskAssessment() {
  return api.get<RiskAssessmentResponse>('/ai/risks/assessment')
}

export function getHealthScore() {
  return api.get<HealthScoreResponse>('/ai/risks/health-score')
}

export function optimizeSavings() {
  return api.post<SavingsOptimizeResponse>('/ai/savings/optimize')
}

export function simulateSavings(params: SavingsSimulateParams) {
  return api.post<SavingsSimulateResponse>('/ai/savings/simulate', null, { params })
}

export function getExplanation(params: ExplainParams) {
  return api.post<ExplanationResponse>('/ai/explain', null, { params })
}

export function getAIDashboard() {
  return api.get<AIDashboardResponse>('/ai/dashboard')
}
```

### Hooks (`src/features/ai/hooks/useAI.ts`)

Structure each hook as a custom hook using TanStack Query.

**Pattern for mutations** (classify, batch classify, train, predict, detect anomalies, get recommendations, optimize, simulate, explain):
```typescript
export function useClassifyTransaction() {
  return useMutation({
    mutationFn: ({ transaction_id, description, category_id }: { transaction_id: string; description: string; category_id?: string }) =>
      classifyTransaction(transaction_id, description, category_id).then(r => r.data),
  })
}
```

**Pattern for queries** (status, history, habits, risks, models, dashboard):
```typescript
export function useHabitAnalysis(months: number = 6) {
  return useQuery({
    queryKey: ['ai', 'habits', months],
    queryFn: () => getHabitAnalysis(months).then(r => r.data),
    staleTime: 1000 * 60 * 5,
  })
}
```

### Hooks to create:

| Hook Name | Type | Key |
|---|---|---|
| `useClassifyTransaction` | mutation | — |
| `useClassifyBatch` | mutation | — |
| `useTrainClassifier` | mutation | — |
| `useClassifierStatus` | query | `['ai', 'classifier-status']` |
| `usePredictExpenses` | mutation | — |
| `usePredictIncome` | mutation | — |
| `useTrainPredictor` | mutation | — |
| `useDetectAnomalies` | mutation | — |
| `useAnomalyHistory` | query | `['ai', 'anomalies', limit]` |
| `useGetRecommendations` | mutation | — |
| `useRecommendationHistory` | query | `['ai', 'recommendations', limit]` |
| `useListModels` | query | `['ai', 'models', modelType]` |
| `useModelDetail` | query | `['ai', 'models', id]` |
| `usePromoteModel` | mutation | — |
| `useDeletePrediction` | mutation | — |
| `useHabitAnalysis` | query | `['ai', 'habits', months]` |
| `useHabitTrends` | query | `['ai', 'habits-trends', months]` |
| `useRiskAssessment` | query | `['ai', 'risks']` |
| `useHealthScore` | query | `['ai', 'health-score']` |
| `useOptimizeSavings` | mutation | — |
| `useSimulateSavings` | mutation | — |
| `useExplanation` | mutation | — |
| `useAIDashboard` | query | `['ai', 'dashboard']` |

---

## Components to Build

### Shared / Reusable Components

Create a `features/ai/components/` directory with these components, organized by domain category:

#### Base / Utility

| Component | File | Description |
|---|---|---|
| `AIPageHeader` | `AIPageHeader.tsx` | Page title + subtitle + optional sidebar trigger |
| `AISectionHeader` | `AISectionHeader.tsx` | Section title with icon + gradient accent bar |
| `ConfidenceBadge` | `ConfidenceBadge.tsx` | high=green, medium=yellow, low=red pill badge |
| `SeverityBadge` | `SeverityBadge.tsx` | critical=red, high=orange, medium=yellow, low=gray |
| `TrainingStatusBadge` | `TrainingStatusBadge.tsx` | pending=gray, training=blue+pulse, completed=green, failed=red |
| `PriorityBadge` | `PriorityBadge.tsx` | high=red, medium=amber, low=gray |
| `AiStatusDot` | `AiStatusDot.tsx` | Animated pulsing dot (green=trained, red=not trained) |
| `EmptyAiState` | `EmptyAiState.tsx` | Empty state with Brain/Sparkles icon |
| `ScoreGauge` | `ScoreGauge.tsx` | Circular SVG gauge 0-100 with gradient color |

#### Classification

| Component | File | Description |
|---|---|---|
| `ClassificationResultCard` | `ClassificationResultCard.tsx` | Shows predicted category + confidence bar + model version + method (ML/Rules) |
| `BatchClassificationPanel` | `BatchClassificationPanel.tsx` | Trigger button with progress indicator, results table |
| `TrainClassifierButton` | `TrainClassifierButton.tsx` | Button with status feedback states (idle/training/completed/failed) |
| `ClassifierStatusCard` | `ClassifierStatusCard.tsx` | Shows if classifier is trained + version + last trained date |

#### Prediction

| Component | File | Description |
|---|---|---|
| `PredictExpensesCard` | `PredictExpensesCard.tsx` | Button to predict + result display (amount, confidence, vs actual) |
| `PredictIncomeCard` | `PredictIncomeCard.tsx` | Same structure as expenses |
| `TrainPredictorButton` | `TrainPredictorButton.tsx` | Toggle expense/income, trigger train, show metrics result |

#### Anomaly Detection

| Component | File | Description |
|---|---|---|
| `AnomalyDetectionPanel` | `AnomalyDetectionPanel.tsx` | Trigger detect + results list with severity chips |
| `AnomalyCard` | `AnomalyCard.tsx` | Single anomaly: severity badge, amount, reason, date |
| `AnomalyHistoryList` | `AnomalyHistoryList.tsx` | Scrollable list of past anomalies |

#### Recommendations

| Component | File | Description |
|---|---|---|
| `RecommendationsFeed` | `RecommendationsFeed.tsx` | Full feed with priority filter tabs, sort, explanation cards |
| `RecommendationCard` | `RecommendationCard.tsx` | Single recommendation: icon, title, description, savings, priority, confidence |
| `ExplanationCard` | `ExplanationCard.tsx` | Expanded card: headline, why, how, impact, action, tone indicator |
| `RecommendationSkeleton` | `RecommendationSkeleton.tsx` | Loading skeleton matching card layout |

#### Habits

| Component | File | Description |
|---|---|---|
| `HabitsDashboard` | `HabitsDashboard.tsx` | Main container: score gauge + radar chart + breakdown |
| `HabitScoreGauge` | `HabitScoreGauge.tsx` | Large circular gauge 0-100 with label |
| `HabitRadarChart` | `HabitRadarChart.tsx` | Radar chart of frequency scores per category |
| `HabitBreakdownList` | `HabitBreakdownList.tsx` | Per-category breakdown with frequency label + stability |
| `HabitStabilityCard` | `HabitStabilityCard.tsx` | Shows stability per category (CV + label) |
| `SpendingPatternsCard` | `SpendingPatternsCard.tsx` | Weekend vs weekday comparison + patterns |
| `CategoryDominanceCard` | `CategoryDominanceCard.tsx` | Dominant categories with share % |
| `RecurringExpensesList` | `RecurringExpensesList.tsx` | Detected recurring expenses cards |

#### Risks

| Component | File | Description |
|---|---|---|
| `RiskAssessmentPanel` | `RiskAssessmentPanel.tsx` | Main container: health gauge + risk factors + metrics + recs |
| `HealthScoreGauge` | `HealthScoreGauge.tsx` | Large circular gauge 0-100 (green→yellow→red gradient) |
| `RiskFactorCard` | `RiskFactorCard.tsx` | Single risk factor with severity + description + metric |
| `RiskMetricsGrid` | `RiskMetricsGrid.tsx` | Grid of small metric cards (income volatility, expense vol, DTI, emergency fund, budget risk, sub creep) |
| `RiskRecommendationsList` | `RiskRecommendationsList.tsx` | List of risk-based recommendations |

#### Savings

| Component | File | Description |
|---|---|---|
| `SavingsOptimizerDashboard` | `SavingsOptimizerDashboard.tsx` | Main container |
| `Allocation50_30_20Chart` | `Allocation50_30_20Chart.tsx` | Horizontal stacked bar showing actual vs recommended 50/30/20 |
| `GoalAllocationList` | `GoalAllocationList.tsx` | Goals with recommended monthly amounts |
| `DebtStrategyCard` | `DebtStrategyCard.tsx` | Snowball vs avalanche comparison + loan list |
| `SeasonalOpportunitiesCard` | `SeasonalOpportunitiesCard.tsx` | Best/worst months for spending |
| `SavingsSimulatorPanel` | `SavingsSimulatorPanel.tsx` | Input form + projection chart |
| `ProjectionChart` | `ProjectionChart.tsx` | Area chart of savings projection (balance over months) |

#### Models

| Component | File | Description |
|---|---|---|
| `ModelRegistryTable` | `ModelRegistryTable.tsx` | Sortable table of models with status, type, version, accuracy |
| `ModelDetailPanel` | `ModelDetailPanel.tsx` | Full model detail with metrics, hyperparameters, promote button |

---

## Page Designs

### AIDashboardPage (`/ai/dashboard`)
```tsx
<AIDashboardPage>
  <AIPageHeader title="Panel de IA" subtitle="Resumen de inteligencia financiera" />
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <ScoreGauge value={habits.score} label="Habitos" color="from-emerald-500 to-teal-500" />
    <ScoreGauge value={risks.health_score} label="Salud Financiera" color="from-blue-500 to-violet-500" />
    <SavingsSummaryCard savings={savings} />
    <RecommendationsSummaryCard recs={recommendations} />
  </div>
  <QuickActionsGrid onClassify onPredict onDetect onTrain />
  <RecentInsightsFeed recommendations={recs} anomalies={anomalies} />
</AIDashboardPage>
```

### AIClassifyPage (`/ai/classify`)
- Tabs: "Individual" | "Batch"
- **Individual**: Select transaction → shows description → click "Clasificar" → shows ClassificationResultCard with predicted category + confidence badge + model version
- **Batch**: Click "Clasificar todas" → BatchClassificationPanel with animated progress → results table (transaction, description, predicted category, confidence)
- **Train Classifier**: Status card + TrainClassifierButton
- **Side section**: ClassifierStatusCard (is_trained indicator, version, last trained date)

### AIPredictPage (`/ai/predict`)
- Two columns: "Predecir Gastos" | "Predecir Ingresos"
- Each column has: PredictCard with trigger button + result display (predicted amount, confidence, model version, reason text)
- **Train Predictor**: Dropdown to select target type (expense/income) + TrainPredictorButton → shows metrics (r2, mse, mae, samples, months)
- Below: prediction result with animated counter, vs-actual comparison if available

### AIAnomaliesPage (`/ai/anomalies`)
- Top: "Detectar anomalias" button with loading state
- Results: list of AnomalyCards with severity badges, amounts, descriptions, dates
- History: AnomalyHistoryList section below with paginated past results

### AIRecommendationsPage (`/ai/recommendations`)
- Top filter tabs: "Todas" | "Alta prioridad" | "Media" | "Baja"
- Summary strip: total recs, high priority count, estimated total savings (animated)
- Feed of RecommendationCard components
- Click "Explicar" on any card → ExplanationCard expands with headline, why, how, impact, action
- Tone indicator based on explanation.tone (urgent=red, concerned=amber, encouraging=green, informative=blue)

### AIHabitsPage (`/ai/habits`)
- Left panel: HabitScoreGauge (large, animated) + Total recommendations badge
- Center: HabitRadarChart (Recharts RadarChart with 5+ dimensions)
- Right panel: HabitBreakdownList (scrollable per-category)
- Below: row of SpendingPatternsCard | CategoryDominanceCard | HabitStabilityCard | RecurringExpensesList
- **Habit trends**: if data available, mini sparkline/bar chart per category showing monthly trend (increasing/decreasing/stable)

### AIRisksPage (`/ai/risks`)
- Top: HealthScoreGauge (large, 0-100 with color gradient) + top risk alert card
- Middle: RiskFactorsGrid (2-column cards with severity badge + description + metric)
- Below: RiskMetricsGrid (6 mini metric cards in 3x2 grid)
- Bottom: RiskRecommendationsList

### AISavingsPage (`/ai/savings`)
- Tab: "Optimizacion" | "Simulador"
- **Optimization tab**:
  - Allocation50_30_20Chart (horizontal stacked bar comparing actual vs recommended)
  - GoalAllocationList (existing goals with recommended monthly)
  - DebtStrategyCard (strategy recommendation + loan comparison)
  - SeasonalOpportunitiesCard (best/worst months)
- **Simulator tab**:
  - SavingsSimulatorPanel with 3 sliders (monthly_amount, months, annual_return)
  - ProjectionChart (area chart: months on x, balance on y)
  - Summary stat cards (final_balance, total_contributed, total_interest)

### AIModelsPage (`/ai/models`)
- ModelRegistryTable (sortable, filterable by type)
- Click row → ModelDetailPanel slides in or navigates to `/ai/models/:id`
- Detail panel: all metrics displayed, hyperparameters JSON, feature names, promote button

---

## Design Patterns

### Confidence Indicators
```tsx
function ConfidenceBadge({ value }: { value: number }) {
  const color = value >= 0.8 ? 'green' : value >= 0.5 ? 'yellow' : 'red'
  const bg = { green: 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400',
               yellow: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
               red: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400' }[color]
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${bg}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${value >= 0.8 ? 'bg-green-500' : value >= 0.5 ? 'bg-amber-500' : 'bg-red-500'}`} />
      {(value * 100).toFixed(0)}%
    </span>
  )
}
```

### Score Gauge (0-100 circular)
- SVG circle with stroke-dasharray animation
- Color gradient: 0-40 = red, 40-70 = amber, 70-100 = green
- Center text: score number + label
- Animate on mount with `useEffect` + timeout

### Score Gauge SVG Template
```tsx
function ScoreGauge({ value = 0, label = '', size = 120, className }: ScoreGaugeProps) {
  const [animated, setAnimated] = useState(0)
  useEffect(() => { const t = setTimeout(() => setAnimated(value), 300); return () => clearTimeout(t) }, [value])
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (animated / 100) * circumference
  const color = animated >= 70 ? '#22c55e' : animated >= 40 ? '#f59e0b' : '#ef4444'
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-100 dark:text-gray-800" />
        <circle cx="50" cy="50" r={radius} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-1000 ease-out" />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">{Math.round(animated)}</span>
        {label && <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500">{label}</span>}
      </div>
    </div>
  )
}
```

### Training Status Feedback
- Button states: `idle` → user clicks → `pending` (disabled, spinner) → pooling for status
- Use `useMutation` + optimistic update for instant feedback
- For long running tasks (train), show progress bar + status text
- On success: green check + metrics display
- On failure: red X + error message

### Loading Skeletons
- Each major component has a corresponding Skeleton component following the same layout
- Use `Skeleton variant="rectangular"` for charts, `variant="circular"` for gauges
- Animate pulse with Tailwind `animate-pulse`

### Empty States
- Brain/Sparkles icon in a rounded gradient box
- "No hay datos de IA" or domain-specific message
- CTA button if applicable (e.g., "Clasificar transacciones")

### Error States
- ErrorMessage component inside the card container
- Retry button for queries
- Toast notification for mutations (react-hot-toast)

---

## Routing Integration

Add to `src/routes/lazy.ts`:
```typescript
export const AIPage = lazy(() => import('@/features/ai/pages/AIPage'))
export const AIDashboardPage = lazy(() => import('@/features/ai/pages/AIDashboardPage'))
export const AIClassifyPage = lazy(() => import('@/features/ai/pages/AIClassifyPage'))
export const AIPredictPage = lazy(() => import('@/features/ai/pages/AIPredictPage'))
export const AIAnomaliesPage = lazy(() => import('@/features/ai/pages/AIAnomaliesPage'))
export const AIRecommendationsPage = lazy(() => import('@/features/ai/pages/AIRecommendationsPage'))
export const AIHabitsPage = lazy(() => import('@/features/ai/pages/AIHabitsPage'))
export const AIRisksPage = lazy(() => import('@/features/ai/pages/AIRisksPage'))
export const AISavingsPage = lazy(() => import('@/features/ai/pages/AISavingsPage'))
export const AISavingsSimulatorPage = lazy(() => import('@/features/ai/pages/AISavingsSimulatorPage'))
export const AIModelsPage = lazy(() => import('@/features/ai/pages/AIModelsPage'))
```

Add to `src/routes/index.tsx` under the existing `/ai` placeholder:
```tsx
// AI Routes
{
  path: '/ai',
  element: <Navigate to="/ai/dashboard" replace />,
},
{
  path: '/ai/dashboard',
  element: (<SuspenseWrapper><AIDashboardPage /></SuspenseWrapper>),
},
{
  path: '/ai/classify',
  element: (<SuspenseWrapper><AIClassifyPage /></SuspenseWrapper>),
},
{
  path: '/ai/predict',
  element: (<SuspenseWrapper><AIPredictPage /></SuspenseWrapper>),
},
{
  path: '/ai/anomalies',
  element: (<SuspenseWrapper><AIAnomaliesPage /></SuspenseWrapper>),
},
{
  path: '/ai/recommendations',
  element: (<SuspenseWrapper><AIRecommendationsPage /></SuspenseWrapper>),
},
{
  path: '/ai/habits',
  element: (<SuspenseWrapper><AIHabitsPage /></SuspenseWrapper>),
},
{
  path: '/ai/risks',
  element: (<SuspenseWrapper><AIRisksPage /></SuspenseWrapper>),
},
{
  path: '/ai/savings',
  element: (<SuspenseWrapper><AISavingsPage /></SuspenseWrapper>),
},
{
  path: '/ai/savings/simulate',
  element: (<SuspenseWrapper><AISavingsSimulatorPage /></SuspenseWrapper>),
},
{
  path: '/ai/models',
  element: (<SuspenseWrapper><AIModelsPage /></SuspenseWrapper>),
},
```

---

## Sidebar/Nav Integration

In the `Sidebar` component, group AI routes under an "Inteligencia Artificial" section with sub-items. The parent `/ai` nav item should expand to show children:

```
🤖 Inteligencia Artificial
  ├── 📊 Dashboard
  ├── 🏷️ Clasificar
  ├── 🔮 Predecir
  ├── ⚠️ Anomalias
  ├── 💡 Recomendaciones
  ├── 📈 Habitos
  ├── 🛡️ Riesgos
  ├── 💰 Ahorros
  │   ├── Optimizacion
  │   └── Simulador
  └── 🧠 Modelos
```

Use lucide-react icons: `BrainCircuit`, `Tags`, `CrystalBall`, `AlertTriangle`, `Lightbulb`, `Activity`, `Shield`, `PiggyBank`, `Cpu`

---

## Zustand Store (Optional)

If needed, create `src/stores/ai.ts` for UI-only state:
```typescript
import { create } from 'zustand'
interface AIStore {
  selectedModelId: string | null
  setSelectedModelId: (id: string | null) => void
  expandExplanationId: string | null
  setExpandExplanationId: (id: string | null) => void
}
```

Most state lives in TanStack Query caches. Only use Zustand for UI-only interactions (which explanation card is expanded, which model is selected in the table).

---

## Step-by-Step Implementation Order

1. **Types** — Create `src/types/ai.ts` with all interfaces (copy from guide above)
2. **API** — Create `src/features/ai/api/ai.ts` with all functions (copy from guide above)
3. **Hooks** — Create `src/features/ai/hooks/useAI.ts` with all 20+ hooks
4. **Shared base components**:
   - `ConfidenceBadge`, `SeverityBadge`, `PriorityBadge`, `TrainingStatusBadge`
   - `ScoreGauge` (reusable SVG circular gauge)
   - `EmptyAiState`, `AIPageHeader`, `AISectionHeader`
   - `AiStatusDot`
5. **AIDashboardPage** — The entry point. Shows 4 summary cards from `/ai/dashboard`
6. **AIClassifyPage** — Single + batch classify UI. Needs Transaction selector (reuse or create mini picker)
7. **AIPredictPage** — Expense + income prediction + train predictor
8. **AIAnomaliesPage** — Detect + history list
9. **AIRecommendationsPage** — Feed + explanation cards (the most UX-heavy page)
10. **AIHabitsPage** — Score gauge + radar chart + breakdown
11. **AIRisksPage** — Health gauge + risk factors + metrics
12. **AISavingsPage** — Optimizer + simulator tabs
13. **AIModelsPage** — Table + detail
14. **Router** — Register all pages in `lazy.ts` + `index.tsx`
15. **Sidebar** — Add AI sub-navigation
16. **TypeScript check** — `npx tsc --noEmit`

---

## Key Design Principles

- **Every AI component must handle 4 states**: loading (skeleton), empty (illustration + message), error (message + retry), and success (data)
- **All AI labels/text in Spanish** — backend returns Spanish, display directly or map value objects to Spanish labels
- **Dark mode everywhere** — use `dark:` variants consistently
- **Animations matter** — score gauges animate on mount, cards stagger fade-in, confidence bars animate width
- **Confidence always visible** — every prediction/classification/recommendation shows a confidence indicator
- **Explanations are first-class** — every recommendation can be expanded to show full explanation (headline, why, how, impact, action)
- **Interactivity** — hover effects, click-to-expand, filter/sort on feeds, sliders on simulator
- **Performance** — TanStack Query caching prevents redundant API calls. `staleTime: 5 min` for static data (habits, risks, models), no cache for mutations

---

## Value Object Maps (Spanish Labels)

For displaying backend value objects as human-readable Spanish text:

```typescript
export const ANOMALY_SEVERITY_LABELS: Record<string, string> = {
  low: 'Baja', medium: 'Media', high: 'Alta', critical: 'Critica',
}
export const ANOMALY_SEVERITY_COLORS: Record<string, string> = {
  low: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  medium: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
  high: 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400',
  critical: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
}

export const PRIORITY_LABELS: Record<string, string> = {
  high: 'Alta', medium: 'Media', low: 'Baja',
}

export const TRAINING_STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente', training: 'Entrenando', completed: 'Completado', failed: 'Fallido', deprecated: 'Obsoleto',
}

export const HABIT_FREQUENCY_LABELS: Record<string, string> = {
  diario: 'Diario', frecuente: 'Frecuente', regular: 'Regular', ocasional: 'Ocasional', sin_actividad: 'Sin actividad',
}

export const STABILITY_LABELS: Record<string, string> = {
  muy_estable: 'Muy Estable', estable: 'Estable', variable: 'Variable', muy_variable: 'Muy Variable',
}

export const TREND_LABELS: Record<string, string> = {
  increasing: 'Creciente', decreasing: 'Decreciente', stable: 'Estable', insufficient_data: 'Sin datos',
}

export const RISK_SEVERITY_LABELS: Record<string, string> = {
  low: 'Bajo', medium: 'Medio', high: 'Alto', critical: 'Critico',
}

export const EXPLANATION_TONE_STYLES: Record<string, string> = {
  urgent: 'border-l-red-500 bg-red-50 dark:bg-red-500/5',
  concerned: 'border-l-amber-500 bg-amber-50 dark:bg-amber-500/5',
  encouraging: 'border-l-emerald-500 bg-emerald-50 dark:bg-emerald-500/5',
  informative: 'border-l-blue-500 bg-blue-50 dark:bg-blue-500/5',
}
```

---

## Commands

```bash
# Run frontend dev server
cd fip-frontend && npm run dev

# TypeScript check
cd fip-frontend && npx tsc --noEmit

# Lint
cd fip-frontend && npm run lint
```

---

## File Summary

### New files to create (target: ~40 files)
```
src/types/ai.ts                                 (~400 lines)
src/features/ai/api/ai.ts                       (~150 lines)
src/features/ai/hooks/useAI.ts                  (~350 lines)

src/features/ai/components/AIPageHeader.tsx
src/features/ai/components/AISectionHeader.tsx
src/features/ai/components/ConfidenceBadge.tsx
src/features/ai/components/SeverityBadge.tsx
src/features/ai/components/PriorityBadge.tsx
src/features/ai/components/TrainingStatusBadge.tsx
src/features/ai/components/AiStatusDot.tsx
src/features/ai/components/EmptyAiState.tsx
src/features/ai/components/ScoreGauge.tsx
src/features/ai/components/ClassificationResultCard.tsx
src/features/ai/components/BatchClassificationPanel.tsx
src/features/ai/components/TrainClassifierButton.tsx
src/features/ai/components/ClassifierStatusCard.tsx
src/features/ai/components/PredictCard.tsx
src/features/ai/components/TrainPredictorButton.tsx
src/features/ai/components/AnomalyDetectionPanel.tsx
src/features/ai/components/AnomalyCard.tsx
src/features/ai/components/AnomalyHistoryList.tsx
src/features/ai/components/RecommendationsFeed.tsx
src/features/ai/components/RecommendationCard.tsx
src/features/ai/components/ExplanationCard.tsx
src/features/ai/components/RecommendationSkeleton.tsx
src/features/ai/components/HabitsDashboard.tsx
src/features/ai/components/HabitScoreGauge.tsx
src/features/ai/components/HabitRadarChart.tsx
src/features/ai/components/HabitBreakdownList.tsx
src/features/ai/components/SpendingPatternsCard.tsx
src/features/ai/components/CategoryDominanceCard.tsx
src/features/ai/components/RecurringExpensesList.tsx
src/features/ai/components/RiskAssessmentPanel.tsx
src/features/ai/components/HealthScoreGauge.tsx
src/features/ai/components/RiskFactorCard.tsx
src/features/ai/components/RiskMetricsGrid.tsx
src/features/ai/components/RiskRecommendationsList.tsx
src/features/ai/components/SavingsOptimizerDashboard.tsx
src/features/ai/components/Allocation50_30_20Chart.tsx
src/features/ai/components/GoalAllocationList.tsx
src/features/ai/components/DebtStrategyCard.tsx
src/features/ai/components/SeasonalOpportunitiesCard.tsx
src/features/ai/components/SavingsSimulatorPanel.tsx
src/features/ai/components/ProjectionChart.tsx
src/features/ai/components/ModelRegistryTable.tsx
src/features/ai/components/ModelDetailPanel.tsx
src/features/ai/components/QuickActionsGrid.tsx
src/features/ai/components/RecentInsightsFeed.tsx

src/features/ai/pages/AIDashboardPage.tsx
src/features/ai/pages/AIClassifyPage.tsx
src/features/ai/pages/AIPredictPage.tsx
src/features/ai/pages/AIAnomaliesPage.tsx
src/features/ai/pages/AIRecommendationsPage.tsx
src/features/ai/pages/AIHabitsPage.tsx
src/features/ai/pages/AIRisksPage.tsx
src/features/ai/pages/AISavingsPage.tsx
src/features/ai/pages/AISavingsSimulatorPage.tsx
src/features/ai/pages/AIModelsPage.tsx

src/stores/ai.ts                                 (optional, ~30 lines)
```

### Files to modify
```
src/routes/lazy.ts                               Add all AI page lazy imports
src/routes/index.tsx                              Replace /ai placeholder with AI routes
src/components/layout/Sidebar.tsx                 Add AI navigation section
src/types/analytics.ts                            No changes needed
```
