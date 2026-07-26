import { Filter, X } from 'lucide-react'
import { GOAL_TYPE_CONFIG, GOAL_STATUS_CONFIG, PRIORITY_CONFIG } from '../constants'
import type { GoalType, GoalStatus, GoalFilters as GoalFiltersType } from '@/types/goals'

interface GoalFiltersProps {
  filters: GoalFiltersType
  onChange: (filters: GoalFiltersType) => void
}

export default function GoalFilters({ filters, onChange }: GoalFiltersProps) {
  const hasFilters = filters.goal_type || filters.status || filters.priority != null

  const clearFilters = () => onChange({})

  const activeCount = [filters.goal_type, filters.status, filters.priority != null].filter(Boolean).length

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Type Filter */}
      <div className="relative group">
        <select
          value={filters.goal_type || ''}
          onChange={(e) => onChange({ ...filters, goal_type: (e.target.value || undefined) as GoalType | undefined })}
          className="appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 pr-8 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500/30 cursor-pointer min-w-[130px]"
        >
          <option value="">Todos los tipos</option>
          {Object.entries(GOAL_TYPE_CONFIG).map(([key, config]) => (
            <option key={key} value={key}>{config.label}</option>
          ))}
        </select>
        <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
      </div>

      {/* Status Filter */}
      <div className="relative group">
        <select
          value={filters.status || ''}
          onChange={(e) => onChange({ ...filters, status: (e.target.value || undefined) as GoalStatus | undefined })}
          className="appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 pr-8 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500/30 cursor-pointer min-w-[120px]"
        >
          <option value="">Todos los estados</option>
          {Object.entries(GOAL_STATUS_CONFIG).map(([key, config]) => (
            <option key={key} value={key}>{config.label}</option>
          ))}
        </select>
      </div>

      {/* Priority Filter */}
      <div className="relative group">
        <select
          value={filters.priority ?? ''}
          onChange={(e) => onChange({ ...filters, priority: (e.target.value ? Number(e.target.value) : undefined) as number | undefined })}
          className="appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 pr-8 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500/30 cursor-pointer min-w-[120px]"
        >
          <option value="">Todas las prioridades</option>
          {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
            <option key={key} value={key}>{config.label}</option>
          ))}
        </select>
      </div>

      {/* Clear */}
      {hasFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
          Limpiar
          <span className="ml-0.5 bg-red-200 dark:bg-red-500/30 text-red-700 dark:text-red-300 text-xs rounded-full px-1.5 py-0.5">{activeCount}</span>
        </button>
      )}
    </div>
  )
}
