import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { paymentsApi } from '../api/payments'
import type { MakePaymentRequest } from '@/types/loans'

export function usePaymentList(loanId: string, params?: { limit?: number; offset?: number }) {
  return useQuery({
    queryKey: ['loans', loanId, 'payments', params],
    queryFn: () => paymentsApi.list(loanId, params),
    enabled: !!loanId,
  })
}

export function useMakePayment(loanId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: MakePaymentRequest) => paymentsApi.make(loanId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['loans', loanId] })
      qc.invalidateQueries({ queryKey: ['loans', loanId, 'payments'] })
      qc.invalidateQueries({ queryKey: ['loans', loanId, 'amortization'] })
    },
  })
}

export function useEarlyPayoff(loanId: string, payoffDate?: string) {
  return useQuery({
    queryKey: ['loans', loanId, 'earlyPayoff', payoffDate],
    queryFn: () => paymentsApi.earlyPayoff(loanId, payoffDate),
    enabled: !!loanId,
  })
}
