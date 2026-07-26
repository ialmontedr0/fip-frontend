import { useState } from 'react'
import { useDetectAnomalies } from '../hooks/useAI'
import type { AnomalyItem } from '@/types/ai'
import AnomalyCard from './AnomalyCard'
import { Skeleton } from '@/components/ui'
import { ErrorMessage } from '@/components/ui'
import { cn } from '@/lib/utils'
import { AlertTriangle, Loader2, ShieldAlert, CheckCircle2 } from 'lucide-react'

function AnomalyDetectionPanel() {
  const mutation = useDetectAnomalies()
  const [anomalies, setAnomalies] = useState<AnomalyItem[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDetect = () => {
    setError(null)
    mutation.mutate(undefined, {
      onSuccess: (data) => {
        setAnomalies(data.anomalies)
      },
      onError: (err) => {
        setError(err instanceof Error ? err.message : 'Error al detectar anomalias')
      },
    })
  }

  return (
    <div className="rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-400 to-orange-500 shadow-lg">
            <ShieldAlert className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Deteccion</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Deteccion de Anomalias</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDetect}
          disabled={mutation.isPending}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-300',
            'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-md',
            'hover:from-rose-600 hover:to-orange-600 hover:shadow-lg hover:-translate-y-0.5',
            'active:scale-95',
            mutation.isPending && 'opacity-60 cursor-wait',
          )}
        >
          {mutation.isPending ? (
            <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Detectando...</>
          ) : (
            <><AlertTriangle className="h-3.5 w-3.5" /> Detectar anomalias</>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-4">
          <ErrorMessage message={error} onRetry={handleDetect} />
        </div>
      )}

      {mutation.isPending && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-100/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <Skeleton variant="circular" className="h-5 w-16" />
                <Skeleton className="h-4 flex-1" />
              </div>
              <Skeleton className="h-3 w-3/4" />
            </div>
          ))}
        </div>
      )}

      {anomalies && anomalies.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center rounded-lg bg-gradient-to-br from-rose-400 to-orange-500 shadow-sm text-white text-[10px] font-bold px-2 py-0.5 min-w-[24px]">
              {anomalies.length}
            </span>
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500">
              anomalia{anomalies.length !== 1 ? 's' : ''} detectada{anomalies.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="space-y-2">
            {anomalies.map((anomaly, i) => (
              <AnomalyCard key={anomaly.transaction_id} anomaly={anomaly} index={i} />
            ))}
          </div>
        </div>
      )}

      {anomalies && anomalies.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center gap-3 py-8 text-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg">
            <CheckCircle2 className="h-6 w-6 text-white" />
          </div>
          <p className="text-gray-400 dark:text-gray-500 font-medium">No se detectaron anomalias</p>
        </div>
      )}
    </div>
  )
}

export default AnomalyDetectionPanel
