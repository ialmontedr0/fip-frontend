import type { RiskFactor } from '@/types/ai'
import SeverityBadge from './SeverityBadge'
import { cn } from '@/lib/utils'
import { AlertTriangle, Gauge } from 'lucide-react'

interface RiskFactorCardProps {
  factor: RiskFactor
  index?: number
}

const SEVERITY_GRADIENT: Record<string, string> = {
  low: 'from-emerald-500 to-green-500',
  medium: 'from-amber-500 to-yellow-500',
  high: 'from-orange-500 to-red-500',
  critical: 'from-red-500 to-rose-500',
}

const SEVERITY_BAR: Record<string, string> = {
  low: 'bg-gradient-to-r from-emerald-500 to-green-500',
  medium: 'bg-gradient-to-r from-amber-500 to-yellow-500',
  high: 'bg-gradient-to-r from-orange-500 to-red-500',
  critical: 'bg-gradient-to-r from-red-500 to-rose-500',
}

function RiskFactorCard({ factor, index = 0 }: RiskFactorCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm transition-all duration-300',
        'hover:shadow-lg hover:-translate-y-0.5 hover:border-gray-200/80 dark:hover:border-gray-600/80',
      )}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={cn('flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg', SEVERITY_GRADIENT[factor.severity] || 'from-gray-400 to-gray-500')}>
            <AlertTriangle className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{factor.title}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{factor.description}</p>
          </div>
        </div>
        <SeverityBadge severity={factor.severity} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
            <Gauge className="h-3 w-3" />
            Metrica
          </span>
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{factor.metric.toFixed(2)}</span>
        </div>
        <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all duration-700', SEVERITY_BAR[factor.severity] || 'bg-gray-400')}
            style={{ width: `${Math.min(factor.metric * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default RiskFactorCard
