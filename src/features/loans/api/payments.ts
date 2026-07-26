import api from '@/lib/api'
import type {
  MakePaymentRequest,
  MakePaymentResponse,
  ListPaymentsResponse,
  EarlyPayoffResponse,
} from '@/types/loans'

export const paymentsApi = {
  list: (loanId: string, params?: { limit?: number; offset?: number }) =>
    api.get<ListPaymentsResponse>(`/loans/${loanId}/payments`, { params }).then((r) => r.data),

  make: (loanId: string, data: MakePaymentRequest) =>
    api.post<MakePaymentResponse>(`/loans/${loanId}/payments`, data).then((r) => r.data),

  earlyPayoff: (loanId: string, payoffDate?: string) =>
    api.get<EarlyPayoffResponse>(`/loans/${loanId}/early-payoff`, {
      params: { payoff_date: payoffDate },
    }).then((r) => r.data),
}
