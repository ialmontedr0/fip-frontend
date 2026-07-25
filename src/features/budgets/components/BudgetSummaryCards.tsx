import { PiggyBank, TrendingUp, AlertTriangle, Bell } from 'lucide-react'
import type { BudgetSummaryResponse } from '@/types/budgets'

interface BudgetSummaryCardsProps {
  summary: BudgetSummaryResponse | undefined
  isLoading: boolean
}

function formatCurrency(value: string | number) {
  const num = typeof value === 'string' ? Number(value) : value
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num)
}

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 shadow-sm animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700" />
        <div className="space-y-2">
          <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-5 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  )
}

export default function BudgetSummaryCards({ summary, isLoading }: BudgetSummaryCardsProps) {
  if (isLoading || !summary) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  const cards = [
    {
      label: 'Presupuestos Activos',
      value: summary.total_budgets.toString(),
      sublabel: `Total: ${formatCurrency(summary.total_budget_amount)}`,
      icon: PiggyBank,
      gradient: 'from-violet-500 to-purple-600',
      bgGlow: 'bg-violet-500/10',
    },
    {
      label: 'Utilizacion',
      value: `${Number(summary.utilization_pct).toFixed(1)}%`,
      sublabel: `${formatCurrency(summary.total_spent)} de ${formatCurrency(summary.total_budget_amount)}`,
      icon: TrendingUp,
      gradient: 'from-blue-500 to-cyan-600',
      bgGlow: 'bg-blue-500/10',
    },
    {
      label: 'Sobre el Limite',
      value: summary.over_budget_count.toString(),
      sublabel: 'presupuestos excedidos',
      icon: AlertTriangle,
      gradient: 'from-red-500 to-rose-600',
      bgGlow: 'bg-red-500/10',
    },
    {
      label: 'Alertas',
      value: summary.unread_alerts.toString(),
      sublabel: `${summary.new_alerts_triggered} nuevas ahora`,
      icon: Bell,
      gradient: 'from-amber-500 to-orange-600',
      bgGlow: 'bg-amber-500/10',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.label}
            className="relative bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-[0.03] dark:opacity-[0.06] ${card.bgGlow} group-hover:scale-150 transition-transform duration-500`} />
            <div className="relative">
              <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg mb-3`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {card.label}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                {card.value}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {card.sublabel}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
