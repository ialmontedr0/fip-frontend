import api from '@/lib/api'
import type {
  IncomeSummaryResponse,
  IncomeTrendsResponse,
  IncomeForecastResponse,
  IncomeBySourceResponse,
  IncomeByCategoryResponse,
  MonthlyBreakdownResponse,
} from '@/types/incomes'

export function getIncomeSummary(dateFrom: string, dateTo: string) {
  return api.get<IncomeSummaryResponse>('/incomes/summary', { params: { date_from: dateFrom, date_to: dateTo } })
}

export function getIncomeTrends(months = 12) {
  return api.get<IncomeTrendsResponse>('/incomes/trends', { params: { months } })
}

export function getIncomeForecast() {
  return api.get<IncomeForecastResponse>('/incomes/forecast')
}

export function getIncomeBySource(dateFrom: string, dateTo: string) {
  return api.get<IncomeBySourceResponse>('/incomes/by-source', { params: { date_from: dateFrom, date_to: dateTo } })
}

export function getIncomeByCategory(dateFrom: string, dateTo: string) {
  return api.get<IncomeByCategoryResponse>('/incomes/by-category', { params: { date_from: dateFrom, date_to: dateTo } })
}

export function getMonthlyBreakdown(year: number, month: number) {
  return api.get<MonthlyBreakdownResponse>(`/incomes/monthly/${year}/${month}`)
}
