import { Activity, CheckCircle2, XCircle, RefreshCw, Server } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useHealthCheck } from '../hooks/useHealthCheck'

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const parts: string[] = []
  if (d > 0) parts.push(`${d}d`)
  if (h > 0) parts.push(`${h}h`)
  parts.push(`${m}m`)
  return parts.join(' ')
}

function StatusBadge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      {ok ? (
        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
      ) : (
        <XCircle className="h-4 w-4 text-red-500 shrink-0" />
      )}
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      <span className={cn(
        'ml-auto text-xs font-semibold uppercase tracking-wider',
        ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400',
      )}>
        {ok ? 'OK' : 'ERROR'}
      </span>
    </div>
  )
}

export default function HealthStatusCard() {
  const { data, isLoading, isError, error, refetch, isFetching } = useHealthCheck()

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm animate-pulse">
        <div className="h-5 w-36 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200/80 dark:border-red-800/60 bg-red-50/80 dark:bg-red-950/80 backdrop-blur-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <XCircle className="h-5 w-5 text-red-500" />
          <h3 className="text-sm font-bold text-red-800 dark:text-red-300">Error de conexion</h3>
        </div>
        <p className="text-xs text-red-600 dark:text-red-400 mb-3">
          {error instanceof Error ? error.message : 'No se pudo obtener el estado del servidor'}
        </p>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={cn('h-3.5 w-3.5', isFetching && 'animate-spin')} />
          Reintentar
        </button>
      </div>
    )
  }

  if (!data) return null

  const overallOk = data.status === 'healthy'
  const dbOk = data.checks.database.status === 'ok'
  const redisOk = data.checks.redis.status === 'ok'
  const diskOk = data.checks.disk.status === 'ok'
  const memOk = data.checks.memory.status === 'ok'

  return (
    <div className="rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={cn(
            'flex h-8 w-8 items-center justify-center rounded-lg',
            overallOk
              ? 'bg-gradient-to-br from-emerald-500 to-green-600 shadow-emerald-500/20'
              : 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/20',
          )}>
            <Server className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Estado del Servidor</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            'text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full',
            overallOk
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
          )}>
            {data.status}
          </span>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            title="Refrescar"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', isFetching && 'animate-spin')} />
          </button>
        </div>
      </div>

      <div className="space-y-2.5">
        <StatusBadge ok={dbOk} label="Base de Datos" />
        <StatusBadge ok={redisOk} label={redisOk ? 'Redis' : `Redis: ${data.checks.redis.error}`} />
        <StatusBadge ok={diskOk} label={diskOk && data.checks.disk.free_gb != null ? `Disco (${data.checks.disk.free_gb.toFixed(1)} GB libres)` : data.checks.disk.error ? `Disco: ${data.checks.disk.error}` : 'Disco (sin datos)'} />
        <StatusBadge ok={memOk} label={memOk && data.checks.memory.percent_used != null ? `Memoria (${data.checks.memory.percent_used.toFixed(0)}% usado)` : data.checks.memory.error ? `Memoria: ${data.checks.memory.error}` : 'Memoria (sin datos)'} />
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px] text-gray-400">
        <div className="flex items-center gap-1.5">
          <Activity className="h-3 w-3" />
          <span>v{data.version}</span>
        </div>
        <span>{formatUptime(data.uptime_seconds)} uptime</span>
      </div>
    </div>
  )
}
