import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useAuditLog } from '../hooks/useTransactions'
import {
  History, Globe, ChevronDown, ChevronRight,
} from 'lucide-react'
import { Skeleton } from '@/components/ui'

interface Props {
  transactionId: string
  className?: string
}

function formatRelativeTime(dateStr: string): string {
  const now = Date.now()
  const date = new Date(dateStr).getTime()
  const diff = now - date
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (mins < 1) return 'Ahora'
  if (mins < 60) return `Hace ${mins} min`
  if (hours < 24) return `Hace ${hours}h`
  if (days < 30) return `Hace ${days}d`
  return new Date(dateStr).toLocaleDateString('es-DO', { day: '2-digit', month: 'short', year: 'numeric' })
}

function ActionIcon({ action }: { action: string }) {
  const normalized = action.toLowerCase()
  if (normalized.includes('cread')) return <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
  if (normalized.includes('actualiz') || normalized.includes('edit')) return <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
  if (normalized.includes('elimin')) return <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
  return <div className="h-2.5 w-2.5 rounded-full bg-gray-400" />
}

export default function AuditLogViewer({ transactionId, className }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const { data, isLoading, error } = useAuditLog(isOpen ? transactionId : undefined)

  return (
    <div className={cn('rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 overflow-hidden', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-3 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Historial de Cambios</span>
          {data && (
            <span className="text-xs text-gray-400">({data.total})</span>
          )}
        </div>
        {isOpen ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
      </button>

      {isOpen && (
        <div className="border-t border-gray-200/50 dark:border-gray-700/50 px-4 py-3">
          {isLoading ? (
            <div className="space-y-3 py-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <p className="text-sm text-red-500 py-2">Error al cargar historial</p>
          ) : !data || data.audit_logs.length === 0 ? (
            <p className="text-sm text-gray-400 py-2 text-center">Sin historial de cambios</p>
          ) : (
            <div className="relative">
              <div className="absolute left-3 top-2 bottom-2 w-px bg-gray-200 dark:bg-gray-700" />

              <div className="space-y-0">
                {data.audit_logs.map((log) => (
                  <div key={log.id} className="relative flex gap-4 pb-4 last:pb-0">
                    <div className="relative z-10 flex h-6 w-6 items-center justify-center bg-white dark:bg-gray-800">
                      <ActionIcon action={log.action} />
                    </div>

                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {log.action}
                        </span>
                        <span className="text-xs text-gray-400">{formatRelativeTime(log.created_at || '')}</span>
                      </div>

                      {log.changes && Object.keys(log.changes).length > 0 && (
                        <div className="mt-1 rounded-lg bg-gray-50 dark:bg-gray-700/30 p-2 space-y-0.5">
                          {Object.entries(log.changes).map(([field, value]) => (
                            <p key={field} className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                              <span className="font-medium text-gray-600 dark:text-gray-300">
                                {field}:
                              </span>{' '}
                              {typeof value === 'object' && value !== null
                                ? JSON.stringify(value)
                                : String(value ?? '—')}
                            </p>
                          ))}
                        </div>
                      )}

                      {(log.ip_address || log.user_agent) && (
                        <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-400">
                          {log.ip_address && (
                            <span className="flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              {log.ip_address}
                            </span>
                          )}
                          {log.user_agent && (
                            <span className="truncate max-w-[200px]" title={log.user_agent}>
                              {log.user_agent}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
