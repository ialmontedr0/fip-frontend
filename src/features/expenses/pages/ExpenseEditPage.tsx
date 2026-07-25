import { useParams, useNavigate } from 'react-router-dom'
import { useExpense, useUpdateExpense } from '../hooks/useExpenses'
import ExpenseForm from '../components/ExpenseForm'
import { Button, Skeleton } from '@/components/ui'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import type { CreateExpenseRequest } from '@/types/expenses'

export default function ExpenseEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: expense, isLoading, isError, refetch } = useExpense(id || '')
  const updateMutation = useUpdateExpense()

  if (isLoading) {
    return (
      <div className="space-y-4 animate-fade-in">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
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
        <Button variant="outline" onClick={() => refetch()} className="rounded-xl mt-2">Reintentar</Button>
      </div>
    )
  }

  const handleSubmit = async (data: CreateExpenseRequest) => {
    updateMutation.mutate({ id: expense.id, data }, {
      onSuccess: () => navigate(`/expenses/${expense.id}`),
    })
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 via-red-500 to-orange-600 p-6 text-white">
        <div className="relative flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(`/expenses/${expense.id}`)}
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Editar Gasto</h1>
            <p className="text-rose-100 text-sm mt-1">{expense.description}</p>
          </div>
        </div>
      </div>

      <ExpenseForm
        mode="edit"
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
        defaultValues={expense}
      />
    </div>
  )
}
