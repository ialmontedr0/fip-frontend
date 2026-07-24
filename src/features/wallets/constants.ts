import {
  User, Building2, PiggyBank, TrendingUp, Sunrise, ShieldAlert,
} from 'lucide-react'
import type { WalletType, LiquidityLevel } from '@/types/wallets'

export const WALLET_TYPE_CONFIG: Record<WalletType, {
  icon: React.ComponentType<{ className?: string }>
  label: string
  color: string
  bgColor: string
  gradient: string
}> = {
  personal: {
    icon: User,
    label: 'Personal',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-500/10',
    gradient: 'from-blue-400 to-blue-600',
  },
  business: {
    icon: Building2,
    label: 'Negocio',
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-100 dark:bg-indigo-500/10',
    gradient: 'from-indigo-400 to-indigo-600',
  },
  savings: {
    icon: PiggyBank,
    label: 'Ahorro',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-500/10',
    gradient: 'from-purple-400 to-purple-600',
  },
  investment: {
    icon: TrendingUp,
    label: 'Inversion',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-500/10',
    gradient: 'from-green-400 to-green-600',
  },
  daily: {
    icon: Sunrise,
    label: 'Uso Diario',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-500/10',
    gradient: 'from-orange-400 to-orange-600',
  },
  emergency: {
    icon: ShieldAlert,
    label: 'Emergencia',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-500/10',
    gradient: 'from-red-400 to-red-600',
  },
}

export const LIQUIDITY_CONFIG: Record<LiquidityLevel, {
  color: string
  bgColor: string
  label: string
  description: string
}> = {
  high: {
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-500/10',
    label: 'Alta',
    description: 'Acceso inmediato a los fondos',
  },
  medium: {
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-500/10',
    label: 'Media',
    description: 'Acceso en 1-3 dias',
  },
  low: {
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-500/10',
    label: 'Baja',
    description: 'Acceso variable o restringido',
  },
  mixed: {
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-500/10',
    label: 'Mixta',
    description: 'Multiples niveles de liquidez',
  },
}
