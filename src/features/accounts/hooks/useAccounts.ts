import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as accountsApi from '../api/accounts'
import type { CreateAccountRequest, UpdateAccountRequest } from '@/types/accounts'

export function useAccounts(params?: { account_type?: string; include_archived?: boolean }) {
  return useQuery({
    queryKey: ['accounts', params],
    queryFn: () => accountsApi.listAccounts(params).then((r) => r.data),
  })
}

export function useAccount(id: string | undefined) {
  return useQuery({
    queryKey: ['accounts', id],
    queryFn: () => accountsApi.getAccount(id!).then((r) => r.data),
    enabled: !!id,
  })
}

export function useAccountSummary() {
  return useQuery({
    queryKey: ['accounts', 'summary'],
    queryFn: () => accountsApi.getAccountSummary().then((r) => r.data),
  })
}

export function useCreateAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateAccountRequest) => accountsApi.createAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['accounts', 'summary'] })
      toast.success('Cuenta creada exitosamente')
    },
    onError: (error: unknown) => {
      const message = (
        error as { response?: { data?: { error?: { message?: string } } } }
      )?.response?.data?.error?.message
      toast.error(message || 'Error al crear la cuenta')
    },
  })
}

export function useUpdateAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAccountRequest }) =>
      accountsApi.updateAccount(id, data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['accounts', id] })
      toast.success('Cuenta actualizada exitosamente')
    },
    onError: () => toast.error('Error al actualizar la cuenta'),
  })
}

export function useDeleteAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => accountsApi.deleteAccount(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['accounts', 'summary'] })
      queryClient.removeQueries({ queryKey: ['accounts', id] })
      toast.success('Cuenta eliminada exitosamente')
    },
    onError: () => toast.error('Error al eliminar la cuenta'),
  })
}
