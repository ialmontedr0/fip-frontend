import { useState } from 'react'
import { CreditCard, Plus, Trash2, Edit2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button, Skeleton } from '@/components/ui'
import { useDebitCardList, useCreateDebitCard, useUpdateDebitCard, useDeleteDebitCard } from '../hooks/useDebitCards'
import DebitCardForm from './DebitCardForm'
import type { CreateDebitCardRequest } from '@/types/debitCards'
import toast from 'react-hot-toast'

interface Props {
  accountId: string
}

export default function DebitCardSection({ accountId }: Props) {
  const { data, isLoading } = useDebitCardList(accountId)
  const createMutation = useCreateDebitCard()
  const updateMutation = useUpdateDebitCard()
  const deleteMutation = useDeleteDebitCard()

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const cards = data?.debit_cards || []
  const editingCard = editingId ? cards.find((c) => c.id === editingId) : undefined

  const handleCreate = async (formData: CreateDebitCardRequest) => {
    await createMutation.mutateAsync(formData)
    toast.success('Tarjeta de debito agregada')
    setShowForm(false)
  }

  const handleUpdate = async (formData: CreateDebitCardRequest) => {
    if (!editingId) return
    await updateMutation.mutateAsync({ id: editingId, data: formData })
    toast.success('Tarjeta de debito actualizada')
    setEditingId(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminar esta tarjeta de debito?')) return
    await deleteMutation.mutateAsync(id)
    toast.success('Tarjeta de debito eliminada')
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-100/80 bg-white/80 p-6 backdrop-blur-xl shadow-sm dark:border-gray-800/80 dark:bg-gray-900/80">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-400 via-purple-400 to-violet-400" />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Tarjetas de Debito
          </h3>
          {!showForm && !editingId && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowForm(true)}
              className="rounded-xl text-xs h-8"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Agregar
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 rounded-xl" />
          </div>
        ) : cards.length === 0 && !showForm && !editingId ? (
          <div className="py-6 text-center">
            <CreditCard className="h-8 w-8 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
            <p className="text-sm text-gray-400 dark:text-gray-500">No hay tarjetas de debito vinculadas</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cards.map((card) => (
              <div
                key={card.id}
                className={cn(
                  'flex items-center justify-between rounded-xl border border-gray-100 dark:border-gray-700/50 p-3 transition-all',
                  'bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800',
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', card.color || 'bg-gray-200')}>
                    <CreditCard className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{card.name}</p>
                    <p className="text-xs text-gray-400">
                      {card.card_network ? `${card.card_network.toUpperCase()} ` : ''}
                      {card.last_four_digits ? `****${card.last_four_digits}` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setEditingId(card.id)}
                    className="rounded-lg p-1.5 text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-all"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(card.id)}
                    className="rounded-lg p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {(showForm || editingId) && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
              {editingId ? 'Editar Tarjeta' : 'Nueva Tarjeta de Debito'}
            </h4>
            <DebitCardForm
              accountId={accountId}
              initialData={editingCard}
              onSubmit={editingId ? handleUpdate : handleCreate}
              onCancel={() => { setShowForm(false); setEditingId(null) }}
              loading={createMutation.isPending || updateMutation.isPending}
            />
          </div>
        )}
      </div>
    </div>
  )
}
