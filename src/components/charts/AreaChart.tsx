import {
  AreaChart as RechartsArea,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { cn, formatCurrency } from '@/lib/utils'
import ChartTooltip from './ChartTooltip'

interface AreaChartProps {
  data: Array<Record<string, unknown>>
  xKey?: string
  yKey?: string
  height?: number
  color?: string
  gradient?: boolean
  className?: string
  showGrid?: boolean
  showAxis?: boolean
  children?: React.ReactNode
}

function FIPAreaChart({
  data,
  xKey = 'month',
  yKey,
  height = 300,
  color = '#3b82f6',
  gradient = true,
  className,
  showGrid = true,
  showAxis = true,
  children,
}: AreaChartProps) {
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
        <RechartsArea data={data}>
          {gradient && (
            <defs>
              <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
          )}
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
            <Area
              type="monotone"
              dataKey={yKey || 'total'}
              stroke={color}
              fill={gradient ? `url(#gradient-${color.replace('#', '')})` : color}
              strokeWidth={2}
            />
          )}
        </RechartsArea>
      </ResponsiveContainer>
    </div>
  )
}

export default FIPAreaChart
