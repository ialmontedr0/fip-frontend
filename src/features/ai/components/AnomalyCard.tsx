import type { AnomalyItem } from '@/types/ai'
import SeverityBadge from './SeverityBadge'
import { formatCurrency, formatISODate, cn } from '@/lib/utils'
import { AlertTriangle, Calendar, DollarSign, Gauge } from 'lucide-react'

interface AnomalyCardProps {
  anomaly: AnomalyItem
  index?: number
}

const SEVERITY_BORDER: Record<string, string> = {
  low: 'border-l-emerald-500/40',
  medium: 'border-l-amber-500/40',
  high: 'border-l-orange-500/40',
  critical: 'border-l-red-500/40',
}

function AnomalyCard({ anomaly, index = 0 }: AnomalyCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm transition-all duration-300',
        'hover:shadow-lg hover:-translate-y-0.5 hover:border-gray-200/80 dark:hover:border-gray-600/80',
        'border-l-4',
        SEVERITY_BORDER[anomaly.severity] || 'border-l-gray-400/40',
      )}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-400 to-orange-500 shadow-lg shadow-red-500/20">
            <AlertTriangle className="h-4.5 w-4.5 text-white" />
          </div>
          <div className="min-w-0">
            <span className="text-sm font-semibold text-gray-900 dark:text-white truncate block max-w-[200px]">
              {anomaly.description || 'Transaccion'}
            </span>
            <SeverityBadge severity={anomaly.severity} />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-500 dark:text-gray-400 mb-3">
        {anomaly.amount != null && (
          <div className="flex items-center gap-1.5 rounded-lg bg-gray-50/80 dark:bg-gray-800/50 px-2.5 py-1">
            <DollarSign className="h-3 w-3 text-red-400" />
            <span className="font-semibold text-gray-700 dark:text-gray-300">{formatCurrency(anomaly.amount)}</span>
          </div>
        )}
        {anomaly.effective_date && (
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3 text-gray-400" />
            {formatISODate(anomaly.effective_date)}
          </div>
        )}
        {anomaly.anomaly_score != null && (
          <div className="flex items-center gap-1.5">
            <Gauge className="h-3 w-3 text-orange-400" />
            <span>Score: {anomaly.anomaly_score.toFixed(2)}</span>
          </div>
        )}
      </div>

      {anomaly.anomaly_score != null && (
        <div className="mb-3 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              anomaly.anomaly_score > 0.7 ? 'bg-red-500' : anomaly.anomaly_score > 0.4 ? 'bg-orange-500' : 'bg-amber-500',
            )}
            style={{ width: `${Math.min(anomaly.anomaly_score * 100, 100)}%` }}
          />
        </div>
      )}

      <div className="rounded-lg bg-red-50/50 dark:bg-red-500/5 px-3 py-2 border border-red-100/50 dark:border-red-800/30">
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{anomaly.reason}</p>
      </div>
    </div>
  )
}

export default AnomalyCard
