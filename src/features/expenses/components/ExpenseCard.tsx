import { useNavigate } from 'react-router-dom'
import { cn, formatCurrency } from '@/lib/utils'
import PriorityBadge from './PriorityBadge'
import type { ExpenseResponse } from '@/types/expenses'

interface Props {
  expense: ExpenseResponse
  className?: string
  selected?: boolean
  onSelect?: (id: string) => void
}

export default function ExpenseCard({ expense, className, selected, onSelect }: Props) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/expenses/${expense.id}`)}
      className={cn(
        'group relative cursor-pointer rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl',
        'border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-xl',
        'transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 overflow-hidden',
        selected && 'ring-2 ring-primary-500',
        className,
      )}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-400 to-red-600 transition-all duration-300 group-hover:w-1.5" />

      <div className="p-4 pl-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {expense.description}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {expense.effective_date
                ? new Date(expense.effective_date).toLocaleDateString('es-DO', { day: 'numeric', month: 'short', year: 'numeric' })
                : 'Sin fecha'}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {onSelect && (
              <input
                type="checkbox"
                checked={selected}
                onChange={() => onSelect(expense.id)}
                onClick={(e) => e.stopPropagation()}
                className="rounded border-gray-300"
              />
            )}
            <PriorityBadge priority={expense.priority} size="sm" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0 flex-wrap">
            {expense.category_id && (
              <span className="inline-flex items-center rounded-full bg-red-100 dark:bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-600 dark:text-red-400">
                Categoria
              </span>
            )}
            {expense.tags && expense.tags.length > 0 && (
              <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700/50 px-2 py-0.5 text-[10px] font-medium text-gray-500 dark:text-gray-400">
                {expense.tags.length} tags
              </span>
            )}
            {expense.service_id && <span className="text-[10px] text-amber-500 font-medium">Servicio</span>}
            {expense.subscription_id && <span className="text-[10px] text-purple-500 font-medium">Suscripcion</span>}
          </div>
          <span className="text-base font-bold tabular-nums tracking-tight text-red-600 dark:text-red-400">
            -{formatCurrency(expense.amount, expense.currency_code)}
          </span>
        </div>
      </div>
    </div>
  )
}
