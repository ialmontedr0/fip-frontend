import type { HabitAnalysis, HabitFrequency, HabitStability } from '@/types/ai'
import { HABIT_FREQUENCY_LABELS, STABILITY_LABELS } from './valueMaps'
import { cn } from '@/lib/utils'
import { Activity, TrendingUp } from 'lucide-react'

interface HabitBreakdownListProps {
  habits: HabitAnalysis | undefined
  categoryNames?: Record<string, string>
  className?: string
}

function HabitBreakdownList({ habits, categoryNames = {}, className }: HabitBreakdownListProps) {
  if (!habits) {
    return (
      <div className={cn('flex items-center justify-center h-64 text-sm text-gray-400', className)}>
        Sin datos de habitos
      </div>
    )
  }

  const categories = Object.keys(habits.spending_frequency)
  const getName = (id: string) => categoryNames[id] || id

  return (
    <div className={cn('space-y-2', className)}>
      {categories.map((cat, i) => {
        const freq: HabitFrequency = habits.spending_frequency[cat]
        const stability: HabitStability | undefined = habits.habit_stability?.[cat]
        const dominance = habits.category_dominance?.[cat]

        return (
          <div
            key={cat}
            style={{ animationDelay: `${i * 60}ms` }}
            className="flex items-center justify-between rounded-xl border border-gray-100/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md px-4 py-3.5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-400 to-indigo-500 shadow-sm flex-shrink-0">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{getName(cat)}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[10px] font-medium text-gray-500 dark:text-gray-400">
                    {HABIT_FREQUENCY_LABELS[freq.frequency_label] || freq.frequency_label}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0 ml-3">
              {stability && (
                <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50 rounded-lg px-2 py-1">{STABILITY_LABELS[stability.label] || stability.label}</span>
              )}
              {dominance && dominance.is_dominant && (
                <span className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 rounded-lg px-2.5 py-1">
                  <TrendingUp className="h-3 w-3" />
                  {(dominance.share * 100).toFixed(0)}%
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default HabitBreakdownList
