import { cn, formatCurrency, formatISODate } from '@/lib/utils'
import { Copy, Trash2, CheckCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui'
import type { DuplicatesResponse } from '@/types/expenses'

interface Props {
  group: DuplicatesResponse['duplicates'][0]
  onKeepOne: (keepId: string, deleteIds: string[]) => void
  onDeleteAll: (ids: string[]) => void
  className?: string
}

export default function DuplicateCard({ group, onKeepOne, onDeleteAll, className }: Props) {
  const totalAmount = parseFloat(group.amount || '0')

  return (
    <div className={cn(
      'rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl',
      'border border-amber-200/50 dark:border-amber-700/30 shadow-sm',
      'p-4',
      className,
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-500/10">
            <Copy className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Posibles duplicados
            </p>
            <p className="text-[11px] text-gray-400">
              {group.description} · {formatCurrency(totalAmount)}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-amber-100 dark:bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-400">
          Duplicado ({group.count})
        </span>
      </div>

      <div className="space-y-2 mb-3">
        <div className="rounded-xl bg-gray-50 dark:bg-gray-700/30 p-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{group.description || 'Sin descripcion'}</p>
            <p className="text-[10px] text-gray-400">
              {formatISODate(group.effective_date)}
            </p>
          </div>
          <span className="text-xs font-semibold text-red-600 dark:text-red-400">
            {formatCurrency(group.amount)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-amber-100 dark:border-amber-700/20">
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <AlertTriangle className="h-3 w-3" />
          {group.count} ocurrencias
        </div>
        <div className="flex items-center gap-2">
          {group.count >= 2 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onKeepOne(group.id, [])}
              className="rounded-lg h-7 text-[10px] gap-1"
            >
              <CheckCircle className="h-3 w-3" />
              Mantener
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDeleteAll([group.id])}
            className="rounded-lg h-7 text-[10px] text-red-500 border-red-200 hover:bg-red-50 dark:border-red-700 dark:hover:bg-red-500/10 gap-1"
          >
            <Trash2 className="h-3 w-3" />
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  )
}
