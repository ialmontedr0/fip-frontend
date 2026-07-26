import { cn } from '@/lib/utils'
import ConfidenceBadge from './ConfidenceBadge'
import { Tags, Info } from 'lucide-react'

interface ClassificationResultCardProps {
  predicted_category: string | null
  confidence: number
  model_version: string
  reason: string
  className?: string
}

function ClassificationResultCard({ predicted_category, confidence, model_version, reason, className }: ClassificationResultCardProps) {
  return (
    <div className={cn(
      'rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm transition-all duration-300',
      'hover:shadow-lg hover:-translate-y-0.5 hover:border-gray-200/80 dark:hover:border-gray-600/80',
      className,
    )}>
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 shadow-lg shadow-purple-500/20">
          <Tags className="h-4.5 w-4.5 text-white" />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Resultado</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">Clasificacion</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">Categoria</span>
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-500/10 dark:to-indigo-500/10 px-3.5 py-1.5 text-sm font-bold text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-700/30">
            {predicted_category || 'Sin clasificar'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">Confianza</span>
          <ConfidenceBadge value={confidence} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">Modelo</span>
          <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-gray-100/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300">
            {model_version}
          </span>
        </div>
        {reason && (
          <div className="rounded-xl bg-blue-50/50 dark:bg-blue-500/5 border border-blue-200/50 dark:border-blue-800/30 p-3 flex gap-2.5">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-500" />
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{reason}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ClassificationResultCard
