import { useParams, useNavigate } from 'react-router-dom'
import { useWalletLiquidity } from '../hooks/useWallets'
import LiquidityLevelBadge from '../components/LiquidityLevelBadge'
import LiquidityGauge from '../components/LiquidityGauge'
import { Skeleton, ErrorMessage } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { ArrowLeft, Droplets, Info, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { ACCOUNT_TYPE_CONFIG } from '@/features/accounts/constants'
import type { AccountType } from '@/types/accounts'

const LIQUIDITY_INFO = {
  high: 'Efectivo, cuentas corrientes y billeteras digitales. Acceso inmediato a los fondos.',
  medium: 'Cuentas de ahorro. Acceso en 1-3 dias habiles.',
  low: 'Cuentas bancarias y criptomonedas. Acceso variable o restringido.',
}

const LEVEL_ICONS = {
  high: TrendingUp,
  medium: Minus,
  low: TrendingDown,
  mixed: Minus,
}

const LEVEL_COLORS = {
  high: 'text-emerald-600 dark:text-emerald-400',
  medium: 'text-amber-600 dark:text-amber-400',
  low: 'text-red-600 dark:text-red-400',
  mixed: 'text-blue-600 dark:text-blue-400',
}

export default function WalletLiquidityPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: liquidity, isLoading, isError, error } = useWalletLiquidity(id)

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 pb-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-44 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    )
  }

  if (isError || !liquidity) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <ErrorMessage
          message={(error as Error)?.message || 'No se pudo cargar el analisis de liquidez'}
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  const breakdownEntries = Object.entries(liquidity.breakdown)

  return (
    <div className="relative max-w-2xl mx-auto space-y-6 pb-8">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -left-20 -top-10 h-60 w-60 rounded-full bg-gradient-to-br from-sky-200/20 to-emerald-200/10 blur-3xl dark:from-sky-500/10 dark:to-emerald-500/5" />
      <div className="pointer-events-none absolute -right-16 top-40 h-48 w-48 rounded-full bg-gradient-to-br from-amber-200/10 to-orange-200/10 blur-3xl dark:from-amber-500/5 dark:to-orange-500/5" />

      {/* Header */}
      <div className="flex items-center gap-3 animate-fade-in">
        <button onClick={() => navigate(`/wallets/${id}`)} className="rounded-xl p-2.5 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{liquidity.wallet_name}</h1>
          <p className="text-sm text-gray-500">Analisis de Liquidez</p>
        </div>
      </div>

      {/* Overall Liquidity */}
      <div className={cn(
        'relative overflow-hidden rounded-2xl border border-gray-100/80 bg-white/80 p-6 backdrop-blur-xl shadow-sm',
        'dark:border-gray-800/80 dark:bg-gray-900/80',
        'animate-fade-in',
      )} style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-sky-400 via-emerald-400 to-teal-400" />
        <div className={cn(
          'absolute -bottom-10 -right-10 h-40 w-40 rounded-full opacity-10 blur-3xl',
          liquidity.overall_level === 'high' ? 'bg-emerald-400' : liquidity.overall_level === 'medium' ? 'bg-amber-400' : 'bg-red-400',
        )} />

        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-sky-500" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Nivel General de Liquidez
              </h3>
            </div>
            <LiquidityLevelBadge level={liquidity.overall_level} />
          </div>

          <LiquidityGauge level={liquidity.overall_level} className="mb-4" />

          <div className="flex items-center justify-between rounded-xl bg-gray-50/50 p-3 dark:bg-gray-800/50">
            <div className="flex items-center gap-2">
              {(() => {
                const Icon = LEVEL_ICONS[liquidity.overall_level]
                return <Icon className={cn('h-4 w-4', LEVEL_COLORS[liquidity.overall_level])} />
              })()}
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Total cuentas</span>
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{liquidity.total_accounts}</span>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className={cn(
        'relative overflow-hidden rounded-2xl border border-gray-100/80 bg-white/80 p-6 backdrop-blur-xl shadow-sm',
        'dark:border-gray-800/80 dark:bg-gray-900/80',
        'animate-fade-in',
      )} style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-400 via-sky-400 to-primary-400" />

        <div className="relative">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
            Desglose por Tipo de Cuenta
          </h3>

          <div className="space-y-3">
            {breakdownEntries.map(([type, item], index) => {
              const config = ACCOUNT_TYPE_CONFIG[type as AccountType]
              const Icon = config?.icon
              return (
                <div
                  key={type}
                  className={cn(
                    'rounded-xl border border-gray-100 p-4 transition-all hover:shadow-sm dark:border-gray-700/50',
                    'animate-fade-in',
                  )}
                  style={{ animationDelay: `${0.25 + index * 0.05}s`, animationFillMode: 'both' }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        'flex h-7 w-7 items-center justify-center rounded-lg',
                        config?.bgColor ?? 'bg-gray-100',
                      )}>
                        {Icon && <Icon className={cn('h-3.5 w-3.5', config?.color)} />}
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {config?.label || type}
                      </span>
                    </div>
                    <LiquidityLevelBadge level={item.liquidity_level} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {item.account_count} cuenta{item.account_count !== 1 ? 's' : ''}
                    </span>
                    <span className={cn(
                      'text-sm font-bold tabular-nums tracking-tight',
                      parseFloat(item.total_balance) >= 0
                        ? 'text-gray-900 dark:text-gray-100'
                        : 'text-red-600 dark:text-red-400',
                    )}>
                      {formatCurrency(parseFloat(item.total_balance))}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className={cn(
        'relative overflow-hidden rounded-xl border border-sky-100 bg-gradient-to-br from-sky-50 to-blue-50 p-5',
        'dark:border-sky-900/50 dark:from-sky-500/10 dark:to-blue-500/5',
        'animate-fade-in',
      )} style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-100 dark:bg-sky-500/20">
            <Info className="h-4 w-4 text-sky-600 dark:text-sky-400" />
          </div>
          <div className="text-sm space-y-2">
            <p className="font-semibold text-sky-800 dark:text-sky-300">Como se determina la liquidez?</p>
            <ul className="space-y-1.5 text-sky-700 dark:text-sky-400">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                <span><strong>Alta:</strong> {LIQUIDITY_INFO.high}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                <span><strong>Media:</strong> {LIQUIDITY_INFO.medium}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                <span><strong>Baja:</strong> {LIQUIDITY_INFO.low}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
