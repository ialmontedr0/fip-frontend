import { useNavigate } from 'react-router-dom'
import { cn, formatCurrency } from '@/lib/utils'
import IncomeTypeBadge from './IncomeTypeBadge'
import IncomeStatusBadge from './IncomeStatusBadge'
import StabilityBadge from './StabilityBadge'
import type { IncomeResponse } from '@/types/incomes'

interface Props {
  income: IncomeResponse
  className?: string
  style?: React.CSSProperties
  selected?: boolean
  onSelect?: (id: string) => void
}

export default function IncomeCard({ income, className, style, selected, onSelect }: Props) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/incomes/${income.id}`)}
      className={cn(
        'group relative cursor-pointer rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl',
        'border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-xl',
        'transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 overflow-hidden',
        selected && 'ring-2 ring-primary-500',
        className,
      )}
      style={style}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-emerald-600 transition-all duration-300 group-hover:w-1.5" />

      <div className="p-4 pl-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {income.description}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {income.effective_date ? new Date(income.effective_date).toLocaleDateString('es-DO', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Sin fecha'}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {onSelect && (
              <input
                type="checkbox"
                checked={selected}
                onChange={() => onSelect(income.id)}
                onClick={(e) => e.stopPropagation()}
                className="rounded border-gray-300"
              />
            )}
            <IncomeStatusBadge status={income.income_status} size="sm" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0 flex-wrap">
            <IncomeTypeBadge type={income.income_type} size="sm" />
            <StabilityBadge stability={income.stability} size="sm" />
            {income.tags && income.tags.length > 0 && (
              <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700/50 px-2 py-0.5 text-[10px] font-medium text-gray-500 dark:text-gray-400">
                {income.tags.length} tags
              </span>
            )}
          </div>
          <span className="text-base font-bold tabular-nums tracking-tight text-emerald-600 dark:text-emerald-400">
            +{formatCurrency(income.amount, income.currency_code)}
          </span>
        </div>
      </div>

      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/5 dark:ring-white/5 pointer-events-none" />
    </div>
  )
}
