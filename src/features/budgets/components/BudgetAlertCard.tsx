import { MoreHorizontal, Eye, EyeOff, XCircle } from 'lucide-react'
import { useState } from 'react'
import { ALERT_SEVERITY_CONFIG, ALERT_TYPE_LABELS } from '../constants'
import { formatAmount } from '@/lib/currency'
import type { AlertResponse, AlertSeverity } from '@/types/budgets'

interface BudgetAlertCardProps {
  alert: AlertResponse
  onMarkRead: (id: string) => void
  onDismiss: (id: string) => void
}

function formatCurrency(value: string | null | undefined) {
  if (!value) return ''
  return formatAmount(Number(value))
}

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return ''
  return new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(dateStr))
}

export default function BudgetAlertCard({ alert, onMarkRead, onDismiss }: BudgetAlertCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const config = ALERT_SEVERITY_CONFIG[alert.severity as AlertSeverity] || ALERT_SEVERITY_CONFIG.info
  const SeverityIcon = config.icon
  const typeLabel = ALERT_TYPE_LABELS[alert.alert_type] || alert.alert_type

  return (
    <div
      className={`relative bg-white dark:bg-gray-800/80 rounded-2xl border shadow-sm transition-all duration-200 hover:shadow-md ${
        alert.is_dismissed ? 'opacity-50' : ''
      } ${alert.is_read ? config.borderColor : 'border-l-4'} ${!alert.is_read ? 'border-l-violet-500 dark:border-l-violet-400' : ''}`}
      style={!alert.is_read && !alert.is_dismissed ? undefined : undefined}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${config.bgColor}`}>
            <SeverityIcon className={`h-5 w-5 ${config.color}`} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {alert.title}
                  </h4>
                  {!alert.is_read && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold text-white bg-violet-500 rounded-full">
                      NUEVA
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{typeLabel}</p>
              </div>

              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label="Opciones de alerta"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 z-20 w-40 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl py-1">
                      {!alert.is_read && (
                        <button
                          type="button"
                          onClick={() => { setMenuOpen(false); onMarkRead(alert.id) }}
                          className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                          Marcar leida
                        </button>
                      )}
                      {!alert.is_dismissed && (
                        <button
                          type="button"
                          onClick={() => { setMenuOpen(false); onDismiss(alert.id) }}
                          className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <XCircle className="h-4 w-4" />
                          Descartar
                        </button>
                      )}
                      {alert.is_read && (
                        <button
                          type="button"
                          onClick={() => { setMenuOpen(false); onDismiss(alert.id) }}
                          className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <EyeOff className="h-4 w-4" />
                          Ocultar
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1.5">
              {alert.message}
            </p>

            {(alert.current_amount || alert.budget_amount) && (
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                {alert.budget_amount && (
                  <span>
                    Presupuesto:
                    {' '}
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {formatCurrency(alert.budget_amount)}
                    </span>
                  </span>
                )}
                {alert.current_amount && (
                  <span>
                    Actual:
                    {' '}
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {formatCurrency(alert.current_amount)}
                    </span>
                  </span>
                )}
                {alert.threshold_percentage && (
                  <span className={`font-semibold ${Number(alert.current_amount) > Number(alert.budget_amount) ? 'text-red-500' : 'text-amber-500'}`}>
                    {alert.threshold_percentage}%
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${config.color} ${config.bgColor}`}>
              {config.label}
            </span>
          </div>
          <span className="text-[11px] text-gray-400 dark:text-gray-500">
            {formatDate(alert.triggered_at)}
          </span>
        </div>
      </div>
    </div>
  )
}
