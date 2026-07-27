import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'pill'
}

function Skeleton({ className, variant = 'text', ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'animate-pulse bg-gray-200 dark:bg-gray-700',
        variant === 'text' && 'h-4 w-full rounded',
        variant === 'circular' && 'rounded-full',
        variant === 'rectangular' && 'rounded-lg',
        variant === 'pill' && 'rounded-full h-6 w-16',
        className,
      )}
      {...props}
    />
  )
}

export default Skeleton
