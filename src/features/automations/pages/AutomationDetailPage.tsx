import { useParams, useNavigate } from 'react-router-dom'
import BackButton from '@/features/ai/components/BackButton'
import AIPageHeader from '@/features/ai/components/AIPageHeader'
import AutomationNav from '../components/AutomationNav'
import AutomationDetailPanel from '../components/AutomationDetailPanel'
import ExecutionLogViewer from '../components/ExecutionLogViewer'
import { useAutomation, useExecutionLogs } from '../hooks/useAutomations'
import { Skeleton } from '@/components/ui'
import { ErrorMessage } from '@/components/ui'
import { Zap, History } from 'lucide-react'
import { cn } from '@/lib/utils'

function AutomationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: rule, isLoading, isError, refetch } = useAutomation(id)
  const { data: logsData, isLoading: logsLoading, isError: logsError, refetch: refetchLogs } = useExecutionLogs(
    id ? { rule_id: id, limit: 10 } : undefined,
  )

  if (isLoading) {
    return (
      <div className="relative space-y-6 animate-fade-in">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-500/15 animate-[pulse_6s_ease-in-out_infinite]" />
          <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-indigo-500/8 blur-3xl dark:bg-indigo-500/12 animate-[pulse_8s_ease-in-out_infinite]" />
          <div className="absolute left-1/4 bottom-0 h-64 w-64 rounded-full bg-violet-500/5 blur-3xl dark:bg-violet-500/8 animate-[pulse_10s_ease-in-out_infinite]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-transparent via-transparent to-gray-100/50 dark:to-gray-950/50" />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-1 flex-1">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-3 w-64" />
          </div>
        </div>

        <div className="h-0.5 w-full rounded-full bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-transparent" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-xl" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-40" />
                  </div>
                </div>
                <div className="ml-11 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-xl" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-36" />
                  </div>
                </div>
                <div className="ml-11 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-xl" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-5 w-48" />
                </div>
              </div>
              <div className="mt-4 ml-11 grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-7 w-10" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-14" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-5 w-12" />
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (isError || !rule) {
    return (
      <div className="relative space-y-6 animate-fade-in">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-500/15 animate-[pulse_6s_ease-in-out_infinite]" />
          <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-indigo-500/8 blur-3xl dark:bg-indigo-500/12 animate-[pulse_8s_ease-in-out_infinite]" />
          <div className="absolute left-1/4 bottom-0 h-64 w-64 rounded-full bg-violet-500/5 blur-3xl dark:bg-violet-500/8 animate-[pulse_10s_ease-in-out_infinite]" />
        </div>
        <div className="rounded-2xl border border-red-100/80 dark:border-red-900/30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm">
          <ErrorMessage message="No se pudo cargar la regla" onRetry={() => refetch()} />
        </div>
      </div>
    )
  }

  return (
    <div className="relative space-y-6 pb-8 animate-fade-in">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-500/15 animate-[pulse_6s_ease-in-out_infinite]" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-indigo-500/8 blur-3xl dark:bg-indigo-500/12 animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute left-1/4 bottom-0 h-64 w-64 rounded-full bg-violet-500/5 blur-3xl dark:bg-violet-500/8 animate-[pulse_10s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-transparent via-transparent to-gray-100/50 dark:to-gray-950/50" />
      </div>

      <div className="flex items-center gap-2">
        <BackButton to="/automations" />
        <AIPageHeader
          title={rule.name || 'Detalle'}
          subtitle="Detalle de la regla de automatizacion"
          icon={<Zap className="h-6 w-6 text-white" />}
          className="flex-1"
        />
        <div className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shrink-0',
          rule.is_active
            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
        )}>
          <span className={cn('h-2 w-2 rounded-full animate-pulse', rule.is_active ? 'bg-emerald-500' : 'bg-gray-400')} />
          {rule.is_active ? 'Activo' : 'Inactivo'}
        </div>
      </div>

      <div className="h-0.5 w-full rounded-full bg-gradient-to-r from-purple-500/50 via-indigo-500/50 to-transparent" />

      <AutomationNav />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {id && <AutomationDetailPanel ruleId={id} onClose={() => navigate('/automations')} onEdit={() => navigate(`/automations/${id}/edit`)} />}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/20">
              <History className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Logs de ejecucion</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Ultimas 10 ejecuciones</p>
            </div>
          </div>
          <ExecutionLogViewer
            logs={logsData?.logs ?? []}
            isLoading={logsLoading}
            isError={logsError}
            onRetry={() => refetchLogs()}
            ruleId={id}
          />
        </div>
      </div>
    </div>
  )
}

export default AutomationDetailPage
