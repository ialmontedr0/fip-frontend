import { cn, formatCurrency } from '@/lib/utils'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { CHART_COLORS } from '../constants'
import type { ExpenseDashboardResponse } from '@/types/expenses'

interface Props {
  data?: ExpenseDashboardResponse['daily_trend']
  className?: string
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border bg-white/90 px-3 py-2 shadow-lg backdrop-blur-xl dark:border-gray-700 dark:bg-gray-800/90">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-bold text-rose-600 dark:text-rose-400">{formatCurrency(payload[0].value)}</p>
    </div>
  )
}

export default function DailyTrendChart({ data, className }: Props) {
  const chartData = data?.map((d) => ({
    date: d.date,
    total: parseFloat(d.total),
    count: d.count,
  })) || []

  if (!chartData.length) {
    return (
      <div className={cn('flex items-center justify-center h-64 text-sm text-gray-400', className)}>
        No hay datos de gastos diarios disponibles
      </div>
    )
  }

  return (
    <div className={cn('rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 p-6', className)}>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Gastos Diarios</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS.expense} stopOpacity={0.3} />
              <stop offset="95%" stopColor={CHART_COLORS.expense} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11 }}
            tickFormatter={(val: string) => {
              const d = new Date(val)
              return d.toLocaleDateString('es-DO', { day: 'numeric', month: 'short' })
            }}
            className="text-xs text-gray-400"
          />
          <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} className="text-xs text-gray-400" />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="total"
            stroke={CHART_COLORS.expense}
            strokeWidth={2}
            fill="url(#expenseGradient)"
            dot={{ fill: CHART_COLORS.expense, r: 3 }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
