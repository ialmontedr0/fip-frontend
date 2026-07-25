import api from '@/lib/api'
import type { ListAlertsResponse, MarkAlertReadRequest } from '@/types/budgets'

export function listAlerts(params?: {
  budget_id?: string
  is_read?: boolean
  alert_type?: string
  severity?: string
}) {
  return api.get<ListAlertsResponse>('/budgets/alerts/all', { params })
}

export function markAlertRead(data: MarkAlertReadRequest) {
  return api.post<{ message: string; count?: number }>('/budgets/alerts/read', data)
}

export function dismissAlert(alertId: string) {
  return api.post<{ message: string }>(`/budgets/alerts/${alertId}/dismiss`)
}
