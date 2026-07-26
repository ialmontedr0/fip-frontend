import { Bell, Inbox, Eye, Sparkles } from 'lucide-react'

interface NotificationEmptyStateProps {
  filter?: string
  onAction?: () => void
}

export default function NotificationEmptyState({ filter, onAction }: NotificationEmptyStateProps) {
  const isUnread = filter === 'unread'

  return (
    <div className="relative flex flex-col items-center justify-center py-20 px-6 animate-fade-in">
      {/* Decorative orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="absolute h-48 w-48 rounded-full bg-purple-500/5 blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute h-36 w-36 rounded-full bg-indigo-500/5 blur-3xl animate-pulse" style={{ animationDuration: '8s', left: 40, top: -20 }} />
        <div className="absolute h-28 w-28 rounded-full bg-violet-500/5 blur-3xl animate-pulse" style={{ animationDuration: '10s', right: -30, bottom: -10 }} />
      </div>

      {/* Animated icon container */}
      <div className="relative mb-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-500/10 via-violet-400/10 to-indigo-500/10 backdrop-blur-xl border border-purple-200/30 dark:border-purple-500/20 shadow-xl">
          {isUnread ? (
            <Eye className="h-11 w-11 text-purple-400 dark:text-purple-300 animate-pulse-subtle" />
          ) : (
            <Inbox className="h-11 w-11 text-purple-400 dark:text-purple-300" />
          )}
        </div>
        {/* Floating sparkle */}
        <div className="absolute -top-2 -right-2 h-8 w-8 flex items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30 animate-float-slow">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        {/* Pulse ring */}
        <div className="absolute -inset-3 rounded-3xl border-2 border-purple-300/20 dark:border-purple-500/10 animate-ping-slow" />
      </div>

      {/* Text */}
      <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">
        {isUnread ? '¡Todo al día!' : 'Bandeja vacía'}
      </h3>
      <p className="text-sm text-gray-400 dark:text-gray-500 text-center max-w-xs leading-relaxed">
        {isUnread
          ? 'No tienes notificaciones sin leer. Disfruta de la tranquilidad.'
          : 'Aún no hay notificaciones. Cuando recibas alguna, aparecerá aquí.'}
      </p>

      {onAction && isUnread && (
        <button
          onClick={onAction}
          className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-200"
        >
          <Bell className="h-4 w-4" />
          Ver todas las notificaciones
        </button>
      )}
    </div>
  )
}
