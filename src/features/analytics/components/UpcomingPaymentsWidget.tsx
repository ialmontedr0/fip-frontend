import { useEffect, useState } from 'react'
import { CalendarClock, AlertCircle, ChevronRight } from 'lucide-react'
import type { UpcomingPayment } from '@/types/analytics'
import { Badge, Skeleton } from '@/components/ui'
import { ErrorMessage, EmptyState } from '@/components/ui'
import { formatCurrency, formatDate, parseISODate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface Props {
  payments: UpcomingPayment[] | undefined
  loading: boolean
  error: boolean
}

function PaymentsSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
      <Skeleton className="mb-4 h-5 w-40" />
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[60px] w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}

export default function UpcomingPaymentsWidget({ payments, loading, error }: Props) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000)
    return () => clearInterval(interval)
  }, [])

  const dueSoonMap = new Map<string, boolean>()
  if (payments) {
    for (const p of payments) {
      if (!p.due_date) {
        dueSoonMap.set(p.name, false)
        continue
      }
      const diff = parseISODate(p.due_date).getTime() - now
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
      dueSoonMap.set(p.name, days >= 0 && days <= 7)
    }
  }

  if (loading) return <PaymentsSkeleton />
  if (error) {
    return (
      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <ErrorMessage message="No se pudieron cargar los pagos proximos" />
      </div>
    )
  }
  if (!payments || payments.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pagos Proximos</h3>
        </div>
        <EmptyState
          icon={<CalendarClock className="h-6 w-6 text-gray-400" />}
          title="Sin pagos pendientes"
          description="No tienes pagos de prestamos proximos a vencer."
        />
      </div>
    )
  }

  return (
    <div className={cn(
      'group relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800',
      'bg-white dark:bg-gray-900 p-6 shadow-sm transition-all duration-300',
      'hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-700',
    )}>
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400" />

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <CalendarClock className="h-4 w-4 text-amber-500" />
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Pagos Proximos
          </h3>
        </div>
        <Badge variant="warning" size="sm">{payments.length} pendientes</Badge>
      </div>

      <div className="space-y-2">
        {payments.map((payment, index) => {
          const dueSoon = dueSoonMap.get(payment.name) ?? false
          const isOverdue = payment.due_date ? parseISODate(payment.due_date).getTime() < now : false

          return (
            <div
              key={index}
              className={cn(
                'flex items-center justify-between rounded-xl border border-gray-100 p-3.5 transition-all duration-200',
                'dark:border-gray-800',
                'hover:border-gray-200 hover:bg-gray-50/50 dark:hover:border-gray-700 dark:hover:bg-gray-800/50',
                'hover:shadow-sm',
                dueSoon && 'border-amber-200 bg-amber-50/30 dark:border-amber-900/50 dark:bg-amber-500/5',
                isOverdue && 'border-red-200 bg-red-50/30 dark:border-red-900/50 dark:bg-red-500/5',
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all',
                  dueSoon || isOverdue
                    ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400'
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
                )}>
                  {dueSoon || isOverdue ? (
                    <AlertCircle className="h-[18px] w-[18px]" />
                  ) : (
                    <CalendarClock className="h-[18px] w-[18px]" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {payment.name}
                  </p>
                  {payment.due_date && (
                    <p className={cn(
                      'text-xs',
                      isOverdue ? 'font-medium text-red-600 dark:text-red-400' :
                      dueSoon ? 'font-medium text-amber-600 dark:text-amber-400' :
                      'text-gray-400 dark:text-gray-500',
                    )}>
                      {isOverdue ? 'Vencido: ' : 'Vence: '}
                      {formatDate(payment.due_date)}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100 tabular-nums">
                  {formatCurrency(payment.payment)}
                </span>
                <ChevronRight className="h-4 w-4 text-gray-300 transition-transform group-hover/item:translate-x-0.5 dark:text-gray-600" />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
