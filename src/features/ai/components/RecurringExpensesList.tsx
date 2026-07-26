import type { DetectedRecurring } from '@/types/ai'
import ConfidenceBadge from './ConfidenceBadge'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { RefreshCw, Calendar, Repeat } from 'lucide-react'

interface RecurringExpensesListProps {
  recurring: DetectedRecurring[] | undefined
  className?: string
}

function RecurringExpensesList({ recurring, className }: RecurringExpensesListProps) {
  if (!recurring || recurring.length === 0) {
    return (
      <div className={cn('rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm', className)}>
        <div className="flex items-center justify-center py-6 text-sm text-gray-400">
          <RefreshCw className="h-4 w-4 mr-2" />
          Sin gastos recurrentes detectados
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      'rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm transition-all duration-300',
      'hover:shadow-lg hover:-translate-y-0.5 hover:border-gray-200/80 dark:hover:border-gray-600/80',
      className,
    )}>
      <div className="flex items-center gap-2.5 mb-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 shadow-lg shadow-cyan-500/20">
          <RefreshCw className="h-4 w-4 text-white" />
        </div>
        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Gastos Recurrentes</span>
      </div>

      <div className="space-y-2.5">
        {recurring.map((r, i) => (
          <div
            key={r.category_id}
            className={cn(
              'rounded-xl bg-gray-50/70 dark:bg-gray-800/40 border border-gray-100/50 dark:border-gray-700/30 px-4 py-3.5',
              'transition-all duration-200 hover:bg-gray-100/70 dark:hover:bg-gray-800/60 hover:shadow-md',
            )}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-teal-500 shadow-md shadow-cyan-500/20 flex-shrink-0">
                  <Repeat className="h-4 w-4 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-base font-bold text-gray-900 dark:text-white">{formatCurrency(r.approximate_amount)}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-[9px] font-bold text-gray-600 dark:text-gray-400">{r.occurrences}</span>
                      ocurrencias
                    </span>
                    <span className="text-gray-300 dark:text-gray-600">|</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Cada {r.avg_days_between} dias
                    </span>
                  </div>
                </div>
              </div>
              <ConfidenceBadge value={r.confidence} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecurringExpensesList
