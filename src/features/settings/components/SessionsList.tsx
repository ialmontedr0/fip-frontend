import { cn } from '@/lib/utils'
import { Monitor, Smartphone, Globe, Loader2, LogOut, Trash2, AlertCircle } from 'lucide-react'
import { useSessions, useLogoutSession, useLogoutAllSessions } from '../hooks/useSettings'
import { Button, Skeleton } from '@/components/ui'
import type { SessionInfo } from '@/types/settings'

function SessionIcon({ deviceType }: { deviceType: string }) {
  const cls = 'h-4 w-4'
  switch (deviceType?.toLowerCase()) {
    case 'mobile': return <Smartphone className={cls} />
    case 'tablet': return <Smartphone className={cls} />
    case 'web': return <Globe className={cls} />
    default: return <Monitor className={cls} />
  }
}

function SessionRow({ session }: { session: SessionInfo }) {
  const logoutSession = useLogoutSession()

  return (
    <div
      className={cn(
        'flex items-center justify-between p-4 rounded-xl transition-colors',
        session.is_current
          ? 'bg-primary-50/50 dark:bg-primary-500/5 ring-1 ring-primary-200/50 dark:ring-primary-500/20'
          : 'bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-100/50 dark:hover:bg-gray-800/50',
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className={cn(
          'flex h-9 w-9 items-center justify-center rounded-xl shrink-0',
          session.is_current
            ? 'bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
        )}>
          <SessionIcon deviceType={session.device_type} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {session.device_name || 'Dispositivo desconocido'}
            </p>
            {session.is_current && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300 uppercase">
                Actual
              </span>
            )}
          </div>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 font-mono truncate">
            {session.ip_address} — {session.device_type}
          </p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500">
            Última actividad: {new Date(session.last_active_at).toLocaleString('es-DO', {
              month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
            })}
          </p>
        </div>
      </div>

      {!session.is_current && (
        <button
          onClick={() => logoutSession.mutate({ refresh_token: session.id })}
          disabled={logoutSession.isPending}
          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-40"
          title="Cerrar sesión"
        >
          {logoutSession.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin text-red-400" />
          ) : (
            <LogOut className="h-4 w-4 text-red-400" />
          )}
        </button>
      )}
    </div>
  )
}

export default function SessionsList() {
  const { data, isLoading } = useSessions()
  const logoutAll = useLogoutAllSessions()

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[72px] w-full rounded-xl" />
        ))}
      </div>
    )
  }

  const sessions = data?.sessions ?? []

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {data?.total ?? 0} sesión(es) activa(s)
        </p>
        {sessions.length > 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => logoutAll.mutate()}
            isLoading={logoutAll.isPending}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            Cerrar todas
          </Button>
        )}
      </div>

      {sessions.length === 0 ? (
        <div className="flex flex-col items-center py-8 text-gray-400">
          <AlertCircle className="h-8 w-8 mb-2" />
          <p className="text-sm font-medium">No hay sesiones activas</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sessions.map((session) => (
            <SessionRow key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  )
}
