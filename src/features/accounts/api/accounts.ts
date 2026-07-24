import api from '@/lib/api'
import type {
  AccountResponse, ListAccountsResponse,
  AccountSummaryResponse, DeleteAccountResponse,
  CreateAccountRequest, UpdateAccountRequest,
} from '@/types/accounts'

export function createAccount(data: CreateAccountRequest) {
  return api.post<AccountResponse>('/accounts', data)
}

export function listAccounts(params?: { account_type?: string; include_archived?: boolean }) {
  return api.get<ListAccountsResponse>('/accounts', { params })
}

export function getAccountSummary() {
  return api.get<AccountSummaryResponse>('/accounts/summary')
}

export function getAccount(id: string) {
  return api.get<AccountResponse>(`/accounts/${id}`)
}

export function updateAccount(id: string, data: UpdateAccountRequest) {
  return api.patch<{ message: string }>(`/accounts/${id}`, data)
}

export function deleteAccount(id: string) {
  return api.delete<DeleteAccountResponse>(`/accounts/${id}`)
}
