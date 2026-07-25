import { cn, formatCurrency } from '@/lib/utils'
import { CalendarDays, CheckCircle2, X } from 'lucide-react'
import { Button } from '@/components/ui'
import type { ScheduleResponse } from '@/types/incomes'

interface Props {
  schedule: ScheduleResponse
  className?: string
  onReceive?: (schedule: ScheduleResponse) => void
  onDelete?: (schedule: ScheduleResponse) => void
}

const STATUS_STYLES: Record<string, { color: string; label: string }> = {
  pending: { color: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/10', label: 'Pendiente' },
  received: { color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10', label: 'Recibido' },
  skipped: { color: 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-500/10', label: 'Saltado' },
  overdue: { color: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/10', label: 'Vencido' },
}

export default function IncomeScheduleCard({ schedule, className, onReceive, onDelete }: Props) {
  const statusStyle = STATUS_STYLES[schedule.status] || STATUS_STYLES.pending
  const isOverdue = schedule.status === 'overdue' || (schedule.status === 'pending' && new Date(schedule.expected_date) < new Date())

  return (
    <div
      className={cn(
        'group relative rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl',
        'border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-xl',
        'transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 overflow-hidden',
        isOverdue && 'border-red-200 dark:border-red-800/50',
        className,
      )}
    >
      <div className={cn(
        'absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b transition-all duration-300',
        isOverdue ? 'from-red-400 to-red-600' : 'from-blue-400 to-blue-600',
      )} />

      <div className="p-4 pl-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="rounded-lg bg-blue-100 dark:bg-blue-500/10 p-2">
              <CalendarDays className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{schedule.description}</p>
              <p className="text-xs text-gray-400">
                {new Date(schedule.expected_date).toLocaleDateString('es-DO', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium', statusStyle.color)}>
              {statusStyle.label}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3">
            {schedule.frequency && (
              <span className="text-[11px] font-medium text-gray-400 capitalize">{schedule.frequency}</span>
            )}
            {schedule.income_source_id && (
              <span className="text-[11px] text-gray-400">Con fuente</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {schedule.status !== 'received' && onReceive && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReceive(schedule)}
                className="text-emerald-600 hover:text-emerald-700"
              >
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Recibir
              </Button>
            )}
            {onDelete && (
              <Button variant="ghost" size="sm" onClick={() => onDelete(schedule)} className="text-red-500">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700/50">
          <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(schedule.amount, schedule.currency_code)}
          </span>
          {schedule.confidence_score && (
            <span className="ml-2 text-[11px] text-gray-400">
              Confianza: {parseFloat(schedule.confidence_score).toFixed(0)}%
            </span>
          )}
        </div>
      </div>

      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/5 dark:ring-white/5 pointer-events-none" />
    </div>
  )
}
