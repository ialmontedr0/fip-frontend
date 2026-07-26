import api from '@/lib/api'
import type {
  CreateCardRequest,
  UpdateCardRequest,
  CardResponse,
  ListCardsResponse,
  CardSummaryResponse,
  UtilizationHistoryResponse,
  SpendingByCategoryResponse,
} from '@/types/cards'

export const cardsApi = {
  list: (params?: { is_active?: boolean }) =>
    api.get<ListCardsResponse>('/cards', { params }).then((r) => r.data),

  summary: () =>
    api.get<CardSummaryResponse>('/cards/summary').then((r) => r.data),

  get: (id: string) =>
    api.get<CardResponse>(`/cards/${id}`).then((r) => r.data),

  create: (data: CreateCardRequest) =>
    api.post<CardResponse>('/cards', data).then((r) => r.data),

  update: (id: string, data: UpdateCardRequest) =>
    api.patch<CardResponse>(`/cards/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/cards/${id}`).then((r) => r.data),

  utilization: (id: string) =>
    api.get(`/cards/${id}/utilization`).then((r) => r.data),

  utilizationHistory: (id: string, months = 6) =>
    api.get<UtilizationHistoryResponse>(`/cards/${id}/utilization/history`, {
      params: { months },
    }).then((r) => r.data),

  spendingByCategory: (id: string, periodStart?: string, periodEnd?: string) =>
    api.get<SpendingByCategoryResponse>(`/cards/${id}/spending`, {
      params: { period_start: periodStart, period_end: periodEnd },
    }).then((r) => r.data),
}
