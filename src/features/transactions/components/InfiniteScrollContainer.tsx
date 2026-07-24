import { useRef, useEffect, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface Props {
  onLoadMore: () => void
  hasMore: boolean
  isLoading: boolean
  children: ReactNode
  className?: string
  loaderClassName?: string
}

export default function InfiniteScrollContainer({
  onLoadMore, hasMore, isLoading, children, className, loaderClassName,
}: Props) {
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore()
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, isLoading, onLoadMore])

  return (
    <div className={cn('space-y-3', className)}>
      {children}

      <div ref={sentinelRef} className="flex justify-center py-6">
        {isLoading && (
          <div className={cn('flex items-center gap-2 text-sm text-gray-400', loaderClassName)}>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Cargando mas transacciones...</span>
          </div>
        )}
        {!hasMore && !isLoading && (
          <div className="flex flex-col items-center gap-1">
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
            <p className="text-xs text-gray-400 dark:text-gray-500 pt-2">No hay mas transacciones</p>
          </div>
        )}
      </div>
    </div>
  )
}
