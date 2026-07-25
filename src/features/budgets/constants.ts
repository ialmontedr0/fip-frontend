import {
  PiggyBank, Wallet, Filter,
  BarChart3, CircleAlert, TriangleAlert, Bell, Info,
} from 'lucide-react'
import type { BudgetType, BudgetPeriod, BudgetStatus, AlertSeverity } from '@/types/budgets'

export const BUDGET_TYPE_CONFIG: Record<BudgetType, { label: string; description: string; gradient: string }> = {
  total: { label: 'Total', description: 'Limite general de gastos', gradient: 'from-violet-500 to-purple-600' },
  category: { label: 'Por Categoria', description: 'Limite por categoria de gasto', gradient: 'from-blue-500 to-cyan-600' },
  account: { label: 'Por Cuenta', description: 'Limite por cuenta bancaria', gradient: 'from-emerald-500 to-teal-600' },
}

export const BUDGET_TYPE_OPTIONS = [
  { value: 'total' as const, label: 'Total', description: 'Limite general de gastos', icon: PiggyBank },
  { value: 'category' as const, label: 'Categoria', description: 'Limite por categoria', icon: Filter },
  { value: 'account' as const, label: 'Cuenta', description: 'Limite por cuenta', icon: Wallet },
]

export const PERIOD_CONFIG: Record<BudgetPeriod, { label: string; monthsSpan: number }> = {
  weekly: { label: 'Semanal', monthsSpan: 0.25 },
  biweekly: { label: 'Quincenal', monthsSpan: 0.5 },
  monthly: { label: 'Mensual', monthsSpan: 1 },
  quarterly: { label: 'Trimestral', monthsSpan: 3 },
  yearly: { label: 'Anual', monthsSpan: 12 },
}

export const PERIOD_OPTIONS = [
  { value: 'weekly' as const, label: 'Semanal' },
  { value: 'biweekly' as const, label: 'Quincenal' },
  { value: 'monthly' as const, label: 'Mensual' },
  { value: 'quarterly' as const, label: 'Trimestral' },
  { value: 'yearly' as const, label: 'Anual' },
]

export const STRATEGY_OPTIONS = [
  { value: '' as const, label: 'Ninguna' },
  { value: 'zero_based' as const, label: 'Zero-Based' },
  { value: '50_30_20' as const, label: '50/30/20' },
  { value: 'envelope' as const, label: 'Sobre' },
  { value: 'custom' as const, label: 'Personalizado' },
]

export const STATUS_CONFIG: Record<BudgetStatus, { label: string; textColor: string; bgColor: string; barColor: string; glowColor: string }> = {
  ok: {
    label: 'Dentro del presupuesto',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-500/10',
    barColor: 'bg-gradient-to-r from-emerald-400 to-emerald-500',
    glowColor: 'shadow-emerald-500/20',
  },
  warning: {
    label: 'Cerca del limite',
    textColor: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-500/10',
    barColor: 'bg-gradient-to-r from-amber-400 to-amber-500',
    glowColor: 'shadow-amber-500/20',
  },
  exceeded: {
    label: 'Presupuesto excedido',
    textColor: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-500/10',
    barColor: 'bg-gradient-to-r from-red-400 to-red-500',
    glowColor: 'shadow-red-500/20',
  },
}

export const ALERT_SEVERITY_CONFIG: Record<AlertSeverity, { label: string; icon: typeof Bell; color: string; bgColor: string; borderColor: string }> = {
  info: { label: 'Informativo', icon: Info, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-500/10', borderColor: 'border-blue-200 dark:border-blue-500/30' },
  warning: { label: 'Advertencia', icon: TriangleAlert, color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-50 dark:bg-amber-500/10', borderColor: 'border-amber-200 dark:border-amber-500/30' },
  critical: { label: 'Critico', icon: CircleAlert, color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-50 dark:bg-red-500/10', borderColor: 'border-red-200 dark:border-red-500/30' },
}

export const ALERT_TYPE_LABELS: Record<string, string> = {
  threshold_reached: 'Umbral Alcanzado',
  budget_exceeded: 'Limite Excedido',
  near_limit: 'Cerca del Limite',
  spending_spike: 'Pico de Gasto',
  period_ending: 'Fin de Periodo',
  auto_adjust: 'Ajuste Automatico',
}

export const NAV_TABS = [
  { path: '/budgets', label: 'Presupuestos', icon: PiggyBank },
  { path: '/budgets/summary', label: 'Resumen', icon: BarChart3 },
  { path: '/budgets/alerts', label: 'Alertas', icon: Bell },
] as const
