import api from '@/lib/api'
import type {
  ListCardAlertsResponse,
  MarkAlertReadRequest,
  CheckAlertsResponse,
  CardAlertsFilters,
} from '@/types/cards'

export const alertsApi = {
  list: (filters?: CardAlertsFilters) =>
    api.get<ListCardAlertsResponse>('/cards/alerts/all', { params: filters }).then((r) => r.data),

  markRead: (data: MarkAlertReadRequest) =>
    api.post('/cards/alerts/read', data).then((r) => r.data),

  dismiss: (alertId: string) =>
    api.post(`/cards/alerts/${alertId}/dismiss`).then((r) => r.data),

  check: () =>
    api.post<CheckAlertsResponse>('/cards/alerts/check').then((r) => r.data),
}
