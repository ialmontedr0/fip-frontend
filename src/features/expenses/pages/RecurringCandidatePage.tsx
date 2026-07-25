import { useRecurringCandidates } from '../hooks/useExpenses'
import { useCreateService } from '../hooks/useServices'
import RecurringCandidateCard from '../components/RecurringCandidateCard'
import ExpenseNav from '../components/ExpenseNav'
import EmptyExpenseState from '../components/EmptyExpenseState'
import { Button, Skeleton } from '@/components/ui'
import { Sparkles, AlertCircle } from 'lucide-react'
import type { CreateServiceRequest } from '@/types/expenses'
import type { RecurringCandidatesResponse } from '@/types/expenses'

type Candidate = RecurringCandidatesResponse['candidates'][0]

export default function RecurringCandidatePage() {
  const { data: candidatesResponse, isLoading, isError, refetch } = useRecurringCandidates()
  const createService = useCreateService()

  const handleCreateAsService = (candidate: Candidate) => {
    const data: CreateServiceRequest = {
      name: candidate.description || 'Servicio recurrente',
      service_type: 'other',
      estimated_amount: candidate.amount || '',
      notes: `Creado desde sugerencia automatica. ${candidate.occurrences} ocurrencias.`,
    }
    createService.mutate(data)
  }

  const handleDismiss = (_id: string) => {
    // Mark as dismissed
  }

  const candidates = candidatesResponse?.candidates || []

  return (
    <div className="space-y-5 animate-fade-in">
      <ExpenseNav />

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-600 p-6 text-white">
        <div className="relative flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Sugerencias de Gastos Recurrentes</h1>
            <p className="text-indigo-100/80 text-sm">Detectamos patrones de gasto que podrian ser servicios</p>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-44 rounded-2xl" />)}
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
          <p className="text-red-500 font-medium">Error al obtener sugerencias</p>
          <Button variant="outline" onClick={() => refetch()} className="rounded-xl mt-2">Reintentar</Button>
        </div>
      )}

      {!isLoading && !isError && candidates.length === 0 && <EmptyExpenseState variant="recurring" />}

      {!isLoading && !isError && candidates.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {candidates.map((candidate: Candidate, i: number) => (
            <RecurringCandidateCard
              key={candidate.id || candidate.description || i}
              candidate={candidate}
              onCreateAsService={handleCreateAsService}
              onDismiss={handleDismiss}
            />
          ))}
        </div>
      )}
    </div>
  )
}
