import { useOptimizeSavings } from '../hooks/useAI'
import type { SavingsOptimizeResponse } from '@/types/ai'
import Allocation50_30_20Chart from './Allocation50_30_20Chart'
import GoalAllocationList from './GoalAllocationList'
import DebtStrategyCard from './DebtStrategyCard'
import SeasonalOpportunitiesCard from './SeasonalOpportunitiesCard'
import { Skeleton } from '@/components/ui'
import { ErrorMessage } from '@/components/ui'
import { useState } from 'react'
import { cn, formatCurrency } from '@/lib/utils'
import { PiggyBank, RefreshCw, Sparkles } from 'lucide-react'

function SavingsOptimizerDashboard() {
  const mutation = useOptimizeSavings()
  const [data, setData] = useState<SavingsOptimizeResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleOptimize = () => {
    setError(null)
    mutation.mutate(undefined, {
      onSuccess: (result) => setData(result),
      onError: (err) => setError(err instanceof Error ? err.message : 'Error al optimizar'),
    })
  }

  if (!data && !mutation.isPending && !error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 shadow-xl mb-5">
          <PiggyBank className="h-10 w-10 text-white" />
        </div>
        <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">Optimizador de Ahorros</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">Analiza tus finanzas y recibe recomendaciones personalizadas</p>
        <button
          type="button"
          onClick={handleOptimize}
          className={cn(
            'inline-flex items-center gap-2.5 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300',
            'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg',
            'hover:from-emerald-600 hover:to-green-600 hover:shadow-xl hover:-translate-y-0.5',
            'active:scale-95',
          )}
        >
          <Sparkles className="h-4 w-4" />
          Optimizar ahorros
        </button>
      </div>
    )
  }

  if (mutation.isPending) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={handleOptimize} />
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl px-5 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg">
            <PiggyBank className="h-5 w-5 text-white" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Ahorro total estimado:{' '}
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400">
              {data.estimated_total_savings > 0 ? `$${(data.estimated_total_savings / 1000).toFixed(1)}k` : 'N/A'}
            </span>
          </p>
        </div>
        <button
          type="button"
          onClick={handleOptimize}
          disabled={mutation.isPending}
          className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold border border-gray-200/70 dark:border-gray-700/70 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
        >
          <RefreshCw className={cn('h-3.5 w-3.5', mutation.isPending && 'animate-spin')} />
          Actualizar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Allocation50_30_20Chart allocation={data.allocation_50_30_20} />
        <GoalAllocationList goalAllocation={data.goal_allocation} />
        <DebtStrategyCard debtStrategy={data.debt_strategy} />
        <SeasonalOpportunitiesCard seasonal={data.seasonal_opportunities} />
      </div>

      {data.recommendations.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Recomendaciones</p>
          {data.recommendations.map((rec, i) => (
            <div
              key={i}
              style={{ animationDelay: `${i * 60}ms` }}
              className="flex items-center justify-between rounded-xl border border-gray-100/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md px-4 py-3.5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{rec.title}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">{rec.description}</p>
              </div>
              {rec.estimated_savings > 0 && (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg ml-3 flex-shrink-0">
                  {formatCurrency(rec.estimated_savings)}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SavingsOptimizerDashboard
