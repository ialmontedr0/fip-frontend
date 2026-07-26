import { getProgressBarColor, getProgressColor, formatCurrency } from '../constants'

interface ProgressBarProps {
  current: number | string
  target: number | string
  pct: number
  showLabels?: boolean
  size?: 'sm' | 'md' | 'lg'
  behindSchedule?: boolean
  className?: string
}

const heightMap = { sm: 'h-2', md: 'h-3', lg: 'h-4' }
const textSizeMap = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' }

export default function ProgressBar({
  current, target, pct,
  showLabels = true, size = 'md', behindSchedule = false, className = '',
}: ProgressBarProps) {
  const displayPct = Math.min(pct, 100)
  const barColor = getProgressBarColor(pct, behindSchedule)

  return (
    <div className={`space-y-1.5 ${className}`}>
      {showLabels && (
        <div className="flex items-center justify-between">
          <span className={`font-medium ${textSizeMap[size]} ${getProgressColor(pct, behindSchedule)}`}>
            {pct.toFixed(1)}%
          </span>
          <span className={`${textSizeMap[size]} text-gray-500 dark:text-gray-400`}>
            {formatCurrency(current)} / {formatCurrency(target)}
          </span>
        </div>
      )}
      <div
        className={`relative w-full rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden ${heightMap[size]} shadow-inner`}
        role="progressbar"
        aria-valuenow={displayPct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out ${barColor}`}
          style={{ width: `${displayPct}%` }}
        />
      </div>
    </div>
  )
}
