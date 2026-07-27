import { cn } from '@/lib/utils'

const RESOURCE_COLORS: Record<string, string> = {
  user: 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300',
  transaction: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  budget: 'bg-violet-100 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300',
  admin: 'bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300',
  system: 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300',
}

interface PermissionBadgeProps {
  name: string
  resource: string
  action?: string
  size?: 'sm' | 'md'
}

export default function PermissionBadge({ name, resource, action, size = 'sm' }: PermissionBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-lg font-mono font-semibold',
      size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
      RESOURCE_COLORS[resource] || 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
    )}>
      <span className="opacity-60">{resource}:</span>
      {action || name.split(':')[1] || name}
    </span>
  )
}
