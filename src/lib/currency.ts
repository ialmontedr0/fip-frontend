import { useCurrencyStore } from '@/stores/currency-store'

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
