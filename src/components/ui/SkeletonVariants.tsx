import { cn } from '@/lib/utils'
import Skeleton from './Skeleton'

function TableSkeleton({ rows = 5, cols = 4, className }: { rows?: number; cols?: number; className?: string }) {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex gap-4 py-3">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 py-3 border-t border-gray-100 dark:border-gray-800">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className={cn('h-4', c === 0 ? 'flex-[2]' : 'flex-1')} />
          ))}
        </div>
      ))}
    </div>
  )
}

function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 p-5 space-y-4', className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton variant="circular" className="h-8 w-8" />
      </div>
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-3 w-48" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-8 flex-1 rounded-xl" />
        <Skeleton className="h-8 flex-1 rounded-xl" />
      </div>
    </div>
  )
}

function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 p-5 space-y-4', className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton variant="rectangular" className="h-48 w-full" />
    </div>
  )
}

function FormSkeleton({ fields = 4, className }: { fields?: number; className?: string }) {
  return (
    <div className={cn('space-y-5', className)}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      ))}
      <Skeleton className="h-10 w-full rounded-xl" />
    </div>
  )
}

function KPISkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 p-5 space-y-2', className)}>
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-8 w-28" />
      <Skeleton className="h-3 w-32" />
    </div>
  )
}

function ProfileSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex flex-col items-center gap-3">
        <Skeleton variant="circular" className="h-20 w-20" />
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 p-3">
            <Skeleton variant="circular" className="h-4 w-4" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-2 w-16" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PageSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" className="h-9 w-9" />
        <div className="space-y-1">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-56" />
        </div>
      </div>
      <Skeleton variant="rectangular" className="h-64 w-full" />
    </div>
  )
}

function ListSkeleton({ items = 3, className }: { items?: number; className?: string }) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/50 dark:bg-gray-800/30">
          <Skeleton variant="circular" className="h-10 w-10 shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-3 w-2/5" />
          </div>
          <Skeleton className="h-4 w-16 shrink-0" />
        </div>
      ))}
    </div>
  )
}

export { TableSkeleton, CardSkeleton, ChartSkeleton, FormSkeleton, KPISkeleton, ProfileSkeleton, PageSkeleton, ListSkeleton }
