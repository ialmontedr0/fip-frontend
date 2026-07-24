import {
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { cn, formatCurrency } from '@/lib/utils'
import ChartTooltip from './ChartTooltip'

interface BarChartProps {
  data: Array<Record<string, unknown>>
  xKey?: string
  yKey?: string
  height?: number
  color?: string
  barSize?: number
  className?: string
  showGrid?: boolean
  showAxis?: boolean
  children?: React.ReactNode
}

function FIPBarChart({
  data,
  xKey = 'period',
  yKey,
  height = 300,
  color = '#3b82f6',
  barSize = 32,
  className,
  showGrid = true,
  showAxis = true,
  children,
}: BarChartProps) {
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
        <RechartsBar data={data}>
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="text-gray-200 dark:text-gray-700"
              vertical={false}
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
            <Bar dataKey={yKey || 'total'} fill={color} barSize={barSize} radius={[4, 4, 0, 0]} />
          )}
        </RechartsBar>
      </ResponsiveContainer>
    </div>
  )
}

export default FIPBarChart
