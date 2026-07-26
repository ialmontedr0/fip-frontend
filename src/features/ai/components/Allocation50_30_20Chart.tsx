import type { Allocation50_30_20 } from '@/types/ai'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { PieChart } from 'lucide-react'

interface Allocation50_30_20ChartProps {
  allocation: Allocation50_30_20 | undefined
  className?: string
}

const BAR_CONFIG = {
  needs: { gradient: 'from-blue-400 to-blue-600', label: 'Necesidades' },
  wants: { gradient: 'from-amber-400 to-orange-500', label: 'Deseos' },
  savings: { gradient: 'from-emerald-400 to-green-500', label: 'Ahorro' },
} as const

function Allocation50_30_20Chart({ allocation, className }: Allocation50_30_20ChartProps) {
  if (!allocation) {
    return (
      <div className={cn('rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm', className)}>
        <p className="text-sm text-gray-400">Sin datos de asignacion</p>
      </div>
    )
  }

  const categories = [
    { key: 'needs' as const, actual: allocation.actual.needs_pct, recommended: allocation.recommended.needs_pct, diff: allocation.deviation.needs_diff },
    { key: 'wants' as const, actual: allocation.actual.wants_pct, recommended: allocation.recommended.wants_pct, diff: allocation.deviation.wants_diff },
    { key: 'savings' as const, actual: allocation.actual.savings_pct, recommended: allocation.recommended.savings_pct, diff: allocation.deviation.savings_diff },
  ]

  return (
    <div className={cn(
      'rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm transition-all duration-300',
      'hover:shadow-lg hover:-translate-y-0.5 hover:border-gray-200/80',
      className,
    )}>
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-gradient-to-br from-purple-400/20 to-violet-500/20 p-1.5 rounded-lg shadow-lg shadow-purple-500/10">
          <PieChart className="h-4 w-4 text-purple-500" />
        </div>
        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Regla 50/30/20</span>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-3 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 mb-1">Ingresos</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(allocation.total_income)}</p>
        </div>
        <div className="rounded-xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-3 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 mb-1">Gastos</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(allocation.total_expenses)}</p>
        </div>
        <div className="rounded-xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-3 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 mb-1">Ahorro</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(allocation.actual_savings)}</p>
        </div>
      </div>

      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.key} className="group transition-all duration-200 hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{BAR_CONFIG[cat.key].label}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{cat.actual.toFixed(0)}%</span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 ml-1">actual</span>
                </span>
                <span className="text-[10px] text-gray-300 dark:text-gray-600">/</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {cat.recommended}%<span className="text-[10px] ml-1">ideal</span>
                </span>
                <span className={cn(
                  'text-xs font-bold px-1.5 py-0.5 rounded',
                  Math.abs(cat.diff) < 5
                    ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
                    : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20',
                )}>
                  {cat.diff > 0 ? '+' : ''}{cat.diff.toFixed(0)}%
                </span>
              </div>
            </div>
            <div className="h-4 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-inner relative">
              <div className="absolute inset-0 flex">
                <div
                  className={`h-full rounded-l-full bg-gradient-to-r ${BAR_CONFIG[cat.key].gradient} transition-all duration-700 ease-out shadow-sm relative overflow-hidden`}
                  style={{ width: `${Math.min(cat.actual, 100)}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                </div>
                <div
                  className={`h-full rounded-r-full bg-gradient-to-r ${BAR_CONFIG[cat.key].gradient} transition-all duration-700 ease-out opacity-30`}
                  style={{ width: `${Math.max(cat.recommended - cat.actual, 0)}%` }}
                />
              </div>
              <div
                className={`h-full rounded-full bg-gradient-to-r ${BAR_CONFIG[cat.key].gradient} transition-all duration-700 ease-out opacity-15`}
                style={{ width: `${Math.min(cat.recommended, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Allocation50_30_20Chart
