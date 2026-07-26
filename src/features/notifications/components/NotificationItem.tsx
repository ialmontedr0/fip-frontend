import { useState, useRef } from 'react'
import { cn, formatRelativeTime } from '@/lib/utils'
import { Check, Trash2, ChevronRight, Bell } from 'lucide-react'
import { NOTIFICATION_TYPE_CONFIG } from '../constants'
import type { Notification } from '@/types/notifications'

function RippleEffect() {
  return (
    <span className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
      <span className="absolute inset-0 animate-ripple bg-gradient-to-r from-purple-500/20 to-indigo-500/20" />
    </span>
  )
}

interface NotificationItemProps {
  notification: Notification
  onMarkRead: (id: string) => void
  onDelete: (id: string) => void
  onClick?: (notification: Notification) => void
}

export default function NotificationItem({
  notification, onMarkRead, onDelete, onClick,
}: NotificationItemProps) {
  const [showActions, setShowActions] = useState(false)
  const [ripple, setRipple] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const config = NOTIFICATION_TYPE_CONFIG[notification.type]
  const Icon = config?.icon || Bell

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDeleting(true)
    setRipple(true)
    timeoutRef.current = setTimeout(() => {
      onDelete(notification.id)
    }, 400)
  }

  const handleClick = () => {
    setRipple(true)
    setTimeout(() => {
      onClick?.(notification)
    }, 150)
  }

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border transition-all duration-500 cursor-pointer',
        'hover:shadow-xl hover:-translate-y-1 active:scale-[0.98]',
        deleting ? 'scale-95 opacity-0' : '',
        notification.is_read
          ? 'border-gray-100 dark:border-gray-700/70 bg-white/50 dark:bg-gray-900/40 backdrop-blur-sm'
          : 'border-purple-200/70 dark:border-purple-500/30 bg-white/90 dark:bg-gray-900/85 shadow-md hover:shadow-purple-500/10 hover:border-purple-300 dark:hover:border-purple-400/50',
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={handleClick}
    >
      {ripple && <RippleEffect />}

      {/* Animated gradient border overlay for unread */}
      {!notification.is_read && (
        <div className="pointer-events-none absolute inset-0 rounded-2xl p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/30 via-violet-400/20 to-indigo-500/30 animate-gradient-x" />
        </div>
      )}

      {/* Unread indicator - animated bar with glow */}
      {!notification.is_read && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-1 rounded-r-full bg-gradient-to-b from-purple-500 to-indigo-500 shadow-[0_0_8px_rgba(168,85,247,0.6)] animate-pulse-subtle" />
      )}

      <div className="relative flex items-start gap-4 p-4">
        {/* Icon container with glow */}
        <div className="relative shrink-0">
          <div
            className={cn(
              'flex h-11 w-11 items-center justify-center rounded-xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3',
              'bg-gradient-to-br',
              config?.gradient ?? 'from-gray-400 to-gray-600',
            )}
          >
            <Icon className="h-5 w-5 text-white drop-shadow-sm" />
          </div>
          {/* Glow ring */}
          {!notification.is_read && (
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 blur-md animate-pulse-subtle" />
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className={cn(
                'text-sm font-semibold truncate transition-colors',
                notification.is_read
                  ? 'text-gray-500 dark:text-gray-400'
                  : 'text-gray-900 dark:text-gray-100',
              )}
            >
              {notification.title}
            </span>
            {!notification.is_read && (
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-purple-500 shadow-[0_0_6px_rgba(168,85,247,0.6)]" />
              </span>
            )}
            {!notification.is_sent && (
              <span className="shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-400/20 to-orange-400/20 text-amber-600 dark:text-amber-400 border border-amber-300/30 dark:border-amber-500/30 shadow-sm">
                Pendiente
              </span>
            )}
          </div>
          <p
            className={cn(
              'text-xs leading-relaxed line-clamp-2 transition-colors',
              notification.is_read
                ? 'text-gray-400 dark:text-gray-500'
                : 'text-gray-500 dark:text-gray-400',
            )}
          >
            {notification.body}
          </p>
          <div className="flex items-center gap-2.5 mt-2">
            <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500 font-medium">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatRelativeTime(notification.created_at)}
            </span>
            <span className="text-[10px] text-gray-300 dark:text-gray-600">·</span>
            <span className="inline-flex items-center gap-1 text-[10px] capitalize text-gray-400 dark:text-gray-500 font-medium">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              {notification.channel}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div
          className={cn(
            'flex items-center gap-1 transition-all duration-300 shrink-0',
            showActions ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none',
          )}
        >
          {!notification.is_read && (
            <button
              onClick={(e) => { e.stopPropagation(); onMarkRead(notification.id) }}
              className="rounded-lg p-2 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all duration-200 active:scale-90"
              title="Marcar como leída"
            >
              <Check className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={handleDelete}
            className="rounded-lg p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200 active:scale-90"
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <ChevronRight className="h-4 w-4 text-gray-300 dark:text-gray-600 transition-all duration-300 group-hover:translate-x-1 group-hover:text-purple-400" />
        </div>
      </div>
    </div>
  )
}
