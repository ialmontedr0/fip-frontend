import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as expensesApi from '../api/expenses'
import type { CreateExpenseRequest, ExpenseFilters, CreateSplitExpenseRequest, DuplicatesResponse, RecurringCandidatesResponse } from '@/types/expenses'

export const expenseKeys = {
  all: ['expenses'] as const,
  lists: () => [...expenseKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...expenseKeys.lists(), filters] as const,
  infinite: (filters?: Record<string, unknown>) => [...expenseKeys.all, 'infinite', filters] as const,
  details: () => [...expenseKeys.all, 'detail'] as const,
  detail: (id: string) => [...expenseKeys.details(), id] as const,
  dashboard: (dateFrom: string, dateTo: string) => [...expenseKeys.all, 'dashboard', dateFrom, dateTo] as const,
  patterns: () => [...expenseKeys.all, 'patterns'] as const,
  duplicates: () => [...expenseKeys.all, 'duplicates'] as const,
  recurringCandidates: () => [...expenseKeys.all, 'recurring-candidates'] as const,
}

function cleanParams(params?: Record<string, unknown>) {
  if (!params) return undefined
  return Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== undefined && v !== '' && v !== null),
  )
}

export function useExpenses(params?: ExpenseFilters) {
  return useQuery({
    queryKey: expenseKeys.list(cleanParams(params as Record<string, unknown>)),
    queryFn: () => expensesApi.listExpenses(cleanParams(params as Record<string, unknown>)).then((r) => r.data),
    staleTime: 1000 * 60,
  })
}

export function useExpenseInfinite(filters?: Omit<ExpenseFilters, 'page'>) {
  return useInfiniteQuery({
    queryKey: expenseKeys.infinite(cleanParams(filters as Record<string, unknown>)),
    queryFn: ({ pageParam = 1 }) =>
      expensesApi.listExpenses({ ...cleanParams(filters as Record<string, unknown>), page: pageParam as number, page_size: 20 }).then((r) => r.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    staleTime: 1000 * 60,
  })
}

export function useExpense(id: string | undefined) {
  return useQuery({
    queryKey: expenseKeys.detail(id!),
    queryFn: () => expensesApi.getExpense(id!).then((r) => r.data),
    enabled: !!id,
  })
}

export function useCreateExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateExpenseRequest) => expensesApi.createExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Gasto creado exitosamente')
    },
    onError: () => toast.error('Error al crear el gasto'),
  })
}

export function useCreateSplitExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateSplitExpenseRequest) => expensesApi.createSplitExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Gasto dividido creado exitosamente')
    },
    onError: () => toast.error('Error al crear el gasto dividido'),
  })
}

export function useUpdateExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateExpenseRequest> }) =>
      expensesApi.updateExpense(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() })
      queryClient.invalidateQueries({ queryKey: expenseKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Gasto actualizado exitosamente')
    },
    onError: () => toast.error('Error al actualizar el gasto'),
  })
}

export function useDeleteExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => expensesApi.deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Gasto eliminado exitosamente')
    },
    onError: () => toast.error('Error al eliminar el gasto'),
  })
}

export function useExpenseDashboard(dateFrom: string, dateTo: string) {
  return useQuery({
    queryKey: expenseKeys.dashboard(dateFrom, dateTo),
    queryFn: () => expensesApi.getExpenseDashboard(dateFrom, dateTo).then((r) => r.data),
    enabled: !!dateFrom && !!dateTo,
    staleTime: 1000 * 60 * 2,
  })
}

export function useSpendingPatterns() {
  return useQuery({
    queryKey: expenseKeys.patterns(),
    queryFn: () => expensesApi.getSpendingPatterns().then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  })
}

export function useDuplicates(days = 30) {
  return useQuery({
    queryKey: [...expenseKeys.all, 'duplicates', days],
    queryFn: () => expensesApi.getDuplicates(days).then((r) => {
      const d = r.data
      if (Array.isArray(d)) return { duplicates: d, total: d.length }
      if (d && Array.isArray((d as DuplicatesResponse).duplicates)) return d as DuplicatesResponse
      return { duplicates: [], total: 0 }
    }),
    staleTime: 1000 * 60,
  })
}

export function useRecurringCandidates() {
  return useQuery({
    queryKey: expenseKeys.recurringCandidates(),
    queryFn: () => expensesApi.getRecurringCandidates().then((r) => {
      const d = r.data
      if (Array.isArray(d)) return { candidates: d, total: d.length }
      if (d && Array.isArray((d as RecurringCandidatesResponse).candidates)) return d as RecurringCandidatesResponse
      return { candidates: [], total: 0 }
    }),
    staleTime: 1000 * 60 * 2,
  })
}
