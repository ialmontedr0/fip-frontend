import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { X, CheckCheck, Bell, Settings, ChevronRight, Inbox } from 'lucide-react'
import { useNotifications, useNotificationStats, useMarkRead, useBulkMarkRead, useDeleteNotification } from '../hooks/useNotifications'
import NotificationItem from './NotificationItem'
import { Skeleton } from '@/components/ui'
import type { Notification } from '@/types/notifications'

interface NotificationDrawerProps {
  open: boolean
  onClose: () => void
}

export default function NotificationDrawer({ open, onClose }: NotificationDrawerProps) {
  const navigate = useNavigate()
  const drawerRef = useRef<HTMLDivElement>(null)
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('unread')
  const [animatingIn, setAnimatingIn] = useState(false)

  const { data: stats } = useNotificationStats()
  const { data: notifData, isLoading } = useNotifications(
    activeFilter === 'unread' ? { is_read: false, limit: 50 } : { limit: 50 },
  )
  const markRead = useMarkRead()
  const bulkMarkRead = useBulkMarkRead()
  const deleteNotif = useDeleteNotification()

  const notifications = notifData?.notifications ?? []
  const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id)

  useEffect(() => {
    if (open) {
      setAnimatingIn(true)
      setTimeout(() => setAnimatingIn(false), 300)
    }
  }, [open])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      document.addEventListener('keydown', handleKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    if (open) setTimeout(() => document.addEventListener('mousedown', handleClick), 50)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open, onClose])

  const handleClick = (notification: Notification) => {
    if (!notification.is_read) markRead.mutate(notification.id)
    if (notification.data?.link) {
      navigate(notification.data.link as string)
      onClose()
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop with blur */}
      <div
        className={cn(
          'fixed inset-0 transition-all duration-300',
          animatingIn ? 'bg-black/50 backdrop-blur-sm' : 'bg-black/40 backdrop-blur-sm',
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={cn(
          'relative z-50 flex w-full max-w-md flex-col',
          'bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl',
          'shadow-2xl shadow-black/20 dark:shadow-black/40',
          'border-l border-gray-200/60 dark:border-gray-700/60',
          'animate-in slide-in-from-right duration-300 ease-out',
        )}
      >
        {/* Gradient accent line at top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 via-violet-400 to-indigo-500" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200/70 dark:border-gray-700/60 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/25">
              <Bell className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">Notificaciones</h2>
              {stats && (
                <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-none mt-0.5">
                  {stats.unread} no leídas de {stats.total}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {unreadIds.length > 0 && (
              <button
                onClick={() => bulkMarkRead.mutate(unreadIds)}
                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-all active:scale-95"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Leer todas
              </button>
            )}
            <button
              onClick={() => { navigate('/settings/notifications'); onClose() }}
              className="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-90"
              title="Preferencias"
            >
              <Settings className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-90"
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100/70 dark:border-gray-700/40 bg-gray-50/50 dark:bg-gray-900/50">
          <button
            onClick={() => setActiveFilter('unread')}
            className={cn(
              'relative rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all duration-200',
              activeFilter === 'unread'
                ? 'text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
            )}
          >
            {activeFilter === 'unread' && (
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 shadow-md shadow-purple-500/25 animate-fade-in" />
            )}
            <span className="relative z-10">No leídas {stats ? `(${stats.unread})` : ''}</span>
          </button>
          <button
            onClick={() => setActiveFilter('all')}
            className={cn(
              'relative rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all duration-200',
              activeFilter === 'all'
                ? 'text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
            )}
          >
            {activeFilter === 'all' && (
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 shadow-md shadow-purple-500/25 animate-fade-in" />
            )}
            <span className="relative z-10">Todas</span>
          </button>
          <button
            onClick={() => { navigate('/notifications'); onClose() }}
            className="ml-auto inline-flex items-center gap-0.5 rounded-lg px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-all active:scale-95"
          >
            Ver todas
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          {isLoading ? (
            <div className="space-y-3 px-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-gray-100/80 dark:border-gray-700/60 bg-white/40 dark:bg-gray-800/40 p-4 animate-pulse"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <div className="space-y-2.5 flex-1">
                      <Skeleton className="h-4 w-3/4 rounded-lg" />
                      <Skeleton className="h-3 w-full rounded-lg" />
                      <div className="flex gap-3">
                        <Skeleton className="h-2.5 w-16 rounded" />
                        <Skeleton className="h-2.5 w-12 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
              <div className="relative mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10">
                  <Inbox className="h-10 w-10 text-purple-300 dark:text-purple-500/50" />
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-400 animate-ping-slow" />
              </div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                {activeFilter === 'unread' ? 'No tienes notificaciones sin leer' : 'Bandeja vacía'}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center max-w-[220px]">
                {activeFilter === 'unread'
                  ? 'Tus notificaciones sin leer aparecerán aquí'
                  : 'Las nuevas notificaciones aparecerán aquí'}
              </p>
              {activeFilter === 'unread' && (
                <button
                  onClick={() => setActiveFilter('all')}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all"
                >
                  Ver todas
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((n, i) => (
                <div
                  key={n.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'backwards' }}
                >
                  <NotificationItem
                    notification={n}
                    onMarkRead={(id) => markRead.mutate(id)}
                    onDelete={(id) => deleteNotif.mutate(id)}
                    onClick={handleClick}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Bottom fade gradient */}
          <div className="sticky bottom-0 h-8 bg-gradient-to-t from-white/80 dark:from-gray-900/80 to-transparent pointer-events-none -mx-4" />
        </div>
      </div>
    </div>
  )
}
