import { useMemo } from 'react'
import {
  HeartPulse,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Target,
  HandCoins,
  Ban,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react'
import type { PortfolioKPIs } from '@/types/analytics'
import { Badge, Skeleton } from '@/components/ui'
import { ErrorMessage } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface Props {
  portfolio: PortfolioKPIs | undefined
  loading: boolean
  error: boolean
}

function HealthSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
      <Skeleton className="mb-2 h-5 w-40" />
      <Skeleton className="mx-auto mb-6 h-24 w-24 rounded-full" />
      <Skeleton className="mb-4 h-8 w-36 mx-auto" />
      <Skeleton className="mb-3 h-3 w-full rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-[52px] w-full rounded-xl" />
        <Skeleton className="h-[52px] w-full rounded-xl" />
        <Skeleton className="h-[52px] w-full rounded-xl" />
      </div>
    </div>
  )
}

function computeHealthScore(kpis: PortfolioKPIs): { score: number; label: string; color: string } {
  let score = 0

  if (kpis.debt_to_income < 0.15) score += 35
  else if (kpis.debt_to_income < 0.30) score += 25
  else if (kpis.debt_to_income < 0.43) score += 15
  else score += 5

  if (kpis.net_worth > 0) score += 15
  else if (kpis.net_worth === 0) score += 8
  else score += 0

  if (kpis.active_budgets > 0) score += 15
  else score += 5

  if (kpis.active_goals > 0) score += 15
  else score += 5

  if (kpis.active_loans === 0) score += 20
  else if (kpis.active_loans <= 2) score += 12
  else if (kpis.active_loans <= 4) score += 6
  else score += 2

  const final = Math.min(Math.max(score, 0), 100)

  if (final >= 80) return { score: final, label: 'Excelente', color: 'from-emerald-400 to-green-500' }
  if (final >= 60) return { score: final, label: 'Buena', color: 'from-blue-400 to-primary-500' }
  if (final >= 40) return { score: final, label: 'Regular', color: 'from-amber-400 to-orange-500' }
  return { score: final, label: 'En riesgo', color: 'from-red-400 to-rose-500' }
}

export default function FinancialHealthWidget({ portfolio, loading, error }: Props) {
  const health = useMemo(() => {
    if (!portfolio) return null
    return computeHealthScore(portfolio)
  }, [portfolio])

  const dtiPct = portfolio ? (portfolio.debt_to_income * 100) : 0
  const paymentRatio = portfolio && portfolio.avg_monthly_income > 0
    ? (portfolio.total_month_debt_payments / portfolio.avg_monthly_income) * 100
    : 0

  if (loading) return <HealthSkeleton />
  if (error) {
    return (
      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <ErrorMessage message="No se pudo cargar la salud financiera" />
      </div>
    )
  }
  if (!portfolio) {
    return (
      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <div className="flex h-[280px] items-center justify-center text-sm text-gray-400">
          Sin datos financieros
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      'group relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800',
      'bg-white dark:bg-gray-900 p-6 shadow-sm transition-all duration-300',
      'hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-700',
    )}>
      <div className={cn(
        'absolute inset-x-0 top-0 h-1',
        health ? 'bg-gradient-to-r ' + health.color : 'bg-gradient-to-r from-teal-400 to-cyan-500',
      )} />

      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <HeartPulse className="h-4 w-4 text-rose-500" />
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Salud Financiera
          </h3>
        </div>
        {health && (
          <Badge variant={
            health.score >= 80 ? 'success' : health.score >= 60 ? 'primary' : health.score >= 40 ? 'warning' : 'danger'
          } size="sm">
            {health.label}
          </Badge>
        )}
      </div>

      {health && (
        <div className="mb-5 flex flex-col items-center">
          <div className="relative mb-3 flex h-28 w-28 items-center justify-center">
            <svg className="h-28 w-28 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="8"
                className="text-gray-100 dark:text-gray-800" />
              <circle cx="60" cy="60" r="52" fill="none" strokeWidth="8"
                strokeLinecap="round"
                className={cn(
                  'transition-all duration-1000 ease-out drop-shadow-lg',
                  health.score >= 80 ? 'stroke-emerald-500' :
                  health.score >= 60 ? 'stroke-primary-500' :
                  health.score >= 40 ? 'stroke-orange-500' :
                  'stroke-red-500',
                )}
                strokeDasharray={`${2 * Math.PI * 52}`}
                strokeDashoffset={`${2 * Math.PI * 52 * (1 - health.score / 100)}`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn(
                'text-2xl font-black tabular-nums',
                health.score >= 80 ? 'text-emerald-600 dark:text-emerald-400' :
                health.score >= 60 ? 'text-primary-600 dark:text-primary-400' :
                health.score >= 40 ? 'text-orange-600 dark:text-orange-400' :
                'text-red-600 dark:text-red-400',
              )}>
                {health.score}
              </span>
              <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 -mt-0.5">
                /100
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Activos</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-primary-500" />
              <span>Presupuestos</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-amber-500" />
              <span>Metas</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-rose-500" />
              <span>Deuda</span>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="font-medium text-gray-500 dark:text-gray-400">
            Relacion Deuda/Ingreso
          </span>
          <span className={cn(
            'font-bold tabular-nums',
            dtiPct < 15 ? 'text-emerald-600 dark:text-emerald-400' :
            dtiPct < 30 ? 'text-primary-600 dark:text-primary-400' :
            dtiPct < 43 ? 'text-amber-600 dark:text-amber-400' :
            'text-red-600 dark:text-red-400',
          )}>
            {dtiPct.toFixed(1)}%
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-700',
              dtiPct < 15 ? 'bg-gradient-to-r from-emerald-400 to-green-500' :
              dtiPct < 30 ? 'bg-gradient-to-r from-blue-400 to-primary-500' :
              dtiPct < 43 ? 'bg-gradient-to-r from-amber-400 to-orange-500' :
              'bg-gradient-to-r from-red-400 to-rose-500',
            )}
            style={{ width: `${Math.min(dtiPct, 100)}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-[11px] text-gray-400 dark:text-gray-500">
          <span>0%</span>
          <span className="font-medium">15% saludable</span>
          <span>43% maximo</span>
        </div>
      </div>

      <div className="space-y-2">
        <MetricRow
          icon={HandCoins}
          iconBg="bg-blue-100 dark:bg-blue-500/20"
          iconColor="text-blue-600 dark:text-blue-400"
          label="Deuda Mensual"
          sub={`${paymentRatio.toFixed(1)}% del ingreso`}
          value={formatCurrency(portfolio.total_month_debt_payments)}
          valueColor="text-blue-600 dark:text-blue-400"
        />
        <MetricRow
          icon={TrendingUp}
          iconBg="bg-emerald-100 dark:bg-emerald-500/20"
          iconColor="text-emerald-600 dark:text-emerald-400"
          label="Ingreso Promedio"
          sub="Mensual estimado"
          value={formatCurrency(portfolio.avg_monthly_income)}
          valueColor="text-emerald-600 dark:text-emerald-400"
        />
        <MetricRow
          icon={portfolio.net_worth >= 0 ? TrendingUp : TrendingDown}
          iconBg={portfolio.net_worth >= 0 ? 'bg-emerald-100 dark:bg-emerald-500/20' : 'bg-red-100 dark:bg-red-500/20'}
          iconColor={portfolio.net_worth >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}
          label="Patrimonio Neto"
          sub={portfolio.net_worth >= 0 ? 'Balance positivo' : 'Balance negativo'}
          value={formatCurrency(portfolio.net_worth)}
          valueColor={portfolio.net_worth >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <MiniStat
          icon={PiggyBank}
          label="Presupuestos"
          value={portfolio.active_budgets}
          active={portfolio.active_budgets > 0}
        />
        <MiniStat
          icon={Target}
          label="Metas"
          value={portfolio.active_goals}
          active={portfolio.active_goals > 0}
        />
        <MiniStat
          icon={portfolio.active_loans > 0 ? HandCoins : Ban}
          label="Prestamos"
          value={portfolio.active_loans}
          active={false}
          alert={portfolio.active_loans > 2}
        />
      </div>

      <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50/50 p-3 dark:border-gray-800 dark:bg-gray-800/30">
        <div className="flex items-start gap-2.5">
          {health && health.score >= 60 ? (
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
          ) : (
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          )}
          <div>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              {health && health.score >= 80
                ? 'Excelente salud financiera. Sigue asi!'
                : health && health.score >= 60
                  ? 'Buena salud financiera. Hay areas de mejora.'
                  : health && health.score >= 40
                    ? 'Salud financiera regular. Revisa tu deuda y metas.'
                    : 'Salud financiera en riesgo. Toma accion pronto.'}
            </p>
            <p className="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">
              {health && health.score >= 60
                ? 'Tus finanzas estan bien encaminadas.'
                : 'Considera reducir deudas y aumentar tu ahorro.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricRow({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  sub,
  value,
  valueColor,
}: {
  icon: React.ComponentType<{ className?: string }>
  iconBg: string
  iconColor: string
  label: string
  sub: string
  value: string
  valueColor: string
}) {
  return (
    <div className={cn(
      'flex items-center justify-between rounded-xl p-2.5 transition-all duration-200',
      'hover:bg-gray-50 dark:hover:bg-gray-800/30',
    )}>
      <div className="flex items-center gap-2.5">
        <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', iconBg)}>
          <Icon className={cn('h-4 w-4', iconColor)} />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{label}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">{sub}</p>
        </div>
      </div>
      <span className={cn('text-sm font-bold tabular-nums', valueColor)}>
        {value}
      </span>
    </div>
  )
}

function MiniStat({
  icon: Icon,
  label,
  value,
  active,
  alert,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: number
  active?: boolean
  alert?: boolean
}) {
  return (
    <div className={cn(
      'flex flex-col items-center rounded-xl border p-3 transition-all duration-200',
      alert
        ? 'border-red-200 bg-red-50/50 dark:border-red-900/50 dark:bg-red-500/10'
        : active
          ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/50 dark:bg-emerald-500/10'
          : 'border-gray-100 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-800/30',
    )}>
      <Icon className={cn(
        'mb-1 h-4 w-4',
        alert ? 'text-red-500' : active ? 'text-emerald-500' : 'text-gray-400 dark:text-gray-500',
      )} />
      <span className={cn(
        'text-base font-black tabular-nums',
        alert ? 'text-red-600 dark:text-red-400' :
        active ? 'text-emerald-600 dark:text-emerald-400' :
        'text-gray-600 dark:text-gray-400',
      )}>
        {value}
      </span>
      <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500">{label}</span>
    </div>
  )
}
