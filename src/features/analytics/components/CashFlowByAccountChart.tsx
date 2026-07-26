import { useEffect, useState } from 'react'
import type { CashFlowByAccountResponse } from '@/types/analytics'
import { Skeleton, ErrorMessage } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import {
  Landmark, TrendingUp, TrendingDown, Wallet,
  PiggyBank, CreditCard, Banknote, BarChart3,
  ArrowUpRight, ArrowDownRight, Minus,
} from 'lucide-react'

interface Props {
  data: CashFlowByAccountResponse | undefined
  loading: boolean
  error: boolean
}

function ChartSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Skeleton variant="circular" className="h-8 w-8" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-9 w-full rounded-lg" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface AccountIconConfig {
  icon: React.ElementType
  gradient: string
  bg: string
  text: string
  shadow: string
}

const ACCOUNT_STYLES: Record<string, AccountIconConfig> = {
  checking: {
    icon: Wallet,
    gradient: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    text: 'text-blue-600 dark:text-blue-400',
    shadow: 'shadow-blue-500/20',
  },
  savings: {
    icon: PiggyBank,
    gradient: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    text: 'text-emerald-600 dark:text-emerald-400',
    shadow: 'shadow-emerald-500/20',
  },
  credit: {
    icon: CreditCard,
    gradient: 'from-violet-500 to-purple-500',
    bg: 'bg-violet-50 dark:bg-violet-500/10',
    text: 'text-violet-600 dark:text-violet-400',
    shadow: 'shadow-violet-500/20',
  },
  cash: {
    icon: Banknote,
    gradient: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    text: 'text-amber-600 dark:text-amber-400',
    shadow: 'shadow-amber-500/20',
  },
  investment: {
    icon: TrendingUp,
    gradient: 'from-rose-500 to-pink-500',
    bg: 'bg-rose-50 dark:bg-rose-500/10',
    text: 'text-rose-600 dark:text-rose-400',
    shadow: 'shadow-rose-500/20',
  },
}

function getDefaultStyle(): AccountIconConfig {
  return {
    icon: Landmark,
    gradient: 'from-gray-500 to-slate-500',
    bg: 'bg-gray-50 dark:bg-gray-500/10',
    text: 'text-gray-600 dark:text-gray-400',
    shadow: 'shadow-gray-500/20',
  }
}

function AnimatedNumber({ value, duration = 800 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let start = 0
    const increment = value / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= value) {
        setDisplay(value)
        clearInterval(timer)
      } else {
        setDisplay(start)
      }
    }, 16)
    return () => clearInterval(timer)
  }, [value, duration])
  return <>{formatCurrency(Math.round(display))}</>
}

export default function CashFlowByAccountChart({ data, loading, error }: Props) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  if (loading) return <ChartSkeleton />
  if (error) {
    return (
      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <div className="flex h-[350px] flex-col items-center justify-center gap-3">
          <BarChart3 className="h-10 w-10 text-blue-300 dark:text-blue-600" />
          <ErrorMessage message="No se pudo cargar el flujo por cuenta" />
        </div>
      </div>
    )
  }
  if (!data || data.accounts.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:from-gray-900 dark:to-gray-950 p-6 shadow-sm">
        <div className="flex h-[350px] flex-col items-center justify-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-500/10 dark:to-cyan-500/10">
            <Landmark className="h-7 w-7 text-blue-400 dark:text-blue-500" />
          </div>
          <p className="text-sm font-medium text-gray-400 dark:text-gray-500">Sin movimientos en cuentas</p>
        </div>
      </div>
    )
  }

  const accounts = data.accounts
  const totalIncome = accounts.reduce((s, a) => s + a.income, 0)
  const totalExpenses = accounts.reduce((s, a) => s + a.expenses, 0)
  const totalNet = accounts.reduce((s, a) => s + a.net_flow, 0)
  const maxAbs = Math.max(
    ...accounts.map((a) => Math.max(Math.abs(a.income), Math.abs(a.expenses), 1)),
  )

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border transition-all duration-500',
        'bg-white dark:bg-gray-900 p-6 shadow-sm',
        'hover:shadow-xl hover:border-gray-200 dark:hover:border-gray-700',
        'hover:-translate-y-0.5',
      )}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-500 dark:from-blue-500 dark:via-cyan-500 dark:to-teal-600" />
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-blue-500/[0.03] to-transparent dark:from-blue-500/[0.05]" />

      {/* Header */}
      <div className="relative mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/20">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Flujo por Cuenta
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {data.start} — {data.end} &middot; {accounts.length} {accounts.length === 1 ? 'cuenta' : 'cuentas'}
              </p>
            </div>
          </div>
        </div>
        <div className={cn(
          'rounded-xl px-3 py-1.5 text-right transition-all',
          totalNet >= 0
            ? 'bg-green-50 dark:bg-green-500/10'
            : 'bg-red-50 dark:bg-red-500/10',
        )}>
          <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Flujo Neto Total</p>
          <p className={cn(
            'text-sm font-bold tabular-nums',
            totalNet >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
          )}>
            {formatCurrency(totalNet)}
          </p>
        </div>
      </div>

      {/* Summary strip */}
      <div className="relative mb-5 grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-gradient-to-br from-green-50 to-emerald-50/50 p-3 dark:from-green-500/5 dark:to-emerald-500/0">
          <p className="text-[10px] font-medium text-green-600 dark:text-green-400 uppercase tracking-wider flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> Ingresos
          </p>
          <p className="mt-0.5 text-sm font-bold text-green-700 dark:text-green-300 tabular-nums">
            {formatCurrency(totalIncome)}
          </p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-red-50 to-rose-50/50 p-3 dark:from-red-500/5 dark:to-rose-500/0">
          <p className="text-[10px] font-medium text-red-600 dark:text-red-400 uppercase tracking-wider flex items-center gap-1">
            <TrendingDown className="h-3 w-3" /> Gastos
          </p>
          <p className="mt-0.5 text-sm font-bold text-red-700 dark:text-red-300 tabular-nums">
            {formatCurrency(totalExpenses)}
          </p>
        </div>
        <div className={cn(
          'rounded-xl p-3',
          totalNet >= 0
            ? 'bg-gradient-to-br from-blue-50 to-cyan-50/50 dark:from-blue-500/5 dark:to-cyan-500/0'
            : 'bg-gradient-to-br from-orange-50 to-amber-50/50 dark:from-orange-500/5 dark:to-amber-500/0',
        )}>
          <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cuentas</p>
          <p className="mt-0.5 text-sm font-bold text-gray-900 dark:text-gray-100 tabular-nums">
            {accounts.length}
          </p>
        </div>
      </div>

      {/* Account bars */}
      <div className="relative space-y-3">
        {accounts.map((account, index) => {
          const isExpanded = expandedIndex === index
          const isPositive = account.net_flow >= 0
          const incomePct = maxAbs > 0 ? (account.income / maxAbs) * 100 : 0
          const expensePct = maxAbs > 0 ? (account.expenses / maxAbs) * 100 : 0
          const style = ACCOUNT_STYLES[account.account_type] || getDefaultStyle()
          const Icon = style.icon

          return (
            <div
              key={account.account}
              className={cn(
                'relative overflow-hidden rounded-xl border transition-all duration-300',
                'dark:border-gray-800',
                isExpanded
                  ? 'border-gray-200 shadow-md dark:border-gray-700'
                  : 'border-gray-100 hover:border-gray-200 dark:hover:border-gray-700',
                'hover:shadow-sm cursor-pointer',
              )}
              style={{ animation: `fadeIn 0.5s ease-out ${0.1 + index * 0.08}s both` }}
              onClick={() => setExpandedIndex(isExpanded ? null : index)}
            >
              <div className="p-4">
                {/* Account header */}
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300',
                      style.bg, style.text,
                      'group-hover:scale-110',
                    )}>
                      <Icon className="h-4.5 w-4.5" style={{ height: 18, width: 18 }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {account.account}
                      </p>
                      <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        {account.account_type.replace(/_/g, ' ')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1.5">
                      {isPositive ? (
                        <ArrowUpRight className="h-3.5 w-3.5 text-green-500" />
                      ) : account.net_flow === 0 ? (
                        <Minus className="h-3.5 w-3.5 text-gray-400" />
                      ) : (
                        <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />
                      )}
                      <p className={cn(
                        'text-sm font-bold tabular-nums',
                        isPositive ? 'text-green-600 dark:text-green-400' :
                          account.net_flow === 0 ? 'text-gray-500 dark:text-gray-400' :
                            'text-red-600 dark:text-red-400',
                      )}>
                        {formatCurrency(account.net_flow)}
                      </p>
                    </div>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500">Flujo Neto</p>
                  </div>
                </div>

                {/* Stacked horizontal bars */}
                <div className="relative h-10 w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                  {/* Income bar (left) */}
                  <div
                    className="absolute inset-y-0 left-0 flex items-center justify-start rounded-l-xl px-2.5 transition-all duration-1000 ease-out"
                    style={{
                      width: `${Math.max(incomePct, 0.5)}%`,
                      background: `linear-gradient(135deg, #22c55e, #16a34a)`,
                      opacity: 0.85,
                    }}
                  >
                    {incomePct > 10 && (
                      <span className="text-[10px] font-bold text-white drop-shadow-sm tabular-nums">
                        <AnimatedNumber value={account.income} />
                      </span>
                    )}
                  </div>
                  {/* Expenses bar (right) */}
                  <div
                    className="absolute inset-y-0 right-0 flex items-center justify-end rounded-r-xl px-2.5 transition-all duration-1000 ease-out"
                    style={{
                      width: `${Math.max(expensePct, 0.5)}%`,
                      background: `linear-gradient(135deg, #ef4444, #dc2626)`,
                      opacity: 0.85,
                    }}
                  >
                    {expensePct > 10 && (
                      <span className="text-[10px] font-bold text-white drop-shadow-sm tabular-nums">
                        <AnimatedNumber value={account.expenses} />
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer stats */}
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <TrendingUp className="h-3 w-3" />
                      <AnimatedNumber value={account.income} />
                    </span>
                    <span className="flex items-center gap-1 text-red-500 dark:text-red-400">
                      <TrendingDown className="h-3 w-3" />
                      <AnimatedNumber value={account.expenses} />
                    </span>
                  </div>
                  <span className="text-gray-400 dark:text-gray-500">
                    I:{maxAbs > 0 ? ((account.income / (account.income + account.expenses)) * 100 || 0).toFixed(0) : 0}%
                    &nbsp;/&nbsp;
                    G:{maxAbs > 0 ? ((account.expenses / (account.income + account.expenses)) * 100 || 0).toFixed(0) : 0}%
                  </span>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="mt-3 border-t border-gray-100 pt-3 dark:border-gray-800 animate-fade-in">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-lg bg-green-50 px-3 py-2 dark:bg-green-500/5">
                        <p className="font-medium text-green-600 dark:text-green-400">Ingresos</p>
                        <p className="text-sm font-bold text-green-700 dark:text-green-300">
                          {formatCurrency(account.income)}
                        </p>
                      </div>
                      <div className="rounded-lg bg-red-50 px-3 py-2 dark:bg-red-500/5">
                        <p className="font-medium text-red-600 dark:text-red-400">Gastos</p>
                        <p className="text-sm font-bold text-red-700 dark:text-red-300">
                          {formatCurrency(account.expenses)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="relative mt-5 flex items-center justify-center gap-2 border-t border-gray-100 pt-4 text-xs dark:border-gray-800">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.3)]" />
          <span className="text-gray-400 dark:text-gray-500">Ingresos</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.3)]" />
          <span className="text-gray-400 dark:text-gray-500">Gastos</span>
        </div>
        <div className="mx-2 h-3 w-px bg-gray-200 dark:bg-gray-700" />
        <span className="text-gray-400 dark:text-gray-500">
          Haz clic en una cuenta para ver detalle
        </span>
      </div>
    </div>
  )
}
