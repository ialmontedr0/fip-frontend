import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { creditPurchasesApi } from '../api/creditPurchases'
import type { CreateCreditPurchaseRequest, UpdateCreditPurchaseRequest, SimulateCreditPurchaseRequest } from '@/types/creditPurchases'

const keys = {
  all: ['credit-purchases'] as const,
  lists: () => [...keys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...keys.lists(), filters] as const,
  details: () => [...keys.all, 'detail'] as const,
  detail: (id: string) => [...keys.details(), id] as const,
}

export function useCreditPurchaseList(filters?: { status?: string }) {
  return useQuery({
    queryKey: keys.list(filters as Record<string, unknown> | undefined),
    queryFn: () => creditPurchasesApi.list(filters),
  })
}

export function useCreditPurchase(id: string) {
  return useQuery({
    queryKey: keys.detail(id),
    queryFn: () => creditPurchasesApi.get(id),
    enabled: !!id,
  })
}

export function useCreateCreditPurchase() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateCreditPurchaseRequest) => creditPurchasesApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.lists() })
    },
  })
}

export function useUpdateCreditPurchase() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCreditPurchaseRequest }) =>
      creditPurchasesApi.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: keys.detail(id) })
      qc.invalidateQueries({ queryKey: keys.lists() })
    },
  })
}

export function useDeleteCreditPurchase() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => creditPurchasesApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  })
}

export function useSimulateCreditPurchase() {
  return useMutation({
    mutationFn: (data: SimulateCreditPurchaseRequest) => creditPurchasesApi.simulate(data),
  })
}

export function useMarkInstallmentPaid() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ purchaseId, installmentId }: { purchaseId: string; installmentId: string }) =>
      creditPurchasesApi.markInstallmentPaid(purchaseId, installmentId),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  })
}
