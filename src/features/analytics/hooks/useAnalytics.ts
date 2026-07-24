import { useQuery } from '@tanstack/react-query'
import {
  getDashboard,
  getMonthlyKPIs,
  getChashFlow,
  getNetWorth,
  getSpendingTrend,
  getIncomeTrend,
  getTopCategories,
  getPortfolioKPIs,
} from '../api/analytics'
import type { DateRangeParams } from '@/types/analytics'

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => getDashboard().then((r) => r.data),
    staleTime: 1000 * 60 * 2, // 2 minutos
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

export function usePortfolioKPIs() {
  return useQuery({
    queryKey: ['portfolio-kpis'],
    queryFn: () => getPortfolioKPIs().then((r) => r.data),
  })
}
