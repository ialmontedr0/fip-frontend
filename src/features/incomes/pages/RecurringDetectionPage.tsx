import { useNavigate } from 'react-router-dom'
import { Button, Skeleton } from '@/components/ui'
import { useRecurringCandidates } from '../hooks/useIncomes'
import RecurringCandidatesList from '../components/RecurringCandidatesList'
import EmptyIncomeState from '../components/EmptyIncomeState'
import { ArrowLeft, Repeat, RefreshCw } from 'lucide-react'

export default function RecurringDetectionPage() {
  const navigate = useNavigate()
  const { data, isLoading, isError, refetch } = useRecurringCandidates()

  const handleCreateSchedule = (candidate: { id: string; description: string; amount: string; frequency: string }) => {
    navigate(`/incomes/schedule/new?description=${encodeURIComponent(candidate.description)}&amount=${candidate.amount}&frequency=${candidate.frequency}`)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDismiss = (_candidateId: string) => {
    // Local dismiss - could track in state
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 via-purple-600 to-pink-700 p-6 text-white">
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate('/incomes')}
              className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Repeat className="h-6 w-6" />
            <div>
              <h1 className="text-2xl font-bold">Deteccion de Ingresos Recurrentes</h1>
              <p className="text-purple-100 text-sm mt-1">Encuentra patrones de ingresos que se repiten</p>
            </div>
          </div>
          <Button onClick={() => refetch()} className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-xl backdrop-blur-sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-2xl" />
            ))}
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-red-500 mb-2">Error al detectar patrones recurrentes</p>
          <Button variant="outline" onClick={() => refetch()} className="rounded-xl">Reintentar</Button>
        </div>
      )}

      {!isLoading && !isError && data && (!data.candidates || data.candidates.length === 0) && (
        <EmptyIncomeState type="recurring" />
      )}

      {!isLoading && !isError && data?.candidates && data.candidates.length > 0 && (
        <RecurringCandidatesList
          data={data}
          onCreateSchedule={handleCreateSchedule}
          onDismiss={handleDismiss}
        />
      )}
    </div>
  )
}
