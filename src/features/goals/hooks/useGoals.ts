import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as goalsApi from '../api/goals'
import type {
  CreateGoalRequest, UpdateGoalRequest, GoalFilters,
} from '@/types/goals'

export const goalKeys = {
  all: ['goals'] as const,
  lists: () => [...goalKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...goalKeys.lists(), filters] as const,
  details: () => [...goalKeys.all, 'detail'] as const,
  detail: (id: string) => [...goalKeys.details(), id] as const,
  summary: () => [...goalKeys.all, 'summary'] as const,
}

function cleanParams(params?: Record<string, unknown>) {
  if (!params) return undefined
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null),
  )
}

export function useGoals(params?: GoalFilters) {
  return useQuery({
    queryKey: goalKeys.list(cleanParams(params as Record<string, unknown>)),
    queryFn: () => goalsApi.listGoals(params).then((r) => r.data),
    staleTime: 1000 * 60,
  })
}

export function useGoalSummary() {
  return useQuery({
    queryKey: goalKeys.summary(),
    queryFn: () => goalsApi.getGoalSummary().then((r) => r.data),
    staleTime: 1000 * 60 * 2,
  })
}

export function useGoal(id: string | undefined) {
  return useQuery({
    queryKey: goalKeys.detail(id!),
    queryFn: () => goalsApi.getGoal(id!).then((r) => r.data),
    enabled: !!id,
    staleTime: 1000 * 60,
  })
}

export function useCreateGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateGoalRequest) => goalsApi.createGoal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.lists() })
      queryClient.invalidateQueries({ queryKey: goalKeys.summary() })
      toast.success('Meta creada exitosamente')
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
      toast.error(message || 'Error al crear la meta')
    },
  })
}

export function useUpdateGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGoalRequest }) =>
      goalsApi.updateGoal(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: goalKeys.lists() })
      queryClient.invalidateQueries({ queryKey: goalKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: goalKeys.summary() })
      toast.success('Meta actualizada exitosamente')
    },
    onError: () => toast.error('Error al actualizar la meta'),
  })
}

export function useDeleteGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => goalsApi.deleteGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.lists() })
      queryClient.invalidateQueries({ queryKey: goalKeys.summary() })
      toast.success('Meta eliminada exitosamente')
    },
    onError: () => toast.error('Error al eliminar la meta'),
  })
}

export function useRefreshGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => goalsApi.refreshGoal(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: goalKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: goalKeys.lists() })
      queryClient.invalidateQueries({ queryKey: goalKeys.summary() })
      toast.success('Progreso recalculado exitosamente')
    },
    onError: () => toast.error('Error al recalcular progreso'),
  })
}

export function useRefreshPrediction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => goalsApi.refreshGoalPrediction(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: goalKeys.detail(id) })
      toast.success('Prediccion actualizada exitosamente')
    },
    onError: () => toast.error('Error al actualizar prediccion'),
  })
}
