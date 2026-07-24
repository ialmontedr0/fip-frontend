import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as recurringApi from '../api/recurring'
import type { CreateRecurringRequest, UpdateRecurringRequest } from '@/types/transactions'

export const recurringKeys = {
  all: ['recurring'] as const,
  lists: () => [...recurringKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...recurringKeys.lists(), filters] as const,
  details: () => [...recurringKeys.all, 'detail'] as const,
  detail: (id: string) => [...recurringKeys.details(), id] as const,
}

function cleanParams(params?: Record<string, unknown>) {
  if (!params) return undefined
  return Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(params).filter(([_, v]) => v !== undefined && v !== '' && v !== null),
  )
}

export function useRecurringList(params?: { is_active?: boolean }) {
  return useQuery({
    queryKey: recurringKeys.list(cleanParams(params as Record<string, unknown>)),
    queryFn: () => recurringApi.listRecurring(params).then((r) => r.data),
    staleTime: 1000 * 60 * 2,
  })
}

export function useRecurring(id: string | undefined) {
  return useQuery({
    queryKey: recurringKeys.detail(id!),
    queryFn: () => recurringApi.getRecurring(id!).then((r) => r.data),
    enabled: !!id,
  })
}

export function useCreateRecurring() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateRecurringRequest) => recurringApi.createRecurring(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recurringKeys.lists() })
      toast.success('Patron recurrente creado exitosamente')
    },
    onError: () => toast.error('Error al crear el patron recurrente'),
  })
}

export function useUpdateRecurring() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRecurringRequest }) =>
      recurringApi.updateRecurring(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: recurringKeys.lists() })
      queryClient.invalidateQueries({ queryKey: recurringKeys.detail(variables.id) })
      toast.success('Patron recurrente actualizado')
    },
    onError: () => toast.error('Error al actualizar el patron recurrente'),
  })
}

export function useDeleteRecurring() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => recurringApi.deleteRecurring(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recurringKeys.lists() })
      toast.success('Patron recurrente eliminado')
    },
    onError: () => toast.error('Error al eliminar el patron recurrente'),
  })
}

export function useProcessRecurring() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => recurringApi.processRecurring(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: recurringKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      const r = data.data
      toast.success(`${r.created} transacciones creadas de ${r.processed} procesadas`)
    },
    onError: () => toast.error('Error al procesar patrones recurrentes'),
  })
}
