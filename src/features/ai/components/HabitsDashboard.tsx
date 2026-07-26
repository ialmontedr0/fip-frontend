import { useMemo } from 'react'
import { useHabitAnalysis } from '../hooks/useAI'
import { useCategories } from '@/features/categories/hooks/useCategories'
import HabitScoreGauge from './HabitScoreGauge'
import HabitRadarChart from './HabitRadarChart'
import HabitBreakdownList from './HabitBreakdownList'
import SpendingPatternsCard from './SpendingPatternsCard'
import CategoryDominanceCard from './CategoryDominanceCard'
import RecurringExpensesList from './RecurringExpensesList'
import { Skeleton } from '@/components/ui'
import { ErrorMessage } from '@/components/ui'
function HabitsDashboard() {
  const { data, isLoading, isError, refetch } = useHabitAnalysis()
  const { data: catData } = useCategories()
  const categoryNames = useMemo(() => {
    if (!catData?.categories) return {}
    const map: Record<string, string> = {}
    for (const cat of catData.categories) {
      map[cat.id] = cat.name
    }
    return map
  }, [catData])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return <ErrorMessage message="No se pudieron cargar los habitos" onRetry={() => refetch()} />
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-gray-400">
        Sin datos de habitos disponibles
      </div>
    )
  }

  const habits = data.habits

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="flex items-center justify-center">
          <div className="rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-6 shadow-sm">
            <HabitScoreGauge value={habits.overall_habit_score} />
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm h-full">
            <HabitRadarChart habits={habits} categoryNames={categoryNames} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm">
        <HabitBreakdownList habits={habits} categoryNames={categoryNames} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SpendingPatternsCard patterns={habits.spending_patterns} />
        <CategoryDominanceCard category_dominance={habits.category_dominance} categoryNames={categoryNames} />
        <RecurringExpensesList recurring={habits.detected_recurring} />
        <div className="rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-400 to-indigo-500 shadow-sm">
              <span className="text-white text-xs font-bold">R</span>
            </div>
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Recomendaciones</p>
          </div>
          <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">{data.total_recommendations}</p>
        </div>
      </div>
    </div>
  )
}

export default HabitsDashboard
