import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as transfersApi from '../api/transfers'
import { transactionKeys } from './useTransactions'
import type { CreateTransferRequest } from '@/types/transactions'

export function useCreateTransfer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTransferRequest) => transfersApi.createTransfer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() })
      queryClient.invalidateQueries({ queryKey: transactionKeys.summary() })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Transferencia creada exitosamente')
    },
    onError: (error: unknown) => {
      const message = (
        error as { response?: { data?: { error?: { message?: string } } } }
      )?.response?.data?.error?.message
      toast.error(message || 'Error al crear la transferencia')
    },
  })
}
