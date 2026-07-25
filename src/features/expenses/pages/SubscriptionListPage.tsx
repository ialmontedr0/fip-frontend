import { useState } from 'react'
import {
  useSubscriptions,
  useSubscriptionSummary,
  useDeleteSubscription,
} from '../hooks/useSubscriptions'
import SubscriptionCard from '../components/SubscriptionCard'
import SubscriptionSummaryCard from '../components/SubscriptionSummary'
import ExpenseNav from '../components/ExpenseNav'
import EmptyExpenseState from '../components/EmptyExpenseState'
import { Button, Skeleton, Modal } from '@/components/ui'
import { Repeat, AlertCircle, Plus } from 'lucide-react'
import type { SubscriptionResponse } from '@/types/expenses'

export default function SubscriptionListPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [editingSub, setEditingSub] = useState<SubscriptionResponse | null>(null)

  const { data: subscriptions, isLoading, isError, refetch } = useSubscriptions()
  const { data: summary, isLoading: summaryLoading } = useSubscriptionSummary()
  const deleteMutation = useDeleteSubscription()

  const handleDelete = (id: string) => {
    if (window.confirm('Eliminar esta suscripcion?')) deleteMutation.mutate(id)
  }

  const subList = subscriptions?.subscriptions || []

  return (
    <div className="space-y-5 animate-fade-in">
      <ExpenseNav />

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-600 p-6 text-white">
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm">
              <Repeat className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Suscripciones</h1>
              <p className="text-indigo-100/80 text-sm">Controla tus suscripciones activas</p>
            </div>
          </div>
          <Button onClick={() => setFormOpen(true)} className="bg-white text-indigo-700 hover:bg-white/90 border-0 rounded-xl shadow-lg shadow-black/10">
            <Plus className="h-4 w-4 mr-2" /> Nueva Suscripcion
          </Button>
        </div>
      </div>

      <SubscriptionSummaryCard summary={summary} isLoading={summaryLoading} />

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-44 rounded-2xl" />)}
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
          <p className="text-red-500 font-medium">Error al cargar suscripciones</p>
          <Button variant="outline" onClick={() => refetch()} className="rounded-xl mt-2">Reintentar</Button>
        </div>
      )}

      {!isLoading && !isError && subList.length === 0 && <EmptyExpenseState variant="subscriptions" />}

      {!isLoading && !isError && subList.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subList.map((sub) => (
            <SubscriptionCard
              key={sub.id}
              subscription={sub}
              onEdit={setEditingSub}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Modal isOpen={formOpen || !!editingSub} onClose={() => { setFormOpen(false); setEditingSub(null) }} title={editingSub ? 'Editar Suscripcion' : 'Nueva Suscripcion'}>
        <div className="space-y-4">
          {editingSub ? (
            <p className="text-sm text-gray-500">Editar funcionalidad pendiente</p>
          ) : (
            <p className="text-sm text-gray-500">Crear funcionalidad pendiente</p>
          )}
        </div>
      </Modal>
    </div>
  )
}
