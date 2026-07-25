import api from '@/lib/api'
import type {
  CreateBudgetRequest, UpdateBudgetRequest, AutoAdjustRequest,
  BudgetResponse, ListBudgetsResponse, BudgetSummaryResponse,
  BudgetRefreshResponse, AutoAdjustResponse, BudgetFilters,
} from '@/types/budgets'

export function createBudget(data: CreateBudgetRequest) {
  return api.post<BudgetResponse>('/budgets', data)
}

export function listBudgets(params?: BudgetFilters) {
  return api.get<ListBudgetsResponse>('/budgets', { params })
}

export function getBudgetSummary() {
  return api.get<BudgetSummaryResponse>('/budgets/summary')
}

export function getBudget(id: string) {
  return api.get<BudgetResponse>(`/budgets/${id}`)
}

export function updateBudget(id: string, data: UpdateBudgetRequest) {
  return api.patch<BudgetResponse>(`/budgets/${id}`, data)
}

export function deleteBudget(id: string) {
  return api.delete<{ message: string }>(`/budgets/${id}`)
}

export function refreshBudget(id: string) {
  return api.post<BudgetRefreshResponse>(`/budgets/${id}/refresh`)
}

export function autoAdjustBudget(id: string, data: AutoAdjustRequest = {}) {
  return api.post<AutoAdjustResponse>(`/budgets/${id}/auto-adjust`, data)
}
