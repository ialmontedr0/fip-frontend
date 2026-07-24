export const ACCOUNT_TYPES = {
  bank: 'Cuenta Bancaria',
  cash: 'Efectivo',
  savings: 'Cuenta de Ahorro',
  checking: 'Cuenta Corriente',
  wallet: 'Billetera Digital',
  crypto: 'Criptomonedas',
} as const

export type AccountType = keyof typeof ACCOUNT_TYPES

export const ACCOUNT_STATUSES = {
  active: 'Activa',
  inactive: 'Inactiva',
  archived: 'Archivada',
  frozen: 'Congelada',
} as const

export type AccountStatus = keyof typeof ACCOUNT_STATUSES

export interface CreateAccountRequest {
  name: string
  account_type: AccountType
  currency_code?: string
  initial_balance?: number
  institution?: string | null
  account_number_last4?: string | null
  icon?: string | null
  color?: string | null
  notes?: string | null
  include_in_net_worth?: boolean
  include_in_totals?: boolean
  sort_order?: number
}

export interface UpdateAccountRequest {
  name?: string
  institution?: string | null
  account_number_last4?: string | null
  icon?: string | null
  color?: string | null
  notes?: string | null
  include_in_net_worth?: boolean
  include_in_totals?: boolean
  sort_order?: number
  status?: AccountStatus
}

export interface AccountResponse {
  id: string
  name: string
  account_type: string
  status: string
  currency_code: string
  balance: string
  initial_balance: string | null
  institution: string | null
  account_number_last4: string | null
  icon: string | null
  color: string | null
  notes: string | null
  include_in_net_worth: boolean
  include_in_totals: boolean
  sort_order: number
  created_at: string | null
  updated_at: string | null
}

export interface AccountListItem {
  id: string
  name: string
  account_type: string
  status: string
  currency_code: string
  balance: string
  institution: string | null
  icon: string | null
  color: string | null
  include_in_net_worth: boolean
  sort_order: number
  created_at: string | null
}

export interface ListAccountsResponse {
  accounts: AccountListItem[]
  total: number
}

export interface CurrencySummary {
  currency: string
  account_count: number
  total_balance: string
}

export interface AccountSummaryResponse {
  total_accounts: number
  by_currency: Record<string, CurrencySummary>
}

export interface DeleteAccountResponse {
  message: string
  account_id: string
}
