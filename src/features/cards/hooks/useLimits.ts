import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { limitsApi } from '../api/limits'
import type { CreateSpendingLimitRequest, UpdateSpendingLimitRequest } from '@/types/cards'

const limitKeys = (cardId: string) => ['cards', cardId, 'limits'] as const

export function useSpendingLimitList(cardId: string) {
  return useQuery({
    queryKey: limitKeys(cardId),
    queryFn: () => limitsApi.list(cardId),
    enabled: !!cardId,
  })
}

export function useCreateSpendingLimit(cardId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateSpendingLimitRequest) => limitsApi.create(cardId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: limitKeys(cardId) }),
  })
}

export function useUpdateSpendingLimit(cardId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ limitId, data }: { limitId: string; data: UpdateSpendingLimitRequest }) =>
      limitsApi.update(cardId, limitId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: limitKeys(cardId) }),
  })
}

export function useDeleteSpendingLimit(cardId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (limitId: string) => limitsApi.delete(cardId, limitId),
    onSuccess: () => qc.invalidateQueries({ queryKey: limitKeys(cardId) }),
  })
}
