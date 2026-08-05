import api from '@/lib/api'

export interface PlaidItem {
  id: string
  item_id: string
  institution_id: string | null
  institution_name: string | null
  status: string
  last_sync_at: string | null
  created_at: string | null
}

export interface PlaidTransaction {
  transaction_id: string
  name: string | null
  merchant_name: string | null
  amount: number | null
  amount_decimal: string | null
  currency_code: string | null
  date: string | null
  datetime: string | null
  category: string | null
  category_id: string | null
  account_id: string | null
  pending: boolean
  payment_channel: string | null
  logo_url: string | null
}

export interface PlaidStatus {
  enabled: boolean
  environment: string
}

export interface PlaidLinkTokenResponse {
  success: boolean
  enabled: boolean
  link_token: string | null
}

export interface PlaidExchangeResponse {
  success: boolean
  enabled: boolean
  item: PlaidItem | null
}

export function getPlaidStatus() {
  return api.get<PlaidStatus>('/plaid/status').then((r) => r.data)
}

export function createLinkToken() {
  return api.post<PlaidLinkTokenResponse>('/plaid/link-token', {}).then((r) => r.data)
}

export function exchangePublicToken(publicToken: string) {
  return api
    .post<PlaidExchangeResponse>('/plaid/exchange-token', { public_token: publicToken })
    .then((r) => r.data)
}

export function listPlaidItems() {
  return api.get<{ items: PlaidItem[] }>('/plaid/items').then((r) => r.data)
}

export function deletePlaidItem(id: string) {
  return api.delete(`/plaid/items/${id}`).then((r) => r.data)
}

export function listPlaidItemTransactions(id: string, startDate: string, endDate: string) {
  return api
    .get<{ transactions: PlaidTransaction[] }>(`/plaid/items/${id}/transactions`, {
      params: { start_date: startDate, end_date: endDate },
    })
    .then((r) => r.data)
}
