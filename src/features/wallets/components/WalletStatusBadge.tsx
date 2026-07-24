import { cn } from '@/lib/utils'
import type { WalletStatus } from '@/types/wallets'

const STATUS_CONFIG: Record<WalletStatus, { dot: string; bg: string; text: string; label: string }> = {
  active: { dot: 'bg-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-400', label: 'Activo' },
  archived: { dot: 'bg-gray-400', bg: 'bg-gray-50 dark:bg-gray-500/10', text: 'text-gray-600 dark:text-gray-400', label: 'Archivado' },
}

interface Props {
  status: WalletStatus | string
  className?: string
}

export default function WalletStatusBadge({ status, className }: Props) {
  const config = STATUS_CONFIG[status as WalletStatus] ?? {
    dot: 'bg-gray-400',
    bg: 'bg-gray-50 dark:bg-gray-500/10',
    text: 'text-gray-600 dark:text-gray-400',
    label: status,
  }
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider', config.bg, config.text, className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />
      {config.label}
    </span>
  )
}
