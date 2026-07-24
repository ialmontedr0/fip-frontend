import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  ArrowLeft, ArrowLeftRight, Repeat,
} from 'lucide-react'
import { useCreateTransaction } from '../hooks/useTransactions'
import { useCreateTransfer } from '../hooks/useTransfers'
import TransactionForm from '../components/TransactionForm'
import TransferForm from '../components/TransferForm'
import type { CreateTransactionRequest, CreateTransferRequest } from '@/types/transactions'

export default function TransactionCreatePage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'transaction' | 'transfer'>('transaction')

  const createTransaction = useCreateTransaction()
  const createTransfer = useCreateTransfer()

  const handleCreateTransaction = async (data: CreateTransactionRequest) => {
    const result = await createTransaction.mutateAsync(data)
    navigate(`/transactions/${result.data.id}`)
  }

  const handleCreateTransfer = async (data: CreateTransferRequest) => {
    const result = await createTransfer.mutateAsync(data)
    navigate(`/transactions/${result.data.source_transaction.id}`)
  }

  return (
    <div className="relative max-w-2xl mx-auto pb-8">
      {/* Background decorations */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-emerald-200/20 to-emerald-300/10 blur-3xl dark:from-emerald-500/10 dark:to-emerald-500/5" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-primary-200/20 to-purple-200/10 blur-3xl dark:from-primary-500/10 dark:to-purple-500/5" />
      </div>

      {/* Header */}
      <div className="relative flex items-center gap-3 mb-6 animate-fade-in">
        <button onClick={() => navigate(-1)} className="rounded-xl p-2.5 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-2.5 w-2.5 rounded-full bg-primary-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
              <div className="absolute -inset-1 animate-ping rounded-full bg-primary-400/30" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {mode === 'transaction' ? 'Nueva Transaccion' : 'Nueva Transferencia'}
            </h1>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 ml-5">
            {mode === 'transaction'
              ? 'Registra un ingreso, gasto o ajuste'
              : 'Transfiere dinero entre tus cuentas'}
          </p>
        </div>
      </div>

      {/* Mode toggle */}
      <div className="relative mb-6">
        <div className="inline-flex rounded-2xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 p-1">
          <button
            onClick={() => setMode('transaction')}
            className={cn(
              'flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-medium transition-all',
              mode === 'transaction'
                ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300',
            )}
          >
            <ArrowLeftRight className="h-4 w-4" />
            Transaccion
          </button>
          <button
            onClick={() => setMode('transfer')}
            className={cn(
              'flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-medium transition-all',
              mode === 'transfer'
                ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300',
            )}
          >
            <Repeat className="h-4 w-4" />
            Transferencia
          </button>
        </div>
      </div>

      {/* Glass card container */}
      <div
        className="relative overflow-hidden rounded-2xl border border-gray-100/80 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-gray-800/80 dark:bg-gray-900/80 animate-fade-in"
        style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
      >
        {/* Gradient accent bar */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-400 via-emerald-400 to-primary-400" />
        <div className="relative">
          {mode === 'transaction' ? (
            <TransactionForm
              onSubmit={handleCreateTransaction}
              isLoading={createTransaction.isPending}
            />
          ) : (
            <TransferForm
              onSubmit={handleCreateTransfer}
              isLoading={createTransfer.isPending}
            />
          )}
        </div>
      </div>
    </div>
  )
}
