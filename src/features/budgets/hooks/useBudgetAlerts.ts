import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as alertsApi from '../api/alerts'
import type { MarkAlertReadRequest } from '@/types/budgets'

export const alertKeys = {
  all: ['budget-alerts'] as const,
  lists: () => [...alertKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...alertKeys.lists(), filters ?? {}] as const,
}

export function useBudgetAlerts(filters?: {
  budget_id?: string
  is_read?: boolean
  alert_type?: string
  severity?: string
}) {
  return useQuery({
    queryKey: alertKeys.list(filters as Record<string, unknown> | undefined),
    queryFn: () => alertsApi.listAlerts(filters).then((r) => r.data),
    staleTime: 1000 * 60,
  })
}

export function useMarkAlertRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: MarkAlertReadRequest) => alertsApi.markAlertRead(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: alertKeys.all })
      queryClient.invalidateQueries({ queryKey: ['budgets', 'summary'] })
      toast.success('Alertas actualizadas')
    },
    onError: () => toast.error('Error al marcar alerta'),
  })
}

export function useDismissAlert() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (alertId: string) => alertsApi.dismissAlert(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: alertKeys.all })
      toast.success('Alerta descartada')
    },
    onError: () => toast.error('Error al descartar alerta'),
  })
}
