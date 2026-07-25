import { useParams, useNavigate } from 'react-router-dom'
import { useState, useMemo } from 'react'
import {
  ArrowLeft, Edit3, Trash2, Settings2, PiggyBank,
  Bell, ToggleLeft, ToggleRight,
} from 'lucide-react'
import BudgetNav from '../components/BudgetNav'
import BudgetProgressBar from '../components/BudgetProgressBar'
import BurnRateIndicator from '../components/BurnRateIndicator'
import BudgetAlertList from '../components/BudgetAlertList'
import BudgetRefreshButton from '../components/BudgetRefreshButton'
import BudgetAutoAdjustModal from '../components/BudgetAutoAdjustModal'
import { STATUS_CONFIG } from '../constants'
import {
  useBudget, useDeleteBudget, useUpdateBudget,
} from '../hooks/useBudgets'
import {
  useBudgetAlerts, useMarkAlertRead, useDismissAlert,
} from '../hooks/useBudgetAlerts'
import type { BudgetStatus } from '@/types/budgets'

function formatCurrency(value: string | number) {
  const num = typeof value === 'string' ? Number(value) : value
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num)
}

function getPeriodLabel(period: string) {
  const map: Record<string, string> = { weekly: 'Semanal', biweekly: 'Quincenal', monthly: 'Mensual', quarterly: 'Trimestral', yearly: 'Anual' }
  return map[period] || period
}

function getTypeLabel(type: string) {
  const map: Record<string, string> = { total: 'Total', category: 'Categoria', account: 'Cuenta' }
  return map[type] || type
}

function DetailPageSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-12 w-48 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gray-200 dark:bg-gray-700" />
          <div className="space-y-2 flex-1">
            <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  )
}

function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        Presupuesto no encontrado
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        El presupuesto que buscas no existe o fue eliminado.
      </p>
      <button
        type="button"
        onClick={() => navigate('/budgets')}
        className="px-4 py-2 text-sm font-medium text-white bg-violet-500 rounded-lg hover:bg-violet-600 transition-colors"
      >
        Volver a presupuestos
      </button>
    </div>
  )
}

export default function BudgetDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: budget, isLoading, isError } = useBudget(id)
  const { data: alertsData } = useBudgetAlerts({ budget_id: id })
  const deleteMutation = useDeleteBudget()
  const updateMutation = useUpdateBudget()
  const markReadMutation = useMarkAlertRead()
  const dismissMutation = useDismissAlert()
  const [autoAdjustOpen, setAutoAdjustOpen] = useState(false)

  const alerts = useMemo(() => alertsData?.alerts ?? [], [alertsData])

  const config = budget ? STATUS_CONFIG[budget.status as BudgetStatus] || STATUS_CONFIG.ok : STATUS_CONFIG.ok

  const handleDelete = async () => {
    if (!window.confirm(`Eliminar "${budget?.name}" permanentemente?`)) return
    await deleteMutation.mutateAsync(id!)
    navigate('/budgets')
  }

  const handleToggleActive = async () => {
    if (!budget) return
    await updateMutation.mutateAsync({ id: id!, data: { is_active: !budget.is_active } })
  }

  const handleToggleAutoAdjust = async () => {
    if (!budget) return
    await updateMutation.mutateAsync({ id: id!, data: { auto_adjust: !budget.auto_adjust } })
  }

  if (isLoading) return <><BudgetNav /><DetailPageSkeleton /></>
  if (isError || !budget) return <><BudgetNav /><NotFound /></>

  return (
    <div>
      <BudgetNav />

      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate('/budgets')}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a presupuestos
        </button>
      </div>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6 shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-lg"
              style={{ backgroundColor: budget.color ? `${budget.color}20` : undefined }}
            >
              <PiggyBank className="h-7 w-7" style={{ color: budget.color || undefined }} />
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {budget.name}
                </h1>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
                  {config.label}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {getTypeLabel(budget.budget_type)}
                {' · '}
                {getPeriodLabel(budget.period)}
                {budget.description && ` · ${budget.description}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <BudgetRefreshButton budgetId={budget.id} />
            <button
              type="button"
              onClick={() => navigate(`/budgets/${budget.id}/edit`)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Editar
            </button>
            <button
              type="button"
              onClick={() => setAutoAdjustOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-500/20 transition-colors"
            >
              <Settings2 className="h-3.5 w-3.5" />
              Auto-ajuste
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Eliminar
            </button>
          </div>
        </div>

        <div className="mt-6">
          <BudgetProgressBar
            pctUsed={budget.pct_used}
            spent={budget.spent}
            amount={budget.amount}
            remaining={budget.remaining}
            status={budget.status}
            size="lg"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
            <p className="text-xs text-gray-500 dark:text-gray-400">Presupuesto</p>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{formatCurrency(budget.amount)}</p>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
            <p className="text-xs text-gray-500 dark:text-gray-400">Gastado</p>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{formatCurrency(budget.spent)}</p>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
            <p className="text-xs text-gray-500 dark:text-gray-400">Restante</p>
            <p className={`text-sm font-bold ${Number(budget.remaining) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {formatCurrency(budget.remaining)}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
            <p className="text-xs text-gray-500 dark:text-gray-400">Uso</p>
            <p className={`text-sm font-bold ${config.textColor}`}>{budget.pct_used.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <BurnRateIndicator budget={budget} />

        {/* Settings panel */}
        <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            Configuracion
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Presupuesto activo</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{budget.is_active ? 'Activo y monitoreando gastos' : 'Pausado, no se evaluan gastos'}</p>
              </div>
              <button
                type="button"
                onClick={handleToggleActive}
                className={`p-1.5 rounded-lg transition-colors ${budget.is_active ? 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                {budget.is_active ? <ToggleRight className="h-6 w-6" /> : <ToggleLeft className="h-6 w-6" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Auto-ajuste</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{budget.auto_adjust ? 'Ajuste automatico habilitado' : 'Ajuste manual'}</p>
              </div>
              <button
                type="button"
                onClick={handleToggleAutoAdjust}
                className={`p-1.5 rounded-lg transition-colors ${budget.auto_adjust ? 'text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-500/10' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                {budget.auto_adjust ? <ToggleRight className="h-6 w-6" /> : <ToggleLeft className="h-6 w-6" />}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
              <span className="text-sm text-gray-600 dark:text-gray-400">Umbral de alerta</span>
              <span className={`text-sm font-bold ${budget.alert_threshold <= 60 ? 'text-emerald-500' : budget.alert_threshold <= 80 ? 'text-amber-500' : 'text-red-500'}`}>
                {budget.alert_threshold}%
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
              <span className="text-sm text-gray-600 dark:text-gray-400">Rollover</span>
              <span className={`text-sm font-bold ${budget.rollover ? 'text-emerald-500' : 'text-gray-400'}`}>
                {budget.rollover ? 'Activado' : 'Desactivado'}
              </span>
            </div>

            {budget.strategy && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                <span className="text-sm text-gray-600 dark:text-gray-400">Estrategia</span>
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100 capitalize">
                  {budget.strategy.replace('_', ' ')}
                </span>
              </div>
            )}

            {budget.unread_alerts !== undefined && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                <span className="text-sm text-gray-600 dark:text-gray-400">Alertas sin leer</span>
                <span className={`text-sm font-bold ${(budget.unread_alerts ?? 0) > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                  {budget.unread_alerts ?? 0}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Alertas
          </h3>
        </div>

        <BudgetAlertList
          alerts={alerts}
          isLoading={false}
          onMarkRead={(alertId) => markReadMutation.mutate({ alert_id: alertId })}
          onMarkAllRead={() => markReadMutation.mutate({ mark_all: true })}
          onDismiss={(alertId) => dismissMutation.mutate(alertId)}
        />
      </div>

      <BudgetAutoAdjustModal
        budgetId={budget.id}
        budgetName={budget.name}
        autoAdjustEnabled={budget.auto_adjust}
        isOpen={autoAdjustOpen}
        onClose={() => setAutoAdjustOpen(false)}
      />
    </div>
  )
}
