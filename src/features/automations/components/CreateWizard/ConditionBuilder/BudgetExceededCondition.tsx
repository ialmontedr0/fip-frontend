import { PieChart, AlertTriangle } from 'lucide-react'
import { useBudgets } from '@/features/budgets/hooks/useBudgets'
import type { BudgetExceededConditions } from '@/types/automations'

interface Props {
  value: BudgetExceededConditions | null
  onChange: (conditions: BudgetExceededConditions) => void
}

export default function BudgetExceededCondition({ value, onChange }: Props) {
  const { data: budgetsData } = useBudgets()
  const pct = value?.threshold_pct ?? 80

  return (
    <div className="space-y-4">
      <div className="group">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Presupuesto</label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/20">
            <PieChart className="h-3 w-3 text-white" />
          </div>
          <select
            value={value?.budget_id ?? ''}
            onChange={(e) => onChange({ ...value, budget_id: e.target.value } as BudgetExceededConditions)}
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
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Umbral
          </label>
          <div className="flex items-center gap-1.5">
            {pct >= 80 && <AlertTriangle className="h-3 w-3 text-amber-400" />}
            <span className="text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
              {pct}%
            </span>
          </div>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={pct}
          onChange={(e) => onChange({ ...value, threshold_pct: Number(e.target.value) } as BudgetExceededConditions)}
          className="w-full h-2 rounded-full appearance-none cursor-pointer accent-amber-500 bg-gray-200 dark:bg-gray-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-amber-400 [&::-webkit-slider-thumb]:to-orange-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-amber-500/30"
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  )
}
