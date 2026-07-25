import { cn } from '@/lib/utils'
import { INCOME_TYPE_CONFIG } from '../constants'
import type { IncomeType } from '@/types/incomes'
import type { LucideIcon } from 'lucide-react'

interface Props {
  type: string
  size?: 'sm' | 'md'
  showIcon?: boolean
  className?: string
}

export default function IncomeTypeBadge({ type, size = 'md', showIcon = true, className }: Props) {
  const config = INCOME_TYPE_CONFIG[type as IncomeType]
  if (!config) return null

  const Icon = config.icon as LucideIcon

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        config.bgColor,
        config.color,
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs',
        className,
      )}
    >
      {showIcon && <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />}
      {config.label}
    </span>
  )
}
