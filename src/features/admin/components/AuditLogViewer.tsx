import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ScrollText, Loader2, ChevronDown, ChevronUp, AlertCircle, CheckCircle2, Clock } from 'lucide-react'
import { useAuditLogs } from '../hooks/useAdmin'
import AuditLogFilters from './AuditLogFilters'
import type { AuditLogFilters as AuditLogFiltersType, AuditLogResponse } from '@/types/admin'

const STATUS_CONFIG = {
  success: { icon: CheckCircle2, className: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10' },
  failure: { icon: AlertCircle, className: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/10' },
  pending: { icon: Clock, className: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/10' },
} as const

function getStatusConfig(status: string) {
  return STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending
}

function LogRow({ log }: { log: AuditLogResponse }) {
  const [expanded, setExpanded] = useState(false)
  const StatusIcon = getStatusConfig(log.status).icon
  const statusClass = getStatusConfig(log.status).className

  return (
    <>
      <tr
        onClick={() => setExpanded(!expanded)}
        className="border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer"
      >
        <td className="px-4 py-3">
          <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold', statusClass)}>
            <StatusIcon className="h-3 w-3" />
            {log.status}
          </span>
        </td>
        <td className="px-4 py-3">
          <span className="text-xs font-mono font-semibold text-gray-900 dark:text-white">{log.action}</span>
        </td>
        <td className="px-4 py-3">
          <span className="text-xs text-gray-600 dark:text-gray-400">{log.resource}</span>
          {log.resource_id && (
            <span className="text-[10px] text-gray-400 font-mono ml-1">#{log.resource_id.slice(0, 8)}</span>
          )}
        </td>
        <td className="px-4 py-3 text-xs text-gray-400 font-mono">
          {log.user_id ? log.user_id.slice(0, 12) + '...' : '—'}
        </td>
        <td className="px-4 py-3 text-right">
          <div className="flex items-center justify-end gap-2">
            <span className="text-[10px] text-gray-400">
              {new Date(log.created_at).toLocaleString('es-DO', {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
              })}
            </span>
            {expanded ? <ChevronUp className="h-3 w-3 text-gray-400" /> : <ChevronDown className="h-3 w-3 text-gray-400" />}
          </div>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-gray-50/50 dark:bg-gray-800/20">
          <td colSpan={5} className="px-8 py-4">
            <div className="space-y-2">
              {log.ip_address && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-gray-400 uppercase text-[10px]">IP:</span>
                  <span className="font-mono text-gray-600 dark:text-gray-400">{log.ip_address}</span>
                </div>
              )}
              {log.details && Object.keys(log.details).length > 0 && (
                <div>
                  <span className="font-semibold text-gray-400 uppercase text-[10px]">Detalles:</span>
                  <pre className="mt-1 text-xs text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-900/50 rounded-lg p-2 overflow-x-auto">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                </div>
              )}
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-gray-400 uppercase text-[10px]">ID:</span>
                <span className="font-mono text-gray-500">{log.id}</span>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

export default function AuditLogViewer() {
  const [skip, setSkip] = useState(0)
  const [limit] = useState(20)
  const [filters, setFilters] = useState<AuditLogFiltersType>({})

  const { data, isLoading } = useAuditLogs({ ...filters, skip, limit })

  const logs = data?.logs ?? []
  const totalPages = data ? Math.ceil(data.total / limit) : 0
  const currentPage = Math.floor(skip / limit) + 1

  return (
    <div className="space-y-4">
      <AuditLogFilters
        filters={filters}
        onChange={(f) => { setFilters(f); setSkip(0) }}
        onReset={() => { setFilters({}); setSkip(0) }}
      />

      <div className="overflow-x-auto rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
              <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Estado</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Acci&oacute;n</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Recurso</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Usuario</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400 mx-auto" />
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <ScrollText className="h-8 w-8" />
                    <p className="text-sm font-medium">No se encontraron logs</p>
                  </div>
                </td>
              </tr>
            ) : (
              logs.map((log) => <LogRow key={log.id} log={log} />)
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {data?.total ?? 0} log(s) — P&aacute;gina {currentPage} de {totalPages || 1}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSkip(Math.max(0, skip - limit))}
            disabled={skip === 0}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 transition-all"
          >
            Anterior
          </button>
          <button
            onClick={() => setSkip(skip + limit)}
            disabled={skip + limit >= (data?.total ?? 0)}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 transition-all"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  )
}
