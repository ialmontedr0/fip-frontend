import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as automationsApi from '../api/automations'
import type {
  CreateRuleRequest, UpdateRuleRequest,
} from '@/types/automations'

export const automationKeys = {
  all: ['automations'] as const,
  lists: () => [...automationKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...automationKeys.lists(), filters] as const,
  details: () => [...automationKeys.all, 'detail'] as const,
  detail: (id: string) => [...automationKeys.details(), id] as const,
  summary: () => [...automationKeys.all, 'summary'] as const,
  templates: () => [...automationKeys.all, 'templates'] as const,
  logs: () => [...automationKeys.all, 'logs'] as const,
  logsList: (params?: Record<string, unknown>) => [...automationKeys.logs(), params] as const,
}

function cleanParams(params?: Record<string, unknown>) {
  if (!params) return undefined
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null),
  )
}

export function useAutomations(params?: { is_active?: boolean; trigger_type?: string }) {
  return useQuery({
    queryKey: automationKeys.list(cleanParams(params as Record<string, unknown>)),
    queryFn: () => automationsApi.listRules(params).then((r) => r.data),
    staleTime: 1000 * 30,
  })
}

export function useAutomation(id: string | undefined) {
  return useQuery({
    queryKey: automationKeys.detail(id!),
    queryFn: () => automationsApi.getRule(id!).then((r) => r.data),
    enabled: !!id,
    staleTime: 1000 * 30,
  })
}

export function useAutomationSummary() {
  return useQuery({
    queryKey: automationKeys.summary(),
    queryFn: () => automationsApi.getSummary().then((r) => r.data),
    staleTime: 1000 * 60,
  })
}

export function useTemplates() {
  return useQuery({
    queryKey: automationKeys.templates(),
    queryFn: () => automationsApi.getTemplates().then((r) => r.data),
    staleTime: Infinity,
  })
}

export function useExecutionLogs(params?: { rule_id?: string; limit?: number }) {
  return useQuery({
    queryKey: automationKeys.logsList(cleanParams(params as Record<string, unknown>)),
    queryFn: () => automationsApi.listExecutionLogs(params).then((r) => r.data),
    staleTime: 1000 * 15,
  })
}

export function useExecutionLog(id: string | undefined) {
  return useQuery({
    queryKey: [...automationKeys.logs(), id],
    queryFn: () => automationsApi.getExecutionLog(id!).then((r) => r.data),
    enabled: !!id,
  })
}

export function useCreateRule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateRuleRequest) => automationsApi.createRule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationKeys.lists() })
      queryClient.invalidateQueries({ queryKey: automationKeys.summary() })
      toast.success('Regla creada exitosamente')
    },
    onError: () => toast.error('Error al crear la regla'),
  })
}

export function useUpdateRule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRuleRequest }) =>
      automationsApi.updateRule(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: automationKeys.lists() })
      queryClient.invalidateQueries({ queryKey: automationKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: automationKeys.summary() })
      toast.success('Regla actualizada exitosamente')
    },
    onError: () => toast.error('Error al actualizar la regla'),
  })
}

export function useDeleteRule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => automationsApi.deleteRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationKeys.lists() })
      queryClient.invalidateQueries({ queryKey: automationKeys.summary() })
      toast.success('Regla eliminada')
    },
    onError: () => toast.error('Error al eliminar la regla'),
  })
}

export function useToggleRule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => automationsApi.toggleRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationKeys.lists() })
      queryClient.invalidateQueries({ queryKey: automationKeys.details() })
      toast.success('Estado actualizado')
    },
  })
}

export function useExecuteRule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dryRun }: { id: string; dryRun?: boolean }) =>
      automationsApi.executeRule(id, dryRun),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: automationKeys.lists() })
      queryClient.invalidateQueries({ queryKey: automationKeys.logs() })
      const data = res.data
      if (data.status === 'executed') toast.success('Regla ejecutada exitosamente')
      else if (data.status === 'skipped') toast(data.reason || 'Regla saltada', { icon: '⏭️' })
      else if (data.status === 'failed') toast.error(data.error || 'Error en ejecucion')
    },
    onError: () => toast.error('Error al ejecutar la regla'),
  })
}

export function useEvaluateAll() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dryRun?: boolean) => automationsApi.evaluateAll(dryRun),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: automationKeys.logs() })
      const data = res.data
      toast.success(`${data.executed} reglas ejecutadas, ${data.skipped} saltadas, ${data.failed} fallidas`)
    },
    onError: () => toast.error('Error al evaluar reglas'),
  })
}

export function useQuickSavingsTransfer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Parameters<typeof automationsApi.quickSavingsTransfer>[0]) =>
      automationsApi.quickSavingsTransfer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationKeys.lists() })
      queryClient.invalidateQueries({ queryKey: automationKeys.summary() })
      toast.success('Ahorro automatico configurado')
    },
  })
}

export function useQuickCardPayment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Parameters<typeof automationsApi.quickCardPayment>[0]) =>
      automationsApi.quickCardPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationKeys.lists() })
      toast.success('Pago automatico configurado')
    },
  })
}

export function useQuickBalanceTransfer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Parameters<typeof automationsApi.quickBalanceTransfer>[0]) =>
      automationsApi.quickBalanceTransfer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationKeys.lists() })
      toast.success('Transferencia por saldo configurada')
    },
  })
}
