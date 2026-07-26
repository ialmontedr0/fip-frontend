import { useState } from 'react'
import { Eye, Trash2 } from 'lucide-react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { TRIGGER_CONFIG, ACTION_CONFIG } from '../constants'
import ActiveToggle from './ActiveToggle'
import ManualExecuteButton from './ManualExecuteButton'
import AutomationCard from './AutomationCard'
import AutomationEmptyState from './AutomationEmptyState'
import { Skeleton, ErrorMessage } from '@/components/ui'
import type { AutomationRule } from '@/types/automations'

interface AutomationListTableProps {
  rules: AutomationRule[] | undefined
  isLoading: boolean
  isError: boolean
  onRetry: () => void
  onSelect: (rule: AutomationRule) => void
  onDelete: (rule: AutomationRule) => void
  onToggle: (rule: AutomationRule, active: boolean) => void
  onExecute: (ruleId: string) => Promise<any>
  executePending?: boolean
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm animate-pulse relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent shimmer" />
          <div className="flex items-center gap-4 relative">
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" className="h-4 w-40" />
              <Skeleton variant="text" className="h-3 w-64" />
            </div>
            <Skeleton variant="text" className="h-6 w-20" />
            <Skeleton variant="text" className="h-6 w-20" />
            <Skeleton variant="text" className="h-6 w-16" />
            <Skeleton variant="text" className="h-6 w-16" />
            <Skeleton variant="text" className="h-6 w-10" />
            <Skeleton variant="text" className="h-6 w-24" />
          </div>
        </div>
      ))}
    </div>
  )
}

function DeleteConfirmButton({ rule, onDelete }: { rule: AutomationRule; onDelete: (rule: AutomationRule) => void }) {
  const [confirming, setConfirming] = useState(false)

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5 animate-fade-in">
        <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Eliminar?</span>
        <button
          onClick={() => { onDelete(rule); setConfirming(false) }}
          className="rounded-lg px-2 py-1 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200/50 dark:border-red-500/30 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all hover:scale-105 active:scale-95"
        >
          Si
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="rounded-lg px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all hover:scale-105 active:scale-95"
        >
          No
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all hover:scale-110 active:scale-90"
      title="Eliminar"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  )
}

function DesktopTable({ rules, onSelect, onDelete, onToggle, onExecute, executePending }: {
  rules: AutomationRule[]
  onSelect: (rule: AutomationRule) => void
  onDelete: (rule: AutomationRule) => void
  onToggle: (rule: AutomationRule, active: boolean) => void
  onExecute: (ruleId: string) => Promise<any>
  executePending?: boolean
}) {
  return (
    <div className="space-y-2">
      {rules.map((rule, index) => {
        const triggerCfg = TRIGGER_CONFIG[rule.trigger_type as keyof typeof TRIGGER_CONFIG]
        const actionCfg = ACTION_CONFIG[rule.action_type as keyof typeof ACTION_CONFIG]
        return (
          <div
            key={rule.id}
            onClick={() => onSelect(rule)}
            className="group relative overflow-hidden rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-purple-200/50 dark:hover:border-purple-500/30 cursor-pointer group-hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/0 to-purple-500/0 group-hover:from-purple-500/[0.02] group-hover:via-transparent group-hover:to-purple-500/[0.02] transition-all duration-500" />
            <div className="flex items-center gap-4 relative">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors duration-300">
                  {rule.name}
                </p>
                {rule.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                    {rule.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                {triggerCfg && (() => {
                  const TriggerIcon = triggerCfg.icon
                  return (
                    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-200/30 dark:border-purple-500/20 shadow-sm"
                    >
                      <TriggerIcon className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                      {triggerCfg.label}
                    </span>
                  )
                })()}

                {actionCfg && (() => {
                  const ActionIcon = actionCfg.icon
                  return (
                    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-200/30 dark:border-blue-500/20 shadow-sm"
                    >
                      <ActionIcon className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                      {actionCfg.label}
                    </span>
                  )
                })()}

                <div className="text-right">
                  <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                    {rule.execution_count}
                  </p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">
                    {rule.last_executed_at
                      ? new Date(rule.last_executed_at).toLocaleDateString('es-DO', { day: 'numeric', month: 'short' })
                      : 'Nunca'}
                  </p>
                </div>

                <div onClick={(e) => e.stopPropagation()}>
                  <ActiveToggle
                    isActive={rule.is_active}
                    onChange={(active) => onToggle(rule, active)}
                  />
                </div>

                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <ManualExecuteButton
                    ruleId={rule.id}
                    onExecute={onExecute}
                    isPending={executePending || false}
                  />
                  <button
                    onClick={() => onSelect(rule)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-all hover:scale-110 active:scale-90"
                    title="Ver detalle"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <DeleteConfirmButton rule={rule} onDelete={onDelete} />
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function AutomationListTable({
  rules,
  isLoading,
  isError,
  onRetry,
  onSelect,
  onDelete,
  onToggle,
  onExecute,
  executePending,
}: AutomationListTableProps) {
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  if (isLoading) return <TableSkeleton />

  if (isError) {
    return (
      <ErrorMessage
        title="Error al cargar reglas"
        message="No se pudieron cargar las reglas de automatizacion. Verifica tu conexion e intenta de nuevo."
        onRetry={onRetry}
      />
    )
  }

  if (!rules || rules.length === 0) {
    return (
      <AutomationEmptyState
        onAction={() => onSelect({} as AutomationRule)}
      />
    )
  }

  if (isDesktop) {
    return <DesktopTable rules={rules} onSelect={onSelect} onDelete={onDelete} onToggle={onToggle} onExecute={onExecute} executePending={executePending} />
  }

  return (
    <div className="space-y-3">
      {rules.map((rule) => (
        <AutomationCard
          key={rule.id}
          rule={rule}
          onToggle={(active) => onToggle(rule, active)}
          onExecute={() => onExecute(rule.id)}
          onSelect={() => onSelect(rule)}
        />
      ))}
    </div>
  )
}
