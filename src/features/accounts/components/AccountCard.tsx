import { useNavigate } from 'react-router-dom'
import { cn, formatCurrency } from '@/lib/utils'
import { Skeleton } from '@/components/ui'
import type { AccountListItem, AccountType } from '@/types/accounts'
import { ACCOUNT_TYPE_CONFIG } from '@/features/accounts/constants'
import AccountStatusBadge from './AccountStatusBadge'

interface Props {
  account: AccountListItem
  index?: number
}

export function AccountCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white/80 p-5 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/80">
      <div className="flex items-start gap-3">
        <Skeleton variant="circular" className="h-10 w-10" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  )
}

export default function AccountCard({ account, index = 0 }: Props) {
  const navigate = useNavigate()
  const config = ACCOUNT_TYPE_CONFIG[account.account_type as AccountType]
  const Icon = config?.icon
  const isPositive = parseFloat(account.balance) >= 0

  return (
    <div
      onClick={() => navigate(`/accounts/${account.id}`)}
      className={cn(
        'group relative cursor-pointer overflow-hidden rounded-2xl transition-all duration-300',
        'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl',
        'border border-gray-100/80 dark:border-gray-800/80',
        'hover:shadow-xl hover:-translate-y-1 hover:border-gray-200/80 dark:hover:border-gray-700/80',
        'animate-fade-in',
      )}
      style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'both' }}
    >
      {/* Gradient accent bar */}
      <div className={cn(
        'absolute inset-x-0 top-0 h-1 bg-gradient-to-r transition-all duration-500 group-hover:h-1.5',
        config?.gradient ?? 'from-primary-400 to-primary-600',
      )} />

      {/* Hover glow */}
      <div className={cn(
        'absolute -top-20 -right-20 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500',
        'group-hover:opacity-20',
        isPositive ? 'bg-emerald-400' : 'bg-red-400',
      )} />

      <div className="relative p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              'flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110',
              config?.bgColor ?? 'bg-gray-100',
              config?.color ?? 'text-gray-500',
            )}>
              {Icon && <Icon className="h-5 w-5" />}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{account.name}</p>
              {account.institution && (
                <p className="text-xs text-gray-400 dark:text-gray-500">{account.institution}</p>
              )}
            </div>
          </div>
          <AccountStatusBadge status={account.status} />
        </div>

        <div className="mt-4">
          <p className={cn(
            'text-lg font-bold tabular-nums tracking-tight',
            isPositive
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-red-600 dark:text-red-400',
          )}>
            {formatCurrency(parseFloat(account.balance), account.currency_code)}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">{account.currency_code}</p>
        </div>
      </div>
    </div>
  )
}
