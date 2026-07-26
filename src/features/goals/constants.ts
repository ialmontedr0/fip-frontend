import {
  PiggyBank, CreditCard, TrendingUp, Shield,
  GraduationCap, Heart, Flag,
  CheckCircle2, PauseCircle, XCircle,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { GoalType, GoalStatus } from '@/types/goals'

export const GOAL_TYPE_CONFIG: Record<GoalType, {
  label: string
  icon: LucideIcon
  color: string
  bgColor: string
  gradient: string
  description: string
}> = {
  savings: {
    label: 'Ahorro', icon: PiggyBank,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-500/10',
    gradient: 'from-blue-400 to-blue-600',
    description: 'Ahorro general para cualquier proposito',
  },
  debt_payoff: {
    label: 'Pago Deuda', icon: CreditCard,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-500/10',
    gradient: 'from-red-400 to-red-600',
    description: 'Pagar una deuda existente',
  },
  investment: {
    label: 'Inversion', icon: TrendingUp,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-500/10',
    gradient: 'from-emerald-400 to-emerald-600',
    description: 'Invertir para crecimiento financiero',
  },
  emergency: {
    label: 'Emergencia', icon: Shield,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-500/10',
    gradient: 'from-amber-400 to-amber-600',
    description: 'Fondo de emergencia (3-6 meses)',
  },
  education: {
    label: 'Educacion', icon: GraduationCap,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-500/10',
    gradient: 'from-purple-400 to-purple-600',
    description: 'Estudios, cursos o capacitacion',
  },
  retirement: {
    label: 'Jubilacion', icon: Heart,
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-100 dark:bg-rose-500/10',
    gradient: 'from-rose-400 to-rose-600',
    description: 'Ahorro para el retiro',
  },
  custom: {
    label: 'Personalizado', icon: Flag,
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-500/10',
    gradient: 'from-gray-400 to-gray-600',
    description: 'Meta personalizada',
  },
}

export const GOAL_STATUS_CONFIG: Record<GoalStatus, {
  label: string
  icon: LucideIcon
  color: string
  bgColor: string
  dotColor: string
}> = {
  active: { label: 'Activa', icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-100 dark:bg-emerald-500/10', dotColor: 'bg-emerald-500' },
  completed: { label: 'Completada', icon: CheckCircle2, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-500/10', dotColor: 'bg-blue-500' },
  paused: { label: 'Pausada', icon: PauseCircle, color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-500/10', dotColor: 'bg-amber-500' },
  cancelled: { label: 'Cancelada', icon: XCircle, color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-500/10', dotColor: 'bg-red-500' },
}

export const PRIORITY_CONFIG: Record<number, { label: string; color: string; bgColor: string }> = {
  1: { label: 'Muy Baja', color: 'text-gray-400 dark:text-gray-500', bgColor: 'bg-gray-100 dark:bg-gray-800' },
  2: { label: 'Baja', color: 'text-blue-500 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-500/10' },
  3: { label: 'Normal', color: 'text-emerald-500 dark:text-emerald-400', bgColor: 'bg-emerald-100 dark:bg-emerald-500/10' },
  4: { label: 'Alta', color: 'text-amber-500 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-500/10' },
  5: { label: 'Critica', color: 'text-red-500 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-500/10' },
}

export const GOAL_TYPE_OPTIONS = Object.entries(GOAL_TYPE_CONFIG).map(([value, config]) => ({
  value: value as GoalType,
  label: config.label,
  icon: config.icon,
  gradient: config.gradient,
  description: config.description,
}))

export const PRIORITY_OPTIONS = [
  { value: 1, label: 'Muy Baja', description: 'Sin prisa, objetivo a largo plazo' },
  { value: 2, label: 'Baja', description: 'Poca urgencia' },
  { value: 3, label: 'Normal', description: 'Prioridad media' },
  { value: 4, label: 'Alta', description: 'Importante, atencion regular' },
  { value: 5, label: 'Critica', description: 'Urgente, maxima prioridad' },
]

export const COMPOUND_OPTIONS = [
  { value: 'daily', label: 'Diario' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'biweekly', label: 'Quincenal' },
  { value: 'monthly', label: 'Mensual' },
  { value: 'quarterly', label: 'Trimestral' },
  { value: 'yearly', label: 'Anual' },
]

export function formatCurrency(value: string | number | null | undefined): string {
  if (value == null) return '$0'
  const num = typeof value === 'string' ? Number(value) : value
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num)
}

export function getProgressColor(pct: number, behind?: boolean): string {
  if (pct >= 100) return 'text-emerald-500'
  if (behind) return 'text-red-500'
  if (pct >= 75) return 'text-blue-500'
  if (pct >= 50) return 'text-amber-500'
  return 'text-gray-400'
}

export function getProgressBarColor(pct: number, behind?: boolean): string {
  if (pct >= 100) return 'bg-gradient-to-r from-emerald-400 to-emerald-500'
  if (behind) return 'bg-gradient-to-r from-red-400 to-red-500'
  if (pct >= 75) return 'bg-gradient-to-r from-blue-400 to-blue-500'
  if (pct >= 50) return 'bg-gradient-to-r from-amber-400 to-amber-500'
  return 'bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-500 dark:to-gray-600'
}
