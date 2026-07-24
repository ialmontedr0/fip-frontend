import { useState, useMemo } from 'react'
import { cn, formatCurrency } from '@/lib/utils'
import { useTransactionSummary } from '../hooks/useTransactions'
import { PERIOD_OPTIONS } from '../constants'
import {
  TrendingUp, TrendingDown, ArrowLeftRight,
  Calendar, ChevronDown, Wallet,
} from 'lucide-react'
import { Skeleton } from '@/components/ui'

interface Props {
  className?: string
}

type PeriodKey = 'this_month' | 'last_month' | 'this_year' | 'custom'

function getPeriodDates(period: PeriodKey, customFrom?: string, customTo?: string) {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()

  switch (period) {
    case 'this_month':
      return {
        date_from: new Date(year, month, 1).toISOString().slice(0, 10),
        date_to: new Date(year, month + 1, 0).toISOString().slice(0, 10),
      }
    case 'last_month':
      return {
        date_from: new Date(year, month - 1, 1).toISOString().slice(0, 10),
        date_to: new Date(year, month, 0).toISOString().slice(0, 10),
      }
    case 'this_year':
      return {
        date_from: `${year}-01-01`,
        date_to: `${year}-12-31`,
      }
    case 'custom':
      return {
        date_from: customFrom || new Date(year, month, 1).toISOString().slice(0, 10),
        date_to: customTo || new Date().toISOString().slice(0, 10),
      }
  }
}

export default function TransactionSummaryWidget({ className }: Props) {
  const [period, setPeriod] = useState<PeriodKey>('this_month')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const [showPeriodMenu, setShowPeriodMenu] = useState(false)

  const { date_from, date_to } = useMemo(() => getPeriodDates(period, customFrom, customTo), [period, customFrom, customTo])
  const { data, isLoading } = useTransactionSummary(date_from, date_to)

  const stats = useMemo(() => {
    if (!data) return null
    return [
      {
        label: 'Ingresos',
        value: formatCurrency(parseFloat(data.total_income), 'DOP'),
        count: data.total_income_count,
        color: 'text-emerald-600 dark:text-emerald-400',
        bgColor: 'bg-emerald-100 dark:bg-emerald-500/10',
        gradient: 'from-emerald-400 to-emerald-500',
        icon: TrendingUp,
      },
      {
        label: 'Gastos',
        value: formatCurrency(parseFloat(data.total_expenses), 'DOP'),
        count: data.total_expense_count,
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-100 dark:bg-red-500/10',
        gradient: 'from-red-400 to-red-500',
        icon: TrendingDown,
      },
      {
        label: 'Flujo Neto',
        value: formatCurrency(parseFloat(data.net_flow), 'DOP'),
        count: data.total_transfer_count + data.total_adjustment_count,
        color: parseFloat(data.net_flow) >= 0
          ? 'text-emerald-600 dark:text-emerald-400'
          : 'text-red-600 dark:text-red-400',
        bgColor: parseFloat(data.net_flow) >= 0
          ? 'bg-emerald-100 dark:bg-emerald-500/10'
          : 'bg-red-100 dark:bg-red-500/10',
        gradient: parseFloat(data.net_flow) >= 0
          ? 'from-emerald-400 to-emerald-500'
          : 'from-red-400 to-red-500',
        icon: Wallet,
      },
      {
        label: 'Transferencias',
        value: data.total_transfer_count.toString(),
        count: data.total_transfer_count,
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-100 dark:bg-blue-500/10',
        gradient: 'from-blue-400 to-blue-500',
        icon: ArrowLeftRight,
      },
    ]
  }, [data])

  const periodLabel = PERIOD_OPTIONS.find((o) => o.value === period)?.label || 'Personalizado'

  return (
    <div className={cn('rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm overflow-hidden', className)}>
      <div className="p-5 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Resumen</h3>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowPeriodMenu(!showPeriodMenu)}
              className="flex items-center gap-1.5 rounded-lg bg-white/50 dark:bg-gray-700/50 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 border border-gray-200/50 dark:border-gray-600/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            >
              {periodLabel}
              <ChevronDown className="h-3 w-3" />
            </button>

            {showPeriodMenu && (
              <div className="absolute right-0 top-full mt-1 z-20 w-40 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl overflow-hidden">
                {PERIOD_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setPeriod(opt.value as PeriodKey); setShowPeriodMenu(false) }}
                    className={cn(
                      'w-full px-3 py-2 text-left text-sm transition-colors',
                      period === opt.value
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
                {period === 'custom' && (
                  <div className="px-3 py-2 border-t border-gray-100 dark:border-gray-700 space-y-2">
                    <input
                      type="date"
                      value={customFrom}
                      onChange={(e) => setCustomFrom(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white/70 dark:bg-gray-700/70 px-2 py-1 text-xs"
                    />
                    <input
                      type="date"
                      value={customTo}
                      onChange={(e) => setCustomTo(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white/70 dark:bg-gray-700/70 px-2 py-1 text-xs"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="p-5 pt-0">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-white/50 dark:bg-gray-700/50 p-3 space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
        </div>
      ) : stats ? (
        <div className="p-5 pt-0">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="relative rounded-xl bg-white/50 dark:bg-gray-700/30 p-3 border border-gray-100/50 dark:border-gray-600/30 overflow-hidden group hover:shadow-md transition-all"
              >
                <div className={cn(
                  'absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r opacity-60',
                  stat.gradient,
                )} />
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{stat.label}</span>
                  <div className={cn('flex h-7 w-7 items-center justify-center rounded-lg', stat.bgColor)}>
                    <stat.icon className={cn('h-3.5 w-3.5', stat.color)} />
                  </div>
                </div>
                <p className={cn('text-base font-bold tabular-nums', stat.color)}>
                  {stat.value}
                </p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                  {stat.count} transaccion{stat.count !== 1 ? 'es' : ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
