import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const DEFAULT_CURRENCY = 'DOP'

export type CurrencyCode =
  | 'DOP'
  | 'MXN'
  | 'USD'
  | 'EUR'
  | 'CAD'
  | 'GBP'
  | 'JPY'
  | 'CNY'
  | 'BRL'
  | 'ARS'
  | 'CLP'
  | 'COP'
  | 'PEN'

interface CurrencyState {
  currency: CurrencyCode
  rates: Record<string, number>
  setCurrency: (currency: CurrencyCode) => void
  setRates: (rates: Record<string, number>) => void
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: DEFAULT_CURRENCY,
      rates: {},
      setCurrency: (currency) => set({ currency }),
      setRates: (rates) => set({ rates }),
    }),
    { name: 'fip-currency' },
  ),
)

export function convertAmount(amount: number, from: string, to: string, rates: Record<string, number>): number {
  if (from === to) return amount
  // Tasas expresadas en DOP por unidad de cada moneda (base DOP)
  const fromRate = from === DEFAULT_CURRENCY ? 1 : rates[from]
  const toRate = to === DEFAULT_CURRENCY ? 1 : rates[to]
  if (!fromRate || !toRate) return amount
  return (amount / fromRate) * toRate
}
