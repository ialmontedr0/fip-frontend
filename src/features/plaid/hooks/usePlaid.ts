import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as plaidApi from '../api/plaid'

export const plaidKeys = {
  all: ['plaid'] as const,
  status: () => [...plaidKeys.all, 'status'] as const,
  items: () => [...plaidKeys.all, 'items'] as const,
}

export function usePlaidStatus() {
  return useQuery({ queryKey: plaidKeys.status(), queryFn: () => plaidApi.getPlaidStatus() })
}

export function usePlaidItems() {
  return useQuery({ queryKey: plaidKeys.items(), queryFn: () => plaidApi.listPlaidItems() })
}

export function useLinkToken() {
  return useMutation({ mutationFn: () => plaidApi.createLinkToken() })
}

export function useExchangeToken() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (publicToken: string) => plaidApi.exchangePublicToken(publicToken),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: plaidKeys.items() })
      toast.success('Cuenta bancaria vinculada')
    },
    onError: () => toast.error('No se pudo vincular la cuenta'),
  })
}

export function useDeletePlaidItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => plaidApi.deletePlaidItem(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: plaidKeys.items() })
      toast.success('Vinculación eliminada')
    },
  })
}

export function usePlaidItemTransactions(id: string, startDate: string, endDate: string) {
  return useQuery({
    queryKey: [...plaidKeys.all, 'item', id, 'transactions', startDate, endDate] as const,
    queryFn: () => plaidApi.listPlaidItemTransactions(id, startDate, endDate),
    enabled: !!id,
  })
}
