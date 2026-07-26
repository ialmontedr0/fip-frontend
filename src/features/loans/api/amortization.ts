import api from '@/lib/api'
import type { AmortizationResponse, AmortizationSummaryResponse } from '@/types/loans'

export const amortizationApi = {
  get: (loanId: string, paidOnly = false) =>
    api.get<AmortizationResponse>(`/loans/${loanId}/amortization`, {
      params: { paid_only: paidOnly },
    }).then((r) => r.data),

  summary: (loanId: string) =>
    api.get<AmortizationSummaryResponse>(`/loans/${loanId}/amortization/summary`).then((r) => r.data),
}
