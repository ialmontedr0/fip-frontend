import { cn, formatCurrency } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui'
import { TrendingUp, TrendingDown, Minus, Calendar } from 'lucide-react'
import type { IncomeForecastResponse } from '@/types/incomes'

interface Props {
  data?: IncomeForecastResponse
  className?: string
}

export default function ForecastCard({ data, className }: Props) {
  if (!data) {
    return (
      <div className={cn('flex items-center justify-center h-48 text-sm text-gray-400', className)}>
        No hay datos de proyeccion disponibles
      </div>
    )
  }

  const TrendIcon = data.trend === 'up' ? TrendingUp : data.trend === 'down' ? TrendingDown : Minus
  const trendColor = data.trend === 'up' ? 'text-emerald-600' : data.trend === 'down' ? 'text-red-600' : 'text-gray-600'

  const items = [
    { label: 'Promedio 3 meses', value: formatCurrency(data.average_monthly_3m) },
    { label: 'Promedio 6 meses', value: formatCurrency(data.average_monthly_6m) },
    { label: 'Promedio 12 meses', value: formatCurrency(data.average_monthly_12m) },
    { label: 'Prox. 6 meses', value: formatCurrency(data.projected_next_6m) },
    { label: 'Proyeccion Mensual', value: formatCurrency(data.projected_monthly) },
  ]

  return (
    <Card className={cn('border-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary-500" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Proyeccion</h3>
          </div>
          <span className={cn('flex items-center gap-1 text-sm font-medium', trendColor)}>
            <TrendIcon className="h-4 w-4" />
            {data.trend === 'up' ? 'Creciente' : data.trend === 'down' ? 'Decreciente' : 'Estable'}
          </span>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.label} className="flex items-center justify-between py-1 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
              <span className="text-xs text-gray-500 dark:text-gray-400">{item.label}</span>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
