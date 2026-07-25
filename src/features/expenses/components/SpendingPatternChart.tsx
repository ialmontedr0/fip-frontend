import { cn, formatCurrency } from '@/lib/utils'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { CHART_COLORS } from '../constants'

interface Props {
  data?: Array<{ day_of_week: string; total: string; count: number }>
  className?: string
}

const DAY_LABELS: Record<string, string> = {
  '0': 'Domingo', '1': 'Lunes', '2': 'Martes', '3': 'Miercoles',
  '4': 'Jueves', '5': 'Viernes', '6': 'Sabado',
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: { day: string } }> }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border bg-white/90 px-3 py-2 shadow-lg backdrop-blur-xl dark:border-gray-700 dark:bg-gray-800/90">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{DAY_LABELS[payload[0].payload.day] || payload[0].payload.day}</p>
      <p className="text-sm font-bold text-rose-600 dark:text-rose-400">{formatCurrency(payload[0].value)}</p>
    </div>
  )
}

export default function SpendingPatternChart({ data, className }: Props) {
  const chartData = data?.map((d) => ({
    day: DAY_LABELS[d.day_of_week] || d.day_of_week,
    total: parseFloat(d.total),
    count: d.count,
    fullDay: d.day_of_week,
  })) || []

  if (!chartData.length) {
    return (
      <div className={cn('flex items-center justify-center h-64 text-sm text-gray-400', className)}>
        No hay patrones de gasto disponibles
      </div>
    )
  }

  return (
    <div className={cn('rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 p-6', className)}>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Patron de gasto semanal</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={chartData}>
          <PolarGrid className="stroke-gray-200 dark:stroke-gray-700" />
          <PolarAngleAxis
            dataKey="day"
            tick={{ fontSize: 11 }}
            className="text-xs text-gray-500"
          />
          <PolarRadiusAxis
            tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
            tick={{ fontSize: 10 }}
            className="text-xs text-gray-400"
          />
          <Tooltip content={<CustomTooltip />} />
          <Radar
            name="Gastos"
            dataKey="total"
            stroke={CHART_COLORS.expense}
            fill={CHART_COLORS.expense}
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
