import { cn } from '@/lib/utils'
import type { LiquidityLevel } from '@/types/wallets'

const LEVEL_ORDER: LiquidityLevel[] = ['high', 'medium', 'low', 'mixed']

const LEVEL_STYLE: Record<LiquidityLevel, { bar: string; label: string }> = {
  high: { bar: 'bg-gradient-to-r from-green-400 to-green-500', label: 'Alta' },
  medium: { bar: 'bg-gradient-to-r from-amber-400 to-amber-500', label: 'Media' },
  low: { bar: 'bg-gradient-to-r from-red-400 to-red-500', label: 'Baja' },
  mixed: { bar: 'bg-gradient-to-r from-blue-400 to-blue-500', label: 'Mixta' },
}

interface Props {
  level: LiquidityLevel
  className?: string
}

export default function LiquidityGauge({ level, className }: Props) {
  const currentIndex = LEVEL_ORDER.indexOf(level)

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex gap-1 h-3">
        {LEVEL_ORDER.map((lvl, index) => {
          const isActive = index <= currentIndex
          const style = LEVEL_STYLE[lvl]
          return (
            <div
              key={lvl}
              className={cn(
                'flex-1 rounded-full transition-all duration-700',
                isActive ? style.bar : 'bg-gray-200 dark:bg-gray-700',
                index === 0 && 'rounded-l-full',
                index === LEVEL_ORDER.length - 1 && 'rounded-r-full',
              )}
            />
          )
        })}
      </div>
      <div className="flex justify-between text-xs">
        {LEVEL_ORDER.map((lvl, index) => {
          const isActive = index <= currentIndex
          const style = LEVEL_STYLE[lvl]
          return (
            <span
              key={lvl}
              className={cn(
                'font-medium transition-colors duration-300',
                isActive ? style.bar.replace('bg-gradient-to-r ', 'text-').replace(/from-\w+-\d+ /, '').replace('to-', '') : 'text-gray-400 dark:text-gray-500',
                index === 0 && 'text-left',
                index === LEVEL_ORDER.length - 1 && 'text-right',
              )}
            >
              {style.label}
            </span>
          )
        })}
      </div>
    </div>
  )
}
