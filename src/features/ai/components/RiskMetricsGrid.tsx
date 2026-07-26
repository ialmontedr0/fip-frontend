import type { RiskMetrics } from '@/types/ai'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Percent, Shield, AlertTriangle, CreditCard } from 'lucide-react'

const LABEL_MAP: Record<string, string> = {
  insufficient_data: 'Sin datos suficientes',
  low: 'Bajo',
  medium: 'Medio',
  high: 'Alto',
  critical: 'Critico',
  stable: 'Estable',
  variable: 'Variable',
  good: 'Bueno',
  excellent: 'Excelente',
  poor: 'Deficiente',
  no_risk: 'Sin riesgo',
  at_risk: 'En riesgo',
}

interface RiskMetricsGridProps {
  metrics: RiskMetrics | undefined
  className?: string
}

const METRIC_CONFIG = [
  { key: 'income_volatility' as const, icon: TrendingUp, label: 'Volatilidad Ingresos', color: 'from-blue-400 to-cyan-500', shadow: 'shadow-blue-500/20' },
  { key: 'expense_volatility' as const, icon: TrendingDown, label: 'Volatilidad Gastos', color: 'from-rose-400 to-pink-500', shadow: 'shadow-rose-500/20' },
  { key: 'debt_to_income' as const, icon: Percent, label: 'Deuda/Ingreso', color: 'from-orange-400 to-red-500', shadow: 'shadow-orange-500/20' },
  { key: 'emergency_fund' as const, icon: Shield, label: 'Fondo Emergencia', color: 'from-emerald-400 to-green-500', shadow: 'shadow-emerald-500/20' },
  { key: 'budget_risk' as const, icon: AlertTriangle, label: 'Riesgo Presupuesto', color: 'from-amber-400 to-yellow-500', shadow: 'shadow-amber-500/20' },
  { key: 'subscription_creep' as const, icon: CreditCard, label: 'Suscripciones', color: 'from-violet-400 to-purple-500', shadow: 'shadow-violet-500/20' },
] as const

function getMetricValue(metrics: RiskMetrics, key: string): { display: string; severity: 'low' | 'medium' | 'high' | 'critical' | 'good' | 'excellent' | 'poor' | 'no_risk' | 'at_risk' | 'stable' | 'variable' } {
  const m = metrics[key as keyof RiskMetrics] as { label: string }
  const label = LABEL_MAP[m.label] || m.label

  return { display: label, severity: m.label as any }
}

function getGradientForSeverity(severity: string): string {
  if (severity === 'critical' || severity === 'poor' || severity === 'at_risk') return 'from-red-500 to-rose-500 text-transparent bg-clip-text'
  if (severity === 'high' || severity === 'variable') return 'from-orange-500 to-red-500 text-transparent bg-clip-text'
  if (severity === 'medium') return 'from-amber-500 to-yellow-500 text-transparent bg-clip-text'
  return 'from-emerald-500 to-green-500 text-transparent bg-clip-text'
}

function RiskMetricsGrid({ metrics, className }: RiskMetricsGridProps) {
  if (!metrics) {
    return (
      <div className={cn('flex items-center justify-center h-32 text-sm text-gray-400', className)}>
        Sin metricas disponibles
      </div>
    )
  }

  return (
    <div className={cn('grid grid-cols-2 lg:grid-cols-3 gap-3', className)}>
      {METRIC_CONFIG.map((cfg) => {
        const { display, severity } = getMetricValue(metrics, cfg.key)
        return (
          <div
            key={cfg.key}
            className={cn(
              'rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-4 shadow-sm transition-all duration-300',
              'hover:shadow-lg hover:-translate-y-0.5 hover:border-gray-200/80 dark:hover:border-gray-600/80 hover:scale-[1.02]',
            )}
          >
            <div className="flex items-center gap-2 mb-2.5">
              <div className={cn('flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg', cfg.color, cfg.shadow)}>
                <cfg.icon className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{cfg.label}</span>
            </div>
            <p className={cn('text-sm font-bold', getGradientForSeverity(severity))}>
              {display}
            </p>
          </div>
        )
      })}
    </div>
  )
}

export default RiskMetricsGrid
