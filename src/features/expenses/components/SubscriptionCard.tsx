import { cn, formatCurrency, formatISODate } from '@/lib/utils'
import { BILLING_FREQUENCY_LABELS } from '../constants'
import { Repeat, Edit3, Trash2, ExternalLink } from 'lucide-react'
import type { SubscriptionResponse } from '@/types/expenses'

interface Props {
  subscription: SubscriptionResponse
  onEdit: (subscription: SubscriptionResponse) => void
  onDelete: (id: string) => void
  isDeleting?: boolean
  className?: string
}

export default function SubscriptionCard({ subscription, onEdit, onDelete, className }: Props) {
  const isActive = subscription.status === 'active'
  const nextBilling = subscription.next_billing_date
    ? new Date(subscription.next_billing_date)
    : null
  const daysUntil = nextBilling
    ? Math.ceil((nextBilling.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div className={cn(
      'rounded-2xl backdrop-blur-xl border shadow-sm transition-all duration-300 p-4 group',
      isActive
        ? 'bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl'
        : 'bg-gray-50/60 dark:bg-gray-800/40 border-gray-200/30 dark:border-gray-700/30 hover:shadow-md',
      className,
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className={cn(
            'flex h-9 w-9 items-center justify-center rounded-xl',
            isActive ? 'bg-indigo-100 dark:bg-indigo-500/10' : 'bg-gray-100 dark:bg-gray-700/50',
          )}>
            <Repeat className={cn('h-4 w-4', isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400')} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{subscription.name}</p>
            {subscription.description && (
              <p className="text-[11px] text-gray-400 line-clamp-1">{subscription.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {!isActive && (
            <span className="rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-[10px] font-semibold text-gray-500 dark:text-gray-400">
              Inactiva
            </span>
          )}
          {daysUntil !== null && daysUntil <= 7 && isActive && (
            <span className="rounded-full bg-amber-100 dark:bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-400">
              {daysUntil <= 0 ? 'Vence hoy' : `${daysUntil}d`}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
        <div>
          <span className="text-gray-400">Monto:</span>{' '}
          <span className="font-semibold text-gray-700 dark:text-gray-300">{formatCurrency(subscription.amount, subscription.currency_code)}</span>
        </div>
        <div>
          <span className="text-gray-400">Frecuencia:</span>{' '}
          <span className="font-medium text-gray-700 dark:text-gray-300">{BILLING_FREQUENCY_LABELS[subscription.billing_frequency]}</span>
        </div>
        {nextBilling && (
          <div>
            <span className="text-gray-400">Proximo pago:</span>{' '}
            <span className="font-medium text-gray-700 dark:text-gray-300">{nextBilling.toLocaleDateString('es-DO')}</span>
          </div>
        )}
        {subscription.end_date && (
          <div>
            <span className="text-gray-400">Fin:</span>{' '}
            <span className="font-medium text-gray-700 dark:text-gray-300">{formatISODate(subscription.end_date)}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700/30">
        {subscription.website_url ? (
          <a
            href={subscription.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] text-blue-500 hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            Sitio web
          </a>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-1">
          <button onClick={() => onEdit(subscription)} className="rounded-lg p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors">
            <Edit3 className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => onDelete(subscription.id)} className="rounded-lg p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
