import { cn, formatCurrency } from '@/lib/utils'
import { Plus, Sparkles, Calendar } from 'lucide-react'
import { Button } from '@/components/ui'
import type { RecurringCandidatesResponse } from '@/types/expenses'

type Candidate = RecurringCandidatesResponse['candidates'][0]

interface Props {
  candidate: Candidate
  onCreateAsService: (candidate: Candidate) => void
  onDismiss: (id: string) => void
  className?: string
}

export default function RecurringCandidateCard({ candidate, onCreateAsService, onDismiss, className }: Props) {
  const candidateId = candidate.id || 'unknown'

  return (
    <div className={cn(
      'rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl',
      'border border-indigo-200/50 dark:border-indigo-700/30 shadow-sm',
      'p-4 transition-all duration-300 hover:shadow-md',
      className,
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-500/10">
            <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{candidate.description || 'Gasto recurrente'}</p>
            <p className="text-[11px] text-gray-400">
              {candidate.occurrences} ocurrencia(s) en promedio cada {candidate.avg_frequency_days} dias
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="rounded-lg bg-gray-50 dark:bg-gray-700/30 px-3 py-2">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Frecuencia Promedio</p>
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Cada {candidate.avg_frequency_days} dias</p>
        </div>
        <div className="rounded-lg bg-gray-50 dark:bg-gray-700/30 px-3 py-2">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Monto</p>
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{formatCurrency(candidate.amount)}</p>
        </div>
        <div className="rounded-lg bg-gray-50 dark:bg-gray-700/30 px-3 py-2">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Ocurrencias</p>
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{candidate.occurrences} veces</p>
        </div>
        <div className="rounded-lg bg-gray-50 dark:bg-gray-700/30 px-3 py-2">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Mensual</p>
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{candidate.is_monthly_like ? 'Si' : 'No'}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-indigo-100 dark:border-indigo-700/20">
        <div className="flex items-center gap-1 text-[10px] text-gray-400">
          <Calendar className="h-3 w-3" />
          Sugerencia automatica
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDismiss(candidateId)}
            className="rounded-lg h-7 text-[10px]"
          >
            Descartar
          </Button>
          <Button
            size="sm"
            onClick={() => onCreateAsService(candidate)}
            className="rounded-lg h-7 text-[10px] gap-1"
          >
            <Plus className="h-3 w-3" />
            Crear Servicio
          </Button>
        </div>
      </div>
    </div>
  )
}
