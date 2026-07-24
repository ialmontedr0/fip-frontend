import type { NetWorthResponse } from '@/types/analytics'
import { Skeleton } from '@/components/ui'
import { ErrorMessage } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Landmark, CreditCard, TrendingUp } from 'lucide-react'

interface Props {
  netWorth: NetWorthResponse | undefined
  loading: boolean
  error: boolean
}

function NetWorthSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
      <Skeleton className="mb-2 h-5 w-32" />
      <Skeleton className="mb-6 h-10 w-48" />
      <Skeleton className="mb-4 h-2 w-full rounded-full" />
      <div className="space-y-3">
        <Skeleton className="h-14 w-full rounded-xl" />
        <Skeleton className="h-14 w-full rounded-xl" />
      </div>
    </div>
  )
}

export default function NetWorthWidget({ netWorth, loading, error }: Props) {
  if (loading) return <NetWorthSkeleton />
  if (error) {
    return (
      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <ErrorMessage message="No se pudo cargar el patrimonio neto" />
      </div>
    )
  }
  if (!netWorth) {
    return (
      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <div className="flex h-[250px] items-center justify-center text-sm text-gray-400">
          Sin datos de patrimonio
        </div>
      </div>
    )
  }

  const totalAssets = netWorth.total_assets || 0
  const totalLiabilities = netWorth.total_liabilities || 0
  const total = totalAssets + totalLiabilities
  const assetPct = total > 0 ? (totalAssets / total) * 100 : 0
  const liabilityPct = total > 0 ? (totalLiabilities / total) * 100 : 0
  const isPositive = netWorth.net_worth >= 0

  return (
    <div className={cn(
      'group relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800',
      'bg-white dark:bg-gray-900 p-6 shadow-sm transition-all duration-300',
      'hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-700',
    )}>
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-400 via-primary-400 to-purple-400" />

      <div className="mb-5">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary-500" />
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Patrimonio Neto
          </h3>
        </div>

        <p className={cn(
          'mt-3 text-3xl font-bold tracking-tight',
          'bg-gradient-to-r bg-clip-text text-transparent',
          isPositive ? 'from-green-500 to-emerald-600' : 'from-red-500 to-rose-600',
        )}>
          {formatCurrency(netWorth.net_worth)}
        </p>
      </div>

      <div className="mb-4">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="font-medium text-gray-400 dark:text-gray-500">Distribucion</span>
          <span className="text-gray-400 dark:text-gray-500">
            {assetPct.toFixed(0)}% / {liabilityPct.toFixed(0)}%
          </span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <div className="flex h-full">
            <div
              className="rounded-l-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-700"
              style={{ width: `${assetPct}%` }}
            />
            <div
              className="rounded-r-full bg-gradient-to-r from-red-400 to-red-500 transition-all duration-700"
              style={{ width: `${liabilityPct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        <div className={cn(
          'flex items-center justify-between rounded-xl p-3 transition-all duration-200',
          'bg-gradient-to-r from-green-50 to-green-50/50 dark:from-green-500/5 dark:to-green-500/0',
          'hover:from-green-100 hover:to-green-50 dark:hover:from-green-500/10 dark:hover:to-green-500/5',
        )}>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 dark:bg-green-500/20">
              <Landmark className="h-4.5 w-4.5 text-green-600 dark:text-green-400" style={{ height: 18, width: 18 }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Activos</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{assetPct.toFixed(0)}% del total</p>
            </div>
          </div>
          <span className="text-sm font-bold text-green-600 dark:text-green-400 tabular-nums">
            {formatCurrency(totalAssets)}
          </span>
        </div>

        <div className={cn(
          'flex items-center justify-between rounded-xl p-3 transition-all duration-200',
          'bg-gradient-to-r from-red-50 to-red-50/50 dark:from-red-500/5 dark:to-red-500/0',
          'hover:from-red-100 hover:to-red-50 dark:hover:from-red-500/10 dark:hover:to-red-500/5',
        )}>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 dark:bg-red-500/20">
              <CreditCard className="h-4.5 w-4.5 text-red-600 dark:text-red-400" style={{ height: 18, width: 18 }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Pasivos</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{liabilityPct.toFixed(0)}% del total</p>
            </div>
          </div>
          <span className="text-sm font-bold text-red-600 dark:text-red-400 tabular-nums">
            {formatCurrency(totalLiabilities)}
          </span>
        </div>
      </div>

      {netWorth.credit_card_debt > 0 && (
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/50 px-3 py-2.5 dark:border-amber-900/50 dark:bg-amber-500/5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-amber-700 dark:text-amber-400">Deuda Tarjetas</p>
            <span className="text-sm font-bold text-amber-700 dark:text-amber-400 tabular-nums">
              {formatCurrency(netWorth.credit_card_debt)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
