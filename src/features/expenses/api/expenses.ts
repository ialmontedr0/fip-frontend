import api from '@/lib/api'
import type {
  CreateExpenseRequest, ExpenseResponse, ListExpensesResponse,
  ExpenseFilters, CreateSplitExpenseRequest,
  ExpenseDashboardResponse, SpendingPatternsResponse,
  DuplicatesResponse, RecurringCandidatesResponse,
} from '@/types/expenses'

export function createExpense(data: CreateExpenseRequest) {
  return api.post<ExpenseResponse>('/expenses', data)
}

export function createSplitExpense(data: CreateSplitExpenseRequest) {
  return api.post<ExpenseResponse>('/expenses/split', data)
}

export function listExpenses(params?: ExpenseFilters) {
  return api.get<ListExpensesResponse>('/expenses', { params })
}

export function getExpense(id: string) {
  return api.get<ExpenseResponse>(`/expenses/${id}`)
}

export function updateExpense(id: string, data: Partial<CreateExpenseRequest>) {
  return api.patch<ExpenseResponse>(`/expenses/${id}`, data)
}

export function deleteExpense(id: string) {
  return api.delete<{ message: string }>(`/expenses/${id}`)
}

export function getExpenseDashboard(dateFrom: string, dateTo: string) {
  return api.get<ExpenseDashboardResponse>('/expenses/dashboard', { params: { date_from: dateFrom, date_to: dateTo } })
}

export function getSpendingPatterns() {
  return api.get<SpendingPatternsResponse>('/expenses/patterns')
}

export function getDuplicates(days = 30) {
  return api.get<DuplicatesResponse>('/expenses/duplicates', { params: { days } })
}

export function getRecurringCandidates() {
  return api.get<RecurringCandidatesResponse>('/expenses/recurring-candidates')
}
