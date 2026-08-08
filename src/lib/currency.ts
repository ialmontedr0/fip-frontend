import { useCurrencyStore } from '@/stores/currency-store'
import { DEFAULT_CURRENCY, convertAmount } from '@/stores/currency-store'
import api from '@/lib/api'

export async function loadCurrencyRates(): Promise<Record<string, number>> {
  try {
    const { data } = await api.get<{ base: string; rates: Record<string, number> }>(
      '/currency/rates/base',
    )
    const base = data.base ?? DEFAULT_CURRENCY
    const map = { ...data.rates }
    map[base] = map[base] ?? 1
    useCurrencyStore.getState().setRates(map)
    return map
  } catch {
    return {}
  }
}

export async function refreshCurrencyRates(): Promise<void> {
  await loadCurrencyRates()
}

export function useConverted(amount: number, from: string): number {
  const currency = useCurrencyStore((s) => s.currency)
  const rates = useCurrencyStore((s) => s.rates)
  return convertAmount(amount, from, currency, rates)
}

export const CURRENCY_SYMBOLS: Record<string, string> = {
  DOP: 'RD$',
  MXN: '$',
  USD: '$',
  EUR: '€',
  CAD: '$',
  GBP: '£',
  JPY: '¥',
  CNY: '¥',
  BRL: 'R$',
  ARS: '$',
  CLP: '$',
  COP: '$',
  PEN: 'S/',
}

export function formatAmount(amount: number | string, currency?: string): string {
  const code = currency ?? useCurrencyStore.getState().currency
  const num = typeof amount === 'string' ? Number(amount) : amount
  if (isNaN(num)) return '0'
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num)
}
