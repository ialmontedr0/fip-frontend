import type { RecommendationItem, AnomalyItem } from '@/types/ai'
import ConfidenceBadge from './ConfidenceBadge'
import SeverityBadge from './SeverityBadge'
import PriorityBadge from './PriorityBadge'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Lightbulb, AlertTriangle, Sparkles } from 'lucide-react'

interface RecentInsightsFeedProps {
  recommendations?: RecommendationItem[]
  anomalies?: AnomalyItem[]
  className?: string
}

function RecentInsightsFeed({ recommendations, anomalies, className }: RecentInsightsFeedProps) {
  const hasData = (recommendations && recommendations.length > 0) || (anomalies && anomalies.length > 0)

  if (!hasData) {
    return (
      <div className={cn('rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm', className)}>
        <div className="flex flex-col items-center justify-center py-8 text-sm text-gray-400">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 shadow-lg mb-3">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          Sin informacion reciente
        </div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-purple-400 to-indigo-500 shadow-sm">
          <Sparkles className="h-3 w-3 text-white" />
        </div>
        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Informacion Reciente</span>
      </div>

      {recommendations?.slice(0, 3).map((rec, i) => (
        <div
          key={`rec-${i}`}
          style={{ animationDelay: `${i * 80}ms` }}
          className="flex items-center justify-between rounded-xl border border-gray-100/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md px-4 py-3.5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 shadow-sm flex-shrink-0">
              <Lightbulb className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{rec.title}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">{rec.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-3">
            {rec.estimated_savings > 0 && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg">{formatCurrency(rec.estimated_savings)}</span>
            )}
            <PriorityBadge priority={rec.priority} />
            <ConfidenceBadge value={rec.confidence} />
          </div>
        </div>
      ))}

      {anomalies?.slice(0, 3).map((anomaly, i) => (
        <div
          key={`anom-${i}`}
          style={{ animationDelay: `${i * 80}ms` }}
          className="flex items-center justify-between rounded-xl border border-gray-100/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md px-4 py-3.5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-400 to-orange-500 shadow-sm flex-shrink-0">
              <AlertTriangle className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{anomaly.description || 'Anomalia'}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">{anomaly.reason}</p>
            </div>
          </div>
          <SeverityBadge severity={anomaly.severity} />
        </div>
      ))}
    </div>
  )
}

export default RecentInsightsFeed
