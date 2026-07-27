import { memo } from 'react'
import { cn } from '@/lib/utils'

interface AvatarProps {
  src?: string | null
  alt?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
}

function Avatar({ src, alt, size = 'md', className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt ?? ''}
        className={cn('rounded-full object-cover', sizeClasses[size], className)}
      />
    )
  }

  const initials = alt
    ? alt.slice(0, 2).toUpperCase()
    : '??'

  return (
    <div
      className={cn(
        'rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 flex items-center justify-center font-medium',
        sizeClasses[size],
        className,
      )}
      aria-label={alt ?? undefined}
    >
      {initials}
    </div>
  )
}

export default memo(Avatar)
