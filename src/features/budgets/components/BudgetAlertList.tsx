import { useState, useMemo } from 'react'
import { Filter, RotateCcw, CheckCheck, Bell, Inbox } from 'lucide-react'
import BudgetAlertCard from './BudgetAlertCard'
import { ALERT_SEVERITY_CONFIG } from '../constants'
import type { AlertResponse } from '@/types/budgets'

interface BudgetAlertListProps {
  alerts: AlertResponse[] | undefined
  isLoading: boolean
  onMarkRead: (id: string) => void
  onMarkAllRead: () => void
  onDismiss: (id: string) => void
}

export default function BudgetAlertList({
  alerts, isLoading, onMarkRead, onMarkAllRead, onDismiss,
}: BudgetAlertListProps) {
  const [severityFilter, setSeverityFilter] = useState<string>('')
  const [readFilter, setReadFilter] = useState<string>('')

  const filteredAlerts = useMemo(() => {
    if (!alerts) return []
    return alerts.filter((a) => {
      if (severityFilter && a.severity !== severityFilter) return false
      if (readFilter === 'unread' && a.is_read) return false
      if (readFilter === 'read' && !a.is_read) return false
      if (readFilter === 'dismissed' && !a.is_dismissed) return false
      if (readFilter === 'active' && a.is_dismissed) return false
      return true
    })
  }, [alerts, severityFilter, readFilter])

  const unreadCount = alerts?.filter((a) => !a.is_read && !a.is_dismissed).length ?? 0

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-4 animate-pulse">
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-xl bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!alerts || alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
          <Bell className="h-8 w-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
          Sin alertas
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No hay alertas de presupuesto. Sigue asi!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-violet-500 outline-none"
            aria-label="Filtrar por severidad"
          >
            <option value="">Todas las severidades</option>
            {Object.entries(ALERT_SEVERITY_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.label}</option>
            ))}
          </select>
          <select
            value={readFilter}
            onChange={(e) => setReadFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-violet-500 outline-none"
            aria-label="Filtrar por estado"
          >
            <option value="">Todas</option>
            <option value="unread">No leidas</option>
            <option value="read">Leidas</option>
            <option value="active">Activas</option>
            <option value="dismissed">Descartadas</option>
          </select>
          {(severityFilter || readFilter) && (
            <button
              type="button"
              onClick={() => { setSeverityFilter(''); setReadFilter('') }}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Limpiar filtros"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-500/20 transition-colors"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Marcar {unreadCount} como leidas
          </button>
        )}
      </div>

      {filteredAlerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Inbox className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No hay alertas con estos filtros
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAlerts.map((alert) => (
            <BudgetAlertCard
              key={alert.id}
              alert={alert}
              onMarkRead={onMarkRead}
              onDismiss={onDismiss}
            />
          ))}
        </div>
      )}
    </div>
  )
}
