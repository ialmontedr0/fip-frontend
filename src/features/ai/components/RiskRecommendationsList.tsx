import type { RiskRecommendation } from '@/types/ai'
import PriorityBadge from './PriorityBadge'
import ConfidenceBadge from './ConfidenceBadge'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Lightbulb, PiggyBank } from 'lucide-react'

interface RiskRecommendationsListProps {
  recommendations: RiskRecommendation[] | undefined
  className?: string
}

function RiskRecommendationsList({ recommendations, className }: RiskRecommendationsListProps) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className={cn('flex items-center justify-center py-8 text-sm text-gray-400', className)}>
        <Lightbulb className="h-4 w-4 mr-2" />
        Sin recomendaciones de riesgo
      </div>
    )
  }

  return (
    <div className={cn('space-y-2.5', className)}>
      {recommendations.map((rec, i) => (
        <div
          key={i}
          className={cn(
            'rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-4 shadow-sm transition-all duration-300',
            'hover:shadow-lg hover:-translate-y-0.5 hover:border-gray-200/80 dark:hover:border-gray-600/80',
          )}
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/20 flex-shrink-0 mt-0.5">
              <Lightbulb className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{rec.title}</p>
                <PriorityBadge priority={rec.priority} />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-2">{rec.description}</p>
              <div className="flex items-center gap-3">
                {rec.estimated_savings > 0 && (
                  <div className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-500/10 dark:to-green-500/10 px-2.5 py-1 border border-emerald-200/50 dark:border-emerald-700/30">
                    <PiggyBank className="h-3 w-3 text-emerald-500" />
                    <span className="text-[11px] font-bold bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent">
                      {formatCurrency(rec.estimated_savings)}
                    </span>
                  </div>
                )}
                <ConfidenceBadge value={rec.confidence} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default RiskRecommendationsList
