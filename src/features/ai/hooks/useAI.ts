import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  classifyTransaction,
  classifyBatch,
  trainClassifier,
  getClassifierStatus,
  predictExpenses,
  predictIncome,
  trainPredictor,
  detectAnomalies,
  getAnomalyHistory,
  getRecommendations,
  getLatestRecommendations,
  getRecommendationHistory,
  listModels,
  getModelDetail,
  promoteModel,
  deletePrediction,
  getHabitAnalysis,
  getHabitTrends,
  getRiskAssessment,
  getHealthScore,
  optimizeSavings,
  simulateSavings,
  getExplanation,
  getAIDashboard,
} from '../api/ai'
import type { ExplainParams, SavingsSimulateParams } from '@/types/ai'

export function useClassifyTransaction() {
  return useMutation({
    mutationFn: ({ transaction_id, description, category_id }: { transaction_id: string; description: string; category_id?: string }) =>
      classifyTransaction(transaction_id, description, category_id).then(r => r.data),
  })
}

export function useClassifyBatch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => classifyBatch().then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai', 'classifier-status'] })
    },
  })
}

export function useTrainClassifier() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => trainClassifier().then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai', 'classifier-status'] })
    },
  })
}

export function useClassifierStatus() {
  return useQuery({
    queryKey: ['ai', 'classifier-status'],
    queryFn: () => getClassifierStatus().then(r => r.data),
    staleTime: 1000 * 60 * 5,
  })
}

export function usePredictExpenses() {
  return useMutation({
    mutationFn: (model_version?: string) => predictExpenses(model_version).then(r => r.data),
  })
}

export function usePredictIncome() {
  return useMutation({
    mutationFn: (model_version?: string) => predictIncome(model_version).then(r => r.data),
  })
}

export function useTrainPredictor() {
  return useMutation({
    mutationFn: ({ target_type, model_type }: { target_type: string; model_type: string }) =>
      trainPredictor(target_type, model_type).then(r => r.data),
  })
}

export function useDetectAnomalies() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => detectAnomalies().then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai', 'anomalies'] })
    },
  })
}

export function useAnomalyHistory(limit: number = 20) {
  return useQuery({
    queryKey: ['ai', 'anomalies', limit],
    queryFn: () => getAnomalyHistory(limit).then(r => r.data),
    staleTime: 1000 * 60 * 2,
  })
}

export function useGetRecommendations() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => getRecommendations().then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai', 'recommendations', 'latest'] })
    },
  })
}

export function useLatestRecommendations() {
  return useQuery({
    queryKey: ['ai', 'recommendations', 'latest'],
    queryFn: () => getLatestRecommendations().then(r => r.data),
    staleTime: 1000 * 60 * 2,
    retry: false,
  })
}

export function useRecommendationHistory(limit: number = 20) {
  return useQuery({
    queryKey: ['ai', 'recommendations', limit],
    queryFn: () => getRecommendationHistory(limit).then(r => r.data),
    staleTime: 1000 * 60 * 2,
  })
}

export function useListModels(model_type?: string) {
  return useQuery({
    queryKey: ['ai', 'models', model_type],
    queryFn: () => listModels(model_type).then(r => r.data),
    staleTime: 1000 * 60 * 5,
  })
}

export function useModelDetail(id: string) {
  return useQuery({
    queryKey: ['ai', 'models', id],
    queryFn: () => getModelDetail(id).then(r => r.data),
    enabled: !!id,
  })
}

export function usePromoteModel() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (model_id: string) => promoteModel(model_id).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai', 'models'] })
    },
  })
}

export function useDeletePrediction() {
  return useMutation({
    mutationFn: (prediction_id: string) => deletePrediction(prediction_id).then(r => r.data),
  })
}

export function useHabitAnalysis(months: number = 6) {
  return useQuery({
    queryKey: ['ai', 'habits', months],
    queryFn: () => getHabitAnalysis(months).then(r => r.data),
    staleTime: 1000 * 60 * 5,
  })
}

export function useHabitTrends(months: number = 6) {
  return useQuery({
    queryKey: ['ai', 'habits-trends', months],
    queryFn: () => getHabitTrends(months).then(r => r.data),
    staleTime: 1000 * 60 * 5,
  })
}

export function useRiskAssessment() {
  return useQuery({
    queryKey: ['ai', 'risks'],
    queryFn: () => getRiskAssessment().then(r => r.data),
    staleTime: 1000 * 60 * 5,
  })
}

export function useHealthScore() {
  return useQuery({
    queryKey: ['ai', 'health-score'],
    queryFn: () => getHealthScore().then(r => r.data),
    staleTime: 1000 * 60 * 5,
  })
}

export function useOptimizeSavings() {
  return useMutation({
    mutationFn: () => optimizeSavings().then(r => r.data),
  })
}

export function useSimulateSavings() {
  return useMutation({
    mutationFn: (params: SavingsSimulateParams) => simulateSavings(params).then(r => r.data),
  })
}

export function useExplanation() {
  return useMutation({
    mutationFn: (params: ExplainParams) => getExplanation(params).then(r => r.data),
  })
}

export function useAIDashboard() {
  return useQuery({
    queryKey: ['ai', 'dashboard'],
    queryFn: () => getAIDashboard().then(r => r.data),
    staleTime: 1000 * 60 * 2,
  })
}
