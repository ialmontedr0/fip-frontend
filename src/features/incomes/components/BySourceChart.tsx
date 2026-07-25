import { cn, formatCurrency } from '@/lib/utils'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { CHART_COLORS } from '../constants'
import type { IncomeBySourceResponse } from '@/types/incomes'

interface Props {
  data?: IncomeBySourceResponse
  className?: string
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border bg-white/90 px-3 py-2 shadow-lg backdrop-blur-xl dark:border-gray-700 dark:bg-gray-800/90">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-bold text-primary-600">{formatCurrency(payload[0].value)}</p>
    </div>
  )
}

export default function BySourceChart({ data, className }: Props) {
  const chartData = data?.by_source?.map((s) => ({
    name: s.source_name,
    total: parseFloat(s.total),
    percentage: s.percentage,
  })) || []

  if (!chartData.length) {
    return (
      <div className={cn('flex items-center justify-center h-64 text-sm text-gray-400', className)}>
        No hay datos por fuente
      </div>
    )
  }

  return (
    <div className={cn('rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 p-6', className)}>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Ingresos por Fuente</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} className="text-xs text-gray-400" />
          <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={100} className="text-xs text-gray-400" />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="total" fill={CHART_COLORS.primary} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
