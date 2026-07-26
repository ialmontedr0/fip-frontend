import type { RecommendationItem } from '@/types/ai'
import PriorityBadge from './PriorityBadge'
import ConfidenceBadge from './ConfidenceBadge'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Lightbulb, PiggyBank, Sparkles } from 'lucide-react'

interface RecommendationCardProps {
  rec: RecommendationItem
  index?: number
  onExplain?: () => void
  isExpanded?: boolean
}

function RecommendationCard({ rec, index = 0, onExplain, isExpanded }: RecommendationCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm transition-all duration-300',
        'hover:shadow-lg hover:-translate-y-0.5 hover:border-gray-200/80 dark:hover:border-gray-600/80',
        'relative overflow-hidden group',
        isExpanded && 'ring-2 ring-purple-400/60 dark:ring-purple-500/60',
      )}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 via-transparent to-purple-500/0 group-hover:from-amber-500/[0.02] group-hover:to-purple-500/[0.02] transition-all duration-500 pointer-events-none" />
      <div className="flex items-start justify-between mb-3 relative">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/20">
            <Lightbulb className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{rec.title}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{rec.type}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <PriorityBadge priority={rec.priority} />
          {onExplain && (
            <button
              type="button"
              onClick={onExplain}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-purple-500 transition-all duration-200 group/btn"
            >
              <Sparkles className="h-4 w-4 transition-transform duration-300 group-hover/btn:rotate-45" />
            </button>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed relative">{rec.description}</p>

      <div className="flex items-center gap-3 relative">
        {rec.estimated_savings > 0 && (
          <div className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-500/10 dark:to-green-500/10 px-3 py-1.5 border border-emerald-200/50 dark:border-emerald-700/30">
            <PiggyBank className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-xs font-bold bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent">
              {formatCurrency(rec.estimated_savings)}
            </span>
          </div>
        )}
        <ConfidenceBadge value={rec.confidence} />
      </div>
    </div>
  )
}

export default RecommendationCard
