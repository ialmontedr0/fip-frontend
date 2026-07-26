import api from '@/lib/api'
import type {
  CreateGoalRequest, UpdateGoalRequest,
  GoalResponse, ListGoalsResponse, GoalSummaryResponse,
  GoalFilters, RefreshGoalResponse, RefreshPredictionResponse,
} from '@/types/goals'

export function createGoal(data: CreateGoalRequest) {
  return api.post<GoalResponse>('/goals', data)
}

export function listGoals(params?: GoalFilters) {
  return api.get<ListGoalsResponse>('/goals', { params })
}

export function getGoalSummary() {
  return api.get<GoalSummaryResponse>('/goals/summary')
}

export function getGoal(id: string) {
  return api.get<GoalResponse>(`/goals/${id}`)
}

export function updateGoal(id: string, data: UpdateGoalRequest) {
  return api.patch<GoalResponse>(`/goals/${id}`, data)
}

export function deleteGoal(id: string) {
  return api.delete<{ message: string }>(`/goals/${id}`)
}

export function refreshGoal(id: string) {
  return api.post<RefreshGoalResponse>(`/goals/${id}/refresh`)
}

export function refreshGoalPrediction(id: string) {
  return api.post<RefreshPredictionResponse>(`/goals/${id}/predict`)
}
