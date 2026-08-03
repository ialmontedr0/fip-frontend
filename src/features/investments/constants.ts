export const ASSET_TYPE_ICONS: Record<string, string> = {
  stock: 'LineChart',
  bond: 'Landmark',
  etf: 'PieChart',
  crypto: 'Bitcoin',
  mutual_fund: 'Wallet',
  real_estate: 'Building2',
  commodity: 'Package',
}

export const ASSET_TYPE_COLORS: Record<string, string> = {
  stock: '#3b82f6',
  bond: '#8b5cf6',
  etf: '#06b6d4',
  crypto: '#f59e0b',
  mutual_fund: '#10b981',
  real_estate: '#f97316',
  commodity: '#6b7280',
}

export const TX_TYPE_COLORS: Record<string, string> = {
  buy: '#22c55e',
  sell: '#ef4444',
  dividend: '#3b82f6',
  fee: '#f59e0b',
}

export const TX_TYPE_LABELS: Record<string, string> = {
  buy: 'Compra',
  sell: 'Venta',
  dividend: 'Dividendo',
  fee: 'Comision',
}
