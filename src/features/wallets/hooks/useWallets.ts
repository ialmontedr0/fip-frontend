import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as walletsApi from '../api/wallets'
import type { CreateWalletRequest, UpdateWalletRequest, AddAccountRequest } from '@/types/wallets'

export function useWallets(params?: { wallet_type?: string }) {
  return useQuery({
    queryKey: ['wallets', params],
    queryFn: () => walletsApi.listWallets(params).then((r) => r.data),
  })
}

export function useWallet(id: string | undefined) {
  return useQuery({
    queryKey: ['wallets', id],
    queryFn: () => walletsApi.getWallet(id!).then((r) => r.data),
    enabled: !!id,
  })
}

export function useWalletBalance(walletId: string | undefined) {
  return useQuery({
    queryKey: ['wallets', walletId, 'balance'],
    queryFn: () => walletsApi.getWalletBalance(walletId!).then((r) => r.data),
    enabled: !!walletId,
  })
}

export function useWalletLiquidity(walletId: string | undefined) {
  return useQuery({
    queryKey: ['wallets', walletId, 'liquidity'],
    queryFn: () => walletsApi.getWalletLiquidity(walletId!).then((r) => r.data),
    enabled: !!walletId,
  })
}

export function useCreateWallet() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateWalletRequest) => walletsApi.createWallet(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
      toast.success('Wallet creado exitosamente')
    },
    onError: () => toast.error('Error al crear el wallet'),
  })
}

export function useUpdateWallet() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWalletRequest }) =>
      walletsApi.updateWallet(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
      toast.success('Wallet actualizado exitosamente')
    },
    onError: () => toast.error('Error al actualizar el wallet'),
  })
}

export function useDeleteWallet() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => walletsApi.deleteWallet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
      toast.success('Wallet eliminado exitosamente')
    },
    onError: () => toast.error('Error al eliminar el wallet'),
  })
}

export function useAddAccountToWallet() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ walletId, data }: { walletId: string; data: AddAccountRequest }) =>
      walletsApi.addAccountToWallet(walletId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['wallets', variables.walletId] })
      queryClient.invalidateQueries({ queryKey: ['wallets', variables.walletId, 'balance'] })
      queryClient.invalidateQueries({ queryKey: ['wallets', variables.walletId, 'liquidity'] })
      toast.success('Cuenta agregada al wallet')
    },
    onError: () => toast.error('Error al agregar la cuenta'),
  })
}

export function useRemoveAccountFromWallet() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ walletId, accountId }: { walletId: string; accountId: string }) =>
      walletsApi.removeAccountFromWallet(walletId, accountId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['wallets', variables.walletId] })
      queryClient.invalidateQueries({ queryKey: ['wallets', variables.walletId, 'balance'] })
      queryClient.invalidateQueries({ queryKey: ['wallets', variables.walletId, 'liquidity'] })
      toast.success('Cuenta removida del wallet')
    },
    onError: () => toast.error('Error al remover la cuenta'),
  })
}
