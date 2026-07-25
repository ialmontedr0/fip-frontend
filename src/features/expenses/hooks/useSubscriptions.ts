import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as subscriptionsApi from '../api/subscriptions'
import type { CreateSubscriptionRequest } from '@/types/expenses'

export const subKeys = {
  all: ['subscriptions'] as const,
  lists: () => [...subKeys.all, 'list'] as const,
  list: (params?: Record<string, unknown>) => [...subKeys.lists(), params] as const,
  summary: () => [...subKeys.all, 'summary'] as const,
}

export function useSubscriptions(params?: { status?: string }) {
  return useQuery({
    queryKey: subKeys.list(params as Record<string, unknown>),
    queryFn: () => subscriptionsApi.listSubscriptions(params).then((r) => r.data),
    staleTime: 1000 * 60 * 2,
  })
}

export function useSubscriptionSummary() {
  return useQuery({
    queryKey: subKeys.summary(),
    queryFn: () => subscriptionsApi.getSubscriptionSummary().then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateSubscription() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateSubscriptionRequest) => subscriptionsApi.createSubscription(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subKeys.lists() })
      queryClient.invalidateQueries({ queryKey: subKeys.summary() })
      toast.success('Suscripcion creada exitosamente')
    },
    onError: () => toast.error('Error al crear la suscripcion'),
  })
}

export function useUpdateSubscription() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateSubscriptionRequest> }) =>
      subscriptionsApi.updateSubscription(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subKeys.lists() })
      queryClient.invalidateQueries({ queryKey: subKeys.summary() })
      toast.success('Suscripcion actualizada')
    },
    onError: () => toast.error('Error al actualizar la suscripcion'),
  })
}

export function useDeleteSubscription() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => subscriptionsApi.deleteSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subKeys.lists() })
      queryClient.invalidateQueries({ queryKey: subKeys.summary() })
      toast.success('Suscripcion eliminada')
    },
    onError: () => toast.error('Error al eliminar la suscripcion'),
  })
}
