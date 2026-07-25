import { AlertTriangle, Flag, Flame, Circle, Zap, Droplets, Wifi, Phone, Tv, MoreHorizontal } from 'lucide-react'
import type { Priority, ServiceType, BillingFrequency, CardNetwork, PaymentStatus } from '@/types/expenses'

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bgColor: string; icon: React.ComponentType<{ className?: string }> }> = {
  low: { label: 'Baja', color: 'text-gray-600 dark:text-gray-400', bgColor: 'bg-gray-100 dark:bg-gray-800', icon: Circle },
  normal: { label: 'Normal', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-500/10', icon: Flag },
  high: { label: 'Alta', color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-500/10', icon: AlertTriangle },
  critical: { label: 'Critica', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-500/10', icon: Flame },
}

export const SERVICE_ICON_MAP: Record<ServiceType, React.ComponentType<{ className?: string }>> = {
  electricity: Zap,
  water: Droplets,
  gas: Flame,
  internet: Wifi,
  phone: Phone,
  cable: Tv,
  other: MoreHorizontal,
}

export const SERVICE_TYPE_CONFIG: Record<ServiceType, { label: string; color: string }> = {
  electricity: { label: 'Electricidad', color: '#f59e0b' },
  water: { label: 'Agua', color: '#3b82f6' },
  gas: { label: 'Gas', color: '#ef4444' },
  internet: { label: 'Internet', color: '#8b5cf6' },
  phone: { label: 'Telefono', color: '#10b981' },
  cable: { label: 'Cable TV', color: '#ec4899' },
  other: { label: 'Otro', color: '#6b7280' },
}

export const BILLING_FREQUENCY_LABELS: Record<BillingFrequency, string> = {
  monthly: 'Mensual',
  quarterly: 'Trimestral',
  bimonthly: 'Bimestral',
  yearly: 'Anual',
}

export const BILLING_FREQUENCY_MULTIPLIER: Record<BillingFrequency, number> = {
  monthly: 12,
  quarterly: 4,
  bimonthly: 6,
  yearly: 1,
}

export const CARD_NETWORK_CONFIG: Record<CardNetwork, { label: string; color: string }> = {
  visa: { label: 'Visa', color: '#1a1f71' },
  mastercard: { label: 'Mastercard', color: '#eb001b' },
  amex: { label: 'Amex', color: '#2e77bc' },
  discover: { label: 'Discover', color: '#ff6600' },
  other: { label: 'Otra', color: '#6b7280' },
}

export const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, { label: string; color: string; bgColor: string }> = {
  pending: { label: 'Pendiente', color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-500/10' },
  partial: { label: 'Parcial', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-500/10' },
  paid: { label: 'Pagado', color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-100 dark:bg-emerald-500/10' },
  overdue: { label: 'Vencido', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-500/10' },
  waived: { label: 'Eximido', color: 'text-gray-600 dark:text-gray-400', bgColor: 'bg-gray-100 dark:bg-gray-800' },
}

export const CHART_COLORS = {
  expense: '#ef4444',
  income: '#22c55e',
  subscription: '#8b5cf6',
  service: '#f59e0b',
  template: '#3b82f6',
  categoryColors: [
    '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6',
    '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
    '#14b8a6', '#e11d48', '#0ea5e9', '#a855f7', '#d946ef',
  ],
}

export const SERVICE_TYPE_OPTIONS = Object.entries(SERVICE_TYPE_CONFIG).map(([value, config]) => ({
  value: value as ServiceType,
  label: config.label,
  color: config.color,
}))

export const PRIORITY_OPTIONS: Array<{ value: Priority; label: string }> = [
  { value: 'low', label: 'Baja' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'Alta' },
  { value: 'critical', label: 'Critica' },
]

export const FREQUENCY_OPTIONS = [
  { value: 'monthly', label: 'Mensual' },
  { value: 'biweekly', label: 'Quincenal' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'quarterly', label: 'Trimestral' },
  { value: 'yearly', label: 'Anual' },
  { value: 'one_time', label: 'Unico' },
]

export const CARD_NETWORK_OPTIONS = Object.entries(CARD_NETWORK_CONFIG).map(([value, config]) => ({
  value: value as CardNetwork,
  label: config.label,
  color: config.color,
}))
