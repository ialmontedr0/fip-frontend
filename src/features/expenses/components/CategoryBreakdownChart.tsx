import { cn, formatCurrency } from '@/lib/utils'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { CHART_COLORS } from '../constants'
import type { ExpenseDashboardResponse } from '@/types/expenses'

interface Props {
  data?: ExpenseDashboardResponse['by_category']
  className?: string
}

const CATEGORY_COLORS = [
  CHART_COLORS.expense,
  CHART_COLORS.income,
  '#f59e0b',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#f97316',
  '#6366f1',
  '#84cc16',
  '#06b6d4',
]

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { category: string; total: number; percentage: number } }> }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="rounded-xl border bg-white/90 px-3 py-2 shadow-lg backdrop-blur-xl dark:border-gray-700 dark:bg-gray-800/90">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{d.category}</p>
      <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{formatCurrency(d.total)}</p>
      <p className="text-[10px] text-gray-400">{d.percentage.toFixed(1)}% del total</p>
    </div>
  )
}

export default function CategoryBreakdownChart({ data, className }: Props) {
  const chartData = data?.map((c) => ({
    category: c.category,
    total: parseFloat(c.total),
    percentage: parseFloat(c.percentage),
  })) || []

  if (!chartData.length) {
    return (
      <div className={cn('flex items-center justify-center h-64 text-sm text-gray-400', className)}>
        No hay datos de categorias disponibles
      </div>
    )
  }

  return (
    <div className={cn('rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 p-6', className)}>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Gastos por Categoria</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="total"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={55}
            paddingAngle={2}
          >
            {chartData.map((_, index) => (
              <Cell key={index} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value: string) => (
              <span className="text-xs text-gray-600 dark:text-gray-400">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
