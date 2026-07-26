import { cn } from '@/lib/utils'

interface LoadingSkeletonProps {
  className?: string
}

export default function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-gray-100/80 dark:border-gray-700/50 bg-white/50 dark:bg-gray-900/50 p-4',
        className,
      )}
    >
      {/* Shimmer overlay */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 dark:via-white/5 to-transparent" />

      <div className="flex items-start gap-3">
        {/* Icon skeleton */}
        <div className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse" />

        <div className="flex-1 space-y-2.5">
          {/* Title */}
          <div className="h-4 w-3/4 rounded-lg bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
          {/* Body lines */}
          <div className="h-3 w-full rounded-lg bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700/70 dark:to-gray-600/50 animate-pulse" />
          <div className="h-3 w-2/3 rounded-lg bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700/70 dark:to-gray-600/50 animate-pulse" />
          {/* Meta */}
          <div className="flex gap-3 pt-1">
            <div className="h-2.5 w-16 rounded bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700/50 dark:to-gray-600/30 animate-pulse" />
            <div className="h-2.5 w-12 rounded bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700/50 dark:to-gray-600/30 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
