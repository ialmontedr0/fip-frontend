import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { billsApi } from '../api/bills'
import type { CreateBillRequest, UpdateBillRequest, PayBillRequest } from '@/types/cards'

const billKeys = (cardId: string) => ['cards', cardId, 'bills'] as const

export function useBillList(cardId: string) {
  return useQuery({
    queryKey: billKeys(cardId),
    queryFn: () => billsApi.list(cardId),
    enabled: !!cardId,
  })
}

export function useCreateBill(cardId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateBillRequest) => billsApi.create(cardId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: billKeys(cardId) }),
  })
}

export function useUpdateBill(cardId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ billId, data }: { billId: string; data: UpdateBillRequest }) =>
      billsApi.update(cardId, billId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: billKeys(cardId) }),
  })
}

export function useDeleteBill(cardId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (billId: string) => billsApi.delete(cardId, billId),
    onSuccess: () => qc.invalidateQueries({ queryKey: billKeys(cardId) }),
  })
}

export function usePayBill(cardId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ billId, data }: { billId: string; data: PayBillRequest }) =>
      billsApi.pay(cardId, billId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: billKeys(cardId) })
      qc.invalidateQueries({ queryKey: ['cards', cardId] })
    },
  })
}

export function useGenerateStatement(cardId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => billsApi.generateStatement(cardId),
    onSuccess: () => qc.invalidateQueries({ queryKey: billKeys(cardId) }),
  })
}
