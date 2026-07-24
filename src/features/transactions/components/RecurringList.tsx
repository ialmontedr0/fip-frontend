import { cn } from '@/lib/utils'
import RecurringCard from './RecurringCard'
import type { RecurringListItem } from '@/types/transactions'
import { Skeleton } from '@/components/ui'

interface Props {
  recurring: RecurringListItem[]
  onToggleActive: (id: string, isActive: boolean) => void
  onDelete: (id: string) => void
  isLoading?: boolean
  activeFilter?: boolean | null
  className?: string
}

export default function RecurringList({ recurring, onToggleActive, onDelete, isLoading, className }: Props) {
  if (isLoading) {
    return (
      <div className={cn('grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4', className)}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-white/60 dark:bg-gray-800/60 p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (recurring.length === 0) {
    return null
  }

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4', className)}>
      {recurring.map((r) => (
        <RecurringCard
          key={r.id}
          recurring={r}
          onToggleActive={onToggleActive}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
