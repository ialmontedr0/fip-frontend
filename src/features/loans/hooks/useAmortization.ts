import { useQuery } from '@tanstack/react-query'
import { amortizationApi } from '../api/amortization'

export function useAmortizationSchedule(loanId: string, paidOnly = false) {
  return useQuery({
    queryKey: ['loans', loanId, 'amortization', { paidOnly }],
    queryFn: () => amortizationApi.get(loanId, paidOnly),
    enabled: !!loanId,
  })
}

export function useAmortizationSummary(loanId: string) {
  return useQuery({
    queryKey: ['loans', loanId, 'amortization', 'summary'],
    queryFn: () => amortizationApi.summary(loanId),
    enabled: !!loanId,
  })
}
