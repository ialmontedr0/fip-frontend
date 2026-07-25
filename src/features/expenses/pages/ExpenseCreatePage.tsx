import { useNavigate } from 'react-router-dom'
import ExpenseForm from '../components/ExpenseForm'
import { useCreateExpense } from '../hooks/useExpenses'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui'
import type { CreateExpenseRequest } from '@/types/expenses'

export default function ExpenseCreatePage() {
  const navigate = useNavigate()
  const createMutation = useCreateExpense()

  const handleSubmit = async (data: CreateExpenseRequest) => {
    createMutation.mutate(data, {
      onSuccess: (res) => {
        navigate(`/expenses/${res.data.id}`)
      },
    })
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 via-red-500 to-orange-600 p-6 text-white">
        <div className="relative flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/expenses')}
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Nuevo Gasto</h1>
            <p className="text-rose-100 text-sm mt-1">Registra un nuevo gasto</p>
          </div>
        </div>
      </div>

      <ExpenseForm
        mode="create"
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
      />
    </div>
  )
}
