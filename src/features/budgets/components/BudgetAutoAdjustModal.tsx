import { useState, useCallback } from 'react'
import { X, Loader2, TrendingUp, AlertTriangle, CheckCircle2, Sliders } from 'lucide-react'
import { useAutoAdjustBudget } from '../hooks/useBudgets'
import type { AutoAdjustResponse } from '@/types/budgets'

interface BudgetAutoAdjustModalProps {
  budgetId: string
  budgetName: string
  autoAdjustEnabled: boolean
  isOpen: boolean
  onClose: () => void
}

function formatCurrency(value: string | number) {
  const num = typeof value === 'string' ? Number(value) : value
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num)
}

export default function BudgetAutoAdjustModal({
  budgetId, budgetName, autoAdjustEnabled, isOpen, onClose,
}: BudgetAutoAdjustModalProps) {
  const [bufferPct, setBufferPct] = useState(10)
  const adjustMutation = useAutoAdjustBudget()
  const [preview, setPreview] = useState<AutoAdjustResponse | null>(null)
  const [applied, setApplied] = useState(false)

  const handlePreview = useCallback(async () => {
    const result = await adjustMutation.mutateAsync({ id: budgetId, data: { buffer_pct: bufferPct, apply: false } })
    setPreview(result)
    setApplied(false)
  }, [budgetId, bufferPct, adjustMutation])

  const handleApply = useCallback(async () => {
    const result = await adjustMutation.mutateAsync({ id: budgetId, data: { buffer_pct: bufferPct, apply: true } })
    setPreview(result)
    setApplied(true)
  }, [budgetId, bufferPct, adjustMutation])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-600/5 pointer-events-none" />

        <div className="relative p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
                <Sliders className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  Auto-ajuste
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {budgetName}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {!autoAdjustEnabled && (
            <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-500/10 rounded-xl border border-amber-200 dark:border-amber-500/20 mb-4">
              <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                  Auto-ajuste no habilitado
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  Activa la opcion de auto-ajuste en la configuracion del presupuesto para usar esta funcion.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Margen de seguridad: {bufferPct}%
              </label>
              <input
                type="range"
                min={0}
                max={50}
                value={bufferPct}
                onChange={(e) => setBufferPct(Number(e.target.value))}
                disabled={!autoAdjustEnabled}
                className="w-full h-2 appearance-none bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-500 [&::-webkit-slider-thumb]:border-2
                  [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Margen de seguridad"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0% (Sin margen)</span>
                <span>50% (Amplio margen)</span>
              </div>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Basado en tus gastos de los ultimos periodos, el sistema sugerira un monto ajustado
              que refleje tu gasto real mas un margen de seguridad de {bufferPct}%.
            </p>

            {!preview && (
              <button
                type="button"
                onClick={handlePreview}
                disabled={!autoAdjustEnabled || adjustMutation.isPending}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 rounded-xl hover:bg-violet-100 dark:hover:bg-violet-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {adjustMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <TrendingUp className="h-4 w-4" />
                )}
                Ver sugerencia
              </button>
            )}
          </div>

          {preview && (
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Monto actual</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {formatCurrency(preview.current_amount)}
                  </span>
                </div>
                {preview.average_spending && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Gasto promedio</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(preview.average_spending)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Monto sugerido
                  </span>
                  <span className="text-lg font-bold text-violet-600 dark:text-violet-400">
                    {formatCurrency(preview.suggested_amount)}
                  </span>
                </div>
                {preview.periods_analyzed && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Periodos analizados</span>
                    <span className="text-xs font-medium text-gray-500">{preview.periods_analyzed}</span>
                  </div>
                )}
              </div>

              {applied ? (
                <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-200 dark:border-emerald-500/20">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                      Ajuste aplicado!
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                      El presupuesto se actualizo de {formatCurrency(preview.current_amount)} a {formatCurrency(preview.suggested_amount)}
                    </p>
                  </div>
                </div>
              ) : preview.message ? (
                <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-200 dark:border-blue-500/20">
                  <TrendingUp className="h-5 w-5 text-blue-500 shrink-0" />
                  <p className="text-sm text-blue-800 dark:text-blue-300">{preview.message}</p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleApply}
                  disabled={adjustMutation.isPending}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  {adjustMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  Aplicar ajuste
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
