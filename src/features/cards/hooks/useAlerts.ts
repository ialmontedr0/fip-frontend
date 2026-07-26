import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { alertsApi } from '../api/alerts'
import type { CardAlertsFilters, MarkAlertReadRequest } from '@/types/cards'

const keys = {
  all: ['cardAlerts'] as const,
  list: (filters?: CardAlertsFilters) => [...keys.all, 'list', filters] as const,
}

export function useCardAlerts(filters?: CardAlertsFilters) {
  return useQuery({
    queryKey: keys.list(filters),
    queryFn: () => alertsApi.list(filters),
  })
}

export function useMarkAlertRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: MarkAlertReadRequest) => alertsApi.markRead(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  })
}

export function useDismissAlert() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (alertId: string) => alertsApi.dismiss(alertId),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  })
}

export function useCheckAlerts() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => alertsApi.check(),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  })
}
