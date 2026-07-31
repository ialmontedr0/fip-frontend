import { useState, useMemo, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Bell, CheckCheck, Trash2, Filter, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { useNotifications, useNotificationStats, useMarkRead, useMarkAllRead, useDeleteNotification, useDeleteRead } from '../hooks/useNotifications'
import NotificationItem from '../components/NotificationItem'
import NotificationStats from '../components/NotificationStats'
import NotificationFilters from '../components/NotificationFilters'
import NotificationEmptyState from '../components/NotificationEmptyState'
import LoadingSkeleton from '../components/LoadingSkeleton'

const PAGE_SIZE = 15

export default function NotificationsPage() {
  const [page, setPage] = useState(1)
  const [typeFilter, setTypeFilter] = useState('')
  const [channelFilter, setChannelFilter] = useState('')
  const [readFilter, setReadFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const queryParams = useMemo(() => {
    const params: Record<string, unknown> = { limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE }
    if (readFilter === 'true') params.is_read = true
    else if (readFilter === 'false') params.is_read = false
    if (typeFilter) params.type = typeFilter
    if (channelFilter) params.channel = channelFilter
    return params
  }, [page, typeFilter, channelFilter, readFilter])

  const { data: notifData, isLoading } = useNotifications(queryParams)
  const { data: stats } = useNotificationStats()
  const markRead = useMarkRead()
  const markAllRead = useMarkAllRead()
  const deleteNotif = useDeleteNotification()
  const deleteRead = useDeleteRead()

  const notifications = notifData?.notifications ?? []
  const total = notifData?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const hasUnread = (stats?.unread ?? 0) > 0
  const hasRead = (stats?.total ?? 0) > (stats?.unread ?? 0)

  const clearFilters = useCallback(() => {
    setTypeFilter('')
    setChannelFilter('')
    setReadFilter('')
    setPage(1)
  }, [])

  return (
    <div className="relative mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Enhanced decorative orbs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -right-40 top-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute top-1/3 left-1/2 h-32 w-32 rounded-full bg-pink-500/5 blur-2xl animate-pulse" style={{ animationDuration: '12s' }} />
      </div>

      {/* Header */}
      <div className="mb-8 relative">
        {/* Gradient accent line */}
        <div className="absolute -top-4 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-xl shadow-purple-500/30">
                <Bell className="h-7 w-7 text-white drop-shadow-sm" />
              </div>
              {stats && stats.unread > 0 && (
                <div className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-lg shadow-red-500/40 animate-pulse-subtle">
                  {stats.unread > 9 ? '9+' : stats.unread}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Notificaciones</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                {stats
                  ? `${stats.total} totales · ${stats.unread} pendientes`
                  : 'Gestiona todas tus notificaciones'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200',
                showFilters
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/60 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-750 hover:shadow-md hover:-translate-y-0.5 active:scale-95',
              )}
            >
              <Filter className="h-3.5 w-3.5" />
              Filtros
            </button>
            {hasRead && (
              <button
                onClick={() => deleteRead.mutate()}
                disabled={deleteRead.isPending}
                className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Borrar leidas
              </button>
            )}
            {hasUnread && (
              <button
                onClick={() => markAllRead.mutate()}
                disabled={markAllRead.isPending}
                className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/60 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Leer todas
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6">
        <NotificationStats stats={stats} />
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6 animate-fade-in-up">
          <NotificationFilters
            typeFilter={typeFilter}
            onTypeFilterChange={(v) => { setTypeFilter(v); setPage(1) }}
            channelFilter={channelFilter}
            onChannelFilterChange={(v) => { setChannelFilter(v); setPage(1) }}
            readFilter={readFilter}
            onReadFilterChange={(v) => { setReadFilter(v); setPage(1) }}
          />
        </div>
      )}

      {/* Results summary */}
      {!isLoading && notifications.length > 0 && (
        <div className="flex items-center gap-2 mb-4 px-1">
          <Sparkles className="h-3.5 w-3.5 text-purple-400" />
          <p className="text-xs font-medium text-gray-400 dark:text-gray-500">
            Mostrando {notifications.length} de {total} notificaciones
          </p>
        </div>
      )}

      {/* List */}
      <div className="space-y-2.5">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ animationDelay: `${i * 50}ms` }}>
                <LoadingSkeleton />
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="animate-fade-in">
            <NotificationEmptyState
              filter={readFilter === 'false' ? 'unread' : 'all'}
              onAction={clearFilters}
            />
          </div>
        ) : (
          <div className="space-y-2.5">
            {notifications.map((n, i) => (
              <div
                key={n.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 30}ms`, animationFillMode: 'backwards' }}
              >
                <NotificationItem
                  notification={n}
                  onMarkRead={(id) => markRead.mutate(id)}
                  onDelete={(id) => deleteNotif.mutate(id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={cn(
                'flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200',
                page === 1
                  ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50'
                  : 'bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/60 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 hover:shadow-lg hover:-translate-y-0.5 active:scale-95',
              )}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .map((p, idx, arr) => (
                  <span key={p} className="contents">
                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                      <span className="flex items-center justify-center w-6 text-gray-300 dark:text-gray-600 text-xs font-bold tracking-widest">...</span>
                    )}
                    <button
                      onClick={() => setPage(p)}
                      className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition-all duration-200',
                        p === page
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/25 scale-110'
                          : 'bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/60 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-750 hover:shadow-md hover:-translate-y-0.5 active:scale-90',
                      )}
                    >
                      {p}
                    </button>
                  </span>
                ))}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={cn(
                'flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200',
                page === totalPages
                  ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50'
                  : 'bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/60 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 hover:shadow-lg hover:-translate-y-0.5 active:scale-95',
              )}
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
            Página {page} de {totalPages}
          </p>
        </div>
      )}
    </div>
  )
}
