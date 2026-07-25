import {
  Briefcase, Code, Store, TrendingUp, Home, Heart,
  Building2, Gift, HelpCircle,
  CalendarCheck, CalendarX, CalendarClock, Calendar,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { IncomeType, StabilityType, IncomeStatus } from '@/types/incomes'

export const INCOME_TYPE_CONFIG: Record<IncomeType, {
  label: string
  icon: LucideIcon
  color: string
  bgColor: string
  gradient: string
}> = {
  salary:     { label: 'Salario',     icon: Briefcase,   color: 'text-blue-600 dark:text-blue-400',     bgColor: 'bg-blue-100 dark:bg-blue-500/10',     gradient: 'from-blue-400 to-blue-600' },
  freelance:  { label: 'Freelance',   icon: Code,         color: 'text-purple-600 dark:text-purple-400',  bgColor: 'bg-purple-100 dark:bg-purple-500/10',  gradient: 'from-purple-400 to-purple-600' },
  business:   { label: 'Negocio',     icon: Store,        color: 'text-amber-600 dark:text-amber-400',   bgColor: 'bg-amber-100 dark:bg-amber-500/10',   gradient: 'from-amber-400 to-amber-600' },
  investment: { label: 'Inversion',   icon: TrendingUp,   color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-100 dark:bg-emerald-500/10', gradient: 'from-emerald-400 to-emerald-600' },
  rental:     { label: 'Alquiler',    icon: Home,         color: 'text-cyan-600 dark:text-cyan-400',     bgColor: 'bg-cyan-100 dark:bg-cyan-500/10',     gradient: 'from-cyan-400 to-cyan-600' },
  pension:    { label: 'Pension',     icon: Heart,        color: 'text-rose-600 dark:text-rose-400',     bgColor: 'bg-rose-100 dark:bg-rose-500/10',     gradient: 'from-rose-400 to-rose-600' },
  government: { label: 'Gobierno',    icon: Building2,    color: 'text-slate-600 dark:text-slate-400',   bgColor: 'bg-slate-100 dark:bg-slate-500/10',   gradient: 'from-slate-400 to-slate-600' },
  gift:       { label: 'Regalo',      icon: Gift,         color: 'text-pink-600 dark:text-pink-400',     bgColor: 'bg-pink-100 dark:bg-pink-500/10',     gradient: 'from-pink-400 to-pink-600' },
  other:      { label: 'Otro',        icon: HelpCircle,   color: 'text-gray-600 dark:text-gray-400',     bgColor: 'bg-gray-100 dark:bg-gray-500/10',     gradient: 'from-gray-400 to-gray-600' },
}

export const INCOME_STATUS_CONFIG: Record<IncomeStatus, {
  label: string
  variant: 'success' | 'warning' | 'danger' | 'default' | 'info'
  icon: LucideIcon
  color: string
  bgColor: string
}> = {
  received: { label: 'Recibido',  variant: 'success', icon: CalendarCheck, color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-100 dark:bg-emerald-500/10' },
  pending:  { label: 'Pendiente', variant: 'warning', icon: CalendarClock, color: 'text-amber-600 dark:text-amber-400',   bgColor: 'bg-amber-100 dark:bg-amber-500/10' },
  expected: { label: 'Esperado',  variant: 'info',    icon: Calendar,      color: 'text-blue-600 dark:text-blue-400',     bgColor: 'bg-blue-100 dark:bg-blue-500/10' },
  overdue:  { label: 'Vencido',   variant: 'danger',  icon: CalendarX,     color: 'text-red-600 dark:text-red-400',       bgColor: 'bg-red-100 dark:bg-red-500/10' },
  cancelled:{ label: 'Cancelado', variant: 'default', icon: CalendarX,     color: 'text-gray-600 dark:text-gray-400',    bgColor: 'bg-gray-100 dark:bg-gray-500/10' },
}

export const STABILITY_CONFIG: Record<StabilityType, {
  label: string
  color: string
  bgColor: string
  dotColor: string
  description: string
}> = {
  fixed:     { label: 'Fijo',      color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-100 dark:bg-emerald-500/10', dotColor: 'bg-emerald-500', description: 'Monto fijo predecible' },
  variable:  { label: 'Variable',  color: 'text-amber-600 dark:text-amber-400',     bgColor: 'bg-amber-100 dark:bg-amber-500/10',   dotColor: 'bg-amber-500', description: 'Monto variable pero recurrente' },
  irregular: { label: 'Irregular', color: 'text-red-600 dark:text-red-400',         bgColor: 'bg-red-100 dark:bg-red-500/10',       dotColor: 'bg-red-500',   description: 'Sin patron predecible' },
  seasonal:  { label: 'Estacional',color: 'text-purple-600 dark:text-purple-400',   bgColor: 'bg-purple-100 dark:bg-purple-500/10', dotColor: 'bg-purple-500', description: 'Ocurre en temporadas especificas' },
}

export const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Diario' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'biweekly', label: 'Quincenal' },
  { value: 'monthly', label: 'Mensual' },
  { value: 'quarterly', label: 'Trimestral' },
  { value: 'yearly', label: 'Anual' },
] as const

export const PERIOD_OPTIONS = [
  { value: 'this_month', label: 'Este Mes' },
  { value: 'last_month', label: 'Mes Pasado' },
  { value: 'this_quarter', label: 'Este Trimestre' },
  { value: 'this_year', label: 'Este Ano' },
  { value: 'last_year', label: 'Ano Pasado' },
  { value: 'custom', label: 'Personalizado' },
] as const

export const CHART_COLORS = {
  income: '#10b981',
  expense: '#ef4444',
  primary: '#3b82f6',
}
