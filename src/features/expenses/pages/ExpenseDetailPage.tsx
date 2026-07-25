import { useParams, useNavigate } from 'react-router-dom'
import { useExpense, useDeleteExpense } from '../hooks/useExpenses'
import { Button, Skeleton } from '@/components/ui'
import { ArrowLeft, Edit3, Trash2, Calendar, DollarSign, Tag, FileText, AlertCircle, TrendingDown } from 'lucide-react'
import PriorityBadge from '../components/PriorityBadge'
import { formatCurrency } from '@/lib/utils'

export default function ExpenseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: expense, isLoading, isError, refetch } = useExpense(id || '')
  const deleteMutation = useDeleteExpense()

  if (isLoading) {
    return (
      <div className="space-y-4 animate-fade-in">
        <Skeleton className="h-48 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>
    )
  }

  if (isError || !expense) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="rounded-full bg-red-100 dark:bg-red-500/10 p-4 mb-4">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <p className="text-red-500 font-medium mb-1">Error al cargar el gasto</p>
        <Button variant="outline" onClick={() => refetch()} className="rounded-xl mt-2">
          Reintentar
        </Button>
      </div>
    )
  }

  const handleDelete = () => {
    if (window.confirm(`Eliminar este gasto?`)) {
      deleteMutation.mutate(expense.id, { onSuccess: () => navigate('/expenses') })
    }
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 via-red-500 to-orange-600 p-6 text-white">
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/expenses')}
              className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm">
                <TrendingDown className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{expense.description}</h1>
                <p className="text-rose-100/80 text-sm">{expense.effective_date ? new Date(expense.effective_date).toLocaleDateString('es-DO') : ''}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => navigate(`/expenses/${expense.id}/edit`)}
              className="bg-white/10 hover:bg-white/20 text-white rounded-xl"
            >
              <Edit3 className="h-4 w-4 mr-1.5" /> Editar
            </Button>
            <Button
              variant="ghost"
              onClick={handleDelete}
              className="bg-white/10 hover:bg-red-500/30 text-white rounded-xl"
            >
              <Trash2 className="h-4 w-4 mr-1.5" /> Eliminar
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Detalles del Gasto</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Monto</p>
                <div className="flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4 text-red-500" />
                  <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{formatCurrency(expense.amount, expense.currency_code)}</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Fecha</p>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{expense.effective_date ? new Date(expense.effective_date).toLocaleDateString('es-DO') : ''}</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Prioridad</p>
                <PriorityBadge priority={expense.priority} showLabel />
              </div>
              {expense.category_id && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Categoria</p>
                  <div className="flex items-center gap-1.5">
                    <Tag className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{expense.category_id}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {expense.notes && (
            <div className="rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 p-5">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Notas</h2>
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{expense.notes}</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-5">
          {expense.account_id && (
            <div className="rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 p-5">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Cuenta</h2>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{expense.account_id}</p>
            </div>
          )}

          {expense.source && (
            <div className="rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 p-5">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Origen</h2>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{expense.source}</p>
            </div>
          )}

          {expense.transaction_type === 'recurring' && (
            <div className="rounded-2xl bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-700/30 p-5">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">Recurrente</h2>
              <p className="text-sm text-amber-600 dark:text-amber-300">Este gasto se marca como recurrente</p>
            </div>
          )}

          {expense.source === 'split' && (
            <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-500/5 border border-indigo-200 dark:border-indigo-700/30 p-5">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 mb-1">Dividido</h2>
              <p className="text-sm text-indigo-600 dark:text-indigo-300">Parte de un gasto dividido</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
