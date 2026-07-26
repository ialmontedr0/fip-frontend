import type { SpendingPatterns } from '@/types/ai'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { CalendarDays, Sun, Moon, AlertTriangle } from 'lucide-react'

interface SpendingPatternsCardProps {
  patterns: SpendingPatterns | undefined
  className?: string
}

function SpendingPatternsCard({ patterns, className }: SpendingPatternsCardProps) {
  if (!patterns) {
    return (
      <div className={cn('rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm', className)}>
        <p className="text-sm text-gray-400">Sin datos de patrones</p>
      </div>
    )
  }

  const maxAmount = Math.max(patterns.avg_weekday_amount, patterns.avg_weekend_amount)

  return (
    <div className={cn(
      'rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm transition-all duration-300',
      'hover:shadow-lg hover:-translate-y-0.5 hover:border-gray-200/80 dark:hover:border-gray-600/80',
      className,
    )}>
      <div className="flex items-center gap-2.5 mb-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 shadow-lg shadow-purple-500/20">
          <CalendarDays className="h-4 w-4 text-white" />
        </div>
        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Patrones de Gasto</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-gradient-to-br from-amber-50/50 to-yellow-50/50 dark:from-amber-500/5 dark:to-yellow-500/5 p-4 border border-amber-200/50 dark:border-amber-700/30 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-yellow-500 shadow-md shadow-amber-500/20">
              <Sun className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Semana</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">{formatCurrency(patterns.avg_weekday_amount)}</p>
          <div className="h-2 rounded-full bg-gray-200/70 dark:bg-gray-700/50 overflow-hidden mb-1.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 transition-all duration-500"
              style={{ width: `${(patterns.avg_weekday_amount / maxAmount) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-400">{patterns.weekday_transactions} transacciones</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-indigo-50/50 to-blue-50/50 dark:from-indigo-500/5 dark:to-blue-500/5 p-4 border border-indigo-200/50 dark:border-indigo-700/30 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-400 to-blue-500 shadow-md shadow-indigo-500/20">
              <Moon className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Fin de semana</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">{formatCurrency(patterns.avg_weekend_amount)}</p>
          <div className="h-2 rounded-full bg-gray-200/70 dark:bg-gray-700/50 overflow-hidden mb-1.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-blue-500 transition-all duration-500"
              style={{ width: `${(patterns.avg_weekend_amount / maxAmount) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-400">{patterns.weekend_transactions} transacciones</p>
        </div>
      </div>

      {patterns.high_weekend_spending && (
        <div className="mt-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10 border border-amber-200/50 dark:border-amber-700/30 px-4 py-3 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 shadow-md shadow-amber-500/20 flex-shrink-0">
              <AlertTriangle className="h-3.5 w-3.5 text-white" />
            </div>
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
              Mayor gasto en fines de semana ({patterns.weekend_amount_share.toFixed(0)}% del total)
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default SpendingPatternsCard
