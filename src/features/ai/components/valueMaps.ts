export const ANOMALY_SEVERITY_LABELS: Record<string, string> = {
  low: 'Baja', medium: 'Media', high: 'Alta', critical: 'Critica',
}
export const ANOMALY_SEVERITY_COLORS: Record<string, string> = {
  low: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  medium: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
  high: 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400',
  critical: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
}

export const PRIORITY_LABELS: Record<string, string> = {
  high: 'Alta', medium: 'Media', low: 'Baja',
}

export const TRAINING_STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente', training: 'Entrenando', completed: 'Completado', failed: 'Fallido', deprecated: 'Obsoleto',
}

export const HABIT_FREQUENCY_LABELS: Record<string, string> = {
  diario: 'Diario', frecuente: 'Frecuente', regular: 'Regular', ocasional: 'Ocasional', sin_actividad: 'Sin actividad',
}

export const STABILITY_LABELS: Record<string, string> = {
  muy_estable: 'Muy Estable', estable: 'Estable', variable: 'Variable', muy_variable: 'Muy Variable',
}

export const TREND_LABELS: Record<string, string> = {
  increasing: 'Creciente', decreasing: 'Decreciente', stable: 'Estable', insufficient_data: 'Sin datos',
}

export const RISK_SEVERITY_LABELS: Record<string, string> = {
  low: 'Bajo', medium: 'Medio', high: 'Alto', critical: 'Critico',
}

export const RECOMMENDATION_TYPE_LABELS: Record<string, string> = {
  reduce_spending: 'Reducir Gastos',
  cancel_subscription: 'Cancelar Suscripcion',
  increase_savings: 'Aumentar Ahorros',
  budget_adjustment: 'Ajuste de Presupuesto',
  build_emergency_fund: 'Fondo de Emergencia',
  optimize_categories: 'Optimizar Categorias',
  spending_pattern: 'Patron de Gasto',
  habit_optimization: 'Optimizacion de Habitos',
  subscription_creep: 'Crecimiento de Suscripciones',
  income_volatility: 'Volatilidad de Ingresos',
  pay_debt: 'Pagar Deuda',
  debt_strategy: 'Estrategia de Deuda',
  savings_allocation: 'Asignacion de Ahorros',
}

export const EXPLANATION_TONE_STYLES: Record<string, string> = {
  urgent: 'border-l-red-500 bg-red-50 dark:bg-red-500/5',
  concerned: 'border-l-amber-500 bg-amber-50 dark:bg-amber-500/5',
  encouraging: 'border-l-emerald-500 bg-emerald-50 dark:bg-emerald-500/5',
  informative: 'border-l-blue-500 bg-blue-50 dark:bg-blue-500/5',
}
