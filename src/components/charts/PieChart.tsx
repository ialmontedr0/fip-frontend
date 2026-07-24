import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { cn, formatCurrency } from '@/lib/utils'
interface PieChartData {
  name: string
  value: number
  color?: string
}

interface PieChartProps {
  data: PieChartData[]
  height?: number
  innerRadius?: number
  outerRadius?: number
  showLegend?: boolean
  className?: string
}

const DEFAULT_COLORS = [
  '#3b82f6', '#ef4444', '#22c55e', '#f59e0b',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316',
  '#06b6d4', '#84cc16', '#a855f7', '#e11d48',
]

function FIPPieChart({
  data,
  height = 300,
  innerRadius = 0,
  outerRadius = 80,
  showLegend = true,
  className,
}: PieChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-gray-400">
        Sin datos disponibles
      </div>
    )
  }

  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPie>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            dataKey="value"
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={entry.color ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            content={
              <CustomPieTooltip />
            }
          />
          {showLegend && (
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value: string) => (
                <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
              )}
            />
          )}
        </RechartsPie>
      </ResponsiveContainer>
    </div>
  )
}

function CustomPieTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) {
  if (!active || !payload || payload.length === 0) return null
  const entry = payload[0]

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{entry.name}</p>
      <p className="text-sm text-gray-600 dark:text-gray-300">{formatCurrency(entry.value)}</p>
    </div>
  )
}

export default FIPPieChart
