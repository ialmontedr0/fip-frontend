import api from '@/lib/api'
import type {
  CreateSpendingLimitRequest,
  UpdateSpendingLimitRequest,
  SpendingLimitResponse,
  ListSpendingLimitsResponse,
} from '@/types/cards'

export const limitsApi = {
  list: (cardId: string) =>
    api.get<ListSpendingLimitsResponse>(`/cards/${cardId}/limits`).then((r) => r.data),

  create: (cardId: string, data: CreateSpendingLimitRequest) =>
    api.post<SpendingLimitResponse>(`/cards/${cardId}/limits`, data).then((r) => r.data),

  update: (cardId: string, limitId: string, data: UpdateSpendingLimitRequest) =>
    api.patch<SpendingLimitResponse>(`/cards/${cardId}/limits/${limitId}`, data).then((r) => r.data),

  delete: (cardId: string, limitId: string) =>
    api.delete(`/cards/${cardId}/limits/${limitId}`).then((r) => r.data),
}
