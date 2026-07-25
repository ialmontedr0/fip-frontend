import { useParams, useNavigate } from 'react-router-dom'
import BudgetForm from '../components/BudgetForm'
import { useBudget, useUpdateBudget } from '../hooks/useBudgets'
import type { CreateBudgetRequest } from '@/types/budgets'

function EditPageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto animate-pulse">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-9 h-9 rounded-xl bg-gray-200 dark:bg-gray-700" />
        <div className="space-y-2">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6 space-y-4">
            <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="space-y-2">
                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-xl" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        Presupuesto no encontrado
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        El presupuesto que buscas no existe o fue eliminado.
      </p>
      <button
        type="button"
        onClick={() => navigate('/budgets')}
        className="px-4 py-2 text-sm font-medium text-white bg-violet-500 rounded-lg hover:bg-violet-600 transition-colors"
      >
        Volver a presupuestos
      </button>
    </div>
  )
}

export default function BudgetEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: budget, isLoading } = useBudget(id)
  const updateMutation = useUpdateBudget()

  if (isLoading) return <EditPageSkeleton />
  if (!budget) return <NotFound />

  const handleSubmit = async (data: CreateBudgetRequest) => {
    await updateMutation.mutateAsync({ id: id!, data })
    navigate(`/budgets/${id}`)
  }

  const defaultValues = {
    name: budget.name,
    amount: budget.amount,
    budget_type: budget.budget_type as 'total' | 'category' | 'account',
    period: budget.period as 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly',
    start_date: budget.start_date,
    end_date: budget.end_date,
    category_id: budget.category_id,
    account_id: budget.account_id,
    alert_threshold: budget.alert_threshold,
    alert_enabled: budget.alert_enabled,
    auto_adjust: budget.auto_adjust,
    rollover: budget.rollover,
    strategy: budget.strategy || null,
    description: budget.description,
    icon: budget.icon,
    color: budget.color,
  }

  return (
    <BudgetForm
      mode="edit"
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      isLoading={updateMutation.isPending}
      onCancel={() => navigate(`/budgets/${id}`)}
    />
  )
}
