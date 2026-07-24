import api from '@/lib/api'
import type {
  WalletResponse, ListWalletsResponse,
  WalletDetailResponse, WalletBalanceResponse, WalletLiquidityResponse,
  AddAccountResponse, DeleteWalletResponse,
  CreateWalletRequest, UpdateWalletRequest, AddAccountRequest,
} from '@/types/wallets'

export function createWallet(data: CreateWalletRequest) {
  return api.post<WalletResponse>('/wallets', data)
}

export function listWallets(params?: { wallet_type?: string }) {
  return api.get<ListWalletsResponse>('/wallets', { params })
}

export function getWallet(id: string) {
  return api.get<WalletDetailResponse>(`/wallets/${id}`)
}

export function updateWallet(id: string, data: UpdateWalletRequest) {
  return api.patch<WalletResponse>(`/wallets/${id}`, data)
}

export function deleteWallet(id: string) {
  return api.delete<DeleteWalletResponse>(`/wallets/${id}`)
}

export function addAccountToWallet(walletId: string, data: AddAccountRequest) {
  return api.post<AddAccountResponse>(`/wallets/${walletId}/accounts`, data)
}

export function removeAccountFromWallet(walletId: string, accountId: string) {
  return api.delete<{ message: string; wallet_id: string; account_id: string }>(
    `/wallets/${walletId}/accounts/${accountId}`,
  )
}

export function getWalletBalance(walletId: string) {
  return api.get<WalletBalanceResponse>(`/wallets/${walletId}/balance`)
}

export function getWalletLiquidity(walletId: string) {
  return api.get<WalletLiquidityResponse>(`/wallets/${walletId}/liquidity`)
}
