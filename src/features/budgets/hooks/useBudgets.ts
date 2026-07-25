import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as budgetsApi from '../api/budgets'
import type { CreateBudgetRequest, UpdateBudgetRequest, AutoAdjustRequest, BudgetFilters } from '@/types/budgets'

export const budgetKeys = {
  all: ['budgets'] as const,
  lists: () => [...budgetKeys.all, 'list'] as const,
  list: (filters?: BudgetFilters) => [...budgetKeys.lists(), filters ?? {}] as const,
  details: () => [...budgetKeys.all, 'detail'] as const,
  detail: (id: string) => [...budgetKeys.details(), id] as const,
  summary: () => [...budgetKeys.all, 'summary'] as const,
}

export function useBudgets(filters?: BudgetFilters) {
  return useQuery({
    queryKey: budgetKeys.list(filters),
    queryFn: () => budgetsApi.listBudgets(filters).then((r) => r.data),
    staleTime: 1000 * 60 * 2,
  })
}

export function useBudget(id: string | undefined) {
  return useQuery({
    queryKey: budgetKeys.detail(id!),
    queryFn: () => budgetsApi.getBudget(id!).then((r) => r.data),
    enabled: !!id,
  })
}

export function useBudgetSummary() {
  return useQuery({
    queryKey: budgetKeys.summary(),
    queryFn: () => budgetsApi.getBudgetSummary().then((r) => r.data),
    staleTime: 1000 * 60 * 2,
  })
}

export function useCreateBudget() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateBudgetRequest) => budgetsApi.createBudget(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.lists() })
      queryClient.invalidateQueries({ queryKey: budgetKeys.summary() })
      toast.success('Presupuesto creado exitosamente')
    },
    onError: () => toast.error('Error al crear el presupuesto'),
  })
}

export function useUpdateBudget() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBudgetRequest }) =>
      budgetsApi.updateBudget(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: budgetKeys.lists() })
      queryClient.invalidateQueries({ queryKey: budgetKeys.summary() })
      toast.success('Presupuesto actualizado')
    },
    onError: () => toast.error('Error al actualizar el presupuesto'),
  })
}

export function useDeleteBudget() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => budgetsApi.deleteBudget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.lists() })
      queryClient.invalidateQueries({ queryKey: budgetKeys.summary() })
      toast.success('Presupuesto eliminado')
    },
    onError: () => toast.error('Error al eliminar el presupuesto'),
  })
}

export function useRefreshBudget() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => budgetsApi.refreshBudget(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: budgetKeys.lists() })
      queryClient.invalidateQueries({ queryKey: budgetKeys.summary() })
      toast.success('Presupuesto actualizado con los gastos reales')
    },
    onError: () => toast.error('Error al refrescar el presupuesto'),
  })
}

export function useAutoAdjustBudget() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: AutoAdjustRequest }) =>
      budgetsApi.autoAdjustBudget(id, data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.details() })
      queryClient.invalidateQueries({ queryKey: budgetKeys.lists() })
      toast.success('Ajuste automatico completado')
    },
    onError: () => toast.error('Error al ajustar el presupuesto'),
  })
}
