import { STATUS_CONFIG } from '../constants'
import type { BudgetStatus } from '@/types/budgets'

interface BudgetProgressBarProps {
  pctUsed: number
  spent: string
  amount: string
  remaining: string
  status: string
  showLabels?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

function formatCurrency(value: string) {
  const num = Number(value)
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num)
}

const heightMap = { sm: 'h-2', md: 'h-3', lg: 'h-4' }
const textSizeMap = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' }

export default function BudgetProgressBar({
  pctUsed, spent, amount, remaining, status,
  showLabels = true, size = 'md', className = '',
}: BudgetProgressBarProps) {
  const config = STATUS_CONFIG[status as BudgetStatus] || STATUS_CONFIG.ok
  const displayPct = Math.min(pctUsed, 100)

  return (
    <div className={`space-y-1.5 ${className}`}>
      {showLabels && (
        <div className="flex items-center justify-between">
          <span className={`font-medium ${textSizeMap[size]} ${config.textColor}`}>
            {pctUsed.toFixed(1)}%
          </span>
          <span className={`${textSizeMap[size]} text-gray-500 dark:text-gray-400`}>
            {formatCurrency(spent)} / {formatCurrency(amount)}
          </span>
        </div>
      )}
      <div
        className={`relative w-full rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden ${heightMap[size]} shadow-inner`}
        role="progressbar"
        aria-valuenow={displayPct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${pctUsed.toFixed(1)}% usado`}
      >
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out ${config.barColor} ${config.glowColor} shadow-sm`}
          style={{ width: `${displayPct}%` }}
        />
        {pctUsed > 100 && (
          <div className="absolute inset-0 flex items-center justify-end pr-1">
            <span className="text-[10px] font-bold text-white drop-shadow-sm">!</span>
          </div>
        )}
      </div>
      {showLabels && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {Number(remaining) >= 0 ? 'Restante:' : 'Sobregiro:'}
            {' '}
            <span className={`font-semibold ${Number(remaining) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {Number(remaining) >= 0 ? formatCurrency(remaining) : `+${formatCurrency(String(Math.abs(Number(remaining))))}`}
            </span>
          </span>
          <span className={`text-xs font-medium ${config.textColor}`}>
            {pctUsed > 100 ? `${(pctUsed - 100).toFixed(1)}% sobre el limite` : `${(100 - pctUsed).toFixed(1)}% disponible`}
          </span>
        </div>
      )}
    </div>
  )
}
