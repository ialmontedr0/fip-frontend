import { useEffect, useState } from 'react'
import type { NetWorthResponse } from '@/types/analytics'
import { Skeleton, ErrorMessage } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import {
  Landmark, CreditCard, TrendingUp, TrendingDown,
  PieChart, Wallet, Building2, ArrowRight,
  AlertTriangle, Info,
} from 'lucide-react'

interface Props {
  netWorth: NetWorthResponse | undefined
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
          <Skeleton className="h-3 w-28" />
        </div>
      </div>
      <div className="flex justify-center mb-6">
        <Skeleton variant="circular" className="h-44 w-44" />
      </div>
      <div className="flex justify-center gap-6 mb-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  )
}

interface DonutSegmentProps {
  value: number
  total: number
  color: string
  offset: number
  delay: number
}

function DonutSegment({ value, total, color, offset, delay }: DonutSegmentProps) {
  const [animated, setAnimated] = useState(false)
  const circumference = 2 * Math.PI * 72
  const pct = total > 0 ? value / total : 0
  const dashLength = pct * circumference

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), delay * 1000)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <circle
      cx="90"
      cy="90"
      r="72"
      fill="none"
      stroke={color}
      strokeWidth="24"
      strokeDasharray={`${dashLength} ${circumference - dashLength}`}
      strokeDashoffset={animated ? -offset : circumference}
      strokeLinecap="round"
      className="transition-all duration-1000 ease-out"
      style={{ opacity: pct > 0.01 ? 1 : 0.15 }}
    />
  )
}

function AnimatedCounter({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let start = 0
    const step = value / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (Math.abs(start) >= Math.abs(value)) {
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

function CategoryIcon({ type }: { type: string }) {
  const icons: Record<string, React.ElementType> = {
    checking: Wallet,
    savings: Landmark,
    credit: CreditCard,
    cash: Building2,
    investment: TrendingUp,
  }
  const Icon = icons[type] || Landmark
  return <Icon className="h-3.5 w-3.5" />
}

export default function NetWorthChart({ netWorth, loading, error }: Props) {
  const [activeSegment, setActiveSegment] = useState<'assets' | 'liabilities' | null>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 300)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <ChartSkeleton />
  if (error) {
    return (
      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <div className="flex h-[450px] flex-col items-center justify-center gap-3">
          <PieChart className="h-10 w-10 text-primary-300 dark:text-primary-600" />
          <ErrorMessage message="No se pudo cargar el patrimonio" />
        </div>
      </div>
    )
  }
  if (!netWorth) {
    return (
      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <div className="flex h-[450px] flex-col items-center justify-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-100 to-blue-100 dark:from-primary-500/10 dark:to-blue-500/10">
            <PieChart className="h-7 w-7 text-primary-400 dark:text-primary-500" />
          </div>
          <p className="text-sm font-medium text-gray-400 dark:text-gray-500">Sin datos patrimoniales</p>
        </div>
      </div>
    )
  }

  const totalAssets = netWorth.total_assets || 0
  const totalLiabilities = netWorth.total_liabilities || 0
  const total = totalAssets + totalLiabilities
  const isPositive = netWorth.net_worth >= 0
  const assetPct = total > 0 ? (totalAssets / total) * 100 : 0
  const liabilityPct = total > 0 ? (totalLiabilities / total) * 100 : 0

  const assetTypes = Object.entries(netWorth.assets_by_type || {})
  const liabilityTypes = Object.entries(netWorth.liabilities_by_type || {})

  const offsetAssets = 0
  const offsetLiabilities = total > 0 ? (totalAssets / total) * 2 * Math.PI * 72 : 0

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border transition-all duration-500',
        'bg-white dark:bg-gray-900 p-6 shadow-sm',
        'hover:shadow-xl hover:border-gray-200 dark:hover:border-gray-700',
        'hover:-translate-y-0.5',
      )}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-400 via-primary-400 to-purple-500 dark:from-blue-500 dark:via-primary-500 dark:to-purple-600" />
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-blue-500/[0.03] to-transparent dark:from-blue-500/[0.05]" />
      <div className="absolute -right-16 -bottom-16 h-48 w-48 rounded-full bg-gradient-to-br from-blue-500/[0.03] to-purple-500/[0.03] dark:from-blue-500/[0.05] dark:to-purple-500/[0.05]" />

      {/* Header */}
      <div className="relative mb-6">
        <div className="flex items-center gap-2.5">
          <div className={cn(
            'flex h-8 w-8 items-center justify-center rounded-xl shadow-lg transition-all duration-500',
            isPositive
              ? 'bg-gradient-to-br from-green-500 to-emerald-500 shadow-green-500/20'
              : 'bg-gradient-to-br from-red-500 to-rose-500 shadow-red-500/20',
          )}>
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-white" />
            ) : (
              <TrendingDown className="h-4 w-4 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Composicion Patrimonial
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Activos vs Pasivos
            </p>
          </div>
        </div>
      </div>

      {/* Donut + Net Worth */}
      <div className="relative mb-6 flex flex-col items-center">
        {/* Donut chart */}
        <div
          className="relative h-[200px] w-[200px]"
          onMouseEnter={() => setActiveSegment('assets')}
          onMouseLeave={() => setActiveSegment(null)}
        >
          <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90 drop-shadow-lg">
            <circle
              cx="90" cy="90" r="72"
              fill="none" stroke="currentColor" strokeWidth="24"
              className="text-gray-100 dark:text-gray-800"
            />
            <DonutSegment
              value={totalAssets} total={total}
              color="#22c55e" offset={offsetAssets}
              delay={0.3}
            />
            <DonutSegment
              value={totalLiabilities} total={total}
              color="#ef4444" offset={offsetLiabilities}
              delay={0.6}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Patrimonio
            </p>
            <p className={cn(
              'text-xl font-bold tracking-tight transition-all duration-500 tabular-nums',
              isPositive
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400',
            )}>
              {hasAnimated ? (
                <AnimatedCounter value={netWorth.net_worth} />
              ) : (
                formatCurrency(netWorth.net_worth)
              )}
            </p>
            <div className={cn(
              'mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium',
              isPositive
                ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400'
                : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
            )}>
              {isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {isPositive ? 'Positivo' : 'Negativo'}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-6 text-xs">
          <button
            type="button"
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all duration-200',
              activeSegment === 'assets'
                ? 'bg-green-50 shadow-sm dark:bg-green-500/10'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800',
            )}
            onMouseEnter={() => setActiveSegment('assets')}
            onMouseLeave={() => setActiveSegment(null)}
          >
            <span className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.4)]" />
            <span className="font-medium text-gray-500 dark:text-gray-400">Activos</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">{assetPct.toFixed(0)}%</span>
          </button>
          <button
            type="button"
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all duration-200',
              activeSegment === 'liabilities'
                ? 'bg-red-50 shadow-sm dark:bg-red-500/10'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800',
            )}
            onMouseEnter={() => setActiveSegment('liabilities')}
            onMouseLeave={() => setActiveSegment(null)}
          >
            <span className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.4)]" />
            <span className="font-medium text-gray-500 dark:text-gray-400">Pasivos</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">{liabilityPct.toFixed(0)}%</span>
          </button>
        </div>
      </div>

      {/* Breakdown */}
      <div className="relative space-y-2">
        {/* Assets section */}
        {assetTypes.length > 0 && (
          <div className={cn(
            'rounded-xl border border-transparent transition-all duration-300 p-0.5',
            activeSegment === 'assets' && 'border-green-200 bg-green-50/30 dark:border-green-900/50 dark:bg-green-500/5',
          )}>
            <div className="space-y-1">
              {assetTypes.map(([type, data], i) => (
                <div
                  key={type}
                  className="group/asset flex items-center justify-between rounded-lg px-3 py-2 transition-all duration-200 hover:bg-green-50 dark:hover:bg-green-500/5"
                  style={{ animation: `fadeIn 0.4s ease-out ${0.5 + i * 0.06}s both` }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-400">
                      <CategoryIcon type={type} />
                    </div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {type.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-green-600 dark:text-green-400 tabular-nums">
                      {formatCurrency(data.total)}
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 w-8 text-right">
                      {totalAssets > 0 ? ((data.total / totalAssets) * 100).toFixed(0) : 0}%
                    </span>
                    <ArrowRight className="h-3 w-3 text-gray-300 opacity-0 transition-all group-hover/asset:opacity-100 group-hover/asset:translate-x-0.5 dark:text-gray-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Liabilities section */}
        {liabilityTypes.length > 0 && (
          <div className={cn(
            'rounded-xl border border-transparent transition-all duration-300 p-0.5',
            activeSegment === 'liabilities' && 'border-red-200 bg-red-50/30 dark:border-red-900/50 dark:bg-red-500/5',
          )}>
            <div className="space-y-1">
              {liabilityTypes.map(([type, data], i) => (
                <div
                  key={type}
                  className="group/liability flex items-center justify-between rounded-lg px-3 py-2 transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-500/5"
                  style={{ animation: `fadeIn 0.4s ease-out ${0.7 + i * 0.06}s both` }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400">
                      <CategoryIcon type={type} />
                    </div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {type.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-red-600 dark:text-red-400 tabular-nums">
                      {formatCurrency(data.total)}
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 w-8 text-right">
                      {totalLiabilities > 0 ? ((data.total / totalLiabilities) * 100).toFixed(0) : 0}%
                    </span>
                    <ArrowRight className="h-3 w-3 text-gray-300 opacity-0 transition-all group-hover/liability:opacity-100 group-hover/liability:translate-x-0.5 dark:text-gray-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Credit card debt alert */}
        {netWorth.credit_card_debt > 0 && (
          <div
            className="mt-2 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50/80 to-orange-50/80 p-3 dark:border-amber-900/50 dark:from-amber-500/5 dark:to-orange-500/5"
            style={{ animation: 'fadeIn 0.5s ease-out 0.9s both' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-500/15">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">Deuda Tarjetas de Credito</p>
                  <p className="text-[10px] text-amber-600 dark:text-amber-500">
                    {totalLiabilities > 0
                      ? `${((netWorth.credit_card_debt / totalLiabilities) * 100).toFixed(0)}% de los pasivos totales`
                      : 'Pasivo adicional'
                    }
                  </p>
                </div>
              </div>
              <span className="text-sm font-bold text-amber-700 dark:text-amber-400 tabular-nums">
                {formatCurrency(netWorth.credit_card_debt)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer insight */}
      <div className="relative mt-4 flex items-center justify-center gap-2 border-t border-gray-100 pt-3 text-[11px] dark:border-gray-800">
        <Info className="h-3 w-3 text-gray-400" />
        <span className="text-gray-400 dark:text-gray-500">
          {isPositive
            ? `Tus activos superan a tus pasivos por ${formatCurrency(netWorth.net_worth)}`
            : `Tus pasivos superan a tus activos por ${formatCurrency(Math.abs(netWorth.net_worth))}`
          }
        </span>
      </div>
    </div>
  )
}
