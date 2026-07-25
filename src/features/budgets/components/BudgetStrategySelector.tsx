import { STRATEGY_OPTIONS } from '../constants'

interface BudgetStrategySelectorProps {
  value: string | null | undefined
  onChange: (value: string | null) => void
}

export default function BudgetStrategySelector({ value, onChange }: BudgetStrategySelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Estrategia
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {STRATEGY_OPTIONS.map((opt) => {
          const isSelected = value === opt.value || (!value && opt.value === '')
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value || null)}
              className={`px-3 py-2.5 text-sm font-medium rounded-lg border transition-all duration-200 ${
                isSelected
                  ? 'bg-violet-500 text-white border-violet-500 shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-600'
              }`}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
