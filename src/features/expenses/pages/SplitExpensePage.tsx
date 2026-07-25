import { useNavigate } from 'react-router-dom'
import { useCreateSplitExpense } from '../hooks/useExpenses'
import SplitExpenseCreator from '../components/SplitExpenseCreator'
import ExpenseNav from '../components/ExpenseNav'
import { Button } from '@/components/ui'
import { ArrowLeft, Divide } from 'lucide-react'

export default function SplitExpensePage() {
  const navigate = useNavigate()
  const splitMutation = useCreateSplitExpense()

  const handleSubmit = async (data: { total_amount: string; description: string; effective_date: string; splits: Array<{ amount: string; description: string; account_id?: string | null }> }) => {
    splitMutation.mutate({ ...data, account_id: '' }, {
      onSuccess: () => navigate('/expenses'),
    })
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <ExpenseNav />

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600 p-6 text-white">
        <div className="relative flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/expenses')}
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm">
              <Divide className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Gasto Dividido</h1>
              <p className="text-indigo-100 text-sm mt-1">Divide un gasto entre varias cuentas</p>
            </div>
          </div>
        </div>
      </div>

      <SplitExpenseCreator onSubmit={handleSubmit} isSubmitting={splitMutation.isPending} />
    </div>
  )
}
