import { cn } from '@/lib/utils'
import type { AccountStatus } from '@/types/accounts'

const STATUS_CONFIG: Record<AccountStatus, { dot: string; bg: string; text: string; label: string }> = {
  active: { dot: 'bg-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-400', label: 'Activa' },
  inactive: { dot: 'bg-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-700 dark:text-amber-400', label: 'Inactiva' },
  archived: { dot: 'bg-gray-400', bg: 'bg-gray-50 dark:bg-gray-500/10', text: 'text-gray-600 dark:text-gray-400', label: 'Archivada' },
  frozen: { dot: 'bg-red-500', bg: 'bg-red-50 dark:bg-red-500/10', text: 'text-red-700 dark:text-red-400', label: 'Congelada' },
}

interface Props {
  status: AccountStatus | string
  className?: string
}

export default function AccountStatusBadge({ status, className }: Props) {
  const config = STATUS_CONFIG[status as AccountStatus] ?? {
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
