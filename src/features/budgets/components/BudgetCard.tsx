import { useNavigate } from 'react-router-dom'
import { PiggyBank, MoreHorizontal, Edit3, Trash2, RefreshCw, Eye } from 'lucide-react'
import { useState, useCallback } from 'react'
import BudgetProgressBar from './BudgetProgressBar'
import { STATUS_CONFIG } from '../constants'
import type { BudgetResponse, BudgetStatus } from '@/types/budgets'
import { useDeleteBudget, useRefreshBudget } from '../hooks/useBudgets'

interface BudgetCardProps {
  budget: BudgetResponse
  onDeleted?: () => void
}

function formatCurrency(value: string) {
  const num = Number(value)
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

export default function BudgetCard({ budget }: BudgetCardProps) {
  const navigate = useNavigate()
  const deleteMutation = useDeleteBudget()
  const refreshMutation = useRefreshBudget()
  const [menuOpen, setMenuOpen] = useState(false)

  const config = STATUS_CONFIG[budget.status as BudgetStatus] || STATUS_CONFIG.ok

  const handleDelete = useCallback(async () => {
    if (!window.confirm(`Eliminar "${budget.name}"?`)) return
    await deleteMutation.mutateAsync(budget.id)
  }, [budget.id, budget.name, deleteMutation])

  const handleRefresh = useCallback(async () => {
    await refreshMutation.mutateAsync(budget.id)
  }, [budget.id, refreshMutation])

  return (
    <div
      className="group relative bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-black/20 transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={() => navigate(`/budgets/${budget.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/budgets/${budget.id}`) }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-50/50 dark:to-gray-900/30 pointer-events-none" />

      <div className="relative p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: budget.color ? `${budget.color}20` : undefined }}
            >
              <PiggyBank className="h-5 w-5" style={{ color: budget.color || undefined }} />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                {budget.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {getTypeLabel(budget.budget_type)}
                {' · '}
                {getPeriodLabel(budget.period)}
              </p>
            </div>
          </div>

          <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Opciones"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-1 z-20 w-44 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl py-1">
                  <button
                    type="button"
                    onClick={() => { setMenuOpen(false); navigate(`/budgets/${budget.id}`) }}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    Ver detalle
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMenuOpen(false); navigate(`/budgets/${budget.id}/edit`) }}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <Edit3 className="h-4 w-4" />
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMenuOpen(false); handleRefresh() }}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Actualizar gastos
                  </button>
                  <hr className="my-1 border-gray-100 dark:border-gray-700" />
                  <button
                    type="button"
                    onClick={() => { setMenuOpen(false); handleDelete() }}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <BudgetProgressBar
          pctUsed={budget.pct_used}
          spent={budget.spent}
          amount={budget.amount}
          remaining={budget.remaining}
          status={budget.status}
          size="sm"
        />

        <div className="mt-3 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${config.bgColor} ${config.textColor}`}>
            {budget.status === 'ok' && '✓ '}
            {budget.status === 'warning' && '▲ '}
            {budget.status === 'exceeded' && '● '}
            {config.label}
          </span>
          <span>{formatCurrency(budget.spent)} gastado</span>
        </div>

        <div className="mt-3 flex items-center gap-3 flex-wrap">
          {budget.auto_adjust && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-violet-100 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400">
              Auto-ajuste
            </span>
          )}
          {budget.rollover && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
              Rollover
            </span>
          )}
          {budget.strategy && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
              {budget.strategy.replace('_', ' ')}
            </span>
          )}
          {!budget.is_active && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
              Inactivo
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
