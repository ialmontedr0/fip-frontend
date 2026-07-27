import { cn } from '@/lib/utils'
import { Inbox, SearchX, AlertTriangle, Loader2 } from 'lucide-react'
import Button from './Button'

type EmptyStateVariant = 'default' | 'search' | 'error' | 'loading'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  variant?: EmptyStateVariant
  className?: string
}

const variantIcons: Record<EmptyStateVariant, React.ReactNode> = {
  default: <Inbox className="h-6 w-6 text-gray-400" />,
  search: <SearchX className="h-6 w-6 text-gray-400" />,
  error: <AlertTriangle className="h-6 w-6 text-red-400" />,
  loading: <Loader2 className="h-6 w-6 animate-spin text-gray-400" />,
}

function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  variant = 'default',
  className,
}: EmptyStateProps) {
  const bgClass = variant === 'error'
    ? 'bg-red-100 dark:bg-red-900/30'
    : 'bg-gray-100 dark:bg-gray-700'

  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center', className)} role="status" aria-live="polite">
      <div className={cn('rounded-full p-3 mb-4', bgClass)}>
        {icon || variantIcons[variant]}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-md">{description}</p>
      )}
      {actionLabel && onAction && variant !== 'loading' && (
        <Button onClick={onAction} autoFocus>{actionLabel}</Button>
      )}
    </div>
  )
}

export default EmptyState