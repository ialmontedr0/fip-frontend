import type { SeasonalOpportunities } from '@/types/ai'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Calendar, TrendingDown, TrendingUp, Award } from 'lucide-react'

const MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

interface SeasonalOpportunitiesCardProps {
  seasonal: SeasonalOpportunities | undefined
  className?: string
}

function SeasonalOpportunitiesCard({ seasonal, className }: SeasonalOpportunitiesCardProps) {
  if (!seasonal || !seasonal.months || Object.keys(seasonal.months).length === 0) {
    return (
      <div className={cn('rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm', className)}>
        <div className="flex items-center justify-center py-6 text-sm text-gray-400">
          <Calendar className="h-4 w-4 mr-2" />
          Sin datos estacionales
        </div>
      </div>
    )
  }

  const entries = Object.entries(seasonal.months)

  return (
    <div className={cn(
      'rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm transition-all duration-300',
      'hover:shadow-lg hover:-translate-y-0.5 hover:border-gray-200/80 dark:hover:border-gray-600/80',
      className,
    )}>
      <div className="flex items-center gap-2.5 mb-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/20">
          <Calendar className="h-4 w-4 text-white" />
        </div>
        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Oportunidades Estacionales</span>
      </div>

      <div className="grid grid-cols-6 gap-2 mb-5">
        {entries.map(([monthNum, data]) => {
          const idx = parseInt(monthNum) - 1
          const savingsLevel = data.vs_average_pct < -15 ? 'high' : data.vs_average_pct < -5 ? 'medium' : 'low'
          return (
            <div
              key={monthNum}
              className={cn(
                'rounded-xl p-3 text-center transition-all duration-200 border',
                data.is_cheaper
                  ? cn(
                      'bg-gradient-to-b from-emerald-50/80 to-green-50/80 dark:from-emerald-500/10 dark:to-green-500/10',
                      'border-emerald-200/50 dark:border-emerald-700/30',
                      savingsLevel === 'high' && 'shadow-md shadow-emerald-500/10',
                    )
                  : cn(
                      'bg-gradient-to-b from-gray-50/80 to-gray-100/50 dark:from-gray-800/40 dark:to-gray-800/20',
                      'border-gray-200/50 dark:border-gray-700/30',
                    ),
                data.is_cheaper && 'hover:shadow-lg hover:-translate-y-0.5 hover:border-emerald-300/50 dark:hover:border-emerald-600/30',
              )}
            >
              <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1">{MONTH_NAMES[idx]}</p>
              <p className={cn(
                'text-xs font-bold',
                data.is_cheaper ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-700 dark:text-gray-300',
              )}>
                {formatCurrency(data.total)}
              </p>
              {data.vs_average_pct !== 0 && (
                <div className={cn(
                  'flex items-center justify-center gap-0.5 text-[9px] mt-0.5',
                  data.is_cheaper ? 'text-emerald-500' : 'text-red-400',
                )}>
                  {data.is_cheaper ? <TrendingDown className="h-2.5 w-2.5" /> : <TrendingUp className="h-2.5 w-2.5" />}
                  {Math.abs(data.vs_average_pct).toFixed(0)}%
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
        <div className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50/80 dark:bg-gray-800/50 px-3 py-1.5 border border-gray-200/50 dark:border-gray-700/30">
          <TrendingUp className="h-3 w-3 text-blue-400" />
          <span className="text-gray-500 dark:text-gray-400">
            Promedio: <span className="font-semibold text-gray-700 dark:text-gray-300">{formatCurrency(seasonal.average_monthly)}</span>
          </span>
        </div>
        {seasonal.best_months.length > 0 && (
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-500/10 dark:to-green-500/10 px-3 py-1.5 border border-emerald-200/50 dark:border-emerald-700/30">
            <Award className="h-3 w-3 text-emerald-500" />
            <span className="text-emerald-700 dark:text-emerald-400">
              Mejores: <span className="font-bold">{seasonal.best_months.map((m) => MONTH_NAMES[m - 1]).join(', ')}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default SeasonalOpportunitiesCard
