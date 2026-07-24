import { formatCurrency } from '@/lib/utils'

interface ChartTooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; color?: string }>
  label?: string
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div
      className={[
        'rounded-xl border border-gray-200/60 bg-white/90 px-4 py-3 shadow-xl backdrop-blur-md',
        'dark:border-gray-700/60 dark:bg-gray-800/90 dark:shadow-2xl dark:shadow-black/20',
        'animate-fade-in',
      ].join(' ')}
    >
      {label && (
        <p className="mb-1.5 border-b border-gray-100 pb-1.5 text-xs font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400">
          {label}
        </p>
      )}
      <div className="space-y-1.5">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-gray-800"
                style={{ backgroundColor: entry.color }}
              />
              <span className="font-medium text-gray-600 dark:text-gray-300">{entry.name}</span>
            </div>
            <span className="font-semibold tabular-nums text-gray-900 dark:text-gray-100">
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChartTooltip
