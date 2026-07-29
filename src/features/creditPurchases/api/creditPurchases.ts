import api from '@/lib/api'
import type {
  CreateCreditPurchaseRequest,
  UpdateCreditPurchaseRequest,
  CreditPurchaseDetail,
  ListCreditPurchasesResponse,
  SimulateCreditPurchaseRequest,
  SimulateCreditPurchaseResponse,
} from '@/types/creditPurchases'

export const creditPurchasesApi = {
  list: (params?: { status?: string }) =>
    api.get<ListCreditPurchasesResponse>('/credit-purchases', { params }).then((r) => r.data),

  get: (id: string) =>
    api.get<CreditPurchaseDetail>(`/credit-purchases/${id}`).then((r) => r.data),

  create: (data: CreateCreditPurchaseRequest) =>
    api.post<CreditPurchaseDetail>('/credit-purchases', data).then((r) => r.data),

  update: (id: string, data: UpdateCreditPurchaseRequest) =>
    api.patch(`/credit-purchases/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/credit-purchases/${id}`).then((r) => r.data),

  simulate: (data: SimulateCreditPurchaseRequest) =>
    api.post<SimulateCreditPurchaseResponse>('/credit-purchases/simulate', data).then((r) => r.data),

  markInstallmentPaid: (purchaseId: string, installmentId: string) =>
    api.post(`/credit-purchases/${purchaseId}/installments/${installmentId}/pay`).then((r) => r.data),
}
