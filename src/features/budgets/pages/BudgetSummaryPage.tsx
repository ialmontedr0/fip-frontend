import { useMemo } from 'react'
import BudgetNav from '../components/BudgetNav'
import BudgetSummaryCards from '../components/BudgetSummaryCards'
import BudgetCard from '../components/BudgetCard'
import { useBudgetSummary, useBudgets } from '../hooks/useBudgets'
import { STATUS_CONFIG } from '../constants'
import type { BudgetStatus } from '@/types/budgets'

function formatCurrency(value: string | number) {
  const num = typeof value === 'string' ? Number(value) : value
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num)
}

export default function BudgetSummaryPage() {
  const { data: summary, isLoading: summaryLoading } = useBudgetSummary()
  const { data: budgetsData, isLoading: budgetsLoading } = useBudgets({ is_active: true })

  const isOverviewLoading = summaryLoading || budgetsLoading

  const sortedBudgets = useMemo(() => {
    if (!budgetsData?.budgets) return []
    return [...budgetsData.budgets].sort((a, b) => b.pct_used - a.pct_used)
  }, [budgetsData])

  const statusCounts = useMemo(() => {
    if (!budgetsData?.budgets) return { ok: 0, warning: 0, exceeded: 0 }
    return budgetsData.budgets.reduce(
      (acc, b) => {
        const key = b.status as BudgetStatus
        acc[key] = (acc[key] || 0) + 1
        return acc
      },
      { ok: 0, warning: 0, exceeded: 0 } as Record<string, number>,
    )
  }, [budgetsData])

  return (
    <div>
      <BudgetNav />

      <div className="mb-6">
        <BudgetSummaryCards summary={summary} isLoading={summaryLoading} />
      </div>

      {/* Status breakdown */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {Object.entries(statusCounts).map(([status, count]) => {
          const config = STATUS_CONFIG[status as BudgetStatus]
          return (
            <div key={status} className={`${config.bgColor} rounded-xl p-4 text-center`}>
              <p className={`text-2xl font-bold ${config.textColor}`}>{count}</p>
              <p className={`text-xs font-medium ${config.textColor}`}>{config.label}</p>
            </div>
          )
        })}
      </div>

      {/* Budget usage chart */}
      {sortedBudgets.length > 0 && (
        <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 shadow-sm mb-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Uso de presupuestos
          </h3>
          <div className="space-y-3">
            {sortedBudgets.map((b) => {
              const cfg = STATUS_CONFIG[b.status as BudgetStatus] || STATUS_CONFIG.ok
              return (
                <div key={b.id} className="flex items-center gap-3">
                  <div className="w-36 shrink-0">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                      {b.name}
                    </p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500">
                      {formatCurrency(b.spent)} / {formatCurrency(b.amount)}
                    </p>
                  </div>
                  <div className="flex-1">
                    <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${cfg.barColor}`}
                        style={{ width: `${Math.min(b.pct_used, 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className={`w-12 text-right text-xs font-bold ${cfg.textColor}`}>
                    {b.pct_used.toFixed(0)}%
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Budgets list */}
      {isOverviewLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Presupuestos Activos
          </h3>
          {sortedBudgets.length === 0 ? (
            <div className="text-center py-12 text-sm text-gray-500 dark:text-gray-400">
              No hay presupuestos activos
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {sortedBudgets.map((budget) => (
                <BudgetCard key={budget.id} budget={budget} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
