import { cn, formatCurrency } from '@/lib/utils'
import { Button, Card, CardContent } from '@/components/ui'
import { Repeat, CalendarPlus, X } from 'lucide-react'
import type { RecurringCandidatesResponse } from '@/types/incomes'

interface Props {
  data?: RecurringCandidatesResponse
  className?: string
  onCreateSchedule?: (candidate: RecurringCandidatesResponse['candidates'][0]) => void
  onDismiss?: (candidateId: string) => void
}

export default function RecurringCandidatesList({ data, className, onCreateSchedule, onDismiss }: Props) {
  if (!data) {
    return (
      <div className={cn('flex items-center justify-center h-48 text-sm text-gray-400', className)}>
        No hay datos de candidatos recurrentes
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="border-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl">
          <CardContent className="p-4">
            <p className="text-[11px] font-medium text-gray-400 uppercase">Total Candidatos</p>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{data.total_candidates}</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl">
          <CardContent className="p-4">
            <p className="text-[11px] font-medium text-gray-400 uppercase">Mensual Recurrente Est.</p>
            <p className="text-xl font-bold text-emerald-600">{formatCurrency(data.estimated_monthly_recurring)}</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl">
          <CardContent className="p-4">
            <p className="text-[11px] font-medium text-gray-400 uppercase">Patrones Mensuales</p>
            <p className="text-xl font-bold text-blue-600">{data.monthly_like_count}</p>
          </CardContent>
        </Card>
      </div>

      {(!data.candidates || data.candidates.length === 0) && (
        <div className="flex flex-col items-center justify-center py-12 text-sm text-gray-400">
          <Repeat className="h-10 w-10 mb-2 text-gray-300" />
          No se detectaron patrones recurrentes
        </div>
      )}

      {data.candidates?.map((candidate) => (
        <div
          key={candidate.id}
          className="rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="rounded-lg bg-purple-100 dark:bg-purple-500/10 p-2">
                <Repeat className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{candidate.description}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {candidate.occurrences} ocurrencias | {candidate.frequency} | Ultimo: {new Date(candidate.last_occurrence).toLocaleDateString('es-DO')}
                </p>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-bold text-emerald-600">{formatCurrency(candidate.amount)}</p>
            </div>
          </div>

          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all"
                  style={{ width: `${Math.min(candidate.confidence * 100, 100)}%` }}
                />
              </div>
              <span className="text-xs font-medium text-gray-500">{(candidate.confidence * 100).toFixed(0)}%</span>
            </div>

            <div className="flex items-center gap-2">
              <span className={cn(
                'text-[10px] font-medium px-2 py-0.5 rounded-full',
                candidate.suggestion === 'create_recurring' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' :
                candidate.suggestion === 'schedule' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' :
                'bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400',
              )}>
                {candidate.suggestion === 'create_recurring' ? 'Crear Recurrente' :
                 candidate.suggestion === 'schedule' ? 'Programar' : 'Ignorar'}
              </span>
            </div>

            <div className="flex gap-2 pt-1">
              {onCreateSchedule && (
                <Button variant="outline" size="sm" onClick={() => onCreateSchedule(candidate)} className="rounded-lg text-xs">
                  <CalendarPlus className="h-3.5 w-3.5 mr-1" />
                  Crear Schedule
                </Button>
              )}
              {onDismiss && (
                <Button variant="ghost" size="sm" onClick={() => onDismiss(candidate.id)} className="rounded-lg text-xs text-gray-400">
                  <X className="h-3.5 w-3.5 mr-1" />
                  Ignorar
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
