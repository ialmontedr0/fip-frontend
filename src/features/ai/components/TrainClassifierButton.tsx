import { useState } from 'react'
import { useTrainClassifier } from '../hooks/useAI'
import { cn } from '@/lib/utils'
import { BrainCircuit, Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react'

function TrainClassifierButton() {
  const mutation = useTrainClassifier()
  const [status, setStatus] = useState<'idle' | 'pending' | 'completed' | 'failed'>('idle')
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [metrics, setMetrics] = useState<{ accuracy: number; samples: number; categories: number; duration_seconds: number } | null>(null)

  const handleTrain = () => {
    setStatus('pending')
    setErrorMsg('')
    mutation.mutate(undefined, {
      onSuccess: (data) => {
        if (data.success) {
          setStatus('completed')
          setMetrics({ accuracy: data.accuracy, samples: data.samples, categories: data.categories, duration_seconds: data.duration_seconds })
        } else {
          setStatus('failed')
          setErrorMsg(data.error || 'Error en el entrenamiento')
        }
      },
      onError: (err) => {
        setStatus('failed')
        setErrorMsg(err instanceof Error ? err.message : 'Error en el entrenamiento')
      },
    })
  }

  return (
    <div className="rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 shadow-lg">
            <BrainCircuit className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Entrenamiento</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Clasificador</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleTrain}
          disabled={status === 'pending'}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-300',
            'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md',
            'hover:from-purple-600 hover:to-indigo-600 hover:shadow-lg hover:-translate-y-0.5',
            'active:scale-95',
            status === 'pending' && 'opacity-60 cursor-wait',
          )}
        >
          {status === 'pending' ? (
            <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Entrenando...</>
          ) : (
            <><BrainCircuit className="h-3.5 w-3.5" /> Entrenar</>
          )}
        </button>
      </div>

      {status === 'completed' && metrics && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-500/10 dark:to-green-500/10 border border-emerald-200/50 dark:border-emerald-700/50">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-green-500 shadow-sm">
              <CheckCircle2 className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Entrenamiento completado</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Precision', value: `${(metrics.accuracy * 100).toFixed(1)}%` },
              { label: 'Muestras', value: metrics.samples.toLocaleString() },
              { label: 'Categorias', value: metrics.categories.toString() },
              { label: 'Duracion', value: `${metrics.duration_seconds.toFixed(1)}s` },
            ].map((m) => (
              <div key={m.label} className="rounded-xl border border-gray-100/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md px-4 py-3 shadow-sm">
                <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">{m.label}</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{m.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {status === 'failed' && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-500/10 dark:to-rose-500/10 border border-red-200/50 dark:border-red-700/50">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-red-400 to-rose-500 shadow-sm">
              <XCircle className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-red-700 dark:text-red-300">Error en el entrenamiento</span>
          </div>
          {errorMsg && <p className="text-xs text-red-500 dark:text-red-400 ml-9">{errorMsg}</p>}
        </div>
      )}

      {status === 'idle' && (
        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl px-4 py-3 border border-gray-100/50 dark:border-gray-700/50">
          <Clock className="h-3.5 w-3.5" />
          El entrenamiento puede tomar varios segundos
        </div>
      )}

      {status === 'pending' && (
        <div className="relative h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 animate-pulse" style={{ width: '60%' }} />
        </div>
      )}
    </div>
  )
}

export default TrainClassifierButton
