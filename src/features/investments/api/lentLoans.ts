import api from '@/lib/api'
import type {
  CreateLentLoanRequest,
  LentLoan,
  LentLoanDetail,
  LentLoanSummary,
  ListLentLoansResponse,
  RecordLentLoanPaymentRequest,
  SimulateLentLoanRequest,
  SimulateLentLoanResponse,
} from '@/types/lentLoan'

export const lentLoansApi = {
  simulate: (data: SimulateLentLoanRequest) =>
    api.post<SimulateLentLoanResponse>('/lent-loans/simulate', data).then((r) => r.data),

  create: (data: CreateLentLoanRequest) =>
    api.post<LentLoan>('/lent-loans', data).then((r) => r.data),

  list: (params?: { status?: string; skip?: number; limit?: number }) =>
    api.get<ListLentLoansResponse>('/lent-loans', { params }).then((r) => r.data),

  get: (id: string) => api.get<LentLoanDetail>(`/lent-loans/${id}`).then((r) => r.data),

  summary: () => api.get<LentLoanSummary>('/lent-loans/summary').then((r) => r.data),

  recordPayment: (id: string, data: RecordLentLoanPaymentRequest) =>
    api.post<LentLoan>(`/lent-loans/${id}/payments`, data).then((r) => r.data),

  remove: (id: string) => api.delete(`/lent-loans/${id}`).then((r) => r.data),
}
