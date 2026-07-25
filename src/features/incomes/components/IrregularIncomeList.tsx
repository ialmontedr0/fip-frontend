import { cn, formatCurrency } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui'
import { AlertTriangle, TrendingUp } from 'lucide-react'
import type { IrregularIncomeResponse } from '@/types/incomes'

interface Props {
  data?: IrregularIncomeResponse
  className?: string
}

export default function IrregularIncomeList({ data, className }: Props) {
  if (!data) {
    return (
      <div className={cn('flex items-center justify-center h-48 text-sm text-gray-400', className)}>
        No hay datos de ingresos irregulares
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Card className="border-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl">
          <CardContent className="p-4">
            <p className="text-[11px] font-medium text-gray-400 uppercase">Irregularidades Detectadas</p>
            <p className="text-xl font-bold text-red-600">{data.irregularity_count}</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl">
          <CardContent className="p-4">
            <p className="text-[11px] font-medium text-gray-400 uppercase">Periodo Analizado</p>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{data.period_months} meses</p>
          </CardContent>
        </Card>
      </div>

      {(!data.irregularities || data.irregularities.length === 0) && (
        <div className="flex flex-col items-center justify-center py-12 text-sm text-gray-400">
          <TrendingUp className="h-10 w-10 mb-2 text-gray-300" />
          No se identificaron ingresos irregulares
        </div>
      )}

      {data.irregularities?.map((item) => (
        <div
          key={item.id}
          className="rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-red-200/50 dark:border-red-800/50 p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="rounded-lg bg-red-100 dark:bg-red-500/10 p-2">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.description}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(item.effective_date).toLocaleDateString('es-DO', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-bold text-red-600">{formatCurrency(item.amount)}</p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <div className={cn(
              'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
              Math.abs(item.deviation) > 50 ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' :
              Math.abs(item.deviation) > 25 ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' :
              'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
            )}>
              <TrendingUp className="h-3 w-3" />
              {(item.deviation * 100).toFixed(0)}% del promedio
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">{item.reason}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
