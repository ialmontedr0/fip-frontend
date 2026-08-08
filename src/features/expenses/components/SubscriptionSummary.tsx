import { cn, formatCurrency } from '@/lib/utils'
import { Repeat, TrendingUp, CalendarDays, AlertCircle } from 'lucide-react'
import type { SubscriptionSummaryResponse } from '@/types/expenses'

interface Props {
  summary: SubscriptionSummaryResponse | undefined
  isLoading?: boolean
  className?: string
}

function StatCard({ icon: Icon, label, value, subvalue, color }: {
  icon: React.ElementType
  label: string
  value: string
  subvalue?: string
  color: string
}) {
  return (
    <div className="rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 p-3">
      <div className="flex items-center gap-2 mb-1.5">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg" style={{ backgroundColor: `${color}15` }}>
          <Icon className="h-3.5 w-3.5" style={{ color }} />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">{label}</span>
      </div>
      <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{value}</p>
      {subvalue && <p className="text-[10px] text-gray-400">{subvalue}</p>}
    </div>
  )
}

export default function SubscriptionSummaryCard({ summary, isLoading, className }: Props) {
  if (isLoading) {
    return (
      <div className={cn('grid grid-cols-2 lg:grid-cols-4 gap-3', className)}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl bg-white/60 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50 p-3 animate-pulse">
            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (!summary) return null

  return (
    <div className={cn('grid grid-cols-2 lg:grid-cols-4 gap-3', className)}>
      <StatCard
        icon={Repeat}
        label="Suscripciones Activas"
        value={summary.active_count.toString()}
        color="#6366f1"
      />
      <StatCard
        icon={TrendingUp}
        label="Gasto Mensual"
        value={formatCurrency(summary.monthly_total)}
        color="#10b981"
      />
      <StatCard
        icon={CalendarDays}
        label="Costo Anual"
        value={formatCurrency(summary.annual_total)}
        subvalue={summary.cost_per_day ? `${formatCurrency(summary.cost_per_day)}/dia` : undefined}
        color="#f59e0b"
      />
      <StatCard
        icon={AlertCircle}
        label="Recomendaciones"
        value={`${summary.recommendations?.length || 0}`}
        subvalue={summary.recommendations?.length > 0 ? 'acciones sugeridas' : undefined}
        color="#ef4444"
      />
    </div>
  )
}
