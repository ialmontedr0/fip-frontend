import { useState } from 'react'
import { useClassifyBatch } from '../hooks/useAI'
import type { BatchClassifyResult } from '@/types/ai'
import { Skeleton } from '@/components/ui'
import { ErrorMessage } from '@/components/ui'
import ConfidenceBadge from './ConfidenceBadge'
import { cn } from '@/lib/utils'
import { Layers, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

function BatchClassificationPanel() {
  const mutation = useClassifyBatch()
  const [results, setResults] = useState<BatchClassifyResult[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleClassify = async () => {
    setError(null)
    mutation.mutate(undefined, {
      onSuccess: (data) => {
        setResults(data.results)
      },
      onError: (err) => {
        setError(err instanceof Error ? err.message : 'Error al clasificar')
      },
    })
  }

  return (
    <div className="rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 shadow-lg">
            <Layers className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Clasificacion por Lote</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Clasificar todas las transacciones</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleClassify}
          disabled={mutation.isPending}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-300',
            'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md',
            'hover:from-purple-600 hover:to-indigo-600 hover:shadow-lg hover:-translate-y-0.5',
            'active:scale-95',
            mutation.isPending && 'opacity-60 cursor-wait',
          )}
        >
          {mutation.isPending ? (
            <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Clasificando...</>
          ) : (
            <><Layers className="h-3.5 w-3.5" /> Clasificar todo</>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-4">
          <ErrorMessage message={error} onRetry={handleClassify} />
        </div>
      )}

      {mutation.isPending && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-gray-100/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md p-3.5 shadow-sm">
              <Skeleton variant="circular" className="h-4 w-4" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      )}

      {results && results.length > 0 && (
        <div className="space-y-2">
          {results.map((r, i) => (
            <div
              key={r.transaction_id}
              style={{ animationDelay: `${i * 50}ms` }}
              className={cn(
                'flex items-center justify-between rounded-xl border border-gray-100/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md px-4 py-3 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5',
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-green-500 shadow-sm flex-shrink-0">
                  <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 truncate font-medium">{r.description}</span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                <span className="text-xs font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg">{r.predicted_category}</span>
                <ConfidenceBadge value={r.confidence} />
              </div>
            </div>
          ))}
        </div>
      )}

      {results && results.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center gap-3 py-8 text-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 shadow-lg">
            <AlertCircle className="h-6 w-6 text-white" />
          </div>
          <p className="text-gray-400 dark:text-gray-500 font-medium">No se encontraron transacciones sin clasificar</p>
        </div>
      )}
    </div>
  )
}

export default BatchClassificationPanel
