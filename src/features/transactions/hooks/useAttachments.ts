import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as attachmentsApi from '../api/attachments'
import { transactionKeys } from './useTransactions'

export function useUploadAttachment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ transactionId, file }: { transactionId: string; file: File }) =>
      attachmentsApi.uploadAttachment(transactionId, file),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.detail(variables.transactionId) })
      toast.success('Archivo subido exitosamente')
    },
    onError: () => toast.error('Error al subir el archivo'),
  })
}

export function useDeleteAttachment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ transactionId, attachmentId }: { transactionId: string; attachmentId: string }) =>
      attachmentsApi.deleteAttachment(transactionId, attachmentId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.detail(variables.transactionId) })
      toast.success('Archivo eliminado')
    },
    onError: () => toast.error('Error al eliminar el archivo'),
  })
}
