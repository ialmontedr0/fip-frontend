import { useState } from 'react'
import type { RecommendationItem, ExplanationResponse } from '@/types/ai'
import RecommendationCard from './RecommendationCard'
import RecommendationSkeleton from './RecommendationSkeleton'
import ExplanationCard from './ExplanationCard'
import { useExplanation } from '../hooks/useAI'
import { ErrorMessage } from '@/components/ui'
import { cn } from '@/lib/utils'
import { Filter, Lightbulb, PiggyBank, TrendingUp } from 'lucide-react'

interface RecommendationsFeedProps {
  recommendations: RecommendationItem[] | undefined
  isLoading: boolean
  isError: boolean
  onRetry?: () => void
  estimatedTotalSavings?: number
}

type FilterKey = 'all' | 'high' | 'medium' | 'low'

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: 'high', label: 'Alta' },
  { key: 'medium', label: 'Media' },
  { key: 'low', label: 'Baja' },
]

function RecommendationsFeed({ recommendations, isLoading, isError, onRetry, estimatedTotalSavings }: RecommendationsFeedProps) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const explainMutation = useExplanation()
  const [explanations, setExplanations] = useState<Record<string, ExplanationResponse>>({})

  const filtered = recommendations?.filter((r) => {
    if (activeFilter === 'all') return true
    return r.priority === activeFilter
  }) ?? []

  const handleExplain = async (rec: RecommendationItem, index: number) => {
    const key = `${index}-${rec.title}`
    if (explanations[key]) {
      setExpandedId(expandedId === key ? null : key)
      return
    }
    explainMutation.mutate(
      { rec_type: rec.type, title: rec.title, description: rec.description, priority: rec.priority, estimated_savings: rec.estimated_savings, confidence: rec.confidence },
      {
        onSuccess: (data) => {
          setExplanations((prev) => ({ ...prev, [key]: data }))
          setExpandedId(key)
        },
      },
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <RecommendationSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (isError) {
    return <ErrorMessage message="No se pudieron cargar las recomendaciones" onRetry={onRetry} />
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg mb-4">
          <Lightbulb className="h-7 w-7 text-white" />
        </div>
        <p className="text-sm font-medium text-gray-400">Sin recomendaciones disponibles</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-4 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs text-purple-600 dark:text-purple-400 mb-1.5">
            <Lightbulb className="h-3.5 w-3.5" />
            Total
          </div>
          <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">{recommendations.length}</p>
        </div>
        <div className="rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-4 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 mb-1.5">
            <TrendingUp className="h-3.5 w-3.5" />
            Alta prioridad
          </div>
          <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400">
            {recommendations.filter((r) => r.priority === 'high').length}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-4 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 mb-1.5">
            <PiggyBank className="h-3.5 w-3.5" />
            Ahorro total
          </div>
          <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400">
            {estimatedTotalSavings != null ? `$${(estimatedTotalSavings / 1000).toFixed(1)}k` : 'N/A'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <Filter className="h-3.5 w-3.5 text-gray-400 ml-1 flex-shrink-0" />
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setActiveFilter(f.key)}
            className={cn(
              'rounded-xl px-4 py-1.5 text-xs font-semibold transition-all duration-300',
              activeFilter === f.key
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md'
                : 'border border-gray-200/70 dark:border-gray-700/70 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((rec, i) => (
          <div key={`${i}-${rec.title}`}>
            <RecommendationCard
              rec={rec}
              index={i}
              onExplain={() => handleExplain(rec, i)}
              isExpanded={expandedId === `${i}-${rec.title}`}
            />
            {expandedId === `${i}-${rec.title}` && explanations[`${i}-${rec.title}`] && (
              <div className="mt-3">
                <ExplanationCard explanation={explanations[`${i}-${rec.title}`]} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecommendationsFeed
