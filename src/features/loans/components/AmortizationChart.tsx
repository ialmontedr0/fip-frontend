import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/utils'
import type { AmortizationEntry } from '@/types/loans'

interface AmortizationChartProps {
  entries: AmortizationEntry[]
  maxEntries?: number
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-3 text-xs space-y-1">
      <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Pago #{label}</p>
      {payload.map((entry, idx) => (
        <p key={idx} className="flex items-center gap-2" style={{ color: entry.name === 'Interes' ? '#ef4444' : '#22c55e' }}>
          <span className="font-medium">{entry.name}:</span>
          {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  )
}

export default function AmortizationChart({ entries, maxEntries }: AmortizationChartProps) {
  if (!entries.length) {
    return (
      <div className="flex items-center justify-center h-[350px] text-sm text-gray-400 dark:text-gray-500">
        No hay datos de amortizacion
      </div>
    )
  }

  const displayEntries = maxEntries ? entries.slice(0, maxEntries) : entries
  const hasMore = maxEntries ? entries.length > maxEntries : false

  const data = displayEntries.map((entry) => ({
    name: `#${entry.entry_number}`,
    Principal: Math.round(entry.principal_portion * 100) / 100,
    Interes: Math.round(entry.interest_portion * 100) / 100,
  }))

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded" style={{ backgroundColor: '#22c55e' }} />
          <span>Principal</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded" style={{ backgroundColor: '#ef4444' }} />
          <span>Interes</span>
        </div>
      </div>
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => formatCurrency(v)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="Interes" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Principal" stackId="a" fill="#22c55e" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {hasMore && (
        <p className="text-center text-xs text-gray-400 dark:text-gray-500">
          Mostrando primeros {maxEntries} de {entries.length} pagos...
        </p>
      )}
    </div>
  )
}
