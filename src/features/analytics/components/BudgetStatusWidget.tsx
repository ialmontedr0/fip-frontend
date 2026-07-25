import { TrendingUp, PiggyBank, AlertTriangle, ChevronRight, ArrowUpRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useBudgetSummary, useBudgets } from '@/features/budgets/hooks/useBudgets'
import { STATUS_CONFIG } from '@/features/budgets/constants'
import type { BudgetStatus, BudgetResponse } from '@/types/budgets'

function formatCurrency(value: string | number) {
  const num = typeof value === 'string' ? Number(value) : value
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num)
}

function SkeletonBar() {
  return (
    <div className="flex items-center gap-3 animate-pulse">
      <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded flex-shrink-0" />
      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full" />
      <div className="h-3 w-10 bg-gray-200 dark:bg-gray-700 rounded flex-shrink-0" />
    </div>
  )
}

function MiniBudgetBar({ budget, onClick }: { budget: BudgetResponse; onClick: (id: string) => void }) {
  const cfg = STATUS_CONFIG[budget.status as BudgetStatus] || STATUS_CONFIG.ok
  return (
    <div className="flex items-center gap-2.5 group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-lg px-2 py-1.5 transition-colors" onClick={() => onClick(budget.id)}>
      <div className="w-28 flex-shrink-0">
        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate leading-tight">
          {budget.name}
        </p>
      </div>
      <div className="flex-1 relative h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out ${cfg.barColor}`}
          style={{ width: `${Math.min(budget.pct_used, 100)}%` }}
        />
      </div>
      <span className={`w-12 text-right text-xs font-bold ${cfg.textColor} flex-shrink-0`}>
        {budget.pct_used.toFixed(0)}%
      </span>
      <ArrowUpRight className="h-3 w-3 text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
    </div>
  )
}

export default function BudgetStatusWidget() {
  const navigate = useNavigate()
  const { data: summary, isLoading: summaryLoading } = useBudgetSummary()
  const { data: budgetsData, isLoading: budgetsLoading } = useBudgets({ is_active: true })

  const isLoading = summaryLoading || budgetsLoading
  const sorted = budgetsData?.budgets ? [...budgetsData.budgets].sort((a, b) => b.pct_used - a.pct_used).slice(0, 5) : []

  const utilizationPct = summary ? Number(summary.utilization_pct) : 0
  const overCount = summary?.over_budget_count ?? 0
  const nearCount = summary?.near_limit_count ?? 0

  return (
    <div className="relative bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
      <div className="absolute top-0 right-0 w-48 h-48 -mr-12 -mt-12 rounded-full bg-violet-500/5 dark:bg-violet-500/10 group-hover:scale-125 transition-transform duration-500" />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
              <PiggyBank className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Presupuestos
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Resumen del periodo actual
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/budgets/summary')}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-500/20 transition-colors"
          >
            Ir
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-3 animate-pulse">
              <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full mb-4" />
            {Array.from({ length: 4 }).map((_, i) => <SkeletonBar key={i} />)}
          </div>
        ) : (
          <>
            {summary && (
              <div className="flex items-end justify-between mb-3">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                    {utilizationPct.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    de utilizacion general
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  {overCount > 0 && (
                    <div className="flex items-center gap-1 text-red-500 bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded-lg">
                      <AlertTriangle className="h-3 w-3" />
                      <span className="font-semibold">{overCount} excedido{overCount !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {nearCount > 0 && (
                    <div className="flex items-center gap-1 text-amber-500 bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded-lg">
                      <TrendingUp className="h-3 w-3" />
                      <span className="font-semibold">{nearCount} cerca{nearCount !== 1 ? 'n' : ''}</span>
                    </div>
                  )}
                  {overCount === 0 && nearCount === 0 && (
                    <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg">
                      <TrendingUp className="h-3 w-3" />
                      <span className="font-semibold">Todo en orden</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {summary && (
              <div className="mb-4">
                <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                      utilizationPct > 100
                        ? 'bg-gradient-to-r from-red-400 to-red-500'
                        : utilizationPct > 80
                          ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                          : 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                    }`}
                    style={{ width: `${Math.min(utilizationPct, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1.5 text-xs">
                  <span className="text-gray-500 dark:text-gray-400">
                    {formatCurrency(summary.total_spent)}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {formatCurrency(summary.total_budget_amount)}
                  </span>
                </div>
              </div>
            )}

            {sorted.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-0.5 w-4 rounded-full bg-gradient-to-r from-violet-400 to-purple-500" />
                  <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Mayor uso
                  </p>
                </div>
                <div className="space-y-0.5">
                  {sorted.map((budget) => (
                    <MiniBudgetBar key={budget.id} budget={budget} onClick={(id) => navigate(`/budgets/${id}`)} />
                  ))}
                </div>
              </div>
            )}

            {!summary && sorted.length === 0 && (
              <div className="flex flex-col items-center py-6 text-center">
                <PiggyBank className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  No tienes presupuestos activos
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/budgets/new')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25 transition-all duration-200"
                >
                  <PiggyBank className="h-3.5 w-3.5" />
                  Crear presupuesto
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
