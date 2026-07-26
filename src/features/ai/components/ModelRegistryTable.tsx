import { useState } from 'react'
import { useListModels } from '../hooks/useAI'
import type { ModelItem } from '@/types/ai'
import TrainingStatusBadge from './TrainingStatusBadge'
import { Skeleton } from '@/components/ui'
import { ErrorMessage } from '@/components/ui'
import { cn } from '@/lib/utils'
import { Cpu, ChevronRight, Search } from 'lucide-react'

interface ModelRegistryTableProps {
  onSelect?: (model: ModelItem) => void
  selectedId?: string | null
}

function ModelRegistryTable({ onSelect, selectedId }: ModelRegistryTableProps) {
  const [filterType, setFilterType] = useState<string>('')
  const { data, isLoading, isError, refetch } = useListModels(filterType || undefined)

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm">
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton variant="circular" className="h-3 w-3" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return <ErrorMessage message="No se pudieron cargar los modelos" onRetry={() => refetch()} />
  }

  const models = data?.models ?? []

  const modelTypes = [...new Set(models.map((m) => m.model_type))]

  return (
    <div className="rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 shadow-lg">
            <Cpu className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Registro</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Modelos de IA</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {modelTypes.length > 0 && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="rounded-xl border border-gray-200/70 dark:border-gray-700/70 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md pl-8 pr-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 appearance-none cursor-pointer shadow-sm"
              >
                <option value="">Todos los tipos</option>
                {modelTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {models.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-sm text-gray-400">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 shadow-lg mb-3">
            <Cpu className="h-6 w-6 text-gray-400 dark:text-gray-500" />
          </div>
          <p className="font-medium text-gray-500 dark:text-gray-400">Sin modelos registrados</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Entrena un clasificador o predictor para crear el primer modelo</p>
        </div>
      ) : (
        <div className="space-y-2">
          {models.map((model, i) => (
            <button
              key={model.id}
              type="button"
              onClick={() => onSelect?.(model)}
              style={{ animationDelay: `${i * 50}ms` }}
              className={cn(
                'w-full flex items-center justify-between rounded-xl px-4 py-3.5 text-left transition-all duration-300',
                selectedId === model.id
                  ? 'border border-purple-200/80 dark:border-purple-700/80 bg-purple-50/80 dark:bg-purple-500/10 backdrop-blur-md shadow-sm ring-1 ring-purple-300/50 dark:ring-purple-600/50'
                  : 'border border-gray-100/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-sm hover:shadow-md hover:-translate-y-0.5',
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={cn(
                  'h-2.5 w-2.5 rounded-full shadow-sm',
                  model.status === 'completed' ? 'bg-green-500' : model.status === 'failed' ? 'bg-red-500' : 'bg-amber-500',
                )} />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{model.model_type}</span>
                <span className="text-xs font-mono text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50 rounded-md px-1.5 py-0.5">v{model.version}</span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                <TrainingStatusBadge status={model.status} />
                {model.accuracy != null && (
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg px-2 py-1">
                    {(model.accuracy * 100).toFixed(1)}%
                  </span>
                )}
                {model.is_production && (
                  <span className="text-[10px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 uppercase bg-emerald-50 dark:bg-emerald-500/10 rounded-lg px-2 py-1">Produccion</span>
                )}
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ModelRegistryTable
