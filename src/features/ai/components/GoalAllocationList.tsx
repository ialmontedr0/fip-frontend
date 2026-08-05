import type { GoalAllocation } from '@/types/ai'
import { formatCurrency } from '@/lib/utils'
import { cn, formatISODate } from '@/lib/utils'
import { Target, Calendar, TrendingUp } from 'lucide-react'

interface GoalAllocationListProps {
  goalAllocation: GoalAllocation | undefined
  className?: string
}

function GoalAllocationList({ goalAllocation, className }: GoalAllocationListProps) {
  if (!goalAllocation || goalAllocation.goals.length === 0) {
    return (
      <div className={cn('rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm', className)}>
        <div className="flex items-center justify-center py-6 text-sm text-gray-400">
          <Target className="h-4 w-4 mr-2" />
          Sin metas configuradas
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
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 shadow-lg shadow-purple-500/20">
            <Target className="h-4 w-4 text-white" />
          </div>
          <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Asignacion a Metas</span>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400">Mensual recomendado</p>
          <p className="text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
            {formatCurrency(goalAllocation.total_recommended_monthly)}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {goalAllocation.goals.map((goal) => (
          <div
            key={goal.goal_id}
            className="rounded-xl bg-gray-50/70 dark:bg-gray-800/40 border border-gray-100/50 dark:border-gray-700/30 p-4 transition-all duration-200 hover:bg-gray-100/70 dark:hover:bg-gray-800/60"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{goal.goal_name}</span>
              <span className="text-xs font-bold bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent">
                {formatCurrency(goal.recommended_monthly)}/mes
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">
                  {formatCurrency(goal.current_amount)} / {formatCurrency(goal.target_amount)}
                </span>
                <span className="flex items-center gap-1 font-semibold text-gray-600 dark:text-gray-400">
                  <TrendingUp className="h-3 w-3" />
                  {goal.progress_pct.toFixed(0)}%
                </span>
              </div>
              <div className="relative h-2.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-700"
                  style={{ width: `${Math.min(goal.progress_pct, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-gray-400">
                <span className="flex items-center gap-0.5">
                  <Calendar className="h-3 w-3" />
                  {goal.target_date ? formatISODate(goal.target_date) : 'Sin fecha'}
                </span>
                <span className="font-medium">{goal.goal_type}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-gray-400 flex items-center gap-1">
        <TrendingUp className="h-3 w-3" />
        Estrategia: {goalAllocation.strategy}
      </p>
    </div>
  )
}

export default GoalAllocationList
