import { useParams, useNavigate } from 'react-router-dom'
import { Button, Skeleton } from '@/components/ui'
import { useIncome, useUpdateIncome } from '../hooks/useIncomes'
import IncomeForm from '../components/IncomeForm'
import IncomeNav from '../components/IncomeNav'
import { ArrowLeft } from 'lucide-react'
import type { UpdateIncomeRequest } from '@/types/incomes'

export default function IncomeEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: income, isLoading, isError, refetch } = useIncome(id)
  const updateMutation = useUpdateIncome()

  const handleSubmit = (data: UpdateIncomeRequest) => {
    if (!id) return
    updateMutation.mutate(
      { id, data },
      { onSuccess: () => navigate(`/incomes/${id}`) },
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    )
  }

  if (isError || !income) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-red-500 mb-2">Error al cargar el ingreso</p>
        <Button variant="outline" onClick={() => refetch()} className="rounded-xl">Reintentar</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <IncomeNav />

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-6 text-white">
        <div className="relative flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(`/incomes/${id}`)}
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Editar Ingreso</h1>
            <p className="text-emerald-100 text-sm mt-1">{income.description}</p>
          </div>
        </div>
      </div>

      <IncomeForm
        defaultValues={{
          account_id: income.account_id,
          amount: parseFloat(income.amount),
          currency_code: income.currency_code,
          description: income.description,
          effective_date: income.effective_date,
          category_id: income.category_id || undefined,
          subcategory_id: income.subcategory_id || undefined,
          income_type: income.income_type,
          income_status: income.income_status,
          stability: income.stability,
          income_source_id: income.income_source_id || undefined,
          employer_name: income.employer_name || undefined,
          employer_tax_id: (income as { employer_tax_id: string | null }).employer_tax_id || undefined,
          gross_amount: income.gross_amount ? parseFloat(income.gross_amount) : undefined,
          tax_withheld: income.tax_withheld ? parseFloat(income.tax_withheld) : undefined,
          net_amount: income.net_amount ? parseFloat(income.net_amount) : undefined,
          frequency: income.frequency || undefined,
          notes: income.notes || undefined,
          tags: income.tags || [],
        }}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/incomes/${id}`)}
        isSubmitting={updateMutation.isPending}
        mode="edit"
      />
    </div>
  )
}
