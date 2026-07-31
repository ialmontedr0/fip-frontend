import { cn } from '@/lib/utils'
import ConfidenceBadge from './ConfidenceBadge'
import { formatCurrency } from '@/lib/utils'
import { TrendingUp, Loader2, Brain } from 'lucide-react'

interface PredictCardProps {
  title: string
  icon: React.ReactNode
  gradient: string
  result?: {
    predicted_amount: number
    confidence: number
    model_version: string
    reason: string
  } | null
  onPredict: () => void
  isPending: boolean
  error?: string | null
  className?: string
}

function PredictCard({ title, icon, gradient, result, onPredict, isPending, error, className }: PredictCardProps) {
  return (
    <div className={cn(
      'rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm transition-all duration-300',
      'hover:shadow-lg hover:-translate-y-0.5 hover:border-gray-200/80 dark:hover:border-gray-600/80',
      className,
    )}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className={cn('flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg shrink-0', gradient)}>
            {icon}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Prediccion</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{title}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onPredict}
          disabled={isPending}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 self-start sm:self-auto',
            'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25',
            'hover:from-blue-600 hover:to-cyan-600 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5',
            isPending && 'opacity-60 cursor-wait',
          )}
        >
          {isPending ? (
            <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Prediciendo...</>
          ) : (
            <><Brain className="h-3.5 w-3.5" /> Predecir</>
          )}
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50/80 dark:bg-red-500/10 border border-red-200/50 dark:border-red-800/30 backdrop-blur-sm p-3 mb-3">
          <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-3 animate-fade-in">
          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 p-5 text-center border border-blue-200/50 dark:border-blue-700/30">
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Monto Estimado</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              {formatCurrency(result.predicted_amount)}
            </p>
          </div>

          <div className="flex items-center justify-between px-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">Confianza</span>
            <ConfidenceBadge value={result.confidence} />
          </div>

          {result.model_version && (
            <div className="flex items-center justify-between px-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">Modelo</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-gray-100/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300">
                {result.model_version}
              </span>
            </div>
          )}

          {result.reason && (
            <div className="rounded-xl bg-gray-50/80 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/30 p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{result.reason}</p>
            </div>
          )}
        </div>
      )}

      {!result && !error && (
        <div className="flex items-center justify-center py-8 text-sm text-gray-400">
          <TrendingUp className="h-4 w-4 mr-2 text-blue-400" />
          Haz clic en "Predecir" para obtener un estimado
        </div>
      )}
    </div>
  )
}

export default PredictCard
