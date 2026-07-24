import { Badge } from '@/components/ui'
import type { LiquidityLevel } from '@/types/wallets'

const LEVEL_CONFIG: Record<LiquidityLevel, { variant: 'success' | 'warning' | 'danger' | 'info'; label: string }> = {
  high: { variant: 'success', label: 'Alta' },
  medium: { variant: 'warning', label: 'Media' },
  low: { variant: 'danger', label: 'Baja' },
  mixed: { variant: 'info', label: 'Mixta' },
}

interface Props {
  level: LiquidityLevel | string
  showLabel?: boolean
}

export default function LiquidityLevelBadge({ level, showLabel = true }: Props) {
  const config = LEVEL_CONFIG[level as LiquidityLevel] ?? { variant: 'default' as const, label: level }
  return <Badge variant={config.variant} size="sm">{showLabel ? config.label : ''}</Badge>
}
