import { cn } from '@/lib/utils'
import { JOB_STATUS_CONFIG } from '../constants'
import type { ImportJobStatus } from '@/types/imports'

interface ImportStatusBadgeProps {
  status: ImportJobStatus
  size?: 'sm' | 'md'
}

export default function ImportStatusBadge({ status, size = 'sm' }: ImportStatusBadgeProps) {
  const config = JOB_STATUS_CONFIG[status]
  const Icon = config.icon

  return (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-lg font-semibold',
      size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
      config.color, config.bgColor,
      status === 'processing' && 'animate-pulse',
    )}>
      <Icon className={cn(size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5')} />
      {config.label}
    </span>
  )
}
