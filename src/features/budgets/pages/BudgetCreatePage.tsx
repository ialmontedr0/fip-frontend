import { useNavigate } from 'react-router-dom'
import BudgetForm from '../components/BudgetForm'
import { useCreateBudget } from '../hooks/useBudgets'
import type { CreateBudgetRequest } from '@/types/budgets'

export default function BudgetCreatePage() {
  const navigate = useNavigate()
  const createMutation = useCreateBudget()

  const handleSubmit = async (data: CreateBudgetRequest) => {
    await createMutation.mutateAsync(data)
    navigate('/budgets')
  }

  return (
    <BudgetForm
      mode="create"
      onSubmit={handleSubmit}
      isLoading={createMutation.isPending}
    />
  )
}
