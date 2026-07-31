import { useState } from 'react'
import {
  useCreditCards,
  useCardsSummary,
  useCreateCard,
  useUpdateCard,
  useDeleteCard,
} from '../hooks/useCreditCards'
import CreditCardCard from '../components/CreditCardCard'
import CreditCardForm from '../components/CreditCardForm'
import UtilizationGauge from '../components/UtilizationGauge'
import ExpenseNav from '../components/ExpenseNav'
import EmptyExpenseState from '../components/EmptyExpenseState'
import { Button, Skeleton, Modal } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'
import { CreditCard, Plus, BarChart3 } from 'lucide-react'
import type { CreditCardResponse, CreateCreditCardRequest } from '@/types/expenses'

export default function CreditCardListPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [editingCard, setEditingCard] = useState<CreditCardResponse | null>(null)

  const { data: cards, isLoading, isError, refetch } = useCreditCards()
  const { data: summary } = useCardsSummary()
  const createMutation = useCreateCard()
  const updateMutation = useUpdateCard()
  const deleteMutation = useDeleteCard()

  const handleCreate = async (data: CreateCreditCardRequest) => {
    createMutation.mutate(data, { onSuccess: () => setFormOpen(false) })
  }

  const handleUpdate = async (data: CreateCreditCardRequest) => {
    if (!editingCard) return
    updateMutation.mutate({ id: editingCard.id, data }, { onSuccess: () => setEditingCard(null) })
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Eliminar esta tarjeta?')) deleteMutation.mutate(id)
  }

  const totalLimit = Number(summary?.total_credit_limit || 0)
  const totalBalance = Number(summary?.total_used || 0)

  return (
    <div className="space-y-5 animate-fade-in">
      <ExpenseNav />

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-700 via-slate-800 to-gray-900 p-6 text-white">
        <div className="relative flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Tarjetas de Credito</h1>
              <p className="text-gray-300 text-sm">Administra tus tarjetas y estados de cuenta</p>
            </div>
          </div>
          <Button onClick={() => setFormOpen(true)} className="bg-white text-gray-800 hover:bg-white/90 border-0 rounded-xl shadow-lg shadow-black/10 w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" /> Nueva Tarjeta
          </Button>
        </div>
      </div>

      {summary && (
        <div className="rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 p-5">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex items-center justify-center">
              <UtilizationGauge used={totalBalance} limit={totalLimit} />
            </div>
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400">Limite Total</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{formatCurrency(totalLimit)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400">Balance Total</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{formatCurrency(totalBalance)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400">Disponible</p>
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(totalLimit - totalBalance)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <BarChart3 className="h-8 w-8 text-red-500 mb-2" />
          <p className="text-red-500 font-medium">Error al cargar tarjetas</p>
          <Button variant="outline" onClick={() => refetch()} className="rounded-xl mt-2">Reintentar</Button>
        </div>
      )}

      {!isLoading && !isError && cards?.cards?.length === 0 && <EmptyExpenseState variant="cards" />}

      {!isLoading && !isError && cards && cards.cards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.cards.map((card) => (
            <CreditCardCard
              key={card.id}
              card={card}
              onEdit={setEditingCard}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Modal isOpen={formOpen || !!editingCard} onClose={() => { setFormOpen(false); setEditingCard(null) }} title={editingCard ? 'Editar Tarjeta' : 'Nueva Tarjeta'}>
        <CreditCardForm
          onSubmit={editingCard ? handleUpdate : handleCreate}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          initialData={editingCard ? { name: editingCard.name, credit_limit: editingCard.credit_limit || '', last_four_digits: editingCard.last_four_digits, color: editingCard.color, is_active: editingCard.is_active } : undefined}
        />
      </Modal>
    </div>
  )
}
