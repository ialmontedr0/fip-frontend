import { useAnomalyHistory } from '../hooks/useAI'
import type { AnomalyHistoryItem } from '@/types/ai'
import { Skeleton } from '@/components/ui'
import { ErrorMessage } from '@/components/ui'
import ConfidenceBadge from './ConfidenceBadge'
import { History, Clock, AlertTriangle } from 'lucide-react'

function AnomalyHistoryList() {
  const { data, isLoading, isError, refetch } = useAnomalyHistory()

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-4">
            <Skeleton className="mb-2 h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return <ErrorMessage message="No se pudo cargar el historial" onRetry={() => refetch()} />
  }

  const items = data?.anomalies ?? []

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center gap-2 py-6 text-sm text-gray-400">
        <History className="h-4 w-4" />
        Sin historial de anomalias
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {items.map((item: AnomalyHistoryItem) => (
        <div
          key={item.id}
          className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-gray-800/50 px-4 py-3 transition-all hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <AlertTriangle className="h-4 w-4 flex-shrink-0 text-amber-500" />
            <div className="min-w-0">
              <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{item.predicted_value}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{item.reason}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {item.confidence != null && <ConfidenceBadge value={item.confidence} />}
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="h-3 w-3" />
              {new Date(item.created_at).toLocaleDateString('es-DO')}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnomalyHistoryList
