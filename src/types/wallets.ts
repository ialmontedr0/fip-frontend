export const WALLET_TYPES = {
  personal: 'Personal',
  business: 'Negocio',
  savings: 'Ahorro',
  investment: 'Inversion',
  daily: 'Uso Diario',
  emergency: 'Fondo de Emergencia',
} as const

export type WalletType = keyof typeof WALLET_TYPES

export const WALLET_STATUSES = {
  active: 'Activa',
  archived: 'Archivada',
} as const

export type WalletStatus = keyof typeof WALLET_STATUSES

export const LIQUIDITY_LEVELS = {
  high: 'Alta - Acceso inmediato',
  medium: 'Media - Acceso en 1-3 dias',
  low: 'Baja - Acceso variable',
  mixed: 'Mixta - Multiples niveles',
} as const

export type LiquidityLevel = keyof typeof LIQUIDITY_LEVELS

export interface CreateWalletRequest {
  name: string
  description?: string | null
  wallet_type: WalletType
  icon?: string | null
  color?: string | null
  sort_order?: number
}

export interface UpdateWalletRequest {
  name?: string
  description?: string | null
  wallet_type?: WalletType
  icon?: string | null
  color?: string | null
  sort_order?: number
  status?: WalletStatus
}

export interface AddAccountRequest {
  account_id: string
  notes?: string | null
}

export interface WalletResponse {
  id: string
  name: string
  description: string | null
  wallet_type: string
  status: string
  icon: string | null
  color: string | null
  sort_order: number
  created_at: string | null
  updated_at: string | null
}

export interface WalletListItem {
  id: string
  name: string
  description: string | null
  wallet_type: string
  status: string
  icon: string | null
  color: string | null
  sort_order: number
  account_count: number
  created_at: string | null
}

export interface ListWalletsResponse {
  wallets: WalletListItem[]
  total: number
}

export interface WalletAccountItem {
  id: string
  name: string
  account_type: string
  currency_code: string
  balance: string
  status: string
}

export interface WalletDetailResponse {
  id: string
  name: string
  description: string | null
  wallet_type: string
  status: string
  icon: string | null
  color: string | null
  sort_order: number
  accounts: WalletAccountItem[]
  created_at: string | null
  updated_at: string | null
}

export interface CurrencyBalance {
  currency: string
  account_count: number
  total_balance: string
}

export interface WalletBalanceResponse {
  wallet_id: string
  wallet_name: string
  total_accounts: number
  by_currency: Record<string, CurrencyBalance>
}

export interface LiquidityItem {
  account_type: string
  account_count: number
  total_balance: string
  liquidity_level: string
}

export interface WalletLiquidityResponse {
  wallet_id: string
  wallet_name: string
  overall_level: LiquidityLevel
  breakdown: Record<string, LiquidityItem>
  total_accounts: number
}

export interface AddAccountResponse {
  message: string
  wallet_id: string
  account_id: string
  added_at: string | null
}

export interface DeleteWalletResponse {
  message: string
  wallet_id: string
}
