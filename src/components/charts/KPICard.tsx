import { cn, formatCurrency } from '@/lib/utils'
import { Skeleton } from '@/components/ui'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface KPICardProps {
  title: string
  value: number
  previousValue?: number
  format?: 'currency' | 'percentage' | 'number'
  icon?: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  loading?: boolean
  className?: string
}

const colorConfig = {
  primary: {
    gradient: 'from-primary-500 to-primary-600',
    light: 'bg-primary-50 dark:bg-primary-500/10',
    text: 'text-primary-600 dark:text-primary-400',
    glow: 'shadow-primary-500/20',
    ring: 'ring-primary-500/30',
    badgeBg: 'bg-primary-50 dark:bg-primary-500/10',
    badgeText: 'text-primary-600 dark:text-primary-400',
  },
  success: {
    gradient: 'from-green-500 to-emerald-600',
    light: 'bg-green-50 dark:bg-green-500/10',
    text: 'text-green-600 dark:text-green-400',
    glow: 'shadow-green-500/20',
    ring: 'ring-green-500/30',
    badgeBg: 'bg-green-50 dark:bg-green-500/10',
    badgeText: 'text-green-600 dark:text-green-400',
  },
  warning: {
    gradient: 'from-amber-500 to-orange-600',
    light: 'bg-amber-50 dark:bg-amber-500/10',
    text: 'text-amber-600 dark:text-amber-400',
    glow: 'shadow-amber-500/20',
    ring: 'ring-amber-500/30',
    badgeBg: 'bg-amber-50 dark:bg-amber-500/10',
    badgeText: 'text-amber-600 dark:text-amber-400',
  },
  danger: {
    gradient: 'from-red-500 to-rose-600',
    light: 'bg-red-50 dark:bg-red-500/10',
    text: 'text-red-600 dark:text-red-400',
    glow: 'shadow-red-500/20',
    ring: 'ring-red-500/30',
    badgeBg: 'bg-red-50 dark:bg-red-500/10',
    badgeText: 'text-red-600 dark:text-red-400',
  },
  info: {
    gradient: 'from-blue-500 to-cyan-600',
    light: 'bg-blue-50 dark:bg-blue-500/10',
    text: 'text-blue-600 dark:text-blue-400',
    glow: 'shadow-blue-500/20',
    ring: 'ring-blue-500/30',
    badgeBg: 'bg-blue-50 dark:bg-blue-500/10',
    badgeText: 'text-blue-600 dark:text-blue-400',
  },
}

function formatValue(value: number, fmt?: string): string {
  switch (fmt) {
    case 'percentage':
      return `${value.toFixed(1)}%`
    case 'currency':
      return formatCurrency(value)
    default:
      return value.toLocaleString('es-DO')
  }
}

function calcChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / Math.abs(previous)) * 100
}

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'neutral' }) {
  if (trend === 'up') return <TrendingUp className="h-3 w-3" />
  if (trend === 'down') return <TrendingDown className="h-3 w-3" />
  return <Minus className="h-3 w-3" />
}

function KPICard({
  title,
  value,
  previousValue,
  format = 'currency',
  icon,
  color = 'primary',
  loading,
  className,
}: KPICardProps) {
  const cfg = colorConfig[color]

  const hasPrevious = previousValue !== undefined && previousValue !== null
  const change = hasPrevious ? calcChange(value, previousValue!) : 0
  const trend: 'up' | 'down' | 'neutral' =
    change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'

  if (loading) {
    return (
      <div className={cn('rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm', className)}>
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton variant="circular" className="h-10 w-10" />
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800',
        'bg-white dark:bg-gray-900 p-5 shadow-sm',
        'transition-all duration-300 ease-out',
        'hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50',
        'hover:border-gray-200 dark:hover:border-gray-700',
        'hover:-translate-y-0.5',
        className,
      )}
    >
      <div
        className={cn(
          'absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-0 transition-all duration-500',
          'group-hover:opacity-100 group-hover:scale-150',
          cfg.light,
        )}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium tracking-wide text-gray-400 dark:text-gray-500 uppercase">
              {title}
            </p>

            <p
              className={cn(
                'text-2xl font-bold tracking-tight',
                'bg-gradient-to-r bg-clip-text text-transparent',
                cfg.gradient,
              )}
            >
              {formatValue(value, format)}
            </p>

            {hasPrevious && (
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition-all',
                    'animate-fade-in',
                    trend === 'up' && 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400',
                    trend === 'down' && 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
                    trend === 'neutral' && 'bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
                  )}
                >
                  <TrendIcon trend={trend} />
                  {Math.abs(change).toFixed(1)}%
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">vs mes ant.</span>
              </div>
            )}
          </div>

          {icon && (
            <div
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300',
                'group-hover:scale-110 group-hover:shadow-lg',
                cfg.light,
                cfg.text,
                cfg.glow,
              )}
            >
              {icon}
            </div>
          )}
        </div>

        <div
          className={cn(
            'mt-4 h-0.5 w-0 rounded-full transition-all duration-500 ease-out',
            'group-hover:w-full',
            `bg-gradient-to-r ${cfg.gradient}`,
          )}
        />
      </div>
    </div>
  )
}

export default KPICard
