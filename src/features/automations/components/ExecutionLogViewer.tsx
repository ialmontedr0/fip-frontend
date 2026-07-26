import { useState } from 'react'
import { cn, formatCurrency } from '@/lib/utils'
import { Skeleton, Modal, ErrorMessage, EmptyState } from '@/components/ui'
import { EXECUTION_STATUS_CONFIG } from '../constants'
import { History, FileCode2 } from 'lucide-react'
import type { ExecutionLog } from '@/types/automations'

interface ExecutionLogViewerProps {
  logs: ExecutionLog[]
  isLoading: boolean
  isError: boolean
  onRetry: () => void
  ruleId?: string
  className?: string
}

function formatRelativeTime(dateStr: string | null): string {
  if (!dateStr) return '-'
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Ahora'
  if (minutes < 60) return `hace ${minutes} min`
  if (hours < 24) return `hace ${hours} horas`
  if (days < 7) return `hace ${days} dias`
  return new Date(dateStr).toLocaleDateString('es-DO', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function ExecutionLogViewer({ logs, isLoading, isError, onRetry, ruleId, className }: ExecutionLogViewerProps) {
  const [selectedLog, setSelectedLog] = useState<ExecutionLog | null>(null)

  if (isLoading) {
    return (
      <div className={cn('space-y-3', className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className={cn('rounded-2xl border border-red-100/80 dark:border-red-900/30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl', className)}>
        <ErrorMessage onRetry={onRetry} message="No se pudieron cargar los logs" />
      </div>
    )
  }

  if (logs.length === 0) {
    return (
      <div className={cn('rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl', className)}>
        <EmptyState
          icon={
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700">
              <History className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </div>
          }
          title="Sin logs de ejecucion"
          description="No hay ejecuciones registradas para esta regla"
        />
      </div>
    )
  }

  const filteredLogs = ruleId ? logs.filter((l) => l.rule_id === ruleId) : logs

  return (
    <>
      <div className={cn('space-y-2', className)}>
        {filteredLogs.map((log, index) => {
          const statusConfig = EXECUTION_STATUS_CONFIG[log.status]
          return (
            <button
              key={log.id}
              type="button"
              onClick={() => setSelectedLog(log)}
              className="group w-full text-left rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-purple-200/50 dark:hover:border-purple-500/30 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] animate-fade-in-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-sm', statusConfig.bgColor, statusConfig.color)}>
                    <span className={cn('h-2 w-2 rounded-full animate-pulse shadow-[0_0_6px_currentColor]', statusConfig.dotColor)} style={{ animationDuration: '2s' }} />
                    {statusConfig.label}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {formatRelativeTime(log.executed_at)}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {log.amount_involved != null && (
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      {formatCurrency(log.amount_involved)}
                    </span>
                  )}
                  {log.is_dry_run && (
                    <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm">
                      Simulacion
                    </span>
                  )}
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-400 transition-all duration-300 group-hover:bg-purple-50 dark:group-hover:bg-purple-500/10 group-hover:text-purple-500">
                    <FileCode2 className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <Modal isOpen={!!selectedLog} onClose={() => setSelectedLog(null)} title="Detalle de ejecucion" size="lg">
        {selectedLog && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-gray-50/50 dark:bg-gray-800/50 p-3">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</span>
                <div className="mt-1">
                  <span className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-sm', EXECUTION_STATUS_CONFIG[selectedLog.status].bgColor, EXECUTION_STATUS_CONFIG[selectedLog.status].color)}>
                    <span className={cn('h-2 w-2 rounded-full animate-pulse shadow-[0_0_6px_currentColor]', EXECUTION_STATUS_CONFIG[selectedLog.status].dotColor)} style={{ animationDuration: '2s' }} />
                    {EXECUTION_STATUS_CONFIG[selectedLog.status].label}
                  </span>
                </div>
              </div>
              <div className="rounded-xl bg-gray-50/50 dark:bg-gray-800/50 p-3">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ejecutado</span>
                <p className="mt-1 text-sm font-semibold text-gray-700 dark:text-gray-200">{formatRelativeTime(selectedLog.executed_at)}</p>
              </div>
              {selectedLog.amount_involved != null && (
                <div className="rounded-xl bg-gray-50/50 dark:bg-gray-800/50 p-3">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Monto</span>
                  <p className="mt-1 text-lg font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">{formatCurrency(selectedLog.amount_involved)}</p>
                </div>
              )}
              <div className="rounded-xl bg-gray-50/50 dark:bg-gray-800/50 p-3">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Dry Run</span>
                <p className="mt-1 text-sm font-semibold text-gray-700 dark:text-gray-200">{selectedLog.is_dry_run ? 'Si' : 'No'}</p>
              </div>
            </div>

            {selectedLog.trigger_snapshot && (
              <div className="rounded-xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trigger Snapshot</span>
                </div>
                <pre className="overflow-auto rounded-lg bg-gray-50 dark:bg-gray-800/50 p-3 text-xs leading-relaxed text-gray-700 dark:text-gray-300 font-mono">
                  <code>
                    {JSON.stringify(selectedLog.trigger_snapshot, null, 2)
                      .split('\n')
                      .map((line, i) => (
                        <span key={i} className="block">
                          <span className="text-gray-400 dark:text-gray-600 select-none mr-3">{String(i + 1).padStart(2, ' ')}</span>
                          {line}
                        </span>
                      ))}
                  </code>
                </pre>
              </div>
            )}

            {selectedLog.action_result && (
              <div className="rounded-xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Resultado de la accion</span>
                </div>
                <pre className="overflow-auto rounded-lg bg-gray-50 dark:bg-gray-800/50 p-3 text-xs leading-relaxed text-gray-700 dark:text-gray-300 font-mono">
                  <code>
                    {JSON.stringify(selectedLog.action_result, null, 2)
                      .split('\n')
                      .map((line, i) => (
                        <span key={i} className="block">
                          <span className="text-gray-400 dark:text-gray-600 select-none mr-3">{String(i + 1).padStart(2, ' ')}</span>
                          {line}
                        </span>
                      ))}
                  </code>
                </pre>
              </div>
            )}

            {selectedLog.error_message && (
              <div className="rounded-xl border border-red-100/80 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 backdrop-blur-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-semibold text-red-500 uppercase tracking-wider">Error</span>
                </div>
                <pre className="overflow-auto rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-xs leading-relaxed text-red-700 dark:text-red-400 font-mono">
                  {selectedLog.error_message}
                </pre>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  )
}

export default ExecutionLogViewer
