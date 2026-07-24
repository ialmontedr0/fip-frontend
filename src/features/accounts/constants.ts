import {
  Landmark, Wallet, PiggyBank, ScrollText, WalletCards, Bitcoin,
} from 'lucide-react'
import type { AccountType } from '@/types/accounts'

export const ACCOUNT_TYPE_CONFIG: Record<AccountType, {
  icon: React.ComponentType<{ className?: string }>
  label: string
  color: string
  bgColor: string
  gradient: string
}> = {
  bank: {
    icon: Landmark,
    label: 'Bancaria',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-500/10',
    gradient: 'from-blue-400 to-blue-600',
  },
  cash: {
    icon: Wallet,
    label: 'Efectivo',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-500/10',
    gradient: 'from-green-400 to-green-600',
  },
  savings: {
    icon: PiggyBank,
    label: 'Ahorro',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-500/10',
    gradient: 'from-purple-400 to-purple-600',
  },
  checking: {
    icon: ScrollText,
    label: 'Corriente',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-500/10',
    gradient: 'from-orange-400 to-orange-600',
  },
  wallet: {
    icon: WalletCards,
    label: 'Digital',
    color: 'text-teal-600 dark:text-teal-400',
    bgColor: 'bg-teal-100 dark:bg-teal-500/10',
    gradient: 'from-teal-400 to-teal-600',
  },
  crypto: {
    icon: Bitcoin,
    label: 'Crypto',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-500/10',
    gradient: 'from-amber-400 to-amber-600',
  },
}

export const SUPPORTED_CURRENCIES: Record<string, string> = {
  DOP: 'Peso Dominicano',
  USD: 'Dolar Estadounidense',
  EUR: 'Euro',
  GBP: 'Libra Esterlina',
  CAD: 'Dolar Canadiense',
  MXN: 'Peso Mexicano',
  COP: 'Peso Colombiano',
  VES: 'Bolivar Venezolano',
  ARS: 'Peso Argentino',
  CLP: 'Peso Chileno',
  PEN: 'Sol Peruano',
  BRL: 'Real Brasileño',
  JPY: 'Yen Japones',
  CHF: 'Franco Suizo',
  CNY: 'Yuan Chino',
  INR: 'Rupia India',
  KRW: 'Won Surcoreano',
  AUD: 'Dolar Australiano',
  NZD: 'Dolar Neozelandes',
}
