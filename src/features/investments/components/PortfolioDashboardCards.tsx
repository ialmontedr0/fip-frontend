import { TrendingUp, TrendingDown, PieChart, Layers } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { PortfolioSummaryResponse } from '@/types/investment'

interface Props {
  summary: PortfolioSummaryResponse
}

export default function PortfolioDashboardCards({ summary }: Props) {
  const isGain = summary.gain_loss >= 0

  const cards = [
    {
      label: 'Valor Total',
      value: formatCurrency(summary.total_value),
      icon: PieChart,
      color: 'from-blue-500 to-indigo-600',
      shadow: 'shadow-blue-500/20',
    },
    {
      label: 'Costo Total',
      value: formatCurrency(summary.total_cost),
      icon: Layers,
      color: 'from-slate-500 to-slate-700',
      shadow: 'shadow-slate-500/20',
    },
    {
      label: isGain ? 'Ganancia' : 'Perdida',
      value: formatCurrency(summary.gain_loss),
      sub: `${summary.gain_loss_percent.toFixed(2)}%`,
      icon: isGain ? TrendingUp : TrendingDown,
      color: isGain ? 'from-emerald-500 to-teal-600' : 'from-rose-500 to-red-600',
      shadow: isGain ? 'shadow-emerald-500/20' : 'shadow-rose-500/20',
    },
    {
      label: 'Activos',
      value: `${summary.asset_count}`,
      sub: `${summary.portfolio_count} portafolios`,
      icon: Layers,
      color: 'from-amber-500 to-orange-600',
      shadow: 'shadow-amber-500/20',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-700/50 bg-white dark:bg-gray-800/80 p-5 shadow-sm transition-all duration-300 hover:shadow-lg"
        >
          <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${card.color}`} />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {card.label}
              </p>
              <p className="mt-2 text-lg font-bold text-gray-900 dark:text-white tabular-nums">
                {card.value}
              </p>
              {card.sub && (
                <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{card.sub}</p>
              )}
            </div>
            <div className={cn(
              'flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg',
              card.color, card.shadow,
            )}>
              <card.icon className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
