import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button, Skeleton } from '@/components/ui'
import { useTransaction, useUpdateTransaction } from '../hooks/useTransactions'
import TransactionForm from '../components/TransactionForm'
import type { CreateTransactionRequest } from '@/types/transactions'

export default function TransactionEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: transaction, isLoading } = useTransaction(id)
  const updateTransaction = useUpdateTransaction()

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto pb-8">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <p className="text-gray-500 dark:text-gray-400 mb-4">Transaccion no encontrada</p>
        <Button variant="outline" onClick={() => navigate('/transactions')} className="rounded-xl">
          Volver a Transacciones
        </Button>
      </div>
    )
  }

  const handleSubmit = async (data: CreateTransactionRequest) => {
    await updateTransaction.mutateAsync({ id: transaction.id, data })
    navigate(`/transactions/${transaction.id}`)
  }

  return (
    <div className="relative max-w-2xl mx-auto pb-8">
      {/* Background decorations */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-primary-200/20 to-purple-200/10 blur-3xl dark:from-primary-500/10 dark:to-purple-500/5" />
      </div>

      {/* Header */}
      <div className="relative flex items-center gap-3 mb-6 animate-fade-in">
        <button onClick={() => navigate(`/transactions/${transaction.id}`)} className="rounded-xl p-2.5 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-2.5 w-2.5 rounded-full bg-primary-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
              <div className="absolute -inset-1 animate-ping rounded-full bg-primary-400/30" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Editar Transaccion
            </h1>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 ml-5">
            {transaction.description}
          </p>
        </div>
      </div>

      {/* Glass card */}
      <div
        className="relative overflow-hidden rounded-2xl border border-gray-100/80 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-gray-800/80 dark:bg-gray-900/80 animate-fade-in"
        style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-400 via-amber-400 to-primary-400" />
        <div className="relative">
          <TransactionForm
            defaultValues={transaction}
            onSubmit={handleSubmit}
            isLoading={updateTransaction.isPending}
            isEdit
          />
        </div>
      </div>
    </div>
  )
}
