import { cn } from '@/lib/utils'
import { NOTIFICATION_TYPE_CONFIG } from '../constants'
import type { NotificationType } from '@/types/notifications'

interface TypeToggleListProps {
  types: Record<string, boolean>
  onChange: (types: Record<string, boolean>) => void
}

export default function TypeToggleList({ types, onChange }: TypeToggleListProps) {
  const typeEntries = Object.entries(NOTIFICATION_TYPE_CONFIG) as [NotificationType, typeof NOTIFICATION_TYPE_CONFIG[NotificationType]][]

  const toggle = (type: NotificationType) => {
    const current = types[type]
    const newVal = current === undefined ? false : !current
    onChange({ ...types, [type]: newVal })
  }

  return (
    <div className="pl-12">
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        Tipos de notificación
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
        {typeEntries.map(([type, config]) => {
          const Icon = config.icon
          const enabled = types[type] !== false
          return (
            <button
              key={type}
              type="button"
              onClick={() => toggle(type)}
              className={cn(
                'group relative flex items-center gap-2 overflow-hidden rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-200',
                enabled
                  ? 'bg-white/90 dark:bg-gray-800/90 border border-gray-200/80 dark:border-gray-700/60 text-gray-700 dark:text-gray-300 hover:border-purple-300/50 dark:hover:border-purple-500/30 shadow-sm hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.97]'
                  : 'bg-gray-50/50 dark:bg-gray-800/30 border border-transparent text-gray-400 dark:text-gray-500 opacity-60 hover:opacity-90 hover:bg-gray-100/50 dark:hover:bg-gray-800/50',
              )}
            >
              {/* Active indicator bar */}
              {enabled && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r-full bg-gradient-to-b from-purple-500 to-indigo-500 shadow-sm shadow-purple-500/50" />
              )}
              <Icon className={cn('h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:scale-110', config.color)} />
              <span className="truncate">{config.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
