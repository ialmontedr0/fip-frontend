import { cn } from '@/lib/utils'
import { TRIGGER_CONFIG } from '../constants'
import { Filter, ChevronDown } from 'lucide-react'

type ActiveFilterValue = 'all' | 'active' | 'inactive'

interface AutomationFiltersProps {
  activeFilter: ActiveFilterValue
  onFilterChange: (value: ActiveFilterValue) => void
  triggerTypeFilter: string
  onTriggerTypeChange: (value: string) => void
}

const FILTER_PILLS: { value: ActiveFilterValue; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'active', label: 'Activas' },
  { value: 'inactive', label: 'Inactivas' },
]

export default function AutomationFilters({
  activeFilter,
  onFilterChange,
  triggerTypeFilter,
  onTriggerTypeChange,
}: AutomationFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 animate-fade-in-up">
      <div className="inline-flex items-center rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-1 shadow-sm gap-0.5">
        {FILTER_PILLS.map((pill, i) => (
          <button
            key={pill.value}
            onClick={() => onFilterChange(pill.value)}
            className={cn(
              'relative rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all duration-200',
              activeFilter === pill.value
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md shadow-purple-500/20 scale-[1.02]'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50',
            )}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            {activeFilter === pill.value && (
              <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            )}
            {pill.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none z-10" />
        <select
          value={triggerTypeFilter}
          onChange={(e) => onTriggerTypeChange(e.target.value)}
          className="appearance-none rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl pl-8 pr-8 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/30 cursor-pointer shadow-sm transition-all duration-200 hover:border-purple-200/50 dark:hover:border-purple-500/30"
        >
          <option value="">Todos los disparadores</option>
          {Object.entries(TRIGGER_CONFIG).map(([key, config]) => (
            <option key={key} value={key}>{config.label || key}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
      </div>
    </div>
  )
}
