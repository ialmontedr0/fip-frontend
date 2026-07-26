import api from '@/lib/api'
import type {
  CreateBillRequest,
  UpdateBillRequest,
  PayBillRequest,
  BillResponse,
  PayBillResponse,
  ListBillsResponse,
  GenerateStatementResponse,
} from '@/types/cards'

export const billsApi = {
  list: (cardId: string) =>
    api.get<ListBillsResponse>(`/cards/${cardId}/bills`).then((r) => r.data),

  create: (cardId: string, data: CreateBillRequest) =>
    api.post<BillResponse>(`/cards/${cardId}/bills`, data).then((r) => r.data),

  update: (cardId: string, billId: string, data: UpdateBillRequest) =>
    api.patch<BillResponse>(`/cards/${cardId}/bills/${billId}`, data).then((r) => r.data),

  delete: (cardId: string, billId: string) =>
    api.delete(`/cards/${cardId}/bills/${billId}`).then((r) => r.data),

  pay: (cardId: string, billId: string, data: PayBillRequest) =>
    api.post<PayBillResponse>(`/cards/${cardId}/bills/${billId}/pay`, data).then((r) => r.data),

  generateStatement: (cardId: string) =>
    api.post<GenerateStatementResponse | { message: string }>(`/cards/${cardId}/statements/generate`).then((r) => r.data),
}
