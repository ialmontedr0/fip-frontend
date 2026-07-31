import { useState } from 'react'
import { useTrainPredictor } from '../hooks/useAI'
import { cn } from '@/lib/utils'
import { BrainCircuit, Loader2, CheckCircle2, XCircle, BarChart3, Zap } from 'lucide-react'

function TrainPredictorButton() {
  const mutation = useTrainPredictor()
  const [targetType, setTargetType] = useState<'expense' | 'income'>('expense')
  const [modelType, setModelType] = useState<'xgboost' | 'lightgbm'>('xgboost')
  const [status, setStatus] = useState<'idle' | 'pending' | 'completed' | 'failed'>('idle')
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [metrics, setMetrics] = useState<{ r2: number; mse: number; mae: number; samples: number; months_used: number; duration_seconds: number } | null>(null)

  const handleTrain = () => {
    setStatus('pending')
    setErrorMsg('')
    mutation.mutate({ target_type: targetType, model_type: modelType }, {
      onSuccess: (data) => {
        if (data.success) {
          setStatus('completed')
          setMetrics({ r2: data.r2, mse: data.mse, mae: data.mae, samples: data.samples, months_used: data.months_used, duration_seconds: data.duration_seconds })
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
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 shadow-lg">
          <BarChart3 className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Entrenamiento</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">Predictor</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mr-1">Tipo:</span>
        <button
          type="button"
          onClick={() => { setTargetType('expense'); setStatus('idle') }}
          className={cn(
            'rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-300 shadow-sm',
            targetType === 'expense'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
              : 'border border-gray-200/70 dark:border-gray-700/70 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
          )}
        >
          Gastos
        </button>
        <button
          type="button"
          onClick={() => { setTargetType('income'); setStatus('idle') }}
          className={cn(
            'rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-300 shadow-sm',
            targetType === 'income'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
              : 'border border-gray-200/70 dark:border-gray-700/70 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
          )}
        >
          Ingresos
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-5">
        <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mr-1">Modelo:</span>
        <button
          type="button"
          onClick={() => { setModelType('xgboost'); setStatus('idle') }}
          className={cn(
            'rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-300 shadow-sm inline-flex items-center gap-1.5',
            modelType === 'xgboost'
              ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-md'
              : 'border border-gray-200/70 dark:border-gray-700/70 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
          )}
        >
          <BrainCircuit className="h-3 w-3" />
          XGBoost
        </button>
        <button
          type="button"
          onClick={() => { setModelType('lightgbm'); setStatus('idle') }}
          className={cn(
            'rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-300 shadow-sm inline-flex items-center gap-1.5',
            modelType === 'lightgbm'
              ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-md'
              : 'border border-gray-200/70 dark:border-gray-700/70 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
          )}
        >
          <Zap className="h-3 w-3" />
          LightGBM
        </button>
        <button
          type="button"
          onClick={handleTrain}
          disabled={status === 'pending'}
          className={cn(
            'ml-auto inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-300',
            'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md',
            'hover:from-blue-600 hover:to-cyan-600 hover:shadow-lg hover:-translate-y-0.5',
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
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              Entrenamiento completado ({modelType === 'lightgbm' ? 'LightGBM' : 'XGBoost'} - {targetType === 'expense' ? 'Gastos' : 'Ingresos'})
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { label: 'R²', value: metrics.r2.toFixed(3) },
              { label: 'MSE', value: metrics.mse.toFixed(2) },
              { label: 'MAE', value: metrics.mae.toFixed(2) },
              { label: 'Muestras', value: metrics.samples.toLocaleString() },
              { label: 'Meses', value: metrics.months_used.toString() },
              { label: 'Duracion', value: `${metrics.duration_seconds.toFixed(1)}s` },
            ].map((m) => (
              <div key={m.label} className="rounded-xl border border-gray-100/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md px-3 py-2.5 shadow-sm">
                <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">{m.label}</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{m.value}</p>
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

      {status === 'pending' && (
        <div className="relative h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse" style={{ width: '60%' }} />
        </div>
      )}
    </div>
  )
}

export default TrainPredictorButton