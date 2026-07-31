import { useState } from 'react'
import { cn, formatCurrency } from '@/lib/utils'
import { Skeleton, ErrorMessage, Button, Modal } from '@/components/ui'
import { useAutomation, useToggleRule, useDeleteRule, useExecuteRule } from '../hooks/useAutomations'
import { TRIGGER_CONFIG, ACTION_CONFIG, EXECUTION_STATUS_CONFIG } from '../constants'
import { Shield, Lock, Activity, Play, Edit3, Trash2, AlertTriangle } from 'lucide-react'

interface AutomationDetailPanelProps {
  ruleId: string
  onClose: () => void
  onEdit?: () => void
}

function ActiveToggle({ isActive, onToggle, isLoading }: { isActive: boolean; onToggle: () => void; isLoading: boolean }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={isLoading}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300',
        isActive ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30' : 'bg-gray-300 dark:bg-gray-600',
      )}
    >
      <span
        className={cn(
          'inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300',
          isActive ? 'translate-x-6' : 'translate-x-1',
        )}
      />
    </button>
  )
}

function AutomationDetailPanel({ ruleId, onClose, onEdit }: AutomationDetailPanelProps) {
  const { data: rule, isLoading, isError, refetch } = useAutomation(ruleId)
  const toggleMutation = useToggleRule()
  const deleteMutation = useDeleteRule()
  const executeMutation = useExecuteRule()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm transition-all duration-300">
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="space-y-3 pt-4">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !rule) {
    return <ErrorMessage message="No se pudo cargar la regla" onRetry={() => refetch()} />
  }

  const triggerConfig = TRIGGER_CONFIG[rule.trigger_type]
  const actionConfig = ACTION_CONFIG[rule.action_type]
  const TriggerIcon = triggerConfig.icon
  const ActionIcon = actionConfig.icon

  const conditions = rule.trigger_conditions as Record<string, unknown> | null
  const params = rule.action_params as Record<string, unknown> | null

  const formatConditionValue = (key: string, value: unknown): string => {
    if (key === 'months' && Array.isArray(value)) return value.join(', ')
    if (key === 'direction' && value === 'above') return 'Por encima'
    if (key === 'direction' && value === 'below') return 'Por debajo'
    if (typeof value === 'number') return String(value)
    if (typeof value === 'string') return value
    return JSON.stringify(value)
  }

  return (
    <div className="rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
      <div className="h-0.5 w-16 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 mb-5" />
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent truncate">{rule.name}</h2>
            {rule.description && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{rule.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <ActiveToggle
              isActive={rule.is_active}
              onToggle={() => toggleMutation.mutate(rule.id)}
              isLoading={toggleMutation.isPending}
            />
            <span className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold',
              rule.is_active
                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
            )}>
              <span className={cn('h-1.5 w-1.5 rounded-full', rule.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400')} />
              {rule.is_active ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
          <div className="rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-emerald-200/50 dark:hover:border-emerald-500/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg shadow-emerald-500/20">
                <TriggerIcon className="h-4 w-4 text-white" />
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Disparador</span>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{triggerConfig.label}</p>
              </div>
            </div>
            {conditions && (
              <div className="ml-11 space-y-1.5">
                {Object.entries(conditions).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2 text-sm group/cond">
                    <span className="h-1 w-1 rounded-full bg-emerald-400/50 group-hover/cond:bg-emerald-500 transition-colors" />
                    <span className="text-gray-500 dark:text-gray-400 font-medium capitalize">{key}:</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-200">{formatConditionValue(key, value)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-blue-200/50 dark:hover:border-blue-500/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 shadow-lg shadow-blue-500/20">
                <ActionIcon className="h-4 w-4 text-white" />
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Accion</span>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{actionConfig.label}</p>
              </div>
            </div>
            {params && (
              <div className="ml-11 space-y-1.5">
                {Object.entries(params).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2 text-sm group/param">
                    <span className="h-1 w-1 rounded-full bg-blue-400/50 group-hover/param:bg-blue-500 transition-colors" />
                    <span className="text-gray-500 dark:text-gray-400 font-medium capitalize">{key.replace(/_/g, ' ')}:</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-200">
                      {key === 'amount' || key === 'custom_amount' || key === 'target_amount'
                        ? formatCurrency(value as number)
                        : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <div className="rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-amber-200/50 dark:hover:border-amber-500/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/20">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Salvaguardas</span>
            </div>
            <div className="ml-11 space-y-3">
              <div className="flex items-center gap-3 text-sm group/safe">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-500 transition-all duration-300 group-hover/safe:scale-110 group-hover/safe:shadow-lg group-hover/safe:shadow-amber-500/20">
                  <Lock className="h-3.5 w-3.5" />
                </div>
                <span className="text-gray-500 dark:text-gray-400">Ejecuciones por mes:</span>
                <span className="font-semibold text-gray-700 dark:text-gray-200">
                  {rule.max_executions_per_month ?? 'Sin limite'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm group/safe">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-500 transition-all duration-300 group-hover/safe:scale-110 group-hover/safe:shadow-lg group-hover/safe:shadow-amber-500/20">
                  <Lock className="h-3.5 w-3.5" />
                </div>
                <span className="text-gray-500 dark:text-gray-400">Saldo minimo requerido:</span>
                <span className="font-semibold text-gray-700 dark:text-gray-200">
                  {rule.min_balance_required != null ? formatCurrency(rule.min_balance_required) : 'Sin requisito'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-violet-200/50 dark:hover:border-violet-500/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 shadow-lg shadow-violet-500/20">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estadisticas</span>
            </div>
            <div className="ml-11 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-gray-50/50 dark:bg-gray-800/50 p-3 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                <span className="text-xs text-gray-500 dark:text-gray-400">Ejecuciones</span>
                <p className="text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">{rule.execution_count}</p>
              </div>
              <div className="rounded-xl bg-gray-50/50 dark:bg-gray-800/50 p-3 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                <span className="text-xs text-gray-500 dark:text-gray-400">Ultima ejecucion</span>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  {rule.last_executed_at
                    ? new Date(rule.last_executed_at).toLocaleDateString('es-DO', { day: 'numeric', month: 'short' })
                    : 'Nunca'}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50/50 dark:bg-gray-800/50 p-3 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                <span className="text-xs text-gray-500 dark:text-gray-400">Ultimo estado</span>
                {rule.last_execution_status ? (
                  <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold mt-1',
                    EXECUTION_STATUS_CONFIG[rule.last_execution_status].bgColor,
                    EXECUTION_STATUS_CONFIG[rule.last_execution_status].color,
                  )}>
                    <span className={cn('h-1.5 w-1.5 rounded-full', EXECUTION_STATUS_CONFIG[rule.last_execution_status].dotColor)} />
                    {EXECUTION_STATUS_CONFIG[rule.last_execution_status].label}
                  </span>
                ) : (
                  <p className="text-sm text-gray-500 mt-1">N/A</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
          <Button
            size="sm"
            onClick={() => executeMutation.mutate({ id: rule.id })}
            isLoading={executeMutation.isPending}
            className="group"
          >
            <Play className="mr-1.5 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
            Ejecutar ahora
          </Button>
          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit} className="group">
              <Edit3 className="mr-1.5 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              Editar
            </Button>
          )}
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
            isLoading={deleteMutation.isPending}
            className="group"
          >
            <Trash2 className="mr-1.5 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
            Eliminar
          </Button>
        </div>
      </div>

      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Confirmar eliminacion" size="sm">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-500/10 dark:to-red-500/5 shadow-lg shadow-red-500/20">
            <AlertTriangle className="h-7 w-7 text-red-500" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Esta accion no se puede deshacer.
          </p>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Se eliminara la regla &ldquo;{rule.name}&rdquo; permanentemente.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>Cancelar</Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                deleteMutation.mutate(rule.id)
                setShowDeleteConfirm(false)
                onClose()
              }}
              isLoading={deleteMutation.isPending}
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AutomationDetailPanel
