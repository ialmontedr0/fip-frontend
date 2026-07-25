import api from '@/lib/api'
import type {
  CreateIncomeRequest,
  UpdateIncomeRequest,
  IncomeResponse,
  ListIncomesResponse,
  IncomesFilters,
  BatchUpdateStatusRequest,
  BatchUpdateStatusResponse,
  RecurringCandidatesResponse,
  IrregularIncomeResponse,
} from '@/types/incomes'

export function createIncome(data: CreateIncomeRequest) {
  return api.post<IncomeResponse>('/incomes', data)
}

export function listIncomes(params?: IncomesFilters) {
  const clean = Object.fromEntries(
    Object.entries(params || {}).filter(([, v]) => v !== undefined && v !== '' && v !== null)
  )
  return api.get<ListIncomesResponse>('/incomes', { params: clean })
}

export function getIncome(id: string) {
  return api.get<IncomeResponse>(`/incomes/${id}`)
}

export function updateIncome(id: string, data: UpdateIncomeRequest) {
  return api.patch<IncomeResponse>(`/incomes/${id}`, data)
}

export function deleteIncome(id: string) {
  return api.delete<{ message: string; income_id: string }>(`/incomes/${id}`)
}

export function batchUpdateStatus(data: BatchUpdateStatusRequest) {
  return api.post<BatchUpdateStatusResponse>('/incomes/batch-status', data)
}

export function getRecurringCandidates() {
  return api.get<RecurringCandidatesResponse>('/incomes/recurring-candidates')
}

export function getIrregularIncomes(months = 6) {
  return api.get<IrregularIncomeResponse>('/incomes/irregular', { params: { months } })
}
