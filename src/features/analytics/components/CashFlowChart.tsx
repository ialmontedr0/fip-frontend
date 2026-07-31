import { Area } from 'recharts'
import type { CashFlowResponse } from '@/types/analytics'
import { Skeleton } from '@/components/ui'
import { ErrorMessage } from '@/components/ui'
import FIPAreaChart from '@/components/charts/AreaChart'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface Props {
  cashFlow: CashFlowResponse | undefined
  loading: boolean
  error: boolean
}

function CashFlowChartSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
      <Skeleton className="mb-4 h-5 w-36" />
      <Skeleton variant="rectangular" className="h-[300px] w-full rounded-xl" />
    </div>
  )
}

export default function CashFlowChart({ cashFlow, loading, error }: Props) {
  if (loading) return <CashFlowChartSkeleton />
  if (error) {
    return (
      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <ErrorMessage message="No se pudo cargar el flujo de caja" />
      </div>
    )
  }
  if (!cashFlow || cashFlow.data.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <div className="flex h-[300px] items-center justify-center text-sm text-gray-400">
          Sin datos de flujo de caja
        </div>
      </div>
    )
  }

  const isPositive = cashFlow.summary.net_flow >= 0

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800',
        'bg-white dark:bg-gray-900 p-6 shadow-sm transition-all duration-300',
        'hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-700',
      )}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-green-400 via-primary-400 to-blue-400" />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Flujo de Caja
            </h3>
          </div>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            {cashFlow.start} — {cashFlow.end}
          </p>
        </div>

        <div className={cn(
          'rounded-xl px-3 py-1.5 text-right',
          isPositive ? 'bg-green-50 dark:bg-green-500/10' : 'bg-red-50 dark:bg-red-500/10',
        )}>
          <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Flujo Neto
          </p>
          <p className={cn(
            'text-sm font-bold',
            isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
          )}>
            {formatCurrency(cashFlow.summary.net_flow)}
          </p>
        </div>
      </div>

      <div className="mb-4 flex gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-[#22c55e] shadow-[0_0_6px_rgba(34,197,94,0.4)]" />
          <span className="font-medium text-gray-500 dark:text-gray-400">Ingresos (verde)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-[#ef4444] shadow-[0_0_6px_rgba(239,68,68,0.4)]" />
          <span className="font-medium text-gray-500 dark:text-gray-400">Gastos (rojo)</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e] ring-2 ring-white dark:ring-gray-900" />
          <span className="font-medium text-gray-500 dark:text-gray-400">Puntos: valor mensual</span>
        </div>
      </div>

      <FIPAreaChart data={cashFlow.data as unknown as Array<Record<string, unknown>>} xKey="month" height={280} showGrid>
        <Area
          type="monotone"
          dataKey="income"
          stroke="#22c55e"
          strokeWidth={2.5}
          fill="url(#gradient-#22c55e)"
          name="Ingresos"
          dot={{ r: 3.5, fill: '#22c55e', strokeWidth: 0 }}
          activeDot={{ r: 6, fill: '#22c55e', strokeWidth: 2, stroke: '#ffffff' }}
        />
        <Area
          type="monotone"
          dataKey="expenses"
          stroke="#ef4444"
          strokeWidth={2.5}
          fill="url(#gradient-#ef4444)"
          name="Gastos"
          dot={{ r: 3.5, fill: '#ef4444', strokeWidth: 0 }}
          activeDot={{ r: 6, fill: '#ef4444', strokeWidth: 2, stroke: '#ffffff' }}
        />
      </FIPAreaChart>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: 'Total Ingresos', value: cashFlow.summary.total_income, color: 'text-green-600 dark:text-green-400' },
          { label: 'Total Gastos', value: cashFlow.summary.total_expenses, color: 'text-red-600 dark:text-red-400' },
          { label: 'Meses Positivos', value: cashFlow.summary.positive_months, color: 'text-gray-900 dark:text-gray-100', fmt: 'number' as const },
        ].map((item) => (
          <div key={item.label} className="rounded-xl bg-gray-50 px-3 py-2.5 dark:bg-gray-800/50">
            <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              {item.label}
            </p>
            <p className={cn('mt-0.5 text-sm font-bold tabular-nums', item.color)}>
              {item.fmt === 'number' ? item.value : formatCurrency(item.value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
