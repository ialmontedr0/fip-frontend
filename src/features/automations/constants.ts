import {
  TrendingUp, Wallet, Calendar, CreditCard, PieChart, Flag,
  ArrowRightLeft, CreditCard as CreditCardIcon, PlusCircle, Bell, SlidersHorizontal,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { TriggerType, ActionType, ExecutionStatus } from '@/types/automations'

export interface WizardStep {
  id: number
  label: string
  title: string
}

export const WIZARD_STEPS: WizardStep[] = [
  { id: 1, label: 'Trigger', title: 'Selecciona el tipo de disparador' },
  { id: 2, label: 'Condiciones', title: 'Configura las condiciones del disparador' },
  { id: 3, label: 'Acción', title: 'Selecciona el tipo de acción' },
  { id: 4, label: 'Parámetros', title: 'Configura los parámetros de la acción' },
  { id: 5, label: 'Revisar', title: 'Revisa y crea la automatización' },
]

export interface TriggerOption {
  value: TriggerType
  label: string
  description: string
  icon: LucideIcon
  gradient: string
}

export const TRIGGER_TYPE_OPTIONS: TriggerOption[] = [
  { value: 'income_received', label: 'Ingreso Recibido', description: 'Cuando se registre un ingreso', icon: TrendingUp, gradient: 'from-emerald-400 to-emerald-600' },
  { value: 'balance_threshold', label: 'Saldo Límite', description: 'Cuando el saldo supere un umbral', icon: Wallet, gradient: 'from-blue-400 to-blue-600' },
  { value: 'date_scheduled', label: 'Fecha Programada', description: 'En una fecha específica cada mes', icon: Calendar, gradient: 'from-purple-400 to-purple-600' },
  { value: 'bill_due_soon', label: 'Factura Próxima', description: 'Cuando una factura esté por vencer', icon: CreditCard, gradient: 'from-rose-400 to-rose-600' },
  { value: 'budget_exceeded', label: 'Presupuesto Excedido', description: 'Cuando un presupuesto se exceda', icon: PieChart, gradient: 'from-amber-400 to-amber-600' },
  { value: 'goal_completed', label: 'Meta Completada', description: 'Cuando una meta se complete', icon: Flag, gradient: 'from-cyan-400 to-cyan-600' },
]

export const TRIGGER_CONFIG: Record<TriggerType, { label: string; icon: LucideIcon; gradient: string }> = {
  income_received: { label: 'Ingreso Recibido', icon: TrendingUp, gradient: 'from-emerald-400 to-emerald-600' },
  balance_threshold: { label: 'Saldo Límite', icon: Wallet, gradient: 'from-blue-400 to-blue-600' },
  date_scheduled: { label: 'Fecha Programada', icon: Calendar, gradient: 'from-purple-400 to-purple-600' },
  bill_due_soon: { label: 'Factura Próxima', icon: CreditCard, gradient: 'from-rose-400 to-rose-600' },
  budget_exceeded: { label: 'Presupuesto Excedido', icon: PieChart, gradient: 'from-amber-400 to-amber-600' },
  goal_completed: { label: 'Meta Completada', icon: Flag, gradient: 'from-cyan-400 to-cyan-600' },
}

export interface ActionOption {
  value: ActionType
  label: string
  description: string
  icon: LucideIcon
  gradient: string
}

export const ACTION_TYPE_OPTIONS: ActionOption[] = [
  { value: 'transfer', label: 'Transferencia', description: 'Transferir entre cuentas', icon: ArrowRightLeft, gradient: 'from-blue-400 to-blue-600' },
  { value: 'pay_credit_card', label: 'Pagar Tarjeta', description: 'Pagar saldo de tarjeta', icon: CreditCardIcon, gradient: 'from-rose-400 to-rose-600' },
  { value: 'create_transaction', label: 'Crear Transacción', description: 'Registrar una transacción', icon: PlusCircle, gradient: 'from-emerald-400 to-emerald-600' },
  { value: 'notify', label: 'Notificar', description: 'Enviar una notificación', icon: Bell, gradient: 'from-amber-400 to-amber-600' },
  { value: 'adjust_budget', label: 'Ajustar Presupuesto', description: 'Modificar un presupuesto', icon: SlidersHorizontal, gradient: 'from-purple-400 to-purple-600' },
]

export const ACTION_CONFIG: Record<ActionType, { label: string; icon: LucideIcon; gradient: string }> = {
  transfer: { label: 'Transferencia', icon: ArrowRightLeft, gradient: 'from-blue-400 to-blue-600' },
  pay_credit_card: { label: 'Pagar Tarjeta', icon: CreditCardIcon, gradient: 'from-rose-400 to-rose-600' },
  create_transaction: { label: 'Crear Transacción', icon: PlusCircle, gradient: 'from-emerald-400 to-emerald-600' },
  notify: { label: 'Notificar', icon: Bell, gradient: 'from-amber-400 to-amber-600' },
  adjust_budget: { label: 'Ajustar Presupuesto', icon: SlidersHorizontal, gradient: 'from-purple-400 to-purple-600' },
}

export const EXECUTION_STATUS_CONFIG: Record<ExecutionStatus, { label: string; color: string; bgColor: string; dotColor: string }> = {
  success: { label: 'Ejecutado', color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-50 dark:bg-emerald-500/10', dotColor: 'bg-emerald-500' },
  failed: { label: 'Fallido', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-50 dark:bg-red-500/10', dotColor: 'bg-red-500' },
  dry_run: { label: 'Simulación', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-500/10', dotColor: 'bg-blue-500' },
  skipped: { label: 'Saltado', color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-50 dark:bg-amber-500/10', dotColor: 'bg-amber-500' },
  error: { label: 'Error', color: 'text-rose-600 dark:text-rose-400', bgColor: 'bg-rose-50 dark:bg-rose-500/10', dotColor: 'bg-rose-500' },
}
