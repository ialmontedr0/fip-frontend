import { useState, useMemo } from 'react'
import BudgetNav from '../components/BudgetNav'
import BudgetAlertList from '../components/BudgetAlertList'
import { useBudgetAlerts, useMarkAlertRead, useDismissAlert } from '../hooks/useBudgetAlerts'

export default function BudgetAlertsPage() {
  const [filters] = useState<{
    is_read?: boolean
    severity?: string
    alert_type?: string
  }>({})

  const { data, isLoading } = useBudgetAlerts(filters)
  const markReadMutation = useMarkAlertRead()
  const dismissMutation = useDismissAlert()

  const alerts = useMemo(() => data?.alerts ?? [], [data])

  const handleMarkAllRead = () => {
    markReadMutation.mutate({ mark_all: true })
  }

  return (
    <div>
      <BudgetNav />

      <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Alertas de presupuesto
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Monitorea cuando tus presupuestos se acercan o exceden sus limites
          </p>
        </div>

        <BudgetAlertList
          alerts={alerts}
          isLoading={isLoading}
          onMarkRead={(alertId) => markReadMutation.mutate({ alert_id: alertId })}
          onMarkAllRead={handleMarkAllRead}
          onDismiss={(alertId) => dismissMutation.mutate(alertId)}
        />
      </div>
    </div>
  )
}
