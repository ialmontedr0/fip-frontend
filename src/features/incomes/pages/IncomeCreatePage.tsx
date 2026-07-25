import { useNavigate } from 'react-router-dom'
import IncomeForm from '../components/IncomeForm'
import { useCreateIncome } from '../hooks/useIncomes'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui'
import type { CreateIncomeRequest, UpdateIncomeRequest } from '@/types/incomes'

export default function IncomeCreatePage() {
  const navigate = useNavigate()
  const createMutation = useCreateIncome()

  const handleSubmit = (data: CreateIncomeRequest | UpdateIncomeRequest) => {
    createMutation.mutate(data as CreateIncomeRequest, {
      onSuccess: (res) => {
        navigate(`/incomes/${res.data.id}`)
      },
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-6 text-white">
        <div className="relative flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/incomes')}
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Nuevo Ingreso</h1>
            <p className="text-emerald-100 text-sm mt-1">Registra un nuevo ingreso</p>
          </div>
        </div>
      </div>

      <IncomeForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/incomes')}
        isSubmitting={createMutation.isPending}
        mode="create"
      />
    </div>
  )
}
