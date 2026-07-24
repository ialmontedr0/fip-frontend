import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useCreateRecurring } from '../hooks/useRecurring'
import RecurringForm from '../components/RecurringForm'
import type { CreateRecurringRequest } from '@/types/transactions'

export default function RecurringCreatePage() {
  const navigate = useNavigate()
  const createRecurring = useCreateRecurring()

  const handleSubmit = async (data: CreateRecurringRequest) => {
    await createRecurring.mutateAsync(data)
    navigate('/transactions/recurring')
  }

  return (
    <div className="relative max-w-2xl mx-auto pb-8">
      {/* Background decorations */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-purple-200/20 to-blue-200/10 blur-3xl dark:from-purple-500/10 dark:to-blue-500/5" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-primary-200/10 to-purple-200/10 blur-3xl dark:from-primary-500/5 dark:to-purple-500/5" />
      </div>

      {/* Header */}
      <div className="relative flex items-center gap-3 mb-6 animate-fade-in">
        <button onClick={() => navigate('/transactions/recurring')} className="rounded-xl p-2.5 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-2.5 w-2.5 rounded-full bg-purple-500 shadow-[0_0_12px_rgba(147,51,234,0.5)]" />
              <div className="absolute -inset-1 animate-ping rounded-full bg-purple-400/30" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Nuevo Patron Recurrente
            </h1>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 ml-5">
            Configura una transaccion que se repita automaticamente
          </p>
        </div>
      </div>

      {/* Glass card */}
      <div
        className="relative overflow-hidden rounded-2xl border border-gray-100/80 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-gray-800/80 dark:bg-gray-900/80 animate-fade-in"
        style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400" />
        <div className="relative">
          <RecurringForm
            onSubmit={handleSubmit}
            isLoading={createRecurring.isPending}
          />
        </div>
      </div>
    </div>
  )
}
