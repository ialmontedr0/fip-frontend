import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  ArrowLeft, Plus, Repeat, Play, Trash2,
} from 'lucide-react'
import { Button, Modal } from '@/components/ui'
import { useRecurringList, useUpdateRecurring, useDeleteRecurring, useProcessRecurring } from '../hooks/useRecurring'
import RecurringList from '../components/RecurringList'

export default function RecurringListPage() {
  const navigate = useNavigate()
  const [showActive, setShowActive] = useState<boolean | null>(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data, isLoading, refetch } = useRecurringList(showActive !== null ? { is_active: showActive } : undefined)
  const toggleMutation = useUpdateRecurring()
  const deleteMutation = useDeleteRecurring()
  const processMutation = useProcessRecurring()

  const recurring = data?.recurring ?? []

  const handleToggleActive = async (id: string, isActive: boolean) => {
    await toggleMutation.mutateAsync({ id, data: { is_active: isActive } })
    refetch()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await deleteMutation.mutateAsync(deleteId)
    setDeleteId(null)
  }

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-purple-200/20 dark:bg-purple-500/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-200/20 dark:bg-blue-500/5 blur-3xl" />
      </div>

      <div className="relative space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/transactions')}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                Transacciones Recurrentes
                <span className="inline-flex items-center justify-center h-6 px-2 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 text-xs font-medium text-gray-500">
                  {isLoading ? '...' : data?.total ?? 0}
                </span>
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Patrones de transacciones que se repiten automaticamente
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
            onClick={() => processMutation.mutate()}
            isLoading={processMutation.isPending}
              className="rounded-xl"
            >
              <Play className="h-4 w-4 mr-2" />
              Procesar Ahora
            </Button>
            <Button
              onClick={() => navigate('/transactions/recurring/new')}
              className="rounded-xl shadow-lg shadow-primary-500/20"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Patron
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          {[
            { value: true, label: 'Activos' },
            { value: null, label: 'Todos' },
            { value: false, label: 'Inactivos' },
          ].map((opt) => (
            <button
              key={String(opt.value)}
              onClick={() => setShowActive(opt.value)}
              className={cn(
                'rounded-xl px-4 py-2 text-sm font-medium transition-all',
                showActive === opt.value
                  ? 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border border-gray-200/50 dark:border-gray-700/50 text-primary-600 dark:text-primary-400'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <RecurringList recurring={[]} isLoading onToggleActive={() => {}} onDelete={() => {}} />
        ) : recurring.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-200/30 to-primary-400/10 rounded-full blur-2xl" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 shadow-xl">
                <Repeat className="h-9 w-9 text-purple-500" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No hay patrones recurrentes
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm mb-6">
              Crea tu primer patron para automatizar transacciones que se repiten periodicamente.
            </p>
            <Button onClick={() => navigate('/transactions/recurring/new')} className="rounded-xl shadow-lg shadow-primary-500/20">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Patron Recurrente
            </Button>
          </div>
        ) : (
          <RecurringList
            recurring={recurring}
            onToggleActive={handleToggleActive}
            onDelete={(id) => setDeleteId(id)}
          />
        )}
      </div>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} size="sm">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/10">
              <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Eliminar Patron</h3>
              <p className="text-sm text-gray-500">Esta accion no afecta las transacciones ya creadas.</p>
            </div>
          </div>
          <div className="flex gap-3 justify-end mt-6">
            <Button variant="outline" onClick={() => setDeleteId(null)} className="rounded-xl">Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete} isLoading={deleteMutation.isPending} className="rounded-xl">
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
