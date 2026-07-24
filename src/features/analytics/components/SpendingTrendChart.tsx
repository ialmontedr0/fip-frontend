import { Bar } from 'recharts'
import type { TrendResponse } from '@/types/analytics'
import { Skeleton } from '@/components/ui'
import { ErrorMessage } from '@/components/ui'
import FIPBarChart from '@/components/charts/BarChart'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface Props {
  spendingTrend: TrendResponse | undefined
  loading: boolean
  error: boolean
}

function TrendSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
      <Skeleton className="mb-4 h-5 w-36" />
      <Skeleton variant="rectangular" className="h-[280px] w-full rounded-xl" />
    </div>
  )
}

export default function SpendingTrendChart({ spendingTrend, loading, error }: Props) {
  if (loading) return <TrendSkeleton />
  if (error) {
    return (
      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <ErrorMessage message="No se pudo cargar la tendencia" />
      </div>
    )
  }
  if (!spendingTrend || spendingTrend.data.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <div className="flex h-[280px] items-center justify-center text-sm text-gray-400">
          Sin datos de tendencia
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      'group relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800',
      'bg-white dark:bg-gray-900 p-6 shadow-sm transition-all duration-300',
      'hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-700',
    )}>
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-400 via-red-400 to-orange-400" />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Tendencia de Gastos
          </h3>
          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
            {spendingTrend.period} · {spendingTrend.data.length} periodos
          </p>
        </div>

        {spendingTrend.summary && (
          <div className="flex gap-3">
            <div className="rounded-lg bg-gray-50 px-2.5 py-1.5 text-right dark:bg-gray-800/50">
              <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Total</p>
              <p className="text-xs font-bold text-gray-900 dark:text-gray-100 tabular-nums">
                {formatCurrency(spendingTrend.summary.total_spent ?? 0)}
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 px-2.5 py-1.5 text-right dark:bg-gray-800/50">
              <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Promedio</p>
              <p className="text-xs font-bold text-gray-900 dark:text-gray-100 tabular-nums">
                {formatCurrency(spendingTrend.summary.average)}
              </p>
            </div>
          </div>
        )}
      </div>

      <FIPBarChart
        data={spendingTrend.data as unknown as Array<Record<string, unknown>>}
        xKey="period"
        height={280}
        barSize={24}
        showGrid
      >
        <Bar
          dataKey="total"
          radius={[4, 4, 0, 0]}
          fill="url(#spending-gradient)"
        />
      </FIPBarChart>

      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <linearGradient id="spending-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
