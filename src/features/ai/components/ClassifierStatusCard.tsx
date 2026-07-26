import { useClassifierStatus } from '../hooks/useAI'
import AiStatusDot from './AiStatusDot'
import { Skeleton } from '@/components/ui'
import { ErrorMessage } from '@/components/ui'
import { cn } from '@/lib/utils'
import { Cpu } from 'lucide-react'

function ClassifierStatusCard() {
  const { data, isLoading, isError, refetch } = useClassifierStatus()

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm">
        <Skeleton className="mb-3 h-5 w-36" />
        <Skeleton className="h-4 w-28" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm">
        <ErrorMessage message="No se pudo cargar el estado" onRetry={() => refetch()} />
      </div>
    )
  }

  return (
    <div className={cn(
      'rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5',
    )}>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 shadow-lg">
          <Cpu className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Estado del Clasificador</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">Clasificador de IA</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <AiStatusDot trained={data?.is_trained ?? false} />
        <span className={cn(
          'text-sm font-semibold',
          data?.is_trained
            ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-500'
            : 'text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-500',
        )}>
          {data?.is_trained ? 'Entrenado' : 'No entrenado'}
        </span>
      </div>

      {data?.model_version && (
        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 bg-gray-50/50 dark:bg-gray-800/30 rounded-lg px-3 py-2 border border-gray-100/50 dark:border-gray-700/50">
          <span className="font-medium text-gray-500 dark:text-gray-400">Version</span>
          <span className="font-mono font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-md px-1.5 py-0.5">v{data.model_version}</span>
        </div>
      )}
    </div>
  )
}

export default ClassifierStatusCard
