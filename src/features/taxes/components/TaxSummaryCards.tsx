import { Banknote, Percent, ReceiptText, CalendarClock, PieChart } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import { taxCategoryColor } from '@/types/taxes'
import type { TaxSummaryResponse } from '@/types/taxes'

interface TaxSummaryCardsProps {
  summary?: TaxSummaryResponse
  loading?: boolean
}

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 animate-pulse">
      <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
      <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  )
}

export default function TaxSummaryCards({ summary, loading }: TaxSummaryCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (!summary) return null

  const cards = [
    {
      label: 'Año Fiscal',
      value: summary.year,
      icon: CalendarClock,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-500/10',
    },
    {
      label: 'Deducciones',
      value: summary.deduction_count,
      icon: ReceiptText,
      color: 'text-violet-600 dark:text-violet-400',
      bgColor: 'bg-violet-50 dark:bg-violet-500/10',
    },
    {
      label: 'Monto Total',
      value: formatCurrency(summary.total_deductions),
      icon: Banknote,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-500/10',
    },
    {
      label: 'Total Deducible',
      value: formatCurrency(summary.total_deductible),
      icon: Percent,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-500/10',
    },
  ]

  const maxCategory = Math.max(...summary.by_category.map((c) => c.total), 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className="relative bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-[0.03] dark:opacity-[0.06] pointer-events-none bg-current" />
              <div className="relative">
                <div className={cn('flex h-9 w-9 items-center justify-center rounded-xl mb-3', card.bgColor)}>
                  <Icon className={cn('h-5 w-5', card.color)} />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                  {card.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {card.label}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 shadow-sm">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <PieChart className="h-4 w-4 text-violet-500" />
          Deducciones por Categoria
        </h4>
        {summary.by_category.length > 0 ? (
          <div className="space-y-4">
            {summary.by_category.map((item) => {
              const color = item.category === 'Sin categoría' ? '#6b7280' : taxCategoryColor(item.category)
              return (
                <div key={item.category}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      {item.category}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(item.total)}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: maxCategory > 0 ? `${(item.total / maxCategory) * 100}%` : '0%',
                        background: `linear-gradient(to right, ${color}, ${color}88)`,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
            No hay deducciones registradas para este año
          </p>
        )}
      </div>
    </div>
  )
}
