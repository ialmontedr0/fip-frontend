import { Flag } from 'lucide-react'
import { useGoals } from '@/features/goals/hooks/useGoals'
import type { GoalCompletedConditions } from '@/types/automations'

interface Props {
  value: GoalCompletedConditions | null
  onChange: (conditions: GoalCompletedConditions) => void
}

export default function GoalCompletedCondition({ value, onChange }: Props) {
  const { data: goalsData } = useGoals()

  return (
    <div className="space-y-4">
      <div className="group">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Meta</label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-lg shadow-cyan-500/20">
            <Flag className="h-3 w-3 text-white" />
          </div>
          <select
            value={value?.goal_id ?? ''}
            onChange={(e) => onChange({ goal_id: e.target.value })}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all appearance-none"
          >
            <option value="">Seleccionar meta...</option>
            {goalsData?.goals?.map((goal) => (
              <option key={goal.id} value={goal.id}>{goal.name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
