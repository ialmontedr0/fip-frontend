import { useState } from 'react'
import { FileText, Trash2, Coins } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import type { InsurancePolicy } from '@/types/insurance'

interface PolicyCardProps {
  policy: InsurancePolicy
  onDelete?: () => void
  index?: number
}

export default function PolicyCard({ policy, onDelete, index = 0 }: PolicyCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={cn(
        'group relative bg-white dark:bg-gray-800/80 rounded-2xl border shadow-sm overflow-hidden transition-all duration-300',
        'opacity-0 animate-fade-in',
        isHovered ? 'border-gray-300 dark:border-gray-600 shadow-md' : 'border-gray-100 dark:border-gray-700/50',
      )}
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative p-5 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/10">
              <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{policy.name}</h3>
              {policy.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{policy.description}</p>
              )}
            </div>
          </div>
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
              title="Eliminar"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>

        {policy.coverage_details && (
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{policy.coverage_details}</p>
        )}

        {policy.deductible !== null && policy.deductible !== undefined && (
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 dark:bg-gray-700/50 px-2.5 py-1 text-xs font-medium text-gray-600 dark:text-gray-300">
            <Coins className="h-3 w-3" />
            Deducible: {formatCurrency(policy.deductible)}
          </div>
        )}
      </div>
    </div>
  )
}
