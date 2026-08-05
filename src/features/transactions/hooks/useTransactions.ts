import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as transactionsApi from '../api/transactions'
import { useOptimisticMutation } from '@/hooks/useOptimisticMutation'
import type {
  CreateTransactionRequest, UpdateTransactionRequest, AddTagsRequest,
  TransactionFilters, ListTransactionsResponse, TransactionListItem,
} from '@/types/transactions'

export const transactionKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...transactionKeys.lists(), filters] as const,
  infinite: (filters?: Record<string, unknown>) => [...transactionKeys.all, 'infinite', filters] as const,
  details: () => [...transactionKeys.all, 'detail'] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const,
  summary: (params?: Record<string, unknown>) => [...transactionKeys.all, 'summary', params] as const,
  audit: (id: string) => [...transactionKeys.all, 'audit', id] as const,
}

function cleanParams(params?: Record<string, unknown>) {
  if (!params) return undefined
  return Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(params).filter(([_, v]) => v !== undefined && v !== '' && v !== null),
  )
}

export function useTransactions(params?: TransactionFilters) {
  return useQuery({
    queryKey: transactionKeys.list(cleanParams(params as Record<string, unknown>)),
    queryFn: () => transactionsApi.listTransactions(cleanParams(params as Record<string, unknown>)).then((r) => r.data),
    staleTime: 1000 * 60,
  })
}

export function useTransactionInfinite(filters?: Omit<TransactionFilters, 'page'>) {
  return useInfiniteQuery({
    queryKey: transactionKeys.infinite(cleanParams(filters as Record<string, unknown>)),
    queryFn: ({ pageParam = 1 }) =>
      transactionsApi.listTransactions({ ...cleanParams(filters as Record<string, unknown>), page: pageParam, page_size: 20 }).then((r) => r.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage: ListTransactionsResponse) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    staleTime: 1000 * 60,
  })
}

export function useTransaction(id: string | undefined) {
  return useQuery({
    queryKey: transactionKeys.detail(id!),
    queryFn: () => transactionsApi.getTransaction(id!).then((r) => r.data),
    enabled: !!id,
  })
}

export function useTransactionSummary(dateFrom: string, dateTo: string) {
  return useQuery({
    queryKey: transactionKeys.summary({ date_from: dateFrom, date_to: dateTo }),
    queryFn: () => transactionsApi.getTransactionSummary({ date_from: dateFrom, date_to: dateTo }).then((r) => r.data),
    staleTime: 1000 * 60 * 2,
    enabled: !!dateFrom && !!dateTo,
  })
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTransactionRequest) => transactionsApi.createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() })
      queryClient.invalidateQueries({ queryKey: transactionKeys.summary() })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Transaccion creada exitosamente')
    },
    onError: (error: unknown) => {
      const message = (
        error as { response?: { data?: { error?: { message?: string } } } }
      )?.response?.data?.error?.message
      toast.error(message || 'Error al crear la transaccion')
    },
  })
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTransactionRequest }) =>
      transactionsApi.updateTransaction(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() })
      queryClient.invalidateQueries({ queryKey: transactionKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Transaccion actualizada exitosamente')
    },
    onError: () => toast.error('Error al actualizar la transaccion'),
  })
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient()
  return useOptimisticMutation({
    mutationFn: (id: string) => transactionsApi.deleteTransaction(id),
    keys: [transactionKeys.lists(), transactionKeys.infinite()],
    optimisticUpdate: (id, _ctx) => {
      void _ctx
      const removeFromList = (old: unknown): unknown => {
        if (!old || typeof old !== 'object' || !('transactions' in old)) return old
        const data = old as { transactions: TransactionListItem[]; total: number }
        const transactions = data.transactions.filter((tx) => tx.id !== id)
        return { ...data, transactions, total: Math.max(0, data.total - 1) }
      }
      queryClient.setQueriesData<unknown>({ queryKey: transactionKeys.lists() }, removeFromList)
      queryClient.setQueriesData<unknown>({ queryKey: transactionKeys.infinite() }, removeFromList)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.summary() })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Transaccion eliminada exitosamente')
    },
    onError: () => toast.error('Error al eliminar la transaccion'),
  })
}

export function useAddTags() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ transactionId, data }: { transactionId: string; data: AddTagsRequest }) =>
      transactionsApi.addTags(transactionId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.detail(variables.transactionId) })
      toast.success('Etiquetas agregadas')
    },
    onError: () => toast.error('Error al agregar etiquetas'),
  })
}

export function useRemoveTag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ transactionId, tagName }: { transactionId: string; tagName: string }) =>
      transactionsApi.removeTag(transactionId, tagName),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.detail(variables.transactionId) })
      toast.success('Etiqueta removida')
    },
    onError: () => toast.error('Error al remover etiqueta'),
  })
}

export function useAuditLog(transactionId: string | undefined) {
  return useQuery({
    queryKey: transactionKeys.audit(transactionId!),
    queryFn: () => transactionsApi.getAuditLog(transactionId!).then((r) => r.data),
    enabled: !!transactionId,
    staleTime: 1000 * 60 * 5,
  })
}
