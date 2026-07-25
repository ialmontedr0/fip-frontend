import { BUDGET_TYPE_OPTIONS } from '../constants'
import type { BudgetType } from '@/types/budgets'

interface BudgetTypeSelectorProps {
  value: BudgetType
  onChange: (value: BudgetType) => void
}

export default function BudgetTypeSelector({ value, onChange }: BudgetTypeSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Tipo de presupuesto">
      {BUDGET_TYPE_OPTIONS.map((opt) => {
        const Icon = opt.icon
        const isSelected = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(opt.value)}
            className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
              isSelected
                ? 'border-violet-500 dark:border-violet-400 bg-violet-50 dark:bg-violet-500/10 shadow-md shadow-violet-500/10'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
            }`}
          >
            <div className={`p-2 rounded-lg transition-colors ${
              isSelected ? 'bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="text-center">
              <p className={`text-sm font-semibold ${isSelected ? 'text-violet-700 dark:text-violet-300' : 'text-gray-700 dark:text-gray-300'}`}>
                {opt.label}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">
                {opt.description}
              </p>
            </div>
            {isSelected && (
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}
