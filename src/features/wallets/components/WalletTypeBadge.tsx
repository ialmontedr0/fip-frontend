import { cn } from '@/lib/utils'
import type { WalletType } from '@/types/wallets'
import { WALLET_TYPE_CONFIG } from '@/features/wallets/constants'

interface Props {
  type: WalletType | string
  showLabel?: boolean
  className?: string
}

export default function WalletTypeBadge({ type, showLabel = true, className }: Props) {
  const config = WALLET_TYPE_CONFIG[type as WalletType]
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
