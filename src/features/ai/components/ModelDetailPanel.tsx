import { useModelDetail, usePromoteModel } from '../hooks/useAI'
import TrainingStatusBadge from './TrainingStatusBadge'
import { Skeleton } from '@/components/ui'
import { ErrorMessage } from '@/components/ui'
import { cn } from '@/lib/utils'
import { Cpu, ArrowUpCircle, CheckCircle2, XCircle, FileJson } from 'lucide-react'
import toast from 'react-hot-toast'

interface ModelDetailPanelProps {
  modelId: string
  className?: string
}

function ModelDetailPanel({ modelId, className }: ModelDetailPanelProps) {
  const { data, isLoading, isError } = useModelDetail(modelId)
  const promoteMutation = usePromoteModel()

  const handlePromote = () => {
    promoteMutation.mutate(modelId, {
      onSuccess: (result) => {
        toast.success(result.message || 'Modelo promovido a produccion')
      },
      onError: () => {
        toast.error('Error al promover el modelo')
      },
    })
  }

  if (isLoading) {
    return (
      <div className={cn('rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm', className)}>
        <Skeleton className="mb-5 h-6 w-48" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return <ErrorMessage message="No se pudo cargar el detalle del modelo" />
  }

  if (!data) return null

  const metrics = [
    { label: 'Accuracy', value: data.accuracy != null ? `${(data.accuracy * 100).toFixed(1)}%` : 'N/A' },
    { label: 'Precision', value: data.precision_score != null ? `${(data.precision_score * 100).toFixed(1)}%` : 'N/A' },
    { label: 'Recall', value: data.recall_score != null ? `${(data.recall_score * 100).toFixed(1)}%` : 'N/A' },
    { label: 'F1 Score', value: data.f1_score != null ? `${(data.f1_score * 100).toFixed(1)}%` : 'N/A' },
    { label: 'MSE', value: data.mse?.toFixed(4) ?? 'N/A' },
    { label: 'MAE', value: data.mae?.toFixed(4) ?? 'N/A' },
  ]

  return (
    <div className={cn(
      'rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm transition-all duration-300 hover:shadow-lg',
      className,
    )}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 shadow-lg">
            <Cpu className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{data.model_type}</p>
            <p className="text-xs font-mono text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50 rounded-md px-1.5 py-0.5 inline-block mt-0.5">v{data.version}</p>
          </div>
        </div>
        <TrainingStatusBadge status={data.status} />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-xl border border-gray-100/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md px-3 py-2.5 shadow-sm">
            <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">{m.label}</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-5">
        {data.is_production ? (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg px-3 py-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            En produccion
          </span>
        ) : (
          <button
            type="button"
            onClick={handlePromote}
            disabled={promoteMutation.isPending}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-300',
              'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-md',
              'hover:from-emerald-600 hover:to-green-600 hover:shadow-lg hover:-translate-y-0.5',
              'active:scale-95',
              promoteMutation.isPending && 'opacity-60 cursor-wait',
            )}
          >
            <ArrowUpCircle className="h-3.5 w-3.5" />
            {promoteMutation.isPending ? 'Promoviendo...' : 'Promover a produccion'}
          </button>
        )}
      </div>

      {data.hyperparameters && (
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2.5">
            <FileJson className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hiperparametros</span>
          </div>
          <pre className="text-xs text-gray-600 dark:text-gray-300 rounded-xl border border-gray-100/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md p-4 overflow-x-auto shadow-sm font-mono">
            {JSON.stringify(data.hyperparameters, null, 2)}
          </pre>
        </div>
      )}

      {data.feature_names && (
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2.5">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Features</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(data.feature_names).map(([key]) => (
              <span key={key} className="rounded-xl border border-gray-100/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md px-2.5 py-1 text-[10px] font-mono font-medium text-gray-600 dark:text-gray-400 shadow-sm">
                {key}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.error_message && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-500/10 dark:to-rose-500/10 border border-red-200/50 dark:border-red-700/50">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-red-400 to-rose-500 shadow-sm flex-shrink-0">
            <XCircle className="h-4 w-4 text-white" />
          </div>
          <span className="text-xs font-medium text-red-600 dark:text-red-400">{data.error_message}</span>
        </div>
      )}
    </div>
  )
}

export default ModelDetailPanel
