import { DollarSign, Tag } from 'lucide-react'
import { useCategories } from '@/features/categories/hooks/useCategories'
import type { IncomeReceivedConditions } from '@/types/automations'

interface Props {
  value: IncomeReceivedConditions | null
  onChange: (conditions: IncomeReceivedConditions) => void
}

export default function IncomeReceivedCondition({ value, onChange }: Props) {
  const { data: categoriesData } = useCategories()

  return (
    <div className="space-y-4">
      <div className="group">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
          Monto mínimo
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
            <DollarSign className="h-3 w-3 text-white" />
          </div>
          <input
            type="number"
            min={0}
            step="0.01"
            value={value?.min_amount ?? ''}
            onChange={(e) => onChange({ ...value, min_amount: e.target.value ? Number(e.target.value) : undefined } as IncomeReceivedConditions)}
            placeholder="0.00"
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all"
          />
        </div>
      </div>
      <div className="group">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Categoría</label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 shadow-lg shadow-purple-500/20">
            <Tag className="h-3 w-3 text-white" />
          </div>
          <select
            value={value?.category_id ?? ''}
            onChange={(e) => onChange({ ...value, category_id: e.target.value || undefined } as IncomeReceivedConditions)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all appearance-none"
          >
            <option value="">Cualquier categoría</option>
            {categoriesData?.categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
