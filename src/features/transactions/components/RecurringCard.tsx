import { useNavigate } from 'react-router-dom'
import { cn, formatCurrency } from '@/lib/utils'
import {
  Repeat, Calendar, Clock, Activity,
  ToggleLeft, ToggleRight, Edit3, Trash2,
} from 'lucide-react'
import type { RecurringListItem } from '@/types/transactions'
import { TRANSACTION_TYPE_CONFIG, RECURRING_FREQUENCY_CONFIG } from '../constants'

interface Props {
  recurring: RecurringListItem
  onToggleActive?: (id: string, isActive: boolean) => void
  onDelete?: (id: string) => void
  className?: string
}

export default function RecurringCard({ recurring, onToggleActive, onDelete, className }: Props) {
  const navigate = useNavigate()
  const typeConfig = TRANSACTION_TYPE_CONFIG[recurring.transaction_type as keyof typeof TRANSACTION_TYPE_CONFIG]
  const freqConfig = RECURRING_FREQUENCY_CONFIG[recurring.frequency as keyof typeof RECURRING_FREQUENCY_CONFIG]
  const amount = parseFloat(recurring.amount)
  const isNegative = recurring.transaction_type === 'expense'

  return (
    <div
      className={cn(
        'group relative rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl',
        'border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-xl',
        'transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 overflow-hidden',
        !recurring.is_active && 'opacity-60',
        className,
      )}
    >
      <div className={cn(
        'absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b transition-all duration-300 group-hover:w-1.5',
        typeConfig?.gradient || 'from-gray-400 to-gray-600',
      )} />

      <div className="p-4 pl-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className={cn(
              'flex h-10 w-10 items-center justify-center rounded-xl',
              typeConfig?.bgColor || 'bg-gray-100 dark:bg-gray-700',
            )}>
              {typeConfig && <typeConfig.icon className={cn('h-5 w-5', typeConfig.color)} />}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                {recurring.description}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1 mt-0.5">
                <span className={cn('font-medium', typeConfig?.color)}>
                  {isNegative ? '−' : '+'}{formatCurrency(amount, recurring.currency_code)}
                </span>
                <span className="mx-1">·</span>
                Cada {recurring.interval > 1 ? `${recurring.interval} ` : ''}{freqConfig?.label?.toLowerCase() || recurring.frequency}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <span className={cn(
              'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium',
              recurring.is_active
                ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
            )}>
              <Activity className={cn('h-3 w-3', recurring.is_active ? 'text-emerald-500' : 'text-gray-400')} />
              {recurring.is_active ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="h-3.5 w-3.5" />
            <span>Inicio: {new Date(recurring.start_date).toLocaleDateString('es-DO', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Clock className="h-3.5 w-3.5" />
            <span>Proxima: {new Date(recurring.next_execution_date).toLocaleDateString('es-DO', { day: '2-digit', month: 'short' })}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Repeat className="h-3.5 w-3.5" />
            <span>Ejecutado: {recurring.execution_count}{recurring.max_executions ? ` / ${recurring.max_executions}` : ''}</span>
          </div>
          {recurring.last_executed_at && (
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Activity className="h-3.5 w-3.5" />
              <span>Ultima: {new Date(recurring.last_executed_at).toLocaleDateString('es-DO', { day: '2-digit', month: 'short' })}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50">
          <div className="flex gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); navigate(`/transactions/recurring/${recurring.id}`) }}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete?.(recurring.id) }}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); onToggleActive?.(recurring.id, !recurring.is_active) }}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all',
              recurring.is_active
                ? 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10'
                : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10',
            )}
          >
            {recurring.is_active ? <ToggleLeft className="h-4 w-4" /> : <ToggleRight className="h-4 w-4" />}
            {recurring.is_active ? 'Desactivar' : 'Activar'}
          </button>
        </div>
      </div>

      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/5 dark:ring-white/5 pointer-events-none" />
    </div>
  )
}
