import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as automationsApi from '../api/automations'
import type { CreateRuleRequest, UpdateRuleRequest } from '@/types/automations'

export const ruleKeys = {
  all: ['automations'] as const,
  lists: () => [...ruleKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...ruleKeys.lists(), filters] as const,
  details: () => [...ruleKeys.all, 'detail'] as const,
  detail: (id: string) => [...ruleKeys.details(), id] as const,
  summary: () => [...ruleKeys.all, 'summary'] as const,
}

export function useRules(params?: { is_active?: boolean; trigger_type?: string }) {
  return useQuery({
    queryKey: ruleKeys.list(params as Record<string, unknown> | undefined),
    queryFn: () => automationsApi.listRules(params).then((r) => r.data),
  })
}

export function useRule(id: string | undefined) {
  return useQuery({
    queryKey: ruleKeys.detail(id!),
    queryFn: () => automationsApi.getRule(id!).then((r) => r.data),
    enabled: !!id,
  })
}

export function useCreateRule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateRuleRequest) => automationsApi.createRule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ruleKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ruleKeys.summary() })
      toast.success('Automatización creada exitosamente')
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
      toast.error(message || 'Error al crear la automatización')
    },
  })
}

export function useUpdateRule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRuleRequest }) =>
      automationsApi.updateRule(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ruleKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: ruleKeys.lists() })
      toast.success('Automatización actualizada exitosamente')
    },
    onError: () => toast.error('Error al actualizar la automatización'),
  })
}

export function useDeleteRule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => automationsApi.deleteRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ruleKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ruleKeys.summary() })
      toast.success('Automatización eliminada')
    },
    onError: () => toast.error('Error al eliminar la automatización'),
  })
}
