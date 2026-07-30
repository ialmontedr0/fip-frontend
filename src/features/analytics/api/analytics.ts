import api from '@/lib/api'

import type {
  DashboardResponse,
  DateRangeParams,
  CashFlowByAccountResponse,
  SpendingHeatmapResponse,
  CategoryBreakdownParams,
} from '@/types/analytics'

export function getDashboard() {
  return api.get<DashboardResponse>('/analytics/dashboard')
}

export function getMonthlyKPIs(year?: number, month?: number) {
  return api.get<DashboardResponse['kpis']>(`/analytics/kpis/monthly`, {
    params: { year, month },
  })
}

export function getCashFlow(params?: DateRangeParams) {
  return api.get<DashboardResponse['cash_flow']>(`/analytics/cash-flow`, { params })
}

export function getCashFlowByAccount(params?: DateRangeParams) {
  return api.get<CashFlowByAccountResponse>('/analytics/cash-flow/by-account', { params })
}

export function getNetWorth() {
  return api.get<DashboardResponse['net_worth']>(`/analytics/net-worth`)
}

export function getCategoryBreakdown(params?: CategoryBreakdownParams) {
  return api.get<DashboardResponse['top_categories']>('/analytics/categories/breakdown', { params })
}

export function getSpendingTrend(params?: DateRangeParams & { period?: string }) {
  return api.get<DashboardResponse['spending_trend']>(`/analytics/trends/spending`, { params })
}

export function getIncomeTrend(params?: DateRangeParams & { period?: string }) {
  return api.get<DashboardResponse['spending_trend']>('/analytics/trends/income', { params })
}

export function getTopCategories(
  params?: DateRangeParams & { limit?: number; transaction_type?: string },
) {
  return api.get<DashboardResponse['top_categories']>(`/analytics/categories/top`, { params })
}

export function getSpendingHeatmap(params?: DateRangeParams & { granularity?: string }) {
  return api.get<SpendingHeatmapResponse>('/analytics/heatmaps/spending', { params })
}

export function getPortfolioKPIs() {
  return api.get<DashboardResponse['portfolio']>(`/analytics/kpis/portfolio`)
}
