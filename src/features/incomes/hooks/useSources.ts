import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as sourcesApi from '../api/sources'
import { incomeKeys } from './useIncomes'
import type { CreateSourceRequest, UpdateSourceRequest } from '@/types/incomes'

export const sourceKeys = {
  all: ['income-sources'] as const,
  lists: () => [...sourceKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...sourceKeys.lists(), filters] as const,
  details: () => [...sourceKeys.all, 'detail'] as const,
  detail: (id: string) => [...sourceKeys.details(), id] as const,
}

export function useSources(params?: { is_active?: boolean; income_type?: string }) {
  return useQuery({
    queryKey: sourceKeys.list(params as Record<string, unknown>),
    queryFn: () => sourcesApi.listSources(params).then((r) => r.data),
    staleTime: 1000 * 60 * 2,
  })
}

export function useSource(id: string | undefined) {
  return useQuery({
    queryKey: sourceKeys.detail(id!),
    queryFn: () => sourcesApi.getSource(id!).then((r) => r.data),
    enabled: !!id,
  })
}

export function useCreateSource() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateSourceRequest) => sourcesApi.createSource(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sourceKeys.lists() })
      toast.success('Fuente de ingreso creada exitosamente')
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
      toast.error(message || 'Error al crear la fuente')
    },
  })
}

export function useUpdateSource() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSourceRequest }) =>
      sourcesApi.updateSource(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: sourceKeys.lists() })
      queryClient.invalidateQueries({ queryKey: sourceKeys.detail(variables.id) })
      toast.success('Fuente actualizada exitosamente')
    },
    onError: () => toast.error('Error al actualizar la fuente'),
  })
}

export function useDeleteSource() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => sourcesApi.deleteSource(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sourceKeys.lists() })
      toast.success('Fuente eliminada exitosamente')
    },
    onError: () => toast.error('Error al eliminar la fuente'),
  })
}

export function useCreateIncomeFromSource() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ sourceId, data }: { sourceId: string; data: { received_date?: string; amount?: string | null; notes?: string | null } }) =>
      sourcesApi.createIncomeFromSource(sourceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: incomeKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Ingreso creado desde fuente')
    },
    onError: () => toast.error('Error al crear ingreso desde fuente'),
  })
}
