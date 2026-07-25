import { PERIOD_OPTIONS } from '../constants'
import type { BudgetPeriod } from '@/types/budgets'

interface PeriodSelectorProps {
  value: BudgetPeriod
  onChange: (value: BudgetPeriod) => void
}

export default function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Periodo del presupuesto">
      {PERIOD_OPTIONS.map((opt) => {
        const isSelected = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(opt.value)}
            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
              isSelected
                ? 'bg-violet-500 text-white border-violet-500 shadow-md shadow-violet-500/20'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-600 hover:text-violet-600 dark:hover:text-violet-400'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
