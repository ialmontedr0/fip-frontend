import api from '@/lib/api'
import type {
  CreateDebitCardRequest,
  UpdateDebitCardRequest,
  DebitCardResponse,
  ListDebitCardsResponse,
} from '@/types/debitCards'

const BASE = '/debit-cards'

export const debitCardsApi = {
  list: (accountId?: string) =>
    api.get<ListDebitCardsResponse>(BASE, {
      params: accountId ? { account_id: accountId } : undefined,
    }).then((r) => r.data),

  get: (id: string) =>
    api.get<DebitCardResponse>(`${BASE}/${id}`).then((r) => r.data),

  create: (data: CreateDebitCardRequest) =>
    api.post<DebitCardResponse>(BASE, data).then((r) => r.data),

  update: (id: string, data: UpdateDebitCardRequest) =>
    api.patch<DebitCardResponse>(`${BASE}/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`${BASE}/${id}`).then((r) => r.data),
}
