import { cn, formatCurrency } from '@/lib/utils'
import IncomeTypeBadge from './IncomeTypeBadge'
import StabilityBadge from './StabilityBadge'
import { Edit3, Trash2, Plus, Building2 } from 'lucide-react'
import { Button } from '@/components/ui'
import type { SourceResponse } from '@/types/incomes'

interface Props {
  source: SourceResponse
  className?: string
  onEdit?: (source: SourceResponse) => void
  onDelete?: (source: SourceResponse) => void
  onCreateIncome?: (source: SourceResponse) => void
}

export default function IncomeSourceCard({ source, className, onEdit, onDelete, onCreateIncome }: Props) {

  return (
    <div
      className={cn(
        'group relative rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl',
        'border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-xl',
        'transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 overflow-hidden',
        className,
      )}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 to-purple-600" />

      <div className="p-4 pl-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="rounded-lg bg-purple-100 dark:bg-purple-500/10 p-2">
              <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{source.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <IncomeTypeBadge type={source.income_type} size="sm" />
                <StabilityBadge stability={source.stability} size="sm" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            {onCreateIncome && (
              <Button variant="ghost" size="sm" onClick={() => onCreateIncome(source)} className="text-emerald-600">
                <Plus className="h-4 w-4" />
              </Button>
            )}
            {onEdit && (
              <Button variant="ghost" size="sm" onClick={() => onEdit(source)}>
                <Edit3 className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button variant="ghost" size="sm" onClick={() => onDelete(source)} className="text-red-500">
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] font-medium text-gray-400 uppercase">Total Recibido</p>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(source.total_received)}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-medium text-gray-400 uppercase">Ingresos</p>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{source.income_count}</p>
          </div>
          <div>
            <p className="text-[10px] font-medium text-gray-400 uppercase">Ultimo</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {source.last_received_at ? new Date(source.last_received_at).toLocaleDateString('es-DO') : 'Nunca'}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-medium text-gray-400 uppercase">Estado</p>
            <span className={cn(
              'inline-flex items-center gap-1 text-xs font-medium',
              source.is_active ? 'text-emerald-600' : 'text-gray-400',
            )}>
              <span className={cn('h-1.5 w-1.5 rounded-full', source.is_active ? 'bg-emerald-500' : 'bg-gray-400')} />
              {source.is_active ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/5 dark:ring-white/5 pointer-events-none" />
    </div>
  )
}
