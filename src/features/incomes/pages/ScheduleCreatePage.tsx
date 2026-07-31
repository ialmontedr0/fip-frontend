import { useNavigate } from 'react-router-dom'
import IncomeScheduleForm from '../components/IncomeScheduleForm'
import IncomeNav from '../components/IncomeNav'
import { useCreateSchedule } from '../hooks/useSchedules'
import { ArrowLeft, CalendarDays } from 'lucide-react'
import { Button } from '@/components/ui'
import type { CreateScheduleRequest, UpdateScheduleRequest } from '@/types/incomes'

export default function ScheduleCreatePage() {
  const navigate = useNavigate()
  const createMutation = useCreateSchedule()

  const handleSubmit = (data: CreateScheduleRequest | UpdateScheduleRequest) => {
    createMutation.mutate(data as CreateScheduleRequest, {
      onSuccess: () => navigate('/incomes/schedule'),
    })
  }

  return (
    <div className="space-y-6">
      <IncomeNav />

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 p-6 text-white">
        <div className="relative flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/incomes/schedule')}
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <CalendarDays className="h-6 w-6" />
            <div>
              <h1 className="text-2xl font-bold">Nueva Programacion</h1>
              <p className="text-blue-100 text-sm mt-1">Programa un ingreso futuro</p>
            </div>
          </div>
        </div>
      </div>

      <IncomeScheduleForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/incomes/schedule')}
        isSubmitting={createMutation.isPending}
        mode="create"
      />
    </div>
  )
}
