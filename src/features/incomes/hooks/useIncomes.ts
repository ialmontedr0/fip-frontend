import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as incomesApi from '../api/incomes'
import * as analyticsApi from '../api/analytics'
import type {
  CreateIncomeRequest, UpdateIncomeRequest, IncomesFilters, ListIncomesResponse,
} from '@/types/incomes'

export const incomeKeys = {
  all: ['incomes'] as const,
  lists: () => [...incomeKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...incomeKeys.lists(), filters] as const,
  infinite: (filters?: Record<string, unknown>) => [...incomeKeys.all, 'infinite', filters] as const,
  details: () => [...incomeKeys.all, 'detail'] as const,
  detail: (id: string) => [...incomeKeys.details(), id] as const,
  summary: (params?: Record<string, unknown>) => [...incomeKeys.all, 'summary', params] as const,
  trends: (months?: number) => [...incomeKeys.all, 'trends', months] as const,
  forecast: () => [...incomeKeys.all, 'forecast'] as const,
  bySource: (params?: Record<string, unknown>) => [...incomeKeys.all, 'by-source', params] as const,
  byCategory: (params?: Record<string, unknown>) => [...incomeKeys.all, 'by-category', params] as const,
  monthly: (year: number, month: number) => [...incomeKeys.all, 'monthly', year, month] as const,
  recurringCandidates: () => [...incomeKeys.all, 'recurring-candidates'] as const,
  irregular: (months?: number) => [...incomeKeys.all, 'irregular', months] as const,
}

function cleanParams(params?: Record<string, unknown>) {
  if (!params) return undefined
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null),
  )
}

export function useIncomes(params?: IncomesFilters) {
  return useQuery({
    queryKey: incomeKeys.list(cleanParams(params as Record<string, unknown>)),
    queryFn: () => incomesApi.listIncomes(params).then((r) => r.data),
    staleTime: 1000 * 60,
  })
}

export function useIncomeInfinite(filters?: Omit<IncomesFilters, 'page'>) {
  return useInfiniteQuery({
    queryKey: incomeKeys.infinite(cleanParams(filters as Record<string, unknown>)),
    queryFn: ({ pageParam = 1 }) =>
      incomesApi.listIncomes({ ...filters, page: pageParam, page_size: 20 } as IncomesFilters).then((r) => r.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage: ListIncomesResponse) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    staleTime: 1000 * 60,
  })
}

export function useIncome(id: string | undefined) {
  return useQuery({
    queryKey: incomeKeys.detail(id!),
    queryFn: () => incomesApi.getIncome(id!).then((r) => r.data),
    enabled: !!id,
  })
}

export function useCreateIncome() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateIncomeRequest) => incomesApi.createIncome(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: incomeKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Ingreso creado exitosamente')
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
      toast.error(message || 'Error al crear el ingreso')
    },
  })
}

export function useUpdateIncome() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateIncomeRequest }) =>
      incomesApi.updateIncome(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: incomeKeys.lists() })
      queryClient.invalidateQueries({ queryKey: incomeKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Ingreso actualizado exitosamente')
    },
    onError: () => toast.error('Error al actualizar el ingreso'),
  })
}

export function useDeleteIncome() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => incomesApi.deleteIncome(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: incomeKeys.lists() })
      queryClient.invalidateQueries({ queryKey: incomeKeys.summary() })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Ingreso eliminado exitosamente')
    },
    onError: () => toast.error('Error al eliminar el ingreso'),
  })
}

export function useBatchUpdateStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { income_ids: string[]; status: string }) =>
      incomesApi.batchUpdateStatus(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: incomeKeys.lists() })
      toast.success(`${res.data.updated} ingresos actualizados`)
    },
    onError: () => toast.error('Error en la actualizacion masiva'),
  })
}

export function useIncomeSummary(dateFrom: string, dateTo: string) {
  return useQuery({
    queryKey: incomeKeys.summary({ date_from: dateFrom, date_to: dateTo }),
    queryFn: () => analyticsApi.getIncomeSummary(dateFrom, dateTo).then((r) => r.data),
    enabled: !!dateFrom && !!dateTo,
    staleTime: 1000 * 60 * 2,
  })
}

export function useIncomeTrends(months = 12) {
  return useQuery({
    queryKey: incomeKeys.trends(months),
    queryFn: () => analyticsApi.getIncomeTrends(months).then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  })
}

export function useIncomeForecast() {
  return useQuery({
    queryKey: incomeKeys.forecast(),
    queryFn: () => analyticsApi.getIncomeForecast().then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  })
}

export function useIncomeBySource(dateFrom: string, dateTo: string) {
  return useQuery({
    queryKey: incomeKeys.bySource({ date_from: dateFrom, date_to: dateTo }),
    queryFn: () => analyticsApi.getIncomeBySource(dateFrom, dateTo).then((r) => r.data),
    enabled: !!dateFrom && !!dateTo,
  })
}

export function useIncomeByCategory(dateFrom: string, dateTo: string) {
  return useQuery({
    queryKey: incomeKeys.byCategory({ date_from: dateFrom, date_to: dateTo }),
    queryFn: () => analyticsApi.getIncomeByCategory(dateFrom, dateTo).then((r) => r.data),
    enabled: !!dateFrom && !!dateTo,
  })
}

export function useMonthlyBreakdown(year: number, month: number) {
  return useQuery({
    queryKey: incomeKeys.monthly(year, month),
    queryFn: () => analyticsApi.getMonthlyBreakdown(year, month).then((r) => r.data),
    enabled: !!year && !!month,
  })
}

export function useRecurringCandidates() {
  return useQuery({
    queryKey: incomeKeys.recurringCandidates(),
    queryFn: () => incomesApi.getRecurringCandidates().then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  })
}

export function useIrregularIncomes(months = 6) {
  return useQuery({
    queryKey: incomeKeys.irregular(months),
    queryFn: () => incomesApi.getIrregularIncomes(months).then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  })
}
