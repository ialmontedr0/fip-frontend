import { Play, Eye } from 'lucide-react'
import { TRIGGER_CONFIG, ACTION_CONFIG } from '../constants'
import ActiveToggle from './ActiveToggle'
import type { AutomationRule } from '@/types/automations'

interface AutomationCardProps {
  rule: AutomationRule
  onToggle: (active: boolean) => void
  onExecute: () => void
  onSelect: () => void
}

export default function AutomationCard({ rule, onToggle, onExecute, onSelect }: AutomationCardProps) {
  const triggerCfg = TRIGGER_CONFIG[rule.trigger_type as keyof typeof TRIGGER_CONFIG]
  const actionCfg = ACTION_CONFIG[rule.action_type as keyof typeof ACTION_CONFIG]

  return (
    <div
      onClick={onSelect}
      className="group relative overflow-hidden rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-purple-200/50 dark:hover:border-purple-500/30 cursor-pointer group-hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-transparent to-purple-500/0 group-hover:from-purple-500/[0.03] group-hover:to-purple-500/[0.03] transition-all duration-500" />
      <div className="flex items-start justify-between mb-3 relative">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors duration-300">
            {rule.name}
          </h3>
          {rule.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
              {rule.description}
            </p>
          )}
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <ActiveToggle
            isActive={rule.is_active}
            onChange={onToggle}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3 relative">
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
      </div>

      <div className="flex items-center justify-between relative">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <span className="font-semibold text-gray-900 dark:text-gray-100">{rule.execution_count}</span> ejecuciones
          {rule.last_executed_at && (
            <span className="ml-1">
              · {new Date(rule.last_executed_at).toLocaleDateString('es-DO', { day: 'numeric', month: 'short' })}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onExecute}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-2.5 py-1.5 text-xs font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.97] group/btn"
          >
            <Play className="h-3.5 w-3.5 group-hover/btn:rotate-12 transition-transform duration-300" />
            Ejecutar
          </button>
          <button
            onClick={onSelect}
            className="p-1.5 rounded-lg text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-all hover:scale-110 active:scale-90"
            title="Ver detalle"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
