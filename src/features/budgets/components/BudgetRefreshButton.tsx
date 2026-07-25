import { RefreshCw } from 'lucide-react'
import { useRefreshBudget } from '../hooks/useBudgets'
import { useState } from 'react'

interface BudgetRefreshButtonProps {
  budgetId: string
  size?: 'sm' | 'md'
}

export default function BudgetRefreshButton({ budgetId, size = 'sm' }: BudgetRefreshButtonProps) {
  const refreshMutation = useRefreshBudget()
  const [spinning, setSpinning] = useState(false)

  const handleRefresh = async () => {
    setSpinning(true)
    try {
      await refreshMutation.mutateAsync(budgetId)
    } finally {
      setSpinning(false)
    }
  }

  const sizeClasses = size === 'sm' ? 'p-1.5 text-xs' : 'p-2 text-sm'

  return (
    <button
      type="button"
      onClick={handleRefresh}
      disabled={refreshMutation.isPending}
      className={`inline-flex items-center gap-1.5 font-medium rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses}`}
      title="Recalcular con gastos reales"
    >
      <RefreshCw className={`h-3.5 w-3.5 ${spinning ? 'animate-spin' : ''}`} />
      <span>Actualizar</span>
    </button>
  )
}
