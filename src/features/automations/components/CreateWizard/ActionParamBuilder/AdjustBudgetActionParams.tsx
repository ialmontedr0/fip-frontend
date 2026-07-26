import { SlidersHorizontal, Target, TrendingUp, TrendingDown, Percent, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useBudgets } from '@/features/budgets/hooks/useBudgets'
import type { AdjustBudgetActionParams, AdjustmentType } from '@/types/automations'

interface Props {
  value: AdjustBudgetActionParams | null
  onChange: (params: AdjustBudgetActionParams) => void
}

const adjustmentOptions: { value: AdjustmentType; label: string; icon: typeof Target }[] = [
  { value: 'set', label: 'Establecer', icon: Target },
  { value: 'increase', label: 'Incrementar', icon: TrendingUp },
  { value: 'decrease', label: 'Disminuir', icon: TrendingDown },
  { value: 'percentage', label: 'Porcentaje', icon: Percent },
]

export default function AdjustBudgetActionParams({ value, onChange }: Props) {
  const { data: budgetsData } = useBudgets()
  const adjType = value?.adjustment_type ?? 'set'

  return (
    <div className="space-y-4">
      <div className="group">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Presupuesto</label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 shadow-lg shadow-purple-500/20">
            <SlidersHorizontal className="h-3 w-3 text-white" />
          </div>
          <select
            value={value?.budget_id ?? ''}
            onChange={(e) => onChange({ ...value, budget_id: e.target.value } as AdjustBudgetActionParams)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all appearance-none"
          >
            <option value="">Seleccionar presupuesto...</option>
            {budgetsData?.budgets?.map((budget) => (
              <option key={budget.id} value={budget.id}>{budget.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Tipo de ajuste</label>
        <div className="grid grid-cols-2 gap-2">
          {adjustmentOptions.map((opt) => {
            const Icon = opt.icon
            const isActive = adjType === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ ...value, adjustment_type: opt.value } as AdjustBudgetActionParams)}
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95',
                  isActive
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-white/80 dark:bg-gray-800/80 border border-gray-100/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400 hover:border-purple-200/50 dark:hover:border-purple-500/30',
                )}
              >
                <Icon className={cn('h-4 w-4', isActive ? 'text-white' : 'text-gray-400')} />
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>
      <div className="group">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
          {adjType === 'percentage' ? 'Porcentaje' : 'Monto objetivo'}
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-lg bg-gradient-to-br from-violet-400 to-violet-600 shadow-lg shadow-violet-500/20">
            {adjType === 'percentage' ? <Percent className="h-3 w-3 text-white" /> : <DollarSign className="h-3 w-3 text-white" />}
          </div>
          <input
            type="number"
            min={0}
            step="0.01"
            value={value?.target_amount ?? ''}
            onChange={(e) => onChange({ ...value, target_amount: Number(e.target.value) } as AdjustBudgetActionParams)}
            placeholder="0.00"
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all"
          />
        </div>
      </div>
    </div>
  )
}
