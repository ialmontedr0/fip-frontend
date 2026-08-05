import { useMemo } from 'react'
import { differenceInDays, parseISO } from 'date-fns'
import { TrendingUp, TrendingDown, AlertTriangle, CalendarDays, DollarSign, Clock } from 'lucide-react'
import { formatAmount } from '@/lib/currency'
import type { BudgetResponse } from '@/types/budgets'

interface BurnRateIndicatorProps {
  budget: BudgetResponse
}

function formatCurrency(value: number) {
  return formatAmount(value)
}

export default function BurnRateIndicator({ budget }: BurnRateIndicatorProps) {
  const analytics = useMemo(() => {
    const today = new Date()
    const startDate = parseISO(budget.start_date)
    const endDate = parseISO(budget.end_date)

    const daysInPeriod = differenceInDays(endDate, startDate) + 1
    const daysElapsed = Math.max(differenceInDays(today, startDate) + 1, 1)
    const daysRemaining = Math.max(differenceInDays(endDate, today), 0)

    const budgetAmount = Number(budget.amount)
    const spent = Number(budget.spent)

    const dailyBudget = budgetAmount / daysInPeriod
    const dailyBurnRate = spent / daysElapsed
    const projectedTotal = dailyBurnRate * daysInPeriod
    const projectedOverspend = projectedTotal - budgetAmount
    const daysUntilOverspend = dailyBurnRate > 0
      ? Math.floor((budgetAmount - spent) / dailyBurnRate)
      : daysInPeriod

    const periodProgress = (daysElapsed / daysInPeriod) * 100

    return {
      daysInPeriod,
      daysElapsed,
      daysRemaining,
      dailyBudget,
      dailyBurnRate,
      projectedTotal,
      projectedOverspend,
      daysUntilOverspend,
      periodProgress,
      isOverBudget: spent > budgetAmount,
      isOnTrack: projectedTotal <= budgetAmount,
    }
  }, [budget])

  const budgetAmountNum = Number(budget.amount)
  const statusColor = analytics.isOnTrack
    ? 'text-emerald-600 dark:text-emerald-400'
    : analytics.projectedOverspend < budgetAmountNum * 0.2
      ? 'text-amber-600 dark:text-amber-400'
      : 'text-red-600 dark:text-red-400'

  const statusBgColor = analytics.isOnTrack
    ? 'bg-emerald-50 dark:bg-emerald-500/10'
    : analytics.projectedOverspend < budgetAmountNum * 0.2
      ? 'bg-amber-50 dark:bg-amber-500/10'
      : 'bg-red-50 dark:bg-red-500/10'

  return (
    <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Burn Rate Analysis
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10">
            <CalendarDays className="h-4 w-4 text-blue-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Progreso del periodo</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Dia {analytics.daysElapsed} de {analytics.daysInPeriod}
            </p>
            <div className="mt-1 h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(analytics.periodProgress, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-500/10">
            <DollarSign className="h-4 w-4 text-violet-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Presupuesto diario</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {formatCurrency(analytics.dailyBudget)}
            </p>
            <p className="text-xs" style={{ color: analytics.dailyBurnRate > analytics.dailyBudget ? '#ef4444' : '#6b7280' }}>
              Gastando {formatCurrency(analytics.dailyBurnRate)}/dia
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-500/10">
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Dias restantes</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {analytics.daysRemaining} dias
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {analytics.daysUntilOverspend > 0 && analytics.daysUntilOverspend < analytics.daysRemaining
                ? `Superara el limite en ${analytics.daysUntilOverspend} dias`
                : analytics.isOverBudget ? 'Ya supero el limite' : 'Dentro del presupuesto'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${statusBgColor}`}>
            {analytics.isOnTrack
              ? <TrendingDown className={`h-4 w-4 ${statusColor}`} />
              : analytics.projectedOverspend < budgetAmountNum * 0.2
                ? <AlertTriangle className={`h-4 w-4 ${statusColor}`} />
                : <TrendingUp className={`h-4 w-4 ${statusColor}`} />
            }
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Proyeccion</p>
            <p className={`text-sm font-semibold ${statusColor}`}>
              {formatCurrency(analytics.projectedTotal)}
            </p>
            <p className={`text-xs ${statusColor}`}>
              {analytics.isOnTrack
                ? `${formatCurrency(Math.abs(analytics.projectedOverspend))} disponible`
                : `${formatCurrency(analytics.projectedOverspend)} sobre el limite`}
            </p>
          </div>
        </div>
      </div>

      <div className={`p-3 rounded-xl ${statusBgColor} border ${analytics.isOnTrack ? 'border-emerald-200 dark:border-emerald-500/20' : 'border-amber-200 dark:border-amber-500/20'}`}>
        <div className="flex items-center gap-2">
          {analytics.isOnTrack ? (
            <TrendingDown className={`h-4 w-4 ${statusColor}`} />
          ) : (
            <AlertTriangle className={`h-4 w-4 ${statusColor}`} />
          )}
          <p className={`text-xs font-medium ${statusColor}`}>
            {analytics.isOnTrack
              ? `Buen ritmo! Proyectas terminar el periodo con ${formatCurrency(Math.abs(analytics.projectedOverspend))} disponibles.`
              : `Alerta! Proyectas exceder el presupuesto por ${formatCurrency(analytics.projectedOverspend)}.`
            }
          </p>
        </div>
      </div>
    </div>
  )
}
