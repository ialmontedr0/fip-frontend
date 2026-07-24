import { cn } from '@/lib/utils'
import type { AccountType } from '@/types/accounts'
import { ACCOUNT_TYPE_CONFIG } from '@/features/accounts/constants'

interface Props {
  type: AccountType | string
  showLabel?: boolean
  className?: string
}

export default function AccountTypeBadge({ type, showLabel = true, className }: Props) {
  const config = ACCOUNT_TYPE_CONFIG[type as AccountType]
  if (!config) return <span className="text-sm text-gray-500">{type}</span>

  const Icon = config.icon

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium',
      'bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-sm border border-white/20',
      config.color, className,
    )}>
      <Icon className="h-3.5 w-3.5" />
      {showLabel && <span>{config.label}</span>}
    </span>
  )
}
