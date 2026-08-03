import { Line } from 'recharts'
import FIPLineChart from '@/components/charts/LineChart'
import type { PriceHistoryResponse } from '@/types/investment'

interface Props {
  history: PriceHistoryResponse | undefined
  loading: boolean
  currency: string
}

export default function PriceHistoryChart({ history, loading, currency }: Props) {
  if (loading) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-800/50">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    )
  }

  const points = history?.points || []
  if (points.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-400">
        Sin historial de precios aun
      </div>
    )
  }

  const data = points.map((p) => ({
    date: p.date,
    close: p.close_price,
  }))

  return (
    <FIPLineChart
      data={data as unknown as Array<Record<string, unknown>>}
      xKey="date"
      height={300}
      color="#3b82f6"
      showGrid
    >
      <Line
        type="monotone"
        dataKey="close"
        stroke="#3b82f6"
        strokeWidth={2}
        dot={false}
        activeDot={{ r: 5 }}
        name={currency}
      />
    </FIPLineChart>
  )
}
