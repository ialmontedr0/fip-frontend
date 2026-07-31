import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui'
import type { WalletListItem, WalletType } from '@/types/wallets'
import { WALLET_TYPE_CONFIG } from '@/features/wallets/constants'
import WalletStatusBadge from './WalletStatusBadge'
import { ChevronRight, Layers } from 'lucide-react'

interface Props {
  wallet: WalletListItem
  index?: number
}

export function WalletCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white/80 p-5 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/80">
      <div className="flex items-start gap-3">
        <Skeleton variant="circular" className="h-10 w-10" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-4" />
      </div>
    </div>
  )
}

export default function WalletCard({ wallet, index = 0 }: Props) {
  const navigate = useNavigate()
  const config = WALLET_TYPE_CONFIG[wallet.wallet_type as WalletType]
  const Icon = config?.icon

  return (
    <div
      onClick={() => navigate(`/wallets/${wallet.id}`)}
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
        config?.color === 'text-violet-600' ? 'bg-violet-400' : 'bg-primary-400',
      )} />

      <div className="relative p-5">
        <div className="flex items-start justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className={cn(
              'flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110',
              config?.bgColor ?? 'bg-gray-100',
              config?.color ?? 'text-gray-500',
            )}>
              {Icon && <Icon className="h-5 w-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{wallet.name}</p>
              {wallet.description && (
                <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{wallet.description}</p>
              )}
            </div>
          </div>
          <WalletStatusBadge status={wallet.status} />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
            <Layers className="h-3.5 w-3.5" />
            <span>{wallet.account_count} cuenta{wallet.account_count !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-primary-600 dark:text-primary-400 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
            <span>Ver detalle</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    </div>
  )
}
