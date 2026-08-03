import { useState } from 'react'
import { ReceiptText, Pencil, Trash2, Calendar } from 'lucide-react'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import CategoryBadge from './CategoryBadge'
import type { TaxDeduction } from '@/types/taxes'

interface DeductionCardProps {
  deduction: TaxDeduction
  onEdit?: () => void
  onDelete?: () => void
  index?: number
}

export default function DeductionCard({ deduction, onEdit, onDelete, index = 0 }: DeductionCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={cn(
        'group relative bg-white dark:bg-gray-800/80 rounded-2xl border shadow-sm overflow-hidden transition-all duration-500',
        'opacity-0 animate-fade-in',
        isHovered ? 'border-gray-300 dark:border-gray-600 -translate-y-0.5 shadow-md' : 'border-gray-100 dark:border-gray-700/50',
      )}
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-500/10">
              <ReceiptText className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                {deduction.description}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {formatDate(deduction.date, 'long')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                title="Editar"
              >
                <Pencil className="h-4 w-4" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                title="Eliminar"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <CategoryBadge name={deduction.category_name} />
            <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="h-3 w-3" />
              {deduction.tax_year}
            </span>
          </div>
          <div className="text-right shrink-0 ml-2">
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {formatCurrency(deduction.amount)}
            </p>
            {deduction.deductible !== null && deduction.deductible !== undefined && (
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Deducible: {formatCurrency(deduction.deductible)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
