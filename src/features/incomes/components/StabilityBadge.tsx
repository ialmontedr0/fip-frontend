import { cn } from '@/lib/utils'
import { STABILITY_CONFIG } from '../constants'
import type { StabilityType } from '@/types/incomes'

interface Props {
  stability: string
  size?: 'sm' | 'md'
  className?: string
}

export default function StabilityBadge({ stability, size = 'md', className }: Props) {
  const config = STABILITY_CONFIG[stability as StabilityType]
  if (!config) return null

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        config.bgColor,
        config.color,
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs',
        className,
      )}
    >
      <span className={cn('rounded-full', config.dotColor, size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2')} />
      {config.label}
    </span>
  )
}
