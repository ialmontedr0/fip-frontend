import api from '@/lib/api'
import type {
  CreateLoanRequest,
  UpdateLoanRequest,
  UpdateLoanStatusRequest,
  LoanDetailResponse,
  ListLoansResponse,
  LoanSummaryResponse,
  SimulateLoanRequest,
  SimulateLoanResponse,
} from '@/types/loans'

export const loansApi = {
  list: (params?: { status?: string; loan_type?: string }) =>
    api.get<ListLoansResponse>('/loans', { params }).then((r) => r.data),

  summary: () =>
    api.get<LoanSummaryResponse>('/loans/summary').then((r) => r.data),

  get: (id: string) =>
    api.get<LoanDetailResponse>(`/loans/${id}`).then((r) => r.data),

  create: (data: CreateLoanRequest) =>
    api.post<LoanDetailResponse>('/loans', data).then((r) => r.data),

  update: (id: string, data: UpdateLoanRequest) =>
    api.patch(`/loans/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/loans/${id}`).then((r) => r.data),

  updateStatus: (id: string, data: UpdateLoanStatusRequest) =>
    api.patch(`/loans/${id}/status`, data).then((r) => r.data),

  simulate: (data: SimulateLoanRequest) =>
    api.post<SimulateLoanResponse>('/loans/simulate', data).then((r) => r.data),
}
