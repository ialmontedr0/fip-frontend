export const ASSET_TYPES = {
  stock: 'Accion',
  bond: 'Bono',
  etf: 'ETF',
  crypto: 'Criptomoneda',
  mutual_fund: 'Fondo Mutuo',
  real_estate: 'Bien Raiz',
  commodity: 'Materia Prima',
} as const

export type AssetType = keyof typeof ASSET_TYPES

export const INVESTMENT_TX_TYPES = {
  buy: 'Compra',
  sell: 'Venta',
  dividend: 'Dividendo',
  fee: 'Comision',
} as const

export type InvestmentTxType = keyof typeof INVESTMENT_TX_TYPES

export interface CreateAssetRequest {
  name: string
  asset_type: AssetType
  currency?: string
  symbol?: string | null
  current_price?: number | null
}

export interface Asset {
  id: string
  name: string
  symbol: string | null
  asset_type: AssetType
  currency: string
  current_price: number | null
  created_at: string | null
}

export interface AssetDetail extends Asset {
  transactions: InvestmentTransaction[]
  transactions_count: number
}

export interface InvestmentTransaction {
  id: string
  asset_id: string
  portfolio_id: string | null
  type: InvestmentTxType
  quantity: number
  price_per_unit: number
  total_amount: number
  fees: number
  date: string
  notes: string | null
  created_at: string | null
}

export interface CreateInvestmentTransactionRequest {
  type: InvestmentTxType
  quantity: number
  price_per_unit: number
  fees?: number
  portfolio_id?: string | null
  date?: string | null
  total_amount?: number | null
  notes?: string | null
}

export interface CreatePortfolioRequest {
  name: string
  description?: string | null
}

export interface Portfolio {
  id: string
  name: string
  description: string | null
  asset_count: number
  created_at: string | null
}

export interface PortfolioHolding {
  asset_id: string
  name: string
  symbol: string | null
  asset_type: AssetType
  currency: string
  current_price: number | null
  quantity: number
  cost_basis: number
  average_price: number | null
  market_value: number
}

export interface PortfolioDetail extends Portfolio {
  assets: PortfolioHolding[]
  transactions: InvestmentTransaction[]
}

export interface PortfolioSummaryResponse {
  total_value: number
  total_cost: number
  gain_loss: number
  gain_loss_percent: number
  asset_allocation: Record<string, number>
  portfolio_count: number
  asset_count: number
  holdings: HoldingSummary[]
}

export interface HoldingSummary {
  asset_id: string
  name: string
  symbol: string | null
  asset_type: AssetType
  currency: string
  quantity: number
  cost_basis: number
  market_value: number
}

export interface PricePoint {
  id: string
  asset_id: string
  date: string
  open_price: number | null
  close_price: number
  high_price: number | null
  low_price: number | null
  volume: number | null
}

export interface ListAssetsResponse {
  assets: Asset[]
  total: number
}

export interface ListPortfoliosResponse {
  portfolios: Portfolio[]
  total: number
}

export interface PriceHistoryResponse {
  asset_id: string
  points: PricePoint[]
}
