import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { debitCardsApi } from '../api/debitCards'
import type { CreateDebitCardRequest, UpdateDebitCardRequest } from '@/types/debitCards'

const keys = {
  all: ['debit-cards'] as const,
  lists: () => [...keys.all, 'list'] as const,
  list: (accountId?: string) => [...keys.lists(), accountId] as const,
  details: () => [...keys.all, 'detail'] as const,
  detail: (id: string) => [...keys.details(), id] as const,
}

export function useDebitCardList(accountId?: string) {
  return useQuery({
    queryKey: keys.list(accountId),
    queryFn: () => debitCardsApi.list(accountId),
  })
}

export function useDebitCard(id: string) {
  return useQuery({
    queryKey: keys.detail(id),
    queryFn: () => debitCardsApi.get(id),
    enabled: !!id,
  })
}

export function useCreateDebitCard() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateDebitCardRequest) => debitCardsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.lists() })
    },
  })
}

export function useUpdateDebitCard() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDebitCardRequest }) =>
      debitCardsApi.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: keys.detail(id) })
      qc.invalidateQueries({ queryKey: keys.lists() })
    },
  })
}

export function useDeleteDebitCard() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => debitCardsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all })
    },
  })
}
