import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { cn, formatCurrency, formatISODate } from '@/lib/utils'
import {
  ArrowLeft, Edit3, Trash2, ToggleLeft, ToggleRight,
  Calendar, Repeat, Clock, Activity, RefreshCw,
} from 'lucide-react'
import { Button, Skeleton, Modal } from '@/components/ui'
import { useRecurring, useUpdateRecurring, useDeleteRecurring } from '../hooks/useRecurring'
import { TRANSACTION_TYPE_CONFIG, RECURRING_FREQUENCY_CONFIG } from '../constants'
import RecurringForm from '../components/RecurringForm'
import type { CreateRecurringRequest } from '@/types/transactions'

export default function RecurringDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: recurring, isLoading, isError, refetch } = useRecurring(id)
  const updateRecurring = useUpdateRecurring()
  const deleteRecurring = useDeleteRecurring()
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-48 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    )
  }

  if (isError || !recurring) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <p className="text-gray-500 dark:text-gray-400 mb-4">Patron recurrente no encontrado</p>
        <Button variant="outline" onClick={() => refetch()} className="rounded-xl">
          <RefreshCw className="h-4 w-4 mr-2" /> Reintentar
        </Button>
      </div>
    )
  }

  const typeConfig = TRANSACTION_TYPE_CONFIG[recurring.transaction_type as keyof typeof TRANSACTION_TYPE_CONFIG]
  const freqConfig = RECURRING_FREQUENCY_CONFIG[recurring.frequency as keyof typeof RECURRING_FREQUENCY_CONFIG]
  const amount = parseFloat(recurring.amount)
  const isNegative = recurring.transaction_type === 'expense'

  const handleToggleActive = async () => {
    await updateRecurring.mutateAsync({ id: recurring.id, data: { is_active: !recurring.is_active } })
  }

  const handleEdit = async (data: CreateRecurringRequest) => {
    await updateRecurring.mutateAsync({
      id: recurring.id,
      data: {
        amount: data.amount,
        description: data.description,
        frequency: data.frequency,
        interval: data.interval,
        end_date: data.end_date || null,
        max_executions: data.max_executions || null,
        is_active: recurring.is_active,
      },
    })
    setIsEditing(false)
  }

  const handleDelete = async () => {
    await deleteRecurring.mutateAsync(recurring.id)
    navigate('/transactions/recurring')
  }

  if (isEditing) {
    return (
      <div className="relative min-h-screen">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-purple-200/20 blur-3xl" />
        </div>
        <div className="relative max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsEditing(false)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Editar Patron Recurrente</h1>
              <p className="text-sm text-gray-500">{recurring.description}</p>
            </div>
          </div>
          <div className="rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm p-6">
            <RecurringForm defaultValues={recurring} onSubmit={handleEdit} isLoading={updateRecurring.isPending} isEdit />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-purple-200/20 dark:bg-purple-500/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-200/20 dark:bg-blue-500/5 blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto space-y-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4 min-w-0">
            <button onClick={() => navigate('/transactions/recurring')}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate">{recurring.description}</h1>
                <span className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
                  recurring.is_active
                    ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500',
                )}>
                  <Activity className={cn('h-3 w-3', recurring.is_active ? 'text-emerald-500' : 'text-gray-400')} />
                  {recurring.is_active ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Cada {recurring.interval > 1 ? `${recurring.interval} ` : ''}{freqConfig?.label?.toLowerCase() || recurring.frequency}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleToggleActive}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all"
              title={recurring.is_active ? 'Desactivar' : 'Activar'}>
              {recurring.is_active ? <ToggleLeft className="h-4 w-4" /> : <ToggleRight className="h-4 w-4" />}
            </button>
            <button onClick={() => setIsEditing(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-all">
              <Edit3 className="h-4 w-4" />
            </button>
            <button onClick={() => setShowDeleteModal(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm overflow-hidden">
          <div className={cn('h-2 bg-gradient-to-r', typeConfig?.gradient)} />
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={cn('flex h-14 w-14 items-center justify-center rounded-2xl', typeConfig?.bgColor)}>
                  {typeConfig && <typeConfig.icon className={cn('h-7 w-7', typeConfig.color)} />}
                </div>
                <div>
                  <p className={cn('text-lg font-bold', typeConfig?.color)}>
                    {isNegative ? '−' : '+'}{formatCurrency(amount, recurring.currency_code)}
                  </p>
                  <p className="text-xs text-gray-400">{recurring.transaction_type === 'income' ? 'Ingreso' : 'Gasto'} recurrente</p>
                </div>
              </div>
              <div className="text-right text-sm text-gray-500">
                <p>#{recurring.id.slice(0, 8)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-2.5">
                <Repeat className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-[11px] font-medium text-gray-400 uppercase">Frecuencia</p>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Cada {recurring.interval > 1 ? `${recurring.interval} ` : ''}{freqConfig?.label?.toLowerCase() || recurring.frequency}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-[11px] font-medium text-gray-400 uppercase">Inicio</p>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {formatISODate(recurring.start_date)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-[11px] font-medium text-gray-400 uppercase">Proxima Ejecucion</p>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {formatISODate(recurring.next_execution_date)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Activity className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-[11px] font-medium text-gray-400 uppercase">Ejecuciones</p>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {recurring.execution_count}{recurring.max_executions ? ` / ${recurring.max_executions}` : ''}
                  </p>
                </div>
              </div>
              {recurring.end_date && (
                <div className="flex items-start gap-2.5">
                  <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-medium text-gray-400 uppercase">Fecha Fin</p>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {formatISODate(recurring.end_date)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} size="sm">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/10">
              <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Eliminar Patron</h3>
              <p className="text-sm text-gray-500">Esta accion no afecta las transacciones ya creadas por este patron.</p>
            </div>
          </div>
          <div className="flex gap-3 justify-end mt-6">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)} className="rounded-xl">Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete} isLoading={deleteRecurring.isPending} className="rounded-xl">
              <Trash2 className="h-4 w-4 mr-2" /> Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
