import { useQuery } from '@tanstack/react-query'
import {
  getDashboard,
  getMonthlyKPIs,
  getChashFlow,
  getCashFlowByAccount,
  getNetWorth,
  getSpendingTrend,
  getIncomeTrend,
  getTopCategories,
  getCategoryBreakdown,
  getSpendingHeatmap,
  getPortfolioKPIs,
} from '../api/analytics'
import type {
  DateRangeParams,
  CategoryBreakdownParams,
} from '@/types/analytics'

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => getDashboard().then((r) => r.data),
    staleTime: 1000 * 60 * 2,
  })
}

export function useMonthlyKPIs(year?: number, month?: number) {
  return useQuery({
    queryKey: ['kpis', 'monthly', year, month],
    queryFn: () => getMonthlyKPIs(year, month).then((r) => r.data),
  })
}

export function useCashFlow(params?: DateRangeParams) {
  return useQuery({
    queryKey: ['cash-flow', params],
    queryFn: () => getChashFlow(params).then((r) => r.data),
  })
}

export function useCashFlowByAccount(params?: DateRangeParams) {
  return useQuery({
    queryKey: ['cash-flow-by-account', params],
    queryFn: () => getCashFlowByAccount(params).then((r) => r.data),
  })
}

export function useNetWorth() {
  return useQuery({
    queryKey: ['net-worth'],
    queryFn: () => getNetWorth().then((r) => r.data),
  })
}

export function useSpendingTrend(params?: DateRangeParams & { period: string }) {
  return useQuery({
    queryKey: ['spending-trend', params],
    queryFn: () => getSpendingTrend(params).then((r) => r.data),
  })
}

export function useIncomeTrend(params?: DateRangeParams & { period?: string }) {
  return useQuery({
    queryKey: ['income-trend', params],
    queryFn: () => getIncomeTrend(params).then((r) => r.data),
  })
}

export function useTopCategories(
  params?: DateRangeParams & { limit?: number; transaction_type?: string },
) {
  return useQuery({
    queryKey: ['top-categories', params],
    queryFn: () => getTopCategories(params).then((r) => r.data),
  })
}

export function useCategoryBreakdown(params?: CategoryBreakdownParams) {
  return useQuery({
    queryKey: ['category-breakdown', params],
    queryFn: () => getCategoryBreakdown(params).then((r) => r.data),
  })
}

export function useSpendingHeatmap(params?: DateRangeParams & { granularity?: string }) {
  return useQuery({
    queryKey: ['spending-heatmap', params],
    queryFn: () => getSpendingHeatmap(params).then((r) => r.data),
  })
}

export function usePortfolioKPIs() {
  return useQuery({
    queryKey: ['portfolio-kpis'],
    queryFn: () => getPortfolioKPIs().then((r) => r.data),
  })
}
