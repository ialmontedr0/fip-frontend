import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as cardsApi from '../api/creditCards'
import type { CreateCreditCardRequest, UpdateCardRequest, PayBillRequest } from '@/types/expenses'

export const cardKeys = {
  all: ['credit-cards'] as const,
  lists: () => [...cardKeys.all, 'list'] as const,
  details: () => [...cardKeys.all, 'detail'] as const,
  detail: (id: string) => [...cardKeys.details(), id] as const,
  utilization: (id: string) => [...cardKeys.all, 'utilization', id] as const,
  utilizationHistory: (id: string) => [...cardKeys.all, 'utilization-history', id] as const,
  bills: (id: string) => [...cardKeys.all, 'bills', id] as const,
  summary: () => [...cardKeys.all, 'summary'] as const,
}

export function useCreditCards() {
  return useQuery({
    queryKey: cardKeys.lists(),
    queryFn: () => cardsApi.listCards().then((r) => r.data),
    staleTime: 1000 * 60 * 2,
  })
}

export function useCreditCard(id: string | undefined) {
  return useQuery({
    queryKey: cardKeys.detail(id!),
    queryFn: () => cardsApi.getCard(id!).then((r) => r.data),
    enabled: !!id,
  })
}

export function useCardUtilization(cardId: string | undefined) {
  return useQuery({
    queryKey: cardKeys.utilization(cardId!),
    queryFn: () => cardsApi.getCardUtilization(cardId!).then((r) => r.data),
    enabled: !!cardId,
    staleTime: 1000 * 60,
  })
}

export function useUtilizationHistory(cardId: string | undefined, months = 6) {
  return useQuery({
    queryKey: [...cardKeys.utilizationHistory(cardId!), months],
    queryFn: () => cardsApi.getUtilizationHistory(cardId!, months).then((r) => r.data),
    enabled: !!cardId,
    staleTime: 1000 * 60 * 5,
  })
}

export function useCardsSummary() {
  return useQuery({
    queryKey: cardKeys.summary(),
    queryFn: () => cardsApi.getCardsSummary().then((r) => r.data),
    staleTime: 1000 * 60 * 2,
  })
}

export function useCardBills(cardId: string | undefined) {
  return useQuery({
    queryKey: cardKeys.bills(cardId!),
    queryFn: () => cardsApi.listCardBills(cardId!).then((r) => r.data),
    enabled: !!cardId,
    staleTime: 1000 * 60,
  })
}

export function useCreateCard() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateCreditCardRequest) => cardsApi.createCard(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cardKeys.lists() })
      toast.success('Tarjeta creada exitosamente')
    },
    onError: () => toast.error('Error al crear la tarjeta'),
  })
}

export function useUpdateCard() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCardRequest }) =>
      cardsApi.updateCard(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: cardKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: cardKeys.lists() })
      toast.success('Tarjeta actualizada')
    },
    onError: () => toast.error('Error al actualizar la tarjeta'),
  })
}

export function useDeleteCard() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => cardsApi.deleteCard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cardKeys.lists() })
      toast.success('Tarjeta eliminada')
    },
    onError: () => toast.error('Error al eliminar la tarjeta'),
  })
}

export function usePayCardBill() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ cardId, billId, data }: { cardId: string; billId: string; data: PayBillRequest }) =>
      cardsApi.payCardBill(cardId, billId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: cardKeys.bills(variables.cardId) })
      queryClient.invalidateQueries({ queryKey: cardKeys.utilization(variables.cardId) })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Factura pagada exitosamente')
    },
    onError: () => toast.error('Error al pagar la factura'),
  })
}
