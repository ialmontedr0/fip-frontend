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
    params: { transaction_id, description, ...(category_id && { category_id }) },
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
