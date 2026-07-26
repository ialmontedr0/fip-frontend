import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cardsApi } from '../api/cards'
import type { CreateCardRequest, UpdateCardRequest } from '@/types/cards'

const keys = {
  all: ['cards'] as const,
  lists: () => [...keys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...keys.lists(), filters] as const,
  summaries: () => [...keys.all, 'summary'] as const,
  details: () => [...keys.all, 'detail'] as const,
  detail: (id: string) => [...keys.details(), id] as const,
  utilization: (id: string) => [...keys.all, 'utilization', id] as const,
  utilizationHistory: (id: string, months?: number) =>
    [...keys.all, 'utilizationHistory', id, months] as const,
  spending: (id: string, periodStart?: string, periodEnd?: string) =>
    [...keys.all, 'spending', id, periodStart, periodEnd] as const,
}

export function useCardList(filters?: { is_active?: boolean }) {
  return useQuery({
    queryKey: keys.list(filters as Record<string, unknown> | undefined),
    queryFn: () => cardsApi.list(filters),
  })
}

export function useCardSummary() {
  return useQuery({
    queryKey: keys.summaries(),
    queryFn: () => cardsApi.summary(),
  })
}

export function useCard(id: string) {
  return useQuery({
    queryKey: keys.detail(id),
    queryFn: () => cardsApi.get(id),
    enabled: !!id,
  })
}

export function useCreateCard() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateCardRequest) => cardsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.lists() })
      qc.invalidateQueries({ queryKey: keys.summaries() })
    },
  })
}

export function useUpdateCard() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCardRequest }) =>
      cardsApi.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: keys.detail(id) })
      qc.invalidateQueries({ queryKey: keys.lists() })
      qc.invalidateQueries({ queryKey: keys.summaries() })
    },
  })
}

export function useDeleteCard() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => cardsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all })
    },
  })
}

export function useCardUtilization(id: string) {
  return useQuery({
    queryKey: keys.utilization(id),
    queryFn: () => cardsApi.utilization(id),
    enabled: !!id,
  })
}

export function useUtilizationHistory(id: string, months = 6) {
  return useQuery({
    queryKey: keys.utilizationHistory(id, months),
    queryFn: () => cardsApi.utilizationHistory(id, months),
    enabled: !!id,
  })
}

export function useSpendingByCategory(id: string, periodStart?: string, periodEnd?: string) {
  return useQuery({
    queryKey: keys.spending(id, periodStart, periodEnd),
    queryFn: () => cardsApi.spendingByCategory(id, periodStart, periodEnd),
    enabled: !!id,
  })
}
