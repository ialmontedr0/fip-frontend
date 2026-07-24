import {
  LineChart as RechartsLine,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { cn, formatCurrency } from '@/lib/utils'
import ChartTooltip from './ChartTooltip'

interface LineChartProps {
  data: Array<Record<string, unknown>>
  xKey?: string
  yKey?: string
  height?: number
  color?: string
  className?: string
  showGrid?: boolean
  showAxis?: boolean
  children?: React.ReactNode
}

function FIPLineChart({
  data,
  xKey = 'month',
  yKey,
  height = 300,
  color = '#3b82f6',
  className,
  showGrid = true,
  showAxis = true,
  children,
}: LineChartProps) {
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
        <RechartsLine data={data}>
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="text-gray-200 dark:text-gray-700"
            />
          )}
          <XAxis
            dataKey={xKey}
            hide={!showAxis}
            tick={{ fontSize: 12 }}
            className="text-gray-400 dark:text-gray-500"
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            hide={!showAxis}
            tickFormatter={(v: number) => formatCurrency(v)}
            tick={{ fontSize: 12 }}
            className="text-gray-400 dark:text-gray-500"
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Tooltip content={<ChartTooltip />} />
          {children || (
            <Line
              type="monotone"
              dataKey={yKey || 'total'}
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          )}
        </RechartsLine>
      </ResponsiveContainer>
    </div>
  )
}

export default FIPLineChart
