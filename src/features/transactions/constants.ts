import {
  TrendingUp, TrendingDown, Scale,
  CheckCircle2, Clock, XCircle,
  Repeat,
} from 'lucide-react'
import type { TransactionType, TransactionStatus, RecurringFrequency } from '@/types/transactions'
import type { LucideIcon } from 'lucide-react'

export const TRANSACTION_TYPE_CONFIG: Record<TransactionType, {
  label: string
  color: string
  colorHex: string
  bgColor: string
  gradient: string
  icon: LucideIcon
}> = {
  income: {
    label: 'Ingreso',
    color: 'text-emerald-600 dark:text-emerald-400',
    colorHex: '#059669',
    bgColor: 'bg-emerald-100 dark:bg-emerald-500/10',
    gradient: 'from-emerald-400 to-emerald-600',
    icon: TrendingUp,
  },
  expense: {
    label: 'Gasto',
    color: 'text-red-600 dark:text-red-400',
    colorHex: '#dc2626',
    bgColor: 'bg-red-100 dark:bg-red-500/10',
    gradient: 'from-red-400 to-red-600',
    icon: TrendingDown,
  },
  adjustment: {
    label: 'Ajuste',
    color: 'text-amber-600 dark:text-amber-400',
    colorHex: '#d97706',
    bgColor: 'bg-amber-100 dark:bg-amber-500/10',
    gradient: 'from-amber-400 to-amber-600',
    icon: Scale,
  },
}

export const TRANSACTION_STATUS_CONFIG: Record<TransactionStatus, {
  label: string
  variant: 'success' | 'warning' | 'danger' | 'default'
  icon: LucideIcon
  color: string
  bgColor: string
}> = {
  completed: { label: 'Completada', variant: 'success', icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-100 dark:bg-emerald-500/10' },
  pending: { label: 'Pendiente', variant: 'warning', icon: Clock, color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-500/10' },
  cancelled: { label: 'Cancelada', variant: 'danger', icon: XCircle, color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-500/10' },
}

export const RECURRING_FREQUENCY_CONFIG: Record<RecurringFrequency, {
  label: string
  icon: LucideIcon
}> = {
  daily: { label: 'Diario', icon: Repeat },
  weekly: { label: 'Semanal', icon: Repeat },
  monthly: { label: 'Mensual', icon: Repeat },
  yearly: { label: 'Anual', icon: Repeat },
}

export const PERIOD_OPTIONS = [
  { value: 'this_month', label: 'Este Mes' },
  { value: 'last_month', label: 'Mes Pasado' },
  { value: 'this_year', label: 'Este Ano' },
  { value: 'custom', label: 'Personalizado' },
] as const

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const

export const SORT_OPTIONS = [
  { value: 'effective_date', label: 'Fecha' },
  { value: 'amount', label: 'Monto' },
  { value: 'description', label: 'Descripcion' },
  { value: 'created_at', label: 'Creado' },
] as const
