import { cn, formatCurrency } from '@/lib/utils'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { CHART_COLORS } from '../constants'
import type { IncomeTrendsResponse } from '@/types/incomes'

interface Props {
  data?: IncomeTrendsResponse
  className?: string
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border bg-white/90 px-3 py-2 shadow-lg backdrop-blur-xl dark:border-gray-700 dark:bg-gray-800/90">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(payload[0].value)}</p>
    </div>
  )
}

export default function TrendsChart({ data, className }: Props) {
  const chartData = data?.monthly_data?.map((m) => ({
    month: m.month,
    total: parseFloat(m.total),
    average: parseFloat(m.average),
  })) || []

  if (!chartData.length) {
    return (
      <div className={cn('flex items-center justify-center h-64 text-sm text-gray-400', className)}>
        No hay datos de tendencias disponibles
      </div>
    )
  }

  return (
    <div className={cn('rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 p-6', className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Tendencia de Ingresos</h3>
        {data && (
          <span className={cn(
            'text-xs font-medium px-2 py-0.5 rounded-full',
            data.trend === 'up' ? 'text-emerald-600 bg-emerald-100 dark:bg-emerald-500/10' :
            data.trend === 'down' ? 'text-red-600 bg-red-100 dark:bg-red-500/10' :
            'text-gray-600 bg-gray-100 dark:bg-gray-500/10',
          )}>
            {data.trend === 'up' ? '↑ Creciente' : data.trend === 'down' ? '↓ Decreciente' : '→ Estable'}
          </span>
        )}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11 }}
            tickFormatter={(val: unknown) => {
              const s = String(val)
              if (!s.includes('-')) return s
              const [y, m] = s.split('-')
              const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
              return `${months[parseInt(m) - 1]} ${y.slice(2)}`
            }}
            className="text-xs text-gray-400"
          />
          <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} className="text-xs text-gray-400" />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="total"
            stroke={CHART_COLORS.income}
            strokeWidth={2}
            dot={{ fill: CHART_COLORS.income, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
