import { Shield, Sparkles } from 'lucide-react'
import { TRIGGER_CONFIG, ACTION_CONFIG } from '../../constants'
import type { TriggerType, TriggerConditions, ActionType, ActionParams } from '@/types/automations'

interface StepReviewProps {
  name: string
  setName: (val: string) => void
  description: string
  setDescription: (val: string) => void
  selectedTrigger: TriggerType | null
  triggerConditions: TriggerConditions | null
  selectedAction: ActionType | null
  actionParams: ActionParams | null
  maxExecutions: number | null
  setMaxExecutions: (val: number | null) => void
  minBalance: number | null
  setMinBalance: (val: number | null) => void
}

function ConditionsSummary({ conditions }: { conditions: TriggerConditions | null }) {
  if (!conditions) return <span className="text-gray-400 italic">Sin condiciones</span>
  if ('min_amount' in conditions) {
    const c = conditions as any
    return <span>Mín. <strong>${c.min_amount ?? 0}</strong>{c.category_id ? ` · Categoría: ${c.category_id}` : ''}</span>
  }
  if ('account_id' in conditions && 'threshold' in conditions) {
    const c = conditions as any
    return <span>Cuenta: <strong>{c.account_id}</strong> {c.direction === 'above' ? '>' : '<'} <strong>${c.threshold}</strong></span>
  }
  if ('day_of_month' in conditions) {
    const c = conditions as any
    return <span>Día <strong>{c.day_of_month}</strong> · Meses: {c.months?.length ? c.months.join(', ') : 'Todos'}</span>
  }
  if ('card_id' in conditions) {
    const c = conditions as any
    return <span>Tarjeta: <strong>{c.card_id}</strong> · {c.days_before_due}d antes del vencimiento</span>
  }
  if ('budget_id' in conditions) {
    const c = conditions as any
    return <span>Presupuesto: <strong>{c.budget_id}</strong> · Umbral: <strong>{c.threshold_pct}%</strong></span>
  }
  if ('goal_id' in conditions) {
    const c = conditions as any
    return <span>Meta: <strong>{c.goal_id}</strong></span>
  }
  return <span className="text-gray-400 italic">Configuración personalizada</span>
}

function ParamsSummary({ params }: { params: ActionParams | null }) {
  if (!params) return <span className="text-gray-400 italic">Sin parámetros</span>
  if ('source_account_id' in params) {
    const p = params as any
    return <span><strong>{p.source_account_id}</strong> <span className="text-purple-400">→</span> <strong>{p.target_account_id}</strong> · <strong>${p.amount}</strong> ({p.amount_type})</span>
  }
  if ('card_id' in params) {
    const p = params as any
    return <span>Tarjeta: <strong>{p.card_id}</strong> · Pago: {p.payment_type}{p.custom_amount ? ` · <strong>$${p.custom_amount}</strong>` : ''}</span>
  }
  if ('account_id' in params && 'transaction_type' in params) {
    const p = params as any
    return <span><strong>{p.account_id}</strong> · <strong>${p.amount}</strong> ({p.transaction_type}){p.description ? ` · "${p.description}"` : ''}</span>
  }
  if ('message' in params) {
    const p = params as any
    return <span>{p.title || 'Notificación'} · Canal: {p.channel || 'push'} · "{p.message.substring(0, 40)}..."</span>
  }
  if ('budget_id' in params) {
    const p = params as any
    return <span>Presupuesto: <strong>{p.budget_id}</strong> · {p.adjustment_type} → <strong>${p.target_amount}</strong></span>
  }
  return <span className="text-gray-400 italic">Configuración personalizada</span>
}

export default function StepReview({
  name, setName, description, setDescription,
  selectedTrigger, triggerConditions,
  selectedAction, actionParams,
  maxExecutions, setMaxExecutions,
  minBalance, setMinBalance,
}: StepReviewProps) {
  const TriggerIcon = selectedTrigger ? TRIGGER_CONFIG[selectedTrigger]?.icon : null
  const ActionIcon = selectedAction ? ACTION_CONFIG[selectedAction]?.icon : null

  return (
    <div className="space-y-5">
      <div className="group">
        <div className="relative">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder=" "
            className="w-full px-4 pt-6 pb-2.5 rounded-2xl border-2 border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all peer"
            autoFocus
          />
          <label className="absolute left-4 top-2 text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 peer-focus:text-purple-500 transition-colors">
            Nombre <span className="text-red-400">*</span>
          </label>
        </div>
      </div>

      <div className="group">
        <div className="relative">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder=" "
            className="w-full px-4 pt-6 pb-2.5 rounded-2xl border-2 border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all resize-none peer"
          />
          <label className="absolute left-4 top-2 text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 peer-focus:text-purple-500 transition-colors">
            Descripción
          </label>
        </div>
      </div>

      {selectedTrigger && TriggerIcon && (
        <div className="rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm p-4 space-y-3 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-purple-200/50 dark:hover:border-purple-500/30">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg shadow-purple-500/20 text-white from-purple-400 to-indigo-600">
              <TriggerIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{TRIGGER_CONFIG[selectedTrigger].label}</div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-gray-400">Disparador</div>
            </div>
          </div>
          <div className="pl-13 text-xs text-gray-600 dark:text-gray-400 border-l-2 border-purple-200/50 dark:border-purple-500/30 ml-1 pl-3">
            <ConditionsSummary conditions={triggerConditions} />
          </div>
        </div>
      )}

      {selectedAction && ActionIcon && (
        <div className="rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm p-4 space-y-3 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-emerald-200/50 dark:hover:border-emerald-500/30">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg shadow-emerald-500/20 text-white from-emerald-400 to-green-600">
              <ActionIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{ACTION_CONFIG[selectedAction].label}</div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-gray-400">Acción</div>
            </div>
          </div>
          <div className="pl-13 text-xs text-gray-600 dark:text-gray-400 border-l-2 border-emerald-200/50 dark:border-emerald-500/30 ml-1 pl-3">
            <ParamsSummary params={actionParams} />
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-amber-100/80 dark:border-amber-700/30 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-900/10 dark:to-orange-900/10 backdrop-blur-xl p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/20">
            <Shield className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Salvaguardas
          </span>
          <Sparkles className="h-3 w-3 text-amber-400 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <label className="block text-[10px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
              Ejecuciones máx./mes
            </label>
            <input
              type="number"
              min={0}
              value={maxExecutions ?? ''}
              onChange={(e) => setMaxExecutions(e.target.value ? Number(e.target.value) : null)}
              placeholder="Sin límite"
              className="w-full px-3 py-2 rounded-xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-sm transition-all"
            />
          </div>
          <div className="relative">
            <label className="block text-[10px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
              Saldo mínimo
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">$</span>
              <input
                type="number"
                min={0}
                step="0.01"
                value={minBalance ?? ''}
                onChange={(e) => setMinBalance(e.target.value ? Number(e.target.value) : null)}
                placeholder="0.00"
                className="w-full pl-7 pr-3 py-2 rounded-xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-sm transition-all"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
